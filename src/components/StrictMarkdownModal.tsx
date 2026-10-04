import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download } from 'lucide-react';
import { AnalysisResult } from '../types/roi';
import { exportBlueprintPdf } from '../utils/exportPdf';

interface StrictMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
  analysis?: AnalysisResult | null;
}

export const StrictMarkdownModal: React.FC<StrictMarkdownModalProps> = ({
  isOpen,
  onClose,
  markdownContent,
  analysis,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    if (!analysis) return;
    setIsExporting(true);
    try {
      exportBlueprintPdf(analysis);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Word count check
  const wordCount = markdownContent
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">LIFEROI™ 30-Day Executive Blueprint</h2>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>Executive Diagnostic &amp; PDF Download</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-400">{wordCount} words (&lt; 200 budget)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Markdown Render Container */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto select-all">
          {markdownContent}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="text-[11px] text-zinc-400">
            Client Diagnostic ID: LR-2026-X89 · 12% Annuity Decay Model
          </span>
          <div className="flex items-center gap-2">
            {analysis && (
              <button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Generating PDF...' : 'Download Blueprint (PDF)'}</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
