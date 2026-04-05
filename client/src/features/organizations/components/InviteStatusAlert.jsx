export const InviteStatusAlerts = ({ summary }) => {
  if (!summary) return null;

  const hasSkips = summary.alreadyMembers.length > 0 || summary.nonExistentEmails.length > 0;

  return (

    <div className="space-y-3 pt-2">
      {summary.addedCount > 0 && (

     
      <div className="bg-green-50 border-2 border-green-600 p-4 flex items-start gap-3">
        <div className="text-green-600 mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">
            Success
          </h3>
          <p className="text-xs font-medium text-green-700 leading-relaxed">
            Successfully added **{summary.addedCount}** user(s) to the organization.
          </p>
        </div>
      </div>
       )}

      {summary.alreadyMembers.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-500 p-4 flex items-start gap-3">
          <div className="text-yellow-600 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600">
              Already Members
            </h3>
            <ul className="text-xs font-mono text-yellow-700 list-disc list-inside">
              {summary.alreadyMembers.map(email => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {summary.nonExistentEmails.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-500 p-4 flex items-start gap-3">
          <div className="text-orange-600 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="17" y1="8" x2="22" y2="13"/>
              <line x1="22" y1="8" x2="17" y2="13"/>
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Accounts Not Found
            </h3>
            <p className="text-xs text-orange-700 leading-relaxed mb-1">
              These users must register an account before you can add them:
            </p>
            <ul className="text-xs font-mono text-orange-700 list-disc list-inside">
              {summary.nonExistentEmails.map(email => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {hasSkips && (
        <p className="text-xs text-text-secondary mt-2">
          Please remove the skipped emails above and try again for remaining members.
        </p>
      )}
    </div>
  );
};