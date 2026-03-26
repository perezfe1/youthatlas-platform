'use client';

import { useState } from 'react';

export function FeedbackWidget() {
  const [state, setState] = useState<'idle' | 'yes' | 'no'>('idle');

  if (state !== 'idle') {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
        <p className="text-sm font-medium text-[#1A1A2E]">
          Thanks for the feedback! 🙏
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium text-[#1A1A2E]">Was this guide helpful?</p>
      <div className="mt-3 flex gap-3">
        <button
          onClick={() => setState('yes')}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors hover:border-primary hover:text-primary"
        >
          👍 Yes, helpful
        </button>
        <button
          onClick={() => setState('no')}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors hover:border-slate-400"
        >
          👎 Not really
        </button>
      </div>
    </div>
  );
}
