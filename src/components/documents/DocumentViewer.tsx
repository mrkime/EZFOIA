import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    file_name: string;
    file_path: string;
    mime_type: string | null;
  } | null;
}

const DocumentViewer = ({ open, onOpenChange, document }: DocumentViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (open && document) {
      loadDocument();
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, document]);

  const loadDocument = async () => {
    if (!document) return;
    setLoading(true);
    setZoom(100);
    setRotation(0);

    try {
      const { data, error } = await supabase.storage
        .from("foia-documents")
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      setObjectUrl(url);
    } catch (error) {
      console.error("Error loading document:", error);
      toast.error("Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (objectUrl && document) {
      const link = window.document.createElement("a");
      link.href = objectUrl;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success("Download started");
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const mimeType = document?.mime_type || "";
  const isImage = mimeType.startsWith("image/");
  const isPdf = mimeType === "application/pdf";
  const isText = mimeType.startsWith("text/") || mimeType.includes("json");

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <Skeleton className="w-full h-full" />
        </div>
      );
    }

    if (!objectUrl) {
      return (
        <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
          Unable to load document
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="flex items-center justify-center overflow-auto h-[60vh] bg-muted/30 rounded-lg">
          <img
            src={objectUrl}
            alt={document?.file_name}
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease",
              maxWidth: "none",
            }}
            className="max-h-full object-contain"
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="h-[70vh] bg-muted/30 rounded-lg overflow-hidden">
          <iframe
            src={objectUrl}
            className="w-full h-full border-0"
            title={document?.file_name}
          />
        </div>
      );
    }

    if (isText) {
      return (
        <div className="h-[60vh] bg-muted/30 rounded-lg overflow-auto p-4">
          <iframe
            src={objectUrl}
            className="w-full h-full border-0 bg-transparent"
            title={document?.file_name}
          />
        </div>
      );
    }

    // Unsupported format
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] text-muted-foreground gap-4">
        <p>Preview not available for this file type</p>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="w-4 h-4" />
          Download to View
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between gap-4">
          <DialogTitle className="truncate flex-1 font-display">
            {document?.file_name}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom in">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleRotate} title="Rotate">
                  <RotateCw className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="outline" size="icon" onClick={handleDownload} title="Download">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
