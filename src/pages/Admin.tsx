import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import {
  adminLogin,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  type ItemType,
  type AnyItem,
  type Competition,
  type Grant,
  type Event,
} from "@/api/items";

const TABS: { key: ItemType; label: string }[] = [
  { key: "competitions", label: "Конкурсы" },
  { key: "grants", label: "Гранты" },
  { key: "events", label: "Мероприятия" },
];

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await adminLogin(password);
    setLoading(false);
    if ("token" in res) {
      onLogin(res.token);
    } else {
      setError(res.error || "Ошибка входа");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Icon name="Lock" size={20} className="text-primary" />
          </div>
          <CardTitle>Вход в панель управления</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="mt-1"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

type FormData = Record<string, string>;

const FIELDS: Record<ItemType, { key: string; label: string; type?: string }[]> = {
  competitions: [
    { key: "title", label: "Название" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "deadline", label: "Дедлайн", type: "date" },
    { key: "prize", label: "Призовой фонд" },
    { key: "organizer", label: "Организатор" },
    { key: "url", label: "Ссылка" },
  ],
  grants: [
    { key: "title", label: "Название" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "amount", label: "Сумма гранта" },
    { key: "deadline", label: "Дедлайн", type: "date" },
    { key: "organizer", label: "Организатор" },
    { key: "url", label: "Ссылка" },
  ],
  events: [
    { key: "title", label: "Название" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "event_date", label: "Дата", type: "date" },
    { key: "event_time", label: "Время (напр. 14:00)" },
    { key: "location", label: "Место проведения" },
    { key: "url", label: "Ссылка" },
  ],
};

function ItemForm({
  type,
  initial,
  onSave,
  onClose,
  token,
}: {
  type: ItemType;
  initial?: AnyItem;
  onSave: () => void;
  onClose: () => void;
  token: string;
}) {
  const [data, setData] = useState<FormData>(() => {
    const d: FormData = { status: "active" };
    if (initial) {
      Object.entries(initial).forEach(([k, v]) => {
        if (v !== null && v !== undefined) d[k] = String(v);
      });
    }
    return d;
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!data.title?.trim()) return;
    setLoading(true);
    if (initial) {
      await updateItem(type, (initial as AnyItem & { id: number }).id, data, token);
    } else {
      await createItem(type, data, token);
    }
    setLoading(false);
    onSave();
  };

  return (
    <div className="space-y-4">
      {FIELDS[type].map((f) => (
        <div key={f.key}>
          <Label htmlFor={f.key}>{f.label}</Label>
          {f.type === "textarea" ? (
            <Textarea
              id={f.key}
              value={data[f.key] || ""}
              onChange={(e) => set(f.key, e.target.value)}
              className="mt-1"
              rows={3}
            />
          ) : (
            <Input
              id={f.key}
              type={f.type || "text"}
              value={data[f.key] || ""}
              onChange={(e) => set(f.key, e.target.value)}
              className="mt-1"
            />
          )}
        </div>
      ))}
      <div>
        <Label>Статус</Label>
        <Select value={data.status || "active"} onValueChange={(v) => set("status", v)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Активный</SelectItem>
            <SelectItem value="archived">Архивный</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} disabled={loading || !data.title?.trim()}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogFooter>
    </div>
  );
}

function ItemsTable({
  type,
  token,
}: {
  type: ItemType;
  token: string;
}) {
  const [items, setItems] = useState<AnyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<AnyItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchItems(type, token);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [type]);

  const handleDelete = async (id: number) => {
    await deleteItem(type, id, token);
    setDeleteId(null);
    load();
  };

  const getSubtitle = (item: AnyItem) => {
    if (type === "competitions") return (item as Competition).organizer || "";
    if (type === "grants") return (item as Grant).amount || "";
    return (item as Event).event_date || "";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{items.length} записей</p>
        <Button size="sm" onClick={() => { setEditItem(null); setShowForm(true); }}>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Нет записей</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const it = item as AnyItem & { id: number };
            return (
              <div
                key={it.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-white hover:bg-muted/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{it.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{getSubtitle(item)}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={it.status === "active" ? "default" : "secondary"} className="text-xs">
                    {it.status === "active" ? "Активный" : it.status === "deleted" ? "Удалён" : "Архив"}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => { setEditItem(item); setShowForm(true); }}>
                    <Icon name="Pencil" size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(it.id)}>
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Редактировать" : "Добавить запись"}</DialogTitle>
          </DialogHeader>
          {showForm && (
            <ItemForm
              type={type}
              initial={editItem || undefined}
              token={token}
              onSave={() => { setShowForm(false); load(); }}
              onClose={() => setShowForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить запись?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Запись будет скрыта с сайта.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Отмена</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Admin = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") || "");
  const navigate = useNavigate();

  const handleLogin = (t: string) => {
    sessionStorage.setItem("admin_token", t);
    setToken(t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken("");
  };

  if (!token) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-white border-b border-border/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            На сайт
          </Button>
          <span className="font-semibold text-foreground">Панель управления</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <Icon name="LogOut" size={14} className="mr-2" />
          Выйти
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="competitions">
          <TabsList className="mb-6">
            {TABS.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.key} value={t.key}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ItemsTable type={t.key} token={token} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
