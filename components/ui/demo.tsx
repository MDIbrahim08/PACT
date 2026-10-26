"use client";

import { TiltCard } from "@/components/ui/be-ui-tilt-card";
import { SampleCard } from "@/components/ui/glass-shine-card";

export function TiltCardPreview() {
  return (
    <div className="flex items-center justify-center p-6">
      <TiltCard className="w-[320px] border border-slate-700 bg-slate-900/90 text-white p-6 shadow-2xl">
        <div className="text-xs uppercase tracking-wider text-white font-mono">Premium 3D Physics</div>
        <h3 className="mt-2 text-2xl font-semibold text-white">Tilt me</h3>
        <p className="mt-3 text-sm text-slate-300">Move your cursor across the card to see 3D tilt + interactive glare.</p>
      </TiltCard>
    </div>
  );
}

export default function DemoOne() {
  return (
    <div className="App flex flex-col items-center justify-center min-h-[300px] p-6 gap-6 bg-slate-950 rounded-3xl">
      <TiltCardPreview />
      <SampleCard />
    </div>
  );
}
