import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "it" | "en";

export const dict = {
  it: {
    meta: { title: "PEAQ — Coming Soon · Running & Cycling", description: "PEAQ è il nuovo ecosistema digitale per le gare di running e ciclismo. Identità, classifiche cittadine, performance. Unisciti alla lista d'attesa." },
    nav: { concept: "Concept", features: "Funzioni", events: "Eventi", cta: "Unisciti alla lista", menu: "Apri menu", close: "Chiudi menu", lang: "Cambia lingua" },
    status: "Coming Soon",
    hero: { l1: "Non è solo", l2: "una gara.", l3: "È la tua", l4: "prossima vetta.", sub: "Running e ciclismo competitivo. Un nuovo ecosistema digitale sta arrivando.", cta: "Unisciti alla lista", scroll: "Scorri" },
    disc: { eyebrow: "01 — Discipline", title: ["Due discipline.", "Una sola ambizione."], text: "Corri. Pedala. Supera i tuoi limiti. Un nuovo modo di vivere la competizione sta arrivando.", run: "Running", ride: "Cycling", runMeta: ["Passo", "Cadenza", "Dislivello"], rideMeta: ["Watt", "Velocità", "Pendenza"] },
    bib: { eyebrow: "02 — Athlete ID", title: ["Ogni atleta ha un numero.", "Ogni numero ha una storia."], text: "Il tuo pettorale digitale. La tua identità. Il tuo percorso.", preview: "Anteprima", athlete: "Atleta", city: "Città", discipline: "Disciplina", since: "Membro dal", note: "Profili di esempio fittizi. Il codice è solo grafico.", next: "Profilo successivo" },
    rank: { eyebrow: "03 — Classifiche", title: ["La tua città.", "La tua classifica."], preview: "Anteprima prodotto · dati fittizi", running: "Running", cycling: "Cycling", pos: "Pos", name: "Atleta", bib: "Pett.", pts: "Punti" },
    stats: { eyebrow: "04 — Performance", title: "Ogni metro conta.", text: "Ogni gara, ogni risultato, ogni progresso. Tutto parte del tuo percorso.", races: "Gare completate", run: "Km di corsa", ride: "Km in bici", progress: "Progressione del rating", history: "Ultimi risultati", milestone: "Traguardo", milestoneText: "Prima mezza maratona sotto 1:40", preview: "Funzionalità pianificata · dati di esempio", months: ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"] },
    events: { eyebrow: "05 — Eventi", title: ["La prossima sfida", "inizia qui."], concept: "Concept", note: "Concept di esempio. Nessun evento è ancora annunciato.", drag: "Trascina", prev: "Precedente", next: "Successivo", list: [
      { t: "PEAQ City Run", d: "Running", l: "Milano", k: "10 KM" },
      { t: "PEAQ Road Challenge", d: "Cycling", l: "Toscana", k: "120 KM" },
      { t: "PEAQ Night Run", d: "Running", l: "Roma", k: "21 KM" },
      { t: "PEAQ Climb", d: "Cycling", l: "Dolomiti", k: "1.800 M D+" },
    ] },
    app: { eyebrow: "06 — App", title: ["Un nuovo modo di competere.", "Presto nelle tue mani."], screens: ["Profilo", "Pettorale", "Classifica", "Statistiche", "Eventi"], preview: "Concept interfaccia" },
    final: { title: ["Il prossimo traguardo", "è solo l'inizio."], form: { email: "Il tuo indirizzo email", interest: "Disciplina (facoltativo)", running: "Running", cycling: "Cycling", both: "Entrambe", consent: "Acconsento a ricevere comunicazioni su PEAQ e al trattamento della mia email per la lista d'attesa.", submit: "Entra nella lista d'attesa", sending: "Invio…", ok: "Sei nella lista. Ti scriveremo al lancio di PEAQ.", dup: "Questa email è già nella lista d'attesa.", errEmail: "Inserisci un indirizzo email valido.", errConsent: "Serve il tuo consenso per procedere.", err: "Qualcosa è andato storto. Riprova tra poco.", privacy: "Usiamo la tua email solo per aggiornarti su PEAQ. Puoi chiedere la cancellazione in qualsiasi momento." } },
    footer: { privacy: "Privacy Policy", contact: "Contatti", rights: "Tutti i diritti riservati.", privacyText: "Raccogliamo solo l'email e la disciplina facoltativa per gestire la lista d'attesa di PEAQ. Non condividiamo i dati con terzi. Per accesso o cancellazione scrivici dalla pagina contatti." },
    loader: "Caricamento",
  },
  en: {
    meta: { title: "PEAQ — Coming Soon · Running & Cycling", description: "PEAQ is the new digital ecosystem for running and cycling competitions. Identity, city rankings, performance. Join the waitlist." },
    nav: { concept: "Concept", features: "Features", events: "Events", cta: "Join the waitlist", menu: "Open menu", close: "Close menu", lang: "Change language" },
    status: "Coming Soon",
    hero: { l1: "It's more", l2: "than a race.", l3: "It's your", l4: "next peak.", sub: "Competitive running and cycling. A new digital ecosystem is coming.", cta: "Join the waitlist", scroll: "Scroll" },
    disc: { eyebrow: "01 — Disciplines", title: ["Two disciplines.", "One ambition."], text: "Run. Ride. Push beyond your limits. A new way to experience competition is coming.", run: "Running", ride: "Cycling", runMeta: ["Pace", "Cadence", "Elevation"], rideMeta: ["Watts", "Speed", "Gradient"] },
    bib: { eyebrow: "02 — Athlete ID", title: ["Every athlete has a number.", "Every number has a story."], text: "Your digital race bib. Your identity. Your journey.", preview: "Preview", athlete: "Athlete", city: "City", discipline: "Discipline", since: "Member since", note: "Fictional example profiles. The code is graphic only.", next: "Next profile" },
    rank: { eyebrow: "03 — Rankings", title: ["Your city.", "Your ranking."], preview: "Product preview · fictional data", running: "Running", cycling: "Cycling", pos: "Pos", name: "Athlete", bib: "Bib", pts: "Points" },
    stats: { eyebrow: "04 — Performance", title: "Every meter counts.", text: "Every race, every result, every improvement. All part of your journey.", races: "Races completed", run: "Km running", ride: "Km cycling", progress: "Rating progression", history: "Recent results", milestone: "Milestone", milestoneText: "First half marathon under 1:40", preview: "Planned capability · sample data", months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] },
    events: { eyebrow: "05 — Events", title: ["Your next challenge", "starts here."], concept: "Concept", note: "Example concepts. No events have been announced yet.", drag: "Drag", prev: "Previous", next: "Next", list: [
      { t: "PEAQ City Run", d: "Running", l: "Milan", k: "10 KM" },
      { t: "PEAQ Road Challenge", d: "Cycling", l: "Tuscany", k: "120 KM" },
      { t: "PEAQ Night Run", d: "Running", l: "Rome", k: "21 KM" },
      { t: "PEAQ Climb", d: "Cycling", l: "Dolomites", k: "1,800 M D+" },
    ] },
    app: { eyebrow: "06 — App", title: ["A new way to compete.", "Coming to your hands soon."], screens: ["Profile", "Race bib", "Leaderboard", "Statistics", "Events"], preview: "Interface concept" },
    final: { title: ["The next finish line", "is just the beginning."], form: { email: "Your email address", interest: "Discipline (optional)", running: "Running", cycling: "Cycling", both: "Both", consent: "I agree to receive updates about PEAQ and to the processing of my email for the waitlist.", submit: "Join the waitlist", sending: "Sending…", ok: "You're on the list. We'll write to you when PEAQ launches.", dup: "This email is already on the waitlist.", errEmail: "Please enter a valid email address.", errConsent: "Your consent is required to continue.", err: "Something went wrong. Please try again shortly.", privacy: "We only use your email to update you about PEAQ. You can ask for deletion at any time." } },
    footer: { privacy: "Privacy Policy", contact: "Contact", rights: "All rights reserved.", privacyText: "We only collect your email and optional discipline to manage the PEAQ waitlist. We do not share data with third parties. For access or deletion, reach us via the contact page." },
    loader: "Loading",
  },
} as const;

export type Dict = (typeof dict)["it"];

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: "it", t: dict.it as Dict, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");
  useEffect(() => {
    const saved = localStorage.getItem("peaq-lang");
    if (saved === "en" || saved === "it") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dict[lang].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dict[lang].meta.description);
  }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("peaq-lang", l); };
  return <Ctx.Provider value={{ lang, t: dict[lang] as Dict, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
