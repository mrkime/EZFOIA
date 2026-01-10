import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { Bell, Mail, MessageSquare } from "lucide-react";

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_notifications, sms_notifications")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setEmailNotifications(data.email_notifications ?? true);
        setSmsNotifications(data.sms_notifications ?? false);
      }
    } catch (error) {
      logger.error("Error fetching notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (field: string, value: boolean) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { 
            user_id: user!.id, 
            [field]: value 
          }, 
          { onConflict: "user_id" }
        );

      if (error) throw error;
      toast.success("Notification preferences updated");
    } catch (error) {
      logger.error("Error updating notification preferences:", error);
      toast.error("Failed to update preferences");
      // Revert on error
      if (field === "email_notifications") setEmailNotifications(!value);
      if (field === "sms_notifications") setSmsNotifications(!value);
    } finally {
      setUpdating(false);
    }
  };

  const handleEmailToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    updatePreference("email_notifications", checked);
  };

  const handleSmsToggle = (checked: boolean) => {
    setSmsNotifications(checked);
    updatePreference("sms_notifications", checked);
  };

  return (
    <Card className="bg-card-gradient border-border">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to receive updates about your FOIA requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive status updates and confirmations via email
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={handleEmailToggle}
                disabled={updating}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="sms-notifications" className="text-base font-medium">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get text message alerts for important updates
                  </p>
                </div>
              </div>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={handleSmsToggle}
                disabled={updating}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Note: SMS notifications require a valid phone number in your profile settings.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
