import { Phone, Mail, MapPin, Building2 } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="kontakt" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <div className="text-center mb-16">
          <p className="font-heading font-semibold text-secondary tracking-widest uppercase text-sm mb-3">Kontakt</p>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground">
            Spojte se <span className="text-gradient">s námi</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl card-shadow p-8">
            <h3 className="font-heading font-bold text-lg text-foreground mb-6">Kontaktní informace</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="text-secondary mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-foreground text-sm">Telefon</p>
                  <a href="tel:+420603180198" className="text-muted-foreground text-sm hover:text-secondary transition-colors">+420 603 180 198</a>
                  <p className="text-muted-foreground text-xs mt-0.5">Dostupný pouze v provozní době</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-secondary mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-foreground text-sm">E-mail</p>
                  <a href="mailto:info@autoskolakoutny.cz" className="text-muted-foreground text-sm hover:text-secondary transition-colors">info@autoskolakoutny.cz</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-secondary mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-foreground text-sm">Adresa</p>
                  <p className="text-muted-foreground text-sm">17. listopadu č. 16<br />586 01 Jihlava</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl card-shadow p-8">
            <h3 className="font-heading font-bold text-lg text-foreground mb-6">Firemní údaje</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="text-secondary" size={16} />
                  <p className="font-heading font-bold text-sm text-foreground">MOTOŠKOLA Bc. Pavel Popelka</p>
                </div>
                <div className="text-muted-foreground text-sm space-y-0.5 ml-6">
                  <p>IČ: 19177488</p>
                  <p>DIČ: CZ8809095207</p>
                  <p className="text-xs">Neplátce DPH</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="text-secondary" size={16} />
                  <p className="font-heading font-bold text-sm text-foreground">AUTOŠKOLA Petra Popelková</p>
                </div>
                <div className="text-muted-foreground text-sm space-y-0.5 ml-6">
                  <p>IČ: 71893695</p>
                  <p>DIČ: CZ8553164774</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl card-shadow p-8">
            <h3 className="font-heading font-bold text-lg text-foreground mb-6">Napište nám</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Jméno"
                className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary/50 transition"
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary/50 transition"
              />
              <textarea
                placeholder="Vaše zpráva"
                rows={4}
                className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary/50 transition resize-none"
              />
              <button
                type="submit"
                className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-heading font-bold hover:brightness-110 transition"
              >
                Odeslat
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
