export interface RiasecProfile {
  R: number // Realistic (практические навыки)
  I: number // Investigative (анализ, исследования)
  A: number // Artistic (творчество, дизайн)
  S: number // Social (работа с людьми)
  E: number // Enterprising (лидерство, бизнес)
  C: number // Conventional (организация, порядок)
}

export interface Profession {
  id: string
  name: {
    ru: string
    'uz-cyrl': string
    'uz-latn': string
  }
  nameEn: string
  category: 'IT' | 'Medicine' | 'Engineering' | 'Psychology' | 'Finance' | 'Education' | 'Art' | 'Business'
  riasecProfile: RiasecProfile
  salaryUzSum: string
  description: {
    ru: string
    'uz-cyrl': string
    'uz-latn': string
  }
  requiredSkills: {
    ru: string[]
    'uz-cyrl': string[]
    'uz-latn': string[]
  }
  marketDemand: 'high' | 'medium' | 'low'
}

export const professionsDatabase: Profession[] = [
  {
    id: 'frontend-dev',
    name: {
      ru: 'Frontend-разработчик',
      'uz-cyrl': 'Frontend-дастурчи',
      'uz-latn': 'Frontend-dasturchi'
    },
    nameEn: 'Frontend Developer',
    category: 'IT',
    riasecProfile: { R: 70, I: 80, A: 40, S: 20, E: 30, C: 40 },
    salaryUzSum: '5,000,000 - 12,000,000 сум/месяц',
    description: {
      ru: 'Разработка пользовательских интерфейсов веб-приложений с использованием HTML, CSS, JavaScript и современных фреймворков. Создание отзывчивых и интерактивных веб-сайтов.',
      'uz-cyrl': 'HTML, CSS, JavaScript ва замонавий фреймворклар ёрдамида веб-илова интерфейсларини ишлаб чиқиш. Мослашувчан ва интерактив веб-сайтлар яратиш.',
      'uz-latn': 'HTML, CSS, JavaScript va zamonaviy freymvorklar yordamida veb-ilova interfеyslarini ishlab chiqish. Moslashuvchan va interaktiv veb-saytlar yaratish.'
    },
    requiredSkills: {
      ru: ['HTML/CSS', 'JavaScript', 'React/Vue', 'Responsive Design', 'Git'],
      'uz-cyrl': ['HTML/CSS', 'JavaScript', 'React/Vue', 'Мослашувчан дизайн', 'Git'],
      'uz-latn': ['HTML/CSS', 'JavaScript', 'React/Vue', 'Moslashuvchan dizayn', 'Git']
    },
    marketDemand: 'high'
  },
  {
    id: 'backend-dev',
    name: {
      ru: 'Backend-разработчик',
      'uz-cyrl': 'Backend-дастурчи',
      'uz-latn': 'Backend-dasturchi'
    },
    nameEn: 'Backend Developer',
    category: 'IT',
    riasecProfile: { R: 70, I: 90, A: 20, S: 20, E: 30, C: 60 },
    salaryUzSum: '6,000,000 - 15,000,000 сум/месяц',
    description: {
      ru: 'Разработка серверной логики приложений, работа с базами данных, создание API и обеспечение безопасности системы. Управление данными и бизнес-логикой.',
      'uz-cyrl': 'Иловаларнинг сервер мантиғини ишлаб чиқиш, маълумотлар базалари билан ишлаш, API яратиш ва тизим хавфсизлигини таъминлаш.',
      'uz-latn': 'Ilovalarning server mantiqini ishlab chiqish, ma\'lumotlar bazalari bilan ishlash, API yaratish va tizim xavfsizligini ta\'minlash.'
    },
    requiredSkills: {
      ru: ['Python/Node.js', 'SQL/NoSQL', 'REST API', 'Безопасность', 'Docker'],
      'uz-cyrl': ['Python/Node.js', 'SQL/NoSQL', 'REST API', 'Хавфсизлик', 'Docker'],
      'uz-latn': ['Python/Node.js', 'SQL/NoSQL', 'REST API', 'Xavfsizlik', 'Docker']
    },
    marketDemand: 'high'
  },
  {
    id: 'ui-ux-designer',
    name: {
      ru: 'UI/UX дизайнер',
      'uz-cyrl': 'UI/UX дизайнери',
      'uz-latn': 'UI/UX dizayneri'
    },
    nameEn: 'UI/UX Designer',
    category: 'IT',
    riasecProfile: { R: 30, I: 50, A: 90, S: 40, E: 30, C: 30 },
    salaryUzSum: '4,000,000 - 10,000,000 сум/месяц',
    description: {
      ru: 'Проектирование пользовательских интерфейсов и улучшение пользовательского опыта. Создание прототипов, wireframes и визуального дизайна приложений.',
      'uz-cyrl': 'Фойдаланувчи интерфейсларини лойихалаш ва фойдаланувчи тажрибасини яхшилаш. Прототиплар, wireframes ва иловаларнинг визуал дизайнини яратиш.',
      'uz-latn': 'Foydalanuvchi interfеyslarini loyihalash va foydalanuvchi tajribasini yaxshilash. Prototiplar, wireframes va ilovalarning vizual dizaynini yaratish.'
    },
    requiredSkills: {
      ru: ['Figma/Sketch', 'Прототипирование', 'Типографика', 'Цветовая теория', 'User Research'],
      'uz-cyrl': ['Figma/Sketch', 'Прототипга олиш', 'Типографика', 'Ранг назарияси', 'Фойдаланувчи тадқиқоти'],
      'uz-latn': ['Figma/Sketch', 'Prototipga olish', 'Tipografika', 'Rang nazariyasi', 'Foydalanuvchi tadqiqoti']
    },
    marketDemand: 'high'
  },
  {
    id: 'data-scientist',
    name: {
      ru: 'Специалист по данным',
      'uz-cyrl': 'Маълумотлар мутахассиси',
      'uz-latn': 'Ma\'lumotlar mutaxassisi'
    },
    nameEn: 'Data Scientist',
    category: 'IT',
    riasecProfile: { R: 40, I: 95, A: 20, S: 10, E: 20, C: 70 },
    salaryUzSum: '7,000,000 - 18,000,000 сум/месяц',
    description: {
      ru: 'Анализ больших данных, построение прогнозных моделей и машинное обучение. Извлечение инсайтов из данных для принятия бизнес-решений.',
      'uz-cyrl': 'Катта маълумотларни таҳлил қилиш, прогноз моделларини қуриш ва машина ўрганиши. Бизнес қарорлар қабул қилиш учун маълумотлардан хулосалар чиқариш.',
      'uz-latn': 'Katta ma\'lumotlarni tahlil qilish, prognoz modellarini qurish va mashina o\'rganishi. Biznes qarorlar qabul qilish uchun ma\'lumotlardan xulosalar chiqarish.'
    },
    requiredSkills: {
      ru: ['Python', 'Machine Learning', 'SQL', 'Статистика', 'Визуализация данных'],
      'uz-cyrl': ['Python', 'Машина ўрганиши', 'SQL', 'Статистика', 'Маълумотларни визуализация'],
      'uz-latn': ['Python', 'Mashina o\'rganishi', 'SQL', 'Statistika', 'Ma\'lumotlarni vizualizatsiya']
    },
    marketDemand: 'high'
  },
  {
    id: 'doctor',
    name: {
      ru: 'Врач',
      'uz-cyrl': 'Шифокор',
      'uz-latn': 'Shifokor'
    },
    nameEn: 'Doctor',
    category: 'Medicine',
    riasecProfile: { R: 40, I: 90, A: 20, S: 90, E: 40, C: 50 },
    salaryUzSum: '4,000,000 - 15,000,000 сум/месяц',
    description: {
      ru: 'Диагностика, лечение и профилактика заболеваний. Оказание медицинской помощи пациентам и консультирование по вопросам здоровья.',
      'uz-cyrl': 'Касалликларни ташхис қилиш, даволаш ва олдини олиш. Беморларга тиббий ёрдам кўрсатиш ва соғлиқ масалалари бўйича маслаҳат бериш.',
      'uz-latn': 'Kasalliklarni tashxis qilish, davolash va oldini olish. Bemorlarga tibbiy yordam ko\'rsatish va sog\'liq masalalari bo\'yicha maslahat berish.'
    },
    requiredSkills: {
      ru: ['Медицинские знания', 'Диагностика', 'Эмпатия', 'Принятие решений', 'Коммуникация'],
      'uz-cyrl': ['Тиббий билимлар', 'Ташхис', 'Эмпатия', 'Қарор қабул қилиш', 'Мулоқот'],
      'uz-latn': ['Tibbiy bilimlar', 'Tashxis', 'Empatiya', 'Qaror qabul qilish', 'Muloqot']
    },
    marketDemand: 'high'
  },
  {
    id: 'nurse',
    name: {
      ru: 'Медсестра',
      'uz-cyrl': 'Ҳамшира',
      'uz-latn': 'Hamshira'
    },
    nameEn: 'Nurse',
    category: 'Medicine',
    riasecProfile: { R: 30, I: 40, A: 20, S: 95, E: 20, C: 70 },
    salaryUzSum: '2,500,000 - 6,000,000 сум/месяц',
    description: {
      ru: 'Уход за пациентами, выполнение медицинских процедур и ассистирование врачам. Наблюдение за состоянием здоровья пациентов.',
      'uz-cyrl': 'Беморларга ғамхўрлик қилиш, тиббий процедураларни бажариш ва шифокорларга ёрдам бериш. Беморларнинг соғлиғини кузатиш.',
      'uz-latn': 'Bemorlarga g\'amxo\'rlik qilish, tibbiy protseduralarni bajarish va shifokorlarga yordam berish. Bemorlarning sog\'lig\'ini kuzatish.'
    },
    requiredSkills: {
      ru: ['Медицинский уход', 'Внимательность', 'Терпение', 'Организованность', 'Эмпатия'],
      'uz-cyrl': ['Тиббий парваришлаш', 'Диққатлилик', 'Сабр-тоқат', 'Ташкиллаштириш', 'Эмпатия'],
      'uz-latn': ['Tibbiy parvarishlash', 'Diqqatlilik', 'Sabr-toqat', 'Tashkillashtirish', 'Empatiya']
    },
    marketDemand: 'high'
  },
  {
    id: 'engineer',
    name: {
      ru: 'Инженер',
      'uz-cyrl': 'Муҳандис',
      'uz-latn': 'Muhandis'
    },
    nameEn: 'Engineer',
    category: 'Engineering',
    riasecProfile: { R: 95, I: 85, A: 30, S: 20, E: 30, C: 60 },
    salaryUzSum: '5,000,000 - 14,000,000 сум/месяц',
    description: {
      ru: 'Проектирование, разработка и тестирование технических систем и конструкций. Решение инженерных задач в различных областях.',
      'uz-cyrl': 'Техник тизимлар ва конструкцияларни лойихалаш, ишлаб чиқиш ва синаш. Турли соҳаларда муҳандислик масалаларини ҳал қилиш.',
      'uz-latn': 'Texnik tizimlar va konstruktsiyalarni loyihalash, ishlab chiqish va sinash. Turli sohalarda muhandislik masalalarini hal qilish.'
    },
    requiredSkills: {
      ru: ['Математика', 'Физика', 'CAD системы', 'Проектирование', 'Решение проблем'],
      'uz-cyrl': ['Математика', 'Физика', 'CAD тизимлари', 'Лойихалаш', 'Муаммоларни ҳал қилиш'],
      'uz-latn': ['Matematika', 'Fizika', 'CAD tizimlari', 'Loyihalash', 'Muammolarni hal qilish']
    },
    marketDemand: 'high'
  },
  {
    id: 'architect',
    name: {
      ru: 'Архитектор',
      'uz-cyrl': 'Меъмор',
      'uz-latn': 'Me\'mor'
    },
    nameEn: 'Architect',
    category: 'Engineering',
    riasecProfile: { R: 60, I: 70, A: 90, S: 30, E: 40, C: 50 },
    salaryUzSum: '6,000,000 - 16,000,000 сум/месяц',
    description: {
      ru: 'Проектирование зданий и сооружений с учетом эстетики, функциональности и безопасности. Создание архитектурных концепций и чертежей.',
      'uz-cyrl': 'Эстетика, функционаллик ва хавфсизликни ҳисобга олган ҳолда бинолар ва иншоотларни лойихалаш. Архитектура концепциялари ва чизмаларини яратиш.',
      'uz-latn': 'Estetika, funktsionallik va xavfsizlikni hisobga olgan holda binolar va inshootlarni loyihalash. Arxitektura kontseptsiyalari va chizmalarini yaratish.'
    },
    requiredSkills: {
      ru: ['AutoCAD', '3D моделирование', 'Архитектурный дизайн', 'Строительные нормы', 'Креативность'],
      'uz-cyrl': ['AutoCAD', '3D моделлаштириш', 'Меъморий дизайн', 'Қурилиш меъёрлари', 'Креативлик'],
      'uz-latn': ['AutoCAD', '3D modellashtirish', 'Me\'moriy dizayn', 'Qurilish me\'yorlari', 'Kreativlik']
    },
    marketDemand: 'medium'
  },
  {
    id: 'psychologist',
    name: {
      ru: 'Психолог',
      'uz-cyrl': 'Психолог',
      'uz-latn': 'Psixolog'
    },
    nameEn: 'Psychologist',
    category: 'Psychology',
    riasecProfile: { R: 10, I: 70, A: 40, S: 95, E: 30, C: 40 },
    salaryUzSum: '3,000,000 - 9,000,000 сум/месяц',
    description: {
      ru: 'Консультирование людей по психологическим вопросам, помощь в решении личных проблем и улучшении ментального здоровья.',
      'uz-cyrl': 'Одамларга психологик масалалар бўйича маслаҳат бериш, шахсий муаммоларни ҳал қилишда ва рухий соғлиқни яхшилашда ёрдам бериш.',
      'uz-latn': 'Odamlarga psixologik masalalar bo\'yicha maslahat berish, shaxsiy muammolarni hal qilishda va ruhiy sog\'liqni yaxshilashda yordam berish.'
    },
    requiredSkills: {
      ru: ['Психология', 'Активное слушание', 'Эмпатия', 'Конфиденциальность', 'Анализ поведения'],
      'uz-cyrl': ['Психология', 'Фаол тинглаш', 'Эмпатия', 'Махфийлик', 'Хулқ-атворни таҳлил қилиш'],
      'uz-latn': ['Psixologiya', 'Faol tinglash', 'Empatiya', 'Maxfiylik', 'Xulq-atvorni tahlil qilish']
    },
    marketDemand: 'medium'
  },
  {
    id: 'accountant',
    name: {
      ru: 'Бухгалтер',
      'uz-cyrl': 'Бухгалтер',
      'uz-latn': 'Buxgalter'
    },
    nameEn: 'Accountant',
    category: 'Finance',
    riasecProfile: { R: 20, I: 50, A: 10, S: 30, E: 20, C: 95 },
    salaryUzSum: '3,500,000 - 10,000,000 сум/месяц',
    description: {
      ru: 'Ведение бухгалтерского учета, подготовка финансовых отчетов и контроль финансовых операций организации.',
      'uz-cyrl': 'Бухгалтерия ҳисобини юритиш, молиявий ҳисоботларни тайёрлаш ва ташкилот молиявий операцияларини назорат қилиш.',
      'uz-latn': 'Buxgalteriya hisobini yuritish, moliyaviy hisobotlarni tayyorlash va tashkilot moliyaviy operatsiyalarini nazorat qilish.'
    },
    requiredSkills: {
      ru: ['Бухгалтерский учет', 'Excel', 'Налогообложение', 'Внимательность', 'Финансовый анализ'],
      'uz-cyrl': ['Бухгалтерия ҳисоби', 'Excel', 'Солиққа тортиш', 'Диққатлилик', 'Молиявий таҳлил'],
      'uz-latn': ['Buxgalteriya hisobi', 'Excel', 'Soliqqa tortish', 'Diqqatlilik', 'Moliyaviy tahlil']
    },
    marketDemand: 'high'
  },
  {
    id: 'teacher',
    name: {
      ru: 'Учитель',
      'uz-cyrl': 'Ўқитувчи',
      'uz-latn': 'O\'qituvchi'
    },
    nameEn: 'Teacher',
    category: 'Education',
    riasecProfile: { R: 20, I: 50, A: 50, S: 90, E: 40, C: 40 },
    salaryUzSum: '2,500,000 - 7,000,000 сум/месяц',
    description: {
      ru: 'Обучение учащихся, разработка учебных программ и оценка успеваемости. Передача знаний и развитие навыков студентов.',
      'uz-cyrl': 'Ўқувчиларни ўқитиш, ўқув дастурларини ишлаб чиқиш ва ўзлаштиришни баҳолаш. Билим бериш ва талабаларнинг кўникмаларини ривожлантириш.',
      'uz-latn': 'O\'quvchilarni o\'qitish, o\'quv dasturlarini ishlab chiqish va o\'zlashtirishni baholash. Bilim berish va talabalarning ko\'nikmalarini rivojlantirish.'
    },
    requiredSkills: {
      ru: ['Педагогика', 'Коммуникация', 'Терпение', 'Планирование', 'Мотивация'],
      'uz-cyrl': ['Педагогика', 'Мулоқот', 'Сабр-тоқат', 'Режалаштириш', 'Мотивация'],
      'uz-latn': ['Pedagogika', 'Muloqot', 'Sabr-toqat', 'Rejalashtirish', 'Motivatsiya']
    },
    marketDemand: 'medium'
  },
  {
    id: 'artist',
    name: {
      ru: 'Художник',
      'uz-cyrl': 'Рассом',
      'uz-latn': 'Rassom'
    },
    nameEn: 'Artist',
    category: 'Art',
    riasecProfile: { R: 40, I: 30, A: 95, S: 30, E: 20, C: 20 },
    salaryUzSum: '2,000,000 - 10,000,000 сум/месяц',
    description: {
      ru: 'Создание произведений искусства в различных техниках: живопись, графика, скульптура. Выражение творческих идей через визуальное искусство.',
      'uz-cyrl': 'Турли усулларда санъат асарларини яратиш: рассомлик, график, ҳайкал. Визуал санъат орқали ижодий ғояларни ифода этиш.',
      'uz-latn': 'Turli usullarda san\'at asarlarini yaratish: rassom­lik, grafik, haykal. Vizual san\'at orqali ijodiy g\'oyalarni ifoda etish.'
    },
    requiredSkills: {
      ru: ['Рисование', 'Композиция', 'Цветоведение', 'Креативность', 'Художественное видение'],
      'uz-cyrl': ['Расм чизиш', 'Композиция', 'Рангшунослик', 'Креативлик', 'Бадиий кўриш'],
      'uz-latn': ['Rasm chizish', 'Kompozitsiya', 'Rangshunoslik', 'Kreativlik', 'Badiiy ko\'rish']
    },
    marketDemand: 'low'
  },
  {
    id: 'project-manager',
    name: {
      ru: 'Менеджер проекта',
      'uz-cyrl': 'Лойиҳа менежери',
      'uz-latn': 'Loyiha menejeri'
    },
    nameEn: 'Project Manager',
    category: 'Business',
    riasecProfile: { R: 20, I: 40, A: 30, S: 70, E: 90, C: 70 },
    salaryUzSum: '6,000,000 - 18,000,000 сум/месяц',
    description: {
      ru: 'Планирование, координация и контроль проектов. Управление командой, бюджетом и сроками для достижения целей проекта.',
      'uz-cyrl': 'Лойиҳаларни режалаштириш, мувофиқлаштириш ва назорат қилиш. Лойиҳа мақсадларига эришиш учун жамоа, бюджет ва муддатларни бошқариш.',
      'uz-latn': 'Loyihalarni rejalashtirish, muvofiqlashtirish va nazorat qilish. Loyiha maqsadlariga erishish uchun jamoa, byudjet va muddatlarni boshqarish.'
    },
    requiredSkills: {
      ru: ['Управление проектами', 'Лидерство', 'Коммуникация', 'Планирование', 'Управление рисками'],
      'uz-cyrl': ['Лойиҳаларни бошқариш', 'Етакчилик', 'Мулоқот', 'Режалаштириш', 'Хавфларни бошқариш'],
      'uz-latn': ['Loyihalarni boshqarish', 'Yetakchilik', 'Muloqot', 'Rejalashtirish', 'Xavflarni boshqarish']
    },
    marketDemand: 'high'
  }
]

// Helper function to get profession by ID
export function getProfessionById(id: string): Profession | undefined {
  return professionsDatabase.find(p => p.id === id)
}

// Helper function to get professions by category
export function getProfessionsByCategory(category: Profession['category']): Profession[] {
  return professionsDatabase.filter(p => p.category === category)
}

// Helper function to get all categories
export function getAllCategories(): Profession['category'][] {
  return Array.from(new Set(professionsDatabase.map(p => p.category)))
}
