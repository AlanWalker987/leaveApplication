import * as XLSX from 'xlsx-js-style';
import {
  formatDateValue,
  getNow,
  getCurrentMonthDays,
  getDatesInRange,
  isSameMonthDate,
  isWeekendDate,
  parseIsoDate,
  toIsoDateInput,
} from '@/lib/datetimeutile';

export type TimesheetUser = {
  id: string;
  firstName: string;
  lastName: string;
  managerId: string | null;
  vendorId: string | null;
  designation: string | null;
  dateOfJoining: string | null;
};

export type TimesheetLeave = {
  userId: string;
  leaveTypeCode: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
};

type LookupUser = {
  firstName: string;
  lastName: string;
};

type LookupVendor = {
  name: string;
};

type ExcelCellStyle = {
  font?: Record<string, unknown>;
  fill?: Record<string, unknown>;
  alignment?: Record<string, unknown>;
  border?: Record<string, unknown>;
};

type ExportLeavesAvailedTimesheetExcelInput = {
  users: TimesheetUser[];
  leaves: TimesheetLeave[];
  usersById: Map<string, LookupUser>;
  vendorsById: Map<string, LookupVendor>;
  selectedDepartmentName: string;
  selectedDepartmentId: string;
  allDepartmentsValue: string;
};

function sanitizeFilePart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export function exportLeavesAvailedTimesheetExcel({
  users,
  leaves,
  usersById,
  vendorsById,
  selectedDepartmentName,
  selectedDepartmentId,
  allDepartmentsValue,
}: ExportLeavesAvailedTimesheetExcelInput) {
  const workbook = XLSX.utils.book_new();
  const worksheet: XLSX.WorkSheet = {};

  const { monthStart, days: monthDays } = getCurrentMonthDays();
  const dayStartCol = 5;
  const dayEndCol = dayStartCol + monthDays.length - 1;

  const titleRow = 2;
  const daysRow = 3;
  const weekRow = 4;
  const dateAndInfoHeaderRow = 5;
  const firstDataRow = 6;

  const usersByIdForExport = new Map(users.map((user) => [user.id, user]));
  const leaveMarkByUserDate = new Map<string, string>();

  for (const leave of leaves) {
    if (!usersByIdForExport.has(leave.userId)) {
      continue;
    }

    const leaveStart = parseIsoDate(leave.fromDate);
    const leaveEnd = parseIsoDate(leave.toDate);
    if (!leaveStart || !leaveEnd) {
      continue;
    }

    const isHalfDay =
      Number(leave.totalDays) === 0.5 &&
      formatDateValue(leaveStart, 'yyyy-MM-dd') === formatDateValue(leaveEnd, 'yyyy-MM-dd');
    const leaveCode = (leave.leaveTypeCode ?? '').trim().toUpperCase() === 'AH' ? 'AH' : 'EL';
    const mark = isHalfDay ? `0.5${leaveCode}` : leaveCode;

    for (const day of getDatesInRange(leaveStart, leaveEnd)) {
      if (!isSameMonthDate(day, monthStart) || isWeekendDate(day)) {
        continue;
      }

      leaveMarkByUserDate.set(`${leave.userId}:${formatDateValue(day, 'yyyy-MM-dd')}`, mark);
    }
  }

  const thinBorder = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };

  const baseCellStyle: ExcelCellStyle = {
    border: thinBorder,
    alignment: { vertical: 'center', horizontal: 'center' },
    font: { name: 'Calibri', sz: 11 },
  };

  const leftCellStyle: ExcelCellStyle = {
    ...baseCellStyle,
    alignment: { vertical: 'center', horizontal: 'left' },
  };

  const blackHeaderStyle: ExcelCellStyle = {
    ...baseCellStyle,
    fill: { patternType: 'solid', fgColor: { rgb: '000000' } },
    font: { name: 'Calibri', sz: 11, color: { rgb: 'FFFFFF' }, bold: true },
  };

  const legendValueStyle: ExcelCellStyle = {
    ...leftCellStyle,
    fill: { patternType: 'solid', fgColor: { rgb: 'FFF200' } },
    font: { name: 'Calibri', sz: 11, bold: true },
  };

  const weekendStyle: ExcelCellStyle = {
    ...baseCellStyle,
    fill: { patternType: 'solid', fgColor: { rgb: 'BFBFBF' } },
    font: { name: 'Calibri', sz: 11, bold: true },
  };

  const leaveStyle: ExcelCellStyle = {
    ...baseCellStyle,
    fill: { patternType: 'solid', fgColor: { rgb: 'FFF200' } },
    font: { name: 'Calibri', sz: 11, bold: true },
  };

  const headerTextStyle: ExcelCellStyle = {
    ...baseCellStyle,
    font: { name: 'Calibri', sz: 11, bold: true },
  };

  function setCell(row: number, col: number, value: string | number, style: ExcelCellStyle) {
    const address = XLSX.utils.encode_cell({ r: row, c: col });
    worksheet[address] = {
      t: typeof value === 'number' ? 'n' : 's',
      v: value,
      s: style,
    };
  }

  setCell(0, 0, 'Full Day Leave', leftCellStyle);
  setCell(0, 1, 'EL, AH', legendValueStyle);
  setCell(1, 0, 'Half Day Leave', leftCellStyle);
  setCell(1, 1, '0.5EL', legendValueStyle);

  for (let col = 0; col <= dayEndCol; col += 1) {
    setCell(titleRow, col, '', blackHeaderStyle);
    setCell(daysRow, col, '', blackHeaderStyle);
    if (col < dayStartCol) {
      setCell(weekRow, col, '', baseCellStyle);
    }
  }

  setCell(
    titleRow,
    dayStartCol,
    `Timesheet for the month of ${formatDateValue(monthStart, 'MMMM-yyyy')} (${selectedDepartmentName})`,
    blackHeaderStyle,
  );

  setCell(daysRow, dayStartCol, 'Days', blackHeaderStyle);
  setCell(dateAndInfoHeaderRow, 0, 'EMPLOYEE NAME', headerTextStyle);
  setCell(dateAndInfoHeaderRow, 1, 'Vendor', headerTextStyle);
  setCell(dateAndInfoHeaderRow, 2, 'Team', headerTextStyle);
  setCell(dateAndInfoHeaderRow, 3, 'Manager', headerTextStyle);
  setCell(dateAndInfoHeaderRow, 4, 'DOJ', headerTextStyle);

  for (let dayIndex = 0; dayIndex < monthDays.length; dayIndex += 1) {
    const day = monthDays[dayIndex];
    const col = dayStartCol + dayIndex;
    setCell(weekRow, col, formatDateValue(day, 'EEE'), blackHeaderStyle);
    setCell(
      dateAndInfoHeaderRow,
      col,
      `${formatDateValue(day, 'd')}-${formatDateValue(day, 'MMM')}`,
      blackHeaderStyle,
    );
  }

  const sortedUsers = [...users].sort((a, b) => {
    const aName = `${a.firstName} ${a.lastName}`.trim();
    const bName = `${b.firstName} ${b.lastName}`.trim();
    return aName.localeCompare(bName);
  });

  if (sortedUsers.length === 0) {
    setCell(firstDataRow, 0, 'No employee records for selected department.', leftCellStyle);
    for (let col = 1; col <= dayEndCol; col += 1) {
      setCell(firstDataRow, col, '', baseCellStyle);
    }
  }

  for (let userIndex = 0; userIndex < sortedUsers.length; userIndex += 1) {
    const rowIndex = firstDataRow + userIndex;
    const user = sortedUsers[userIndex];
    const manager = user.managerId ? usersById.get(user.managerId) : null;
    const managerName = manager ? `${manager.firstName} ${manager.lastName}` : '-';
    const vendorName = user.vendorId ? (vendorsById.get(user.vendorId)?.name ?? '-') : '-';
    const doj = user.dateOfJoining ? toIsoDateInput(user.dateOfJoining) : '-';

    setCell(rowIndex, 0, `${user.firstName} ${user.lastName}`.trim(), leftCellStyle);
    setCell(rowIndex, 1, vendorName, leftCellStyle);
    setCell(rowIndex, 2, user.designation ?? '-', leftCellStyle);
    setCell(rowIndex, 3, managerName, leftCellStyle);
    setCell(rowIndex, 4, doj, baseCellStyle);

    for (let dayIndex = 0; dayIndex < monthDays.length; dayIndex += 1) {
      const day = monthDays[dayIndex];
      const col = dayStartCol + dayIndex;
      const dayKey = formatDateValue(day, 'yyyy-MM-dd');
      const leaveMark = leaveMarkByUserDate.get(`${user.id}:${dayKey}`);

      if (isWeekendDate(day)) {
        setCell(rowIndex, col, 'WO', weekendStyle);
        continue;
      }

      if (leaveMark) {
        setCell(rowIndex, col, leaveMark, leaveStyle);
        continue;
      }

      setCell(rowIndex, col, 'P', baseCellStyle);
    }
  }

  worksheet['!merges'] = [
    { s: { r: titleRow, c: dayStartCol }, e: { r: titleRow, c: dayEndCol } },
    { s: { r: daysRow, c: dayStartCol }, e: { r: daysRow, c: dayEndCol } },
  ];

  worksheet['!cols'] = [
    { wch: 26 },
    { wch: 24 },
    { wch: 20 },
    { wch: 16 },
    { wch: 12 },
    ...monthDays.map(() => ({ wch: 8 })),
  ];

  const lastRow = Math.max(firstDataRow, firstDataRow + sortedUsers.length - 1);
  worksheet['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: lastRow, c: dayEndCol },
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leaves Availed');

  const dateSuffix = formatDateValue(getNow(), 'yyyyMMdd');
  const deptSuffix =
    selectedDepartmentId === allDepartmentsValue
      ? 'all-departments'
      : sanitizeFilePart(selectedDepartmentName);

  XLSX.writeFile(workbook, `leaves-availed-${deptSuffix}-${dateSuffix}.xlsx`);
}
