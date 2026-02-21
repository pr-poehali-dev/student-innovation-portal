import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import func2url from "../../../backend/func2url.json";
import Icon from "@/components/ui/icon";

const API = func2url["innovations-api"];

interface Props {
  entity: string;
  token: string;
  onEdit: (item: Record<string, unknown>) => void;
  onRefresh: () => void;
}

const ItemsTable = ({ entity, token, onEdit, onRefresh }: Props) => {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}?entity=${entity}&status=all`, { headers: { "X-Admin-Token": token } })
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, [entity, token]);

  const handleDelete = async (id: unknown) => {
    if (!confirm("Удалить запись?")) return;
    await fetch(`${API}?entity=${entity}&id=${id}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": token },
    });
    onRefresh();
  };

  if (loading) return <p className="text-muted-foreground text-sm py-8 text-center">Загрузка...</p>;
  if (!items.length) return <p className="text-muted-foreground text-sm py-8 text-center">Записей пока нет</p>;

  const getDate = (item: Record<string, unknown>) =>
    (item.deadline || item.event_date) as string | undefined;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id as string} className="bg-white rounded-lg border border-border/60 p-4 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground truncate">{item.title as string}</span>
              {item.status === "deleted" && <Badge variant="destructive" className="text-xs">удалено</Badge>}
              {item.status === "active" && <Badge variant="secondary" className="text-xs">активно</Badge>}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex gap-3 flex-wrap">
              {getDate(item) && <span>Дедлайн: {getDate(item)}</span>}
              {item.organizer && <span>{item.organizer as string}</span>}
              {item.amount && <span>{item.amount as string}</span>}
              {item.location && <span>{item.location as string}</span>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
              <Icon name="Pencil" size={13} className="mr-1" />
              Изменить
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
              <Icon name="Trash2" size={13} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsTable;