import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChatService, StatsResponse } from '@/services/chatService';
import { 
  Users, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  Bot
} from 'lucide-react';

interface DashboardProps {
  totalQueries?: number;
  resolvedQueries?: number;
  avgResponseTime?: number;
}

export default function Dashboard(props: DashboardProps) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await ChatService.getStats();
        if (data) {
          setStats(data);
          setError(null);
        } else {
          setError('Failed to load statistics');
        }
      } catch (err) {
        setError('Error loading dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Use API data if available, otherwise fall back to props or defaults
  const totalQueries = stats?.totalQueries ?? props.totalQueries ?? 0;
  const resolvedQueries = stats?.resolvedQueries ?? props.resolvedQueries ?? 0;
  const avgResponseTime = stats?.avgResponseTime ?? props.avgResponseTime ?? 0;
  const resolutionRate = totalQueries > 0 ? (resolvedQueries / totalQueries) * 100 : 0;
  const pendingQueries = totalQueries - resolvedQueries;

  const statCards = [
    {
      title: "Total Queries Today",
      value: totalQueries.toString(),
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Resolved Queries",
      value: resolvedQueries.toString(),
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Avg Response Time",
      value: `${avgResponseTime}s`,
      icon: <Clock className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Resolution Rate",
      value: `${resolutionRate.toFixed(1)}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const priorityDistribution = [
    { label: "Urgent", count: stats?.priorities?.urgent ?? Math.floor(totalQueries * 0.1), color: "bg-red-500" },
    { label: "High", count: stats?.priorities?.high ?? Math.floor(totalQueries * 0.2), color: "bg-orange-500" },
    { label: "Medium", count: stats?.priorities?.medium ?? Math.floor(totalQueries * 0.4), color: "bg-yellow-500" },
    { label: "Low", count: stats?.priorities?.low ?? Math.floor(totalQueries * 0.3), color: "bg-green-500" }
  ];

  const categories = [
    { name: "Technical Issues", count: stats?.categories?.technical ?? Math.floor(totalQueries * 0.3), trend: "+5%" },
    { name: "Program Queries", count: stats?.categories?.program ?? Math.floor(totalQueries * 0.25), trend: "+2%" },
    { name: "Schedule Related", count: stats?.categories?.schedule ?? Math.floor(totalQueries * 0.2), trend: "-3%" },
    { name: "HR & Benefits", count: stats?.categories?.hr ?? Math.floor(totalQueries * 0.15), trend: "+8%" },
    { name: "Wellness Support", count: stats?.categories?.wellness ?? Math.floor(totalQueries * 0.1), trend: "+12%" }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">ILP Support Dashboard</h2>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">ILP Support Dashboard</h2>
          <p className="text-red-600">Error: {error}</p>
          <p className="text-gray-600">Showing fallback data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">ILP Support Dashboard</h2>
        <p className="text-gray-600">Real-time insights into employee support and engagement</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityDistribution.map((priority, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                    <span className="font-medium">{priority.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{priority.count}</span>
                    <div className="w-24">
                      <Progress 
                        value={totalQueries > 0 ? (priority.count / totalQueries) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Query Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.count} queries</p>
                  </div>
                  <Badge variant={category.trend.startsWith('+') ? 'default' : 'destructive'}>
                    {category.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-700">AI Bot Status</span>
              </div>
              <p className="text-sm text-green-600">Operational - {stats?.uptime ?? '99.9%'} uptime</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-700">Security</span>
              </div>
              <p className="text-sm text-blue-600">Anonymous mode active</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-700">Satisfaction</span>
              </div>
              <p className="text-sm text-purple-600">{stats?.satisfaction ?? 4.8}/5 average rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}