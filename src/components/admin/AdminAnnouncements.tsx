import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export const AdminAnnouncements = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Announcement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("Aktuálně");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data as Announcement[]) ?? []);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setTitle("Aktuálně"); setContent(""); setIsActive(true); setDialogOpen(true); };
  const openEdit = (a: Announcement) => { setEditing(a); setTitle(a.title); setContent(a.content); setIsActive(a.is_active); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from("announcements").update({ title, content, is_active: isActive }).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Aktualita aktualizována" });
      } else {
        const { error } = await supabase.from("announcements").insert({ title, content, is_active: isActive });
        if (error) throw error;
        toast({ title: "Aktualita přidána" });
      }
      setDialogOpen(false);
      fetch();
    } catch (err: any) {
      toast({ title: "Chyba", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat?")) return;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) toast({ title: "Chyba", description: error.message, variant: "destructive" });
    else { toast({ title: "Smazáno" }); fetch(); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-foreground">Aktuality</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Přidat aktualitu</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulek</TableHead>
                <TableHead>Obsah</TableHead>
                <TableHead>Aktivní</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Žádné aktuality.</TableCell></TableRow>
              )}
              {items.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{a.content}</TableCell>
                  <TableCell>
                    <span className={`inline-block w-2 h-2 rounded-full ${a.is_active ? "bg-green-500" : "bg-muted-foreground"}`} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 size={16} className="text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Upravit aktualitu" : "Přidat aktualitu"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Titulek</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Obsah</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} /></div>
            <div className="flex items-center gap-3">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Aktivní (zobrazuje se na webu)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušit</Button>
            <Button onClick={handleSave} disabled={saving || !content.trim()}>{saving ? "Ukládání..." : "Uložit"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
