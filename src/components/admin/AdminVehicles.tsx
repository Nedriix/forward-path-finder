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
import { Trash2, Pencil, Plus, Upload, X, Image } from "lucide-react";

interface VehiclePhoto {
  id: string;
  vehicle_id: string;
  image_url: string;
  sort_order: number;
}

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
  const [photos, setPhotos] = useState<Record<string, VehiclePhoto[]>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingPhotos, setEditingPhotos] = useState<VehiclePhoto[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("B");
  const [sortOrder, setSortOrder] = useState(0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [vRes, pRes] = await Promise.all([
      supabase.from("vehicles").select("*").order("category").order("sort_order"),
      supabase.from("vehicle_photos").select("*").order("sort_order"),
    ]);
    setVehicles((vRes.data as Vehicle[]) ?? []);
    const grouped: Record<string, VehiclePhoto[]> = {};
    ((pRes.data as VehiclePhoto[]) ?? []).forEach((p) => {
      if (!grouped[p.vehicle_id]) grouped[p.vehicle_id] = [];
      grouped[p.vehicle_id].push(p);
    });
    setPhotos(grouped);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditingVehicle(null);
    setEditingPhotos([]);
    setName("");
    setCategory("B");
    setSortOrder(0);
    setNewFiles([]);
    setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setEditingPhotos(photos[v.id] ?? []);
    setName(v.name);
    setCategory(v.category);
    setSortOrder(v.sort_order);
    setNewFiles([]);
    setDialogOpen(true);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("vehicle-photos").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("vehicle-photos").getPublicUrl(path).data.publicUrl;
  };

  const removePhoto = async (photo: VehiclePhoto) => {
    try {
      const path = photo.image_url.split("/vehicle-photos/").pop();
      if (path) {
        await supabase.storage.from("vehicle-photos").remove([path]);
      }
      await supabase.from("vehicle_photos").delete().eq("id", photo.id);
      setEditingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      toast({ title: "Fotka odstraněna" });
    } catch (err: any) {
      toast({ title: "Chyba", description: err.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let vehicleId = editingVehicle?.id;

      if (editingVehicle) {
        const { error } = await supabase.from("vehicles").update({ name, category, sort_order: sortOrder }).eq("id", editingVehicle.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("vehicles").insert({ name, category, sort_order: sortOrder }).select("id").single();
        if (error) throw error;
        vehicleId = data.id;
      }

      // Upload new files
      if (newFiles.length > 0 && vehicleId) {
        const maxOrder = editingPhotos.length > 0
          ? Math.max(...editingPhotos.map((p) => p.sort_order)) + 1
          : 0;

        for (let i = 0; i < newFiles.length; i++) {
          const url = await uploadFile(newFiles[i]);
          const { error } = await supabase.from("vehicle_photos").insert({
            vehicle_id: vehicleId,
            image_url: url,
            sort_order: maxOrder + i,
          });
          if (error) throw error;
        }
      }

      toast({ title: editingVehicle ? "Vozidlo aktualizováno" : "Vozidlo přidáno" });
      setDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Chyba", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat?")) return;
    // Photos will be cascade-deleted from DB, but we should also remove from storage
    const vehiclePhotos = photos[id] ?? [];
    for (const p of vehiclePhotos) {
      const path = p.image_url.split("/vehicle-photos/").pop();
      if (path) await supabase.storage.from("vehicle-photos").remove([path]);
    }
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) toast({ title: "Chyba", description: error.message, variant: "destructive" });
    else { toast({ title: "Smazáno" }); fetchData(); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
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
                <TableHead>Fotky</TableHead>
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
              {vehicles.map((v) => {
                const vPhotos = photos[v.id] ?? [];
                return (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="flex gap-1">
                        {vPhotos.length > 0 ? (
                          <>
                            <img src={vPhotos[0].image_url} alt={v.name} className="w-16 h-12 object-cover rounded" />
                            {vPhotos.length > 1 && (
                              <span className="flex items-center text-xs text-muted-foreground">+{vPhotos.length - 1}</span>
                            )}
                          </>
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            <Image size={16} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{CATEGORIES.find((c) => c.value === v.category)?.label ?? v.category}</TableCell>
                    <TableCell>{v.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil size={16} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 size={16} className="text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingVehicle ? "Upravit vozidlo" : "Přidat vozidlo"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Název</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="např. Toyota Yaris" /></div>
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Pořadí</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
            <div className="space-y-2">
              <Label>Fotky</Label>
              {/* Existing photos */}
              {editingPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {editingPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img src={photo.image_url} alt="" className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:brightness-90 transition opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* New files to upload */}
              {newFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {newFiles.map((file, i) => (
                    <div key={i} className="relative group">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-20 object-cover rounded border-2 border-dashed border-primary/30" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:brightness-90 transition opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer border border-input rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors w-fit">
                <Upload size={16} /> Přidat fotky
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
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
