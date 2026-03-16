// components/features/payroll/payroll-header.tsx
"use client";

import { FileSpreadsheet, Lock, Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  isLocked: boolean;
  hasSummary: boolean;
  isPending: boolean;
  onGenerate: () => void;
  onLock: () => void;
};

export default function PayrollHeader({
  isLocked,
  hasSummary,
  isPending,
  onGenerate,
  onLock,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Payroll Processing</h1>
        <p className="text-white/40 text-sm">
          Review and finalize monthly wages
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status badge */}
        {hasSummary && (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border",
              isLocked
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30",
            )}
          >
            {isLocked ? (
              <Lock size={12} />
            ) : (
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            {isLocked ? "LOCKED" : "DRAFT"}
          </div>
        )}

        {/* Generate */}
        {!isLocked && (
          <Button
            onClick={onGenerate}
            disabled={isPending}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {hasSummary ? "Regenerate" : "Generate Payroll"}
          </Button>
        )}

        {/* Lock */}
        {hasSummary && !isLocked && (
          <Button
            onClick={onLock}
            disabled={isPending}
            variant="outline"
            className="gap-2 border-white/10 text-white/70 hover:bg-white/5"
          >
            <Lock size={16} />
            Lock Payroll
          </Button>
        )}

        <Button
          variant="outline"
          className="gap-2 border-white/10 text-white/70 hover:bg-white/5"
        >
          <FileSpreadsheet size={16} />
          Export
        </Button>
      </div>
    </div>
  );
}
