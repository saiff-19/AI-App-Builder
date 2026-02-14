import { File, FileJson, FileCode, FileType, Layout, Image } from 'lucide-react';
import { cn } from '../lib/utils';

export function FileExplorer({ files, onSelectFile, selectedFile }) {
    const getFileIcon = (filename) => {
        if (filename.endsWith('.html')) return <Layout className="w-4 h-4 text-orange-400" />;
        if (filename.endsWith('.css')) return <FileType className="w-4 h-4 text-blue-400" />;
        if (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.jsx') || filename.endsWith('.tsx')) return <FileCode className="w-4 h-4 text-yellow-400" />;
        if (filename.endsWith('.json')) return <FileJson className="w-4 h-4 text-green-400" />;
        if (filename.match(/\.(jpg|jpeg|png|gif|svg)$/)) return <Image className="w-4 h-4 text-purple-400" />;
        return <File className="w-4 h-4 text-zinc-500" />;
    };

    return (
        <div className="space-y-0.5">
            {files.length === 0 && (
                <div className="text-zinc-500 text-xs text-center py-8 italic">
                    No files generated yet.<br/>Start by entering a prompt.
                </div>
            )}
            {files.map((file) => (
                <button
                    key={file}
                    onClick={() => onSelectFile(file)}
                    className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all text-left group",
                        selectedFile === file 
                            ? "bg-purple-500/10 text-purple-300 border border-purple-500/20" 
                            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                    )}
                >
                    <span className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        {getFileIcon(file)}
                    </span>
                    <span className="truncate font-mono">{file}</span>
                </button>
            ))}
        </div>
    );
}
