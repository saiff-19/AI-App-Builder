export function PreviewFrame() {
    return (
        <div className="h-full w-full bg-white relative">
            <iframe 
                src="/preview/" 
                title="App Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
}
