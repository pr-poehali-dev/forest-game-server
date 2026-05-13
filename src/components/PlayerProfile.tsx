import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import AchievementsModal from "./AchievementsModal";

interface User {
  id: number;
  username: string;
  email: string;
  rank: string;
  score: number;
  referral_code: string;
}

interface ProfileData {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string;
  rank: string;
  score: number;
  kills: number;
  hours_played: number;
  referral_code: string;
  discord_linked: boolean;
  vk_linked: boolean;
  telegram_linked: boolean;
  youtube_linked: boolean;
  rutube_linked: boolean;
  email_verified: boolean;
  infected_killed: number;
  bots_killed: number;
  flags_placed: number;
  trader_purchases: number;
  black_trader_purchases: number;
  fish_caught: number;
  friends_invited: number;
  created_at: string;
  achievements: { code: string; name: string; icon: string; color: string; unlocked_at: string }[];
}

interface Ticket {
  id: number;
  category: string;
  message: string;
  status: string;
  created_at: string;
}

const RANK_COLORS: Record<string, string> = {
  "Новобранец": "#6ee87a",
  "Выживший": "#4dd9f0",
  "Охотник": "#ff9944",
  "Рейдер": "#cc44ff",
  "Волк": "#ff4422",
};

interface Props {
  token: string;
  user: User;
  onClose: () => void;
  onLogout: () => void;
  profileUrl: string;
  achievementsUrl: string;
}

export default function PlayerProfile({ token, user, onClose, onLogout, profileUrl, achievementsUrl }: Props) {
  const [tab, setTab] = useState<"profile" | "edit" | "tickets" | "social">("profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);

  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [ticketCategory, setTicketCategory] = useState("Технические проблемы");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketSending, setTicketSending] = useState(false);
  const [ticketResult, setTicketResult] = useState("");

  const headers = { "Content-Type": "application/json", "X-Session-Token": token };

  useEffect(() => {
    fetch(profileUrl + "/me", { headers })
      .then((r) => r.json())
      .then((d) => {
        setProfile(d);
        setBio(d.bio || "");
        setAvatarUrl(d.avatar_url || "");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === "tickets") {
      fetch(profileUrl + "/tickets", { headers })
        .then((r) => r.json())
        .then((d) => setTickets(d.tickets || []));
    }
  }, [tab]);

  async function saveProfile() {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch(profileUrl + "/update", {
      method: "PUT",
      headers,
      body: JSON.stringify({ bio, avatar_url: avatarUrl }),
    });
    setSaving(false);
    if (res.ok) {
      setSaveMsg("Сохранено!");
      setProfile((p) => p ? { ...p, bio, avatar_url: avatarUrl } : p);
    } else {
      setSaveMsg("Ошибка сохранения");
    }
    setTimeout(() => setSaveMsg(""), 3000);
  }

  async function sendTicket() {
    if (!ticketMsg.trim()) return;
    setTicketSending(true);
    const res = await fetch(profileUrl + "/ticket", {
      method: "POST",
      headers,
      body: JSON.stringify({ category: ticketCategory, message: ticketMsg }),
    });
    setTicketSending(false);
    if (res.ok) {
      setTicketResult("Тикет отправлен! Ответим в течение 15 минут.");
      setTicketMsg("");
      fetch(profileUrl + "/tickets", { headers })
        .then((r) => r.json())
        .then((d) => setTickets(d.tickets || []));
    } else {
      setTicketResult("Ошибка отправки");
    }
    setTimeout(() => setTicketResult(""), 4000);
  }

  async function linkService(service: string) {
    const res = await fetch(profileUrl + "/link", {
      method: "POST",
      headers,
      body: JSON.stringify({ service }),
    });
    if (res.ok && profile) {
      setProfile({ ...profile, [`${service}_linked`]: true } as ProfileData);
    }
  }

  const rankColor = RANK_COLORS[profile?.rank || user.rank] || "#6ee87a";

  return (
    <>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-3xl card-frost rounded-sm animate-slide-up flex flex-col" style={{ maxHeight: "92vh" }}>

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center gap-4 flex-shrink-0">
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center text-2xl font-glitch flex-shrink-0 border-2"
              style={{ borderColor: rankColor + "88", background: rankColor + "15", color: rankColor }}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover rounded-sm" />
              ) : (
                (profile?.username || user.username)[0].toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-title text-lg text-frost truncate">{profile?.username || user.username}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="rank-badge text-xs" style={{ color: rankColor, borderColor: rankColor }}>
                  {profile?.rank || user.rank}
                </span>
                {profile && (
                  <span className="text-xs text-frost/40 font-title">{profile.score.toLocaleString()} очков</span>
                )}
              </div>
              {profile && (
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-frost/30">
                    <span className="text-ice font-title">{profile.achievements.length}</span> достижений
                  </span>
                  <button
                    onClick={() => setShowAchievements(true)}
                    className="text-xs text-ice/60 hover:text-ice transition-colors underline underline-offset-2"
                  >
                    Показать все
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onLogout}
                className="text-frost/30 hover:text-red-400 transition-colors p-1"
                title="Выйти"
              >
                <Icon name="LogOut" size={16} />
              </button>
              <button onClick={onClose} className="text-frost/40 hover:text-ice transition-colors p-1">
                <Icon name="X" size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/5 flex-shrink-0">
            {([
              { id: "profile", label: "Профиль", icon: "User" },
              { id: "social", label: "Соцсети", icon: "Link" },
              { id: "edit", label: "Редактировать", icon: "Edit3" },
              { id: "tickets", label: "Тикеты", icon: "MessageSquare" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-title uppercase tracking-wider transition-all border-b-2 ${
                  tab === t.id
                    ? "border-ice text-ice"
                    : "border-transparent text-frost/40 hover:text-frost/70"
                }`}
              >
                <Icon name={t.icon} size={13} />
                <span className="hidden sm:block">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading && <div className="text-center py-12 text-frost/40 font-title">Загружаем профиль...</div>}

            {/* PROFILE TAB */}
            {!loading && tab === "profile" && profile && (
              <div className="space-y-6">
                {profile.bio && (
                  <div className="card-frost rounded-sm p-4">
                    <div className="text-xs text-frost/40 font-title uppercase tracking-wider mb-2">О себе</div>
                    <p className="text-sm text-frost/70 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Убийств", val: profile.kills.toLocaleString(), icon: "Crosshair" },
                    { label: "Часов", val: profile.hours_played.toLocaleString(), icon: "Clock" },
                    { label: "Очков", val: profile.score.toLocaleString(), icon: "Star" },
                    { label: "Заражённых", val: profile.infected_killed.toLocaleString(), icon: "Target" },
                  ].map((s) => (
                    <div key={s.label} className="card-frost rounded-sm p-3 text-center">
                      <Icon name={s.icon as string} size={16} className="text-ice/60 mx-auto mb-1" />
                      <div className="font-title text-lg text-ice">{s.val}</div>
                      <div className="text-xs text-frost/40 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Ботов убито", val: profile.bots_killed },
                    { label: "Флагов", val: profile.flags_placed },
                    { label: "Покупок трейдер", val: profile.trader_purchases },
                    { label: "Чёрный рынок", val: profile.black_trader_purchases },
                    { label: "Рыб поймано", val: profile.fish_caught },
                    { label: "Друзей приглашено", val: profile.friends_invited },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-frost/40 font-title">{s.label}</span>
                      <span className="font-title text-sm text-ice">{s.val}</span>
                    </div>
                  ))}
                </div>

                <div className="card-frost rounded-sm p-4">
                  <div className="text-xs text-frost/40 font-title uppercase tracking-wider mb-2">Реферальный код</div>
                  <div className="flex items-center gap-3">
                    <div className="font-title text-xl text-ice tracking-widest">{profile.referral_code}</div>
                    <button
                      className="btn-outline-ice px-3 py-1.5 text-xs rounded-sm"
                      onClick={() => navigator.clipboard.writeText(profile.referral_code)}
                    >
                      Скопировать
                    </button>
                  </div>
                  <div className="text-xs text-frost/30 mt-1">Пригласи друга — оба получат достижения</div>
                </div>

                {profile.achievements.length > 0 && (
                  <div>
                    <div className="text-xs text-frost/40 font-title uppercase tracking-wider mb-3">Последние достижения</div>
                    <div className="flex flex-wrap gap-2">
                      {profile.achievements.slice(0, 8).map((a) => (
                        <div
                          key={a.code}
                          className="flex items-center gap-2 px-3 py-2 rounded-sm border text-xs"
                          style={{ borderColor: a.color + "44", background: a.color + "0a" }}
                          title={a.code}
                        >
                          <Icon name={a.icon as string} size={12} style={{ color: a.color }} fallback="Star" />
                          <span className="font-title text-frost" style={{ color: a.color }}>{a.name}</span>
                        </div>
                      ))}
                      {profile.achievements.length > 8 && (
                        <button
                          onClick={() => setShowAchievements(true)}
                          className="flex items-center gap-1 px-3 py-2 rounded-sm border border-ice/20 text-xs text-ice/60 hover:text-ice transition-colors"
                        >
                          +{profile.achievements.length - 8} ещё
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SOCIAL TAB */}
            {!loading && tab === "social" && profile && (
              <div className="space-y-3">
                <div className="text-xs text-frost/40 font-title uppercase tracking-wider mb-4">
                  Привязывай соцсети и получай достижения
                </div>
                {[
                  { key: "discord", label: "Discord", icon: "MessageSquare", color: "#5865f2", field: "discord_linked" as const },
                  { key: "vk", label: "ВКонтакте", icon: "Globe", color: "#4680c2", field: "vk_linked" as const },
                  { key: "telegram", label: "Telegram", icon: "Send", color: "#27a7e7", field: "telegram_linked" as const },
                  { key: "youtube", label: "YouTube", icon: "Play", color: "#ff0000", field: "youtube_linked" as const },
                  { key: "rutube", label: "Rutube", icon: "Video", color: "#ff6600", field: "rutube_linked" as const },
                  { key: "email", label: "Подтвердить почту", icon: "Mail", color: "#6ee87a", field: "email_verified" as const },
                ].map((s) => {
                  const linked = profile[s.field];
                  return (
                    <div key={s.key} className="card-frost rounded-sm p-4 flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                        style={{ background: s.color + "22" }}
                      >
                        <Icon name={s.icon as string} size={18} style={{ color: s.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-title text-sm text-frost">{s.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: linked ? s.color : "#ffffff40" }}>
                          {linked ? "Привязано — получено достижение" : "Не привязано"}
                        </div>
                      </div>
                      {linked ? (
                        <div className="flex items-center gap-1 text-xs font-title" style={{ color: s.color }}>
                          <Icon name="CheckCircle" size={14} />
                          <span>Готово</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => linkService(s.key)}
                          className="btn-outline-ice px-3 py-1.5 text-xs rounded-sm"
                          style={{ borderColor: s.color + "66", color: s.color }}
                        >
                          Привязать
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* EDIT TAB */}
            {!loading && tab === "edit" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-frost/50 font-title uppercase tracking-wider mb-1.5">URL аватара</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-frost/50 font-title uppercase tracking-wider mb-1.5">
                    О себе <span className="text-frost/30">({bio.length}/300)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Расскажи о себе. Твоя история выживания..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 300))}
                    className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="btn-ice px-6 py-3 text-sm rounded-sm disabled:opacity-50"
                  >
                    {saving ? "Сохраняю..." : "Сохранить"}
                  </button>
                  {saveMsg && (
                    <span className={`text-sm font-title ${saveMsg.includes("Ошибка") ? "text-red-400" : "text-ice"}`}>
                      {saveMsg}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* TICKETS TAB */}
            {!loading && tab === "tickets" && (
              <div className="space-y-6">
                <div className="card-frost rounded-sm p-5 space-y-3">
                  <div className="font-title text-sm text-frost/60 uppercase tracking-wider">Новый тикет</div>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-void border border-ice/20 text-frost/80 font-title text-xs px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50"
                  >
                    <option>Технические проблемы</option>
                    <option>Жалоба на игрока</option>
                    <option>Вопрос по донату</option>
                    <option>Баг-репорт</option>
                    <option>Другое</option>
                  </select>
                  <textarea
                    rows={3}
                    placeholder="Опишите проблему подробно..."
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20 resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={sendTicket}
                      disabled={ticketSending}
                      className="btn-ice px-5 py-2.5 text-sm rounded-sm disabled:opacity-50"
                    >
                      {ticketSending ? "Отправляю..." : "Отправить тикет"}
                    </button>
                    {ticketResult && (
                      <span className={`text-xs font-title ${ticketResult.includes("Ошибка") ? "text-red-400" : "text-ice"}`}>
                        {ticketResult}
                      </span>
                    )}
                  </div>
                </div>

                {tickets.length > 0 && (
                  <div>
                    <div className="text-xs text-frost/40 font-title uppercase tracking-wider mb-3">История тикетов</div>
                    <div className="space-y-2">
                      {tickets.map((t) => (
                        <div key={t.id} className="card-frost rounded-sm p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-title text-xs text-ice">{t.category}</span>
                            <span
                              className="rank-badge text-xs"
                              style={{
                                color: t.status === "open" ? "#ffd700" : "#6ee87a",
                                borderColor: t.status === "open" ? "#ffd700" : "#6ee87a",
                              }}
                            >
                              {t.status === "open" ? "ОТКРЫТ" : "ЗАКРЫТ"}
                            </span>
                          </div>
                          <p className="text-sm text-frost/60 leading-relaxed">{t.message}</p>
                          <div className="text-xs text-frost/20 mt-2 font-title">
                            {new Date(t.created_at).toLocaleString("ru-RU")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAchievements && (
        <AchievementsModal
          onClose={() => setShowAchievements(false)}
          token={token}
          achievementsUrl={achievementsUrl}
        />
      )}
    </>
  );
}
