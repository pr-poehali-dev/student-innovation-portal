import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const contacts = [
  {
    icon: "MapPin",
    title: "Адрес",
    lines: ["г. Москва, ул. Университетская, д. 1", "Корпус 3, каб. 301"],
  },
  {
    icon: "Phone",
    title: "Телефон",
    lines: ["+7 (495) 123-45-67", "Пн–Пт: 9:00–18:00"],
  },
  {
    icon: "Mail",
    title: "E-mail",
    lines: ["innovations@university.ru", "grants@university.ru"],
  },
];

const links = [
  { icon: "Globe", label: "Минобрнауки России", url: "https://minobrnauki.gov.ru" },
  { icon: "Globe", label: "Фонд содействия инновациям", url: "https://fasie.ru" },
  { icon: "Globe", label: "Российский научный фонд", url: "https://rscf.ru" },
  { icon: "Globe", label: "Платформа НТИ", url: "https://nti2035.ru" },
];

const ContactsSection = () => {
  return (
    <section id="contacts" className="bg-muted/40 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Контакты</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Управление инноваций и партнёрства</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contacts.map((c) => (
              <Card key={c.title} className="border-border/60 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name={c.icon} size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                  {c.lines.map((line) => (
                    <p key={line} className="text-sm text-muted-foreground">{line}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-center">Полезные ссылки</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-lg p-4 border border-border/60 hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <Icon name={link.icon} size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                  <Icon name="ExternalLink" size={12} className="text-muted-foreground/50 ml-auto shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
