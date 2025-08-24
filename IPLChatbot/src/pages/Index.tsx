import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatBot from '@/components/ChatBot';
import Dashboard from '@/components/Dashboard';
import { 
  MessageCircle, 
  BarChart3, 
  Sparkles, 
  Shield, 
  Clock, 
  Users,
  Bot,
  Heart
} from 'lucide-react';

export default function Index() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // Mock data for dashboard
  const dashboardData = {
    totalQueries: 247,
    resolvedQueries: 198,
    avgResponseTime: 2.3
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Bot className="w-12 h-12" />
              <h1 className="text-4xl font-bold">TCS ILP Support Assistant</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Empowering new hires with intelligent, 24/7 support during their Initial Learning Program journey
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-Powered Intelligence</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure & Anonymous</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm">24/7 Availability</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Empathetic Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-lg">Frictionless Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Instant answers to hundreds of common ILP questions, available 24/7 with no waiting time.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Intelligent Prioritization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Smart filtering and categorization ensures critical cases receive immediate attention.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Empathetic Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Secure, anonymous support channel that protects privacy while reducing agent burnout.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat Support
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics Dashboard
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="chat" className="p-6">
                <ChatBot 
                  isAnonymous={isAnonymous} 
                  onToggleAnonymous={() => setIsAnonymous(!isAnonymous)} 
                />
              </TabsContent>
              
              <TabsContent value="dashboard" className="p-6">
                <Dashboard {...dashboardData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Transforming Employee Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">99.9%</div>
              <div className="text-gray-600">Uptime Reliability</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">2.3s</div>
              <div className="text-gray-600">Avg Response Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">4.8/5</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">85%</div>
              <div className="text-gray-600">Auto-Resolution Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bot className="w-6 h-6" />
          <span className="text-lg font-semibold">TCS ILP Support</span>
        </div>
        <p className="text-gray-400 mb-4">
          Revolutionizing employee support with AI-powered assistance and empathetic care
        </p>
        <p className="text-sm text-gray-500">
          Built with ❤️ for TCS Initial Learning Program participants
        </p>
      </div>
    </footer>
    </div>
  );
}