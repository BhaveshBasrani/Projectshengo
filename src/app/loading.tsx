import React from 'react';
import PunkLoader from '@/components/ui/PunkLoader';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center font-mono">
      <PunkLoader
        label="LOADING PROJECT S.H.E."
        sublabel="PLEASE WAIT A MOMENT"
        size="full"
      />
    </div>
  );
}
