import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

type EventType = "contest" | "grant" | "event";

interface CalendarEvent {
  date: Date;
  title: string;
  type: EventType;
  description: string;
}

const events: CalendarEvent[] = [
  { date: new Date(2026, 1, 25), title: "Дедлайн УМНИК — подача заявок", type: "contest", description: "Финальный срок подачи заявок на конкурс УМНИК" },
  { date: new Date(2026, 2, 5), title: "Форум «Инновации и бизнес»", type: "event", description: "Ежегодный форум с участием партнёров" },
  { date: new Date(2026, 2, 10), title: "Открытие приёма грантов РНФ", type: "grant", description: "Старт приёма заявок на гранты Российского научного фонда" },
  { date: new Date(2026, 2, 15), title: "Дедлайн «Студенческий стартап»", type: "contest", description: "Последний день подачи на программу студенческих стартапов" },
  { date: new Date(2026, 2, 20), title: "Вебинар: как подать грант", type: "event", description: "Онлайн-семинар по подготовке грантовых заявок" },
  { date: new Date(2026, 2, 28), title: "Хакатон TechStorm", type: "event", description: "48-часовой хакатон по разработке инновационных решений" },
  { date: new Date(2026, 3, 1), title: "Грант Минобрнауки", type: "grant", description: "Дедлайн подачи на грантовую программу Минобрнауки" },
  { date: new Date(2026, 3, 10), title: "Демо-день Акселератора", type: "event", description: "Презентация проектов участников акселератора" },
  { date: new Date(2026, 3, 15), title: "НТИ — регистрация", type: "contest", description: "Открытие регистрации на Национальную технологическую олимпиаду" },
  { date: new Date(2026, 3, 25), title: "Грант ФНТП", type: "grant", description: "Дедлайн ФНТП — Приоритет 2030" },
  { date: new Date(2026, 4, 12), title: "День открытых дверей УИиП", type: "event", description: "Презентация работы Управления инноваций и партнёрства" },
  { date: new Date(2026, 4, 20), title: "Инновационный прорыв", type: "contest", description: "Крайний срок подачи проектов на конкурс" },
];

const typeConfig: Record<EventType, { label: string; color: string; dotColor: string }> = {
  contest: { label: "Конкурсы", color: "bg-blue-100 text-blue-800 hover:bg-blue-200", dotColor: "bg-blue-500" },
  grant: { label: "Гранты", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", dotColor: "bg-emerald-500" },
  event: { label: "Мероприятия", color: "bg-purple-100 text-purple-800 hover:bg-purple-200", dotColor: "bg-purple-500" },
};

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filter, setFilter] = useState<"all" | EventType>("all");

  const filteredEvents = useMemo(() => {
    return events.filter((e) => filter === "all" || e.type === filter);
  }, [filter]);

  const eventsForDate = useMemo(() => {
    if (!selectedDate) return filteredEvents.slice(0, 5);
    return filteredEvents.filter(
      (e) =>
        e.date.getFullYear() === selectedDate.getFullYear() &&
        e.date.getMonth() === selectedDate.getMonth() &&
        e.date.getDate() === selectedDate.getDate()
    );
  }, [selectedDate, filteredEvents]);

  const eventDates = useMemo(() => {
    return filteredEvents.map((e) => e.date);
  }, [filteredEvents]);

  const modifiers = {
    hasEvent: eventDates,
  };

  const modifiersStyles = {
    hasEvent: {
      fontWeight: 700,
      position: "relative" as const,
    },
  };

  return (
    <section id="calendar" className="bg-muted/40 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Интерактивный календарь</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Отслеживайте дедлайны конкурсов, грантов и мероприятий</p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | EventType)}>
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="contest">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
                Конкурсы
              </TabsTrigger>
              <TabsTrigger value="grant">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                Гранты
              </TabsTrigger>
              <TabsTrigger value="event">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5" />
                Мероприятия
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-8 max-w-5xl mx-auto">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="pointer-events-auto"
              />
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t px-2">
                {Object.entries(typeConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
                    <span className="text-xs text-muted-foreground">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">
                {selectedDate
                  ? `События ${selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}`
                  : "Ближайшие события"}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <Icon name="X" size={12} />
                  Сбросить
                </button>
              )}
            </div>

            {eventsForDate.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Icon name="CalendarOff" size={32} className="text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Нет событий на выбранную дату</p>
                </CardContent>
              </Card>
            ) : (
              eventsForDate.map((event, idx) => {
                const cfg = typeConfig[event.type];
                return (
                  <Card key={idx} className="border-border/60 hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base font-semibold leading-snug">{event.title}</CardTitle>
                        <Badge variant="secondary" className={`shrink-0 text-xs ${cfg.color}`}>
                          {cfg.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon name="Clock" size={12} />
                        {event.date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;
