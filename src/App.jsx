import React, { useState } from 'react';
import CameraView from './components/CameraView';
import OCRProcessor from './components/OCRProcessor';
import BionicOverlay from './components/BionicOverlay';
import { Camera, Loader2 } from 'lucide-react';

function App() {
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
      <header className="bg-white shadow-sm p-4 z-10 text-center">
        <h1 className="text-xl font-bold text-gray-800 tracking-wide">Lumina Lens</h1>
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
                <img src={image} alt="Proccessing" className="max-w-full max-h-full opacity-50" />
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
    </div>
  );
}

export default App;
