import { GraduationCap, BookOpen, ExternalLink } from "lucide-react";

const TrainingSection = () => {
  return (
    <section id="skoleni" className="py-20 md:py-28 section-gradient">
      <div className="container">
        <div className="text-center mb-16">
          <p className="font-heading font-semibold text-secondary tracking-widest uppercase text-sm mb-3">Školení řidičů</p>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground">
            Profesní i referentské <span className="text-gradient">školení</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl card-shadow p-8">
            <div className="bg-primary/10 p-3 rounded-xl w-fit mb-5">
              <GraduationCap className="text-primary" size={28} />
            </div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">Referentské školení</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Provádíme pravidelné školení řidičů vozidel do 3,5 tuny. Školení probíhá v prostorách zákazníka nebo v naší autoškole.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Povinnost se týká všech zaměstnanců, kteří fyzicky řídí vozidlo při výkonu pracovní činnosti, bez ohledu na to, zda řídí vozidlo služební nebo soukromé.
            </p>
          </div>

          <div className="bg-card rounded-2xl card-shadow p-8">
            <div className="bg-primary/10 p-3 rounded-xl w-fit mb-5">
              <BookOpen className="text-primary" size={28} />
            </div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">Profesní školení</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Od 1.7.2008 působíme jako akreditované školicí středisko na skupiny C1, C1+E, C, C+E, D1, D1+E, D, D+E.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Termíny školení jsou individuální a vypisujeme je dle potřeb zákazníka. Pro přihlášení kontaktujte kancelář autoškoly.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://etesty2.mdcr.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-heading font-bold hover:brightness-125 transition"
          >
            <ExternalLink size={18} />
            Zkuste si eTesty na webu MDČR
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
