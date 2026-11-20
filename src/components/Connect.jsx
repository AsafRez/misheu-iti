import React, { useState } from 'react';
import Card from './Card.jsx';
import Btn from './Btn.jsx';
import Back from './Back.jsx';
import { Phone, MessageSquare, PhoneOff, UserCheck } from 'lucide-react';

export default function Connect({ user, onBack, showToast }) {
  const [activeCallPerson, setActiveCallPerson] = useState(null);
  const trustedList = user?.trusted || [];

  const handleSendMessage = (person) => {
    showToast(`נשלחה הודעה אל ${person.n}: ״היי, אשמח שנדבר כשתתפנה״`);
  };

  return (
    <main
      id="main-content"
      className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6 relative z-10"
    >
      <Back onBack={onBack} />

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-appInk">
          אני רוצה לדבר
        </h1>
        <p className="text-xl text-appSoft">
          אנשי האמון שלך כאן לשמוע אותך. אפשר להתקשר או לשלוח הודעה בלחיצה אחת.
        </p>
      </div>

      <div className="space-y-5" role="feed" aria-label="רשימת אנשי אמון">
        {trustedList.map((person, index) => (
          <Card key={index} as="article" className="space-y-4 border-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/50 text-appBlue flex items-center justify-center shrink-0">
                <UserCheck className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-[28px] font-extrabold text-appInk leading-tight">
                  {person.n}
                </h2>
                <p className="text-[20px] font-medium text-appSoft">
                  {person.r}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Btn
                variant="green"
                onClick={() => setActiveCallPerson(person)}
                ariaLabel={`התקשר עכשיו אל ${person.n}`}
                className="w-full text-xl md:text-2xl gap-3"
              >
                <Phone className="w-6 h-6 shrink-0" aria-hidden="true" />
                <span>התקשר עכשיו</span>
              </Btn>

              <Btn
                variant="outline"
                onClick={() => handleSendMessage(person)}
                ariaLabel={`שלח הודעה מוכנה אל ${person.n}`}
                className="w-full text-xl md:text-2xl gap-3 border-2 border-appLine hover:border-appBlue"
              >
                <MessageSquare className="w-6 h-6 shrink-0 text-appBlue" aria-hidden="true" />
                <span>שלח הודעה מוכנה</span>
              </Btn>
            </div>
          </Card>
        ))}

        {trustedList.length === 0 && (
          <Card className="text-center py-10 space-y-3">
            <p className="text-xl font-bold">אין עדיין אנשי אמון ברשימה.</p>
            <p className="text-lg text-appSoft">
              אנשי האמון שלך יופיעו כאן ליצירת קשר מהיר.
            </p>
          </Card>
        )}
      </div>

      {/* Modal Dialog for Active Call */}
      {activeCallPerson && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="call-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-appCard text-appInk max-w-md w-full rounded-3xl p-8 border-2 border-appLine shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-appGreen flex items-center justify-center animate-pulse">
              <Phone className="w-10 h-10" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2
                id="call-dialog-title"
                className="text-2xl md:text-3xl font-extrabold text-appInk"
              >
                מחייג אל {activeCallPerson.n}…
              </h2>
              <p className="text-xl text-appSoft font-medium">
                זו הדגמה של שיחה פעילה.
              </p>
            </div>

            <div className="pt-2">
              <Btn
                variant="clay"
                onClick={() => setActiveCallPerson(null)}
                className="w-full text-xl md:text-2xl gap-3 bg-red-700 hover:bg-red-800"
              >
                <PhoneOff className="w-6 h-6 shrink-0" aria-hidden="true" />
                <span>סיום שיחה</span>
              </Btn>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
