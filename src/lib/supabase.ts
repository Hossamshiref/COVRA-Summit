import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Order, Ticket } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey.length > 10
);

// In-memory fallback database for local development and live testing without Supabase credentials
class MockDatabase {
  orders: Map<string, Order> = new Map();
  tickets: Map<string, Ticket> = new Map();

  constructor() {
    // Optional demo seed data if needed
  }
}

// Global singleton for mock db across hot-reloads
const globalForDb = globalThis as unknown as { mockDb?: MockDatabase };
export const mockDb = globalForDb.mockDb || new MockDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.mockDb = mockDb;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const supabaseAdmin: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey!)
  : null;

/**
 * High-level database operations with automatic fallback to mock store if Supabase credentials are missing.
 */
export const db = {
  // Orders
  async createOrder(order: Omit<Order, "created_at">): Promise<Order> {
    const fullOrder: Order = {
      ...order,
      created_at: new Date().toISOString(),
    };

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .insert([fullOrder])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Order;
    }

    mockDb.orders.set(order.id, fullOrder);
    return fullOrder;
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as Order) || null;
    }

    return mockDb.orders.get(id) || null;
  },

  async updateOrderStatus(
    orderId: string,
    status: Order["payment_status"],
    paymobOrderId?: string
  ): Promise<Order | null> {
    const updates: Partial<Order> = { payment_status: status };
    if (paymobOrderId) updates.paymob_order_id = paymobOrderId;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Order;
    }

    const existing = mockDb.orders.get(orderId);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    mockDb.orders.set(orderId, updated);
    return updated;
  },

  // Tickets
  async createTickets(tickets: Omit<Ticket, "created_at">[]): Promise<Ticket[]> {
    const fullTickets: Ticket[] = tickets.map((t) => ({
      ...t,
      created_at: new Date().toISOString(),
    }));

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("tickets")
        .insert(fullTickets)
        .select();
      if (error) throw new Error(error.message);
      return data as Ticket[];
    }

    for (const t of fullTickets) {
      mockDb.tickets.set(t.id, t);
    }
    return fullTickets;
  },

  async getTicketById(id: string): Promise<(Ticket & { order: Order | null }) | null> {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("tickets")
        .select("*, order:orders(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      return {
        ...data,
        order: data.order as Order | null,
      };
    }

    const ticket = mockDb.tickets.get(id);
    if (!ticket) return null;
    const order = mockDb.orders.get(ticket.order_id) || null;
    return { ...ticket, order } as Ticket & { order: Order | null };
  },

  async getTicketsByOrderId(orderId: string): Promise<Ticket[]> {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("tickets")
        .select("*")
        .eq("order_id", orderId);
      if (error) throw new Error(error.message);
      return (data as Ticket[]) || [];
    }

    const list: Ticket[] = [];
    for (const t of mockDb.tickets.values()) {
      if (t.order_id === orderId) {
        list.push(t);
      }
    }
    return list;
  },

  async markTicketAsUsed(id: string): Promise<{ success: boolean; alreadyUsed?: boolean; ticket?: Ticket }> {
    const nowIso = new Date().toISOString();

    if (supabaseAdmin) {
      // First check status
      const { data: existing } = await supabaseAdmin
        .from("tickets")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!existing) return { success: false };
      if (existing.is_used) {
        return { success: false, alreadyUsed: true, ticket: existing as Ticket };
      }

      const { data, error } = await supabaseAdmin
        .from("tickets")
        .update({ is_used: true, used_at: nowIso })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { success: true, ticket: data as Ticket };
    }

    const ticket = mockDb.tickets.get(id);
    if (!ticket) return { success: false };
    if (ticket.is_used) {
      return { success: false, alreadyUsed: true, ticket };
    }

    ticket.is_used = true;
    ticket.used_at = nowIso;
    mockDb.tickets.set(id, ticket);
    return { success: true, ticket };
  },
};
