import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function CodeViewer({ code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split('\n');

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e]">
             {/* Simple Header */}
             <div className="h-10 bg-[#252526] flex items-center justify-end px-4 border-b border-[#3e3e42]">
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-green-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-auto flex text-sm font-mono leading-6">
                {/* Line Numbers */}
                <div className="py-4 px-3 text-right text-zinc-600 bg-[#1e1e1e] border-r border-[#3e3e42]/50 select-none min-w-[3rem]">
                    {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </div>
                
                {/* Code Content */}
                <div className="p-4 text-zinc-300 w-full">
                    <pre>
                        <code>{code}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
