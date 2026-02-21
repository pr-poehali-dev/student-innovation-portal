import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useCompetitions, useGrants, useEvents } from "@/hooks/useContent";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

const SectionCards = () => {
  const { data: competitions = [], isLoading: lc } = useCompetitions();
  const { data: grants = [], isLoading: lg } = useGrants();
  const { data: events = [], isLoading: le } = useEvents();

  const sections = [
    {
      id: "contests",
      icon: "Trophy",
      title: "Конкурсы",
      description: "Студенческие конкурсы по инновациям — от идеи до реализации",
      items: competitions.slice(0, 4).map((c) => ({ name: c.title, deadline: formatDate(c.deadline), link: c.url || "#" })),
      isLoading: lc,
      color: "bg-blue-50 text-blue-700",
      iconBg: "bg-blue-100",
    },
    {
      id: "grants",
      icon: "Banknote",
      title: "Гранты",
      description: "Грантовые конкурсы Минобрнауки, ФНТП и фондов",
      items: grants.slice(0, 4).map((g) => ({ name: g.title, deadline: formatDate(g.deadline), link: g.url || "#" })),
      isLoading: lg,
      color: "bg-emerald-50 text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      id: "events",
      icon: "Users",
      title: "Мероприятия",
      description: "Проведённые и планируемые мероприятия по инновациям",
      items: events.slice(0, 4).map((e) => ({ name: e.title, deadline: formatDate(e.event_date), link: e.url || "#" })),
      isLoading: le,
      color: "bg-purple-50 text-purple-700",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Ключевые направления</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Актуальная информация о конкурсах, грантах и мероприятиях вуза</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <Card
            key={section.id}
            id={section.id}
            className="group hover:shadow-lg transition-all duration-300 border-border/60 animate-slide-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${section.iconBg} flex items-center justify-center`}>
                  <Icon name={section.icon} size={20} className={section.color.split(" ")[1]} />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{section.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{section.description}</p>

              {section.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : section.items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Нет данных</p>
              ) : (
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        target={item.link !== "#" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-2 group/item hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <Icon name="ChevronRight" size={14} className="text-muted-foreground mt-0.5 shrink-0 group-hover/item:text-primary transition-colors" />
                          <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">{item.name}</span>
                        </div>
                        {item.deadline && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">{item.deadline}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
