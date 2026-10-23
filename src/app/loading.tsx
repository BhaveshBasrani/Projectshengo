import React from 'react';
import PunkLoader from '@/components/ui/PunkLoader';

export default function RootLoading() {
  return (
    <div className="min-h-screen punk-loader-screen bg-[#080808] flex items-center justify-center font-mono select-none">
      <PunkLoader
        label="LOADING PROJECT S.H.E."
        sublabel="PLEASE WAIT A MOMENT"
        size="full"
      />
    </div>
  );
}
