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
    name: "Mohammed Hassan",
    rating: 4.9,
    totalDeliveries: 847,
    todayDeliveries: 12,
    points: 2450,
    earnings: {
      today: 340,
      week: 2180,
      month: 8920
    },
    performance: {
      onTimeRate: 96,
      customerRating: 4.9,
      completionRate: 98
    }
  };

  const achievements = [
    { title: "Speed Demon", description: "Complete 50 deliveries in under 20 mins", points: 100, achieved: true },
    { title: "Customer Favorite", description: "Maintain 4.8+ rating for 30 days", points: 200, achieved: true },
    { title: "Perfect Week", description: "Complete a week without any issues", points: 150, achieved: false },
    { title: "Early Bird", description: "Start 10 shifts before 7 AM", points: 75, achieved: false }
  ];

  const recentOrders = [
    { id: "ORD-001", restaurant: "Al Fanar Restaurant", amount: 85, time: "2 hours ago", status: "completed" },
    { id: "ORD-002", restaurant: "Shake Shack", amount: 45, time: "3 hours ago", status: "completed" },
    { id: "ORD-003", restaurant: "Tim Hortons", amount: 28, time: "4 hours ago", status: "completed" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-blue-100">Your performance overview</p>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Driver Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Welcome back, {driverStats.name}!</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{driverStats.rating}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{driverStats.todayDeliveries}</p>
                <p className="text-xs text-muted-foreground">Today's Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-wasel-green">{driverStats.points}</p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-wasel-green" />
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">AED {driverStats.earnings.today}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <div>
                <p className="text-lg font-bold">AED {driverStats.earnings.week}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
              <div>
                <p className="text-lg font-bold">AED {driverStats.earnings.month}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">On-time Delivery</span>
                <span className="text-sm font-medium">{driverStats.performance.onTimeRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-success h-2 rounded-full" 
                  style={{ width: `${driverStats.performance.onTimeRate}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Rating</span>
                <span className="text-sm font-medium">{driverStats.performance.customerRating}/5.0</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-warning h-2 rounded-full" 
                  style={{ width: `${(driverStats.performance.customerRating / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completion Rate</span>
                <span className="text-sm font-medium">{driverStats.performance.completionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full" 
                  style={{ width: `${driverStats.performance.completionRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-wasel-orange" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      {achievement.achieved && (
                        <Badge variant="secondary" className="text-xs">
                          +{achievement.points} pts
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  </div>
                  <div className="ml-3">
                    {achievement.achieved ? (
                      <div className="w-6 h-6 bg-gradient-success rounded-full flex items-center justify-center">
                        <Trophy className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-muted rounded-full flex items-center justify-center">
                        <Target className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{order.restaurant}</p>
                    <p className="text-xs text-muted-foreground">{order.id} • {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">AED {order.amount}</p>
                    <Badge variant="secondary" className="text-xs">
                      Completed
                    </Badge>
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