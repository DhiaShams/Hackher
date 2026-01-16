import React, { useState, useEffect } from 'react';
import CameraView from './components/CameraView';
import OCRProcessor from './components/OCRProcessor';
import BionicOverlay from './components/BionicOverlay';
import { Camera, Loader2, ArrowLeft } from 'lucide-react';
import SnowmanAvatar from '../games/components/SnowmanAvatar';

const BionicReaderApp = ({ onBack }) => {
    const [image, setImage] = useState(null);
    const [text, setText] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImageCapture = (imageData) => {
        setImage(imageData);
        setText(null);
    };

    const handleTextExtracted = (extractedText) => {
        setText(extractedText);
    };

    const handleRetake = () => {
        setImage(null);
        setText(null);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Top Header */}
            <header className="bg-white shadow-sm p-4 z-10 flex items-center justify-between">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                )}
                <h1 className="text-xl font-bold text-gray-800 tracking-wide flex-1 text-center">Lumina Lens</h1>
                {onBack && <div className="w-20"></div>} {/* Spacer for centering */}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {!image ? (
                    // Camera Shell
                    <CameraView onImageCapture={handleImageCapture} />
                ) : (
                    // Processing / Result View
                    <div className="relative w-full h-full flex flex-col">

                        {/* Logic Component: OCR. Only runs if no text yet. */}
                        {!text && (
                            <OCRProcessor
                                imageData={image}
                                onTextExtracted={handleTextExtracted}
                                onLoading={setIsProcessing}
                            />
                        )}

                        {/* If Processing: Show Image + Loading Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white">
                                <Loader2 size={48} className="animate-spin mb-4" />
                                <p className="text-lg font-semibold animate-pulse">Processing Text...</p>
                            </div>
                        )}

                        {/* If Text Ready: Show Bionic Overlay */}
                        {text ? (
                            <BionicOverlay text={text} />
                        ) : (
                            // While processing, show the captured image in background
                            <div className="flex-1 bg-black flex items-center justify-center">
                                <img src={image} alt="Processing" className="max-w-full max-h-full opacity-50" />
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Bottom FAB (Result View Only) */}
            {(text || isProcessing) && (
                <div className="absolute bottom-6 right-6 z-30">
                    <button
                        onClick={handleRetake}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform active:scale-90"
                        disabled={isProcessing}
                        aria-label="Retake Photo"
                    >
                        <Camera size={24} />
                    </button>
                </div>
            )}

            {/* Global Avatar for Reading Lens */}
            <div style={{ position: 'fixed', bottom: '0', left: '0', zIndex: 60, pointerEvents: 'none' }}>
                <SnowmanAvatar
                    size="xlarge"
                    isVisible={true}
                    isSpeaking={false}
                    emotion={text ? 'happy' : 'encouraging'}
                />
            </div>
        </div>
    );
};

export default BionicReaderApp;
