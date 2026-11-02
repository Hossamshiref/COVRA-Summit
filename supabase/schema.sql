-- ===================================================
-- COVRA Launch Event Database Schema for Supabase
-- ===================================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    job_title TEXT NULL,
    company TEXT NULL,
    standard_count INTEGER NOT NULL DEFAULT 0 CHECK (standard_count >= 0),
    premium_count INTEGER NOT NULL DEFAULT 0 CHECK (premium_count >= 0),
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    paymob_order_id TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    ticket_type TEXT NOT NULL CHECK (ticket_type IN ('standard', 'premium')),
    qr_code TEXT NOT NULL UNIQUE,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create indexes for high performance lookup
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_paymob_order_id ON public.orders(paymob_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_qr_code ON public.tickets(qr_code);
CREATE INDEX IF NOT EXISTS idx_tickets_is_used ON public.tickets(is_used);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Allow public select on orders by ID (for checkout / order lookup)
CREATE POLICY "Allow public select on orders by ID"
    ON public.orders FOR SELECT
    USING (true);

-- Allow public insert to create initial pending orders
CREATE POLICY "Allow public insert on orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Allow public read on individual tickets by ID
CREATE POLICY "Allow public select on tickets by ID"
    ON public.tickets FOR SELECT
    USING (true);

-- Service role has full permissions for webhooks & management
