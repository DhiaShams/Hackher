import React, { useState, useRef } from 'react';
import OCRProcessor from './components/OCRProcessor';
import BionicOverlay from './components/BionicOverlay';
import { Camera, Loader2 } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setText(null);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleTextExtracted = (extractedText) => {
    setText(extractedText);
    setIsProcessing(false);
  };

  const handleRetake = () => {
    setImage(null);
    setText(null);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] p-4" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}>
      {/* Header with Logo */}
      <div className="max-w-6xl mx-auto">
        {!image && (
          <>
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-6xl animate-bounce">📚</div>
                <h1 className="text-5xl md:text-6xl font-bold text-[#2D3748]" style={{ fontFamily: "'Fredoka', 'Comic Neue', cursive" }}>
                  Super Reading Helper
                </h1>
                <div className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
              </div>
              <p className="text-xl text-[#2D3748] font-semibold">
                Make reading fun and easy!
              </p>
            </div>

            {/* Main Action Area */}
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              {/* Decorative Background Elements */}
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Floating decorative circles */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-[#FFD700]/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#FFA500]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#3182CE]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Main Camera Button Card */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-12 mb-8 transform hover:scale-105 transition-all duration-300">
                  <div className="text-center">
                    <button
                      onClick={handleCameraClick}
                      className="group relative mx-auto mb-6 p-12 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00] border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <Camera 
                        size={100} 
                        className="text-white drop-shadow-2xl" 
                      />
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-white/30 blur-xl animate-pulse"></div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Hidden Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </>
        )}

        {/* Image Viewer */}
        {image && (
          <div className="space-y-4">
            {/* Fun Title for Reading View */}
            {text && (
              <div className="text-center mb-6">
                <h1 className="text-5xl md:text-6xl font-bold text-[#2D3748] mb-2" style={{ fontFamily: "'Fredoka', 'Comic Neue', cursive" }}>
                  Reading Adventure Time!
                </h1>
                <p className="text-lg text-[#3182CE] font-semibold">
                  Tap words to make them easier!
                </p>
              </div>
            )}

            {/* Image Container - Only show image during processing */}
            {!text && (
              <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden bg-black border-4 border-[#FFD700] shadow-2xl">
                <div className="relative">
                  {/* Background Image */}
                  <img
                    src={image}
                    alt="Scanned page"
                    className="w-full h-auto block"
                  />

                  {/* OCR Processor */}
                  <OCRProcessor
                    imageData={image}
                    onTextExtracted={handleTextExtracted}
                    onLoading={setIsProcessing}
                  />

                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
                      <Loader2 size={48} className="animate-spin mb-4 text-[#FFD700]" />
                      <p className="text-lg font-semibold animate-pulse text-white" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}>
                        Reading your page... 📖
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bionic Text Display - Centered on page */}
            {text && (
              <div className="flex justify-center items-start min-h-[60vh]">
                <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white border-4 border-[#FFD700] shadow-2xl p-8 mb-32">
                  <BionicOverlay text={text} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Retake Button - Fixed at very bottom */}
        {image && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <button
              onClick={handleRetake}
              className="p-5 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-200 border-4 border-[#FFD700] flex items-center justify-center"
              aria-label="Choose Another Photo"
            >
              <Camera size={32} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
