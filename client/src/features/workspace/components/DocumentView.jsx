import { useState, useEffect, useCallback } from 'react';
import { Lock, ChatTeardropText, PaperPlaneRight, UserCircle, CircleNotch, Clock, Calendar } from "@phosphor-icons/react";
import workspaceApi from '../services/workspaceApi';
import ErrorBanner from '../../../components/ui/ErrorBanner';

const DocumentView = ({ docId }) => {
  const [docData, setDocData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocument = useCallback(async () => {
    if (!docId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await workspaceApi.getDocument(docId);
      setDocData(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load document.");
    } finally {
      setIsLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

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
        <div className="flex flex-col items-center gap-3">
          <CircleNotch size={32} className="animate-spin text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Syncing Document...</p>
        </div>
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
    <div className="flex h-full w-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        <div className="p-8 md:p-16 overflow-y-auto h-full max-w-4xl mx-auto w-full">
          
          <div className="flex items-start justify-between mb-10 pb-6 border-b border-border">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-text-primary font-heading tracking-tight">
                {docData.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-text-tertiary" />
                  <span>Created: <span className="text-text-primary">{formatDate(docData.created_at)}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-text-tertiary" />
                  <span>Updated: <span className="text-text-primary">{formatDate(docData.updated_at)}</span></span>
                </div>
              </div>
            </div>
            
            {!docData.canEdit && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border text-[10px] font-bold text-text-secondary rounded uppercase tracking-widest">
                <Lock size={12} weight="bold" />
                Read Only
              </div>
            )}
          </div>

          <div 
            className="prose prose-slate max-w-none focus:outline-none min-h-125 text-text-primary leading-relaxed"
            contentEditable={docData.canEdit}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: docData.content }}
          />
        </div>
      </div>

      <aside className="w-80 flex flex-col bg-surface shrink-0">
        <div className="p-4 border-b border-border flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] text-text-primary bg-white">
          <ChatTeardropText size={18} />
          Discussion
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {docData.comments?.length > 0 ? (
            docData.comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <UserCircle size={24} className="text-text-tertiary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-text-primary truncate">{comment.user}</span>
                    <span className="text-[9px] text-text-tertiary uppercase">{comment.time}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-snug bg-white p-3 border border-border rounded-sm shadow-sm">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <ChatTeardropText size={32} className="text-border" />
              <p className="text-xs text-text-tertiary italic">No comments yet.</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-white border-t border-border">
          <div className="relative group">
            <textarea 
              placeholder="Write a response..."
              className="w-full text-sm border border-border p-3 pr-10 outline-none focus:border-borderStrong focus:ring-0 resize-none min-h-25 transition-all placeholder:text-text-tertiary bg-surface/30 focus:bg-white"
            />
            <button className="absolute bottom-3 right-3 text-primary hover:scale-110 transition-transform">
              <PaperPlaneRight size={20} weight="fill" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DocumentView;