import React, { useState } from 'react';
import Card from './Card.jsx';
import Btn from './Btn.jsx';
import Back from './Back.jsx';
import { Q, assign, ageGroup, CATS, REGIONS_CITIES } from '../lib/logic.js';
import { UserCheck, Shield, HeartHandshake, Plus, Save, MapPin, Accessibility } from 'lucide-react';

export default function Companion({ user, onUpdateUser, onBack, showToast }) {
  const [answers, setAnswers] = useState(user?.answers || [0, 0, 0]);
  const [userCity, setUserCity] = useState(user?.city || '');
  const [userNeedsAssistance, setUserNeedsAssistance] = useState(
    Boolean(user?.needsAssistance)
  );
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRel, setNewPersonRel] = useState('איש אמון');
  const [addError, setAddError] = useState('');

  const currentAgeGroup = ageGroup(user?.age || 30);
  const currentCat = CATS[user?.category] || CATS.talk;

  const handleSelectAnswer = (qIndex, valIndex) => {
    const updated = [...answers];
    updated[qIndex] = Number(valIndex);
    setAnswers(updated);
  };

  const handleSaveAnswers = (e) => {
    e.preventDefault();
    const recalculatedCategory = assign(user.age, answers);
    const updatedUser = {
      ...user,
      answers,
      city: userCity,
      needsAssistance: Boolean(userNeedsAssistance),
      category: recalculatedCategory,
    };
    onUpdateUser(updatedUser);
    showToast('הפרטים והתחומים עודכנו והמסלול חושב מחדש');
  };

  const handleAddTrusted = (e) => {
    e.preventDefault();
    setAddError('');
    const trimmedName = newPersonName.trim();
    if (!trimmedName) {
      setAddError('נא להזין שם עבור איש האמון.');
      return;
    }

    const trimmedRel = newPersonRel.trim() || 'איש אמון';
    const updatedTrusted = [
      ...(user?.trusted || []),
      { n: trimmedName, r: trimmedRel },
    ];

    const updatedUser = {
      ...user,
      trusted: updatedTrusted,
    };

    onUpdateUser(updatedUser);
    setNewPersonName('');
    setNewPersonRel('איש אמון');
    showToast('איש האמון נוסף');
  };

  return (
    <main
      id="main-content"
      className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-8 relative z-10"
    >
      <Back onBack={onBack} />

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-appBlue font-bold text-lg">
          <HeartHandshake className="w-6 h-6 shrink-0" aria-hidden="true" />
          <span>ממשק מלווה (חבר / בן משפחה)</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-appInk">
          ניהול הגדרות ותמיכה עבור {user?.name}
        </h1>
        <p className="text-xl text-appSoft">
          כאן ניתן לעדכן תחומי עניין להמלצות מדויקות יותר ולהוסיף אנשי קשר לחיבור מהיר.
        </p>
      </div>

      {/* 1. Profile Overview */}
      <Card className="space-y-4 border-2">
        <h2 className="text-2xl md:text-3xl font-bold text-appInk flex items-center gap-3">
          <Shield className="w-7 h-7 text-appBlue" aria-hidden="true" />
          <span>פרטי הפרופיל</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-lg">
          <div className="p-4 rounded-2xl bg-appBg border border-appLine">
            <span className="block text-appSoft font-medium">שם המשתמש:</span>
            <span className="text-xl font-bold text-appInk">{user?.name}</span>
          </div>

          <div className="p-4 rounded-2xl bg-appBg border border-appLine">
            <span className="block text-appSoft font-medium">גיל וקבוצה:</span>
            <span className="text-xl font-bold text-appInk">
              {user?.age} ({currentAgeGroup})
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-appBg border border-appLine">
            <span className="block text-appSoft font-medium">מסלול מותאם:</span>
            <span className="text-xl font-bold text-appGreen">
              {currentCat.title}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-appBg border border-appLine">
            <span className="block text-appSoft font-medium">אזור ועיר:</span>
            <span className="text-xl font-bold text-appInk flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-5 h-5 text-appBlue shrink-0" aria-hidden="true" />
              <span>{user?.city || 'לא צוין'}</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-appBg border border-appLine sm:col-span-2">
            <span className="block text-appSoft font-medium">סיוע עקב נכות:</span>
            <span className="text-xl font-bold text-appInk flex items-center gap-1.5 pt-0.5">
              <Accessibility className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
              <span>
                {user?.needsAssistance
                  ? 'כן - נרשם צורך בסיוע ובהתאמות נגישות'
                  : 'לא סומן צורך בסיוע עקב נכות'}
              </span>
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Edit Profile Details and Interests */}
      <Card as="form" onSubmit={handleSaveAnswers} className="space-y-6 border-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-appInk mb-1">
            עריכת אזור, סיוע ותחומי עניין
          </h2>
          <p className="text-xl text-appSoft">
            עדכון הפרטים יעדכן את הפרופיל ויחשב מחדש את מסלול הפעילויות.
          </p>
        </div>

        {/* City and Disability Assistance Editors */}
        <div className="space-y-4 p-4 rounded-2xl bg-appBg border border-appLine">
          <div>
            <label
              htmlFor="comp-city"
              className="block text-xl font-bold text-appInk mb-2"
            >
              אזור ועיר מגורים
            </label>
            <select
              id="comp-city"
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
              className="w-full min-h-[64px] text-xl px-4 rounded-2xl border-2 border-appLine bg-appCard text-appInk focus-visible:outline-none focus:border-appBlue cursor-pointer"
            >
              <option value="">נא לבחור אזור ועיר מהרשימה</option>
              {REGIONS_CITIES.map((group) => (
                <optgroup key={group.region} label={group.region}>
                  {group.cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-4 pt-2">
            <input
              id="comp-disability"
              type="checkbox"
              checked={userNeedsAssistance}
              onChange={(e) => setUserNeedsAssistance(e.target.checked)}
              className="mt-1 shrink-0"
            />
            <label
              htmlFor="comp-disability"
              className="text-lg md:text-xl font-bold cursor-pointer text-appInk leading-snug"
            >
              האם המשתמש שנרשם צריך סיוע עקב הנכות שלו
            </label>
          </div>
        </div>

        <div className="space-y-5">
          {Q.map((q, qIdx) => (
            <div key={q.id} className="space-y-2">
              <label
                htmlFor={`q-select-${qIdx}`}
                className="block text-xl font-bold text-appInk"
              >
                {q.question}
              </label>
              <select
                id={`q-select-${qIdx}`}
                value={answers[qIdx] ?? 0}
                onChange={(e) => handleSelectAnswer(qIdx, e.target.value)}
                className="w-full min-h-[64px] text-xl px-4 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
              >
                {q.options.map((opt, optIdx) => (
                  <option key={optIdx} value={optIdx}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <Btn
          type="submit"
          variant="blue"
          className="w-full text-xl md:text-2xl font-bold gap-3"
        >
          <Save className="w-6 h-6 shrink-0" aria-hidden="true" />
          <span>שמירה וחישוב מסלול מחדש</span>
        </Btn>
      </Card>

      {/* 3. Add and Manage Trusted Contacts */}
      <Card className="space-y-6 border-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-appInk mb-1">
            אנשי אמון לקשר מהיר
          </h2>
          <p className="text-xl text-appSoft">
            אנשים אלו יופיעו במסך ״אני רוצה לדבר״ להתקשרות ולהודעה בלחיצה.
          </p>
        </div>

        {/* Existing Trusted List */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-appInk">אנשי אמון קיימים:</h3>
          {user?.trusted && user.trusted.length > 0 ? (
            <div className="space-y-3">
              {user.trusted.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl bg-appBg border border-appLine"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-appGreen shrink-0" aria-hidden="true" />
                    <div>
                      <span className="text-xl font-bold text-appInk block">
                        {p.n}
                      </span>
                      <span className="text-base text-appSoft">{p.r}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-appSoft">אין כרגע אנשי אמון מוגדרים.</p>
          )}
        </div>

        <hr className="border-appLine" />

        {/* Form to Add New Contact */}
        <form onSubmit={handleAddTrusted} className="space-y-5" noValidate>
          <h3 className="text-xl font-bold text-appInk">הוספת איש אמון חדש</h3>

          <div>
            <label
              htmlFor="trusted-name"
              className="block text-lg font-bold mb-2"
            >
              שם <span className="text-red-600">*</span>
            </label>
            <input
              id="trusted-name"
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              placeholder="למשל: דנה או איתי"
              className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
            />
          </div>

          <div>
            <label
              htmlFor="trusted-rel"
              className="block text-lg font-bold mb-2"
            >
              הקשר (חבר, אח, שכן וכדומה)
            </label>
            <input
              id="trusted-rel"
              type="text"
              value={newPersonRel}
              onChange={(e) => setNewPersonRel(e.target.value)}
              placeholder="איש אמון"
              className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
            />
          </div>

          {addError && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-500 text-amber-950 font-semibold text-lg"
            >
              {addError}
            </div>
          )}

          <Btn
            type="submit"
            variant="green"
            className="w-full text-xl md:text-2xl font-bold gap-3"
          >
            <Plus className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>הוספה</span>
          </Btn>
        </form>
      </Card>
    </main>
  );
}
