import { RefreshCw } from "lucide-react";
import { useState, useRef } from "react";

export function PreviewFrame() {
    const [key, setKey] = useState(0);
    const iframeRef = useRef(null);

    const handleRefresh = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className="w-full h-full flex flex-col bg-white">
            {/* Browser Chrome */}
            <div className="h-10 bg-[#f3f4f6] border-b flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80 border border-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80 border border-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80 border border-green-500/20" />
                </div>
                
                <div className="flex-1 flex items-center justify-center max-w-xl mx-auto">
                    <div className="w-full h-7 bg-white rounded-md border border-gray-200 flex items-center px-3 text-xs text-gray-500 font-mono shadow-sm">
                        <span className="text-gray-400 mr-2">🔒</span>
                        localhost:8000/preview
                    </div>
                </div>

                <button 
                    onClick={handleRefresh}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Iframe */}
            <iframe 
                key={key}
                ref={iframeRef}
                src="https://ai-app-builder-aslm.onrender.com/preview/" 
                className="flex-1 w-full bg-white border-none"
                title="App Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
            />
        </div>
    );
}
