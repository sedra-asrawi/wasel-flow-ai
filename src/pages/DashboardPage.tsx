import { Navigation } from "@/components/ui/navigation";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Package, 
  Star, 
  Clock, 
  Trophy,
  Target,
  DollarSign,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

const DashboardPage = () => {
  const driverStats = {
    name: "Mohammed Hassan",
    driverId: "123456",
    rating: 4.8,
    totalDeliveries: 1200,
    points: 1200,
    earnings: {
      total: 2500,
      today: 105,
      week: 670,
      month: 2750
    },
    performance: {
      completionRate: 95,
      onTimeRate: 96,
      customerRating: 4.8
    }
  };

  // Chart data for the last 7 days
  const chartData = [
    { day: 'Mon', deliveries: 12, earnings: 85 },
    { day: 'Tue', deliveries: 19, earnings: 134 },
    { day: 'Wed', deliveries: 15, earnings: 105 },
    { day: 'Thu', deliveries: 22, earnings: 156 },
    { day: 'Fri', deliveries: 28, earnings: 198 },
    { day: 'Sat', deliveries: 35, earnings: 245 },
    { day: 'Sun', deliveries: 18, earnings: 127 },
  ];

  const recentActivity = [
    { id: "ORD-7890", time: "10:00 AM - 11:00 AM", status: "completed" },
    { id: "ORD-7891", time: "11:30 AM - 12:30 PM", status: "completed" },
    { id: "ORD-7892", time: "1:00 PM - 2:00 PM", status: "completed" }
  ];

  const driverRankings = [
    { name: "Ethan Carter", deliveries: 1200, rating: 4.8 },
    { name: "Liam Harper", deliveries: 1150, rating: 4.7 },
    { name: "Noah Bennett", deliveries: 1100, rating: 4.6 }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/30">
            <img 
              src="/lovable-uploads/ebbd92cb-f1c4-41e5-8075-503b91b8b3e5.png" 
              alt="Driver Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold">{driverStats.name}</h1>
          <p className="text-sm opacity-90">Driver ID: {driverStats.driverId}</p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{driverStats.totalDeliveries}</div>
              <div className="text-sm text-muted-foreground">Total Deliveries</div>
            </ModernCardContent>
          </ModernCard>
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-3xl font-bold text-wasel-orange">{driverStats.rating}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Earnings */}
        <ModernCard className="text-center">
          <ModernCardContent className="pt-6">
            <div className="text-3xl font-bold text-wasel-green">KWD {driverStats.earnings.total}</div>
            <div className="text-sm text-muted-foreground">Earnings</div>
          </ModernCardContent>
        </ModernCard>

        {/* Performance Overview */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Performance Overview</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Deliveries Over Time</h4>
                <div className="text-2xl font-bold">{driverStats.totalDeliveries}</div>
                <div className="text-sm text-muted-foreground">Last 30 Days +15%</div>
                <div className="mt-4 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis hide />
                      <Area
                        type="monotone"
                        dataKey="deliveries"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorDeliveries)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Points & Completion Rate */}
        <div className="grid grid-cols-2 gap-4">
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{driverStats.points}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </ModernCardContent>
          </ModernCard>
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-2xl font-bold text-wasel-green">{driverStats.performance.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Recent Activity */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Recent Activity
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Order #{activity.id}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Driver Rankings */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-wasel-orange" />
              Driver Rankings
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              {driverRankings.map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {driver.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.deliveries} Deliveries, {driver.rating} Rating</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{driver.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>

      <Navigation />
    </div>
  );
};

export default DashboardPage;