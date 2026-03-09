import { Award, Users, CarFront } from "lucide-react";

const stats = [
  { icon: Award, label: "Založeno", value: "1990" },
  { icon: Users, label: "Skupiny ŘO", value: "Všechny" },
  { icon: CarFront, label: "Vozový park", value: "Kompletní" },
];

const AboutSection = () => {
  return (
    <section id="o-nas" className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-heading font-semibold text-secondary tracking-widest uppercase text-sm mb-3">O nás</p>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mb-8">
            Více než 35 let <span className="text-gradient">zkušeností</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            Autoškola byla založena v roce 1990. Od založení provádíme výcvik na všechny druhy řidičského oprávnění, včetně všech školení řidičů. Disponujeme vlastní plně vybavenou učebnou, trenažerem jízd a kompletním vozovým parkem.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl card-shadow p-6">
                <stat.icon className="text-secondary mx-auto mb-3" size={32} />
                <p className="font-heading font-black text-2xl text-foreground">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
