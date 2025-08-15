export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          is_translated: boolean | null
          message: string
          original_language: string | null
          original_message: string | null
          sender_id: string
          sender_type: string
          translated_language: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          is_translated?: boolean | null
          message: string
          original_language?: string | null
          original_message?: string | null
          sender_id: string
          sender_type: string
          translated_language?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          is_translated?: boolean | null
          message?: string
          original_language?: string | null
          original_message?: string | null
          sender_id?: string
          sender_type?: string
          translated_language?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          customer_id: string
          driver_id: string
          id: string
          order_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          driver_id: string
          id?: string
          order_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          driver_id?: string
          id?: string
          order_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          assigned_at: string
          delivered_at: string | null
          delivery_id: number
          driver_id: number
          order_id: number
          picked_up_at: string | null
          status: string
        }
        Insert: {
          assigned_at: string
          delivered_at?: string | null
          delivery_id?: number
          driver_id: number
          order_id: number
          picked_up_at?: string | null
          status?: string
        }
        Update: {
          assigned_at?: string
          delivered_at?: string | null
          delivery_id?: number
          driver_id?: number
          order_id?: number
          picked_up_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "deliveries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "v_admin_dashboard_full"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "deliveries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "v_admin_drivers_dashboard"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "deliveries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "v_driver_self_dashboard"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      driver_info: {
        Row: {
          created_at: string | null
          driver_id: number
          join_date: string | null
          location: string | null
          monthly_earnings: number | null
          on_time_rate: number | null
          rank: number | null
          rating: number | null
          today_deliveries: number | null
          total_deliveries: number | null
          updated_at: string | null
          vehicle: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: number
          join_date?: string | null
          location?: string | null
          monthly_earnings?: number | null
          on_time_rate?: number | null
          rank?: number | null
          rating?: number | null
          today_deliveries?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: number
          join_date?: string | null
          location?: string | null
          monthly_earnings?: number | null
          on_time_rate?: number | null
          rank?: number | null
          rating?: number | null
          today_deliveries?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_info_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_info_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "v_admin_dashboard_full"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_info_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "v_admin_drivers_dashboard"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_info_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "v_driver_self_dashboard"
            referencedColumns: ["driver_id"]
          },
        ]
      }
      driver_trust: {
        Row: {
          driver_id: number
          trust_score: number
          updated_at: string
        }
        Insert: {
          driver_id: number
          trust_score?: number
          updated_at?: string
        }
        Update: {
          driver_id?: number
          trust_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_trust_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_trust_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "v_admin_dashboard_full"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_trust_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "v_admin_drivers_dashboard"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "driver_trust_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "v_driver_self_dashboard"
            referencedColumns: ["driver_id"]
          },
        ]
      }
      drivers: {
        Row: {
          auth_user_id: string | null
          created_at: string
          driver_id: number
          full_name: string
          phone: string
          status: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          driver_id?: number
          full_name: string
          phone: string
          status?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          driver_id?: number
          full_name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      order_qr_codes: {
        Row: {
          created_at: string
          expires_at: string
          order_id: number
          qr_token: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          order_id: number
          qr_token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          order_id?: number
          qr_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_qr_codes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          order_id: number
          status: string
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          order_id?: number
          status?: string
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          order_id?: number
          status?: string
        }
        Relationships: []
      }
      scans: {
        Row: {
          delivery_id: number
          device_id: string | null
          qr_token: string
          scan_id: number
          scan_type: string
          scanned_at: string
          scanned_by_driver: number
        }
        Insert: {
          delivery_id: number
          device_id?: string | null
          qr_token: string
          scan_id?: number
          scan_type: string
          scanned_at?: string
          scanned_by_driver: number
        }
        Update: {
          delivery_id?: number
          device_id?: string | null
          qr_token?: string
          scan_id?: number
          scan_type?: string
          scanned_at?: string
          scanned_by_driver?: number
        }
        Relationships: [
          {
            foreignKeyName: "scans_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["delivery_id"]
          },
          {
            foreignKeyName: "scans_scanned_by_driver_fkey"
            columns: ["scanned_by_driver"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "scans_scanned_by_driver_fkey"
            columns: ["scanned_by_driver"]
            isOneToOne: false
            referencedRelation: "v_admin_dashboard_full"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "scans_scanned_by_driver_fkey"
            columns: ["scanned_by_driver"]
            isOneToOne: false
            referencedRelation: "v_admin_drivers_dashboard"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "scans_scanned_by_driver_fkey"
            columns: ["scanned_by_driver"]
            isOneToOne: false
            referencedRelation: "v_driver_self_dashboard"
            referencedColumns: ["driver_id"]
          },
        ]
      }
      trust_events: {
        Row: {
          created_at: string
          delivery_id: number | null
          driver_id: number
          event_id: number
          points_change: number
          reason: string
        }
        Insert: {
          created_at?: string
          delivery_id?: number | null
          driver_id: number
          event_id?: number
          points_change: number
          reason: string
        }
        Update: {
          created_at?: string
          delivery_id?: number | null
          driver_id?: number
          event_id?: number
          points_change?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_events_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["delivery_id"]
          },
          {
            foreignKeyName: "trust_events_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "trust_events_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "v_admin_dashboard_full"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "trust_events_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "v_admin_drivers_dashboard"
            referencedColumns: ["driver_id"]
          },
          {
            foreignKeyName: "trust_events_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "v_driver_self_dashboard"
            referencedColumns: ["driver_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_admin_dashboard_full: {
        Row: {
          driver_id: number | null
          earnings: number | null
          join_date: string | null
          location: string | null
          name: string | null
          on_time_rate: number | null
          rank: number | null
          rating: number | null
          status: string | null
          today_deliveries: number | null
          total_deliveries: number | null
          vehicle: string | null
        }
        Relationships: []
      }
      v_admin_drivers_dashboard: {
        Row: {
          active_deliveries: number | null
          completed_deliveries: number | null
          driver_id: number | null
          full_name: string | null
          trust_score: number | null
        }
        Relationships: []
      }
      v_driver_self_dashboard: {
        Row: {
          active_deliveries: number | null
          completed_deliveries: number | null
          driver_id: number | null
          full_name: string | null
          trust_score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      api_dropoff_scan: {
        Args: { p_device_id: string; p_order_id: number; p_qr_token: string }
        Returns: {
          delivery_id: number
        }[]
      }
      api_pickup_scan: {
        Args: { p_device_id: string; p_order_id: number; p_qr_token: string }
        Returns: {
          delivery_id: number
        }[]
      }
      app_current_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
