import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeaveEligibilityGender, LeaveStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

type AuthenticatedUser = {
  sub: string;
  role: GraphqlTypes.Role;
};

type LeaveRow = {
  id: string;
  userId: string;
  managerId: string | null;
  leaveTypeId: string;
  reason: string;
  fromDate: Date;
  toDate: Date;
  totalDays: unknown;
  status: LeaveStatus;
  comments: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  leaveType: {
    code: string;
    description: string;
    annualAllowance: number;
    eligibilityGender: LeaveEligibilityGender;
  };
};

const MAX_CONTINUOUS_WORKING_DAYS = 3;

@Injectable()
export class LeaveService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllLeaves(
    user: AuthenticatedUser,
    pagination: { offset: number; limit: number },
    status?: GraphqlTypes.LeaveStatus,
    search?: string,
  ): Promise<GraphqlTypes.LeaveListResponse> {
    this.assertAdmin(user.role);

    const { offset, limit } = pagination;
    const normalizedSearch = search?.trim();
    const where = {
      isDeleted: false,
      ...(status ? { status: status as unknown as LeaveStatus } : {}),
      ...(normalizedSearch
        ? {
            user: {
              isDeleted: false,
              OR: [
                { firstName: { contains: normalizedSearch, mode: 'insensitive' as const } },
                { lastName: { contains: normalizedSearch, mode: 'insensitive' as const } },
              ],
            },
          }
        : {}),
    };

    const [records, totalCount] = await this.prismaService.$transaction([
      this.prismaService.leaveApplication.findMany({
        where,
        include: {
          leaveType: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      this.prismaService.leaveApplication.count({ where }),
    ]);

    return {
      results: records.map((record) => this.toGraphqlLeaveRequest(record as unknown as LeaveRow)),
      totalCount,
    };
  }

  async getTeamLeaves(
    user: AuthenticatedUser,
    pagination: { offset: number; limit: number },
    status?: GraphqlTypes.LeaveStatus,
  ): Promise<GraphqlTypes.LeaveListResponse> {
    this.assertManager(user.role);

    const { offset, limit } = pagination;
    const where = {
      isDeleted: false,
      ...(status ? { status: status as unknown as LeaveStatus } : {}),
      OR: [
        { managerId: user.sub },
        {
          user: {
            managerId: user.sub,
            isDeleted: false,
          },
        },
      ],
    };

    const [records, totalCount] = await this.prismaService.$transaction([
      this.prismaService.leaveApplication.findMany({
        where,
        include: {
          leaveType: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      this.prismaService.leaveApplication.count({ where }),
    ]);

    return {
      results: records.map((record) => this.toGraphqlLeaveRequest(record as unknown as LeaveRow)),
      totalCount,
    };
  }

  async getMyLeaves(
    user: AuthenticatedUser,
    pagination: { offset: number; limit: number },
  ): Promise<GraphqlTypes.LeaveListResponse> {
    this.assertEmployee(user.role);

    const { offset, limit } = pagination;
    const [records, totalCount] = await this.prismaService.$transaction([
      this.prismaService.leaveApplication.findMany({
        where: {
          userId: user.sub,
          isDeleted: false,
        },
        include: {
          leaveType: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      this.prismaService.leaveApplication.count({
        where: {
          userId: user.sub,
          isDeleted: false,
        },
      }),
    ]);

    return {
      results: records.map((record) => this.toGraphqlLeaveRequest(record as unknown as LeaveRow)),
      totalCount,
    };
  }

  async createLeave(
    user: AuthenticatedUser,
    input: GraphqlTypes.CreateLeaveInput,
  ): Promise<GraphqlTypes.LeaveRequest> {
    this.assertEmployee(user.role);

    const leaveTypeCode = input.leaveTypeCode?.trim().toUpperCase();
    const reason = input.reason?.trim();
    const fromDate = this.toDayStartDate(input.fromDate as unknown as string);
    const toDate = this.toDayStartDate(input.toDate as unknown as string);

    if (!leaveTypeCode || !reason) {
      throw new BadRequestException('leaveTypeCode and reason are required');
    }

    if (!['EL', 'AH'].includes(leaveTypeCode)) {
      throw new BadRequestException('Only Earned Leave (EL) and Additional Leave (AH) are allowed');
    }

    if (toDate < fromDate) {
      throw new BadRequestException('toDate must be on or after fromDate');
    }

    const employee = await this.prismaService.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        managerId: true,
        gender: true,
        isDeleted: true,
        department: {
          select: {
            managerId: true,
            isDeleted: true,
          },
        },
      },
    });

    if (!employee || employee.isDeleted) {
      throw new NotFoundException('Employee not found');
    }

    const effectiveManagerId = employee.managerId ?? employee.department?.managerId ?? null;

    if (!effectiveManagerId) {
      throw new BadRequestException('Employee is not assigned to any manager');
    }

    const leaveType = await this.prismaService.leaveTypes.findFirst({
      where: {
        code: leaveTypeCode,
        isDeleted: false,
      },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type ${leaveTypeCode} not configured`);
    }

    if (
      leaveType.eligibilityGender === LeaveEligibilityGender.FemaleOnly &&
      employee.gender !== 'Female'
    ) {
      throw new ForbiddenException(`${leaveType.code} is available only for female employees`);
    }

    const holidays = await this.prismaService.publicHolidays.findMany({
      where: {
        isDeleted: false,
        holidayDate: {
          gte: fromDate,
          lte: toDate,
        },
      },
      select: {
        holidayDate: true,
      },
    });

    const holidayKeys = new Set(holidays.map((holiday) => this.toDateKey(holiday.holidayDate)));
    const workingDays = this.countWorkingDays(fromDate, toDate, holidayKeys);

    if (workingDays <= 0) {
      throw new BadRequestException('Selected range has no working days');
    }

    if (workingDays > MAX_CONTINUOUS_WORKING_DAYS) {
      throw new BadRequestException(
        'Maximum 3 continuous working days allowed per application. Please split the request.',
      );
    }

    if (leaveTypeCode === 'AH') {
      if (
        fromDate.getUTCFullYear() !== toDate.getUTCFullYear() ||
        fromDate.getUTCMonth() !== toDate.getUTCMonth()
      ) {
        throw new BadRequestException('AH must be applied within the same month');
      }

      if (workingDays > 1) {
        throw new BadRequestException('Only 1 AH leave is allowed per month');
      }

      const monthStart = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), 1));
      const monthEnd = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth() + 1, 0));

      const existingMonthlyAh = await this.prismaService.leaveApplication.aggregate({
        where: {
          userId: user.sub,
          leaveTypeId: leaveType.id,
          isDeleted: false,
          status: {
            in: [LeaveStatus.Pending, LeaveStatus.Approved],
          },
          fromDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          totalDays: true,
        },
      });

      const existingMonthlyAhDays = Number(existingMonthlyAh._sum.totalDays ?? 0);
      if (existingMonthlyAhDays >= 1) {
        throw new BadRequestException('AH already consumned for this month');
      }
    }

    const allowance = Number(leaveType.annualAllowance ?? 0);
    if (allowance <= 0) {
      throw new BadRequestException(`Leave type ${leaveType.code} allowance is not configured`);
    }

    const consumed = await this.prismaService.leaveApplication.aggregate({
      where: {
        userId: user.sub,
        leaveTypeId: leaveType.id,
        isDeleted: false,
        status: {
          in: [LeaveStatus.Pending, LeaveStatus.Approved],
        },
      },
      _sum: {
        totalDays: true,
      },
    });

    const usedDays = Number(consumed._sum.totalDays ?? 0);
    if (usedDays + workingDays > allowance) {
      throw new BadRequestException(`Insufficient ${leaveType.code} balance`);
    }

    const created = await this.prismaService.leaveApplication.create({
      data: {
        userId: user.sub,
        managerId: effectiveManagerId,
        leaveTypeId: leaveType.id,
        reason,
        fromDate,
        toDate,
        totalDays: workingDays,
        status: LeaveStatus.Pending,
      },
      include: {
        leaveType: true,
      },
    });

    return this.toGraphqlLeaveRequest(created as unknown as LeaveRow);
  }

  async cancelLeaveById(
    user: AuthenticatedUser,
    leaveId: string,
  ): Promise<GraphqlTypes.LeaveRequest> {
    this.assertEmployee(user.role);

    const leave = await this.prismaService.leaveApplication.findFirst({
      where: {
        id: leaveId,
        userId: user.sub,
        isDeleted: false,
      },
      include: {
        leaveType: true,
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.status !== LeaveStatus.Pending) {
      throw new BadRequestException('Leave can be cancelled only until manager approval');
    }

    const cancelled = await this.prismaService.leaveApplication.update({
      where: { id: leave.id },
      data: {
        status: LeaveStatus.Cancelled,
        comments: leave.comments ?? 'Cancelled by employee',
      },
      include: {
        leaveType: true,
      },
    });

    return this.toGraphqlLeaveRequest(cancelled as unknown as LeaveRow);
  }

  async reviewLeaveById(
    user: AuthenticatedUser,
    leaveId: string,
    status: GraphqlTypes.LeaveStatus,
    comments?: string,
  ): Promise<GraphqlTypes.LeaveRequest> {
    this.assertManager(user.role);

    if (
      status !== GraphqlTypes.LeaveStatus.Approved &&
      status !== GraphqlTypes.LeaveStatus.Rejected
    ) {
      throw new BadRequestException('Manager can only approve or reject leave requests');
    }

    const leave = await this.prismaService.leaveApplication.findFirst({
      where: {
        id: leaveId,
        isDeleted: false,
        OR: [
          { managerId: user.sub },
          {
            user: {
              managerId: user.sub,
              isDeleted: false,
            },
          },
        ],
      },
      include: {
        leaveType: true,
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave request not found for manager');
    }

    if (leave.status !== LeaveStatus.Pending) {
      throw new BadRequestException('Only pending leave requests can be reviewed');
    }

    const updated = await this.prismaService.leaveApplication.update({
      where: { id: leave.id },
      data: {
        status: status as unknown as LeaveStatus,
        comments:
          comments?.trim() ||
          (status === GraphqlTypes.LeaveStatus.Approved
            ? 'Approved by manager'
            : 'Rejected by manager'),
      },
      include: {
        leaveType: true,
      },
    });

    return this.toGraphqlLeaveRequest(updated as unknown as LeaveRow);
  }

  private assertEmployee(role: GraphqlTypes.Role): void {
    if (role !== GraphqlTypes.Role.Employee) {
      throw new ForbiddenException('Only employees can manage leave requests');
    }
  }

  private assertManager(role: GraphqlTypes.Role): void {
    if (role !== GraphqlTypes.Role.Manager) {
      throw new ForbiddenException('Only managers can access team leave requests');
    }
  }

  private assertAdmin(role: GraphqlTypes.Role): void {
    if (role !== GraphqlTypes.Role.Admin) {
      throw new ForbiddenException('Only admins can access all leave requests');
    }
  }

  private toDayStartDate(value: string): Date {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date value');
    }

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private toDateKey(value: Date): string {
    return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}-${String(
      value.getUTCDate(),
    ).padStart(2, '0')}`;
  }

  private countWorkingDays(fromDate: Date, toDate: Date, holidayKeys: Set<string>): number {
    let current = new Date(fromDate);
    let days = 0;

    while (current <= toDate) {
      const day = current.getUTCDay();
      const key = this.toDateKey(current);
      const isWeekend = day === 0 || day === 6;

      if (!isWeekend && !holidayKeys.has(key)) {
        days += 1;
      }

      current.setUTCDate(current.getUTCDate() + 1);
    }

    return days;
  }

  private toGraphqlLeaveRequest(record: LeaveRow): GraphqlTypes.LeaveRequest {
    return {
      id: record.id,
      userId: record.userId,
      managerId: record.managerId,
      leaveTypeId: record.leaveTypeId,
      leaveTypeCode: record.leaveType.code,
      leaveTypeDescription: record.leaveType.description,
      reason: record.reason,
      fromDate: record.fromDate,
      toDate: record.toDate,
      totalDays: Number(record.totalDays ?? 0),
      status: record.status as unknown as GraphqlTypes.LeaveStatus,
      comments: record.comments,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isDeleted: record.isDeleted,
      canCancel: record.status === LeaveStatus.Pending,
    };
  }
}
