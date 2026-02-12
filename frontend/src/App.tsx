import { useState, useEffect } from 'react';
import { FileExplorer } from './components/FileExplorer';
import { PromptInput } from './components/PromptInput';
import { CodeViewer } from './components/CodeViewer';
import { PreviewFrame } from './components/PreviewFrame';
import { Code, Eye, FileText, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("// Select a file to view code");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>("");

  // Fetch files on mount and after generation
  const fetchFiles = async () => {
    try {
        const res = await axios.get(`${API_BASE}/files`);
        setFiles(res.data.files || []);
        // Select first file if nothing selected
        if (!selectedFile && res.data.files?.length > 0) {
           // Try to find index.html or main file
           const main = res.data.files.find((f: string) => f.includes('index.html')) || res.data.files[0];
           handleSelectFile(main);
        }
    } catch (e) {
        console.error("Failed to fetch files", e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setStatus("Generating app... this may take a moment.");
    try {
        await axios.post(`${API_BASE}/generate`, { prompt });
        setStatus("Generation complete!");
        await fetchFiles();
        setActiveTab('preview');
        // Refresh iframe
        const frame = document.querySelector('iframe');
        if (frame) frame.src = frame.src;
    } catch (e) {
        setStatus("Error generating app.");
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSelectFile = async (path: string) => {
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

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar - File Explorer */}
      <div className="w-64 border-r border-border flex flex-col bg-card/50">
        <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h1 className="font-semibold text-lg tracking-tight">Project</h1>
            </div>
            <button onClick={fetchFiles} className="text-muted-foreground hover:text-foreground">
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
        <div className="flex-1 overflow-auto p-2">
            <FileExplorer files={files} onSelectFile={handleSelectFile} selectedFile={selectedFile} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col relative">
            {/* Header / Tabs */}
            <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-card/30">
                <div className="flex gap-1 bg-muted p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('code')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Code className="w-4 h-4" /> Code
                    </button>
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    {status && <span className="text-muted-foreground animate-pulse">{status}</span>}
                    <span className="text-muted-foreground font-mono">{selectedFile}</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'code' ? (
                    <CodeViewer code={generatedCode} language="javascript" />
                ) : (
                    <PreviewFrame />
                )}
            </div>
            
            {/* Prompt Area Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
                <PromptInput onSubmit={handleGenerate} disabled={isGenerating} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
