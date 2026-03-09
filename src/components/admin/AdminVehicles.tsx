import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";

interface Vehicle {
  id: string;
  category: string;
  name: string;
  image_url: string | null;
  sort_order: number | null;
}

const categories = ["A", "B", "C", "D", "T"];

export const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    const { data } = await supabase.from("vehicles").select("*").order("sort_order");
    if (data) setVehicles(data as Vehicle[]);
    setLoading(false);
  };

  useEffect(() => { fetchVehicles(); }, []);

  const addVehicle = async () => {
    const { error } = await supabase.from("vehicles").insert({ category: "B", name: "Nové vozidlo", sort_order: vehicles.length });
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    fetchVehicles();
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    const { error } = await supabase.from("vehicles").update(updates).eq("id", id);
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Uloženo" });
    fetchVehicles();
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    fetchVehicles();
  };

  if (loading) return <p>Načítání...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-bold text-xl">Vozový park ({vehicles.length})</h2>
        <Button onClick={addVehicle} className="gap-2"><Plus size={16} /> Přidat</Button>
      </div>
      <div className="space-y-3">
        {vehicles.map((v) => (
          <div key={v.id} className="flex items-center gap-3 bg-card rounded-lg card-shadow p-4">
            <select
              value={v.category}
              onChange={(e) => updateVehicle(v.id, { category: e.target.value })}
              className="bg-muted rounded-md px-3 py-2 text-sm font-heading font-bold"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input
              defaultValue={v.name}
              onBlur={(e) => { if (e.target.value !== v.name) updateVehicle(v.id, { name: e.target.value }); }}
              className="flex-1"
            />
            <Input
              defaultValue={v.image_url || ""}
              placeholder="URL obrázku"
              onBlur={(e) => updateVehicle(v.id, { image_url: e.target.value || null })}
              className="w-48"
            />
            <Input
              type="number"
              defaultValue={v.sort_order ?? 0}
              onBlur={(e) => updateVehicle(v.id, { sort_order: parseInt(e.target.value) || 0 })}
              className="w-20"
            />
            <Button variant="destructive" size="icon" onClick={() => deleteVehicle(v.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
