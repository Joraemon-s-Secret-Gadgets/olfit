/**
 * @file koreanText.ts
 * @description Olfit 프론트엔드 공통 유틸리티 파일입니다.
 * @lastModified 2026-05-15
 */

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSUNG_COUNT = 28;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getLastHangulSyllable = (value: string) => {
  const chars = Array.from(value.trim()).reverse();
  return chars.find((char) => {
    const code = char.charCodeAt(0);
    return code >= HANGUL_BASE && code <= HANGUL_END;
  });
};

export const hasFinalConsonant = (value: string) => {
  const syllable = getLastHangulSyllable(value);
  if (!syllable) return false;

  return (syllable.charCodeAt(0) - HANGUL_BASE) % JONGSUNG_COUNT !== 0;
};

export const subjectParticle = (value: string) => (hasFinalConsonant(value) ? "은" : "는");

export const normalizeSubjectParticle = (text: string, subject: string) => {
  if (!subject.trim()) return text;

  const particle = subjectParticle(subject);
  const subjectPattern = escapeRegExp(subject.trim()).replace(/\s+/g, "\\s+");
  const pattern = new RegExp(`(${subjectPattern})\\s*(은|는)`, "g");

  return text.replace(pattern, `$1${particle}`);
};

export const normalizeFragranceDisplayText = (text: string) =>
  text.replace(/퍼\s+퓸/g, "퍼퓸").replace(/\s+/g, " ").trim();

const fragranceConcentrationPhrases = [
  "앱솔뤼 드 퍼퓸",
  "오 드 퍼퓸",
  "오 드 뚜왈렛",
  "오 드 코롱",
  "퍼퓸",
];

export const splitFragranceDisplayName = (text: string) => {
  const displayName = normalizeFragranceDisplayText(text);
  const concentration = fragranceConcentrationPhrases.find((phrase) =>
    displayName.endsWith(` ${phrase}`),
  );
  const name = concentration
    ? displayName.slice(0, -concentration.length).trim()
    : displayName;

  if (!concentration || !name) {
    return {
      displayName,
      name: displayName,
      concentration: null,
    };
  }

  return {
    displayName,
    name,
    concentration,
  };
};

// EOF: koreanText.ts
