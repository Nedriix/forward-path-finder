import { useEffect, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

interface Announcement {
  id: string;
  title: string;
  content: string;
}

const fallbackAnnouncement = {
  title: "Aktuálně",
  content: "V týdnu od 9.3. do 13.3. z důvodu malování prostor bude autoškola UZAVŘENA.",
};

const HeroSection = () => {
  const [announcement, setAnnouncement] = useState<{ title: string; content: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("id, title, content")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAnnouncement(data[0] as Announcement);
        } else {
          setAnnouncement(fallbackAnnouncement);
        }
        setLoaded(true);
      });
  }, []);

  const displayAnnouncement = announcement ?? fallbackAnnouncement;

  return (
    <section id="uvod" className="relative min-h-[90vh] flex items-center pt-20">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Autoškola Popelková" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-80" />
      </div>
      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="font-heading font-semibold text-secondary tracking-widest uppercase text-sm mb-4 animate-fade-in-up">
            Jihlava · Od roku 1990
          </p>
          <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            AUTOŠKOLA<br />
            <span className="text-gradient">Popelková</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Provádíme výuku a výcvik na všechny skupiny řidičského oprávnění. Teoretickou výuku lze absolvovat formou běžné výuky nebo individuálního studijního plánu.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a href="#opravneni" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-heading font-bold hover:brightness-110 transition">
              Řidičská oprávnění
            </a>
            <a href="#kontakt" className="border-2 border-primary-foreground/30 text-primary-foreground px-6 py-3 rounded-lg font-heading font-bold hover:border-secondary hover:text-secondary transition">
              Kontaktujte nás
            </a>
          </div>
        </div>

        <div className="mt-12 max-w-xl animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="bg-card/10 backdrop-blur-md border border-secondary/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-secondary" size={20} />
              <span className="font-heading font-bold text-secondary text-sm uppercase tracking-wide">{displayAnnouncement.title}</span>
            </div>
            <p className="text-primary-foreground/90 text-sm mb-4">
              {displayAnnouncement.content}
            </p>
            <div className="flex items-start gap-2">
              <Clock className="text-secondary mt-0.5" size={16} />
              <div className="text-primary-foreground/70 text-sm space-y-0.5">
                <p><span className="text-primary-foreground/90 font-medium">Po:</span> 8:30 – 15:00</p>
                <p><span className="text-primary-foreground/90 font-medium">Út, Čt:</span> 8:30 – 16:00</p>
                <p><span className="text-primary-foreground/90 font-medium">St, Pá:</span> Zavřeno</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
