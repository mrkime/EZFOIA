import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Clock, CheckCircle, AlertCircle, Loader2, Eye } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

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

interface RequestHistoryTableProps {
  requests: FoiaRequest[];
  loading: boolean;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { 
        icon: Clock, 
        label: "Pending",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      };
    case "in_progress":
    case "processing":
      return { 
        icon: Loader2, 
        label: "Processing",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30"
      };
    case "completed":
      return { 
        icon: CheckCircle, 
        label: "Completed",
        className: "bg-primary/20 text-primary border-primary/30"
      };
    case "rejected":
    case "denied":
      return { 
        icon: AlertCircle, 
        label: "Denied",
        className: "bg-destructive/20 text-destructive border-destructive/30"
      };
    default:
      return { 
        icon: Clock, 
        label: status,
        className: "bg-muted text-muted-foreground"
      };
  }
};

const RequestHistoryTable = ({ requests, loading }: RequestHistoryTableProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (requestId: string) => {
    navigate(`/dashboard/request/${requestId}`);
  };

  return (
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
                      onClick={() => handleViewDetails(request.id)}
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
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(request.id);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View
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
  );
};

export default RequestHistoryTable;
