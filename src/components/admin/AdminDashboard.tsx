import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ItemsTable from "@/components/admin/ItemsTable";
import ItemForm from "@/components/admin/ItemForm";

type Tab = "competitions" | "grants" | "events";
type Mode = "list" | "add" | "edit";

interface Props {
  token: string;
  onLogout: () => void;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "competitions", label: "Конкурсы", icon: "Trophy" },
  { id: "grants", label: "Гранты", icon: "Banknote" },
  { id: "events", label: "Мероприятия", icon: "CalendarDays" },
];

const AdminDashboard = ({ token, onLogout }: Props) => {
  const [tab, setTab] = useState<Tab>("competitions");
  const [mode, setMode] = useState<Mode>("list");
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [refresh, setRefresh] = useState(0);

  const handleEdit = (item: Record<string, unknown>) => {
    setEditItem(item);
    setMode("edit");
  };

  const handleDone = () => {
    setMode("list");
    setEditItem(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="Lightbulb" size={20} className="text-accent" />
          <span className="font-bold">Панель управления · Портал инноваций</span>
        </div>
        <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10" onClick={onLogout}>
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти
        </Button>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <Button
              key={t.id}
              variant={tab === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => { setTab(t.id); setMode("list"); setEditItem(null); }}
            >
              <Icon name={t.icon} size={15} className="mr-2" />
              {t.label}
            </Button>
          ))}
        </div>

        {mode === "list" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-foreground">
                {TABS.find((t) => t.id === tab)?.label}
              </h2>
              <Button size="sm" onClick={() => setMode("add")}>
                <Icon name="Plus" size={15} className="mr-2" />
                Добавить
              </Button>
            </div>
            <ItemsTable entity={tab} token={token} onEdit={handleEdit} onRefresh={handleDone} key={`${tab}-${refresh}`} />
          </>
        )}

        {(mode === "add" || mode === "edit") && (
          <ItemForm
            entity={tab}
            token={token}
            item={editItem}
            onDone={handleDone}
            onCancel={() => { setMode("list"); setEditItem(null); }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
