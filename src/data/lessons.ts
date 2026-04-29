import type { Lesson } from "@/lib/music/theoryTypes";

export const lessons: Lesson[] = [
  {
    id: "notes-and-keyboard",
    title: "音名と鍵盤",
    category: "basics",
    level: "beginner",
    summary:
      "C D E F G A B のドレミと、鍵盤上の半音・全音の関係を耳と目で確認します。",
    sections: [
      {
        id: "intro",
        heading: "ドレミの正体",
        body: "西洋音楽では C D E F G A B の7つの音名を使います。日本語の「ドレミファソラシ」と1対1で対応していて、ピアノの白鍵がそのまま並んでいます。まずは順番に鳴らして耳に馴染ませましょう。",
        examples: [
          {
            id: "c-major-notes",
            type: "scale",
            label: "C D E F G A B を順番に鳴らす",
            notes: ["C", "D", "E", "F", "G", "A", "B"],
            description:
              "白鍵を左から順に弾くとこの並びになります。鍵盤上のハイライトを目で追ってみてください。",
          },
        ],
      },
      {
        id: "half-and-whole",
        heading: "半音と全音",
        body: "隣り合う鍵盤(白でも黒でも)の距離が「半音」、半音2つぶんが「全音」です。E と F、B と C の間だけは黒鍵がなく半音、それ以外の白鍵同士は全音離れています。",
        examples: [
          {
            id: "half-step",
            type: "note",
            label: "半音 (E → F)",
            notes: ["E", "F"],
            description: "間に黒鍵がない半音の例。",
          },
          {
            id: "whole-step",
            type: "note",
            label: "全音 (C → D)",
            notes: ["C", "D"],
            description: "間に黒鍵 (C#) を挟む全音の例。",
          },
        ],
      },
    ],
  },
  {
    id: "major-scale",
    title: "メジャースケール",
    category: "scales",
    level: "beginner",
    summary:
      "明るい響きの基本、メジャースケール。「全全半全全全半」の並びを耳で確かめます。",
    sections: [
      {
        id: "what-is-major",
        heading: "メジャースケールとは",
        body: "メジャースケールは「全・全・半・全・全・全・半」という間隔で並べた7音の集まりです。明るく安定した響きで、ポップスやクラシックの基礎になっています。",
        examples: [
          {
            id: "c-major-scale",
            type: "scale",
            label: "Cメジャースケール",
            key: "C",
            notes: ["C", "D", "E", "F", "G", "A", "B", "C"],
            description: "白鍵だけで弾けるメジャースケール。",
          },
        ],
      },
      {
        id: "transpose-major",
        heading: "他のキーでも同じ響き",
        body: "ルート(出発点)を変えても、間隔さえ守ればメジャースケールは同じ「明るい」響きを保ちます。Gメジャーでは F の代わりに F# を使います。",
        examples: [
          {
            id: "g-major-scale",
            type: "scale",
            label: "Gメジャースケール",
            key: "G",
            notes: ["G", "A", "B", "C", "D", "E", "F#", "G"],
            description: "G から「全全半全全全半」を組むと F# が登場します。",
          },
        ],
      },
    ],
  },
  {
    id: "triads",
    title: "三和音 (トライアド)",
    category: "chords",
    level: "beginner",
    summary:
      "ルート・3度・5度を重ねた三和音。メジャーとマイナーの響きの違いを体感します。",
    sections: [
      {
        id: "what-is-triad",
        heading: "三和音の作り方",
        body: "ルート音から3度上、5度上の音を重ねるとコード(三和音)になります。3度の幅で「明るい(メジャー)」「暗い(マイナー)」が決まります。",
        examples: [
          {
            id: "c-major-triad",
            type: "chord",
            label: "C major: C E G",
            notes: ["C", "E", "G"],
            description: "明るく安定した響きのメジャートライアド。",
          },
          {
            id: "a-minor-triad",
            type: "chord",
            label: "A minor: A C E",
            notes: ["A", "C", "E"],
            description: "少し切ない響きのマイナートライアド。",
          },
          {
            id: "b-dim-triad",
            type: "chord",
            label: "B diminished: B D F",
            notes: ["B", "D", "F"],
            description: "緊張感のあるディミニッシュ。",
          },
        ],
      },
    ],
  },
  {
    id: "diatonic-chords",
    title: "ダイアトニックコード",
    category: "chords",
    level: "intermediate",
    summary:
      "スケール上にできる7つのコード。曲の中で役割を持つ「キーの仲間たち」です。",
    sections: [
      {
        id: "what-is-diatonic",
        heading: "スケールから生まれるコード",
        body: "メジャースケールの各音をルートにして三和音を積むと、7種類のコードが得られます。これがそのキーの「ダイアトニックコード」です。",
        examples: [
          {
            id: "c-diatonic-1",
            type: "chord",
            label: "I: C",
            notes: ["C", "E", "G"],
          },
          {
            id: "c-diatonic-2",
            type: "chord",
            label: "ii: Dm",
            notes: ["D", "F", "A"],
          },
          {
            id: "c-diatonic-3",
            type: "chord",
            label: "iii: Em",
            notes: ["E", "G", "B"],
          },
          {
            id: "c-diatonic-4",
            type: "chord",
            label: "IV: F",
            notes: ["F", "A", "C"],
          },
          {
            id: "c-diatonic-5",
            type: "chord",
            label: "V: G",
            notes: ["G", "B", "D"],
          },
          {
            id: "c-diatonic-6",
            type: "chord",
            label: "vi: Am",
            notes: ["A", "C", "E"],
          },
          {
            id: "c-diatonic-7",
            type: "chord",
            label: "vii°: Bdim",
            notes: ["B", "D", "F"],
          },
        ],
      },
    ],
  },
  {
    id: "popular-progressions",
    title: "王道コード進行",
    category: "progressions",
    level: "intermediate",
    summary:
      "I–V–vi–IV など、ポップスで頻出する進行をローマ数字で覚えてキーを横断して使えるようにします。",
    sections: [
      {
        id: "i-v-vi-iv",
        heading: "I–V–vi–IV",
        body: "Cメジャーで C–G–Am–F。明るさと切なさを行き来する万能進行です。ローマ数字で覚えておけば、キーを変えても同じ役割で使えます。",
        examples: [
          {
            id: "ivvi-iv-c",
            type: "progression",
            label: "C major で I–V–vi–IV",
            key: "C",
            romanNumerals: ["I", "V", "vi", "IV"],
            chords: ["C", "G", "Am", "F"],
            bpm: 100,
            description: "コード進行プレイヤーで再生して耳に馴染ませてみましょう。",
          },
          {
            id: "vi-iv-i-v",
            type: "progression",
            label: "C major で vi–IV–I–V",
            key: "C",
            romanNumerals: ["vi", "IV", "I", "V"],
            chords: ["Am", "F", "C", "G"],
            bpm: 100,
            description: "切なさから始める同系列の進行。",
          },
        ],
      },
      {
        id: "transpose",
        heading: "キーを変えても役割は同じ",
        body: "ローマ数字のラベルは、キーが変わっても保たれます。Gメジャーで I–V–vi–IV を組むと G–D–Em–C になります。",
        examples: [
          {
            id: "ivvi-iv-g",
            type: "progression",
            label: "G major で I–V–vi–IV",
            key: "G",
            romanNumerals: ["I", "V", "vi", "IV"],
            chords: ["G", "D", "Em", "C"],
            bpm: 100,
          },
        ],
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
