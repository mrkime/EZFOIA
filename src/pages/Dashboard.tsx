import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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
        variant: "secondary" as const,
        label: "Pending",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      };
    case "in_progress":
    case "processing":
      return { 
        icon: Loader2, 
        variant: "secondary" as const,
        label: "Processing",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30"
      };
    case "completed":
      return { 
        icon: CheckCircle, 
        variant: "default" as const,
        label: "Completed",
        className: "bg-primary/20 text-primary border-primary/30"
      };
    case "rejected":
    case "denied":
      return { 
        icon: AlertCircle, 
        variant: "destructive" as const,
        label: "Denied",
        className: "bg-destructive/20 text-destructive border-destructive/30"
      };
    default:
      return { 
        icon: Clock, 
        variant: "secondary" as const,
        label: status,
        className: "bg-muted text-muted-foreground"
      };
  }
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState<FoiaRequest[]>([]);
  const [documents, setDocuments] = useState<Record<string, FoiaDocument[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<FoiaRequest | null>(null);
  const [requestDocuments, setRequestDocuments] = useState<FoiaDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Show success toast if coming from payment
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Payment successful! Thank you for your purchase.");
      // Clear the query param
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("foia_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentsForRequest = async (requestId: string) => {
    setDocumentsLoading(true);
    try {
      const { data, error } = await supabase
        .from("foia_documents")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequestDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setRequestDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleViewDetails = (request: FoiaRequest) => {
    setSelectedRequest(request);
    fetchDocumentsForRequest(request.id);
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
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-32">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            My FOIA Requests
          </h1>
          <p className="text-muted-foreground">
            Track the status of your submitted requests and access returned documents.
          </p>
        </div>

        {/* Subscription + Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <SubscriptionStatus />
          <Card className="bg-card-gradient border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">{requests.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card-gradient border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display text-yellow-400">
                {requests.filter(r => r.status === "pending").length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card-gradient border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display text-blue-400">
                {requests.filter(r => ["in_progress", "processing"].includes(r.status)).length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card-gradient border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display text-primary">
                {requests.filter(r => r.status === "completed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card className="bg-card-gradient border-border">
          <CardHeader>
            <CardTitle className="font-display">Request History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any FOIA requests yet.
                </p>
                <Button variant="hero" onClick={() => navigate("/")}>
                  Submit Your First Request
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Agency</TableHead>
                      <TableHead className="text-muted-foreground">Record Type</TableHead>
                      <TableHead className="text-muted-foreground">Date Filed</TableHead>
                      <TableHead className="text-muted-foreground">Last Updated</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map(request => {
                      const statusConfig = getStatusConfig(request.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <TableRow 
                          key={request.id} 
                          className="border-border hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleViewDetails(request)}
                        >
                          <TableCell className="font-medium">
                            <div>
                              <p>{request.agency_name}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {request.agency_type}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{request.record_type}</TableCell>
                          <TableCell>
                            {format(new Date(request.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {format(new Date(request.updated_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge className={`gap-1 ${statusConfig.className}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(request);
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Agency</p>
                  <p className="font-medium">{selectedRequest.agency_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedRequest.agency_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`mt-1 gap-1 ${getStatusConfig(selectedRequest.status).className}`}>
                    {getStatusConfig(selectedRequest.status).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Record Type</p>
                  <p className="font-medium capitalize">{selectedRequest.record_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date Filed</p>
                  <p className="font-medium">
                    {format(new Date(selectedRequest.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Record Description</p>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">
                  {selectedRequest.record_description}
                </p>
              </div>

              {/* Documents Section */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Returned Documents</p>
                {documentsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : requestDocuments.length === 0 ? (
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.status === "completed" 
                        ? "Documents are being processed and will appear here soon."
                        : "Documents will be available once your request is completed."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {requestDocuments.map(doc => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between bg-muted/30 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(doc.file_size)} • {format(new Date(doc.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;