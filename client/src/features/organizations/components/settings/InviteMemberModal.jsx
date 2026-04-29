import React, { useState } from "react";

const InviteMemberModal = React.memo(({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
      setLoading(true);
      setError("");

      await onSubmit(email.trim());

      setEmail("");
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to invite user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-100">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative bg-white w-full max-w-md p-6 border shadow-xl">
        <h2 className="text-lg font-bold mb-4">
          Invite Member
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="user@company.com"
            className="w-full border p-3 text-sm outline-none"
          />

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-xs"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white text-xs"
            >
              {loading ? "Inviting..." : "Invite"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
});

export default InviteMemberModal;