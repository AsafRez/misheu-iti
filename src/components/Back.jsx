import React from 'react';
import { ArrowRight } from 'lucide-react';
import Btn from './Btn.jsx';

export default function Back({ onBack, label = 'חזרה למסך הראשי' }) {
  return (
    <div className="mb-6">
      <Btn
        onClick={onBack}
        variant="outline"
        ariaLabel={label}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-bold border-2 border-appLine bg-appCard text-appInk hover:border-appBlue shadow-sm"
      >
        <ArrowRight className="w-7 h-7" aria-hidden="true" />
        <span>{label}</span>
      </Btn>
    </div>
  );
}
