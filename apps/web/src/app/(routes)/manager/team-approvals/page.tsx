export default function ManagerTeamApprovalsPage() {
  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-[var(--app-black)] to-[var(--app-gray-800)] p-6 text-[var(--app-white)] shadow-sm">
        <p className="text-sm text-[var(--app-gray-700)]">Manager Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold">Team Approvals</h1>
        <p className="mt-1 text-sm text-[var(--app-gray-700)]">
          Review and approve leave requests from your team.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center text-sm text-[var(--app-text-muted)]">
        Team approvals scaffold.
      </div>
    </>
  );
}
