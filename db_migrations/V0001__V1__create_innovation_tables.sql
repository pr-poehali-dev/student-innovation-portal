
CREATE TABLE IF NOT EXISTS competitions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  prize TEXT,
  organizer TEXT,
  url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grants (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  amount TEXT,
  deadline DATE,
  organizer TEXT,
  url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  event_time TEXT,
  location TEXT,
  type TEXT DEFAULT 'event',
  url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO competitions (title, description, deadline, prize, organizer, url) VALUES
('УМНИК', 'Программа поддержки молодых учёных с инновационными идеями. Финансирование для проведения НИОКР.', '2026-04-30', '500 000 ₽', 'Фонд содействия инновациям', 'https://fasie.ru/programs/programm-umnik/'),
('Студенческий стартап', 'Грант на создание и развитие студенческого стартапа. Для команд до 5 человек.', '2026-05-15', '1 000 000 ₽', 'Фонд содействия инновациям', 'https://fasie.ru/programs/programm-student/'),
('IT-Планета', 'Международный конкурс IT-проектов для студентов вузов.', '2026-06-01', 'Призы и стажировки', 'IT-Планета', 'https://it-planeta.ru');

INSERT INTO grants (title, description, amount, deadline, organizer, url) VALUES
('РНФ — Малые отдельные научные группы', 'Поддержка исследований небольших научных групп по приоритетным направлениям.', 'до 6 млн ₽/год', '2026-03-31', 'Российский научный фонд', 'https://rscf.ru'),
('Мегагрант Правительства РФ', 'Финансирование мирового уровня для привлечения ведущих учёных.', 'до 90 млн ₽', '2026-04-15', 'Минобрнауки России', 'https://minobrnauki.gov.ru'),
('РФФИ — Аспиранты', 'Финансирование научных проектов, выполняемых аспирантами.', 'до 500 000 ₽', '2026-05-20', 'РФФИ', 'https://www.rfbr.ru');

INSERT INTO events (title, description, event_date, event_time, location, type) VALUES
('День открытых дверей акселератора', 'Презентация новой программы акселерации. Узнайте об условиях участия.', '2026-03-05', '14:00', 'Корпус 3, зал 301', 'event'),
('Вебинар: Как подать заявку на УМНИК', 'Разбор типичных ошибок и советы по оформлению заявок.', '2026-03-12', '11:00', 'Онлайн (Zoom)', 'event'),
('Хакатон «Умный кампус»', 'Командное соревнование по разработке цифровых решений для вуза.', '2026-03-20', '09:00', 'Технопарк, 4 этаж', 'competition'),
('Форум молодых учёных', 'Ежегодный научный форум с участием ведущих российских учёных.', '2026-04-10', '10:00', 'Главный актовый зал', 'event');
