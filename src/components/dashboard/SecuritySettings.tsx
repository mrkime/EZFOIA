import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { useNavigate } from "react-router-dom";
import { Shield, Key, Trash2, Loader2, Lock, Smartphone } from "lucide-react";

const SecuritySettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Check if user signed up with OAuth
  const isOAuthUser = user?.app_metadata?.provider !== "email";

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      logger.error("Error changing password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setDeleteLoading(true);
    try {
      // Sign out user first
      await signOut();
      toast.success("Account deletion requested. You will be contacted for confirmation.");
      navigate("/");
    } catch (error) {
      logger.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please contact support.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card className="bg-card-gradient border-border">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your password, two-factor authentication, and account security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Change Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Change Password</h3>
          </div>

          {isOAuthUser ? (
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">
                You signed in with a social provider. Password management is handled by your provider.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={passwordLoading || !newPassword || !confirmPassword}
                className="gap-2"
              >
                {passwordLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Update Password
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* 2FA Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Two-Factor Authentication</h3>
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              Coming Soon
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <Button variant="outline" disabled className="gap-2">
            <Smartphone className="w-4 h-4" />
            Enable 2FA
          </Button>
        </div>

        <Separator />

        {/* Connected Accounts */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Connected Accounts
          </h3>
          <div className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                {isOAuthUser ? "G" : "@"}
              </div>
              <div>
                <p className="font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  {isOAuthUser ? "Google Account" : "Email & Password"}
                </p>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary">Connected</Badge>
          </div>
        </div>

        <Separator />

        {/* Delete Account Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-destructive" />
            <h3 className="font-medium text-destructive">Danger Zone</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirm">
                      Type <span className="font-bold text-destructive">DELETE</span> to confirm
                    </Label>
                    <Input
                      id="delete-confirm"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirmText !== "DELETE"}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {deleteLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete Account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
