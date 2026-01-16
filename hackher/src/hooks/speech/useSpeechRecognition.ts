"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface UseSpeechRecognitionProps {
    onKeywordDetected?: (keyword: string) => void;
    onEmotionKeyword?: (keyword: string) => void;
    keywords?: string[];
    emotionKeywords?: string[];
}

export function useSpeechRecognition({
    onKeywordDetected,
    onEmotionKeyword,
    keywords = [],
    emotionKeywords = ["hard", "stop", "stuck", "help", "difficult"],
}: UseSpeechRecognitionProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if browser supports Speech Recognition
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        setIsSupported(!!SpeechRecognition);

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const fullTranscript = (finalTranscript + interimTranscript).toLowerCase();
                setTranscript(fullTranscript);

                // Check for keywords
                if (finalTranscript) {
                    keywords.forEach(keyword => {
                        if (fullTranscript.includes(keyword.toLowerCase())) {
                            onKeywordDetected?.(keyword);
                        }
                    });

                    // Check for emotion keywords
                    emotionKeywords.forEach(emotionWord => {
                        if (fullTranscript.includes(emotionWord.toLowerCase())) {
                            onEmotionKeyword?.(emotionWord);
                        }
                    });
                }
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'no-speech') {
                    // Ignore no-speech errors
                    return;
                }
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [keywords, emotionKeywords, onKeywordDetected, onEmotionKeyword]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setTranscript("");
            } catch (error) {
                console.error('Error starting recognition:', error);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    return {
        isListening,
        transcript,
        isSupported,
        startListening,
        stopListening,
    };
}
