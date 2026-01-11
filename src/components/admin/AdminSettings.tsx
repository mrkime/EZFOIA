import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  FileText, 
  Users, 
  TrendingUp, 
  HardDrive,
  RefreshCw,
  TestTube,
  Crown,
  Sparkles,
  Building2,
  XCircle
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { STRIPE_PRICES } from '@/lib/stripe-config';

export const TEST_SUBSCRIPTION_KEY = 'admin_test_subscription';

interface SiteStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalUsers: number;
  totalDocuments: number;
}

interface TestSubscription {
  product_id: string;
  plan_name: string;
}

const AdminSettings = () => {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTestPlan, setActiveTestPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing test subscription on mount
    const savedTest = localStorage.getItem(TEST_SUBSCRIPTION_KEY);
    if (savedTest) {
      try {
        const parsed: TestSubscription = JSON.parse(savedTest);
        setActiveTestPlan(parsed.plan_name);
      } catch {
        localStorage.removeItem(TEST_SUBSCRIPTION_KEY);
      }
    }
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch request stats
      const { data: requests, error: requestsError } = await supabase
        .from('foia_requests')
        .select('status');

      if (requestsError) throw requestsError;

      // Fetch user count
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id');

      if (usersError) throw usersError;

      // Fetch document count
      const { data: documents, error: documentsError } = await supabase
        .from('foia_documents')
        .select('id');

      if (documentsError) throw documentsError;

      const statusCounts = requests?.reduce(
        (acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

      setStats({
        totalRequests: requests?.length || 0,
        pendingRequests: statusCounts['pending'] || 0,
        inProgressRequests: statusCounts['in_progress'] || 0,
        completedRequests: statusCounts['completed'] || 0,
        totalUsers: users?.length || 0,
        totalDocuments: documents?.length || 0,
      });
    } catch (error) {
      logger.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch site statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const activateTestSubscription = (planKey: 'single' | 'professional' | 'enterprise', planName: string) => {
    const productId = STRIPE_PRICES[planKey].monthly.productId;
    const testData: TestSubscription = {
      product_id: productId,
      plan_name: planName,
    };
    localStorage.setItem(TEST_SUBSCRIPTION_KEY, JSON.stringify(testData));
    setActiveTestPlan(planName);
    toast({
      title: 'Test Subscription Activated',
      description: `You can now test the ${planName} experience. Go to the dashboard to submit requests.`,
    });
  };

  const deactivateTestSubscription = () => {
    localStorage.removeItem(TEST_SUBSCRIPTION_KEY);
    setActiveTestPlan(null);
    toast({
      title: 'Test Subscription Deactivated',
      description: 'Normal subscription checking is now active.',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="glass border-border/50">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Site Statistics */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Site Statistics</CardTitle>
            <CardDescription>Overview of your FOIA request system</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Total Requests</span>
              </div>
              <p className="text-3xl font-bold">{stats?.totalRequests || 0}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </div>
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-3xl font-bold">{stats?.pendingRequests || 0}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Database className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <p className="text-3xl font-bold">{stats?.inProgressRequests || 0}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="text-3xl font-bold">{stats?.completedRequests || 0}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-sm text-muted-foreground">Total Users</span>
              </div>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <HardDrive className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-sm text-muted-foreground">Documents</span>
              </div>
              <p className="text-3xl font-bold">{stats?.totalDocuments || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium">View User Dashboard</p>
                    <p className="text-sm text-muted-foreground">See what users experience</p>
                  </div>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium">View Public Site</p>
                    <p className="text-sm text-muted-foreground">Check the landing page</p>
                  </div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Subscriptions */}
      <Card className="glass border-border/50 border-amber-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-amber-500" />
            <CardTitle>Test Subscriptions</CardTitle>
          </div>
          <CardDescription>
            Simulate different subscription tiers without payment. Use this to test the user experience for each plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTestPlan && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Active Test Plan: <strong>{activeTestPlan}</strong></span>
              </div>
              <Button variant="outline" size="sm" onClick={deactivateTestSubscription}>
                <XCircle className="h-4 w-4 mr-1" />
                Deactivate
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={activeTestPlan === 'Single Request' ? 'default' : 'outline'}
              className="h-auto py-4 flex-col items-start"
              onClick={() => activateTestSubscription('single', 'Single Request')}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">Single Request</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">$75 one-time • 1 request</span>
            </Button>

            <Button
              variant={activeTestPlan === 'Professional' ? 'default' : 'outline'}
              className="h-auto py-4 flex-col items-start"
              onClick={() => activateTestSubscription('professional', 'Professional')}
            >
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-4 w-4" />
                <span className="font-semibold">Professional</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">$200/mo • 5 requests</span>
            </Button>

            <Button
              variant={activeTestPlan === 'Enterprise' ? 'default' : 'outline'}
              className="h-auto py-4 flex-col items-start"
              onClick={() => activateTestSubscription('enterprise', 'Enterprise')}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4" />
                <span className="font-semibold">Enterprise</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">$500/mo • Unlimited</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            💡 After activating a test plan, go to the <a href="/dashboard" className="text-primary underline">User Dashboard</a> to submit a test request.
          </p>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Technical details about your setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Platform</span>
              <Badge variant="secondary">Lovable Cloud</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Database</span>
              <Badge variant="secondary">PostgreSQL</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Storage</span>
              <Badge variant="secondary">Cloud Storage</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Authentication</span>
              <Badge variant="secondary">Email / Password</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
