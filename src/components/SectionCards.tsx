import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const sections = [
  {
    id: "contests",
    icon: "Trophy",
    title: "Конкурсы",
    description: "Студенческие конкурсы по инновациям — от идеи до реализации",
    items: [
      { name: "УМНИК", deadline: "15 марта 2026", link: "#" },
      { name: "Студенческий стартап", deadline: "1 апреля 2026", link: "#" },
      { name: "Инновационный прорыв", deadline: "20 мая 2026", link: "#" },
      { name: "НТИ — Национальная технологическая олимпиада", deadline: "30 марта 2026", link: "#" },
    ],
    color: "bg-blue-50 text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    id: "grants",
    icon: "Banknote",
    title: "Гранты",
    description: "Грантовые конкурсы Минобрнауки, ФНТП и фондов",
    items: [
      { name: "Грант Минобрнауки РФ", deadline: "10 апреля 2026", link: "#" },
      { name: "ФНТП — Приоритет 2030", deadline: "25 апреля 2026", link: "#" },
      { name: "РНФ — Фундаментальные исследования", deadline: "15 мая 2026", link: "#" },
      { name: "Фонд Бортника", deadline: "1 июня 2026", link: "#" },
    ],
    color: "bg-emerald-50 text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    id: "events",
    icon: "Users",
    title: "Мероприятия",
    description: "Проведённые и планируемые мероприятия по инновациям",
    items: [
      { name: "Форум «Инновации и бизнес»", deadline: "5 марта 2026", link: "#" },
      { name: "День науки — выставка проектов", deadline: "8 февраля 2026", link: "#" },
      { name: "Хакатон «TechStorm 2026»", deadline: "22 апреля 2026", link: "#" },
      { name: "Демо-день Акселератора", deadline: "10 июня 2026", link: "#" },
    ],
    color: "bg-purple-50 text-purple-700",
    iconBg: "bg-purple-100",
  },
];

const SectionCards = () => {
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

              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      className="flex items-start justify-between gap-2 group/item hover:bg-muted/50 -mx-2 px-2 py-2 rounded-md transition-colors"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <Icon name="ChevronRight" size={14} className="text-muted-foreground mt-0.5 shrink-0 group-hover/item:text-primary transition-colors" />
                        <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">{item.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">{item.deadline}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
