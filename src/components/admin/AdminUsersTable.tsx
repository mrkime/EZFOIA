import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { format } from 'date-fns';
import { logger } from '@/lib/logger';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  is_admin?: boolean;
  request_count?: number;
}

const AdminUsersTable = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleChangeUser, setRoleChangeUser] = useState<Profile | null>(null);
  const [roleAction, setRoleAction] = useState<'grant' | 'revoke' | null>(null);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch admin roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch request counts
      const { data: requestsData, error: requestsError } = await supabase
        .from('foia_requests')
        .select('user_id');

      if (requestsError) throw requestsError;

      // Count requests per user
      const requestCounts: Record<string, number> = {};
      requestsData?.forEach(req => {
        requestCounts[req.user_id] = (requestCounts[req.user_id] || 0) + 1;
      });

      // Combine data
      const adminUserIds = new Set(
        rolesData?.filter(r => r.role === 'admin').map(r => r.user_id) || []
      );

      const enrichedProfiles = profilesData?.map(profile => ({
        ...profile,
        is_admin: adminUserIds.has(profile.user_id),
        request_count: requestCounts[profile.user_id] || 0,
      })) || [];

      setProfiles(enrichedProfiles);
    } catch (error) {
      logger.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleRoleChange = async () => {
    if (!roleChangeUser || !roleAction) return;

    try {
      if (roleAction === 'grant') {
        const { error } = await supabase.from('user_roles').insert({
          user_id: roleChangeUser.user_id,
          role: 'admin',
        });
        if (error) throw error;
        toast({
          title: 'Admin Access Granted',
          description: `${roleChangeUser.full_name || 'User'} is now an admin`,
        });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', roleChangeUser.user_id)
          .eq('role', 'admin');
        if (error) throw error;
        toast({
          title: 'Admin Access Revoked',
          description: `${roleChangeUser.full_name || 'User'} is no longer an admin`,
        });
      }

      setProfiles(prev =>
        prev.map(p =>
          p.user_id === roleChangeUser.user_id
            ? { ...p, is_admin: roleAction === 'grant' }
            : p
        )
      );
    } catch (error) {
      logger.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setRoleChangeUser(null);
      setRoleAction(null);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const name = profile.full_name?.toLowerCase() || '';
    const phone = profile.phone?.toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View all users and manage admin access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map(profile => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{profile.full_name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{profile.phone || '-'}</TableCell>
                      <TableCell>{format(new Date(profile.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{profile.request_count} requests</Badge>
                      </TableCell>
                      <TableCell>
                        {profile.is_admin ? (
                          <Badge className="bg-primary/20 text-primary">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {profile.is_admin ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRoleChangeUser(profile);
                              setRoleAction('revoke');
                            }}
                          >
                            <ShieldX className="h-4 w-4 mr-1" />
                            Revoke Admin
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setRoleChangeUser(profile);
                              setRoleAction('grant');
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Make Admin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!roleChangeUser} onOpenChange={() => setRoleChangeUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleAction === 'grant' ? 'Grant Admin Access?' : 'Revoke Admin Access?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleAction === 'grant' ? (
                <>
                  This will give <strong>{roleChangeUser?.full_name || 'this user'}</strong> full
                  admin privileges including access to all requests, documents, and user management.
                </>
              ) : (
                <>
                  This will remove admin privileges from{' '}
                  <strong>{roleChangeUser?.full_name || 'this user'}</strong>. They will only be
                  able to access their own requests.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange}>
              {roleAction === 'grant' ? 'Grant Access' : 'Revoke Access'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminUsersTable;
