import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  TrendingUp, 
  Package, 
  Star, 
  Search,
  Trophy,
  Clock,
  MapPin,
  DollarSign
} from "lucide-react";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for all drivers
  const driversData = [
    {
      id: 1,
      name: "Mohammed Hassan",
      rating: 4.9,
      totalDeliveries: 847,
      todayDeliveries: 12,
      earnings: 8920,
      status: "active",
      joinDate: "2023-01-15",
      location: "Dubai Marina",
      vehicle: "Motorcycle",
      onTimeRate: 96,
      rank: 1
    },
    {
      id: 2,
      name: "Ahmed Al-Rashid",
      rating: 4.8,
      totalDeliveries: 756,
      todayDeliveries: 8,
      earnings: 7850,
      status: "active",
      joinDate: "2023-02-20",
      location: "Downtown Dubai",
      vehicle: "Car",
      onTimeRate: 94,
      rank: 2
    },
    {
      id: 3,
      name: "Omar Khalil",
      rating: 4.7,
      totalDeliveries: 623,
      todayDeliveries: 15,
      earnings: 6540,
      status: "active",
      joinDate: "2023-03-10",
      location: "Jumeirah",
      vehicle: "Motorcycle",
      onTimeRate: 92,
      rank: 3
    },
    {
      id: 4,
      name: "Youssef Ibrahim",
      rating: 4.6,
      totalDeliveries: 589,
      todayDeliveries: 6,
      earnings: 5890,
      status: "offline",
      joinDate: "2023-04-05",
      location: "Deira",
      vehicle: "Bicycle",
      onTimeRate: 89,
      rank: 4
    },
    {
      id: 5,
      name: "Hassan Ali",
      rating: 4.5,
      totalDeliveries: 534,
      todayDeliveries: 10,
      earnings: 5234,
      status: "active",
      joinDate: "2023-05-12",
      location: "Bur Dubai",
      vehicle: "Motorcycle",
      onTimeRate: 87,
      rank: 5
    },
    {
      id: 6,
      name: "Khalid Mahmoud",
      rating: 4.4,
      totalDeliveries: 467,
      todayDeliveries: 4,
      earnings: 4670,
      status: "break",
      joinDate: "2023-06-18",
      location: "Al Barsha",
      vehicle: "Car",
      onTimeRate: 85,
      rank: 6
    }
  ];

  const filteredDrivers = driversData.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalDrivers: driversData.length,
    activeDrivers: driversData.filter(d => d.status === "active").length,
    totalDeliveries: driversData.reduce((sum, d) => sum + d.totalDeliveries, 0),
    totalEarnings: driversData.reduce((sum, d) => sum + d.earnings, 0),
    avgRating: (driversData.reduce((sum, d) => sum + d.rating, 0) / driversData.length).toFixed(1)
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-4 w-4 text-orange-500" />;
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-gradient-success text-white";
      case "offline": return "bg-muted text-muted-foreground";
      case "break": return "bg-gradient-warning text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Wasel Admin Dashboard</h1>
          <p className="text-blue-100 mt-2">Monitor driver performance and delivery operations</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.totalDrivers}</p>
                  <p className="text-xs text-muted-foreground">Total Drivers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-wasel-green" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.activeDrivers}</p>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-wasel-blue" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.totalDeliveries.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Deliveries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-wasel-orange" />
                <div>
                  <p className="text-2xl font-bold">AED {totalStats.totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500 fill-current" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.avgRating}</p>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Driver Rankings & Performance</CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDrivers.map((driver) => (
                <Card key={driver.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-muted-foreground">#{driver.rank}</span>
                        {getRankBadge(driver.rank)}
                      </div>
                      
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {driver.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{driver.name}</h3>
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{driver.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Joined {new Date(driver.joinDate).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-lg font-bold">{driver.totalDeliveries}</p>
                        <p className="text-xs text-muted-foreground">Total Deliveries</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{driver.todayDeliveries}</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-lg font-bold">{driver.rating}</span>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{driver.onTimeRate}%</p>
                        <p className="text-xs text-muted-foreground">On-time Rate</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-wasel-green">AED {driver.earnings.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Monthly Earnings</p>
                      <Badge variant="outline" className="mt-1">
                        {driver.vehicle}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {driversData.slice(0, 3).map((driver, index) => (
                  <div key={driver.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRankBadge(index + 1)}
                      <span className="font-medium">{driver.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{driver.totalDeliveries} deliveries</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low rating alerts</span>
                  <Badge variant="destructive">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Late deliveries</span>
                  <Badge variant="secondary">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Offline drivers</span>
                  <Badge variant="outline">1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Export Driver Data
              </Button>
              <Button className="w-full" variant="outline">
                Send Notifications
              </Button>
              <Button className="w-full" variant="outline">
                Generate Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;