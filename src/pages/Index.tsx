import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import LandingSections from "@/components/LandingSections";
import AuthModal from "@/components/AuthModal";
import PlayerProfile from "@/components/PlayerProfile";
import AchievementsModal from "@/components/AchievementsModal";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О сервере" },
  { id: "start", label: "Как начать" },
  { id: "stats", label: "Статистика" },
  { id: "rating", label: "Рейтинг" },
  { id: "shop", label: "Магазин" },
  { id: "trading", label: "Трейдинг" },
  { id: "guides", label: "Гайды" },
  { id: "contests", label: "Конкурсы" },
  { id: "promo", label: "Промокоды" },
  { id: "news", label: "Новости" },
  { id: "support", label: "Поддержка" },
  { id: "rules", label: "Правила" },
];

interface User {
  id: number;
  username: string;
  email: string;
  rank: string;
  score: number;
  referral_code: string;
}

const SnowParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 8 + Math.random() * 10,
    size: Math.random() > 0.7 ? 3 : 2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="snow-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const AUTH_URL = "https://functions.poehali.dev/e7e39446-388e-4dbf-a999-2e5cbc03a389";
const PROFILE_URL = "https://functions.poehali.dev/c64188a7-2c3e-4f2c-a745-c20d93b22db9";
const ACHIEVEMENTS_URL = "https://functions.poehali.dev/4793c431-15ea-433c-94dc-b82b8212393b";

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [onlinePlayers] = useState(347);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [token, setToken] = useState<string>(() => localStorage.getItem("lesnye_token") || "");
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("lesnye_user") || "null"); } catch { return null; }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  function handleAuth(newToken: string, newUser: User) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("lesnye_token", newToken);
    localStorage.setItem("lesnye_user", JSON.stringify(newUser));
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("lesnye_token");
    localStorage.removeItem("lesnye_user");
    setShowProfile(false);
  }

  const RANK_COLORS: Record<string, string> = {
    "Новобранец": "#6ee87a",
    "Выживший": "#4dd9f0",
    "Охотник": "#ff9944",
    "Рейдер": "#cc44ff",
    "Волк": "#ff4422",
  };

  return (
    <div className="noise-overlay scanlines min-h-screen bg-void text-frost font-body">
      <SnowParticles />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <button onClick={() => scrollTo("home")} className="font-glitch text-xl text-ice animate-flicker tracking-wider">
            ЛЕСНЫЕ
          </button>

          <div className="hidden xl:flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="online-dot" />
              <span className="font-title text-xs text-ice">{onlinePlayers}</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAchievements(true)}
                  className="hidden sm:flex items-center gap-1.5 btn-outline-ice px-3 py-1.5 text-xs rounded-sm"
                  title="Достижения"
                >
                  <Icon name="Trophy" size={12} />
                  <span>Ачивки</span>
                </button>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 btn-ice px-3 py-1.5 text-xs rounded-sm"
                >
                  <div
                    className="w-5 h-5 rounded-sm flex items-center justify-center text-xs font-glitch"
                    style={{ background: (RANK_COLORS[user.rank] || "#6ee87a") + "33", color: RANK_COLORS[user.rank] || "#6ee87a" }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.username}</span>
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="btn-ice px-4 py-2 text-xs hidden sm:block rounded-sm">
                Войти
              </button>
            )}

            <button className="xl:hidden text-ice" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden bg-panel border-t border-white/5 px-4 py-4 grid grid-cols-3 gap-3">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link text-center py-2">
                {item.label}
              </button>
            ))}
            {!user && (
              <button onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }} className="btn-ice py-2 text-xs rounded-sm col-span-3 mt-1">
                Войти / Регистрация
              </button>
            )}
          </div>
        )}
      </nav>

      <LandingSections
        scrollTo={scrollTo}
        setRef={setRef}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        ticketMsg={ticketMsg}
        setTicketMsg={setTicketMsg}
        onlinePlayers={onlinePlayers}
      />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={handleAuth}
          authUrl={AUTH_URL}
        />
      )}

      {showProfile && user && (
        <PlayerProfile
          token={token}
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
          profileUrl={PROFILE_URL}
          achievementsUrl={ACHIEVEMENTS_URL}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          onClose={() => setShowAchievements(false)}
          token={token}
          achievementsUrl={ACHIEVEMENTS_URL}
        />
      )}
    </div>
  );
}