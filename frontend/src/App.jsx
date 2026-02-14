import { useState, useEffect } from 'react';
import { FileExplorer } from './components/FileExplorer';
import { PromptInput } from './components/PromptInput';
import { CodeViewer } from './components/CodeViewer';
import { PreviewFrame } from './components/PreviewFrame';
import { LoginPage } from './components/LoginPage';
import { Code, Eye, FileText, RefreshCw, LogOut, Terminal } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("// Select a file to view code");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");

  // Fetch files on mount and after generation
  const fetchFiles = async () => {
    try {
        const res = await axios.get(`${API_BASE}/files`);
        setFiles(res.data.files || []);
        // Select first file if nothing selected
        if (!selectedFile && res.data.files?.length > 0) {
           // Try to find index.html or main file
           const main = res.data.files.find((f) => f.includes('index.html')) || res.data.files[0];
           handleSelectFile(main);
        }
    } catch (e) {
        console.error("Failed to fetch files", e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleGenerate = async (prompt) => {
    setIsGenerating(true);
    setStatus("Generating...");
    try {
        await axios.post(`${API_BASE}/generate`, { prompt });
        setStatus("Done!");
        await fetchFiles();
        setActiveTab('preview');
        // Refresh iframe
        const frame = document.querySelector('iframe');
        if (frame) frame.src = frame.src;
        
        setTimeout(() => setStatus(""), 2000);
    } catch (e) {
        setStatus("Error generating.");
        console.error(e);
        setTimeout(() => setStatus(""), 3000);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSelectFile = async (path) => {
    setSelectedFile(path);
    try {
        const res = await axios.get(`${API_BASE}/files/content`, { params: { path } });
        setGeneratedCode(res.data.content);
        setActiveTab('code');
    } catch (e) {
        console.error("Failed to read file", e);
        setGeneratedCode("// Error reading file");
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Sidebar - File Explorer */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-zinc-900/50 backdrop-blur-xl">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-purple-400" />
                </div>
                <h1 className="font-semibold text-sm tracking-wide text-zinc-100">Explorer</h1>
            </div>
            <button onClick={fetchFiles} className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded">
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
        </div>
        <div className="flex-1 overflow-auto p-3">
            <div className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider px-2">Project Files</div>
            <FileExplorer files={files} onSelectFile={handleSelectFile} selectedFile={selectedFile} />
        </div>
        
        {/* User / Logout */}
        <div className="p-4 border-t border-white/5">
            <button 
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
        
        {/* Header / Tabs */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-900/30">
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                <button 
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'preview' ? 'bg-purple-600/20 text-purple-300 shadow-sm ring-1 ring-purple-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                    <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button 
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'code' ? 'bg-blue-600/20 text-blue-300 shadow-sm ring-1 ring-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                    <Code className="w-3.5 h-3.5" /> Code Integration
                </button>
            </div>

            <div className="flex items-center gap-4">
                {status && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20 animate-in fade-in slide-in-from-top-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {status}
                    </div>
                )}
                {selectedFile && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-mono">{selectedFile}</span>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative p-4">
                <div className="w-full h-full rounded-xl border border-white/5 overflow-hidden shadow-2xl shadow-black/50 bg-[#09090b]">
                    {activeTab === 'code' ? (
                        <CodeViewer code={generatedCode} language="javascript" />
                    ) : (
                        <PreviewFrame />
                    )}
                </div>
            </div>
            
            {/* Prompt Area Overlay (Floating) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-20">
                <PromptInput onSubmit={handleGenerate} disabled={isGenerating} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
