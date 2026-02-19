import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const navItems = [
  { label: "Конкурсы", href: "#contests" },
  { label: "Гранты", href: "#grants" },
  { label: "Календарь", href: "#calendar" },
  { label: "Мероприятия", href: "#events" },
  { label: "Акселератор", href: "#accelerator" },
  { label: "Контакты", href: "#contacts" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="Lightbulb" size={22} className="text-accent" />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-primary text-sm tracking-wide">ПОРТАЛ</span>
            <span className="block text-[11px] text-muted-foreground tracking-widest uppercase">инноваций</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-muted"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
        </Button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t bg-white px-4 pb-4 animate-fade-in">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-foreground/80 hover:text-primary border-b border-border/50 last:border-0"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
