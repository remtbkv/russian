// Russian grammar reference. Structured so the Grammar module can render a
// skimmable, grouped guide. Text supports **bold** inline. Cyrillic in examples
// is rendered in the serif (cyr) font by the module.

export type Example = { ru: string; en: string; note?: string }
export type GTable = { caption?: string; headers: string[]; rows: string[][] }
export type Block =
  | { p: string }
  | { list: string[] }
  | { table: GTable }
  | { ex: Example[] }
  | { note: string }

export type Topic = { id: string; title: string; blocks: Block[] }
export type GrammarGroup = { id: string; title: string; topics: Topic[] }

export const GRAMMAR: GrammarGroup[] = [
  // ------------------------------------------------------------------ BASICS
  {
    id: 'basics',
    title: 'Foundations',
    topics: [
      {
        id: 'big-picture',
        title: 'How Russian works (the big picture)',
        blocks: [
          {
            p: 'Russian is an **inflected** language: the *endings* of nouns, adjectives, pronouns and verbs change to show their job in the sentence. Because endings carry the grammar, **word order is flexible** and a few small words English needs are simply absent.',
          },
          {
            list: [
              '**No articles.** There is no *a/an* or *the*. `книга` = "a book" or "the book" depending on context.',
              '**No present-tense "to be."** `Я студент` = "I am a student." `быть` (to be) is dropped in the present.',
              '**Six cases.** A noun takes a different ending depending on its role (subject, object, possession, etc.).',
              '**Two verb aspects.** Almost every verb comes in an imperfective/perfective pair — process vs. completed result.',
              '**Three genders** (masculine, feminine, neuter) that drive adjective and past-tense agreement.',
            ],
          },
          {
            ex: [
              { ru: 'Я инженер.', en: 'I am an engineer.', note: 'no "am", no article' },
              { ru: 'Москва — большой город.', en: 'Moscow is a big city.', note: 'dash replaces "is" between two nouns' },
            ],
          },
        ],
      },
      {
        id: 'spelling-rules',
        title: 'Spelling rules (memorize these)',
        blocks: [
          {
            p: 'These override the "expected" ending all over the grammar — they explain why a feminine ending is sometimes -и not -ы, etc.',
          },
          {
            list: [
              '**Spelling rule 1 (и/ы):** after **г к х** and **ж ш щ ч**, write **и**, never **ы**. (книга → книги, not книгы)',
              '**Spelling rule 2 (о/е after hushers):** after **ж ш щ ч ц**, write **о** only when stressed, otherwise **е**. (хорошо but хорошее)',
              '**Spelling rule 3 (no я/ю after hushers/velars):** after **г к х ж ш щ ч**, write **а/у**, never **я/ю**. (слышу, not слышю)',
            ],
          },
          {
            note: 'Whenever a table below "should" give -ы, -я, -ю or unstressed -о after one of those consonants, swap per these rules.',
          },
        ],
      },
      {
        id: 'stress-reduction',
        title: 'Stress & vowel reduction',
        blocks: [
          {
            p: 'Stress is **mobile and unpredictable** — it can shift between forms of the same word, and it changes pronunciation. Unstressed vowels reduce:',
          },
          {
            list: [
              'Unstressed **о** is pronounced like **а** (молоко ≈ "malako").',
              'Unstressed **е/я** drift toward a short **и** sound.',
              'Stress can move the meaning: **за́мок** (castle) vs **замо́к** (lock).',
            ],
          },
          {
            note: 'Russian text normally omits the stress mark; you learn stress per word. Dictionaries and this guide mark it only where it matters.',
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ NOUNS
  {
    id: 'nouns',
    title: 'Nouns',
    topics: [
      {
        id: 'gender',
        title: 'Gender',
        blocks: [
          { p: 'Every noun is masculine, feminine or neuter. You can usually tell from the **nominative (dictionary) ending**:' },
          {
            table: {
              headers: ['Gender', 'Typical ending', 'Examples'],
              rows: [
                ['Masculine', 'consonant, -й', 'стол (table), музей (museum), папа*'],
                ['Feminine', '-а, -я', 'книга (book), неделя (week), мама'],
                ['Neuter', '-о, -е, -мя', 'окно (window), море (sea), имя (name)'],
                ['Soft sign -ь', 'masc OR fem', 'словарь (m), дверь (f) — learn each'],
              ],
            },
          },
          {
            list: [
              '*Nouns for males are masculine regardless of ending: **папа, дядя, мужчина** are masculine.',
              'Nouns in **-ь** can be either gender — memorize them (a useful pattern: -ость nouns are feminine: новость, радость).',
              'Words like **кофе** (m) are exceptions worth noting.',
            ],
          },
        ],
      },
      {
        id: 'plural',
        title: 'Plural (nominative)',
        blocks: [
          {
            table: {
              caption: 'Forming the nominative plural',
              headers: ['Singular type', 'Plural ending', 'Example'],
              rows: [
                ['Masc. consonant', '-ы (-и by rule 1)', 'стол → столы, друг → друзья*'],
                ['Masc/Fem -й, -ь, -я', '-и', 'музей → музеи, дверь → двери'],
                ['Fem -а', '-ы (-и by rule 1)', 'книга → книги, лампа → лампы'],
                ['Neuter -о', '-а', 'окно → окна, слово → слова'],
                ['Neuter -е', '-я', 'море → моря, поле → поля'],
              ],
            },
          },
          {
            list: [
              'Stress often shifts in the plural: **окно́ → о́кна**, **стол → столы́**.',
              'Common irregular plurals: **дом → дома́, город → города́, глаз → глаза́, брат → братья, друг → друзья, сын → сыновья, ребёнок → дети, человек → люди, мать → матери, дочь → дочери**.',
            ],
          },
        ],
      },
      {
        id: 'animacy',
        title: 'Animacy',
        blocks: [
          {
            p: '**Animate** nouns (people, animals) behave differently from **inanimate** ones in the *accusative* case: for animates, accusative = genitive. This is one of the most common sources of "wrong-ending" mistakes.',
          },
          {
            ex: [
              { ru: 'Я вижу стол.', en: 'I see a table.', note: 'inanimate: acc = nominative' },
              { ru: 'Я вижу студент**а**.', en: 'I see a student.', note: 'animate masc: acc = genitive' },
              { ru: 'Я люблю собак.', en: 'I love dogs.', note: 'animate plural: acc = gen' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ CASES OVERVIEW
  {
    id: 'cases',
    title: 'The cases',
    topics: [
      {
        id: 'case-overview',
        title: 'Overview — the six cases',
        blocks: [
          { p: 'A case is a *role*. The same noun changes ending to mark its role. Learn each case as **(1) what it means** and **(2) what triggers it**.' },
          {
            table: {
              headers: ['Case', 'Core meaning', 'Question'],
              rows: [
                ['Nominative', 'the subject', 'кто? что? (who/what)'],
                ['Genitive', 'of / possession / absence', 'кого? чего?'],
                ['Dative', 'to/for — the recipient', 'кому? чему?'],
                ['Accusative', 'the direct object', 'кого? что?'],
                ['Instrumental', 'by/with — the means', 'кем? чем?'],
                ['Prepositional', 'about / location (only after prepositions)', 'о ком? о чём? где?'],
              ],
            },
          },
        ],
      },
      {
        id: 'decl-masc-neut',
        title: 'Declension — masculine & neuter (singular)',
        blocks: [
          {
            table: {
              caption: 'стол (table, m. inanim.), студент (student, m. anim.), окно (window, n.)',
              headers: ['Case', 'Masc. inanim.', 'Masc. anim.', 'Neuter'],
              rows: [
                ['Nom', 'стол', 'студент', 'окно'],
                ['Gen', 'стола', 'студента', 'окна'],
                ['Dat', 'столу', 'студенту', 'окну'],
                ['Acc', 'стол (=nom)', 'студента (=gen)', 'окно (=nom)'],
                ['Ins', 'столом', 'студентом', 'окном'],
                ['Prep', 'столе', 'студенте', 'окне'],
              ],
            },
          },
          {
            list: [
              'Soft-stem masc (-й/-ь) and neuter -е take soft endings: музей → музея, музею, музеем, (о) музее; море → моря, морю, морем, (о) море.',
              'After a husher, instrumental -ом becomes -ем when unstressed (rule 2): муж → му́жем.',
            ],
          },
        ],
      },
      {
        id: 'decl-fem',
        title: 'Declension — feminine (singular)',
        blocks: [
          {
            table: {
              caption: 'книга (book, -а), неделя (week, -я), дверь (door, -ь)',
              headers: ['Case', '-а stem', '-я stem', '-ь stem'],
              rows: [
                ['Nom', 'книга', 'неделя', 'дверь'],
                ['Gen', 'книги*', 'недели', 'двери'],
                ['Dat', 'книге', 'неделе', 'двери'],
                ['Acc', 'книгу', 'неделю', 'дверь'],
                ['Ins', 'книгой', 'неделей', 'дверью'],
                ['Prep', 'книге', 'неделе', 'двери'],
              ],
            },
          },
          { note: '*книги (not книгы) by spelling rule 1. Feminine -ь nouns keep one form for gen/dat/prep: -и.' },
        ],
      },
      {
        id: 'decl-plural',
        title: 'Declension — plural (all genders)',
        blocks: [
          {
            table: {
              caption: 'столы (m), книги (f), окна (n)',
              headers: ['Case', 'Masc.', 'Fem.', 'Neuter'],
              rows: [
                ['Nom', 'столы', 'книги', 'окна'],
                ['Gen', 'столов', 'книг', 'окон'],
                ['Dat', 'столам', 'книгам', 'окнам'],
                ['Acc', '=nom / =gen if animate', 'книги', 'окна'],
                ['Ins', 'столами', 'книгами', 'окнами'],
                ['Prep', 'столах', 'книгах', 'окнах'],
              ],
            },
          },
          {
            p: '**Dative/Instrumental/Prepositional plural are uniform** across genders: -ам / -ами / -ах (soft: -ям / -ями / -ях). Only the **genitive plural** is hard:',
          },
          {
            list: [
              'Masc. consonant → **-ов** (столов); after -й/husher → **-ев/-ей** (музеев, ножей).',
              'Fem -а and neut -о → **zero ending**, often with an inserted vowel: книг, окон, девушка → девушек, окно → окон.',
              'Soft fem -я / fem -ь / neut -е → **-ь / -ей**: недель, дверей, морей.',
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ CASE USAGE
  {
    id: 'case-usage',
    title: 'When to use each case',
    topics: [
      {
        id: 'use-nom',
        title: 'Nominative',
        blocks: [
          { list: ['The **subject** of the verb.', 'The **predicate noun** after a dropped present-tense "to be".'] },
          { ex: [{ ru: 'Студент читает.', en: 'The student is reading.' }, { ru: 'Это мой брат.', en: 'This is my brother.' }] },
        ],
      },
      {
        id: 'use-gen',
        title: 'Genitive — the workhorse',
        blocks: [
          {
            list: [
              '**Possession / "of":** книга студента (the student\'s book).',
              '**Absence / negation of existence:** with **нет / не было / не будет**: У меня нет времени (I have no time).',
              '**Quantity & measurement:** много, мало, сколько, стакан + gen: чашка чая, много людей.',
              '**After numbers 2/3/4 → gen singular; 5+ → gen plural** (see Numerals).',
              '**After many prepositions:** из, от, до, у, без, для, около, после, кроме, вместо.',
              '**Dates ("of"):** первого мая (on the first of May).',
            ],
          },
          {
            ex: [
              { ru: 'У меня нет машины.', en: 'I don\'t have a car.', note: 'нет + genitive' },
              { ru: 'Чашка кофе, пожалуйста.', en: 'A cup of coffee, please.' },
              { ru: 'Он пришёл из школы.', en: 'He came from school.', note: 'из + gen' },
            ],
          },
        ],
      },
      {
        id: 'use-dat',
        title: 'Dative',
        blocks: [
          {
            list: [
              'The **indirect object** — the recipient ("to/for"): Я дал книгу другу.',
              '**Liking / needing** with **нравиться, нужен, можно, надо, нельзя**: Мне нравится музыка.',
              '**Age:** Мне двадцать лет (I am 20).',
              '**Impersonal state:** Мне холодно (I\'m cold), Ему скучно.',
              '**Prepositions к (toward) and по (along/according to).**',
            ],
          },
          {
            ex: [
              { ru: 'Я звоню маме.', en: 'I am calling Mom.', note: 'recipient → dative' },
              { ru: 'Ему двадцать лет.', en: 'He is twenty.' },
              { ru: 'Нам нужно идти.', en: 'We need to go.' },
            ],
          },
        ],
      },
      {
        id: 'use-acc',
        title: 'Accusative',
        blocks: [
          {
            list: [
              'The **direct object** of a transitive verb: Я читаю книгу.',
              'Remember **animacy**: animate masc/all plural → acc = genitive.',
              '**Direction "to"** with **в / на** (motion): Я иду в школу.',
              '**Duration / repeated time:** всю неделю, каждый день, в среду.',
            ],
          },
          {
            ex: [
              { ru: 'Я люблю русский язык.', en: 'I love the Russian language.' },
              { ru: 'Мы едем в Москву.', en: 'We are going to Moscow.', note: 'в + acc = direction' },
            ],
          },
        ],
      },
      {
        id: 'use-ins',
        title: 'Instrumental',
        blocks: [
          {
            list: [
              '**By means of / with (an instrument):** Я пишу ручкой (I write with a pen).',
              '**Accompaniment with с:** кофе с молоком, с другом.',
              '**Profession after быть/стать/работать:** Он стал врачом; Она работает учителем.',
              '**Predicate after past/future "to be":** Он был студентом.',
              '**Prepositions с, над, под, перед, за, между.**',
            ],
          },
          {
            ex: [
              { ru: 'Я ем суп ложкой.', en: 'I eat soup with a spoon.', note: 'tool → instrumental (no preposition)' },
              { ru: 'Чай с лимоном.', en: 'Tea with lemon.', note: 'с + instrumental' },
              { ru: 'Она хочет стать врачом.', en: 'She wants to become a doctor.' },
            ],
          },
        ],
      },
      {
        id: 'use-prep',
        title: 'Prepositional',
        blocks: [
          {
            p: 'The only case that **never appears without a preposition**. Two main uses:',
          },
          {
            list: [
              '**Location "in/on"** with **в / на**: в Москве, на работе.',
              '**"About"** with **о / об**: Мы говорим о книге.',
            ],
          },
          {
            ex: [
              { ru: 'Книга на столе.', en: 'The book is on the table.', note: 'на + prep = location' },
              { ru: 'Я думаю о тебе.', en: 'I am thinking about you.' },
            ],
          },
          {
            note: 'Same в/на take **accusative for direction** (where to) but **prepositional for location** (where at). в школу = to school; в школе = at school.',
          },
        ],
      },
      {
        id: 'prepositions-table',
        title: 'Prepositions by case',
        blocks: [
          {
            table: {
              headers: ['Case', 'Common prepositions'],
              rows: [
                ['Genitive', 'из, от, до, у, без, для, около, после, кроме, против, вокруг'],
                ['Dative', 'к (toward), по (along/by)'],
                ['Accusative', 'в/на (direction), через, за (in exchange for), про'],
                ['Instrumental', 'с (with), над, под, перед, за, между'],
                ['Prepositional', 'в/на (location), о/об (about), при'],
              ],
            },
          },
          { note: 'в, на, за, под take **accusative** for motion/direction and another case (prep/instr) for static location.' },
        ],
      },
    ],
  },

  // ------------------------------------------------- EXISTENCE & IMPERSONALS
  {
    id: 'existence',
    title: 'Having & impersonals',
    topics: [
      {
        id: 'have-есть-нет',
        title: 'Having / not having (У + Gen)',
        blocks: [
          {
            p: 'Russian has no verb "to have." Possession is **У + genitive (the owner) + есть + nominative (the thing)**. The owner is the *logical subject* (genitive after У); the thing owned is the *logical object* and the **grammatical subject in the nominative**.',
          },
          {
            table: {
              caption: 'Existence/having vs. absence/lacking — the verb flips the case of the thing',
              headers: ['', 'There IS / has', 'There is NO / lacks'],
              rows: [
                ['Marker', 'есть + Nominative', 'нет + Genitive'],
                ['Present', 'У меня есть машина', 'У меня нет машины'],
                ['Past', 'был / была / было / были', 'не́ было (always neuter sg)'],
                ['Future', 'будет / будут', 'не бу́дет (always sg)'],
              ],
            },
          },
          {
            list: [
              'In the **positive**, the verb agrees with the nominative thing: У Пушкина **были** дети.',
              'In the **negative**, the thing goes to **genitive** and the verb is frozen: **не́ было** (past), **не бу́дет** (future) — never agree.',
              '**У + Gen** also = "at someone\'s place": Он у врача́ (he\'s at the doctor\'s); Мы ужинали у друга.',
              'Drop **есть** when the thing, not its existence, is the point: У меня **краси́вая** маши́на (I have a *nice* car — existence already assumed).',
            ],
          },
          {
            ex: [
              { ru: 'У нас в городе есть бассейн.', en: 'There is a pool in our town.' },
              { ru: 'Вчера у меня не́ было времени.', en: "Yesterday I had no time.", note: 'не было + genitive' },
              { ru: 'Завтра у него не бу́дет компьютера.', en: "Tomorrow he won't have a computer." },
            ],
          },
        ],
      },
      {
        id: 'impersonal-modals',
        title: 'Need, must, may — modals & impersonals',
        blocks: [
          {
            p: 'Many "must / need / may / can" ideas use an **impersonal** construction: no nominative subject, the person goes in the **dative**, and the verb is **было** (past) / **бу́дет** (future).',
          },
          {
            table: {
              headers: ['Word', 'Meaning', 'Construction'],
              rows: [
                ['нужно / надо', 'need to, should', 'Dat + нужно + infinitive'],
                ['можно', 'may, it is possible', '(Dat) + можно + infinitive'],
                ['нельзя', "may not, can't", '(Dat) + нельзя + infinitive'],
                ['нужен / нужна / нужно / нужны', 'need (a thing)', 'Dat + нужен + Nominative thing'],
                ['должен / должна / должны', 'must, obliged', 'Nominative + должен + infinitive'],
                ['мочь / уметь', 'be able / know how', 'Nominative subject + infinitive'],
              ],
            },
          },
          {
            list: [
              '**можно / нельзя + imperfective** = permission/prohibition; **+ perfective** = possibility/impossibility: Здесь нельзя кури́ть (not allowed); Это нельзя сде́лать (impossible).',
              '**нужен** is a short adjective and agrees with the nominative thing: Мне нужна́ маши́на; Мне нужны́ де́ньги.',
              '**должен** agrees with the nominative subject (должен/должна/должно/должны) and takes быть in past/future: Я должна́ была́ позвони́ть.',
            ],
          },
          {
            ex: [
              { ru: 'Всем студентам нужно больше отдыхать.', en: 'All students need to rest more.' },
              { ru: 'Мне нужно было быть дома.', en: 'I had to be at home.', note: 'было — past' },
              { ru: 'Можно взять эту книгу?', en: 'May I take this book?', note: 'perfective = asking permission now' },
              { ru: 'Он должен сдать экзамен.', en: 'He must pass the exam.' },
            ],
          },
        ],
      },
      {
        id: 'impersonal-state',
        title: 'Weather, feelings & age',
        blocks: [
          {
            p: 'State-of-the-world and how-someone-feels use an **adverb** with no subject; the experiencer (if any) is **dative**. Past = **было**, future = **бу́дет**.',
          },
          {
            ex: [
              { ru: 'На улице хо́лодно.', en: 'It is cold outside.', note: 'no "it", no subject' },
              { ru: 'Мне хо́лодно.', en: 'I am cold.', note: 'experiencer → dative' },
              { ru: 'Нам было ску́чно на лекции.', en: 'We were bored at the lecture.' },
              { ru: 'Трудно говорить по-русски?', en: 'Is it hard to speak Russian?' },
            ],
          },
          {
            p: '**Age** is also dative — the person is in the dative, the number takes год / го́да / лет (1 / 2–4 / 5+):',
          },
          {
            ex: [
              { ru: 'Мне два́дцать оди́н год.', en: 'I am 21.' },
              { ru: 'Моему папе шестьдеся́т два го́да.', en: 'My dad is 62.' },
              { ru: 'Когда вам было десять лет…', en: 'When you were ten…', note: 'было — past' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ ADJECTIVES
  {
    id: 'adjectives',
    title: 'Adjectives',
    topics: [
      {
        id: 'adj-agreement',
        title: 'Agreement',
        blocks: [
          { p: 'An adjective **agrees with its noun in gender, number and case**. Dictionary form is masculine nominative (-ый/-ой/-ий).' },
          {
            ex: [
              { ru: 'новый дом', en: 'a new house (m)' },
              { ru: 'новая машина', en: 'a new car (f)' },
              { ru: 'новое окно', en: 'a new window (n)' },
              { ru: 'новые дома', en: 'new houses (pl)' },
            ],
          },
        ],
      },
      {
        id: 'adj-decl',
        title: 'Adjective declension (hard stem)',
        blocks: [
          {
            table: {
              caption: 'новый (new) — hard stem',
              headers: ['Case', 'Masc.', 'Neuter', 'Fem.', 'Plural'],
              rows: [
                ['Nom', 'новый', 'новое', 'новая', 'новые'],
                ['Gen', 'нового', 'нового', 'новой', 'новых'],
                ['Dat', 'новому', 'новому', 'новой', 'новым'],
                ['Acc', '=nom/=gen', 'новое', 'новую', '=nom/=gen'],
                ['Ins', 'новым', 'новым', 'новой', 'новыми'],
                ['Prep', 'новом', 'новом', 'новой', 'новых'],
              ],
            },
          },
          {
            list: [
              'In -его/-ого endings the **г is pronounced "v"**: нового ≈ "novava".',
              'Soft-stem adjectives (синий — blue) swap to soft vowels: синего, синему, синяя, синее, синие…',
              'Stressed-ending adjectives end -ой in masc nom: большой, молодой.',
              'Spelling rules apply: русский (not русскый), хорошее (not хорошоe unstressed).',
            ],
          },
        ],
      },
      {
        id: 'adj-short',
        title: 'Short-form adjectives',
        blocks: [
          {
            p: 'Many adjectives have a **short (predicate) form** used only after the noun, never before it. It marks a temporary state or is the standard form for certain adjectives.',
          },
          {
            ex: [
              { ru: 'Он болен.', en: 'He is sick.', note: 'болен/больна/больно/больны' },
              { ru: 'Задача трудна.', en: 'The task is difficult.' },
              { ru: 'Я рад.', en: 'I am glad.', note: 'рад/рада/рады — only short form exists' },
            ],
          },
        ],
      },
      {
        id: 'adj-compare',
        title: 'Comparative & superlative',
        blocks: [
          {
            list: [
              '**Comparative (predicate):** usually add **-ее**: быстрый → быстре́е, краси́вый → краси́вее.',
              '**Many take a consonant mutation + -е** instead — learn these: доро́же (dear), деше́вле (cheap), вы́ше (high), ти́ше (quiet), ле́гче (easy), гро́мче (loud), моло́же (young), ча́ще (often), ре́же (rare), до́льше (long), ра́ньше (early), по́зже (late).',
              '**Suppletive irregulars:** хоро́ший → лу́чше, плохо́й → ху́же, большо́й → бо́льше, ма́ленький → ме́ньше.',
              '**"than"** = **чем** (+ same case) OR drop чем and put the second item in **genitive**: Он ста́рше, чем я = Он ста́рше меня́.',
              '**Attributive comparative:** бо́лее + adjective (бо́лее интере́сный).',
              '**Superlative:** **са́мый** + adjective (са́мый большо́й) — самый agrees fully.',
            ],
          },
          {
            ex: [
              { ru: 'Этот фильм интере́снее.', en: 'This film is more interesting.' },
              { ru: 'Она говори́т лу́чше меня́.', en: 'She speaks better than me.', note: 'genitive after comparative' },
              { ru: 'Метро деше́вле, чем такси́.', en: 'The metro is cheaper than a taxi.', note: 'mutation в → вл' },
              { ru: 'Это са́мый высо́кий дом.', en: 'This is the tallest house.' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ PRONOUNS
  {
    id: 'pronouns',
    title: 'Pronouns',
    topics: [
      {
        id: 'pron-personal',
        title: 'Personal pronouns (full declension)',
        blocks: [
          {
            table: {
              headers: ['Case', 'I', 'you (sg)', 'he/it', 'she', 'we', 'you (pl)', 'they'],
              rows: [
                ['Nom', 'я', 'ты', 'он/оно', 'она', 'мы', 'вы', 'они'],
                ['Gen', 'меня', 'тебя', 'его', 'её', 'нас', 'вас', 'их'],
                ['Dat', 'мне', 'тебе', 'ему', 'ей', 'нам', 'вам', 'им'],
                ['Acc', 'меня', 'тебя', 'его', 'её', 'нас', 'вас', 'их'],
                ['Ins', 'мной', 'тобой', 'им', 'ей', 'нами', 'вами', 'ими'],
                ['Prep', 'мне', 'тебе', 'нём', 'ней', 'нас', 'вас', 'них'],
              ],
            },
          },
          {
            note: 'After a preposition, 3rd-person pronouns add **н-**: у него, к ней, с ними, о нём. **вы** (capitalized Вы in writing) is the polite "you".',
          },
        ],
      },
      {
        id: 'pron-possessive',
        title: 'Possessive pronouns',
        blocks: [
          {
            p: '**мой, твой, наш, ваш** agree with the *thing owned* (like adjectives). The 3rd-person possessives **его (his), её (her), их (their)** are **invariable** — they never change ending.',
          },
          {
            ex: [
              { ru: 'мой брат, моя сестра, моё окно, мои книги', en: 'my brother / sister / window / books' },
              { ru: 'его машина, их дом', en: 'his car, their house', note: 'invariable' },
              { ru: 'Я вижу твою сестру.', en: 'I see your sister.', note: 'твою agrees: fem accusative' },
            ],
          },
        ],
      },
      {
        id: 'pron-demonstrative',
        title: 'Demonstratives & determiners',
        blocks: [
          {
            list: [
              '**этот** (this), **тот** (that) — decline like adjectives and agree: этот, эта, это, эти.',
              'Careful: **это** as "this is…" is invariable (Это книга = This is a book), separate from neuter **это** "this".',
              '**весь** (all/whole): весь, вся, всё, все.',
              '**сам** (-self, emphatic): я сам это сделал (I did it myself).',
            ],
          },
        ],
      },
      {
        id: 'pron-question',
        title: 'Interrogative & relative',
        blocks: [
          {
            list: [
              '**кто** (who), **что** (what) — decline: кого, кому, кем, (о) ком / чего, чему, чем, (о) чём.',
              '**какой** (what kind / which) and **который** (which/that, relative) — decline like adjectives, agree with their noun.',
              '**чей** (whose): чей, чья, чьё, чьи.',
              '**где** (where-at), **куда** (where-to), **откуда** (where-from), **когда, почему, как, сколько**.',
            ],
          },
          {
            ex: [
              { ru: 'Кому ты звонишь?', en: 'Who are you calling?', note: 'dative — recipient' },
              { ru: 'Книга, которую я читаю.', en: 'The book that I am reading.', note: 'который agrees + takes case from its own clause' },
            ],
          },
        ],
      },
      {
        id: 'pron-reflexive',
        title: 'Reflexive себя & свой',
        blocks: [
          {
            list: [
              '**себя** (oneself) refers back to the subject; it has no nominative: Он купил себе подарок (He bought himself a gift).',
              '**свой** (one\'s own) refers to the subject of the clause and replaces мой/твой/его when the owner = the subject. Он любит свою работу (He loves his [own] work) vs Он любит его работу (someone else\'s).',
            ],
          },
        ],
      },
      {
        id: 'pron-neg-indef',
        title: 'Negative & indefinite',
        blocks: [
          {
            table: {
              caption: 'Built on the question words: ни- = none, -то / -нибудь = some/any',
              headers: ['Question', 'Negative ни-', 'Indefinite -то', 'Indefinite -нибудь'],
              rows: [
                ['кто', 'никто', 'кто-то', 'кто-нибудь'],
                ['что', 'ничто / ничего', 'что-то', 'что-нибудь'],
                ['когда', 'никогда', 'когда-то', 'когда-нибудь'],
                ['где', 'нигде', 'где-то', 'где-нибудь'],
                ['куда', 'никуда', 'куда-то', 'куда-нибудь'],
              ],
            },
          },
          {
            list: [
              '**Double negation is obligatory** — the ни- word AND не on the verb, stacking freely: Я никогда́ никому́ ничего́ не говорю́.',
              'With a preposition, the **ни- splits** around it: ни у кого́, ни с кем, ни о чём.',
              '**-то = it exists, just unspecified/unknown** (statements, past/present): Кто-то звони́л (someone called — I don\'t know who).',
              '**-нибудь = any one at all, existence open** (questions, requests, future): Позвони́ кому́-нибудь (call someone/anyone).',
            ],
          },
          {
            ex: [
              { ru: 'Ты пригласи́л кого́-нибудь?', en: 'Did you invite anyone?', note: "don't know if you did" },
              { ru: 'Ты пригласи́л кого́-то?', en: 'You invited someone (didn\'t you)?', note: 'I suspect you did' },
              { ru: 'Я ничего́ не зна́ю.', en: 'I know nothing.', note: 'genitive of negation: ничего' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ VERBS
  {
    id: 'verbs',
    title: 'Verbs',
    topics: [
      {
        id: 'verb-present',
        title: 'Present tense — two conjugations',
        blocks: [
          {
            p: 'Russian present tense has two patterns. Learn the **1st conjugation** (-е- vowel, most verbs) and **2nd conjugation** (-и-, mostly -ить verbs).',
          },
          {
            table: {
              caption: 'читать (to read, 1st) · говорить (to speak, 2nd)',
              headers: ['Person', 'читать', 'говорить'],
              rows: [
                ['я', 'читаю', 'говорю'],
                ['ты', 'читаешь', 'говоришь'],
                ['он/она', 'читает', 'говорит'],
                ['мы', 'читаем', 'говорим'],
                ['вы', 'читаете', 'говорите'],
                ['они', 'читают', 'говорят'],
              ],
            },
          },
          {
            list: [
              '1st conj endings: -ю/-у, -ешь, -ет, -ем, -ете, -ют/-ут.',
              '2nd conj endings: -ю/-у, -ишь, -ит, -им, -ите, -ят/-ат.',
              '**Consonant mutation** appears in some verbs (often only я-form): писать → пишу, пишешь; любить → люблю (inserted -л-), любишь.',
            ],
          },
        ],
      },
      {
        id: 'verb-past',
        title: 'Past tense',
        blocks: [
          {
            p: 'The past is built from the infinitive stem + **-л** and agrees with the subject in **gender (singular) and number** — *not* person. Drop -ть, add:',
          },
          {
            table: {
              caption: 'читать → past',
              headers: ['Subject', 'Form'],
              rows: [
                ['masc. (я/ты/он)', 'читал'],
                ['fem. (я/ты/она)', 'читала'],
                ['neuter (оно)', 'читало'],
                ['plural (мы/вы/они)', 'читали'],
              ],
            },
          },
          { note: 'Some verbs lose the -л in masculine: нести → нёс, мочь → мог. идти → шёл, шла, шло, шли (suppletive).' },
        ],
      },
      {
        id: 'verb-future',
        title: 'Future tense',
        blocks: [
          {
            list: [
              '**Imperfective future** = conjugated **быть** + imperfective infinitive: Я буду читать (I will read / be reading).',
              '**Perfective future** = the perfective verb conjugated like a present tense: Я прочитаю (I will read [and finish]).',
            ],
          },
          {
            table: {
              caption: 'быть (future) — also the only present-ish form of "to be"',
              headers: ['Person', 'Form'],
              rows: [
                ['я', 'буду'],
                ['ты', 'будешь'],
                ['он/она', 'будет'],
                ['мы', 'будем'],
                ['вы', 'будете'],
                ['они', 'будут'],
              ],
            },
          },
          { ex: [{ ru: 'Завтра я буду работать.', en: 'Tomorrow I will be working.', note: 'imperfective — process' }, { ru: 'Я напишу письмо.', en: 'I will write the letter.', note: 'perfective — result' }] },
        ],
      },
      {
        id: 'verb-imperative',
        title: 'Imperative (commands)',
        blocks: [
          {
            list: [
              'Take the **они present stem**, add **-й** (after a vowel), **-и** (after a consonant, if stressed ending), or **-ь**: читают → читай(те); говорят → говори(те); готовь(те).',
              'Add **-те** for the polite/plural form.',
              '**Aspect matters:** perfective for a single specific request (Закрой дверь!), imperfective for general/repeated/negative (Не закрывай дверь!, Читайте каждый день).',
            ],
          },
          { ex: [{ ru: 'Открой окно!', en: 'Open the window!' }, { ru: 'Говорите медленнее, пожалуйста.', en: 'Please speak more slowly.' }] },
          {
            p: '**"Let\'s…" (1st person):** **дава́й(те)** + imperfective infinitive (or perfective мы-form). **"Let him/them…" (3rd person):** **пусть** + present/future verb.',
          },
          {
            ex: [
              { ru: 'Дава́йте говори́ть по-русски!', en: "Let's speak Russian!" },
              { ru: 'Дава́й пойдём в кино.', en: "Let's go to the movies.", note: 'perfective мы-form' },
              { ru: 'Пусть брат ку́пит проду́кты.', en: 'Let my brother buy the groceries.' },
            ],
          },
        ],
      },
      {
        id: 'verb-reflexive',
        title: 'Reflexive verbs (-ся / -сь)',
        blocks: [
          {
            p: 'Add **-ся** (after a consonant) / **-сь** (after a vowel) after the normal ending. The verb conjugates as usual; -ся just rides along. **A -ся verb is intransitive** — it can never take a direct object in the accusative, so it governs another case or a preposition. Four jobs:',
          },
          {
            list: [
              '**True reflexive** — action back on the subject: умыва́ться (wash up), одева́ться (get dressed).',
              '**Reciprocal** — "each other," usually с + Instr: встреча́ться (meet), ви́деться (see each other), знако́миться с (get acquainted with).',
              '**Passive** — agent dropped, object promoted to subject: Магази́н открыва́ется в 9 (the store opens / is opened at 9).',
              '**-ся-only** — no transitive form exists: нра́виться (be liked), наде́яться (hope), смея́ться (laugh).',
            ],
          },
          {
            p: 'The -ся-only verbs carry fixed case government — learn each with its case:',
          },
          {
            table: {
              headers: ['Verb', 'Governs', 'Meaning'],
              rows: [
                ['боя́ться', '+ Genitive (or что…)', 'to be afraid of'],
                ['наде́яться', '+ на + Accusative', 'to hope for'],
                ['смея́ться', '+ над + Instrumental', 'to laugh at'],
                ['интересова́ться', '+ Instrumental', 'to be interested in'],
                ['занима́ться', '+ Instrumental', 'to study / do (a pursuit)'],
                ['находи́ться', '(где?)', 'to be located'],
              ],
            },
          },
          {
            ex: [
              { ru: 'Я бою́сь больши́х соба́к.', en: 'I am afraid of big dogs.', note: 'genitive' },
              { ru: 'На что ты наде́ешься?', en: 'What are you hoping for?', note: 'на + accusative' },
              { ru: 'Почему ты смеёшься над на́ми?', en: 'Why are you laughing at us?', note: 'над + instrumental' },
              { ru: 'Чем вы интересу́етесь?', en: 'What are you interested in?', note: 'instrumental' },
            ],
          },
        ],
      },
      {
        id: 'verb-conditional',
        title: 'Conditional & subjunctive (бы)',
        blocks: [
          {
            p: 'Russian has **no conditional conjugation**. Everything hypothetical uses the **past tense + the particle бы** (placed after the first stressed word or right after the verb). Russian does not mark tense in the subjunctive — context tells you present vs. past.',
          },
          {
            list: [
              '**Real condition** (likely): **если …, (то) …** with ordinary tenses. Future "if" needs a real future in both clauses: Если ты придёшь, мы пойдём.',
              '**Unreal/hypothetical:** **если бы + past, … бы + past.** Если бы я знал, я бы сказал = If I (had) known, I would (have) said.',
              '**Wish / "would":** бы + past alone — Я бы вы́пил ко́фе (I\'d have a coffee); Ты бы отдохну́л (you should rest).',
              '**чтобы + past** for a wish/command with a *different* subject (see Clauses below).',
            ],
          },
          {
            ex: [
              { ru: 'Если бы у меня было время, я бы пригото́вил ужин.', en: 'If I had time, I would cook dinner.' },
              { ru: 'Если бы Пушкин не у́мер, ему было бы 226 лет.', en: 'If Pushkin had not died, he would be 226.' },
              { ru: 'А что, если бы…?', en: 'What if…?' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ ASPECT
  {
    id: 'aspect',
    title: 'Verb aspect',
    topics: [
      {
        id: 'aspect-concept',
        title: 'Imperfective vs perfective',
        blocks: [
          {
            p: 'Aspect is the heart of the Russian verb. Nearly every verb is **one of a pair**: an **imperfective** (process, repetition, ongoing, general fact) and a **perfective** (a single completed action with a result).',
          },
          {
            table: {
              headers: ['', 'Imperfective', 'Perfective'],
              rows: [
                ['Focus', 'process / habit / ongoing', 'completion / result'],
                ['Present tense', 'yes (я делаю)', 'NO — its "present" form is future'],
                ['Past', 'was doing / used to do', 'did and finished'],
                ['Future', 'буду + inf (will be doing)', 'conjugated (will do)'],
              ],
            },
          },
          {
            ex: [
              { ru: 'Я читал книгу весь вечер.', en: 'I was reading the book all evening.', note: 'imperfective — process' },
              { ru: 'Я прочитал книгу.', en: 'I read the book (finished it).', note: 'perfective — result' },
            ],
          },
        ],
      },
      {
        id: 'aspect-formation',
        title: 'How pairs are formed',
        blocks: [
          {
            list: [
              '**Prefix** makes an imperfective perfective: писать → **на**писать, читать → **про**читать, делать → **с**делать.',
              '**Suffix** change (often -ывать/-ивать) makes a perfective imperfective again: переписать → перепис**ыва**ть.',
              '**Stem/stress change:** решать → решить, отвечать → ответить.',
              '**Suppletive (different roots):** говорить → сказать, брать → взять, ловить → поймать.',
            ],
          },
          {
            table: {
              caption: 'Common aspect pairs (imperfective / perfective)',
              headers: ['Meaning', 'Imperfective', 'Perfective'],
              rows: [
                ['to do', 'делать', 'сделать'],
                ['to read', 'читать', 'прочитать'],
                ['to write', 'писать', 'написать'],
                ['to say/tell', 'говорить', 'сказать'],
                ['to take', 'брать', 'взять'],
                ['to give', 'давать', 'дать'],
                ['to buy', 'покупать', 'купить'],
                ['to decide', 'решать', 'решить'],
              ],
            },
          },
        ],
      },
      {
        id: 'aspect-choosing',
        title: 'Choosing the aspect',
        blocks: [
          {
            list: [
              'Habit / repetition / "used to" → **imperfective** (Ка́ждый день я де́лаю заря́дку). Clue words: всегда́, обы́чно, ча́сто, ка́ждый день.',
              'A single finished action with a result → **perfective** (Я уже́ сде́лал). Clue words: уже́ (already), вдруг (suddenly).',
              'Two actions at the same time / background → **imperfective**; one completed action interrupting → **perfective**: Когда я гото́вил у́жин (impf), ты позвони́л (pf).',
              'A chain of completed actions one after another → **perfective**: прочита́л, перевёл и написа́л.',
              'Negated commands → almost always **imperfective** (Не бери́ это).',
            ],
          },
          {
            p: '**The fact-vs-result trap.** With a plain past question, imperfective asks *did it happen at all?*, perfective asks *is the result here now?*',
          },
          {
            ex: [
              { ru: 'Вы чита́ли э́тот рома́н?', en: 'Have you ever read this novel?', note: 'impf — fact: did you, at some point?' },
              { ru: 'Вы прочита́ли э́тот рома́н?', en: 'Have you finished this novel?', note: 'pf — result expected (e.g. the assignment)' },
              { ru: 'Я не звони́ла ма́ме.', en: "I didn't call mom.", note: 'impf — it just didn\'t happen' },
              { ru: 'Я не позвони́ла ма́ме.', en: "I failed to call mom.", note: 'pf — I was supposed to and didn\'t' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ MOTION
  {
    id: 'motion',
    title: 'Verbs of motion',
    topics: [
      {
        id: 'motion-pairs',
        title: 'Unidirectional vs multidirectional',
        blocks: [
          {
            p: 'A special group of imperfective verbs comes in **two imperfectives**: a **unidirectional** one (one trip, one direction, in progress) and a **multidirectional** one (round trips, habit, general ability).',
          },
          {
            table: {
              headers: ['Meaning', 'Unidirectional', 'Multidirectional'],
              rows: [
                ['go (on foot)', 'идти', 'ходить'],
                ['go (by vehicle)', 'ехать', 'ездить'],
                ['run', 'бежать', 'бегать'],
                ['carry', 'нести', 'носить'],
                ['fly', 'лететь', 'летать'],
                ['swim/sail', 'плыть', 'плавать'],
              ],
            },
          },
          {
            ex: [
              { ru: 'Я иду в школу.', en: 'I am walking to school (now, one way).', note: 'unidirectional' },
              { ru: 'Я хожу в школу каждый день.', en: 'I go to school every day.', note: 'multidirectional — habit' },
              { ru: 'Я люблю плавать.', en: 'I love swimming.', note: 'general ability → multidirectional' },
            ],
          },
        ],
      },
      {
        id: 'motion-prefixed',
        title: 'Prefixed verbs of motion',
        blocks: [
          {
            p: 'Adding a directional prefix changes the meaning and creates a normal aspect pair (prefixed unidirectional = perfective; prefixed multidirectional = imperfective).',
          },
          {
            list: [
              '**при-** = arrival: прийти/приходить (come), приехать/приезжать.',
              '**у-** = leaving for good: уйти/уходить (leave).',
              '**в(о)-** = in, **вы-** = out, **под-** = approach, **от-** = away, **до-** = reach, **пере-** = across.',
            ],
          },
          { ex: [{ ru: 'Он пришёл домой.', en: 'He arrived home.', note: 'perfective' }, { ru: 'Поезд уходит в пять.', en: 'The train leaves at five.' }] },
          {
            p: 'Direction is marked three ways depending on the question — **где? (location)**, **куда? (destination)**, **откуда? (source)** — and each pairs a preposition with a case:',
          },
          {
            table: {
              headers: ['', 'где? (at)', 'куда? (to)', 'откуда? (from)'],
              rows: [
                ['в-words', 'в + Prep', 'в + Acc', 'из + Gen'],
                ['на-words', 'на + Prep', 'на + Acc', 'с + Gen'],
                ["a person's place", 'у + Gen', 'к + Dat', 'от + Gen'],
                ['here / there / home', 'здесь / там / дома', 'сюда / туда / домой', 'отсюда / оттуда / из дому'],
              ],
            },
          },
          {
            ex: [
              { ru: 'Он пришёл на рабо́ту в 9, а ушёл с рабо́ты в 5.', en: 'He came to work at 9 and left work at 5.', note: 'на → с' },
              { ru: 'Ко мне приходи́л друг.', en: 'A friend came over (and left).', note: 'multidir: round trip' },
              { ru: 'Ко мне пришёл друг.', en: 'A friend has come (still here).', note: 'unidir perfective: one way' },
            ],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ PARTICIPLES
  {
    id: 'participles',
    title: 'Participles & verbal adverbs',
    topics: [
      {
        id: 'participles-main',
        title: 'Participles (причастия)',
        blocks: [
          {
            p: 'Participles are verb-adjectives — they describe a noun by an action and **decline like adjectives**. Mostly written/formal register.',
          },
          {
            table: {
              headers: ['Type', 'Marker', 'Example (читать/прочитать)'],
              rows: [
                ['Present active', '-ущ/-ющ/-ащ/-ящ', 'читающий (one who is reading)'],
                ['Past active', '-вш/-ш', 'читавший / прочитавший (who read)'],
                ['Present passive', '-ем/-им', 'читаемый (being read)'],
                ['Past passive', '-нн/-енн/-т', 'прочитанный (having been read)'],
              ],
            },
          },
          { ex: [{ ru: 'студент, читающий книгу', en: 'the student (who is) reading a book' }, { ru: 'недавно написанное письмо', en: 'a recently written letter' }] },
        ],
      },
      {
        id: 'gerunds',
        title: 'Verbal adverbs (деепричастия)',
        blocks: [
          {
            p: 'A verbal adverb describes a **secondary action by the same subject** ("while doing", "having done"). It is indeclinable.',
          },
          {
            list: [
              '**Imperfective** (-я/-а), simultaneous action: читая (while reading), говоря.',
              '**Perfective** (-в/-вши), prior completed action: прочитав (having read), сказав.',
            ],
          },
          { ex: [{ ru: 'Читая книгу, он пил чай.', en: 'While reading the book, he drank tea.' }, { ru: 'Сказав это, она ушла.', en: 'Having said this, she left.' }] },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ NUMERALS
  {
    id: 'numerals',
    title: 'Numbers',
    topics: [
      {
        id: 'num-agreement',
        title: 'Numbers + noun case (the tricky rule)',
        blocks: [
          {
            p: 'The case of the noun after a number depends on the **last digit** of the number:',
          },
          {
            table: {
              headers: ['Number ends in…', 'Noun case', 'Example'],
              rows: [
                ['1 (один)', 'nominative singular (agrees in gender)', 'один стол, одна книга'],
                ['2, 3, 4 (and 22, 33…)', 'genitive SINGULAR', 'два стола, три книги, четыре окна'],
                ['5–20, and 0, …5–…9', 'genitive PLURAL', 'пять столов, десять книг'],
              ],
            },
          },
          {
            list: [
              '**один** agrees fully like an adjective (один/одна/одно/одни).',
              '**два** has a feminine form **две** (две книги).',
              '11–14 always take genitive plural (одиннадцать столов), despite ending visually.',
              'When the *whole number phrase* is in another case, everything agrees: о двух книгах, к пяти часам.',
            ],
          },
        ],
      },
      {
        id: 'num-ordinal-time',
        title: 'Ordinals, time & dates',
        blocks: [
          {
            list: [
              '**Ordinals** are adjectives: первый, второй, третий, пятый… (первый этаж).',
              '**"What is the date?"** — Nominative neuter ordinal + month in **genitive**: Сего́дня **деся́тое** **февраля́** (today is the 10th of February). Past: Вчера́ **бы́ло** девя́тое.',
              '**"On" a date** — ordinal goes to **genitive** + month in genitive: Я роди́лся **деся́того** **ма́я**.',
              '**Year "in"** — в + ordinal in Prepositional + году́: **в** две ты́сячи два́дцать шесто́м **году́**. With a full date, the year is genitive: …ты́сяча девятьсо́т во́семьдесят второ́го **го́да**.',
              '**Telling the hour:** Сейча́с **два часа́ / пять часо́в** (час / часа́ after 2–4 / часо́в after 5+). "At" a time = **в + Accusative**: в три часа́, в час.',
              '**Winter & fall months stress the ending:** ноября́, декабря́, сентября́, октября́.',
            ],
          },
        ],
      },
      {
        id: 'num-collective',
        title: 'Collective numerals',
        blocks: [
          {
            p: '**двое, трое, четверо…** count groups of people (especially males, mixed groups, "children", or pluralia tantum). They take the **genitive plural**.',
          },
          { ex: [{ ru: 'двое детей', en: 'two children' }, { ru: 'трое друзей', en: 'three friends' }] },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ SYNTAX
  {
    id: 'syntax',
    title: 'Sentence structure',
    topics: [
      {
        id: 'word-order',
        title: 'Word order',
        blocks: [
          {
            p: 'Because cases mark roles, word order is **free for grammar** but used for **emphasis / information flow**: known/topic information comes first, new/important information comes last.',
          },
          {
            ex: [
              { ru: 'Мама любит сына.', en: 'Mom loves her son.', note: 'neutral SVO' },
              { ru: 'Сына любит мама.', en: 'It\'s Mom who loves the son.', note: 'cases keep meaning; stress shifts' },
            ],
          },
        ],
      },
      {
        id: 'negation',
        title: 'Negation',
        blocks: [
          {
            list: [
              '**не** negates the word right after it: Я не знаю (I don\'t know).',
              '**Double (multiple) negation is required:** negative words pair with не: Я никогда ничего не говорю (I never say anything).',
              '**нет** = "there is no" + genitive: Здесь нет воды.',
            ],
          },
        ],
      },
      {
        id: 'questions',
        title: 'Questions',
        blocks: [
          {
            list: [
              '**Yes/no questions** use intonation only — same words as a statement, rising tone: Ты студент? ',
              'Or add the particle **ли** in more formal/embedded questions: Не знаю, придёт ли он.',
              '**Wh-questions** start with a question word: где, что, почему, как, сколько…',
            ],
          },
        ],
      },
      {
        id: 'impersonal',
        title: 'Impersonal constructions',
        blocks: [
          {
            p: 'Common "it is…" structures have **no subject**; the logical subject (if any) goes in the **dative**.',
          },
          {
            ex: [
              { ru: 'Можно войти?', en: 'May I come in?' },
              { ru: 'Мне нужно идти.', en: 'I need to go.' },
              { ru: 'Здесь нельзя курить.', en: 'You can\'t / mustn\'t smoke here.' },
              { ru: 'Мне холодно.', en: 'I am cold.' },
            ],
          },
        ],
      },
      {
        id: 'conj-i-a-no',
        title: 'и vs а vs но',
        blocks: [
          {
            p: 'Three little words English blurs into "and/but." Getting **а** right is the giveaway of a real learner.',
          },
          {
            table: {
              headers: ['', 'Use', 'Sense'],
              rows: [
                ['и', 'same/adding, parallel', 'and (also, so too)'],
                ['а', 'contrast / different-but-not-opposed; shift of topic', 'and / whereas / while; "but rather"'],
                ['но', 'a limitation or genuine obstacle', 'but (however, yet)'],
              ],
            },
          },
          {
            list: [
              '**а** pairs two things that simply differ: Я студе́нт, **а** он профе́ссор.',
              '**но** signals something counter to expectation: Он говори́т по-русски хорошо́, **но** ме́дленно.',
              '**не …, а …** = "not X but (rather) Y": Она не ру́сская, **а** украи́нка.',
              'Comma rules: always a comma before **а** and **но**; before **и** only when it joins two clauses with different subjects.',
            ],
          },
        ],
      },
      {
        id: 'conj-clauses',
        title: 'что, чтобы & purpose',
        blocks: [
          {
            list: [
              '**что** = "that" reporting a fact/thought, ordinary tenses kept: Я ду́маю, **что** он прав.',
              '**чтобы + infinitive** = "in order to," when **the subject is the same** in both clauses: Я пришёл, **чтобы** помо́чь.',
              '**чтобы + past** = wish/request/command when **the subject differs**: Я хочу́, **чтобы** ты **пришёл**; Ма́ма попроси́ла, **чтобы** мы позвони́ли.',
              '**Linkers:** потому́ что (because), поэ́тому (therefore), е́сли (if), когда́ (when), хотя́ (although), пока́ (while).',
            ],
          },
          {
            ex: [
              { ru: 'Чтобы хорошо говори́ть по-русски, на́до мно́го практикова́ться.', en: 'To speak Russian well, you must practice a lot.', note: 'same subject → infinitive' },
              { ru: 'Я хочу, чтобы экза́мен был лёгким.', en: 'I want the exam to be easy.', note: 'different subject → past' },
              { ru: 'Говоря́т, что в Швейца́рии всё до́рого.', en: 'They say everything is expensive in Switzerland.', note: 'indefinite-personal: они-form, no subject' },
            ],
          },
        ],
      },
    ],
  },
]
