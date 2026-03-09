import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export const AdminAnnouncements = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as Announcement[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const add = async () => {
    const { error } = await supabase.from("announcements").insert({ title: "Nová aktualita", content: "Text aktuality..." });
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    fetch();
  };

  const update = async (id: string, updates: Partial<Announcement>) => {
    const { error } = await supabase.from("announcements").update(updates).eq("id", id);
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Uloženo" });
    fetch();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) { toast({ title: "Chyba", description: error.message, variant: "destructive" }); return; }
    fetch();
  };

  if (loading) return <p>Načítání...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-bold text-xl">Aktuality ({items.length})</h2>
        <Button onClick={add} className="gap-2"><Plus size={16} /> Přidat</Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card rounded-lg card-shadow p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Input
                defaultValue={item.title}
                onBlur={(e) => { if (e.target.value !== item.title) update(item.id, { title: e.target.value }); }}
                className="font-heading font-bold"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => update(item.id, { is_active: !item.is_active })}
                title={item.is_active ? "Aktivní" : "Neaktivní"}
              >
                {item.is_active ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} className="text-muted-foreground" />}
              </Button>
              <Button variant="destructive" size="icon" onClick={() => remove(item.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
            <textarea
              defaultValue={item.content}
              onBlur={(e) => { if (e.target.value !== item.content) update(item.id, { content: e.target.value }); }}
              className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary/50 transition resize-none min-h-[80px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
