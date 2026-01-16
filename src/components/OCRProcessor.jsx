import React, { useEffect } from 'react';
import { createWorker } from 'tesseract.js';

const OCRProcessor = ({ imageData, onTextExtracted, onLoading }) => {
    useEffect(() => {
        if (!imageData) return;

        const processImage = async () => {
            onLoading(true);
            console.log("Starting OCR...");

            try {
                // Load image to crop
                const img = new Image();
                img.src = imageData;
                await new Promise((resolve) => (img.onload = resolve));

                // Crop to center 75%
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const w = img.width;
                const h = img.height;
                const cw = w * 0.75;
                const ch = h * 0.75;
                const cx = (w - cw) / 2;
                const cy = (h - ch) / 2;

                canvas.width = cw;
                canvas.height = ch;
                ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);

                const croppedParams = canvas.toDataURL('image/jpeg');

                // Initialize Tesseract
                const worker = await createWorker('eng');
                const ret = await worker.recognize(croppedParams);
                console.log("Raw OCR Output:", ret.data.text);

                onTextExtracted(ret.data.text);
                await worker.terminate();
            } catch (error) {
                console.error("OCR Error:", error);
            } finally {
                onLoading(false);
            }
        };

        processImage();
    }, [imageData, onTextExtracted, onLoading]);

    return null;
};

export default OCRProcessor;
