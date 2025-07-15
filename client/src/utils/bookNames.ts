import { Language } from '@shared/schema';

// 성경 책 이름 다국어 매핑
export const bookNames: Record<string, Record<Language, string>> = {
  'Genesis': {
    ko: '창세기',
    en: 'Genesis',
    zh: '创世记',
    ja: '創世記'
  },
  'Exodus': {
    ko: '출애굽기',
    en: 'Exodus',
    zh: '出埃及记',
    ja: '出エジプト記'
  },
  'Leviticus': {
    ko: '레위기',
    en: 'Leviticus',
    zh: '利未记',
    ja: 'レビ記'
  },
  'Numbers': {
    ko: '민수기',
    en: 'Numbers',
    zh: '民数记',
    ja: '民数記'
  },
  'Deuteronomy': {
    ko: '신명기',
    en: 'Deuteronomy',
    zh: '申命记',
    ja: '申命記'
  },
  'Joshua': {
    ko: '여호수아',
    en: 'Joshua',
    zh: '约书亚记',
    ja: 'ヨシュア記'
  },
  'Judges': {
    ko: '사사기',
    en: 'Judges',
    zh: '士师记',
    ja: '士師記'
  },
  'Ruth': {
    ko: '룻기',
    en: 'Ruth',
    zh: '路得记',
    ja: 'ルツ記'
  },
  '1 Samuel': {
    ko: '사무엘상',
    en: '1 Samuel',
    zh: '撒母耳记上',
    ja: 'サムエル記上'
  },
  '2 Samuel': {
    ko: '사무엘하',
    en: '2 Samuel',
    zh: '撒母耳记下',
    ja: 'サムエル記下'
  },
  '1 Kings': {
    ko: '열왕기상',
    en: '1 Kings',
    zh: '列王纪上',
    ja: '列王記上'
  },
  '2 Kings': {
    ko: '열왕기하',
    en: '2 Kings',
    zh: '列王纪下',
    ja: '列王記下'
  },
  '1 Chronicles': {
    ko: '역대상',
    en: '1 Chronicles',
    zh: '历代志上',
    ja: '歴代志上'
  },
  '2 Chronicles': {
    ko: '역대하',
    en: '2 Chronicles',
    zh: '历代志下',
    ja: '歴代志下'
  },
  'Ezra': {
    ko: '에스라',
    en: 'Ezra',
    zh: '以斯拉记',
    ja: 'エズラ記'
  },
  'Nehemiah': {
    ko: '느헤미야',
    en: 'Nehemiah',
    zh: '尼希米记',
    ja: 'ネヘミヤ記'
  },
  'Esther': {
    ko: '에스더',
    en: 'Esther',
    zh: '以斯帖记',
    ja: 'エステル記'
  },
  'Job': {
    ko: '욥기',
    en: 'Job',
    zh: '约伯记',
    ja: 'ヨブ記'
  },
  'Psalms': {
    ko: '시편',
    en: 'Psalms',
    zh: '诗篇',
    ja: '詩篇'
  },
  'Proverbs': {
    ko: '잠언',
    en: 'Proverbs',
    zh: '箴言',
    ja: '箴言'
  },
  'Ecclesiastes': {
    ko: '전도서',
    en: 'Ecclesiastes',
    zh: '传道书',
    ja: '伝道者の書'
  },
  'Song of Songs': {
    ko: '아가',
    en: 'Song of Songs',
    zh: '雅歌',
    ja: '雅歌'
  },
  'Isaiah': {
    ko: '이사야',
    en: 'Isaiah',
    zh: '以赛亚书',
    ja: 'イザヤ書'
  },
  'Jeremiah': {
    ko: '예레미야',
    en: 'Jeremiah',
    zh: '耶利米书',
    ja: 'エレミヤ書'
  },
  'Lamentations': {
    ko: '예레미야애가',
    en: 'Lamentations',
    zh: '耶利米哀歌',
    ja: '哀歌'
  },
  'Ezekiel': {
    ko: '에스겔',
    en: 'Ezekiel',
    zh: '以西结书',
    ja: 'エゼキエル書'
  },
  'Daniel': {
    ko: '다니엘',
    en: 'Daniel',
    zh: '但以理书',
    ja: 'ダニエル書'
  },
  'Hosea': {
    ko: '호세아',
    en: 'Hosea',
    zh: '何西阿书',
    ja: 'ホセア書'
  },
  'Joel': {
    ko: '요엘',
    en: 'Joel',
    zh: '约珥书',
    ja: 'ヨエル書'
  },
  'Amos': {
    ko: '아모스',
    en: 'Amos',
    zh: '阿摩司书',
    ja: 'アモス書'
  },
  'Obadiah': {
    ko: '오바댜',
    en: 'Obadiah',
    zh: '俄巴底亚书',
    ja: 'オバデヤ書'
  },
  'Jonah': {
    ko: '요나',
    en: 'Jonah',
    zh: '约拿书',
    ja: 'ヨナ書'
  },
  'Micah': {
    ko: '미가',
    en: 'Micah',
    zh: '弥迦书',
    ja: 'ミカ書'
  },
  'Nahum': {
    ko: '나훔',
    en: 'Nahum',
    zh: '那鸿书',
    ja: 'ナホム書'
  },
  'Habakkuk': {
    ko: '하박국',
    en: 'Habakkuk',
    zh: '哈巴谷书',
    ja: 'ハバクク書'
  },
  'Zephaniah': {
    ko: '스바냐',
    en: 'Zephaniah',
    zh: '西番雅书',
    ja: 'ゼパニヤ書'
  },
  'Haggai': {
    ko: '학개',
    en: 'Haggai',
    zh: '哈该书',
    ja: 'ハガイ書'
  },
  'Zechariah': {
    ko: '스가랴',
    en: 'Zechariah',
    zh: '撒迦利亚书',
    ja: 'ゼカリヤ書'
  },
  'Malachi': {
    ko: '말라기',
    en: 'Malachi',
    zh: '玛拉基书',
    ja: 'マラキ書'
  },
  'Matthew': {
    ko: '마태복음',
    en: 'Matthew',
    zh: '马太福音',
    ja: 'マタイによる福音書'
  },
  'Mark': {
    ko: '마가복음',
    en: 'Mark',
    zh: '马可福音',
    ja: 'マルコによる福音書'
  },
  'Luke': {
    ko: '누가복음',
    en: 'Luke',
    zh: '路加福音',
    ja: 'ルカによる福音書'
  },
  'John': {
    ko: '요한복음',
    en: 'John',
    zh: '约翰福音',
    ja: 'ヨハネによる福音書'
  },
  'Acts': {
    ko: '사도행전',
    en: 'Acts',
    zh: '使徒行传',
    ja: '使徒行伝'
  },
  'Romans': {
    ko: '로마서',
    en: 'Romans',
    zh: '罗马书',
    ja: 'ローマ人への手紙'
  },
  '1 Corinthians': {
    ko: '고린도전서',
    en: '1 Corinthians',
    zh: '哥林多前书',
    ja: 'コリント人への第一の手紙'
  },
  '2 Corinthians': {
    ko: '고린도후서',
    en: '2 Corinthians',
    zh: '哥林多后书',
    ja: 'コリント人への第二の手紙'
  },
  'Galatians': {
    ko: '갈라디아서',
    en: 'Galatians',
    zh: '加拉太书',
    ja: 'ガラテヤ人への手紙'
  },
  'Ephesians': {
    ko: '에베소서',
    en: 'Ephesians',
    zh: '以弗所书',
    ja: 'エペソ人への手紙'
  },
  'Philippians': {
    ko: '빌립보서',
    en: 'Philippians',
    zh: '腓立比书',
    ja: 'ピリピ人への手紙'
  },
  'Colossians': {
    ko: '골로새서',
    en: 'Colossians',
    zh: '歌罗西书',
    ja: 'コロサイ人への手紙'
  },
  '1 Thessalonians': {
    ko: '데살로니가전서',
    en: '1 Thessalonians',
    zh: '帖撒罗尼迦前书',
    ja: 'テサロニケ人への第一の手紙'
  },
  '2 Thessalonians': {
    ko: '데살로니가후서',
    en: '2 Thessalonians',
    zh: '帖撒罗尼迦后书',
    ja: 'テサロニケ人への第二の手紙'
  },
  '1 Timothy': {
    ko: '디모데전서',
    en: '1 Timothy',
    zh: '提摩太前书',
    ja: 'テモテへの第一の手紙'
  },
  '2 Timothy': {
    ko: '디모데후서',
    en: '2 Timothy',
    zh: '提摩太后书',
    ja: 'テモテへの第二の手紙'
  },
  'Titus': {
    ko: '디도서',
    en: 'Titus',
    zh: '提多书',
    ja: 'テトスへの手紙'
  },
  'Philemon': {
    ko: '빌레몬서',
    en: 'Philemon',
    zh: '腓利门书',
    ja: 'ピレモンへの手紙'
  },
  'Hebrews': {
    ko: '히브리서',
    en: 'Hebrews',
    zh: '希伯来书',
    ja: 'ヘブル人への手紙'
  },
  'James': {
    ko: '야고보서',
    en: 'James',
    zh: '雅各书',
    ja: 'ヤコブの手紙'
  },
  '1 Peter': {
    ko: '베드로전서',
    en: '1 Peter',
    zh: '彼得前书',
    ja: 'ペテロの第一の手紙'
  },
  '2 Peter': {
    ko: '베드로후서',
    en: '2 Peter',
    zh: '彼得后书',
    ja: 'ペテロの第二の手紙'
  },
  '1 John': {
    ko: '요한일서',
    en: '1 John',
    zh: '约翰一书',
    ja: 'ヨハネの第一の手紙'
  },
  '2 John': {
    ko: '요한이서',
    en: '2 John',
    zh: '约翰二书',
    ja: 'ヨハネの第二の手紙'
  },
  '3 John': {
    ko: '요한삼서',
    en: '3 John',
    zh: '约翰三书',
    ja: 'ヨハネの第三の手紙'
  },
  'Jude': {
    ko: '유다서',
    en: 'Jude',
    zh: '犹大书',
    ja: 'ユダの手紙'
  },
  'Revelation': {
    ko: '요한계시록',
    en: 'Revelation',
    zh: '启示录',
    ja: 'ヨハネの黙示録'
  }
};

/**
 * 성경 책 이름을 지정된 언어로 번역
 * @param englishBookName 영어 책 이름
 * @param language 대상 언어
 * @returns 번역된 책 이름
 */
export function getLocalizedBookName(englishBookName: string, language: Language): string {
  // 정확한 매칭 시도
  if (bookNames[englishBookName]) {
    return bookNames[englishBookName][language] || englishBookName;
  }
  
  // 대소문자 무시하고 매칭 시도
  const lowerEnglishName = englishBookName.toLowerCase();
  for (const [key, translations] of Object.entries(bookNames)) {
    if (key.toLowerCase() === lowerEnglishName) {
      return translations[language] || englishBookName;
    }
  }
  
  // 부분 매칭 시도 (예: "1samuel" → "1 Samuel")
  for (const [key, translations] of Object.entries(bookNames)) {
    if (key.toLowerCase().replace(/\s/g, '') === lowerEnglishName.replace(/\s/g, '')) {
      return translations[language] || englishBookName;
    }
  }
  
  // 매칭 실패시 원본 반환
  return englishBookName;
}

/**
 * 모든 언어의 책 이름을 반환
 * @param englishBookName 영어 책 이름
 * @returns 모든 언어의 책 이름 객체
 */
export function getAllLocalizedBookNames(englishBookName: string): Record<Language, string> {
  if (bookNames[englishBookName]) {
    return bookNames[englishBookName];
  }
  
  // 매칭 실패시 모든 언어에 대해 원본 반환
  return {
    ko: englishBookName,
    en: englishBookName,
    zh: englishBookName,
    ja: englishBookName
  };
}