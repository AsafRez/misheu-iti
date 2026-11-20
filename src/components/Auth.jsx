import React, { useState } from 'react';
import Card from './Card.jsx';
import Btn from './Btn.jsx';
import { getUsers } from '../lib/storage.js';
import { Q, assign, ageGroup, CATS, seed, REGIONS_CITIES } from '../lib/logic.js';
import { UserCheck, Sparkles, ArrowRight, ArrowLeft, Accessibility, MapPin } from 'lucide-react';

export default function Auth({ onLogin }) {
  const savedUsers = getUsers();
  const [tab, setTab] = useState(savedUsers.length > 0 ? 'login' : 'register');

  // Login state
  const [searchTerm, setSearchTerm] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [step, setStep] = useState(1); // 1: details, 2: Q1, 3: Q2, 4: Q3, 5: summary
  const [regData, setRegData] = useState({
    name: '',
    age: '',
    phone: '',
    city: '',
    needsAssistance: false,
    remember: true,
  });
  const [regError, setRegError] = useState('');
  const [regUnderageMsg, setRegUnderageMsg] = useState('');
  const [regAnswers, setRegAnswers] = useState([0, 0, 0]);

  const handleSelectSavedUser = (user) => {
    onLogin(user);
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setLoginError('נא להקליד שם פרטי או מספר טלפון.');
      return;
    }

    const found = savedUsers.find(
      (u) =>
        u.name.toLowerCase() === term ||
        (u.phone && u.phone.replace(/\D/g, '') === term.replace(/\D/g, ''))
    );

    if (found) {
      onLogin(found);
    } else {
      setLoginError(
        'לא מצאנו פרופיל כזה במכשיר. אפשר לבחור מהרשימה או להירשם.'
      );
    }
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    setRegUnderageMsg('');

    const trimmedName = regData.name.trim();
    if (!trimmedName) {
      setRegError('איך לקרוא לך? אפשר גם שם חיבה.');
      return;
    }

    const ageNum = parseInt(regData.age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setRegError('נא להזין גיל תקין במספרים.');
      return;
    }

    if (ageNum < 18) {
      setRegUnderageMsg(
        'תודה על הכנות. השירות הזה מיועד כרגע לגילאי 18 ומעלה. אם קשה לך עכשיו, ער״ן זמינה בטלפון 1201.'
      );
      return;
    }

    if (!regData.city) {
      setRegError('נא לבחור עיר או אזור מגורים מהרשימה.');
      return;
    }

    setStep(2);
  };

  const handleAnswerClick = (qIndex, optionIndex) => {
    const updated = [...regAnswers];
    updated[qIndex] = optionIndex;
    setRegAnswers(updated);

    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(5);
    }
  };

  const handleFinishRegister = () => {
    const calculatedCategory = assign(regData.age, regAnswers);
    const defaultTrusted = seed(regData.age);

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: regData.name.trim(),
      age: Number(regData.age),
      phone: regData.phone.trim(),
      city: regData.city,
      needsAssistance: Boolean(regData.needsAssistance),
      remember: Boolean(regData.remember),
      answers: regAnswers,
      category: calculatedCategory,
      trusted: defaultTrusted,
    };

    onLogin(newUser);
  };

  const currentCategory = assign(regData.age, regAnswers);
  const userAgeGroup = ageGroup(regData.age);
  const catInfo = CATS[currentCategory] || CATS.talk;

  return (
    <main
      id="main-content"
      className="max-w-2xl mx-auto px-4 py-8 relative z-10"
    >
      <div className="text-center mb-8">
        <h1 className="text-[44px] font-extrabold tracking-tight text-appInk leading-tight mb-3">
          מישהו איתי
        </h1>
        <p className="text-xl md:text-2xl text-appSoft font-normal">
          גשר קטן לקשר אנושי. בלי צ׳אטבוט, בלי שאלונים ארוכים.
        </p>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="אפשרויות כניסה והרשמה"
        className="grid grid-cols-2 gap-3 mb-8 bg-appCard p-2 rounded-3xl border-2 border-appLine shadow-sm"
      >
        <button
          type="button"
          role="tab"
          id="tab-login"
          aria-selected={tab === 'login'}
          aria-controls="panel-login"
          onClick={() => {
            setTab('login');
            setLoginError('');
          }}
          className={`min-h-[64px] rounded-2xl text-xl md:text-2xl font-bold transition-all ${tab === 'login'
              ? 'bg-appBlue text-white shadow-md'
              : 'text-appInk hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          כניסה לחשבון קיים
        </button>

        <button
          type="button"
          role="tab"
          id="tab-register"
          aria-selected={tab === 'register'}
          aria-controls="panel-register"
          onClick={() => {
            setTab('register');
            setRegError('');
            setRegUnderageMsg('');
          }}
          className={`min-h-[64px] rounded-2xl text-xl md:text-2xl font-bold transition-all ${tab === 'register'
              ? 'bg-appBlue text-white shadow-md'
              : 'text-appInk hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
          הרשמה חדשה (פעם אחת בלבד)
        </button>
      </div>

      {/* Login Tab Panel */}
      {tab === 'login' && (
        <Card
          id="panel-login"
          role="tabpanel"
          aria-labelledby="tab-login"
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              פרופילים שמורים במכשיר
            </h2>
            {savedUsers.length > 0 ? (
              <div className="space-y-4">
                {savedUsers.map((user) => (
                  <Btn
                    key={user.id}
                    variant="green"
                    onClick={() => handleSelectSavedUser(user)}
                    className="w-full text-right justify-start text-xl md:text-2xl"
                    ariaLabel={`שלום ${user.name} גיל ${user.age}, לחץ כאן לכניסה`}
                  >
                    <UserCheck className="w-8 h-8 ml-3 shrink-0" aria-hidden="true" />
                    <span>
                      שלום {user.name} ({user.age}), לחץ כאן לכניסה
                    </span>
                  </Btn>
                ))}
              </div>
            ) : (
              <p className="text-lg text-appSoft py-2">
                אין עדיין פרופילים שמורים במכשיר זה. ניתן להירשם בקלות בלשונית ״הרשמה חדשה״.
              </p>
            )}
          </div>

          <hr className="border-appLine" />

          {/* Manual search / login */}
          <form onSubmit={handleManualLogin} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="login-search"
                className="block text-xl md:text-2xl font-bold mb-3"
              >
                או הקלדת שם פרטי / מספר טלפון
              </label>
              <input
                id="login-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="למשל: יוסף או 0501234567"
                className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
              />
            </div>

            {loginError && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-500 text-amber-950 font-semibold text-lg"
              >
                {loginError}
              </div>
            )}

            <Btn
              type="submit"
              variant="blue"
              className="w-full text-xl md:text-2xl"
            >
              כניסה לחשבון
            </Btn>
          </form>
        </Card>
      )}

      {/* Register Tab Panel */}
      {tab === 'register' && (
        <Card
          id="panel-register"
          role="tabpanel"
          aria-labelledby="tab-register"
        >
          {step === 1 && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6" noValidate>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  הרשמה קצרה ופשוטה
                </h2>
                <p className="text-lg text-appSoft">
                  שלב 1 מתוך 4: פרטים ראשוניים
                </p>
              </div>

              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xl font-bold mb-2"
                >
                  שם פרטי (או כינוי) <span className="text-red-600">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={regData.name}
                  onChange={(e) =>
                    setRegData({ ...regData, name: e.target.value })
                  }
                  placeholder="איך לפנות אליך?"
                  className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-age"
                  className="block text-xl font-bold mb-2"
                >
                  גיל <span className="text-red-600">*</span>
                </label>
                <input
                  id="reg-age"
                  type="number"
                  min="1"
                  max="120"
                  value={regData.age}
                  onChange={(e) =>
                    setRegData({ ...regData, age: e.target.value })
                  }
                  placeholder="גיל במספרים"
                  className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="block text-xl font-bold mb-2"
                >
                  מספר טלפון (לא חובה)
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={regData.phone}
                  onChange={(e) =>
                    setRegData({ ...regData, phone: e.target.value })
                  }
                  placeholder="למשל: 050-0000000"
                  className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-city"
                  className="block text-xl font-bold mb-2"
                >
                  אזור מגורים / עיר <span className="text-red-600">*</span>
                </label>
                <select
                  id="reg-city"
                  value={regData.city}
                  onChange={(e) =>
                    setRegData({ ...regData, city: e.target.value })
                  }
                  className="w-full min-h-[64px] text-xl px-5 rounded-2xl border-2 border-appLine bg-appBg text-appInk focus-visible:outline-none focus:border-appBlue cursor-pointer"
                >
                  <option value="">נא לבחור אזור ועיר מהרשימה</option>
                  {REGIONS_CITIES.map((group) => (
                    <optgroup key={group.region} label={group.region}>
                      {group.cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Checkbox for disability assistance */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-appBg border-2 border-appLine">
                <input
                  id="reg-disability"
                  type="checkbox"
                  checked={regData.needsAssistance}
                  onChange={(e) =>
                    setRegData({ ...regData, needsAssistance: e.target.checked })
                  }
                  className="mt-1 shrink-0"
                />
                <label
                  htmlFor="reg-disability"
                  className="text-lg md:text-xl font-bold cursor-pointer text-appInk leading-snug"
                >
                  האם המשתמש שנרשם צריך סיוע עקב הנכות שלו
                </label>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <input
                  id="reg-remember"
                  type="checkbox"
                  checked={regData.remember}
                  onChange={(e) =>
                    setRegData({ ...regData, remember: e.target.checked })
                  }
                />
                <label
                  htmlFor="reg-remember"
                  className="text-lg md:text-xl font-medium cursor-pointer"
                >
                  שמור את הפרטים שלי במכשיר הזה כדי שלא אצטרך להירשם מחדש
                </label>
              </div>

              {regError && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-500 text-amber-950 font-semibold text-lg"
                >
                  {regError}
                </div>
              )}

              {regUnderageMsg && (
                <div
                  role="alert"
                  className="p-5 rounded-2xl bg-red-100 border-2 border-red-500 text-red-950 font-semibold text-lg leading-relaxed"
                >
                  {regUnderageMsg}
                </div>
              )}

              {!regUnderageMsg && (
                <Btn
                  type="submit"
                  variant="blue"
                  className="w-full text-xl md:text-2xl"
                >
                  המשך לשאלון ההתאמה
                </Btn>
              )}
            </form>
          )}

          {/* Steps 2-4: Questions */}
          {step >= 2 && step <= 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-4 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-appInk text-lg font-bold mb-2">
                    {Q[step - 2].title}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-appInk">
                    {Q[step - 2].question}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {Q[step - 2].options.map((option, idx) => (
                  <Btn
                    key={idx}
                    variant="outline"
                    onClick={() => handleAnswerClick(step - 2, idx)}
                    className="w-full text-right justify-start text-xl md:text-2xl p-5 hover:border-appBlue hover:bg-sky-50 dark:hover:bg-sky-950/40"
                  >
                    <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-appBlue text-white text-lg font-bold ml-4">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-appInk">{option}</span>
                  </Btn>
                ))}
              </div>

              <div className="pt-4 flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-2 text-lg text-appSoft hover:text-appInk font-bold p-2"
                >
                  <ArrowRight className="w-6 h-6" aria-hidden="true" />
                  <span>חזרה לשלב הקודם</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-appGreen">
                <Sparkles className="w-12 h-12" aria-hidden="true" />
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-appInk">
                תודה, {regData.name}. התאמנו לך מסלול:
              </h2>

              <div className="p-6 rounded-3xl bg-appBg border-2 border-appGreen text-right space-y-3">
                <span className="inline-block px-3 py-1 text-sm font-bold rounded-lg bg-appGreen text-white">
                  המסלול הנבחר
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-appGreen">
                  {catInfo.title}
                </h3>
                <p className="text-xl text-appInk font-medium leading-relaxed">
                  {catInfo.desc}
                </p>
                <p className="text-lg text-appSoft pt-2 border-t border-appLine">
                  מותאם לגילאי {userAgeGroup}. תמיד אפשר לשנות בהמשך.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-base font-semibold">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-appInk">
                    <MapPin className="w-4 h-4 text-appBlue" aria-hidden="true" />
                    <span>אזור: {regData.city}</span>
                  </span>
                  {regData.needsAssistance && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200">
                      <Accessibility className="w-4 h-4" aria-hidden="true" />
                      <span>רשום סיוע עקב נכות</span>
                    </span>
                  )}
                </div>
              </div>

              <Btn
                variant="green"
                onClick={handleFinishRegister}
                className="w-full text-2xl md:text-3xl font-bold py-5"
              >
                בואו נתחיל
              </Btn>
            </div>
          )}
        </Card>
      )}
    </main>
  );
}
