/// <reference types="node" />

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_VENDOR_ID = '00000000-0000-0000-0000-000000000001';

type BranchSeed = {
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
};

const branchSeeds: BranchSeed[] = [
  {
    code: 'HQ',
    name: 'Headquarters',
    location: 'Colombo',
  },
  {
    code: 'BR-001',
    name: 'Kandy Branch',
    location: 'Kandy',
  },
  {
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
  { code: 'AH', description: 'Additional leave' },
  { code: 'EL', description: 'Earn leave' },
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
  await prisma.leaveTypes.deleteMany({
    where: {
      code: {
        in: leaveTypeSeeds.map((leaveType) => leaveType.code),
      },
    },
  });

  await prisma.leaveTypes.createMany({
    data: leaveTypeSeeds
      .map((leaveType) => ({
        code: leaveType.code,
        description: leaveType.description,
        createAt: now,
        updatedAt: now,
        isDeleted: false,
      }))
      .sort((a, b) => a.code.localeCompare(b.code)),
  });
}

async function runSeed() {
  const now = new Date();
  await seedVendors(now);
  await seedBranches(now);
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
