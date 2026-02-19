import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const steps = [
  { icon: "FileText", title: "Подача заявки", desc: "Заполните анкету и опишите свой проект" },
  { icon: "Users", title: "Отбор", desc: "Экспертная комиссия оценит потенциал идеи" },
  { icon: "Rocket", title: "Акселерация", desc: "3 месяца менторства от 22+ экспертов" },
  { icon: "Target", title: "Демо-день", desc: "Презентация инвесторам и партнёрам" },
];

const AcceleratorSection = () => {
  return (
    <section id="accelerator" className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground rounded-full px-4 py-1.5 mb-4">
              <Icon name="Zap" size={14} className="text-accent" />
              <span className="text-xs font-semibold tracking-wide uppercase">Программа</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Акселератор вуза</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Трёхмесячная программа интенсивного развития инновационных проектов студентов и молодых учёных.
              22+ эксперта из бизнеса и науки помогут превратить идею в работающий продукт.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { value: "22+", label: "экспертов" },
                { value: "3 мес.", label: "длительность" },
                { value: "50+", label: "выпускников" },
                { value: "85%", label: "запущено" },
              ].map((stat) => (
                <div key={stat.label} className="bg-muted/60 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Icon name="ArrowRight" size={16} className="mr-2" />
              Подать заявку
            </Button>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <Card key={step.title} className="border-border/60 hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{idx + 1}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={step.icon} size={16} className="text-primary" />
                      <h4 className="font-semibold text-foreground">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcceleratorSection;
