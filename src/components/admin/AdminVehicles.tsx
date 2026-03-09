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
import { Trash2, Pencil, Plus, Upload, X } from "lucide-react";

interface Vehicle {
  id: string;
  category: string;
  name: string;
  image_url: string | null;
  sort_order: number;
}

const CATEGORIES = [
  { value: "A", label: "A – Motocykly" },
  { value: "B", label: "B – Osobní automobily" },
  { value: "C", label: "C – Nákladní automobil" },
  { value: "D", label: "D – Autobus" },
  { value: "T", label: "T – Traktor" },
];

export const AdminVehicles = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("B");
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchVehicles = async () => {
    const { data } = await supabase.from("vehicles").select("*").order("category").order("sort_order");
    setVehicles((data as Vehicle[]) ?? []);
  };

  useEffect(() => { fetchVehicles(); }, []);

  const openNew = () => { setEditingVehicle(null); setName(""); setCategory("B"); setSortOrder(0); setImageFile(null); setDialogOpen(true); };
  const openEdit = (v: Vehicle) => { setEditingVehicle(v); setName(v.name); setCategory(v.category); setSortOrder(v.sort_order); setImageFile(null); setDialogOpen(true); };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("vehicle-photos").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("vehicle-photos").getPublicUrl(path).data.publicUrl;
  };

  const removeImage = async () => {
    if (!editingVehicle?.image_url) return;
    try {
      const url = editingVehicle.image_url;
      const path = url.split("/vehicle-photos/").pop();
      if (path) {
        await supabase.storage.from("vehicle-photos").remove([path]);
      }
      await supabase.from("vehicles").update({ image_url: null }).eq("id", editingVehicle.id);
      setEditingVehicle({ ...editingVehicle, image_url: null });
      toast({ title: "Fotka odstraněna" });
    } catch (err: any) {
      toast({ title: "Chyba", description: err.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let image_url = editingVehicle?.image_url ?? null;
      if (imageFile) image_url = await uploadImage(imageFile);
      if (editingVehicle) {
        const { error } = await supabase.from("vehicles").update({ name, category, sort_order: sortOrder, image_url }).eq("id", editingVehicle.id);
        if (error) throw error;
        toast({ title: "Vozidlo aktualizováno" });
      } else {
        const { error } = await supabase.from("vehicles").insert({ name, category, sort_order: sortOrder, image_url });
        if (error) throw error;
        toast({ title: "Vozidlo přidáno" });
      }
      setDialogOpen(false);
      fetchVehicles();
    } catch (err: any) {
      toast({ title: "Chyba", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat?")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) toast({ title: "Chyba", description: error.message, variant: "destructive" });
    else { toast({ title: "Smazáno" }); fetchVehicles(); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-foreground">Vozidla</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Přidat vozidlo</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fotka</TableHead>
                <TableHead>Název</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Pořadí</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Žádná vozidla.</TableCell></TableRow>
              )}
              {vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    {v.image_url ? <img src={v.image_url} alt={v.name} className="w-16 h-12 object-cover rounded" /> : <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">—</div>}
                  </TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>{CATEGORIES.find((c) => c.value === v.category)?.label ?? v.category}</TableCell>
                  <TableCell>{v.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 size={16} className="text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingVehicle ? "Upravit vozidlo" : "Přidat vozidlo"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Název</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="např. Toyota Yaris" /></div>
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Pořadí</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
            <div className="space-y-2">
              <Label>Fotka</Label>
              {editingVehicle?.image_url && !imageFile && (
                <div className="relative w-24">
                  <img src={editingVehicle.image_url} alt="" className="w-24 h-18 object-cover rounded" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:brightness-90 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer border border-input rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors w-fit">
                <Upload size={16} />{imageFile ? imageFile.name : "Vybrat soubor"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušit</Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>{saving ? "Ukládání..." : "Uložit"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
