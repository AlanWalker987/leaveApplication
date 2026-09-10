/// <reference types="node" />

import * as bcrypt from 'bcrypt';
import { LeaveEligibilityGender, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_VENDOR_ID = '00000000-0000-0000-0000-000000000001';

type BranchSeed = {
  id: string;
  code: string;
  name: string;
  location: string;
};

type VendorSeed = {
  id: string;
  name: string;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
};

type PublicHolidaySeed = {
  id: string;
  date: string;
  title: string;
};

type LeaveTypeSeed = {
  code: string;
  description: string;
  annualAllowance: number;
  eligibilityGender: LeaveEligibilityGender;
};

type UserSeed = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  designation: string;
  branchCode: string;
};

type DepartmentSeed = {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  managerEmail: string;
  employeeEmails: string[];
};

const branchSeeds: BranchSeed[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    code: 'HQ',
    name: 'Headquarters',
    location: 'Colombo',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    code: 'BR-001',
    name: 'Kandy Branch',
    location: 'Kandy',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    code: 'BR-002',
    name: 'Galle Branch',
    location: 'Galle',
  },
];

const vendorSeeds: VendorSeed[] = [
  {
    id: DEFAULT_VENDOR_ID,
    name: 'Default Vendor',
    contactName: 'Operations Team',
    contactNumber: '0000000000',
    contactEmail: 'default-vendor@example.com',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Acme Supplies',
    contactName: 'Saman Perera',
    contactNumber: '94770000001',
    contactEmail: 'contact@acmesupplies.com',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Lanka Services',
    contactName: 'Nadeesha Silva',
    contactNumber: '94770000002',
    contactEmail: 'hello@lankaservices.com',
  },
];

const publicHolidaySeeds: PublicHolidaySeed[] = [
  { id: '00000000-0000-0000-0000-000000000101', date: '01-Jan-26', title: 'New Year Day' },
  { id: '00000000-0000-0000-0000-000000000102', date: '15-Jan-26', title: 'Sankranthi' },
  { id: '00000000-0000-0000-0000-000000000103', date: '26-Jan-26', title: 'Republic Day' },
  { id: '00000000-0000-0000-0000-000000000104', date: '19-Mar-26', title: 'Chandramana Ugadi' },
  { id: '00000000-0000-0000-0000-000000000105', date: '01-May-26', title: 'May Day' },
  { id: '00000000-0000-0000-0000-000000000106', date: '14-Sep-26', title: 'Ganesh Chaturthi' },
  { id: '00000000-0000-0000-0000-000000000107', date: '02-Oct-26', title: 'Gandhi Jayanti' },
  { id: '00000000-0000-0000-0000-000000000108', date: '20-Oct-26', title: 'Vijayadashami' },
  { id: '00000000-0000-0000-0000-000000000109', date: '10-Nov-26', title: 'Balipadya, Diwali' },
  { id: '00000000-0000-0000-0000-000000000110', date: '25-Dec-26', title: 'Christmas' },
];

const leaveTypeSeeds: LeaveTypeSeed[] = [
  {
    code: 'AH',
    description: 'Additional leave',
    annualAllowance: 12,
    eligibilityGender: LeaveEligibilityGender.FemaleOnly,
  },
  {
    code: 'EL',
    description: 'Earn leave',
    annualAllowance: 20,
    eligibilityGender: LeaveEligibilityGender.Any,
  },
];

const userSeeds: UserSeed[] = [
  {
    id: '00000000-0000-0000-0000-000000001001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    role: Role.Manager,
    designation: 'Department Manager',
    branchCode: 'HQ',
  },
  {
    id: '00000000-0000-0000-0000-000000001002',
    firstName: 'Kiran',
    lastName: 'Mehta',
    email: 'kiran.mehta@example.com',
    role: Role.Manager,
    designation: 'Department Manager',
    branchCode: 'HQ',
  },
  {
    id: '00000000-0000-0000-0000-000000001003',
    firstName: 'Jamie',
    lastName: 'Lee',
    email: 'jamie.lee@example.com',
    role: Role.Employee,
    designation: 'Software Engineer',
    branchCode: 'HQ',
  },
  {
    id: '00000000-0000-0000-0000-000000001004',
    firstName: 'James',
    lastName: 'Wong',
    email: 'james.wong@example.com',
    role: Role.Employee,
    designation: 'Software Engineer',
    branchCode: 'HQ',
  },
  {
    id: '00000000-0000-0000-0000-000000001005',
    firstName: 'Wei',
    lastName: 'Lin',
    email: 'wei.lin@example.com',
    role: Role.Employee,
    designation: 'QA Engineer',
    branchCode: 'HQ',
  },
  {
    id: '00000000-0000-0000-0000-000000001006',
    firstName: 'Linda',
    lastName: 'Grant',
    email: 'linda.grant@example.com',
    role: Role.Employee,
    designation: 'Product Engineer',
    branchCode: 'HQ',
  },
  {
    id: '00000000-0000-0000-0000-000000001007',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@example.com',
    role: Role.Employee,
    designation: 'HR Specialist',
    branchCode: 'HQ',
  },
  {
    id: '00000000-0000-0000-0000-000000001008',
    firstName: 'Aisha',
    lastName: 'Babu',
    email: 'aisha.babu@example.com',
    role: Role.Employee,
    designation: 'Operations Coordinator',
    branchCode: 'BR-001',
  },
  {
    id: '00000000-0000-0000-0000-000000001009',
    firstName: 'Arjun',
    lastName: 'Das',
    email: 'arjun.das@example.com',
    role: Role.Employee,
    designation: 'Logistics Coordinator',
    branchCode: 'BR-001',
  },
  {
    id: '00000000-0000-0000-0000-000000001010',
    firstName: 'Rajan',
    lastName: 'Patel',
    email: 'rajan.patel@example.com',
    role: Role.Employee,
    designation: 'Finance Analyst',
    branchCode: 'HQ',
  },
];

const departmentSeeds: DepartmentSeed[] = [
  {
    id: '00000000-0000-0000-0000-000000002001',
    name: 'Engineering',
    subtitle: 'Product development, infrastructure and QA',
    location: 'Singapore HQ',
    managerEmail: 'sarah.chen@example.com',
    employeeEmails: [
      'jamie.lee@example.com',
      'james.wong@example.com',
      'wei.lin@example.com',
      'linda.grant@example.com',
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000002002',
    name: 'Human Resources',
    subtitle: 'Talent acquisition, payroll and compliance',
    location: 'Singapore HQ',
    managerEmail: 'sarah.chen@example.com',
    employeeEmails: ['priya.nair@example.com'],
  },
  {
    id: '00000000-0000-0000-0000-000000002003',
    name: 'Operations',
    subtitle: 'Facilities, logistics and vendor management',
    location: 'Chennai',
    managerEmail: 'kiran.mehta@example.com',
    employeeEmails: ['aisha.babu@example.com', 'arjun.das@example.com'],
  },
  {
    id: '00000000-0000-0000-0000-000000002004',
    name: 'Finance',
    subtitle: 'Budgeting, accounts and audit',
    location: 'Chennai',
    managerEmail: 'kiran.mehta@example.com',
    employeeEmails: ['rajan.patel@example.com'],
  },
];

function parseHolidayDate(date: string): Date {
  const [dayText, monthText, yearText] = date.split('-');
  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const day = Number(dayText);
  const month = monthMap[monthText];
  const year = 2000 + Number(yearText);

  return new Date(Date.UTC(year, month, day));
}

async function upsertBranch(branch: BranchSeed, now: Date) {
  await prisma.branch.upsert({
    where: { code: branch.code },
    update: {
      name: branch.name,
      location: branch.location,
      updatedAt: now,
    },
    create: {
      ...branch,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    },
  });
}

async function upsertVendor(vendor: VendorSeed, now: Date) {
  await prisma.vendor.upsert({
    where: { id: vendor.id },
    update: {
      name: vendor.name,
      contactName: vendor.contactName,
      contactNumber: vendor.contactNumber,
      contactEmail: vendor.contactEmail,
      updatedAt: now,
    },
    create: {
      ...vendor,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    },
  });
}

async function seedBranches(now: Date) {
  for (const branch of branchSeeds) {
    await upsertBranch(branch, now);
  }
}

async function seedVendors(now: Date) {
  for (const vendor of vendorSeeds) {
    await upsertVendor(vendor, now);
  }
}

async function seedUsers(now: Date) {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  for (const user of userSeeds) {
    const branch = await prisma.branch.findUniqueOrThrow({
      where: { code: user.branchCode },
    });

    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hash: passwordHash,
        userRole: user.role,
        designation: user.designation,
        branchId: branch.id,
        updatedAt: now,
      },
      create: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hash: passwordHash,
        userRole: user.role,
        designation: user.designation,
        branchId: branch.id,
        phoneNumber: '0000000000',
        dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
        dateOfJoining: new Date('2025-01-01T00:00:00.000Z'),
        emergencyContactName: 'Emergency Contact',
        emergencyContactNumber: '0000000000',
        createAt: now,
        updatedAt: now,
        isDeleted: false,
      },
    });
  }
}

async function seedDepartments(now: Date) {
  await prisma.user.updateMany({
    where: { email: { in: userSeeds.map((user) => user.email) } },
    data: { departmentId: null },
  });

  for (const department of departmentSeeds) {
    const manager = await prisma.user.findUniqueOrThrow({
      where: { email: department.managerEmail },
    });

    await prisma.department.upsert({
      where: { id: department.id },
      update: {
        name: department.name,
        subtitle: department.subtitle,
        location: department.location,
        managerId: manager.id,
        updatedAt: now,
        isDeleted: false,
      },
      create: {
        id: department.id,
        name: department.name,
        subtitle: department.subtitle,
        location: department.location,
        managerId: manager.id,
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      },
    });

    await prisma.user.updateMany({
      where: { email: { in: department.employeeEmails } },
      data: { departmentId: department.id, managerId: manager.id },
    });
  }
}

async function seedPublicHolidays(now: Date) {
  const holidays = publicHolidaySeeds
    .map((holiday) => ({
      id: holiday.id,
      holidayDate: parseHolidayDate(holiday.date),
      title: holiday.title,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    }))
    .sort((a, b) => a.holidayDate.getTime() - b.holidayDate.getTime());

  await prisma.publicHolidays.deleteMany({
    where: {
      OR: [
        {
          id: {
            in: holidays.map((holiday) => holiday.id),
          },
        },
        {
          holidayDate: {
            in: holidays.map((holiday) => holiday.holidayDate),
          },
        },
      ],
    },
  });

  await prisma.publicHolidays.createMany({
    data: holidays,
  });
}

async function seedLeaveTypes(now: Date) {
  for (const leaveType of leaveTypeSeeds.sort((a, b) => a.code.localeCompare(b.code))) {
    await prisma.leaveTypes.upsert({
      where: {
        code: leaveType.code,
      },
      update: {
        description: leaveType.description,
        annualAllowance: leaveType.annualAllowance,
        eligibilityGender: leaveType.eligibilityGender,
        updatedAt: now,
        isDeleted: false,
      },
      create: {
        code: leaveType.code,
        description: leaveType.description,
        annualAllowance: leaveType.annualAllowance,
        eligibilityGender: leaveType.eligibilityGender,
        createAt: now,
        updatedAt: now,
        isDeleted: false,
      },
    });
  }
}

async function runSeed() {
  const now = new Date();
  await seedVendors(now);
  await seedBranches(now);
  await seedUsers(now);
  await seedDepartments(now);
  await seedPublicHolidays(now);
  await seedLeaveTypes(now);
}

async function main() {
  await runSeed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
