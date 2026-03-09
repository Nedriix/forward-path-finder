import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const navItems = [
  { label: "Úvod", href: "#uvod" },
  { label: "Řidičská oprávnění", href: "#opravneni" },
  { label: "Školení řidičů", href: "#skoleni" },
  { label: "Ceník", href: "#cenik" },
  { label: "Vozový park", href: "#vozovy-park" },
  { label: "O nás", href: "#o-nas" },
  { label: "Kontakt", href: "#kontakt" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hero-gradient backdrop-blur-md border-b border-primary/20">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <a href="#uvod" className="font-heading font-extrabold text-lg md:text-xl text-primary-foreground tracking-tight">
          AUTOŠKOLA <span className="text-gradient">Popelková</span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:text-secondary transition-colors rounded-md"
            >
              {item.label}
            </a>
          ))}
          <a href="tel:+420603180198" className="ml-4 flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm hover:brightness-110 transition">
            <Phone size={16} />
            603 180 198
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-primary-foreground p-2">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden hero-gradient border-t border-primary/20 pb-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-primary-foreground/80 hover:text-secondary font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="px-6 pt-2">
            <a href="tel:+420603180198" className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm w-fit">
              <Phone size={16} />
              603 180 198
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
