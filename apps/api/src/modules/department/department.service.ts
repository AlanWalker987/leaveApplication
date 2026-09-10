import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import * as GraphqlTypes from '../../graphql-types';

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllDepartments(pagination: {
    offset: number;
    limit: number;
  }): Promise<GraphqlTypes.DepartmentListResponse> {
    const { offset, limit } = pagination;
    const departments = await this.prismaService.department.findMany({
      where: { isDeleted: false },
      skip: offset,
      take: limit,
      include: {
        manager: true,
        employees: true,
      },
    });

    return {
      results: departments.map((department) => this.toGraphqlDepartment(department)),
      totalCount: departments.length,
    };
  }

  async getDepartmentById(id: string): Promise<GraphqlTypes.Department | null> {
    const department = await this.prismaService.department.findUnique({
      where: { id },
      include: {
        manager: true,
        employees: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return this.toGraphqlDepartment(department);
  }

  async createDepartment(
    input: GraphqlTypes.CreateDepartmentInput,
  ): Promise<GraphqlTypes.Department> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('Input is required');
    }

    const name = input.name?.trim();
    const subtitle = input.subtitle?.trim();
    const location = input.location?.trim();
    const managerIdentifier = input.managerId?.trim();

    if (!name || !subtitle || !location || !managerIdentifier) {
      throw new BadRequestException('name, subtitle, location, and managerId are required');
    }

    const existingDepartment = await this.prismaService.department.findFirst({
      where: { name },
    });

    if (existingDepartment) {
      throw new BadRequestException('Department with the same name already exists');
    }

    const managerId = await this.resolveManagerId(managerIdentifier);

    const employeeIds = Array.from(new Set(input.employeeIds?.map((id) => id.trim()) ?? [])).filter(
      Boolean,
    );

    if (employeeIds.length > 0) {
      const employees = await this.prismaService.user.findMany({
        where: {
          id: { in: employeeIds },
          isDeleted: false,
          userRole: 'Employee',
        },
        select: { id: true },
      });

      if (employees.length !== employeeIds.length) {
        throw new BadRequestException('One or more selected employees are invalid.');
      }
    }

    const department = await this.prismaService.department.create({
      data: {
        name,
        subtitle,
        location,
        managerId,
      },
      include: {
        manager: true,
        employees: true,
      },
    });

    if (employeeIds.length > 0) {
      await this.prismaService.user.updateMany({
        where: {
          id: { in: employeeIds },
          userRole: 'Employee',
          isDeleted: false,
        },
        data: {
          departmentId: department.id,
          managerId,
        },
      });
    }

    const departmentWithEmployees = await this.prismaService.department.findUnique({
      where: { id: department.id },
      include: {
        manager: true,
        employees: true,
      },
    });

    if (!departmentWithEmployees) {
      throw new NotFoundException('Department not found');
    }

    return this.toGraphqlDepartment(departmentWithEmployees);
  }

  async updateDepartmentById(
    id: string,
    input: GraphqlTypes.UpdateDepartmentInput,
  ): Promise<GraphqlTypes.Department> {
    const existingDepartment = await this.prismaService.department.findFirst({
      where: { id },
    });

    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }

    const name = input.name?.trim() ?? existingDepartment.name;
    const subtitle = input.subtitle?.trim() ?? existingDepartment.subtitle;
    const location = input.location?.trim() ?? existingDepartment.location;
    let managerId = input.managerId?.trim() ?? existingDepartment.managerId;

    if (input.managerId && input.managerId.trim()) {
      managerId = await this.resolveManagerId(input.managerId.trim());
    }

    const employeeIds =
      input.employeeIds !== undefined
        ? Array.from(
            new Set((input.employeeIds ?? []).map((employeeId) => employeeId.trim())),
          ).filter(Boolean)
        : undefined;

    if (employeeIds && employeeIds.length > 0) {
      const employees = await this.prismaService.user.findMany({
        where: {
          id: { in: employeeIds },
          isDeleted: false,
          userRole: 'Employee',
        },
        select: { id: true },
      });

      if (employees.length !== employeeIds.length) {
        throw new BadRequestException('One or more selected employees are invalid.');
      }
    }

    await this.prismaService.department.update({
      where: { id },
      data: {
        name,
        subtitle,
        location,
        managerId,
      },
      include: {
        manager: true,
        employees: true,
      },
    });

    if (input.managerId && input.managerId.trim()) {
      await this.prismaService.user.updateMany({
        where: {
          departmentId: id,
          userRole: 'Employee',
          isDeleted: false,
        },
        data: {
          managerId,
        },
      });
    }

    if (employeeIds !== undefined) {
      await this.prismaService.user.updateMany({
        where: {
          departmentId: id,
          userRole: 'Employee',
          isDeleted: false,
          id: { notIn: employeeIds },
        },
        data: {
          departmentId: null,
        },
      });

      if (employeeIds.length > 0) {
        await this.prismaService.user.updateMany({
          where: {
            id: { in: employeeIds },
            userRole: 'Employee',
            isDeleted: false,
          },
          data: {
            departmentId: id,
            managerId,
          },
        });
      }
    }

    const departmentWithEmployees = await this.prismaService.department.findUnique({
      where: { id },
      include: {
        manager: true,
        employees: true,
      },
    });

    if (!departmentWithEmployees) {
      throw new NotFoundException('Department not found');
    }

    return this.toGraphqlDepartment(departmentWithEmployees);
  }

  async deleteDepartmentById(id: string): Promise<GraphqlTypes.Department> {
    const existingDepartment = await this.prismaService.department.findFirst({
      where: { id },
    });

    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }

    const deletedDepartment = await this.prismaService.department.update({
      where: { id },
      data: { isDeleted: true },
      include: {
        manager: true,
        employees: true,
      },
    });

    return this.toGraphqlDepartment(deletedDepartment);
  }

  private toGraphqlDepartment(department: {
    id: string;
    name: string;
    subtitle: string;
    location: string;
    managerId: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    manager: PrismaUser;
    employees: PrismaUser[];
  }): GraphqlTypes.Department {
    return {
      ...department,
      manager: this.toGraphqlUser(department.manager),
      employees: department.employees.map((employee) => this.toGraphqlUser(employee)),
    };
  }

  private toGraphqlUser(user: PrismaUser): GraphqlTypes.User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      managerId: user.managerId,
      branchId: user.branchId,
      vendorId: user.vendorId,
      userRole: user.userRole as unknown as GraphqlTypes.Role,
      phoneNumber: user.phoneNumber,
      designation: user.designation,
      dateOfBirth: user.dateOfBirth,
      dateOfJoining: user.dateOfJoining,
      emergencyContactName: user.emergencyContactName,
      emergencyContactNumber: user.emergencyContactNumber,
      createAt: user.createAt,
      updatedAt: user.updatedAt,
      isDeleted: user.isDeleted,
    };
  }

  private async resolveManagerId(managerIdentifier: string): Promise<string> {
    const normalized = managerIdentifier.trim();
    const managerById = await this.prismaService.user.findFirst({
      where: {
        id: normalized,
        userRole: 'Manager',
        isDeleted: false,
      },
      select: { id: true },
    });

    if (managerById) {
      return managerById.id;
    }

    const managerByEmail = normalized.includes('@')
      ? await this.prismaService.user.findFirst({
          where: {
            email: normalized.toLowerCase(),
            userRole: 'Manager',
            isDeleted: false,
          },
          select: { id: true },
        })
      : null;

    if (managerByEmail) {
      return managerByEmail.id;
    }

    const nameParts = normalized.split(/\s+/).filter(Boolean);
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const managerByName = await this.prismaService.user.findFirst({
        where: {
          firstName: {
            equals: firstName,
            mode: 'insensitive',
          },
          lastName: {
            equals: lastName,
            mode: 'insensitive',
          },
          userRole: 'Manager',
          isDeleted: false,
        },
        select: { id: true },
      });

      if (managerByName) {
        return managerByName.id;
      }
    }

    throw new NotFoundException('Manager not found');
  }
}
