import Icon from "@/components/ui/icon";

const RANKS = [
  { name: "Новобранец", color: "#6ee87a", players: 1842 },
  { name: "Выживший", color: "#4dd9f0", players: 634 },
  { name: "Охотник", color: "#ff9944", players: 218 },
  { name: "Рейдер", color: "#cc44ff", players: 87 },
  { name: "Волк", color: "#ff4422", players: 23 },
];

const SHOP_ITEMS = [
  { name: "Стартовый набор", desc: "Базовое снаряжение: аптечки, еда, нож", price: "149₽", tag: "СТАРТ", color: "#6ee87a" },
  { name: "Боец", desc: "Армейский комплект: броник, рюкзак, фляга", price: "399₽", tag: "ПОПУЛЯРНО", color: "#ff9944" },
  { name: "Рейдер", desc: "Штурмовое снаряжение + голосовой приоритет", price: "699₽", tag: "ТОПЧИК", color: "#cc44ff" },
  { name: "Волк", desc: "Максимальный привилегии. Власть над Намальском", price: "1499₽", tag: "ХИТ", color: "#ff4422" },
];

const NEWS = [
  { date: "01 МАЯ 2026", title: "Обновление карты Namalsk", text: "Добавлены новые подземные бункеры и радиационные зоны. Зачисти их — найдёшь военный лут.", tag: "ОБНОВЛЕНИЕ" },
  { date: "28 АПР 2026", title: "Ивент: Последний выживший", text: "Финальная зона сужается. Кто останется в живых — получит эксклюзивный скин и привилегии.", tag: "ИВЕНТ" },
  { date: "20 АПР 2026", title: "Трейдер открыл новый ассортимент", text: "На торговой базе появилось оружие калибра .308 и тактические прицелы. Запасы ограничены.", tag: "АКЦИЯ" },
];

const GUIDES = [
  { icon: "Zap", title: "Первые 30 минут", desc: "Спаун на Намальске — куда бежать", time: "5 мин" },
  { icon: "Home", title: "Строительство базы", desc: "Кодовые замки, стены, тайники", time: "8 мин" },
  { icon: "ArrowUpDown", title: "Трейдинг с нуля", desc: "Как работает торговец на сервере", time: "6 мин" },
  { icon: "Trophy", title: "Лучший лут на карте", desc: "Топ-5 мест для фарма снаряжения", time: "7 мин" },
  { icon: "Crosshair", title: "ПвП тактики", desc: "Позиционирование и засады", time: "10 мин" },
  { icon: "Package", title: "Крафт и медицина", desc: "Лечение, шины, кровь — всё о выживании", time: "4 мин" },
];

const TRADE_ITEMS = [
  { from: "AKM + магазины", fromAmt: "1 шт + 4 маг", to: "Рейдовый рюкзак", seller: "Ghost_Raven", online: true },
  { from: "Тушёнка x10", fromAmt: "10 банок", to: "Армейская аптечка", seller: "Frost_Walker", online: false },
  { from: "M4A1 (чистая)", fromAmt: "1 шт", to: "5500 монет", seller: "IceWolf99", online: true },
  { from: "Армейская броня", fromAmt: "1 шт", to: "Снайперский прицел x8", seller: "SilentHunter", online: true },
];

interface Props {
  scrollTo: (id: string) => void;
  setRef: (id: string) => (el: HTMLElement | null) => void;
  promoCode: string;
  setPromoCode: (v: string) => void;
  ticketMsg: string;
  setTicketMsg: (v: string) => void;
  onlinePlayers: number;
}

export default function LandingSections({ scrollTo, setRef, promoCode, setPromoCode, ticketMsg, setTicketMsg, onlinePlayers }: Props) {
  return (
    <>
      {/* HERO */}
      <section id="home" ref={setRef("home")} className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#061008] via-void to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-void/80" />
        <div className="relative z-20 px-4 max-w-4xl mx-auto">
          <p className="font-title text-xs tracking-[0.5em] text-ice/70 mb-4 uppercase">— DayZ Standalone · CHERNO—

</p>
          <h1 className="font-glitch text-7xl sm:text-9xl text-ice glow-ice-text animate-flicker mb-2">ЛЕСНЫЕ</h1>
          <p className="font-title text-2xl sm:text-3xl text-frost/80 tracking-widest uppercase mb-8">Выжить любой ценой</p>
          <p className="font-body text-sm text-frost/50 italic mb-10 max-w-xl mx-auto leading-relaxed">
            Намальск. Вечная мерзлота. Радиация. Бандиты. Ты один — и только твои решения определят, выживешь ли ты до рассвета.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo("start")} className="btn-ice px-8 py-4 text-sm rounded-sm glow-ice">Начать играть</button>
            <button onClick={() => scrollTo("about")} className="btn-outline-ice px-8 py-4 text-sm rounded-sm">О сервере</button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[["1 200+", "Игроков"], [String(onlinePlayers), "Онлайн"], ["2 года", "Работает"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-title text-2xl text-ice">{val}</div>
                <div className="font-body text-xs text-frost/40 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <Icon name="ChevronDown" size={20} className="text-ice/40" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={setRef("about")} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">О нас</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">О сервере</h2>
            <div className="section-line" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-frost/70 leading-relaxed">
                <span className="text-ice font-title text-lg">ЛЕСНЫЕ</span> — русскоязычный DayZ сервер на карте Namalsk 1.29.
                Суровый климат, военные базы, рейды и живой рынок трейдера. Здесь нет случайных побед.
              </p>
              <p className="text-frost/50 leading-relaxed text-sm">
                Намальск — самая жёсткая карта в DayZ. Мороз убивает быстрее бандитов. Радиационные зоны
                скрывают лучший лут. Каждый рейд может стать последним.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: "Snowflake", label: "Карта Namalsk", desc: "Версия 1.29" },
                  { icon: "Shield", label: "Защита базы", desc: "Кодовые замки" },
                  { icon: "Crosshair", label: "ПвП зоны", desc: "Честный бой" },
                  { icon: "BarChart2", label: "Трейдер", desc: "Живой рынок" },
                ].map((f) => (
                  <div key={f.label} className="card-frost p-4 rounded-sm">
                    <Icon name={f.icon as string} size={18} className="text-ice mb-2" />
                    <div className="font-title text-sm text-frost">{f.label}</div>
                    <div className="text-xs text-frost/40 mt-0.5">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-frost rounded-sm p-6 space-y-4">
              <div className="font-title text-xs tracking-widest text-ice/60 uppercase">Версия сервера</div>
              <div className="font-title text-3xl text-frost">DayZ 1.29</div>
              {[["IP адрес", "109.248.4.9:2398"], ["Режим", "PvP / Выживание"], ["Карта", "Namalsk"], ["Слотов", "60"]].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-frost/40 uppercase tracking-wider font-title">{k}</span>
                  <span className="text-sm text-ice font-title">{v}</span>
                </div>
              ))}
              <button
                className="w-full btn-ice py-3 text-sm rounded-sm mt-2"
                onClick={() => { navigator.clipboard.writeText("109.248.4.9:2398"); }}
              >
                Скопировать IP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO START */}
      <section id="start" ref={setRef("start")} className="py-24 px-4 bg-gradient-to-b from-transparent via-[#0a1018]/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Инструкция</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Как начать играть</h2>
            <div className="section-line" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: "01", icon: "Download", title: "Установи DayZ", desc: "Версия 1.29 через Steam" },
              { n: "02", icon: "Package", title: "Установи моды", desc: "Подписаться в Steam Workshop" },
              { n: "03", icon: "Server", title: "Найди сервер", desc: "IP: 109.248.4.9:2398" },
              { n: "04", icon: "Zap", title: "В бой!", desc: "Намальск ждёт. Выживи." },
            ].map((step) => (
              <div key={step.n} className="card-frost rounded-sm p-6 flex flex-col">
                <div className="font-glitch text-4xl text-ice/20 mb-3">{step.n}</div>
                <Icon name={step.icon as string} size={24} className="text-ice mb-3" />
                <div className="font-title text-base text-frost mb-2">{step.title}</div>
                <div className="text-xs text-frost/50 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 card-frost rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-title text-lg text-ice mb-1">Нужна помощь с входом?</div>
              <div className="text-sm text-frost/50">Наши модераторы помогут за 5 минут</div>
            </div>
            <button onClick={() => scrollTo("support")} className="btn-outline-ice px-6 py-3 text-sm rounded-sm whitespace-nowrap">
              Написать в поддержку
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" ref={setRef("stats")} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Аналитика</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Статистика</h2>
            <div className="section-line" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { val: "1 243", label: "Игроков всего", icon: "Users" },
              { val: String(onlinePlayers), label: "Онлайн сейчас", icon: "Wifi" },
              { val: "2.4М", label: "Убийств", icon: "Sword" },
              { val: "89К", label: "Сделок", icon: "ArrowUpDown" },
            ].map((s) => (
              <div key={s.label} className="card-frost rounded-sm p-5">
                <Icon name={s.icon as string} size={18} className="text-ice/60 mb-3" />
                <div className="font-title text-2xl text-ice mb-1">{s.val}</div>
                <div className="text-xs text-frost/40 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card-frost rounded-sm p-6">
            <div className="font-title text-sm text-frost/60 uppercase tracking-wider mb-6">Онлайн за 7 дней</div>
            <div className="flex items-end gap-2 h-24">
              {[280, 320, 347, 290, 415, 380, 347].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${(v / 450) * 100}%`,
                    background: i === 6 ? "linear-gradient(to top, #4ad16a, #1a6e35)" : "rgba(74,209,106,0.2)",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                <div key={d} className="flex-1 text-center text-xs text-frost/30 font-title">{d}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RATING */}
      <section id="rating" ref={setRef("rating")} className="py-24 px-4 bg-gradient-to-b from-transparent via-[#0a1018]/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Таблица лидеров</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Рейтинг</h2>
            <div className="section-line" />
          </div>
          <div className="space-y-3 mb-10">
            {[
              { pos: 1, name: "IceWolf99", rank: "Волк", kills: 12400, score: 98540, rankColor: "#ff4422" },
              { pos: 2, name: "Ghost_Raven", rank: "Рейдер", kills: 9800, score: 87320, rankColor: "#cc44ff" },
              { pos: 3, name: "Frost_Walker", rank: "Рейдер", kills: 8100, score: 74890, rankColor: "#cc44ff" },
              { pos: 4, name: "SilentHunter", rank: "Охотник", kills: 6300, score: 61200, rankColor: "#ff9944" },
              { pos: 5, name: "NightWolf_X", rank: "Охотник", kills: 5900, score: 58700, rankColor: "#ff9944" },
              { pos: 6, name: "Snowdrift", rank: "Выживший", kills: 4100, score: 41300, rankColor: "#4dd9f0" },
              { pos: 7, name: "ColdStrike", rank: "Выживший", kills: 3700, score: 37800, rankColor: "#4dd9f0" },
            ].map((p) => (
              <div key={p.pos} className="card-frost rounded-sm p-4 flex items-center gap-4">
                <div className="font-title text-base w-8 text-center" style={{ color: p.pos === 1 ? "#ffd700" : p.pos === 2 ? "#c0c0c0" : p.pos === 3 ? "#cd7f32" : "#6ee87a" }}>
                  {p.pos <= 3 ? ["🥇","🥈","🥉"][p.pos - 1] : `#${p.pos}`}
                </div>
                <div className="flex-1">
                  <div className="font-title text-sm text-frost">{p.name}</div>
                  <span className="rank-badge text-xs" style={{ color: p.rankColor, borderColor: p.rankColor }}>{p.rank}</span>
                </div>
                <div className="text-right">
                  <div className="font-title text-sm text-ice">{p.score.toLocaleString()}</div>
                  <div className="text-xs text-frost/40">{p.kills.toLocaleString()} убийств</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {RANKS.map((r) => (
              <div key={r.name} className="card-frost rounded-sm p-3 text-center">
                <div className="font-title text-sm mb-1" style={{ color: r.color }}>{r.name}</div>
                <div className="text-xs text-frost/40">{r.players.toLocaleString()} игр.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" ref={setRef("shop")} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Донат</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Магазин</h2>
            <div className="section-line" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOP_ITEMS.map((item) => (
              <div key={item.name} className="card-frost rounded-sm overflow-hidden flex flex-col">
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
                <div className="p-5 flex-1 flex flex-col">
                  <span className="rank-badge text-xs mb-3" style={{ color: item.color, borderColor: item.color }}>{item.tag}</span>
                  <div className="font-title text-base text-frost mb-2">{item.name}</div>
                  <div className="text-xs text-frost/50 leading-relaxed flex-1">{item.desc}</div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="font-title text-lg" style={{ color: item.color }}>{item.price}</span>
                    <button className="px-4 py-2 text-xs rounded-sm font-title font-semibold tracking-wider" style={{ background: item.color, color: "#06090f" }}>
                      Купить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 card-frost rounded-sm p-5 flex flex-col sm:flex-row items-center gap-4">
            <Icon name="CreditCard" size={24} className="text-ice flex-shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <div className="font-title text-sm text-frost">Автоматический донат</div>
              <div className="text-xs text-frost/50 mt-0.5">Оплата картой, SBP, криптой. Зачисление за 5 секунд.</div>
            </div>
            <button className="btn-ice px-6 py-2.5 text-xs rounded-sm whitespace-nowrap">Перейти в магазин</button>
          </div>
        </div>
      </section>

      {/* TRADING */}
      <section id="trading" ref={setRef("trading")} className="py-24 px-4 bg-gradient-to-b from-transparent via-[#0a1018]/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Рынок</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Трейдинг</h2>
            <div className="section-line" />
          </div>
          <div className="card-frost rounded-sm overflow-hidden">
            <div className="border-b border-white/5 p-4 flex items-center justify-between">
              <div className="font-title text-sm text-frost/60 uppercase tracking-wider">Активные лоты</div>
              <button className="btn-ice px-4 py-1.5 text-xs rounded-sm">+ Выставить лот</button>
            </div>
            <div className="divide-y divide-white/5">
              {TRADE_ITEMS.map((trade, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="online-dot" style={{ opacity: trade.online ? 1 : 0.3, background: trade.online ? "#6ee87a" : "#666" }} />
                      <span className="font-title text-xs text-frost/50">{trade.seller}</span>
                    </div>
                    <div className="font-title text-sm text-frost">{trade.from}</div>
                    <div className="text-xs text-frost/40">{trade.fromAmt}</div>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-ice/40" />
                  <div className="text-right">
                    <div className="font-title text-sm text-ice">{trade.to}</div>
                    <div className="text-xs text-frost/30">обмен</div>
                  </div>
                  <button className="btn-outline-ice px-3 py-1.5 text-xs rounded-sm ml-2">Сделка</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section id="guides" ref={setRef("guides")} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">База знаний</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Гайды</h2>
            <div className="section-line" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.map((g) => (
              <div key={g.title} className="card-frost rounded-sm p-5 group cursor-pointer flex gap-4">
                <div className="w-10 h-10 rounded-sm bg-ice/10 flex items-center justify-center flex-shrink-0 group-hover:bg-ice/20 transition-colors">
                  <Icon name={g.icon as string} size={18} className="text-ice" />
                </div>
                <div>
                  <div className="font-title text-sm text-frost mb-1">{g.title}</div>
                  <div className="text-xs text-frost/50 mb-2">{g.desc}</div>
                  <div className="flex items-center gap-1 text-xs text-ice/50">
                    <Icon name="Clock" size={10} />
                    <span>{g.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTESTS */}
      <section id="contests" ref={setRef("contests")} className="py-24 px-4 bg-gradient-to-b from-transparent via-[#0a1018]/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">События</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Конкурсы</h2>
            <div className="section-line" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Последний выживший", dates: "15–20 МАЯ 2026", prize: "Пакет «Волк» + 10 000 монет", desc: "60 игроков на одной карте. Зона сужается. Победит один.", color: "#ff4422", active: true },
              { title: "Лучшая база месяца", dates: "01–31 МАЯ 2026", prize: "VIP статус на 6 месяцев", desc: "Самая укреплённая и креативная база по итогам голосования.", color: "#cc44ff", active: true },
              { title: "Охота на трейдера", dates: "Каждую субботу", prize: "Редкое военное снаряжение", desc: "Найди секретного трейдера на Намальске раньше других — забери весь лут.", color: "#6ee87a", active: false },
            ].map((c) => (
              <div key={c.title} className="card-frost rounded-sm overflow-hidden">
                <div className="h-1" style={{ background: c.color }} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-title text-lg text-frost">{c.title}</div>
                      <div className="text-xs text-frost/40 mt-0.5">{c.dates}</div>
                    </div>
                    {c.active && (
                      <span className="rank-badge text-xs animate-pulse-ice" style={{ color: c.color, borderColor: c.color }}>АКТИВНО</span>
                    )}
                  </div>
                  <p className="text-sm text-frost/60 leading-relaxed mb-4">{c.desc}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="Trophy" size={14} className="text-ice" />
                    <span className="text-sm font-title" style={{ color: c.color }}>{c.prize}</span>
                  </div>
                  <button className="btn-outline-ice px-5 py-2 text-xs rounded-sm w-full">Участвовать</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section id="promo" ref={setRef("promo")} className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Бонусы</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Промокоды</h2>
            <div className="section-line" />
          </div>
          <div className="card-frost rounded-sm p-8 text-center">
            <Icon name="Tag" size={36} className="text-ice mx-auto mb-4" />
            <p className="text-frost/60 mb-6 text-sm">Введи промокод и получи бонусы — монеты, ресурсы или временный VIP</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="text"
                placeholder="ЗИМА2026"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 bg-void border border-ice/20 text-frost font-title text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20 tracking-widest uppercase"
              />
              <button className="btn-ice px-6 py-3 text-sm rounded-sm whitespace-nowrap">Активировать</button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[["НОВИЧОК", "+500 монет"], ["ЗИМА", "+Крио-сет"], ["ЛЕСНЫЕ2026", "+VIP 3 дня"]].map(([code, bonus]) => (
                <div key={code} className="border border-ice/10 rounded-sm p-3">
                  <div className="font-title text-xs text-ice tracking-widest">{code}</div>
                  <div className="text-xs text-frost/40 mt-1">{bonus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" ref={setRef("news")} className="py-24 px-4 bg-gradient-to-b from-transparent via-[#0a1018]/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Обновления</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Новости</h2>
            <div className="section-line" />
          </div>
          <div className="space-y-4">
            {NEWS.map((n) => (
              <div key={n.title} className="card-frost rounded-sm p-6 flex gap-6">
                <div className="flex-shrink-0">
                  <div className="font-title text-xs text-ice/60 whitespace-nowrap">{n.date}</div>
                </div>
                <div className="w-px bg-ice/10 self-stretch" />
                <div>
                  <span className="rank-badge text-ice text-xs mb-2 inline-block">{n.tag}</span>
                  <div className="font-title text-base text-frost mb-2">{n.title}</div>
                  <div className="text-sm text-frost/50 leading-relaxed">{n.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" ref={setRef("support")} className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Помощь</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Поддержка</h2>
            <div className="section-line" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="font-title text-sm text-frost/60 uppercase tracking-wider mb-2">Быстрая помощь</div>
              {[
                { icon: "MessageSquare", label: "Discord сервер", desc: "Общение и помощь", action: "Открыть" },
                { icon: "Send", label: "Telegram", desc: "Новости и анонсы", action: "Открыть" },
                { icon: "Globe", label: "VK группа", desc: "Сообщество ВКонтакте", action: "Открыть" },
              ].map((c) => (
                <div key={c.label} className="card-frost rounded-sm p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-ice/10 rounded-sm flex items-center justify-center">
                    <Icon name={c.icon as string} size={18} className="text-ice" />
                  </div>
                  <div className="flex-1">
                    <div className="font-title text-sm text-frost">{c.label}</div>
                    <div className="text-xs text-frost/40">{c.desc}</div>
                  </div>
                  <button className="btn-outline-ice px-3 py-1.5 text-xs rounded-sm">{c.action}</button>
                </div>
              ))}
            </div>
            <div className="card-frost rounded-sm p-6">
              <div className="font-title text-sm text-frost/60 uppercase tracking-wider mb-4">Создать тикет</div>
              <div className="space-y-3">
                <select className="w-full bg-void border border-ice/20 text-frost/80 font-title text-xs px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50">
                  <option>Технические проблемы</option>
                  <option>Жалоба на игрока</option>
                  <option>Вопрос по донату</option>
                  <option>Баг-репорт</option>
                  <option>Другое</option>
                </select>
                <input type="text" placeholder="Ваш никнейм" className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20" />
                <textarea
                  rows={4}
                  placeholder="Опишите проблему подробно..."
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  className="w-full bg-void border border-ice/20 text-frost font-body text-sm px-3 py-3 rounded-sm focus:outline-none focus:border-ice/50 placeholder:text-frost/20 resize-none"
                />
                <button className="w-full btn-ice py-3 text-sm rounded-sm">Отправить тикет</button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-frost/30">
                <Icon name="Clock" size={12} />
                <span>Среднее время ответа: 15 минут</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section id="rules" ref={setRef("rules")} className="py-24 px-4 bg-gradient-to-b from-transparent via-[#0a1018]/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="font-title text-xs tracking-[0.4em] text-ice/50 uppercase mb-3">Устав</p>
            <h2 className="font-title text-4xl sm:text-5xl text-frost uppercase mb-3">Правила</h2>
            <div className="section-line" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { n: "§1", title: "Уважение", text: "Запрещены оскорбления, дискриминация и токсичность в голосовом чате и Discord." },
              { n: "§2", title: "Читы и хаки", text: "ESP, aimbot, speed hack — перманентный бан без предупреждения." },
              { n: "§3", title: "Глитчи", text: "Использование багов игры, стройка в камнях, дюп предметов — бан." },
              { n: "§4", title: "Баги — в поддержку", text: "Нашёл эксплойт — сообщи. Использовал — получил бан." },
              { n: "§5", title: "Реклама", text: "Реклама других серверов в любом чате — немедленный бан." },
              { n: "§6", title: "Аккаунты", text: "Один Steam аккаунт — один игрок. Мультиаккаунты блокируются." },
            ].map((rule) => (
              <div key={rule.n} className="card-frost rounded-sm p-5 flex gap-4">
                <div className="font-glitch text-2xl text-ice/30 flex-shrink-0 w-8">{rule.n}</div>
                <div>
                  <div className="font-title text-sm text-frost mb-1">{rule.title}</div>
                  <div className="text-xs text-frost/50 leading-relaxed">{rule.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="font-glitch text-2xl text-ice mb-3 animate-flicker">ЛЕСНЫЕ</div>
              <div className="text-xs text-frost/30 leading-relaxed">DayZ Standalone сервер.<br />Namalsk 1.29 · PvP / Выживание</div>
              <div className="mt-3 font-title text-xs text-ice/50">109.248.4.9:2398</div>
            </div>
            {[
              { title: "Сервер", links: [["О сервере","about"],["Как начать","start"],["Правила","rules"],["Новости","news"]] },
              { title: "Игроки", links: [["Статистика","stats"],["Рейтинг","rating"],["Трейдинг","trading"],["Профиль","home"]] },
              { title: "Помощь", links: [["Гайды","guides"],["Поддержка","support"],["Промокоды","promo"],["Конкурсы","contests"]] },
            ].map((col) => (
              <div key={col.title}>
                <div className="font-title text-xs tracking-widest text-frost/40 uppercase mb-4">{col.title}</div>
                <div className="space-y-2">
                  {col.links.map(([label, id]) => (
                    <button key={label} onClick={() => scrollTo(id)} className="block text-xs text-frost/50 hover:text-ice transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-title text-xs text-frost/20 tracking-wider">© 2024–2026 ЛЕСНЫЕ. DayZ Standalone сервер.</div>
            <div className="font-title text-xs text-ice/30 tracking-widest">109.248.4.9:2398</div>
          </div>
        </div>
      </footer>
    </>
  );
}