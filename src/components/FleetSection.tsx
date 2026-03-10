import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface VehiclePhoto {
  id: string;
  image_url: string;
  sort_order: number;
}

interface Vehicle {
  id: string;
  category: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  photos: VehiclePhoto[];
}

const categoryLabels: Record<string, string> = {
  A: "A – Motocykly",
  B: "B – Osobní automobily",
  C: "C – Nákladní automobil",
  D: "D – Autobus",
  T: "T – Traktor",
};

const categoryColors: Record<string, string> = {
  A: "from-secondary/20 to-secondary/5",
  B: "from-primary/10 to-primary/5",
  C: "from-secondary/15 to-secondary/5",
  D: "from-primary/10 to-primary/5",
  T: "from-secondary/20 to-secondary/5",
};

const categoryOrder = ["A", "B", "C", "D", "T"];

const fallbackFleet: Record<string, string[]> = {
  A: ["Yamaha 125 YBR", "Kawasaki 125", "Honda CB 500", "Honda CBF 500", "Honda Hornet 600", "Kawasaki ER 650"],
  B: ["KIA Venga", "Toyota Yaris", "Toyota Aygo", "KIA Sportage (B+E)"],
  C: ["MAN 12.250 TGL"],
  D: ["KAROSA B 952"],
  T: ["ZETOR 5211"],
};

const VehiclePhotos = ({ photos }: { photos: VehiclePhoto[] }) => {
  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <img
        src={photos[0].image_url}
        alt=""
        className="w-full h-48 object-cover rounded-lg"
      />
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.id}>
            <img
              src={photo.image_url}
              alt=""
              className="w-full h-48 object-cover rounded-lg"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-3 h-7 w-7" />
      <CarouselNext className="-right-3 h-7 w-7" />
    </Carousel>
  );
};

const FleetSection = () => {
  const [vehiclesByCategory, setVehiclesByCategory] = useState<Record<string, Vehicle[]>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [vehiclesRes, photosRes] = await Promise.all([
        supabase.from("vehicles").select("*").order("sort_order"),
        supabase.from("vehicle_photos").select("*").order("sort_order"),
      ]);

      const vehicles = (vehiclesRes.data ?? []) as Omit<Vehicle, "photos">[];
      const photos = (photosRes.data ?? []) as (VehiclePhoto & { vehicle_id: string })[];

      const photosByVehicle: Record<string, VehiclePhoto[]> = {};
      photos.forEach((p) => {
        if (!photosByVehicle[p.vehicle_id]) photosByVehicle[p.vehicle_id] = [];
        photosByVehicle[p.vehicle_id].push(p);
      });

      if (vehicles.length > 0) {
        const grouped: Record<string, Vehicle[]> = {};
        vehicles.forEach((v) => {
          const vehicleWithPhotos: Vehicle = {
            ...v,
            photos: photosByVehicle[v.id] ?? (v.image_url ? [{ id: "legacy", image_url: v.image_url, sort_order: 0 }] : []),
          };
          if (!grouped[v.category]) grouped[v.category] = [];
          grouped[v.category].push(vehicleWithPhotos);
        });
        setVehiclesByCategory(grouped);
      }
      setLoaded(true);
    };
    fetchData();
  }, []);

  const hasDbData = Object.keys(vehiclesByCategory).length > 0;

  return (
    <section id="vozovy-park" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <div className="text-center mb-16">
          <p className="font-heading font-semibold text-secondary tracking-widest uppercase text-sm mb-3">Vozový park</p>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground">
            Naše <span className="text-gradient">vozidla</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categoryOrder.map((cat) => {
            const vehicles = hasDbData ? vehiclesByCategory[cat] : undefined;
            const fallback = fallbackFleet[cat];
            const items = vehicles ?? (fallback ? fallback.map((name, i) => ({ id: String(i), category: cat, name, image_url: null, sort_order: i, photos: [] })) : []);

            if (items.length === 0) return null;

            return (
              <div key={cat} className={`bg-gradient-to-br ${categoryColors[cat]} bg-card rounded-2xl card-shadow p-6`}>
                <h3 className="font-heading font-bold text-foreground mb-4 text-lg">{categoryLabels[cat]}</h3>
                <div className="space-y-5">
                  {items.map((v) => (
                    <div key={v.id} className="space-y-2">
                      <VehiclePhotos photos={v.photos} />
                      <div className="flex items-center gap-2">
                        {v.photos.length === 0 && <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />}
                        <span className="text-sm font-medium text-foreground">{v.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
