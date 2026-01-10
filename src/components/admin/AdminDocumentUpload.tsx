import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

interface FoiaRequest {
  id: string;
  agency_name: string;
  record_type: string;
}

interface AdminDocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: FoiaRequest | null;
  onUploadComplete: () => void;
}

const AdminDocumentUpload = ({
  open,
  onOpenChange,
  request,
  onUploadComplete,
}: AdminDocumentUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!request || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    try {
      for (const file of files) {
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${request.id}/${timestamp}_${sanitizedName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('foia-documents')
          .upload(filePath, file);

        if (uploadError) {
          logger.error('Upload error:', uploadError);
          toast({
            title: 'Upload Failed',
            description: `Failed to upload ${file.name}: ${uploadError.message}`,
            variant: 'destructive',
          });
          continue;
        }

        // Create document record
        const { error: dbError } = await supabase.from('foia_documents').insert({
          request_id: request.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        });

        if (dbError) {
          logger.error('Database error:', dbError);
          toast({
            title: 'Database Error',
            description: `Failed to record ${file.name}: ${dbError.message}`,
            variant: 'destructive',
          });
          continue;
        }

        successCount++;
      }

      if (successCount > 0) {
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} of ${files.length} file(s)`,
        });
        setFiles([]);
        onUploadComplete();
        onOpenChange(false);
      }
    } catch (error) {
      logger.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            {request && (
              <>
                Upload response documents for: <strong>{request.agency_name}</strong> -{' '}
                {request.record_type}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="files">Select Files</Label>
            <div className="mt-2">
              <Input
                ref={fileInputRef}
                id="files"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-dashed flex flex-col gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground">Click to select files or drag and drop</span>
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({files.length})</Label>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {files.length > 0 && `(${files.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDocumentUpload;
