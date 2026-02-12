import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface PromptInputProps {
    onSubmit: (prompt: string) => Promise<void>;
    disabled?: boolean;
}

export function PromptInput({ onSubmit, disabled }: PromptInputProps) {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading || disabled) return;
        
        setIsLoading(true);
        try {
            await onSubmit(prompt);
            setPrompt(""); // Clear input on success
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-card rounded-xl shadow-2xl border border-white/10">
                <div className="pl-4 text-muted-foreground">
                    <Sparkles className="w-5 h-5 shimmer" />
                </div>
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the app you want to build..." 
                    className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus:ring-0 px-4 py-4 md:py-5 text-base md:text-lg outline-none"
                    disabled={isLoading || disabled}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || disabled || !prompt.trim()}
                    className="mr-2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </div>
        </form>
    );
}
