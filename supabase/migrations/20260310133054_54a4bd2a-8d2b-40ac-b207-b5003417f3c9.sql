
CREATE TABLE public.vehicle_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle photos" ON public.vehicle_photos
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert vehicle photos" ON public.vehicle_photos
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update vehicle photos" ON public.vehicle_photos
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete vehicle photos" ON public.vehicle_photos
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
