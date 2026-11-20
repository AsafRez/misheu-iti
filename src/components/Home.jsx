import React, { useState } from 'react';
import Card from './Card.jsx';
import { Phone, Wind, MapPin, Smile, Meh, Frown, Sparkles, User } from 'lucide-react';
import { CATS, ageGroup } from '../lib/logic.js';

export default function Home({ user, onNavigate }) {
  const [checkInResponse, setCheckInResponse] = useState(null);
  const userCat = CATS[user?.category] || CATS.talk;
  const userAge = ageGroup(user?.age || 30);

  const handleCheckIn = (type) => {
    if (type === 'good') {
      setCheckInResponse('כיף לשמוע. שיהיה לך המשך יום נעים.');
    } else if (type === 'so-so') {
      setCheckInResponse(
        'לפעמים זה ככה, וזה בסדר גמור. אולי כוס מים או רגע של נשימה?'
      );
    } else if (type === 'hard') {
      setCheckInResponse(
        'תודה ששיתפת. לא חייבים לעבור את זה לבד. אפשר ללחוץ על ״אני רוצה לדבר״.'
      );
    }
  };

  return (
    <main
      id="main-content"
      className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-8 relative z-10"
    >
      {/* Title & Category Tag */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-appInk leading-tight">
          שלום {user?.name}, טוב לראות אותך. במה אוכל לעזור עכשיו?
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-appCard border border-appLine shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
            <span className="text-lg md:text-xl font-bold text-appSoft">
              המסלול שלך: {userCat.title} • מותאם לגילאי {userAge}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-appCard border-2 border-appLine hover:border-appBlue text-appInk text-base md:text-lg font-bold shadow-sm transition-all"
          >
            <User className="w-5 h-5 text-appBlue" aria-hidden="true" />
            <span>עריכת פרופיל</span>
          </button>
        </div>
      </div>

      {/* 3 Huge Action Buttons */}
      <section aria-label="פעולות עיקריות" className="space-y-5">
        {/* 1. Connect - Blue */}
        <button
          type="button"
          onClick={() => onNavigate('connect')}
          className="w-full min-h-[100px] p-6 rounded-3xl bg-appBlue text-white shadow-md hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-start text-right gap-5 border border-white/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Phone className="w-11 h-11 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-extrabold leading-tight">
              אני רוצה לדבר
            </span>
            <span className="text-[20px] text-white/90 font-medium">
              שיחה עם מישהו קרוב או מתנדב
            </span>
          </div>
        </button>

        {/* 2. Calm - Green */}
        <button
          type="button"
          onClick={() => onNavigate('calm')}
          className="w-full min-h-[100px] p-6 rounded-3xl bg-appGreen text-white shadow-md hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-start text-right gap-5 border border-white/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Wind className="w-11 h-11 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-extrabold leading-tight">
              קשה לי עכשיו
            </span>
            <span className="text-[20px] text-white/90 font-medium">
              תרגיל נשימה קצר להרגעה
            </span>
          </div>
        </button>

        {/* 3. Acts - Clay */}
        <button
          type="button"
          onClick={() => onNavigate('acts')}
          className="w-full min-h-[100px] p-6 rounded-3xl bg-appClay text-white shadow-md hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-start text-right gap-5 border border-white/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <MapPin className="w-11 h-11 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-extrabold leading-tight">
              בא לי לצאת
            </span>
            <span className="text-[20px] text-white/90 font-medium">
              פעילות או מפגש חברתי קרוב לבית
            </span>
          </div>
        </button>
      </section>

      {/* Daily Check-in */}
      <Card as="section" aria-label="צ׳ק-אין יומי" className="space-y-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-appInk mb-1">
            צ׳ק-אין יומי
          </h2>
          <p className="text-xl text-appSoft">רק לבדוק מה שלומך היום</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleCheckIn('good')}
            className="min-h-[64px] px-4 py-3 rounded-2xl border-2 border-appLine bg-appBg hover:border-appGreen hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-appInk flex items-center justify-center gap-3 text-xl font-bold transition-all shadow-sm"
          >
            <Smile className="w-8 h-8 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>טוב</span>
          </button>

          <button
            type="button"
            onClick={() => handleCheckIn('so-so')}
            className="min-h-[64px] px-4 py-3 rounded-2xl border-2 border-appLine bg-appBg hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-appInk flex items-center justify-center gap-3 text-xl font-bold transition-all shadow-sm"
          >
            <Meh className="w-8 h-8 text-amber-600 shrink-0" aria-hidden="true" />
            <span>ככה-ככה</span>
          </button>

          <button
            type="button"
            onClick={() => handleCheckIn('hard')}
            className="min-h-[64px] px-4 py-3 rounded-2xl border-2 border-appLine bg-appBg hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-appInk flex items-center justify-center gap-3 text-xl font-bold transition-all shadow-sm"
          >
            <Frown className="w-8 h-8 text-rose-600 shrink-0" aria-hidden="true" />
            <span>לא קל</span>
          </button>
        </div>

        {checkInResponse && (
          <div
            role="status"
            aria-live="polite"
            className="p-5 mt-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 text-amber-950 dark:text-amber-100 text-xl font-semibold leading-relaxed"
          >
            {checkInResponse}
          </div>
        )}
      </Card>
    </main>
  );
}
