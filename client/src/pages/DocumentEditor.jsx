import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  File,
  ArrowLeft,
  Users,
  Clock,
  DotsThree,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
  Quotes,
  Code,
  Link as LinkIcon
} from '@phosphor-icons/react';

const DocumentEditor = ({ onLogout }) => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const [lastSaved, setLastSaved] = useState('Just now');
  const editorRef = useRef(null);

  // Mock document data
  useEffect(() => {
    if (documentId && documentId !== 'new') {
      setTitle('Introduction to OpenDoc');
      setContent('Start writing your document here...');
    }
  }, [documentId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-white z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                data-testid="back-to-workspace"
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-surface transition-colors duration-150"
                title="Back"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <File size={16} weight="fill" className="text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-text-primary truncate max-w-xs">{title}</h1>
                  <p className="text-xs text-text-secondary">Product Documentation</p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Clock size={14} />
                <span>Saved {lastSaved}</span>
              </div>

              <button
                data-testid="share-document"
                className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-surface text-xs font-semibold text-text-primary transition-colors duration-150"
              >
                <Users size={16} />
                Share
              </button>

              <button
                data-testid="document-options"
                className="p-2 hover:bg-surface transition-colors duration-150"
              >
                <DotsThree size={20} className="text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Title Input */}
          <input
            data-testid="document-title-input"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full text-5xl lg:text-6xl font-black tracking-tighter text-text-primary bg-transparent border-none outline-none mb-8 font-heading placeholder:text-text-disabled"
            placeholder="Untitled"
          />

          {/* Content Editor */}
          <div
            data-testid="document-content-editor"
            ref={editorRef}
            contentEditable
            onFocus={() => setShowToolbar(true)}
            onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
            className="min-h-125 text-base leading-relaxed text-text-secondary outline-none prose prose-lg max-w-none"
            style={{
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            <p className="text-text-disabled">{content || 'Start writing...'}</p>
          </div>
        </div>
      </main>

      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          data-testid="formatting-toolbar"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-xl border border-border px-4 py-3 flex items-center gap-2 shadow-lg"
          style={{
            borderColor: 'rgba(9, 9, 11, 0.1)'
          }}
        >
          <button
            data-testid="format-bold"
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Bold (Ctrl+B)"
          >
            {/* <TextBolder size={18} className="text-text-primary" /> */}
          </button>

          <button
            data-testid="format-italic"
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Italic (Ctrl+I)"
          >
            <TextItalic size={18} className="text-text-primary" />
          </button>

          <button
            data-testid="format-underline"
            onClick={() => formatText('underline')}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Underline (Ctrl+U)"
          >
            <TextUnderline size={18} className="text-text-primary" />
          </button>

          <div className="w-px h-6 bg-border mx-2"></div>

          <button
            data-testid="format-bullet-list"
            onClick={() => formatText('insertUnorderedList')}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Bullet List"
          >
            <ListBullets size={18} className="text-text-primary" />
          </button>

          <button
            data-testid="format-numbered-list"
            onClick={() => formatText('insertOrderedList')}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Numbered List"
          >
            <ListNumbers size={18} className="text-text-primary" />
          </button>

          <div className="w-px h-6 bg-border mx-2"></div>

          <button
            data-testid="format-quote"
            onClick={() => formatText('formatBlock', 'blockquote')}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Quote"
          >
            <Quotes size={18} className="text-text-primary" />
          </button>

          <button
            data-testid="format-code"
            onClick={() => formatText('formatBlock', 'pre')}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Code Block"
          >
            <Code size={18} className="text-text-primary" />
          </button>

          <div className="w-px h-6 bg-border mx-2"></div>

          <button
            data-testid="format-link"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) formatText('createLink', url);
            }}
            className="p-2 hover:bg-surface transition-colors duration-150"
            title="Insert Link"
          >
            <LinkIcon size={18} className="text-text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;