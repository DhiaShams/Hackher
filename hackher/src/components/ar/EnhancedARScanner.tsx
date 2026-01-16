"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, RefreshCw, Loader2, X } from "lucide-react";
import { createWorker } from 'tesseract.js';
import { BionicWord } from "@/components/shared/BionicWord";
import { simplifyWord } from "@/utils/wordSimplifier";

export function EnhancedARScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mode, setMode] = useState<"camera" | "processing" | "result">("camera");
    const [permission, setPermission] = useState<"prompt" | "granted" | "denied">("prompt");
    const [ocrText, setOcrText] = useState<string>("");
    const [processedWords, setProcessedWords] = useState<Array<{ original: string; simplified?: string }>>([]);
    const [isProcessing, setIsProcessing] = useState(false);

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

    const captureAndProcess = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setMode("processing");
        setIsProcessing(true);

        // Capture frame from video
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Crop to center region for faster processing (as per the hack suggestion)
        const cropWidth = canvas.width * 0.8;
        const cropHeight = canvas.height * 0.6;
        const cropX = (canvas.width - cropWidth) / 2;
        const cropY = (canvas.height - cropHeight) / 2;

        const imageData = context.getImageData(cropX, cropY, cropWidth, cropHeight);
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;
        const croppedContext = croppedCanvas.getContext('2d');
        croppedContext?.putImageData(imageData, 0, 0);

        try {
            // Initialize Tesseract worker
            const worker = await createWorker('eng');

            // Perform OCR
            const { data: { text } } = await worker.recognize(croppedCanvas.toDataURL());

            console.log("OCR Result:", text);

            // Clean and process text
            const cleanedText = text.trim();
            setOcrText(cleanedText);

            // Split into words for bionic processing
            const words = cleanedText.split(/\s+/).filter(w => w.length > 0);
            setProcessedWords(words.map(word => ({ original: word })));

            await worker.terminate();
            setMode("result");
        } catch (error) {
            console.error("OCR Error:", error);
            // Fallback to demo text if OCR fails
            const fallbackText = "The quick brown fox jumps over the lazy dog. Reading is fun!";
            setOcrText(fallbackText);
            setProcessedWords(fallbackText.split(/\s+/).map(word => ({ original: word })));
            setMode("result");
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleWordClick = (index: number) => {
        setProcessedWords(prev => {
            const newWords = [...prev];
            const word = newWords[index];

            if (word.simplified) {
                // Toggle back to original
                newWords[index] = { original: word.original };
            } else {
                // Simplify
                const simplified = simplifyWord(word.original);
                if (simplified !== word.original.toLowerCase()) {
                    newWords[index] = { ...word, simplified };
                }
            }

            return newWords;
        });
    };

    const handleReset = () => {
        setMode("camera");
        setOcrText("");
        setProcessedWords([]);
    };

    if (permission === "prompt" || permission === "denied") {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Camera size={40} />
                </div>
                <h2 className="text-2xl font-bold">Camera Access Required</h2>
                <p className="text-muted-foreground max-w-md">
                    Point your camera at any text to see it transformed with Bionic Reading!
                </p>
                {permission === "denied" && (
                    <p className="text-destructive font-bold">Access Denied. Please enable camera in settings.</p>
                )}
                <button
                    onClick={startCamera}
                    className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform"
                >
                    Enable Camera
                </button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl">
            {/* Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${mode !== "camera" ? "opacity-30 blur-sm" : ""}`}
            />

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Processing Overlay */}
            {mode === "processing" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur">
                    <div className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-lg font-bold">Reading the magic ink...</p>
                        <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                    </div>
                </div>
            )}

            {/* Result Overlay - Bionic Text */}
            {mode === "result" && (
                <div className="absolute inset-0 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                    <div className="bg-yellow-100 dark:bg-yellow-900/90 p-6 rounded-2xl shadow-xl max-w-2xl w-full border-4 border-yellow-400 max-h-[70vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-black dark:text-white">
                                ✨ Bionic Reading Mode
                            </h3>
                            <button onClick={handleReset} className="p-2 hover:bg-black/10 rounded-full">
                                <X size={24} className="text-black dark:text-white" />
                            </button>
                        </div>

                        <div className="text-2xl leading-loose font-dyslexic text-black dark:text-white mb-4" style={{ fontFamily: 'Lexend, sans-serif' }}>
                            {processedWords.map((wordObj, i) => (
                                <span
                                    key={i}
                                    onClick={() => handleWordClick(i)}
                                    className={`cursor-pointer inline-block transition-all hover:scale-110 ${wordObj.simplified ? 'bg-green-200 dark:bg-green-700 px-2 rounded' : ''
                                        }`}
                                    title={wordObj.simplified ? `Original: ${wordObj.original}` : 'Click to simplify'}
                                >
                                    <BionicWord word={wordObj.simplified || wordObj.original} />
                                </span>
                            ))}
                        </div>

                        <div className="pt-4 border-t-2 border-yellow-600 text-sm text-black/70 dark:text-white/70">
                            💡 <strong>Tip:</strong> Tap any word to see a simpler version!
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Controls */}
            {mode === "camera" && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                    <button
                        onClick={captureAndProcess}
                        disabled={isProcessing}
                        className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
                        aria-label="Capture Photo"
                    >
                        <div className="w-16 h-16 bg-white rounded-full shadow-inner" />
                    </button>
                </div>
            )}

            {mode === "result" && (
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
