export const progressionPresets = [
  {
    id: "pop-1564",
    name: "王道ポップ進行",
    romanNumerals: ["I", "V", "vi", "IV"],
    description: "J-POPや洋楽で頻出する安定感のある進行",
  },
  {
    id: "sensitive-6415",
    name: "切なめ進行",
    romanNumerals: ["vi", "IV", "I", "V"],
    description: "少し感傷的な雰囲気を作りやすい進行",
  },
  {
    id: "tonal-251",
    name: "ツーファイブワン",
    romanNumerals: ["ii", "V", "I"],
    description: "ジャズにもJ-POPにも出てくる、解決感のある進行",
  },
  {
    id: "basic-145",
    name: "基本進行",
    romanNumerals: ["I", "IV", "V"],
    description: "機能和声の基本を体感しやすい進行",
  },
] as const;

export type ProgressionPreset = (typeof progressionPresets)[number];
