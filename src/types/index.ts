export type PaymentStatus = "pending" | "paid" | "failed";

export type TicketType = "standard" | "premium";

export interface Order {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  job_title: string | null;
  company: string | null;
  standard_count: number;
  premium_count: number;
  total_amount: number;
  payment_status: PaymentStatus;
  paymob_order_id: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  order_id: string;
  ticket_type: TicketType;
  qr_code: string;
  is_used: boolean;
  created_at: string;
  used_at?: string | null;
  order?: Order;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  company?: string;
}

export interface TicketSelection {
  standardCount: number;
  premiumCount: number;
}

export interface CreateOrderRequest {
  user_name: string;
  user_email: string;
  user_phone: string;
  job_title?: string;
  company?: string;
  standard_count: number;
  premium_count: number;
}

export interface QRDataPayload {
  ticketId: string;
  orderId: string;
  type: TicketType;
  name: string;
  timestamp: number;
  sig: string;
}
