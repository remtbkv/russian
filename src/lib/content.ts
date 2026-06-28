// Built-in practice content. Edit freely; the Harvard class material can be
// folded in here (or imported at runtime via the Vocab import box).

export type Lesson = { id: string; title: string; items: string[] }

export const TYPING_LESSONS: Lesson[] = [
  {
    id: 'home',
    title: 'Home row',
    // Only home-row letters. Real words first, then balanced drills.
    items: ["вода рада дала", "пора права правда", "продал плов повар", "вправо оправдал вор", "ров пол вал", "лава дар пар", "опора порода прорва", "пэ лэпэ лов", "лыд рэ рыфа", "жэд жо жа", "лада выж да", "ро по ло", "пыжо жэфо рыво", "фо пор жафа", "парэ жы фыж", "жыв фэво фадэ", "жыда пыжа жыр", "выл фэл во", "жэло вапо вэф", "ва ра фад", "вы дыр фэд", "пэвэ вэп рофэ", "лэфа вэ рэж", "ды вэр лова", "фал вап фы", "фып жыф поф", "лап до фэ", "жофа рад лад", "лы ваф под", "подэ дэв жэ"],
  },
  {
    id: 'top',
    title: 'Top row',
    // Top-row letters incl. ё (backtick on a computer). ъ lives on the bottom row.
    items: ["цех ну не", "гну кеш цук", "нек щёк хён", "зёх неш неке", "хё кёг кез", "кенё хуш хёзу", "кёй цуг шу", "щуз ще цё", "йук хуг хуку", "щё кёзу цуй", "ку нех щук", "хе кух кёц", "гуй нуй зу", "кещ щукё кец", "гук йух зёгу", "щек гей зёц", "зуну ке щеш", "шух ней нёй", "щёху ху шё", "цух неку зец", "зук хугё хег", "цёй щён шуку", "йуш зекё щу", "гёш нё шущ", "гёй зуц йуг", "гу нуще це", "зе хёз йущ", "зух зё хуше", "цёх кё шён", "цугё куй цущ"],
  },
  {
    id: 'bottom',
    title: 'Bottom row',
    // Only bottom-row letters, including ъ (held off ь on iOS) and the signs ь ъ.
    items: ["бить мять чьи", "чисти сить мить", "мючь бь миб", "чи чюб мяс", "сюбя тич чиси", "тючь мичь сь", "чис симь сичь", "чъи бимь ся", "битя бят бючя", "тис чюби бям", "чъя сяб сюбь", "тиси съю чют", "чя чюмю сятя", "тя бяч бя", "бити тячь сють", "ть би чюсь", "сюч тюм сячи", "тюбь сюти мяб", "чь мит бяс", "мис бют сяч", "мют сюм тиб", "тюс чям мяч", "чямю мюб сям", "тюмю чю чити", "бимю тябь тю", "бючь чяс бич", "ми бяти мят", "съи сючю чять", "бит ти тими", "сиб тюбя чить"],
  },
  {
    id: 'words',
    title: 'Common words',
    items: [
      'привет',
      'спасибо',
      'пожалуйста',
      'сегодня',
      'хорошо',
      'человек',
      'работа',
      'время',
      'друг',
      'вода',
      'город',
      'дом',
    ],
  },
  {
    id: 'sentences',
    title: 'Everyday sentences',
    items: [
      'У тебя всё хорошо.',
      'Сегодня хорошая погода.',
      'Я учусь печатать быстро.',
      'Библиотека находится рядом.',
      'Мне нравится читать книги.',
      'Завтра я пойду в бассейн.',
    ],
  },
  {
    id: 'pangram',
    title: 'Pangrams',
    // Only space, comma and period as punctuation, so every char is typeable
    // without a number row. Both exercise ё, ъ and the full letter set.
    items: [
      'Съешь же ещё этих мягких французских булок, да выпей чаю.',
      'Широкая электрификация южных губерний даст мощный толчок подъёму сельского хозяйства.',
    ],
  },
]

export type Prompt = { ru: string; en: string }

export const WRITING_PROMPTS: Prompt[] = [
  { ru: 'Опишите свой обычный день.', en: 'Describe your typical day.' },
  { ru: 'Почему вы изучаете русский язык?', en: 'Why are you studying Russian?' },
  { ru: 'Расскажите о тренировке по прыжкам в воду.', en: 'Describe a diving practice.' },
  { ru: 'Что вы делали на прошлых выходных?', en: 'What did you do last weekend?' },
  { ru: 'Опишите своего лучшего друга.', en: 'Describe your best friend.' },
  {
    ru: 'Согласны ли вы, что технологии делают нас счастливее? Объясните.',
    en: 'Do you agree technology makes us happier? Explain.',
  },
  { ru: 'Какой ваш любимый город и почему?', en: 'Your favorite city and why?' },
]

export const forvoUrl = (w: string) => `https://forvo.com/word/${encodeURIComponent(w)}/#ru`

// ---- Sounds: a set of contrast/practice cards to pick from ----
export type Pair = { a: string; b: string; note: string }
export type SoundGroup = {
  id: string
  title: string
  note: string
  pairs?: Pair[]
  words?: string[]
}

export const SOUND_GROUPS: SoundGroup[] = [
  {
    id: 'sh-shch',
    title: 'ш vs щ',
    note: 'ш is hard, dark, short (tongue back). щ is soft, bright, long (tongue forward). English “sh” sits between them.',
    pairs: [
      { a: 'шит', b: 'щит', note: 'was sewn / shield' },
      { a: 'чаша', b: 'чаща', note: 'bowl / thicket' },
      { a: 'плюш', b: 'плющ', note: 'plush / ivy' },
      { a: 'вешать', b: 'навещать', note: 'to hang / to visit' },
      { a: 'прошу', b: 'прощу', note: 'I ask / I forgive' },
    ],
  },
  {
    id: 'hard-soft',
    title: 'Hard vs soft (palatalization)',
    note: 'A soft consonant (before я е ё ю и or with ь) is said with the tongue raised toward the palate. English has no such pair — the meaning changes.',
    pairs: [
      { a: 'мат', b: 'мать', note: 'checkmate / mother' },
      { a: 'был', b: 'бил', note: 'was / was hitting' },
      { a: 'лук', b: 'люк', note: 'onion / hatch' },
      { a: 'угол', b: 'уголь', note: 'corner / coal' },
      { a: 'нос', b: 'нёс', note: 'nose / carried' },
      { a: 'рад', b: 'ряд', note: 'glad / row' },
    ],
  },
  {
    id: 'y-i',
    title: 'ы vs и',
    note: 'ы is a high, back, unrounded vowel with no English equivalent (tongue pulled back). и is the clear front “ee”. ы also softens nothing; и softens the consonant before it.',
    pairs: [
      { a: 'мыло', b: 'мило', note: 'soap / cute' },
      { a: 'был', b: 'бил', note: 'was / was hitting' },
      { a: 'мышка', b: 'мишка', note: 'mouse / teddy bear' },
      { a: 'рысь', b: 'рис', note: 'lynx / rice' },
      { a: 'сын', b: 'синь', note: 'son / blue' },
    ],
  },
  {
    id: 'e-eh',
    title: 'е vs э',
    note: 'э is an open “e” that keeps the previous consonant hard. е is /ye/ at the start and softens the consonant before it.',
    pairs: [
      { a: 'мэр', b: 'мер', note: 'mayor / of measures' },
      { a: 'сэр', b: 'сер', note: 'sir / grey (short)' },
      { a: 'это', b: 'ел', note: 'this / ate (compare э vs е onset)' },
    ],
  },
  {
    id: 'zh-sh',
    title: 'ж vs ш (voiced / voiceless)',
    note: 'Same mouth position; ж buzzes (voiced), ш hisses (voiceless). Both are always hard.',
    pairs: [
      { a: 'жар', b: 'шар', note: 'heat / balloon' },
      { a: 'жить', b: 'шить', note: 'to live / to sew' },
      { a: 'жесть', b: 'шесть', note: 'tin / six' },
      { a: 'ножи', b: 'ноши', note: 'knives / loads' },
    ],
  },
  {
    id: 'ts-ch',
    title: 'ц vs ч',
    note: 'ц is a hard “ts” (one sound, like “cats”). ч is a soft “ch” (like “cheese”), always soft.',
    pairs: [
      { a: 'цел', b: 'чел', note: 'intact / (slang) dude' },
      { a: 'цвет', b: 'чёт', note: 'colour / even (number)' },
    ],
    words: ['цирк', 'отец', 'улица', 'час', 'чай', 'ночь', 'дочь'],
  },
  {
    id: 'kh',
    title: 'х',
    note: 'A raspy back fricative like the “ch” in Scottish “loch” or German “Bach” — not an English “h”.',
    words: ['хлеб', 'хорошо', 'ухо', 'смех', 'тихо', 'художник', 'хочу'],
  },
  {
    id: 'r-trill',
    title: 'р — the rolled R',
    note: 'A tongue-tip trill. Drill these tongue-twisters slowly, then speed up only while the р stays clean.',
    words: [
      'на дворе трава',
      'на траве дрова',
      'Карл у Клары украл кораллы',
      'тридцать три корабля',
      'ехал Грека через реку',
    ],
  },
  {
    id: 'akanye',
    title: 'Unstressed о → а (akanye)',
    note: 'An unstressed о is reduced toward “a” (and further to a schwa). Listen for how the spelled о is not pronounced “o”.',
    words: ['молоко', 'хорошо', 'корова', 'голова', 'город', 'вода', 'окно'],
  },
  {
    id: 'devoicing',
    title: 'Final devoicing',
    note: 'A voiced consonant at the end of a word becomes voiceless: б→п, д→т, г→к, ж→ш, з→с, в→ф.',
    words: ['хлеб', 'год', 'друг', 'нож', 'мороз', 'зуб', 'кровь'],
  },
]

// Starter deck: common words + transition words for writing.
export const STARTER_DECK: { front: string; back: string; tags: string[] }[] = [
  { front: 'однако', back: 'however', tags: ['transition'] },
  { front: 'поэтому', back: 'therefore, that is why', tags: ['transition'] },
  { front: 'кроме того', back: 'besides, moreover', tags: ['transition'] },
  { front: 'например', back: 'for example', tags: ['transition'] },
  { front: 'во-первых', back: 'firstly', tags: ['transition'] },
  { front: 'во-вторых', back: 'secondly', tags: ['transition'] },
  { front: 'тем не менее', back: 'nevertheless', tags: ['transition'] },
  { front: 'итак', back: 'so, thus (to sum up)', tags: ['transition'] },
  { front: 'таким образом', back: 'in this way, thus', tags: ['transition'] },
  { front: 'несмотря на', back: 'despite', tags: ['transition'] },
  { front: 'в то время как', back: 'while, whereas', tags: ['transition'] },
  { front: 'потому что', back: 'because', tags: ['transition'] },
  { front: 'хотя', back: 'although', tags: ['transition'] },
  { front: 'с другой стороны', back: 'on the other hand', tags: ['transition'] },
  { front: 'в результате', back: 'as a result', tags: ['transition'] },
  { front: 'окружающий', back: 'surrounding', tags: ['common'] },
  { front: 'развитие', back: 'development', tags: ['common'] },
  { front: 'возможность', back: 'opportunity, possibility', tags: ['common'] },
  { front: 'необходимо', back: 'it is necessary', tags: ['common'] },
  { front: 'считать', back: 'to consider, to think', tags: ['common'] },
]
