import React from 'react';

export const Component = ({ className = '', fixed = false }: { className?: string; fixed?: boolean }) => {
  return (
    <div 
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] pointer-events-none ${className}`}
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
    </div>
  );
};

export const BackgroundSnippets = Component;
export default Component;
