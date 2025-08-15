import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Star,
  ArrowLeft,
  Phone,
  MapPin,
  Truck,
  Calendar,
  TrendingUp,
  Package,
  Trophy,
  Clock,
  DollarSign
} from "lucide-react";
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

const DriverProfilePage = () => {
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

  const generatePerformanceReport = () => {
    if (!driverData) return;

    const reportData = [
      ['Driver Performance Report'],
      ['Generated on', new Date().toLocaleDateString()],
      [''],
      ['DRIVER INFORMATION'],
      ['Name', driverData.name],
      ['Driver ID', driverData.driver_id.toString()],
      ['Location', driverData.location],
      ['Vehicle Type', driverData.vehicle],
      ['Member Since', new Date(driverData.join_date).getFullYear().toString()],
      ['Current Status', driverData.status],
      [''],
      ['PERFORMANCE METRICS'],
      ['Overall Rating', driverData.rating.toString()],
      ['Current Rank', `#${driverData.rank}`],
      ['Total Deliveries', driverData.total_deliveries.toString()],
      ['Today\'s Deliveries', driverData.today_deliveries.toString()],
      ['On-time Delivery Rate', `${driverData.on_time_rate}%`],
      [''],
      ['EARNINGS'],
      ['Monthly Earnings', `KWD ${driverData.earnings.toLocaleString()}`],
      ['Average per Delivery', `KWD ${(driverData.earnings / Math.max(driverData.total_deliveries, 1)).toFixed(2)}`],
      [''],
      ['PERFORMANCE ANALYSIS'],
      ['Performance Grade', driverData.rating >= 4.5 ? 'Excellent' : driverData.rating >= 4.0 ? 'Good' : driverData.rating >= 3.5 ? 'Average' : 'Needs Improvement'],
      ['Productivity Level', driverData.total_deliveries >= 500 ? 'High' : driverData.total_deliveries >= 200 ? 'Medium' : 'Low'],
      ['Reliability Score', driverData.on_time_rate >= 95 ? 'Excellent' : driverData.on_time_rate >= 90 ? 'Good' : driverData.on_time_rate >= 85 ? 'Average' : 'Needs Improvement']
    ];

    const csvContent = reportData.map(row => 
      Array.isArray(row) ? row.map(cell => `"${cell}"`).join(',') : `"${row}"`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${driverData.name.replace(/\s+/g, '_')}_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
          <p className="text-muted-foreground">Loading driver profile...</p>
        </div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Driver not found</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            Go Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">{/* Removed pb-24 since no bottom navigation */}
      {/* Header with back button */}
      <header className="relative bg-gradient-primary text-white p-4">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-center">Driver Profile</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <ModernCard className="overflow-hidden">
          <ModernCardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                    {driverData.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-background rounded-full p-1 shadow-md border-2 border-primary/20">
                  <div className="flex items-center space-x-1 px-2 py-1">
                    <span className="text-sm font-bold text-foreground">#{driverData.rank}</span>
                    {getRankBadge(driverData.rank)}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{driverData.name}</h2>
                <p className="text-sm text-muted-foreground">Driver ID: {driverData.driver_id}</p>
                <Badge className={`mt-2 ${getStatusColor(driverData.status)}`}>
                  {driverData.status}
                </Badge>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Key Performance Stats */}
        <div className="grid grid-cols-2 gap-4">
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-3xl font-bold text-primary">{driverData.rating}</span>
              </div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </ModernCardContent>
          </ModernCard>
          <ModernCard className="text-center">
            <ModernCardContent className="pt-6">
              <div className="text-3xl font-bold text-wasel-green">{driverData.total_deliveries}</div>
              <div className="text-sm text-muted-foreground">Total Deliveries</div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Driver Information */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Driver Information
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Location</div>
                <div className="text-sm text-muted-foreground">{driverData.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Vehicle</div>
                <div className="text-sm text-muted-foreground">{driverData.vehicle}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">Member Since</div>
                <div className="text-sm text-muted-foreground">{new Date(driverData.join_date).getFullYear()}</div>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Performance Metrics */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Metrics
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-wasel-blue" />
                  <span className="text-2xl font-bold">{driverData.today_deliveries}</span>
                </div>
                <div className="text-sm text-muted-foreground">Today's Deliveries</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-wasel-green" />
                  <span className="text-2xl font-bold">{driverData.on_time_rate}%</span>
                </div>
                <div className="text-sm text-muted-foreground">On-time Rate</div>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Earnings */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-wasel-orange" />
              Monthly Earnings
            </ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-wasel-green mb-2">
                KWD {driverData.earnings.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {driverData.total_deliveries} total deliveries
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Quick Actions */}
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Quick Actions</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-3">
            <Button variant="modern" className="w-full justify-start h-14 rounded-2xl">
              <Phone className="h-5 w-5 mr-3" />
              Contact Driver
            </Button>
            <Button variant="modern" className="w-full justify-start h-14 rounded-2xl">
              <Package className="h-5 w-5 mr-3" />
              View Delivery History
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 rounded-2xl" onClick={generatePerformanceReport}>
              <TrendingUp className="h-5 w-5 mr-3" />
              Performance Reports
            </Button>
          </ModernCardContent>
        </ModernCard>
      </div>
    </div>
  );
};

export default DriverProfilePage;