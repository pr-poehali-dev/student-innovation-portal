import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/3338a197-4d1f-42f0-a60e-944a9a01156f/files/c4ceb01a-8c0f-4183-8559-43eb068bc76f.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />

      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Icon name="Sparkles" size={14} className="text-accent" />
            <span className="text-xs font-medium tracking-wide uppercase">Управление инноваций и партнёрства</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Портал инноваций<br />
            <span className="text-accent">вашего вуза</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
            Конкурсы, гранты, мероприятия и программы акселерации — всё в одном месте для студентов и учёных
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              onClick={() => document.getElementById("calendar")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Icon name="Calendar" size={18} className="mr-2" />
              Календарь событий
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => document.getElementById("contests")?.scrollIntoView({ behavior: "smooth" })}
            >
              Все конкурсы
            </Button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 hidden xl:flex gap-4 p-8">
          {[
            { num: "24+", label: "конкурса" },
            { num: "12", label: "грантов" },
            { num: "150+", label: "участников" },
          ].map((stat) => (
            <div key={stat.label} className="text-center bg-white/10 backdrop-blur rounded-xl px-6 py-4 border border-white/10">
              <div className="text-2xl font-bold text-accent">{stat.num}</div>
              <div className="text-xs text-primary-foreground/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
