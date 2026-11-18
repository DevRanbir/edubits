import { useState, useCallback, useEffect } from "react";
import { X, Download } from "lucide-react";
import WarmTooltip from "../../../components/ui/WarmTooltip";
import "./PdfViewer.css";

const getAttachmentUrl = (sourceUrl) =>
  sourceUrl?.replace("/upload/", "/upload/fl_attachment/") || sourceUrl;

const getFullWidthPdfUrl = (url) => {
  if (!url) return "";
  const baseUrl = url.split("#")[0];
  return `${baseUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-width&pagemode=none`;
};

export default function PdfViewer({
  isOpen,
  onClose,
  url,
  title,
  variant,
  onToggleVariant,
  linkedUrl,
}) {
  const [error, setError] = useState(null);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = getAttachmentUrl(url);
    a.download = `${title || "document"}.pdf`;
    a.click();
  }, [url, title]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayTitle = (title || "Document")
    .replace(/\s*\(?(Questions|Solution)\)?/gi, "")
    .trim();

  return (
    <div className="pdf-viewer-overlay" onClick={onClose}>
      <div className="pdf-viewer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-viewer-header">
          <div className="pdf-viewer-title">
            <span>{displayTitle}</span>
          </div>

          {/* Segmented Tab Bar showing BOTH Questions and Solution */}
          {variant && (
            <div className="pdf-variant-tabbar">
              <button
                type="button"
                className={`pdf-variant-tab ${variant === "questions" ? "active" : ""}`}
                onClick={() => {
                  if (variant !== "questions" && onToggleVariant) onToggleVariant();
                }}
              >
                Questions
              </button>
              <button
                type="button"
                className={`pdf-variant-tab ${variant === "solution" ? "active" : ""}`}
                onClick={() => {
                  if (variant !== "solution" && onToggleVariant) onToggleVariant();
                }}
                disabled={variant !== "solution" && !linkedUrl}
                title={
                  variant === "solution" || linkedUrl
                    ? "View Solution"
                    : "Solution not uploaded"
                }
              >
                Solution
              </button>
            </div>
          )}

          <div className="pdf-viewer-actions">
            <WarmTooltip content="Download PDF" side="bottom">
              <button
                className="pdf-action-btn"
                onClick={handleDownload}
                title="Download PDF"
              >
                <Download size={15} />
              </button>
            </WarmTooltip>
            <WarmTooltip content="Close preview" shortcut="Esc" side="bottom">
              <button
                className="pdf-action-btn pdf-close-btn"
                onClick={onClose}
                title="Close (Esc)"
              >
                <X size={17} />
              </button>
            </WarmTooltip>
          </div>
        </div>

        {error && (
          <div className="pdf-viewer-error">
            <p>Failed to load PDF: {error}</p>
            <button type="button" onClick={() => setError(null)}>
              Retry
            </button>
            <a href={getAttachmentUrl(url)} download={`${title || "document"}.pdf`}>
              Download PDF
            </a>
          </div>
        )}

        {!error && (
          <div className="pdf-viewer-content">
            <iframe
              key={url}
              title={`${displayTitle} preview`}
              src={getFullWidthPdfUrl(url)}
              className="pdf-viewer-frame"
              onError={() => setError("The browser could not display this PDF.")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
