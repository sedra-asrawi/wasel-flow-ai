import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const DashboardPage = () => {
  const driverStats = {
    name: "Omar Hassan",
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
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {driverStats.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <h1 className="text-xl font-bold">{driverStats.name}</h1>
          <p className="text-sm opacity-90">Driver ID: {driverStats.driverId}</p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{driverStats.totalDeliveries}</div>
              <div className="text-sm text-muted-foreground">Total Deliveries</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-wasel-orange">{driverStats.rating}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-wasel-green">KWD {driverStats.earnings.total}</div>
            <div className="text-sm text-muted-foreground">Earnings</div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Deliveries Over Time</h4>
                <div className="text-2xl font-bold">{driverStats.totalDeliveries}</div>
                <div className="text-sm text-muted-foreground">Last 30 Days +15%</div>
                <div className="mt-4 h-24 bg-muted/50 rounded-lg flex items-end justify-center">
                  <div className="text-xs text-muted-foreground">Performance Chart</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points & Completion Rate */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{driverStats.points}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-wasel-green">{driverStats.performance.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Driver Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-wasel-orange" />
              Driver Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default DashboardPage;