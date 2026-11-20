import React, { useState, useEffect, useRef } from 'react';
import Scenery from './components/Scenery.jsx';
import Auth from './components/Auth.jsx';
import Home from './components/Home.jsx';
import Connect from './components/Connect.jsx';
import Calm from './components/Calm.jsx';
import Acts from './components/Acts.jsx';
import Profile from './components/Profile.jsx';
import {
  getCurrentUser,
  saveUser,
  updateUser,
  logoutUser,
} from './lib/storage.js';
import { Volume2, LogOut, User, Info } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('home'); // 'home' | 'connect' | 'calm' | 'acts' | 'profile'
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  // Initialize user from storage on mount
  useEffect(() => {
    const active = getCurrentUser();
    if (active) {
      setUser(active);
    }
  }, []);

  const showToast = (msg) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const handleLogin = (newUser) => {
    saveUser(newUser);
    setUser(newUser);
    setRoute('home');
  };

  const handleUpdateUser = (updatedUser) => {
    updateUser(updatedUser);
    setUser(updatedUser);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    logoutUser();
    setUser(null);
    setRoute('home');
  };

  const handleReadScreen = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('הקראת מסך אינה נתמכת בדפדפן זה.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const mainEl = document.getElementById('main-content');
      const rawText = mainEl ? mainEl.innerText || '' : '';
      const cleanText = rawText.replace(/\s+/g, ' ').trim().slice(0, 600);

      if (!cleanText) {
        showToast('לא נמצא טקסט להקראה במסך הנוכחי.');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'he-IL';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      showToast('אירעה שגיאה בהפעלת הקראת המסך.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-appInk selection:bg-amber-300 selection:text-slate-900">
      {/* Background Scenery (Fixed behind all content) */}
      <Scenery />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-appCard/95 backdrop-blur-md border-b-2 border-appLine px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Read Screen Button */}
          <button
            type="button"
            onClick={handleReadScreen}
            aria-label="הקרא לי את המסך בקול"
            className="min-h-[56px] px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-lg md:text-xl flex items-center gap-3 shadow-sm transition-transform active:scale-95 focus-visible:outline-none"
          >
            <Volume2 className="w-7 h-7 shrink-0 text-slate-950" aria-hidden="true" />
            <span>הקרא לי את המסך</span>
          </button>

          {/* User Controls (if logged in) */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setRoute(route === 'profile' ? 'home' : 'profile')}
                aria-pressed={route === 'profile'}
                className={`min-h-[56px] px-5 py-2 rounded-2xl border-2 text-base md:text-lg font-bold flex items-center gap-2 transition-all shadow-sm ${
                  route === 'profile'
                    ? 'bg-appBlue text-white border-appBlue'
                    : 'bg-appCard text-appInk border-appLine hover:border-appBlue'
                }`}
              >
                <User className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>הפרופיל שלי</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="התנתק או החלף משתמש"
                className="min-h-[56px] px-5 py-2 rounded-2xl border-2 border-appLine bg-appCard text-appInk hover:border-red-500 hover:text-red-700 text-base md:text-lg font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>התנתק / החלף משתמש</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content View */}
      <div className="flex-1 pb-28 md:pb-32">
        {!user ? (
          <Auth onLogin={handleLogin} />
        ) : (
          <>
            {route === 'home' && (
              <Home user={user} onNavigate={(nextRoute) => setRoute(nextRoute)} />
            )}
            {route === 'connect' && (
              <Connect
                user={user}
                onBack={() => setRoute('home')}
                showToast={showToast}
              />
            )}
            {route === 'calm' && <Calm onBack={() => setRoute('home')} />}
            {route === 'acts' && (
              <Acts user={user} onBack={() => setRoute('home')} />
            )}
            {route === 'profile' && (
              <Profile
                user={user}
                onUpdateUser={handleUpdateUser}
                onBack={() => setRoute('home')}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>

      {/* Toast Notification Box */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto z-50 bg-appBlue text-white p-4 md:p-5 rounded-3xl shadow-2xl border-2 border-white/20 text-center text-lg md:text-xl font-bold flex items-center justify-center gap-3 animate-bounce"
        >
          <Info className="w-7 h-7 shrink-0 text-amber-300" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-appCard/95 backdrop-blur-md border-t-2 border-appLine px-4 py-3 text-center text-base md:text-lg font-semibold text-appSoft shadow-lg">
        <div className="max-w-4xl mx-auto">
          האפליקציה היא גשר לקשר אנושי ואינה תחליף לטיפול. לעזרה מיידית: ער״ן 1201 | מד״א 101
        </div>
      </footer>
    </div>
  );
}
