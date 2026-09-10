import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDateValue, getNow } from '@/lib/datetimeutile';

export type LeavesAvailedPdfRow = {
  employeeName: string;
  vendor: string;
  branch: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  approvedBy: string;
};

type ExportLeavesAvailedPdfInput = {
  rows: LeavesAvailedPdfRow[];
  selectedDepartmentName: string;
  selectedDepartmentId: string;
  allDepartmentsValue: string;
};

function sanitizeFilePart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export function exportLeavesAvailedPdf({
  rows,
  selectedDepartmentName,
  selectedDepartmentId,
  allDepartmentsValue,
}: ExportLeavesAvailedPdfInput) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const generatedOn = formatDateValue(getNow(), 'yyyy-MM-dd HH:mm');

  doc.setFontSize(16);
  doc.text('Leaves Availed Report', 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(90, 100, 120);
  doc.text(`Department: ${selectedDepartmentName}`, 40, 60);
  doc.text(`Generated On: ${generatedOn}`, 40, 74);

  autoTable(doc, {
    startY: 90,
    head: [
      ['Employee Name', 'Vendor', 'Branch', 'Leave Type', 'From', 'To', 'Days', 'Approved By'],
    ],
    body: rows.map((row) => [
      row.employeeName,
      row.vendor,
      row.branch,
      row.leaveType,
      row.fromDate,
      row.toDate,
      String(row.days),
      row.approvedBy,
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 6,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [15, 23, 42],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 24, right: 24, top: 90, bottom: 24 },
    tableWidth: 'auto',
  });

  const dateSuffix = formatDateValue(getNow(), 'yyyyMMdd');
  const deptSuffix =
    selectedDepartmentId === allDepartmentsValue
      ? 'all-departments'
      : sanitizeFilePart(selectedDepartmentName);

  doc.save(`leaves-availed-${deptSuffix}-${dateSuffix}.pdf`);
}
