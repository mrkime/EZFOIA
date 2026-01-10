import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RequestHistoryTable from "@/components/dashboard/RequestHistoryTable";
import AccountSettings from "@/components/dashboard/AccountSettings";
import DashboardTour from "@/components/DashboardTour";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings } from "lucide-react";
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

const TOUR_STORAGE_KEY = "ezfoia_dashboard_tour_completed";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState<FoiaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [showTour, setShowTour] = useState(false);

  // Check if user should see the tour
  useEffect(() => {
    if (user) {
      const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!tourCompleted) {
        // Small delay to let the page render first
        const timer = setTimeout(() => setShowTour(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleTourComplete = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setShowTour(false);
    toast.success("Welcome aboard! You're all set to start using EZFOIA.");
  };

  const handleTourSkip = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setShowTour(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Show success toast if coming from payment
  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Payment successful! Thank you for your purchase.");
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
      
      {/* Dashboard Tour */}
      {showTour && (
        <DashboardTour
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your FOIA requests, manage your account, and access returned documents.
          </p>
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <DashboardSummary requests={requests} loading={loading} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="requests" className="gap-2">
              <FileText className="w-4 h-4" />
              My Requests
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <RequestHistoryTable requests={requests} loading={loading} />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
