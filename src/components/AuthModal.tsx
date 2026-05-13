import { useState } from "react";
import Icon from "@/components/ui/icon";

interface User {
  id: number;
  username: string;
  email: string;
  rank: string;
  score: number;
  referral_code: string;
}

interface Props {
  onClose: () => void;
  onAuth: (token: string, user: User) => void;
  authUrl: string;
}

export default function AuthModal({ onClose, onAuth, authUrl }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "register" ? "/register" : "/login";
      const body = mode === "register"
        ? { username, email, password, referral_code: referral }
        : { login: username || email, password };

      const res = await fetch(authUrl + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка");
      } else {
        onAuth(data.token, data.user);
        onClose();
      }
    } catch {
      setError("Ошибка сети. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md card-frost rounded-sm p-8 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-frost/40 hover:text-ice transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="mb-8">
          <div className="font-glitch text-3xl text-ice animate-flicker mb-1">ЛЕСНЫЕ</div>
          <div className="font-title text-sm text-frost/50 uppercase tracking-widest">
            {mode === "login" ? "Вход в систему" : "Регистрация выжившего"}
          </div>
          <div className="section-line mt-3" />
        </div>

        <div className="flex gap-2 mb-6">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2.5 text-xs font-title uppercase tracking-wider rounded-sm transition-all ${
                mode === m ? "btn-ice" : "btn-outline-ice"
              }`}
            >
              {m === "login" ? "Войти" : "Регистрация"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-xs text-frost/50 font-title uppercase tracking-wider mb-1.5">Никнейм</label>
              <input
                type="text"
                placeholder="IceWolf99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-frost/50 font-title uppercase tracking-wider mb-1.5">
              {mode === "register" ? "Email" : "Никнейм или Email"}
            </label>
            <input
              type={mode === "register" ? "email" : "text"}
              placeholder={mode === "register" ? "player@mail.ru" : "Никнейм или email"}
              value={mode === "register" ? email : (username || email)}
              onChange={(e) => mode === "register" ? setEmail(e.target.value) : setUsername(e.target.value)}
              className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-frost/50 font-title uppercase tracking-wider mb-1.5">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs text-frost/50 font-title uppercase tracking-wider mb-1.5">
                Реферальный код <span className="text-frost/30">(необязательно)</span>
              </label>
              <input
                type="text"
                placeholder="ABCD1234"
                value={referral}
                onChange={(e) => setReferral(e.target.value.toUpperCase())}
                className="w-full bg-void border border-ice/20 text-frost font-title text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20 tracking-widest uppercase"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-sm px-3 py-2">
              <Icon name="AlertCircle" size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-ice py-3.5 text-sm rounded-sm mt-2 disabled:opacity-50"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти на сервер" : "Зарегистрироваться"}
          </button>
        </form>

        {mode === "register" && (
          <p className="mt-4 text-xs text-frost/30 text-center leading-relaxed">
            Регистрируясь, ты получаешь достижение «Первый шаг в ад» 🎖
          </p>
        )}
      </div>
    </div>
  );
}
