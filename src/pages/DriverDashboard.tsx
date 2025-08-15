import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Package, 
  Star, 
  Clock, 
  Trophy,
  Target,
  DollarSign,
  Calendar,
  ArrowLeft,
  MapPin,
  Truck
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface DriverData {
  driver_id: number;
  name: string;
  rating: number;
  total_deliveries: number;
  today_deliveries: number;
  earnings: number;
  status: string;
  join_date: string;
  location: string;
  vehicle: string;
  on_time_rate: number;
  rank: number;
}

const DriverDashboard = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const { data, error } = await supabase
          .from('v_admin_dashboard_full')
          .select('*')
          .eq('driver_id', parseInt(driverId || '1'))
          .single();
        
        if (error) {
          console.error('Error fetching driver:', error);
          return;
        }
        
        if (data) {
          setDriverData({
            driver_id: data.driver_id,
            name: data.name,
            rating: parseFloat(data.rating?.toString() || '0'),
            total_deliveries: data.total_deliveries || 0,
            today_deliveries: data.today_deliveries || 0,
            earnings: data.earnings || 0,
            status: data.status,
            join_date: data.join_date,
            location: data.location,
            vehicle: data.vehicle,
            on_time_rate: data.on_time_rate || 0,
            rank: data.rank || 1
          });
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [driverId]);

  // Chart data for the last 7 days (mock data based on driver's total)
  const chartData = [
    { day: 'Mon', deliveries: Math.floor((driverData?.total_deliveries || 0) * 0.05), earnings: Math.floor((driverData?.earnings || 0) * 0.1) },
    { day: 'Tue', deliveries: Math.floor((driverData?.total_deliveries || 0) * 0.07), earnings: Math.floor((driverData?.earnings || 0) * 0.12) },
    { day: 'Wed', deliveries: Math.floor((driverData?.total_deliveries || 0) * 0.06), earnings: Math.floor((driverData?.earnings || 0) * 0.11) },
    { day: 'Thu', deliveries: Math.floor((driverData?.total_deliveries || 0) * 0.08), earnings: Math.floor((driverData?.earnings || 0) * 0.13) },
    { day: 'Fri', deliveries: Math.floor((driverData?.total_deliveries || 0) * 0.09), earnings: Math.floor((driverData?.earnings || 0) * 0.15) },
    { day: 'Sat', deliveries: Math.floor((driverData?.total_deliveries || 0) * 0.11), earnings: Math.floor((driverData?.earnings || 0) * 0.18) },
    { day: 'Sun', deliveries: driverData?.today_deliveries || 0, earnings: Math.floor((driverData?.earnings || 0) * 0.08) },
  ];

  const recentActivity = [
    { id: `ORD-${7890 + (driverData?.driver_id || 0)}`, time: "10:00 AM - 11:00 AM", status: "completed" },
    { id: `ORD-${7891 + (driverData?.driver_id || 0)}`, time: "11:30 AM - 12:30 PM", status: "completed" },
    { id: `ORD-${7892 + (driverData?.driver_id || 0)}`, time: "1:00 PM - 2:00 PM", status: "completed" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-gradient-success text-white";
      case "offline": return "bg-muted text-muted-foreground";
      case "break": return "bg-gradient-warning text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-4 w-4 text-orange-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Driver not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/30">
              <Avatar className="w-full h-full">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {driverData.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-xl font-bold">{driverData.name}</h1>
              {getRankBadge(driverData.rank)}
            </div>
            <p className="text-sm opacity-90">Driver ID: {driverData.driver_id}</p>
            <Badge className={`mt-2 ${getStatusColor(driverData.status)}`}>
              {driverData.status}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Driver Info Quick View */}
        <div className="grid grid-cols-2 gap-4">
          <ModernCard className="text-center">
            <ModernCardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">{driverData.location}</div>
              </div>
              <div className="text-xs text-muted-foreground">Location</div>
            </ModernCardContent>
          </ModernCard>
          <ModernCard className="text-center">
            <ModernCardContent className="pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">{driverData.vehicle}</div>
              </div>
              <div className="text-xs text-muted-foreground">Vehicle</div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{driverData.total_deliveries}</div>
              <div className="text-sm text-muted-foreground">Total Deliveries</div>
            </ModernCardContent>
          </ModernCard>
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <div className="text-3xl font-bold text-wasel-orange">{driverData.rating}</div>
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Earnings */}
        <ModernCard className="text-center">
          <ModernCardContent className="pt-6">
            <div className="text-3xl font-bold text-wasel-green">KWD {driverData.earnings.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Monthly Earnings</div>
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
                <div className="text-2xl font-bold">{driverData.total_deliveries}</div>
                <div className="text-sm text-muted-foreground">Total Deliveries</div>
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

        {/* Today's Performance & On-time Rate */}
        <div className="grid grid-cols-2 gap-4">
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{driverData.today_deliveries}</div>
              <div className="text-sm text-muted-foreground">Today's Deliveries</div>
            </ModernCardContent>
          </ModernCard>
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-2xl font-bold text-wasel-green">{driverData.on_time_rate}%</div>
              <div className="text-sm text-muted-foreground">On-time Rate</div>
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
      </div>

      <Navigation />
    </div>
  );
};

export default DriverDashboard;