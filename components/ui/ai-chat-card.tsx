"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUp, MessageCircleDashed, Mic, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIChatCardProps {
  title?: string;
  subtitle?: string;
  greeting?: string;
  prompt?: string;
  prompts?: string[];
  autoType?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  onSend?: (message: string) => void;
  onReset?: () => void;
  onAttach?: () => void;
  onMic?: () => void;
  isRecording?: boolean;
  className?: string;
}

export function AIChatCard({
  title = "Pact Commercial AI Sentinel",
  subtitle = "MSME Indian Contract Act §10 & WhatsApp Notary",
  greeting = "Namaste!",
  prompt = "What deal terms, WhatsApp chat, or legal notice can I draft or verify today?",
  placeholder = "Ask anything or paste WhatsApp deal…",
  icon,
  onSend,
  onReset,
  onAttach,
  onMic,
  isRecording = false,
  className,
}: AIChatCardProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [userMessage, setUserMessage] = React.useState("");
  const [spins, setSpins] = React.useState(0);

  const handleSend = () => {
    const textToSend = userMessage.trim();
    if (!textToSend) return;
    onSend?.(textToSend);
    setUserMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-[24px] bg-slate-900 border border-slate-800 text-white shadow-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 px-5 pb-4 pt-5">
        <div>
          <h3 className="text-[16px] font-bold leading-6 text-white">
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-5 text-slate-400">
            {subtitle}
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => {
            setSpins((count) => count + 1);
            setUserMessage("");
            onReset?.();
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Reset conversation"
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[18px] border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:text-white cursor-pointer"
        >
          <motion.span
            animate={{ rotate: spins * 360 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.7 }}
            className="flex"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.span>
        </motion.button>
      </div>

      {/* Greeting / Empty state */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-slate-800/80 border border-slate-700 shadow-sm"
        >
          {icon ?? <MessageCircleDashed className="h-5 w-5 text-white" />}
        </motion.div>
        
        <h4 className="mt-3.5 text-[17px] font-bold leading-snug tracking-tight text-white">
          {greeting}
        </h4>
        
        <p className="mt-1.5 max-w-[280px] text-xs leading-relaxed text-slate-300 font-medium">
          {prompt}
        </p>
      </div>

      {/* Composer Input Area - Direct Clean Textarea without annoying typewriter loops */}
      <div className="px-4 pb-4">
        <div className="rounded-[18px] bg-slate-800/90 border border-slate-700/80 p-3 transition-colors focus-within:border-white focus-within:ring-1 focus-within:ring-white/20">
          <textarea
            ref={textareaRef}
            autoFocus
            value={userMessage}
            onChange={(event) => setUserMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={2}
            className="w-full resize-none bg-transparent text-xs sm:text-sm leading-5 text-white placeholder:text-slate-400 outline-none caret-white font-medium"
          />

          <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-700/50">
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={onAttach}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Attach photo, screenshot, PDF or invoice"
              >
                <Plus className="h-4 w-4" />
              </button>

              {onMic && (
                <button
                  type="button"
                  onClick={onMic}
                  className={cn(
                    "flex h-[32px] w-[32px] items-center justify-center rounded-xl border transition-all cursor-pointer",
                    isRecording 
                      ? "bg-white text-black border-white animate-pulse ring-2 ring-white/40" 
                      : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  )}
                  title={isRecording ? "Stop recording" : "Dictate terms with voice"}
                >
                  <Mic className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!userMessage.trim()}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-xl bg-white hover:bg-neutral-200 disabled:opacity-30 text-black font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              title="Send message"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatCard;
