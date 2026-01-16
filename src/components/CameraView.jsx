import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const CameraView = ({ onImageCapture }) => {
    const [preview, setPreview] = useState(null);

    const handleCapture = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageCapture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
            {!preview ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-gray-100 p-8 rounded-full border-4 border-blue-500 animate-pulse">
                        <label htmlFor="camera-input" className="cursor-pointer">
                            <Camera size={64} className="text-blue-600" />
                        </label>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">Tap icon to scan text</p>
                    <input
                        id="camera-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleCapture}
                    />
                </div>
            ) : (
                <div className="relative w-full h-full flex flex-col items-center">
                    {/* Image Preview */}
                    <img
                        src={preview}
                        alt="Captured"
                        className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg mb-4"
                    />

                    <button
                        onClick={() => setPreview(null)}
                        className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-md active:scale-95 transition-transform"
                    >
                        Retake
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraView;
