import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { api, Entity, AnyItem } from "@/lib/api";

const ENTITY_CONFIG: Record<Entity, {
  label: string;
  icon: string;
  fields: { key: string; label: string; placeholder?: string; type?: string }[];
}> = {
  competitions: {
    label: "Конкурсы",
    icon: "Trophy",
    fields: [
      { key: "title", label: "Название", placeholder: "Название конкурса" },
      { key: "description", label: "Описание", placeholder: "Краткое описание", type: "textarea" },
      { key: "deadline", label: "Дедлайн", type: "date" },
      { key: "prize", label: "Призовой фонд", placeholder: "500 000 ₽" },
      { key: "organizer", label: "Организатор", placeholder: "Фонд содействия инновациям" },
      { key: "url", label: "Ссылка", placeholder: "https://..." },
    ],
  },
  grants: {
    label: "Гранты",
    icon: "Banknote",
    fields: [
      { key: "title", label: "Название", placeholder: "Название гранта" },
      { key: "description", label: "Описание", placeholder: "Краткое описание", type: "textarea" },
      { key: "amount", label: "Сумма", placeholder: "до 6 млн ₽/год" },
      { key: "deadline", label: "Дедлайн", type: "date" },
      { key: "organizer", label: "Организатор", placeholder: "РНФ" },
      { key: "url", label: "Ссылка", placeholder: "https://..." },
    ],
  },
  events: {
    label: "Мероприятия",
    icon: "Calendar",
    fields: [
      { key: "title", label: "Название", placeholder: "Название мероприятия" },
      { key: "description", label: "Описание", placeholder: "Краткое описание", type: "textarea" },
      { key: "event_date", label: "Дата", type: "date" },
      { key: "event_time", label: "Время", placeholder: "14:00" },
      { key: "location", label: "Место", placeholder: "Корпус 3, зал 301" },
      { key: "url", label: "Ссылка", placeholder: "https://..." },
    ],
  },
};

const EMPTY_FORM: Record<string, string> = {
  title: "", description: "", deadline: "", prize: "", organizer: "", url: "",
  amount: "", event_date: "", event_time: "", location: "", type: "event",
};

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const res = await api.list("competitions");
    setLoading(false);
    if (Array.isArray(res)) {
      onLogin(token);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="ShieldCheck" size={24} className="text-primary" />
          </div>
          <CardTitle className="text-xl">Админ-панель</CardTitle>
          <p className="text-sm text-muted-foreground">Управление контентом портала инноваций</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Пароль доступа</label>
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Введите ADMIN_TOKEN"
                className={error ? "border-red-400" : ""}
              />
              {error && <p className="text-xs text-red-500 mt-1">Неверный токен</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Проверка..." : "Войти"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">← Вернуться на сайт</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ItemForm({
  entity,
  editItem,
  token,
  onSaved,
  onCancel,
}: {
  entity: Entity;
  editItem?: AnyItem | null;
  token: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const config = ENTITY_CONFIG[entity];
  const [form, setForm] = useState<Record<string, string>>(
    editItem ? { ...EMPTY_FORM, ...(editItem as Record<string, string>) } : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(editItem ? { ...EMPTY_FORM, ...(editItem as Record<string, string>) } : { ...EMPTY_FORM });
  }, [editItem, entity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Название обязательно"); return; }
    setSaving(true);
    setError("");
    const payload: Record<string, string> = {};
    config.fields.forEach((f) => { if (form[f.key]) payload[f.key] = form[f.key]; });
    const it = editItem as (AnyItem & { id: number }) | null;
    const res = it
      ? await api.update(entity, it.id, payload, token)
      : await api.create(entity, payload, token);
    setSaving(false);
    if (res?.error) { setError(res.error); return; }
    onSaved();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{editItem ? "Редактировать" : "Добавить"} запись</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium text-foreground block mb-1">{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea
                  value={form[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={2}
                />
              ) : (
                <Input
                  type={field.type || "text"}
                  value={form[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={saving} size="sm">
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>Отмена</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EntityTab({ entity, token }: { entity: Entity; token: string }) {
  const [items, setItems] = useState<AnyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<AnyItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.list(entity, "all").then((res) => {
      setItems(Array.isArray(res) ? res.filter((r) => r.status !== "deleted") : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [entity]);

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить запись?")) return;
    setDeletingId(id);
    await api.remove(entity, id, token);
    setDeletingId(null);
    load();
  };

  const handleEdit = (item: AnyItem) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    load();
  };

  const getSubtitle = (item: AnyItem) => {
    const e = item as Record<string, string>;
    return e.deadline || e.event_date || e.organizer || e.amount || e.prize || "";
  };

  return (
    <div className="space-y-4">
      {!showForm && (
        <Button size="sm" onClick={() => { setEditItem(null); setShowForm(true); }}>
          <Icon name="Plus" size={14} className="mr-1.5" />
          Добавить
        </Button>
      )}

      {showForm && (
        <ItemForm
          entity={entity}
          editItem={editItem}
          token={token}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Нет записей. Добавьте первую!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const it = item as AnyItem & { id: number };
            const subtitle = getSubtitle(item);
            return (
              <div
                key={it.id}
                className="flex items-center justify-between gap-3 p-4 bg-white border border-border/60 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground truncate">{it.title}</p>
                    <Badge variant={it.status === "active" ? "default" : "secondary"} className="text-xs shrink-0">
                      {it.status === "active" ? "Активен" : it.status}
                    </Badge>
                  </div>
                  {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0">
                    <Icon name="Pencil" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(it.id)}
                    disabled={deletingId === it.id}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Admin = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));

  const handleLogin = (t: string) => {
    localStorage.setItem("admin_token", t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-white border-b border-border/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Lightbulb" size={14} className="text-primary" />
            </div>
            <span className="font-semibold text-sm text-foreground">Портал инноваций — Админ</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="ExternalLink" size={12} /> Открыть сайт
            </a>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs h-7">
              <Icon name="LogOut" size={12} className="mr-1" />Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Управление контентом</h1>
          <p className="text-sm text-muted-foreground mt-1">Добавляйте и редактируйте конкурсы, гранты и мероприятия</p>
        </div>

        <Tabs defaultValue="competitions">
          <TabsList className="mb-6">
            {(Object.keys(ENTITY_CONFIG) as Entity[]).map((e) => (
              <TabsTrigger key={e} value={e} className="flex items-center gap-1.5">
                <Icon name={ENTITY_CONFIG[e].icon} size={14} />
                {ENTITY_CONFIG[e].label}
              </TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(ENTITY_CONFIG) as Entity[]).map((e) => (
            <TabsContent key={e} value={e}>
              <EntityTab entity={e} token={token} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
