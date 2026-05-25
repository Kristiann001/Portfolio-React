import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfPreviewProps {
  src: string; // base64 data URL or a remote URL
  className?: string;
}

const PdfPreview = ({ src, className = "" }: PdfPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    let cancelled = false;

    const renderPdf = async () => {
      setLoading(true);
      setError(false);
      try {
        const loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        if (!cancelled) setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error("PDF render error:", err);
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-[#1e1e20] gap-2 ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
          <i className="fas fa-file-pdf text-2xl text-red-400"></i>
        </div>
        <span className="text-xs text-gray-400 tracking-widest uppercase">PDF Certificate</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-xs font-bold bg-red-500/10 border border-red-400/30 text-red-400 rounded-full hover:bg-red-500/20 transition-colors"
        >
          View PDF
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2b2b2d]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37]"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
};

export default PdfPreview;
