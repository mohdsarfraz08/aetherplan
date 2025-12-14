import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Edit2, Eye, Save } from 'lucide-react';

interface MarkdownEditorProps {
    initialValue?: string;
    onSave: (content: string) => void;
}

export const MarkdownEditor = ({ initialValue = '', onSave }: MarkdownEditorProps) => {
    const [content, setContent] = useState(initialValue);
    const [isPreview, setIsPreview] = useState(false);

    return (
        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPreview(false)}
                        className={`p-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${!isPreview ? 'bg-primary-DEFAULT/10 text-primary-DEFAULT' : 'text-text-secondary hover:text-white'}`}
                    >
                        <Edit2 size={14} /> Write
                    </button>
                    <button
                        onClick={() => setIsPreview(true)}
                        className={`p-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${isPreview ? 'bg-primary-DEFAULT/10 text-primary-DEFAULT' : 'text-text-secondary hover:text-white'}`}
                    >
                        <Eye size={14} /> Preview
                    </button>
                </div>
                <button
                    onClick={() => onSave(content)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-DEFAULT hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-colors"
                >
                    <Save size={14} /> Save Notes
                </button>
            </div>

            {/* Editor/Preview Area */}
            <div className="min-h-[300px] max-h-[600px] overflow-y-auto custom-scrollbar">
                {isPreview ? (
                    <div className="p-6 prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{content || '*No notes yet.*'}</ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="# Course Notes\nStart typing here..."
                        className="w-full h-[300px] bg-transparent p-6 text-text-primary focus:outline-none resize-y font-mono text-sm leading-relaxed"
                    />
                )}
            </div>
        </div>
    );
};
