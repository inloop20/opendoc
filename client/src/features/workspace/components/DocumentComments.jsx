import { useState, useEffect, useCallback } from "react";
import {
  ChatTeardropText,
  UserCircle,
  PaperPlaneRight,
  CircleNotch
} from "@phosphor-icons/react";

import workspaceApi from "../services/workspaceApi";

const DocumentComments = ({ docId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await workspaceApi.getComments(docId);
      setComments(res.data);
    } catch (err) {
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    try {
      setSending(true);
      setError(null);

      await workspaceApi.createComment(docId, {
        content: trimmed
      });

      setText("");
      await fetchComments();

    } catch (err) {
      setError("Failed to send comment");
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="w-80 flex flex-col bg-white border-l border-border">

      {/* HEADER */}
      <div className="p-4 border-b border-border flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em]">
        <ChatTeardropText size={18} />
        Comments
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {loading ? (
          <div className="flex justify-center py-10">
            <CircleNotch className="animate-spin" size={20} />
          </div>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">

              <UserCircle size={22} className="text-text-tertiary mt-0.5" />

              <div className="flex-1">

                <div className="flex justify-between mb-1">
                  <span className="text-[11px] font-semibold">
                    {c?.author?.username}
                  </span>

                  <span className="text-[9px] text-text-tertiary uppercase">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="text-sm bg-surface border border-border p-3 rounded-md">
                  {c.content}
                </div>

              </div>

            </div>
          ))
        ) : (
          <div className="text-center text-xs text-text-tertiary mt-10">
            No comments yet
          </div>
        )}

        {error && (
          <div className="text-xs text-red-500 text-center mt-2">
            {error}
          </div>
        )}

      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-border">

        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-2">

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 text-sm bg-transparent outline-none resize-none"
          />

          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="text-primary disabled:opacity-50"
          >
            {sending ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              <PaperPlaneRight size={18} weight="fill" />
            )}
          </button>

        </div>

      </div>

    </aside>
  );
};

export default DocumentComments;