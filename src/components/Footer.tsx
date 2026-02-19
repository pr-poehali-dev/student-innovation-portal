import Icon from "@/components/ui/icon";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Icon name="Lightbulb" size={18} className="text-accent" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-sm tracking-wide">ПОРТАЛ ИННОВАЦИЙ</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Управление инноваций и партнёрства вуза. Все права защищены.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Разделы</h4>
            <ul className="space-y-2">
              {["Конкурсы", "Гранты", "Календарь", "Мероприятия", "Акселератор"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Контакты</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p>+7 (495) 123-45-67</p>
              <p>innovations@university.ru</p>
              <p>г. Москва, ул. Университетская, д. 1</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-xs text-primary-foreground/40">© 2026 Портал инноваций вуза</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
