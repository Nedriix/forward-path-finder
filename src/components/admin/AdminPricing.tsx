import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface PricingItem {
  id: string;
  section: string;
  group_name: string;
  price: string;
  price_pj: string | null;
  note: string | null;
  sort_order: number | null;
}

const sections = [
  { value: "courses", label: "Kurzy" },
  { value: "training", label: "Školení" },
  { value: "extra", label: "Doplňkové" },
];

export const AdminPricing = () => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("pricing_items").select("*").order("sort_order");
    if (data) setItems(data as PricingItem[]);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const add = async () => {
    const { error } = await supabase.from("pricing_items").insert({
      section: "courses", group_name: "Nová položka", price: "0,-", sort_order: items.length,
    });
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    fetchItems();
  };

  const update = async (id: string, updates: Partial<PricingItem>) => {
    const { error } = await supabase.from("pricing_items").update(updates).eq("id", id);
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Uloženo" });
    fetchItems();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("pricing_items").delete().eq("id", id);
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    fetchItems();
  };

  if (loading) return <p>Načítání...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-bold text-xl">Ceník ({items.length})</h2>
        <Button onClick={add} className="gap-2"><Plus size={16} /> Přidat</Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-card rounded-lg card-shadow p-4">
            <select
              value={item.section}
              onChange={(e) => update(item.id, { section: e.target.value })}
              className="bg-muted rounded-md px-3 py-2 text-sm"
            >
              {sections.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <Input
              defaultValue={item.group_name}
              onBlur={(e) => { if (e.target.value !== item.group_name) update(item.id, { group_name: e.target.value }); }}
              placeholder="Název"
              className="flex-1"
            />
            <Input
              defaultValue={item.price}
              onBlur={(e) => { if (e.target.value !== item.price) update(item.id, { price: e.target.value }); }}
              placeholder="Cena"
              className="w-40"
            />
            <Input
              defaultValue={item.price_pj || ""}
              onBlur={(e) => update(item.id, { price_pj: e.target.value || null })}
              placeholder="PJ"
              className="w-28"
            />
            <Input
              defaultValue={item.note || ""}
              onBlur={(e) => update(item.id, { note: e.target.value || null })}
              placeholder="Poznámka"
              className="w-32"
            />
            <Input
              type="number"
              defaultValue={item.sort_order ?? 0}
              onBlur={(e) => update(item.id, { sort_order: parseInt(e.target.value) || 0 })}
              className="w-20"
            />
            <Button variant="destructive" size="icon" onClick={() => remove(item.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
