import { useState, useEffect, useCallback } from 'react';
import { Lock, ChatTeardropText, CircleNotch, Clock, Calendar, PencilSimple, FloppyDisk, X
} from "@phosphor-icons/react";
import workspaceApi from '../services/workspaceApi';
import ErrorBanner from '../../../components/ui/ErrorBanner';
import DocumentComments from './DocumentComments';

const DocumentView = ({ docId }) => {
  const [docData, setDocData] = useState(null);
  const [permissions, setPermissions] = useState({ canEdit: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contentDraft, setContentDraft] = useState("");
  const [showComments, setShowComments] = useState(false);

  const fetchDocument = useCallback(async () => {
    if (!docId) return;
    try {
      setIsLoading(true);
      setError(null);
      const [documentRes, permissionsRes] = await Promise.all([
        workspaceApi.getDocument(docId),
        workspaceApi.getDocumentPermissions(docId),
      ]);
      setDocData(documentRes.data);
      setPermissions(permissionsRes.data);
      setContentDraft(documentRes.data?.content || "");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load document.");
    } finally {
      setIsLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await workspaceApi.updateDocument(docId, {
        content: contentDraft,
      });
      setDocData(res.data);
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to save document.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white">
        <CircleNotch size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <ErrorBanner message={error} onRetry={fetchDocument} />
      </div>
    );
  }

  if (!docData) return null;

  return (
    <div className="flex h-full w-full bg-white relative">
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        <div className="p-8 md:p-16 overflow-y-auto h-full max-w-4xl mx-auto w-full">

          <div className="flex items-start justify-between mb-10 pb-6 border-b border-border">
            <div>
              <h1 className="text-4xl font-bold">{docData.title}</h1>

              <div className="flex gap-6 mt-2 text-xs uppercase text-text-secondary">
                <span>
                  <Calendar size={12} /> {formatDate(docData.created_at)}
                </span>
                <span>
                  <Clock size={12} /> {formatDate(docData.updated_at)}
                </span>

              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowComments(true)}
                className="px-3 py-1.5 border border-border text-xs font-bold uppercase flex items-center gap-2"
              >
                <ChatTeardropText size={14} />
                Comments
              </button>

              {permissions.canEdit && (
                !isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 bg-black text-white text-xs font-bold uppercase flex items-center gap-2"
                  >
                    <PencilSimple size={14} />
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setContentDraft(docData.content);
                      }}
                      className="px-3 py-1.5 border text-xs font-bold uppercase flex items-center gap-2"
                    >
                      <X size={14} />
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold uppercase flex items-center gap-2"
                    >
                      {isSaving ? (
                        <CircleNotch size={14} className="animate-spin" />
                      ) : (
                        <FloppyDisk size={14} />
                      )}
                      Save
                    </button>
                  </>
                )
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={contentDraft}
              onChange={(e) => setContentDraft(e.target.value)}
              className="w-full min-h-125 border p-4 text-sm"
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: docData.content }} />
          )}
        </div>
      </div>
      {showComments && (
        <div
          onClick={() => setShowComments(false)}
          className="fixed inset-0 bg-black/10 z-40"
        />
      )}
      {showComments && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l z-50 shadow-xl">
          <DocumentComments docId={docId} />
        </div>
      )}
    </div>
  );
};

export default DocumentView;