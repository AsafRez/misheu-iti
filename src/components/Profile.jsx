import React, { useState } from 'react';
import Card from './Card.jsx';
import Btn from './Btn.jsx';
import Back from './Back.jsx';
import { Q, assign, ageGroup, CATS, REGIONS_CITIES } from '../lib/logic.js';
import {
  User,
  Save,
  MapPin,
  Accessibility,
  Sparkles,
  Phone,
  Plus,
  UserCheck,
  Calendar,
} from 'lucide-react';

export default function Profile({ user, onUpdateUser, onBack, showToast }) {
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [needsAssistance, setNeedsAssistance] = useState(
    Boolean(user?.needsAssistance)
  );
  const [answers, setAnswers] = useState(user?.answers || [0, 0, 0]);

  // Trusted contact form state
  const [trustedList, setTrustedList] = useState(user?.trusted || []);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRel, setNewPersonRel] = useState('איש אמון');
  const [errorMsg, setErrorMsg] = useState('');

  const currentCategory = assign(age, answers);
  const currentCatInfo = CATS[currentCategory] || CATS.talk;
  const currentAgeGroup = ageGroup(age || 30);

  const handleSelectAnswer = (qIndex, valIndex) => {
    const updated = [...answers];
    updated[qIndex] = Number(valIndex);
    setAnswers(updated);
  };

  const handleAddTrusted = (e) => {
    e.preventDefault();
    const trimmedName = newPersonName.trim();
    if (!trimmedName) {
      setErrorMsg('נא להזין שם עבור איש האמון.');
      return;
    }

    const updated = [
      ...trustedList,
      { n: trimmedName, r: newPersonRel.trim() || 'איש אמון' },
    ];
    setTrustedList(updated);
    setNewPersonName('');
    setNewPersonRel('איש אמון');
    setErrorMsg('');
  };

  const handleRemoveTrusted = (idxToRemove) => {
    setTrustedList(trustedList.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('איך לקרוא לך? נא להזין שם.');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setErrorMsg('נא להזין גיל תקין במספרים.');
      return;
    }

    if (ageNum < 18) {
      setErrorMsg('השירות מיועד לגילאי 18 ומעלה.');
      return;
    }

    if (!city) {
      setErrorMsg('נא לבחור עיר או אזור מגורים מהרשימה.');
      return;
    }

    const recalculatedCat = assign(ageNum, answers);

    const updatedUser = {
      ...user,
      name: trimmedName,
      age: ageNum,
      phone: phone.trim(),
      city,
      needsAssistance: Boolean(needsAssistance),
      answers,
      category: recalculatedCat,
      trusted: trustedList,
    };

    onUpdateUser(updatedUser);
    showToast('הפרטים נשמרו בהצלחה והמסלול עודכן');
    onBack();
  };

  return (
    <main
      id="main-content"
      className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6 relative z-10"
    >
      <Back onBack={onBack} label="חזרה למסך הראשי" />

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-appInk flex items-center gap-3">
          <User className="w-9 h-9 text-appBlue" aria-hidden="true" />
          <span>הפרופיל שלי</span>
        </h1>
        <p className="text-xl text-appSoft">
          כאן ניתן לעדכן פרטים אישיים, אזור מגורים, תחומי עניין ואנשי אמון.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* 1. Personal details */}
        <Card className="space-y-5 border-2">
          <h2 className="text-2xl md:text-3xl font-bold text-appInk">
            פרטים אישיים
          </h2>

          <div>
            <label htmlFor="prof-name" className="block text-xl font-bold mb-2">
              שם פרטי (או כינוי) <span className="text-red-600">*</span>
            </label>
            <input
              id="prof-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-age" className="block text-xl font-bold mb-2">
                גיל <span className="text-red-600">*</span>
              </label>
              <input
                id="prof-age"
                type="number"
                min="18"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
              />
            </div>

            <div>
              <label htmlFor="prof-phone" className="block text-xl font-bold mb-2">
                מספר טלפון
              </label>
              <input
                id="prof-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="למשל: 050-0000000"
                className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prof-city" className="block text-xl font-bold mb-2">
              עיר / אזור מגורים <span className="text-red-600">*</span>
            </label>
            <select
              id="prof-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue cursor-pointer"
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

          {/* Checkbox for disability assistance */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-appBg border-2 border-appLine">
            <input
              id="prof-disability"
              type="checkbox"
              checked={needsAssistance}
              onChange={(e) => setNeedsAssistance(e.target.checked)}
              className="mt-1 shrink-0"
            />
            <label
              htmlFor="prof-disability"
              className="text-lg md:text-xl font-bold cursor-pointer text-appInk leading-snug"
            >
              האם המשתמש שנרשם צריך סיוע עקב הנכות שלו
            </label>
          </div>
        </Card>

        {/* 2. Interests and Category */}
        <Card className="space-y-5 border-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-appInk mb-1">
              תחומי עניין ומסלול
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-appGreen font-bold text-lg">
              <Sparkles className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>
                מסלול נוכחי: {currentCatInfo.title} (גילאי {currentAgeGroup})
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {Q.map((q, qIdx) => (
              <div key={q.id} className="space-y-2">
                <label
                  htmlFor={`prof-q-${qIdx}`}
                  className="block text-xl font-bold text-appInk"
                >
                  {q.question}
                </label>
                <select
                  id={`prof-q-${qIdx}`}
                  value={answers[qIdx] ?? 0}
                  onChange={(e) => handleSelectAnswer(qIdx, e.target.value)}
                  className="w-full min-h-[64px] text-xl px-4 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue cursor-pointer"
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
        </Card>

        {/* 3. Trusted contacts */}
        <Card className="space-y-5 border-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-appInk mb-1">
              אנשי אמון
            </h2>
            <p className="text-xl text-appSoft">
              אנשים אלו יופיעו במסך ״אני רוצה לדבר״ להתקשרות מהירה ולהודעה.
            </p>
          </div>

          {/* Existing list */}
          <div className="space-y-3">
            {trustedList.map((p, idx) => (
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
                <button
                  type="button"
                  onClick={() => handleRemoveTrusted(idx)}
                  className="text-base font-bold text-red-600 hover:text-red-800 p-2 rounded-xl"
                  aria-label={`הסר את ${p.n}`}
                >
                  הסרה
                </button>
              </div>
            ))}
          </div>

          {/* Add new person */}
          <div className="pt-3 border-t border-appLine space-y-3">
            <h3 className="text-xl font-bold text-appInk">הוספת איש אמון נוסף</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="שם (למשל: דנה או איתי)"
                className="w-full min-h-[56px] text-lg px-4 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
              />
              <input
                type="text"
                value={newPersonRel}
                onChange={(e) => setNewPersonRel(e.target.value)}
                placeholder="הקשר (חבר, אח, שכן)"
                className="w-full min-h-[56px] text-lg px-4 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
              />
            </div>
            <Btn
              type="button"
              variant="outline"
              onClick={handleAddTrusted}
              className="w-full text-lg font-bold gap-2 min-h-[56px] border-2 border-appLine hover:border-appGreen"
            >
              <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>הוסף לרשימה</span>
            </Btn>
          </div>
        </Card>

        {errorMsg && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-500 text-amber-950 font-semibold text-lg"
          >
            {errorMsg}
          </div>
        )}

        {/* Save button */}
        <div className="pt-2">
          <Btn
            type="submit"
            variant="green"
            className="w-full text-2xl md:text-3xl font-bold py-5 gap-3"
          >
            <Save className="w-7 h-7 shrink-0" aria-hidden="true" />
            <span>שמירת שינויים</span>
          </Btn>
        </div>
      </form>
    </main>
  );
}
