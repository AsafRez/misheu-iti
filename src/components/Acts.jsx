import React, { useState } from 'react';
import Card from './Card.jsx';
import Btn from './Btn.jsx';
import Back from './Back.jsx';
import { ACTS, ageGroup } from '../lib/logic.js';
import { Check, Calendar, Star, Users } from 'lucide-react';

export default function Acts({ user, onBack }) {
  const [joined, setJoined] = useState({});

  const userAge = ageGroup(user?.age || 30);
  const userCat = user?.category || 'talk';

  // Calculate scores and sort
  const scoredActs = ACTS.map((act) => {
    let score = 0;
    if (act.cats.includes(userCat)) {
      score += 2;
    }
    if (act.ages.includes(userAge)) {
      score += 1;
    }
    return { ...act, score };
  }).sort((a, b) => b.score - a.score);

  const toggleJoin = (actId) => {
    setJoined((prev) => ({
      ...prev,
      [actId]: !prev[actId],
    }));
  };

  return (
    <main
      id="main-content"
      className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6 relative z-10"
    >
      <Back onBack={onBack} />

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-appInk">
          בא לי לצאת
        </h1>
        <p className="text-xl text-appSoft">
          פעילויות קהילתיות ומפגשים נעימים. ממוינים לפי ההעדפות וקבוצת הגיל שלך.
        </p>
      </div>

      <div className="space-y-5" role="feed" aria-label="רשימת פעילויות">
        {scoredActs.map((act) => {
          const isJoined = Boolean(joined[act.id]);
          const isRecommended = act.score >= 2;

          return (
            <Card
              key={act.id}
              as="article"
              className={`space-y-4 border-2 transition-all ${
                isRecommended
                  ? 'border-appGreen/70 shadow-md'
                  : 'border-appLine'
              }`}
            >
              <div className="space-y-2">
                {isRecommended && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-appGreen text-base md:text-lg font-bold">
                    <Star className="w-5 h-5 fill-current" aria-hidden="true" />
                    <span>מומלץ עבורך לפי ההעדפות והגיל שלך</span>
                  </div>
                )}

                <h2 className="text-2xl md:text-3xl font-extrabold text-appInk">
                  {act.title}
                </h2>
                <p className="text-xl text-appSoft font-medium leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <div className="pt-2">
                <Btn
                  variant={isJoined ? 'green' : 'outline'}
                  onClick={() => toggleJoin(act.id)}
                  ariaPressed={isJoined}
                  ariaLabel={`${act.title} - ${
                    isJoined ? 'נרשמת, נתראה שם' : 'אשמח להצטרף'
                  }`}
                  className={`w-full text-xl md:text-2xl font-bold gap-3 ${
                    !isJoined ? 'border-2 border-appLine hover:border-appBlue' : ''
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-7 h-7 shrink-0 text-white stroke-[3]" aria-hidden="true" />
                      <span>נרשמת, נתראה שם</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-6 h-6 shrink-0 text-appBlue" aria-hidden="true" />
                      <span>אשמח להצטרף</span>
                    </>
                  )}
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
