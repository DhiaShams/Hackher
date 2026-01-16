"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AudioAnalysis {
    isListening: boolean;
    volume: number; // 0 to 1 scaling
    hasSpeech: boolean;
    startListening: () => Promise<void>;
    stopListening: () => void;
}

export function useAudioAnalysis(): AudioAnalysis {
    const [isListening, setIsListening] = useState(false);
    const [volume, setVolume] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const startListening = useCallback(async () => {
        try {
            if (!navigator.mediaDevices) {
                console.error("Audio API not supported");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;
            setIsListening(true);

            const updateVolume = () => {
                if (!analyserRef.current) return;

                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);

                // Calculate average volume
                const sum = dataArray.reduce((acc, val) => acc + val, 0);
                const average = sum / dataArray.length;
                const normalizedVolume = Math.min(average / 100, 1); // Normalize roughly to 0-1

                setVolume(normalizedVolume);
                rafIdRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();

        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsListening(false);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setIsListening(false);
        setVolume(0);
    }, []);

    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

    return {
        isListening,
        volume,
        hasSpeech: volume > 0.1, // Threshold
        startListening,
        stopListening,
    };
}
