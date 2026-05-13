import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  unlocked: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  registration: "Регистрация",
  social: "Соцсети",
  invite: "Приглашения",
  playtime: "Время на сервере",
  base: "База",
  infected: "Заражённые",
  bots: "Боты",
  trade: "Торговля",
  fishing: "Рыбалка",
};

interface Props {
  onClose: () => void;
  token: string;
  achievementsUrl: string;
}

export default function AchievementsModal({ onClose, token, achievementsUrl }: Props) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch(achievementsUrl + "/", {
      headers: token ? { "X-Session-Token": token } : {},
    })
      .then((r) => r.json())
      .then((d) => setAchievements(d.achievements || []))
      .finally(() => setLoading(false));
  }, [achievementsUrl, token]);

  const categories = ["all", ...Object.keys(CATEGORY_LABELS)];
  const filtered = activeCategory === "all"
    ? achievements
    : achievements.filter((a) => a.category === activeCategory);

  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl card-frost rounded-sm animate-slide-up flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="font-title text-xl text-frost uppercase tracking-wider">Достижения</div>
            <div className="text-xs text-frost/40 mt-0.5">
              {token ? `${unlocked} / ${total} разблокировано` : "Войди, чтобы видеть свой прогресс"}
            </div>
          </div>
          <button onClick={onClose} className="text-frost/40 hover:text-ice transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {token && total > 0 && (
          <div className="px-6 pt-4 flex-shrink-0">
            <div className="flex items-center justify-between text-xs text-frost/40 mb-1">
              <span>Прогресс</span>
              <span>{Math.round((unlocked / total) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(unlocked / total) * 100}%`, background: "linear-gradient(90deg, #6ee87a, #4dd9f0)" }}
              />
            </div>
          </div>
        )}

        <div className="px-6 pt-4 flex gap-2 flex-wrap flex-shrink-0">
          {categories.map((cat) => {
            const count = cat === "all"
              ? achievements.length
              : achievements.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-title uppercase tracking-wider rounded-sm transition-all ${
                  activeCategory === cat
                    ? "btn-ice"
                    : "border border-ice/20 text-frost/50 hover:border-ice/50 hover:text-ice"
                }`}
              >
                {cat === "all" ? "Все" : CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {loading ? (
            <div className="text-center py-12 text-frost/40 font-title">Загружаем достижения...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-frost/40 font-title">Нет достижений в этой категории</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((ach) => (
                <div
                  key={ach.code}
                  className={`relative rounded-sm p-4 border transition-all ${
                    ach.unlocked
                      ? "border-opacity-40 bg-opacity-20"
                      : "border-white/5 bg-white/2 opacity-50 grayscale"
                  }`}
                  style={ach.unlocked ? {
                    borderColor: ach.color + "55",
                    background: ach.color + "08",
                  } : {}}
                >
                  {ach.unlocked && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: ach.color + "33" }}
                    >
                      <Icon name="Check" size={10} style={{ color: ach.color }} />
                    </div>
                  )}
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center mb-3"
                    style={{ background: ach.color + "22" }}
                  >
                    <Icon name={ach.icon as string} size={18} style={{ color: ach.unlocked ? ach.color : "#666" }} fallback="Star" />
                  </div>
                  <div className="font-title text-sm text-frost mb-0.5">{ach.name}</div>
                  <div className="text-xs text-frost/40 leading-relaxed">{ach.description}</div>
                  {ach.unlocked && (
                    <div className="mt-2">
                      <span className="rank-badge text-xs" style={{ color: ach.color, borderColor: ach.color }}>
                        ПОЛУЧЕНО
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
