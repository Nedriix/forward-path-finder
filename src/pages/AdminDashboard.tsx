import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ArrowLeft, Car, Megaphone, DollarSign } from "lucide-react";
import { AdminVehicles } from "@/components/admin/AdminVehicles";
import { AdminAnnouncements } from "@/components/admin/AdminAnnouncements";
import { AdminPricing } from "@/components/admin/AdminPricing";

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [authLoading, user, isAdmin, navigate]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Načítání...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="hero-gradient border-b border-primary/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-primary-foreground">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="font-heading font-bold text-primary-foreground text-lg">Administrace</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-primary-foreground gap-2">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} /> Zobrazit web
              </a>
            </Button>
            <Button variant="ghost" onClick={() => signOut()} className="text-primary-foreground gap-2">
              <LogOut size={16} /> Odhlásit
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="vehicles">
          <TabsList className="mb-6">
            <TabsTrigger value="vehicles" className="gap-2"><Car size={16} /> Vozový park</TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2"><Megaphone size={16} /> Aktuality</TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2"><DollarSign size={16} /> Ceník</TabsTrigger>
          </TabsList>
          <TabsContent value="vehicles"><AdminVehicles /></TabsContent>
          <TabsContent value="announcements"><AdminAnnouncements /></TabsContent>
          <TabsContent value="pricing"><AdminPricing /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
