export default function EmployeeLeaveHistoryPage() {
  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] p-6 text-white shadow-sm">
        <p className="text-sm text-blue-100">Employee Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold">Leave History</h1>
        <p className="mt-1 text-sm text-blue-100">Track your previous leave requests and status.</p>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Leave History Table Area</p>
        <p className="mt-1 text-sm text-slate-600">
          This is scaffold-only UI. Add history list/table implementation directly in this page
          file.
        </p>
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          History placeholder
        </div>
      </div>
    </>
  );
}
