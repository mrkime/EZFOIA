import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";
import { format, formatDistanceToNow } from "date-fns";
import EmptyState from "@/components/ui/empty-state";
import { 
  Activity, 
  FileText, 
  User, 
  CreditCard, 
  LogIn, 
  LogOut,
  Settings,
  Clock
} from "lucide-react";

interface ActivityLogEntry {
  id: string;
  action: string;
  description: string | null;
  metadata: unknown;
  created_at: string;
}

const getActionConfig = (action: string) => {
  switch (action) {
    case "login":
      return { icon: LogIn, color: "text-primary", label: "Logged In" };
    case "logout":
      return { icon: LogOut, color: "text-muted-foreground", label: "Logged Out" };
    case "request_submitted":
      return { icon: FileText, color: "text-blue-400", label: "Request Submitted" };
    case "profile_updated":
      return { icon: User, color: "text-amber-400", label: "Profile Updated" };
    case "subscription_changed":
      return { icon: CreditCard, color: "text-primary", label: "Subscription Changed" };
    case "settings_updated":
      return { icon: Settings, color: "text-muted-foreground", label: "Settings Updated" };
    default:
      return { icon: Activity, color: "text-muted-foreground", label: action };
  }
};

const ActivityLog = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      logger.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card-gradient border-border">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity Log
        </CardTitle>
        <CardDescription>
          Recent activity on your account over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No Recent Activity"
            description="Your activity will appear here as you use the platform."
            secondaryDescription="Submit a request or update your settings to see activity."
            variant="minimal"
          />
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => {
                const config = getActionConfig(activity.action);
                const ActionIcon = config.icon;

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className={`mt-1 ${config.color}`}>
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{config.label}</p>
                        <Badge variant="outline" className="text-xs">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </Badge>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
