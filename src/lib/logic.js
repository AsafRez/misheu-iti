export const REGIONS_CITIES = [
  {
    region: 'ירושלים והסביבה',
    cities: ['ירושלים', 'בית שמש', 'מעלה אדומים', 'מבשרת ציון והסביבה'],
  },
  {
    region: 'תל אביב וגוש דן',
    cities: [
      'תל אביב - יפו',
      'רמת גן',
      'גבעתיים',
      'בני ברק',
      'חולון',
      'בת ים',
      'פתח תקווה',
      'קריית אונו',
    ],
  },
  {
    region: 'המרכז והשרון',
    cities: [
      'ראשון לציון',
      'נתניה',
      'הרצליה',
      'כפר סבא',
      'רעננה',
      'הוד השרון',
      'רחובות',
      'נס ציונה',
      'מודיעין - מכבים - רעות',
      'רמלה ולוד',
    ],
  },
  {
    region: 'חיפה והצפון',
    cities: [
      'חיפה',
      'הקריות',
      'עכו ונהריה',
      'טבריה והעמקים',
      'נצרת ועפולה',
      'כרמיאל וצפת',
      'קריית שמונה והגליל',
    ],
  },
  {
    region: 'באר שבע והדרום',
    cities: [
      'באר שבע',
      'אשדוד',
      'אשקלון',
      'שדרות ועוטף עזה',
      'נתיבות ואופקים',
      'דימונה וערד',
      'אילת והערבה',
    ],
  },
  {
    region: 'אזורים נוספים',
    cities: ['יהודה ושומרון', 'אזור אחר בארץ'],
  },
];

export function ageGroup(age) {
  const num = Number(age);
  if (num <= 35) return '18–35';
  if (num <= 60) return '36–60';
  return '60+';
}

export const CATS = {
  talk: {
    id: 'talk',
    title: 'מחפשי חיבור ושיח',
    desc: 'שיחות עם חברים ומתנדבים, ומפגשי קפה ושיח.',
  },
  move: {
    id: 'move',
    title: 'שוחרי תנועה וקהילה',
    desc: 'פעילויות בחוץ, קבוצות הליכה וריצה, סדנאות וחוגים.',
  },
  calm: {
    id: 'calm',
    title: 'מחפשי שקט ואיזון',
    desc: 'תרגילי נשימה, התקרקעות וצ׳ק-אין עדין, בלי לחץ חברתי.',
  },
};

export const Q = [
  {
    id: 1,
    title: 'שאלה 1 מתוך 3',
    question: 'מה הכי יעזור לך בימים שבהם מרגיש קצת לבד?',
    options: [
      'שיחה טובה עם מישהו',
      'רגעי שקט והרגעה',
      'לצאת לפעילות או מפגש חברתי',
      'קצת מהכל',
    ],
  },
  {
    id: 2,
    title: 'שאלה 2 מתוך 3',
    question: 'מה מעניין אותך בשעות הפנאי?',
    options: [
      'שיח, קפה והיכרויות',
      'ספורט, הליכה ותנועה',
      'יצירה, מוזיקה ותרבות',
      'התנדבות, משחקי חשיבה וקהילה',
    ],
  },
  {
    id: 3,
    title: 'שאלה 3 מתוך 3',
    question: 'איך נוח לך ליצור קשר?',
    options: [
      'שיחת טלפון',
      'הודעה מוכנה בוואטסאפ',
      'מעדיף/ה כרגע רק תרגילים עצמאיים',
    ],
  },
];

export function assign(age, answers) {
  const scores = { talk: 0, move: 0, calm: 0 };
  const a = answers || [0, 0, 0];

  // Q1
  if (a[0] === 0) scores.talk += 2;
  else if (a[0] === 1) scores.calm += 2;
  else if (a[0] === 2) scores.move += 2;
  // a[0] === 3 gives 0

  // Q2
  if (a[1] === 0) scores.talk += 2;
  else if (a[1] === 1) scores.move += 2;
  else if (a[1] === 2) {
    scores.move += 1;
    scores.talk += 1;
  } else if (a[1] === 3) scores.move += 2;

  // Q3
  if (a[2] === 0 || a[2] === 1) scores.talk += 1;
  else if (a[2] === 2) scores.calm += 2;

  // Age factor
  const numAge = Number(age);
  if (numAge > 60) scores.talk += 1;
  else if (numAge <= 35) scores.move += 1;

  // Tie-breaker: talk, then move, then calm
  if (scores.talk >= scores.move && scores.talk >= scores.calm) {
    return 'talk';
  }
  if (scores.move >= scores.calm) {
    return 'move';
  }
  return 'calm';
}

export function seed(age) {
  const numAge = Number(age);
  const peer = numAge > 60
    ? { n: 'רחל', r: 'שכנה וחברה' }
    : { n: 'נועה', r: 'חברה קרובה' };

  return [
    peer,
    { n: 'דוד', r: 'מתנדב קהילתי' },
    { n: 'אמא', r: 'בן משפחה' },
  ];
}

export const ACTS = [
  {
    id: 'act-1',
    title: 'ערב משחקי קופסה',
    desc: 'קבוצה חמה, שעתיים, 700 מ׳ מהבית',
    cats: ['talk', 'move'],
    ages: ['18–35'],
  },
  {
    id: 'act-2',
    title: 'קבוצת הליכה שכונתית',
    desc: 'פעמיים בשבוע, בקצב נוח',
    cats: ['move', 'calm'],
    ages: ['18–35', '36–60'],
  },
  {
    id: 'act-3',
    title: 'התנדבות קהילתית',
    desc: 'לעזור ולהכיר אנשים טובים',
    cats: ['talk', 'move'],
    ages: ['18–35', '36–60'],
  },
  {
    id: 'act-4',
    title: 'קפה ושיח',
    desc: 'שולחן עגול, בלי לחץ ובלי הכנה',
    cats: ['talk'],
    ages: ['36–60', '60+'],
  },
  {
    id: 'act-5',
    title: 'חוג קרמיקה',
    desc: 'ידיים בחומר ושיחה בצד',
    cats: ['talk', 'calm'],
    ages: ['36–60', '60+'],
  },
  {
    id: 'act-6',
    title: 'הליכת בוקר רגועה',
    desc: 'חצי שעה בפארק, ביחד',
    cats: ['calm', 'move'],
    ages: ['36–60', '60+'],
  },
  {
    id: 'act-7',
    title: 'מעגל נשימה ויוגה עדינה',
    desc: 'שקט, בלי צורך לדבר',
    cats: ['calm'],
    ages: ['18–35', '36–60', '60+'],
  },
  {
    id: 'act-8',
    title: 'ריצה קהילתית קלה',
    desc: 'כל הרמות, עם הפסקות',
    cats: ['move'],
    ages: ['18–35', '36–60'],
  },
];
