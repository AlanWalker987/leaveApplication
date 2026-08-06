export default function AdminUserManagementPage() {
  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] p-6 text-white shadow-sm">
        <p className="text-sm text-blue-100">Admin Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold">User Management</h1>
        <p className="mt-1 text-sm text-blue-100">Manage users, roles, and access settings.</p>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        User management scaffold.
      </div>
    </>
  );
}
