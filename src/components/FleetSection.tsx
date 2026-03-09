import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Vehicle {
  id: string;
  category: string;
  name: string;
  image_url: string | null;
  sort_order: number;
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

const FleetSection = () => {
  const [vehiclesByCategory, setVehiclesByCategory] = useState<Record<string, Vehicle[]>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const grouped: Record<string, Vehicle[]> = {};
          (data as Vehicle[]).forEach((v) => {
            if (!grouped[v.category]) grouped[v.category] = [];
            grouped[v.category].push(v);
          });
          setVehiclesByCategory(grouped);
        }
        setLoaded(true);
      });
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
            const items = vehicles ?? (fallback ? fallback.map((name, i) => ({ id: String(i), category: cat, name, image_url: null, sort_order: i })) : []);

            if (items.length === 0) return null;

            return (
              <div key={cat} className={`bg-gradient-to-br ${categoryColors[cat]} bg-card rounded-2xl card-shadow p-6`}>
                <h3 className="font-heading font-bold text-foreground mb-4 text-lg">{categoryLabels[cat]}</h3>
                <ul className="space-y-3">
                  {items.map((v) => (
                    <li key={v.id} className="flex items-start gap-3">
                      {v.image_url && (
                        <img src={v.image_url} alt={v.name} className="w-16 h-12 object-cover rounded shrink-0" />
                      )}
                      {!v.image_url && <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />}
                      <span className="text-sm text-muted-foreground">{v.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
