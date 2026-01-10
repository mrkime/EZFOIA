import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import RequestTimeline from "@/components/RequestTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestDetailsSkeleton } from "@/components/ui/skeletons";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Building2,
  Calendar,
  FileType,
  ScrollText,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface FoiaRequest {
  id: string;
  agency_name: string;
  agency_type: string;
  record_type: string;
  record_description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FoiaDocument {
  id: string;
  request_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { 
        icon: Clock, 
        label: "Pending",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        description: "Your request has been submitted and is awaiting review."
      };
    case "in_progress":
    case "processing":
      return { 
        icon: Loader2, 
        label: "Processing",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        description: "Your request is being processed by the agency."
      };
    case "completed":
      return { 
        icon: CheckCircle, 
        label: "Completed",
        className: "bg-primary/20 text-primary border-primary/30",
        description: "Your request has been fulfilled. Documents are available below."
      };
    case "rejected":
    case "denied":
      return { 
        icon: AlertCircle, 
        label: "Denied",
        className: "bg-destructive/20 text-destructive border-destructive/30",
        description: "Unfortunately, your request was denied by the agency."
      };
    default:
      return { 
        icon: Clock, 
        label: status,
        className: "bg-muted text-muted-foreground",
        description: ""
      };
  }
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const RequestDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<FoiaRequest | null>(null);
  const [documents, setDocuments] = useState<FoiaDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && requestId) {
      fetchRequest();
      fetchDocuments();
    }
  }, [user, requestId]);

  const fetchRequest = async () => {
    try {
      const { data, error } = await supabase
        .from("foia_requests")
        .select("*")
        .eq("id", requestId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Request not found");
        navigate("/dashboard");
        return;
      }
      setRequest(data);
    } catch (error) {
      logger.error("Error fetching request:", error);
      toast.error("Failed to load request details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("foia_documents")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      logger.error("Error fetching documents:", error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleDownloadDocument = async (doc: FoiaDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("foia-documents")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      logger.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 pb-16">
          <Skeleton className="h-10 w-40 mb-6" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Header skeleton */}
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Skeleton className="h-8 w-64 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-7 w-28 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
              
              {/* Description skeleton */}
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
              
              {/* Documents skeleton */}
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-44" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-14 w-full mb-2" />
                  <Skeleton className="h-14 w-full" />
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="space-y-6">
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 mt-0.5" />
                      <div>
                        <Skeleton className="h-3 w-20 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-36" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !request) {
    return null;
  }

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2 -ml-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Header */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-2xl mb-2">
                      {request.agency_name}
                    </CardTitle>
                    <p className="text-muted-foreground capitalize">
                      {request.agency_type} Agency
                    </p>
                  </div>
                  <Badge className={`gap-1 text-sm px-3 py-1 ${statusConfig.className}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {statusConfig.description}
                </p>
              </CardContent>
            </Card>

            {/* Record Description */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <ScrollText className="w-5 h-5" />
                  Record Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {request.record_description}
                </p>
              </CardContent>
            </Card>

            {/* Returned Documents */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Returned Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                ) : documents.length === 0 ? (
                  <div className="bg-muted/30 rounded-lg p-8 text-center">
                    <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium mb-1">No Documents Available Yet</p>
                    <p className="text-sm text-muted-foreground">
                      {request.status === "completed" 
                        ? "Documents are being processed and will appear here soon."
                        : "Documents will be available once your request is completed."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(doc.file_size)} • Uploaded {format(new Date(doc.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Agency Type</p>
                    <p className="font-medium capitalize">{request.agency_type}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <FileType className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Record Type</p>
                    <p className="font-medium capitalize">{request.record_type}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Filed</p>
                    <p className="font-medium">
                      {format(new Date(request.created_at), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {format(new Date(request.updated_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Request Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RequestTimeline 
                  currentStatus={request.status}
                  createdAt={request.created_at}
                  updatedAt={request.updated_at}
                />
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-border">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Status updates are automatically reflected here as your request progresses through the FOIA process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestDetails;
