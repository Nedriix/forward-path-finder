import { Car, Bike, Truck, Bus } from "lucide-react";

const groups = [
  {
    id: "A",
    title: "Skupina A",
    subtitle: "Motocykly a mopedy",
    icon: Bike,
    items: [
      { name: "AM – mopedy", desc: "Motorová vozidla do 45 km/h", age: "od 15 let" },
      { name: "A1 – lehké motocykly", desc: "Do 11 kW, 125 cm³", age: "od 16 let" },
      { name: "A2 – motocykly do 35 kW", desc: "Poměr výkon/hmotnost do 0,2 kW/kg", age: "od 18 let" },
      { name: "A – motocykly nad 35 kW", desc: "Bez omezení výkonu", age: "od 24 let" },
    ],
  },
  {
    id: "B",
    title: "Skupina B",
    subtitle: "Osobní automobily",
    icon: Car,
    items: [
      { name: "B – vozidla do 3 500 kg", desc: "Max 8+1 míst, přípojné do 750 kg", age: "od 18 let" },
      { name: "B+E – jízdní soupravy", desc: "Sk. B + přívěs do 3 500 kg", age: "od 18 let, držitel B" },
    ],
  },
  {
    id: "C",
    title: "Skupina C",
    subtitle: "Nákladní automobily",
    icon: Truck,
    items: [
      { name: "C – nad 3 500 kg", desc: "Přípojné do 750 kg", age: "od 21 let, držitel B" },
      { name: "C+E – jízdní soupravy", desc: "Sk. C + přívěs nad 750 kg", age: "od 21 let, držitel C" },
    ],
  },
  {
    id: "D",
    title: "Skupina D",
    subtitle: "Autobusy",
    icon: Bus,
    items: [
      { name: "D – více než 9 osob", desc: "Přípojné do 750 kg", age: "od 24 let, držitel B/C" },
      { name: "D+E – jízdní soupravy", desc: "Sk. D + přívěs nad 750 kg", age: "od 24 let, držitel D" },
    ],
  },
];

const LicenseSection = () => {
  return (
    <section id="opravneni" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-16">
          <p className="font-heading font-semibold text-secondary tracking-widest uppercase text-sm mb-3">Řidičská oprávnění</p>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground">
            Vyberte si svůj <span className="text-gradient">kurz</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {groups.map((group) => (
            <div key={group.id} className="bg-card rounded-2xl card-shadow hover:card-shadow-hover transition-shadow duration-300 overflow-hidden">
              <div className="hero-gradient p-6 flex items-center gap-4">
                <div className="bg-secondary/20 p-3 rounded-xl">
                  <group.icon className="text-secondary" size={28} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-primary-foreground">{group.title}</h3>
                  <p className="text-primary-foreground/70 text-sm">{group.subtitle}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {group.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0" />
                    <div>
                      <p className="font-heading font-semibold text-foreground text-sm">{item.name}</p>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                      <span className="text-secondary font-semibold text-xs">{item.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          Při rozšíření z A1→A2 nebo A2→A (po 2 letech držení) se skládá pouze doplňková zkouška s kondičními jízdami.
        </p>
      </div>
    </section>
  );
};

export default LicenseSection;
