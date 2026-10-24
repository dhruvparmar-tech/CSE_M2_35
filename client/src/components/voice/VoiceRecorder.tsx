import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isProcessing?: boolean;
}

export function VoiceRecorder({ onTranscription, isProcessing = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (e: any) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript;
        }
      }
      if (final) {
        setTranscript((prev) => {
          const updated = (prev + ' ' + final).trim();
          onTranscription(updated);
          return updated;
        });
      }
    };

    rec.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error);
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = rec;
  }, [onTranscription]);

  const toggleRecording = () => {
    if (!supported || !recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Speech start error:', err);
      }
    }
  };

  if (!supported) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center text-xs text-slate-500">
        Voice mode is not supported by your browser. Please use standard text mode.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isRecording ? 'Listening...' : 'Voice Recorder'}
          </span>
        </div>
        {isRecording && <AudioWaveform />}
      </div>

      <div className="flex gap-2">
        <Button
          variant={isRecording ? 'destructive' : 'primary'}
          onClick={toggleRecording}
          disabled={isProcessing}
        >
          {isRecording ? (
            <>
              <MicOff className="h-4 w-4 mr-1.5" /> Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-1.5" /> Start Recording
            </>
          )}
        </Button>
      </div>

      {transcript && (
        <div className="w-full text-sm text-slate-300 bg-slate-950/40 rounded-lg p-3 border border-slate-800 max-h-24 overflow-y-auto">
          <div className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wider">Transcription Preview</div>
          <p className="italic">"{transcript}"</p>
        </div>
      )}
    </div>
  );
}
export default VoiceRecorder;
