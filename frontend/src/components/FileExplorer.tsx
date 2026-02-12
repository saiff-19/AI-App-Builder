import { File } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileExplorerProps {
    files: string[];
    onSelectFile: (path: string) => void;
    selectedFile: string | null;
}

export function FileExplorer({ files, onSelectFile, selectedFile }: FileExplorerProps) {
    // Basic flat list for now, can be improved to tree structure
    return (
        <div className="space-y-1">
            {files.length === 0 && (
                <div className="text-muted-foreground text-sm text-center py-4">
                    No files generated yet.
                </div>
            )}
            {files.map((file) => (
                <button
                    key={file}
                    onClick={() => onSelectFile(file)}
                    className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left truncate",
                        selectedFile === file 
                            ? "bg-accent text-accent-foreground font-medium" 
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    <File className="w-4 h-4 shrink-0" />
                    <span className="truncate">{file}</span>
                </button>
            ))}
        </div>
    );
}
