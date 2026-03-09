import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PricingItem {
  id: string;
  section: string;
  group_name: string;
  price: string;
  price_pj: string | null;
  note: string | null;
  sort_order: number;
}

const fallbackCourses = [
  { group: "AM", price: "", pj: "" },
  { group: "A1", price: "15 000,-", pj: "1 200,-" },
  { group: "A2", price: "15 000,-", pj: "1 200,-" },
  { group: "A", price: "15 000,-", pj: "1 200,-" },
  { group: "A1/A2", price: "6 000,-", pj: "1 200,-" },
  { group: "A2/A", price: "6 000,-", pj: "1 200,-" },
  { group: "A1/A", price: "8 000,-", pj: "1 200,-" },
  { group: "B", price: "25 000,- / 26 000,- DS", pj: "900,-" },
  { group: "B/C", price: "31 000,- / 31 000,- DS", pj: "1 200,-" },
  { group: "B/E", price: "13 000,- / 13 000,- DS", pj: "1 000,-" },
  { group: "B96", price: "8 000,-", pj: "1 000,-" },
  { group: "C/D", price: "40 000,-", pj: "1 500,-" },
  { group: "B/D", price: "50 000,-", pj: "1 500,-" },
  { group: "C/E", price: "20 000,- / 20 000,- DS", pj: "1 400,-" },
  { group: "RD/C", price: "27 000,- / 27 000,- DS", pj: "1 200,-" },
];

const fallbackTraining = [
  { type: "do 3 500 kg (referentské)", price: "300,-", note: "cena/řidič" },
  { type: "nad 3 500 kg (profesní)", price: "900,-", note: "7 hodin, cena/řidič" },
];

const fallbackExtra = [
  { name: "Prostoj jízda", price: "600,-" },
  { name: "Opak. PSP ZK", price: "800,-" },
  { name: "Storno poplatek", price: "1 000,-" },
  { name: "Autotrenažer", price: "500,-" },
];

const PricingSection = () => {
  const [dbItems, setDbItems] = useState<PricingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("pricing_items")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setDbItems(data as PricingItem[]);
        setLoaded(true);
      });
  }, []);

  const hasDb = dbItems.length > 0;
  const courses = hasDb ? dbItems.filter((i) => i.section === "courses") : null;
  const training = hasDb ? dbItems.filter((i) => i.section === "training") : null;
  const extra = hasDb ? dbItems.filter((i) => i.section === "extra") : null;

  return (
    <section id="cenik" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-16">
          <p className="font-heading font-semibold text-secondary tracking-widest uppercase text-sm mb-3">Ceník</p>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground">
            Ceník kurzů <span className="text-gradient">2026</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">Platný od 1.3.2026 · DS = dálkové studium · DZ = doplňovací zkouška</p>
        </div>

        <div className="bg-card rounded-2xl card-shadow overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="hero-gradient text-primary-foreground">
                  <th className="px-5 py-4 text-left font-heading font-bold">Skupina</th>
                  <th className="px-5 py-4 text-left font-heading font-bold">Cena kurzu</th>
                  <th className="px-5 py-4 text-left font-heading font-bold">1 hod. PJ</th>
                </tr>
              </thead>
              <tbody>
                {courses
                  ? courses.map((row, i) => (
                      <tr key={row.id} className={`border-b border-border ${i % 2 === 0 ? "bg-muted/30" : "bg-card"}`}>
                        <td className="px-5 py-3 font-heading font-bold text-foreground">{row.group_name}</td>
                        <td className="px-5 py-3 text-foreground">{row.price || "—"}</td>
                        <td className="px-5 py-3 text-muted-foreground">{row.price_pj || "—"}</td>
                      </tr>
                    ))
                  : fallbackCourses.map((row, i) => (
                      <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-muted/30" : "bg-card"}`}>
                        <td className="px-5 py-3 font-heading font-bold text-foreground">{row.group}</td>
                        <td className="px-5 py-3 text-foreground">{row.price || "—"}</td>
                        <td className="px-5 py-3 text-muted-foreground">{row.pj || "—"}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl card-shadow overflow-hidden">
            <div className="hero-gradient px-5 py-4">
              <h3 className="font-heading font-bold text-primary-foreground">Školení</h3>
            </div>
            <div className="p-5 space-y-3">
              {training
                ? training.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.group_name}</p>
                        {item.note && <p className="text-muted-foreground text-xs">{item.note}</p>}
                      </div>
                      <span className="font-heading font-bold text-foreground">{item.price}</span>
                    </div>
                  ))
                : fallbackTraining.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.type}</p>
                        <p className="text-muted-foreground text-xs">{item.note}</p>
                      </div>
                      <span className="font-heading font-bold text-foreground">{item.price}</span>
                    </div>
                  ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl card-shadow overflow-hidden">
            <div className="hero-gradient px-5 py-4">
              <h3 className="font-heading font-bold text-primary-foreground">Doplňkové ceny</h3>
            </div>
            <div className="p-5 space-y-3">
              {extra
                ? extra.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                      <p className="font-medium text-foreground text-sm">{item.group_name}</p>
                      <span className="font-heading font-bold text-foreground">{item.price}</span>
                    </div>
                  ))
                : fallbackExtra.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                      <p className="font-medium text-foreground text-sm">{item.name}</p>
                      <span className="font-heading font-bold text-foreground">{item.price}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-8 text-xs max-w-2xl mx-auto">
          Ceny dalších kombinovaných výcviků lze dohodnout individuálně. Ceny u motocyklů zahrnují zákonem daný počet hodin a zkoušku.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
