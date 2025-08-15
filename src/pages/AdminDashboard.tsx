import { useState, useEffect } from "react";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  TrendingUp, 
  Package, 
  Star, 
  Search,
  Trophy,
  Clock,
  MapPin,
  DollarSign,
  Loader2
} from "lucide-react";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [driversData, setDriversData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    totalDeliveries: 0,
    totalEarnings: 0,
    avgRating: 0
  });

  useEffect(() => {
    const fetchDriversData = async () => {
      try {
        // Fetch drivers with their delivery counts and trust scores
        const { data: driversWithStats, error } = await supabase
          .from('v_admin_drivers_dashboard')
          .select('*')
          .order('completed_deliveries', { ascending: false });

        if (error) {
          console.error('Error fetching drivers data:', error);
          return;
        }

        console.log('Drivers data:', driversWithStats);

        // Map the data to match our component structure
        const mappedDrivers = driversWithStats?.map((driver, index) => ({
          id: driver.driver_id,
          name: driver.full_name || `Driver ${driver.driver_id}`,
          rating: 4.5 + (Math.random() * 0.5), // Generate random rating between 4.5-5.0
          totalDeliveries: driver.completed_deliveries || 0,
          todayDeliveries: Math.floor(Math.random() * 15) + 1, // Random for demo
          earnings: (driver.completed_deliveries || 0) * 3.5, // Estimate earnings
          status: driver.active_deliveries > 0 ? "active" : "offline",
          joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          location: ["Kuwait City", "Hawalli", "Salmiya", "Jabriya", "Farwaniya", "Ahmadi"][Math.floor(Math.random() * 6)],
          vehicle: ["Motorcycle", "Car", "Bicycle"][Math.floor(Math.random() * 3)],
          onTimeRate: 85 + Math.floor(Math.random() * 15), // Random 85-100%
          rank: index + 1,
          trustScore: driver.trust_score || 100
        })) || [];

        setDriversData(mappedDrivers);

        // Calculate total stats
        const stats = {
          totalDrivers: mappedDrivers.length,
          activeDrivers: mappedDrivers.filter(d => d.status === "active").length,
          totalDeliveries: mappedDrivers.reduce((sum, d) => sum + d.totalDeliveries, 0),
          totalEarnings: mappedDrivers.reduce((sum, d) => sum + d.earnings, 0),
          avgRating: mappedDrivers.length > 0 ? 
            (mappedDrivers.reduce((sum, d) => sum + d.rating, 0) / mappedDrivers.length) : 0
        };

        setTotalStats(stats);
      } catch (error) {
        console.error('Error in fetchDriversData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversData();
  }, []);

  const filteredDrivers = driversData.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
          <ModernCard>
            <ModernCardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.totalDrivers}</p>
                  <p className="text-xs text-muted-foreground">Total Drivers</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-wasel-green" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.activeDrivers}</p>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-wasel-blue" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.totalDeliveries.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Deliveries</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-wasel-orange" />
                <div>
                  <p className="text-2xl font-bold">KWD {Math.round(totalStats.totalEarnings).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500 fill-current" />
                <div>
                  <p className="text-2xl font-bold">{totalStats.avgRating.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Driver Management */}
        <ModernCard>
          <ModernCardHeader>
            <div className="flex justify-between items-center">
              <ModernCardTitle className="text-xl">Driver Rankings & Performance</ModernCardTitle>
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
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-4">
              {filteredDrivers.map((driver) => (
                <ModernCard key={driver.id} className="p-4">
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
                      <p className="text-lg font-bold text-wasel-green">KWD {Math.round(driver.earnings).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Monthly Earnings</p>
                      <Badge variant="outline" className="mt-1">
                        {driver.vehicle}
                      </Badge>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle className="text-lg">Top Performers</ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
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
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle className="text-lg">Performance Alerts</ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
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
            </ModernCardContent>
          </ModernCard>

          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle className="text-lg">Quick Actions</ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Export Driver Data
              </Button>
              <Button className="w-full" variant="outline">
                Send Notifications
              </Button>
              <Button className="w-full" variant="outline">
                Generate Reports
              </Button>
            </ModernCardContent>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;