import { EnhancedARScanner } from "@/components/ar/EnhancedARScanner";

export default function ReaderPage() {
    return (
        <div className="pb-8">
            <h1 className="text-2xl font-bold mb-4 px-2">Magic Lens 📸</h1>
            <p className="text-sm text-muted-foreground mb-4 px-2">
                Point your camera at any text and watch it transform with Bionic Reading! Tap words to simplify them.
            </p>
            <EnhancedARScanner />
        </div>
    );
}
