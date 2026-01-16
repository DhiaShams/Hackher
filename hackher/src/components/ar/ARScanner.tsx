"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Type, X } from "lucide-react";
import { ReadingRuler } from "./ReadingRuler";
import { BionicWord } from "@/components/shared/BionicWord";

const DEMO_TEXT = "Once upon a time in a digital forest, there lived a little AI named Pixel. Pixel loved to read, but the words sometimes danced on the page. With the Magic Lens, the words stood still and clear.";

export function ARScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mode, setMode] = useState<"live" | "snap">("live");
    const [permission, setPermission] = useState<"prompt" | "granted" | "denied">("prompt");
    const [ocrText, setOcrText] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            setStream(mediaStream);
            setPermission("granted");
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error(err);
            setPermission("denied");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const handleSnap = () => {
        // In a real app, we'd capture canvas context here and send to OCR
        // For V1 Demo: We freeze the video (conceptually) and show the "Recognized" text
        setMode("snap");
        // Simulate OCR delay
        setTimeout(() => {
            setOcrText(DEMO_TEXT);
        }, 1500);
    };

    const handleReset = () => {
        setMode("live");
        setOcrText(null);
    };

    if (permission === "prompt" || permission === "denied") {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Camera size={40} />
                </div>
                <h2 className="text-2xl font-bold">Allow Camera Access</h2>
                <p className="text-muted-foreground">
                    To use the Magic Lens, we need to see what you're reading.
                </p>
                {permission === "denied" && (
                    <p className="text-destructive font-bold">Access Denied. Please enable permissions in settings.</p>
                )}
                <button
                    onClick={startCamera}
                    className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                >
                    Start Camera
                </button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl">
            {/* Viewfinder */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity ${mode === "snap" ? "opacity-30 blur-sm" : "opacity-100"}`}
            />

            {/* Overlays */}
            <ReadingRuler isActive={mode === "live"} />

            {/* Snapshot/Result Overlay */}
            {mode === "snap" && ocrText && (
                <div className="absolute inset-0 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90 p-6 rounded-2xl shadow-xl max-w-md w-full border border-primary/20">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <Type size={20} />
                                <span>Bionic Reader</span>
                            </div>
                            <button onClick={handleReset} className="p-2 hover:bg-muted rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-lg leading-loose font-dyslexic text-foreground">
                            {ocrText.split(" ").map((word, i) => (
                                <BionicWord key={i} word={word} />
                            ))}
                        </p>

                        <div className="mt-4 pt-4 border-t border-border flex justify-end">
                            <button className="text-sm text-muted-foreground hover:text-primary underline">
                                Wait, simplify "digital"?
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Loading State */}
            {mode === "snap" && !ocrText && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 backdrop-blur rounded-full px-6 py-3 text-white font-bold animate-pulse">
                        Scanning Magic Ink...
                    </div>
                </div>
            )}

            {/* Controls */}
            {mode === "live" && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                    <button
                        onClick={handleSnap}
                        className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                        aria-label="Snap Photo"
                    >
                        <div className="w-16 h-16 bg-white rounded-full shadow-inner" />
                    </button>
                </div>
            )}

            {mode === "snap" && ocrText && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur"
                    >
                        <RefreshCw size={20} />
                        Scan Again
                    </button>
                </div>
            )}
        </div>
    );
}
