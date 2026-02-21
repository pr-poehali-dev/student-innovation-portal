import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import func2url from "../../../backend/func2url.json";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const API = func2url["innovations-api"];

interface Props {
  entity: string;
  token: string;
  item: Record<string, unknown> | null;
  onDone: () => void;
  onCancel: () => void;
}

const FIELDS: Record<string, { key: string; label: string; type?: string; tag?: string }[]> = {
  competitions: [
    { key: "title", label: "Название*" },
    { key: "description", label: "Описание", tag: "textarea" },
    { key: "deadline", label: "Дедлайн", type: "date" },
    { key: "prize", label: "Призовой фонд / награда" },
    { key: "organizer", label: "Организатор" },
    { key: "url", label: "Ссылка" },
  ],
  grants: [
    { key: "title", label: "Название*" },
    { key: "description", label: "Описание", tag: "textarea" },
    { key: "deadline", label: "Дедлайн", type: "date" },
    { key: "amount", label: "Сумма гранта" },
    { key: "organizer", label: "Организатор" },
    { key: "url", label: "Ссылка" },
  ],
  events: [
    { key: "title", label: "Название*" },
    { key: "description", label: "Описание", tag: "textarea" },
    { key: "event_date", label: "Дата", type: "date" },
    { key: "event_time", label: "Время (например, 10:00)" },
    { key: "location", label: "Место проведения" },
    { key: "url", label: "Ссылка" },
  ],
};

const ItemForm = ({ entity, token, item, onDone, onCancel }: Props) => {
  const fields = FIELDS[entity] || [];
  const initial: Record<string, string> = {};
  fields.forEach((f) => { initial[f.key] = item ? String(item[f.key] ?? "") : ""; });
  const [form, setForm] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Введите название"); return; }
    setSaving(true);
    setError("");
    const clean: Record<string, string | null> = {};
    fields.forEach((f) => { clean[f.key] = form[f.key].trim() || null; });

    const isEdit = !!item;
    const url = isEdit ? `${API}?entity=${entity}&id=${item!.id}` : `${API}?entity=${entity}`;
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: JSON.stringify(clean),
    });
    setSaving(false);
    if (res.ok) {
      onDone();
    } else {
      const d = await res.json();
      setError(d.error || "Ошибка сохранения");
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon name={item ? "Pencil" : "Plus"} size={18} />
          {item ? "Редактировать запись" : "Новая запись"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1">
              <Label htmlFor={f.key}>{f.label}</Label>
              {f.tag === "textarea" ? (
                <Textarea
                  id={f.key}
                  rows={3}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              ) : (
                <Input
                  id={f.key}
                  type={f.type || "text"}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Сохраняем..." : "Сохранить"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ItemForm;