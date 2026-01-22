import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TableRowSkeleton } from "@/components/ui/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Clock, CheckCircle, AlertCircle, Loader2, Eye, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import RequestFilters from "./RequestFilters";
import { FoiaWizardModal } from "@/components/foia-wizard";
import EmptyState from "@/components/ui/empty-state";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleViewDetails = (requestId: string) => {
    navigate(`/dashboard/request/${requestId}`);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.agency_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.record_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.record_description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        request.status.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === "in_progress" && request.status.toLowerCase() === "processing");

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleExport = () => {
    if (filteredRequests.length === 0) {
      toast.error("No requests to export");
      return;
    }

    const csvHeaders = ["Agency", "Type", "Record Type", "Description", "Status", "Date Filed", "Last Updated"];
    const csvRows = filteredRequests.map((r) => [
      r.agency_name,
      r.agency_type,
      r.record_type,
      `"${r.record_description.replace(/"/g, '""')}"`,
      r.status,
      format(new Date(r.created_at), "yyyy-MM-dd"),
      format(new Date(r.updated_at), "yyyy-MM-dd"),
    ]);

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `foia-requests-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Requests exported successfully");
  };

  return (
    <Card className="bg-card-gradient border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display">Request History</CardTitle>
        <FoiaWizardModal>
          <Button
            variant="hero"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </FoiaWizardModal>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-0">
            {/* Filters skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Skeleton className="h-10 flex-1 max-w-sm rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
            {/* Table rows skeleton */}
            {[...Array(5)].map((_, i) => (
              <TableRowSkeleton key={i} columns={6} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Requests Yet"
            description="You haven't submitted any FOIA requests yet."
            secondaryDescription="Start by filing your first request to access public records."
            actionElement={
              <FoiaWizardModal>
                <Button variant="hero" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Submit Your First Request
                </Button>
              </FoiaWizardModal>
            }
          />
        ) : (
          <>
            <RequestFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onExport={handleExport}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
            
            {filteredRequests.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No Matching Results"
                description="No requests match your current filters."
                secondaryDescription="Try adjusting your search terms or clearing the filters."
                variant="minimal"
                action={{
                  label: "Clear Filters",
                  onClick: handleClearFilters,
                }}
              />
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
                {filteredRequests.map(request => {
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
          </>
        )}

      </CardContent>
    </Card>
  );
};

export default RequestHistoryTable;
