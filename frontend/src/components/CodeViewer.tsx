interface CodeViewerProps {
    code: string;
    language?: string;
}

export function CodeViewer({ code }: CodeViewerProps) {
    return (
        <div className="h-full w-full bg-[#1e1e1e] text-white p-4 overflow-auto font-mono text-sm leading-relaxed">
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    );
}
