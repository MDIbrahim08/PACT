import { cn } from "@/lib/utils";
import React from "react";

export interface GlassShineCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  badge?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  shine?: boolean;
  align?: "left" | "right";
  children?: React.ReactNode;
}

export const GlassShineCard: React.FC<GlassShineCardProps> = ({
  badge,
  title,
  description,
  shine = true,
  align = "left",
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "glass-shine-container relative group overflow-hidden rounded-[24px] p-5 sm:p-6",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
        "border border-white/60 dark:border-slate-700/60",
        "shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]",
        "transition-all duration-500 ease-out",
        align === "right" && "text-left sm:text-right",
        className
      )}
      {...props}
    >
      {/* Dynamic Animated Shine Ray */}
      {shine && (
        <>
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] z-10">
            <div className="glass-shine-beam absolute w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-white/0 via-white/50 to-white/0 dark:via-blue-400/20 blur-xl pointer-events-none" />
          </div>
          <div className="absolute -inset-px rounded-[25px] bg-gradient-to-b from-white/80 via-white/20 to-transparent dark:from-white/10 dark:via-transparent pointer-events-none z-20" />
        </>
      )}

      {/* Card Content */}
      <div className="relative z-30 flex flex-col space-y-2.5 text-neutral-900 dark:text-white">
        {badge && (
          <div className={cn("flex items-center", align === "right" && "sm:justify-end")}>
            {badge}
          </div>
        )}

        {title && (
          <div className="font-bold text-neutral-900 dark:text-white tracking-tight leading-snug">
            {title}
          </div>
        )}

        {description && (
          <div className="text-neutral-700 dark:text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
            {description}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export const SampleCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("container p-4 max-w-sm", className)}>
      <div className="card glass-shine-container relative overflow-hidden rounded-2xl p-6 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white/60 dark:border-slate-700 shadow-lg">
        {/* Shine Beam */}
        <div className="glass-shine-beam absolute w-[160px] h-[160px] rounded-full bg-gradient-to-tr from-white/0 via-white/60 to-white/0 dark:via-blue-400/20 blur-md pointer-events-none" />
        <p className="innerText text-xs font-mono font-bold tracking-widest uppercase text-neutral-500 dark:text-slate-400 mb-1">
          SAMPLE TEXT
        </p>
        <p className="innerText text-lg font-bold text-neutral-900 dark:text-white">
          Glass Shine Card
        </p>
        <p className="desc text-xs text-neutral-700 dark:text-slate-200 mt-2 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id
          dictum augue, id viverra.
        </p>
      </div>
    </div>
  );
};

// Default export for flexibility
export default GlassShineCard;
