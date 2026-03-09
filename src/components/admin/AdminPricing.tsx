import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus } from "lucide-react";

interface PricingItem {
  id: string;
  section: string;
  group_name: string;
  price: string;
  price_pj: string | null;
  note: string | null;
  sort_order: number;
}

const SECTIONS = [
  { value: "courses", label: "Kurzy" },
  { value: "training", label: "Školení" },
  { value: "extra", label: "Doplňkové ceny" },
];

export const AdminPricing = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<PricingItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PricingItem | null>(null);
  const [section, setSection] = useState("courses");
  const [groupName, setGroupName] = useState("");
  const [price, setPrice] = useState("");
  const [pricePj, setPricePj] = useState("");
  const [note, setNote] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("pricing_items").select("*").order("section").order("sort_order");
    setItems((data as PricingItem[]) ?? []);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    setEditing(null); setSection("courses"); setGroupName(""); setPrice(""); setPricePj(""); setNote(""); setSortOrder(0); setDialogOpen(true);
  };

  const openEdit = (p: PricingItem) => {
    setEditing(p); setSection(p.section); setGroupName(p.group_name); setPrice(p.price); setPricePj(p.price_pj ?? ""); setNote(p.note ?? ""); setSortOrder(p.sort_order); setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        section,
        group_name: groupName,
        price,
        price_pj: pricePj || null,
        note: note || null,
        sort_order: sortOrder,
      };
      if (editing) {
        const { error } = await supabase.from("pricing_items").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Položka aktualizována" });
      } else {
        const { error } = await supabase.from("pricing_items").insert(payload);
        if (error) throw error;
        toast({ title: "Položka přidána" });
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err: any) {
      toast({ title: "Chyba", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat?")) return;
    const { error } = await supabase.from("pricing_items").delete().eq("id", id);
    if (error) toast({ title: "Chyba", description: error.message, variant: "destructive" });
    else { toast({ title: "Smazáno" }); fetchItems(); }
  };

  const grouped = SECTIONS.map((s) => ({
    ...s,
    items: items.filter((i) => i.section === s.value),
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-foreground">Ceník</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Přidat položku</Button>
      </div>

      <div className="space-y-6">
        {grouped.map((g) => (
          <Card key={g.value}>
            <CardContent className="p-0">
              <div className="hero-gradient px-5 py-3 rounded-t-lg">
                <h3 className="font-heading font-bold text-primary-foreground text-sm">{g.label}</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skupina/Název</TableHead>
                    <TableHead>Cena</TableHead>
                    {g.value === "courses" && <TableHead>1 hod. PJ</TableHead>}
                    {g.value === "training" && <TableHead>Poznámka</TableHead>}
                    <TableHead>Pořadí</TableHead>
                    <TableHead className="text-right">Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {g.items.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">Žádné položky.</TableCell></TableRow>
                  )}
                  {g.items.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.group_name}</TableCell>
                      <TableCell>{p.price}</TableCell>
                      {g.value === "courses" && <TableCell className="text-muted-foreground">{p.price_pj ?? "—"}</TableCell>}
                      {g.value === "training" && <TableCell className="text-muted-foreground">{p.note ?? "—"}</TableCell>}
                      <TableCell>{p.sort_order}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil size={16} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Upravit položku" : "Přidat položku"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sekce</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SECTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Skupina / Název</Label><Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="např. B, A1/A2, Prostoj jízda..." /></div>
            <div className="space-y-2"><Label>Cena</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="např. 25 000,-" /></div>
            {section === "courses" && (
              <div className="space-y-2"><Label>1 hod. PJ</Label><Input value={pricePj} onChange={(e) => setPricePj(e.target.value)} placeholder="např. 900,-" /></div>
            )}
            <div className="space-y-2"><Label>Poznámka</Label><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="volitelně" /></div>
            <div className="space-y-2"><Label>Pořadí</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušit</Button>
            <Button onClick={handleSave} disabled={saving || !groupName.trim() || !price.trim()}>{saving ? "Ukládání..." : "Uložit"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
