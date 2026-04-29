"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  analyzeRecordingBlob,
  type RecordingAnalysisResult,
} from "@/lib/audio/recordingChordAnalyzer";
import { playProgression, stopPlayback } from "@/lib/audio/toneEngine";
import { chordNameToNotes } from "@/lib/music/chordRecognition";
import { usePlaybackStore } from "@/store/playbackStore";

type RecorderStatus = "idle" | "recording" | "analyzing" | "ready" | "error";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function confidenceLabel(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function RecordingAnalyzer() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [result, setResult] = useState<RecordingAnalysisResult>();
  const [error, setError] = useState<string>();

  const chunksRef = useRef<BlobPart[]>([]);
  const recorderRef = useRef<MediaRecorder>();
  const streamRef = useRef<MediaStream>();
  const timerRef = useRef<number>();
  const startedAtRef = useRef<number>();

  const selectedInstrument = usePlaybackStore((s) => s.selectedInstrument);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [audioUrl]);

  const progressionSteps = useMemo(() => {
    return (
      result?.progression.map((item) => ({
        chordName: item.chordName,
        notes: chordNameToNotes(item.chordName),
      })) ?? []
    );
  }, [result]);

  const startRecording = async () => {
    setError(undefined);
    setResult(undefined);
    setElapsed(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(undefined);
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus("error");
      setError("このブラウザでは録音に対応していません。");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        void handleRecordingStopped();
      };

      recorder.start();
      startedAtRef.current = performance.now();
      timerRef.current = window.setInterval(() => {
        if (startedAtRef.current) {
          setElapsed((performance.now() - startedAtRef.current) / 1000);
        }
      }, 120);
      setStatus("recording");
    } catch {
      setStatus("error");
      setError("マイクを開始できませんでした。");
    }
  };

  const handleRecordingStopped = async () => {
    window.clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = undefined;

    const blob = new Blob(chunksRef.current, {
      type: recorderRef.current?.mimeType || "audio/webm",
    });
    if (blob.size === 0) {
      setStatus("error");
      setError("録音データが空でした。");
      return;
    }

    const nextAudioUrl = URL.createObjectURL(blob);
    setAudioUrl(nextAudioUrl);
    setStatus("analyzing");

    try {
      const analysis = await analyzeRecordingBlob(blob);
      setResult(analysis);
      setStatus("ready");
    } catch {
      setStatus("error");
      setError("録音の解析に失敗しました。");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const playDetectedProgression = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    await playProgression(progressionSteps, 96, {
      instrument: selectedInstrument,
      loop: false,
    });
  };

  const hasProgression = progressionSteps.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
      <section className="rounded-2xl border border-edge bg-bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-white/40">
              Recorder
            </div>
            <h2 className="mt-1 text-xl font-semibold">コードを録る</h2>
          </div>
          <div
            className={`rounded-full border px-3 py-1 font-mono text-xs ${
              status === "recording"
                ? "border-accent-hot bg-accent-hot/15 text-accent-hot"
                : "border-edge bg-bg-elevated text-white/50"
            }`}
          >
            {status === "recording" ? "REC" : status.toUpperCase()}
          </div>
        </div>

        <div className="mt-7 rounded-xl border border-edge bg-bg-elevated p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-5xl tabular-nums">
                {formatTime(elapsed)}
              </div>
              <div className="mt-1 text-xs text-white/45">
                {status === "recording"
                  ? "コードチェンジをそのまま弾く"
                  : "10秒前後の進行が扱いやすいです"}
              </div>
            </div>
            <div className="flex gap-2">
              {status === "recording" ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="rounded-lg border border-accent-hot bg-accent-hot/15 px-4 py-2 text-sm text-white transition hover:bg-accent-hot/25"
                >
                  停止
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={status === "analyzing"}
                  className="rounded-lg bg-gradient-to-br from-accent-hot to-accent px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  録音
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-bg-base">
            <div
              className={`h-full rounded-full transition-all ${
                status === "recording"
                  ? "bg-accent-hot"
                  : status === "analyzing"
                    ? "bg-accent-cool"
                    : "bg-accent"
              }`}
              style={{
                width:
                  status === "recording"
                    ? `${Math.min(100, (elapsed / 20) * 100)}%`
                    : result
                      ? "100%"
                      : "6%",
              }}
            />
          </div>
        </div>

        {audioUrl && (
          <audio
            controls
            src={audioUrl}
            className="mt-4 w-full"
          />
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-accent-hot/40 bg-accent-hot/10 px-3 py-2 text-sm text-white/75">
            {error}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-edge bg-bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-white/40">
              Analysis
            </div>
            <h2 className="mt-1 text-xl font-semibold">推定コード進行</h2>
          </div>
          {result && (
            <div className="rounded-lg border border-edge bg-bg-elevated px-3 py-2 text-right">
              <div className="text-xs text-white/40">Key</div>
              <div className="font-mono text-lg">
                {result.key.key}
                <span className="ml-2 text-xs text-white/40">
                  {confidenceLabel(result.key.confidence)}
                </span>
              </div>
            </div>
          )}
        </div>

        {!result && (
          <div className="mt-6 rounded-xl border border-dashed border-edge bg-bg-elevated/50 p-6 text-sm text-white/45">
            {status === "analyzing"
              ? "解析中..."
              : "録音するとここにコード候補が並びます。"}
          </div>
        )}

        {result && (
          <>
            <div className="mt-5 flex flex-wrap gap-2">
              {result.progression.map((item, index) => (
                <div
                  key={`${item.chordName}-${item.start}-${index}`}
                  className="min-w-[5.5rem] rounded-xl border border-edge bg-bg-elevated p-3"
                >
                  <div className="font-mono text-xs text-white/40">
                    {item.romanNumeral}
                  </div>
                  <div className="mt-1 font-mono text-2xl">
                    {item.chordName}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-white/35">
                    {formatTime(item.start)}-{formatTime(item.end)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {result.progression.map((item, index) => {
                const left = (item.start / result.duration) * 100;
                const width =
                  ((item.end - item.start) / result.duration) * 100;
                return (
                  <div
                    key={`${item.chordName}-bar-${index}`}
                    className="relative h-9 overflow-hidden rounded-lg border border-edge bg-bg-elevated"
                  >
                    <div
                      className="absolute inset-y-0 rounded-md bg-accent/25"
                      style={{
                        left: `${Math.max(0, left)}%`,
                        width: `${Math.max(4, width)}%`,
                      }}
                    />
                    <div className="relative flex h-full items-center justify-between px-3 font-mono text-xs">
                      <span>{item.chordName}</span>
                      <span className="text-white/40">
                        {confidenceLabel(item.confidence)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={playDetectedProgression}
                disabled={!hasProgression}
                className="rounded-lg bg-gradient-to-br from-accent to-accent-cool px-4 py-2 text-sm font-medium text-bg-base shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isPlaying ? "停止" : "進行を再生"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setResult(undefined);
                  setStatus("idle");
                  setElapsed(0);
                }}
                className="rounded-lg border border-edge bg-bg-elevated px-4 py-2 text-sm text-white/70 transition hover:text-white"
              >
                クリア
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
