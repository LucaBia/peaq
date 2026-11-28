import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAppLang } from "@/lib/app/i18n";

export type Lang = "it" | "en";

const it = {
  meta: { title: "PEAQ — Gare di corsa e bici, divise per lega", description: "Gare brevi di corsa e bici in città. Un pettorale tuo per sempre, un rating per sport e una lega che decide con chi parti. Crea il tuo pettorale." },
  nav: { how: "Come funziona", leagues: "Leghe", stages: "Tappe", races: "Gare", login: "Accedi", cta: "Crea il pettorale", app: "Apri l'app", menu: "Apri menu", close: "Chiudi menu", lang: "Cambia lingua" },
  hero: {
    eyebrow: "Corsa e bici · Milano e Padova", title: "Gare brevi in città.\nParti con chi va come te.",
    sub: "PEAQ organizza gare di corsa e bici divise per lega. Hai un pettorale tuo per sempre e un rating che sale quando batti chi è più forte.",
    cta: "Crea il tuo pettorale", cta2: "Come funziona",
    maker: { title: "Prova il tuo pettorale", name: "Nome utente", namePh: "il tuo nome", number: "Numero", shuffle: "Cambia numero", league: "Lega", note: "È un'anteprima. Il numero vero lo scegli alla registrazione, da 101 a 9999, ed è tuo per sempre." },
  },
  how: {
    eyebrow: "Come funziona", title: "Dal pettorale\nalla classifica",
    steps: [
      { t: "Crea il tuo pettorale", d: "Scegli un numero da 101 a 9999. È tuo per sempre e prende il colore della tua lega." },
      { t: "Iscriviti a una gara", d: "Gare brevi di corsa e bici nella tua città. Ti iscrivi e paghi nell'app." },
      { t: "Parti con la tua lega", d: "Al via sei con chi va come te. Nessuno resta solo in fondo, nessuno vince senza faticare." },
      { t: "Sali in classifica", d: "Dopo ogni gara cambiano il rating, la lega e la tua posizione in città." },
    ],
  },
  screens: {
    eyebrow: "L'app", title: "Tre schede,\ntutto qui", sub: "Sono le schermate vere dell'app, con atleti di esempio.", alt: "Tre schermate dell'app PEAQ: profilo, classifiche ed eventi",
    items: [{ t: "Profilo", d: "Il tuo pettorale, il rating, la lega e la Tappa." }, { t: "Classifiche", d: "La montagna della tua città, da salire lega dopo lega." }, { t: "Eventi", d: "Trovi una gara, ti iscrivi e confermi la presenza." }],
    sticky: "Crea il pettorale",
  },
  sports: { title: "Corsa e bici.\nUn rating per ognuna.", text: "Puoi gareggiare in tutte e due: hai un rating e una lega separati per sport.", run: "Corsa", bike: "Bici", runMeta: "Rating corsa", bikeMeta: "Rating bici" },
  leagues: {
    eyebrow: "Rating e leghe", title: "Sei leghe,\ndalla Valle a PEAQ", sub: "Il rating va da 0 a 1000 e decide la tua lega. Sposta il cursore e guarda dove saresti.",
    rating: "Rating", range: "Rating {r}", you: "Tu",
    facts: [
      { t: "Sale se batti chi è più forte", d: "Sale quando arrivi davanti a chi ha un rating più alto, scende quando arrivi dietro a chi ne ha uno più basso." },
      { t: "Conta la posizione, non il tempo", d: "Così ogni percorso è equo, in salita come in pianura." },
      { t: "Promozioni protette", d: "Dopo una promozione hai tre gare senza poter retrocedere." },
    ],
  },
  stages: {
    eyebrow: "Tappe e premi", title: "Più gareggi,\npiù sblocchi", sub: "Ogni gara ti dà XP. La Tappa sale e non scende mai, e ogni Tappa ha il suo premio.",
    stage: "Tappa", earnTitle: "Come guadagni XP",
  },
  raceDay: {
    eyebrow: "Il giorno di gara", title: "Tutto nell'app,\ndal briefing ai risultati",
    steps: [
      { t: "Lobby", d: "Da 24 ore prima: briefing, griglie di partenza per lega e chat tra gli iscritti." },
      { t: "Check-in con il QR", d: "Arrivi, mostri il QR dell'app allo staff e ritiri il pettorale." },
      { t: "Partenza per lega", d: "Si parte divisi per lega, una dopo l'altra." },
      { t: "Risultati", d: "Posizione, rating e XP arrivano nell'app dopo la gara." },
    ],
    rules: ["Iscrizioni aperte 4 settimane prima", "Annulli gratis fino a 48 ore prima", "Lista d'attesa: se si libera un posto hai 12 ore per prenderlo", "Rimborso automatico se la gara viene annullata"],
  },
  rank: {
    eyebrow: "Classifiche", title: "La classifica\ndella tua città", sub: "Una classifica per sport in ogni città. Segui gli amici e guarda chi hai davanti.",
    sample: "Dati di esempio", sport: "Sport", run: "Corsa", bike: "Bici", you: "Tu", toPass: "{n} punti per superare {name}",
  },
  community: {
    eyebrow: "Club e amici", title: "Più bello\nin compagnia",
    club: { t: "Club", d: "Crea il tuo club o entra in quello degli amici. Da tre membri il club entra in classifica: contano i migliori cinque rating e ogni gara finita.", items: ["Capitano, vice e membri", "Bacheca del club", "Uscite riservate ai membri"] },
    invite: { t: "Invita un amico", d: "Hai un link personale. Quando il tuo amico finisce la prima gara tu ricevi una gara gratis e 100 XP, lui ha la prima gara a metà prezzo.", you: "Tu", friend: "Amico", youGet: "Gara gratis · +100 XP", friendGets: "Prima gara a metà prezzo", note: "Fino a tre gare gratis all'anno." },
  },
  first: {
    eyebrow: "Prima gara", title: "Gara pilota", place: "Prato della Valle, Padova", invite: "Su invito", date: "Data da definire",
    text: "Tre partenze per lega e gara a eliminazione: a ogni giro escono gli ultimi due, finché in tre si giocano il podio.",
    cities: "Poi le gare aperte a tutti, a partire da", city1: "Milano", city2: "Padova",
  },
  final: { title: "Il tuo pettorale\nti aspetta", sub: "Crea l'account, scegli il numero e sei pronto per la prima gara.", cta: "Crea il tuo pettorale", have: "Hai già un account?", login: "Accedi" },
  footer: { tagline: "Reach your peaq", privacy: "Privacy", terms: "Termini", cookie: "Cookie", rights: "Tutti i diritti riservati.", adults: "Per atleti dai 18 anni in su." },
};

const en: typeof it = {
  meta: { title: "PEAQ — Running and cycling races, split by league", description: "Short running and cycling races in the city. A bib that is yours for good, a rating per sport and a league that decides who you start with. Create your bib." },
  nav: { how: "How it works", leagues: "Leagues", stages: "Stages", races: "Races", login: "Log in", cta: "Create your bib", app: "Open the app", menu: "Open menu", close: "Close menu", lang: "Change language" },
  hero: {
    eyebrow: "Running and cycling · Milan and Padua", title: "Short races in the city.\nStart with people at your level.",
    sub: "PEAQ runs running and cycling races split by league. You get a bib that is yours for good and a rating that goes up when you beat stronger athletes.",
    cta: "Create your bib", cta2: "How it works",
    maker: { title: "Try your bib", name: "Username", namePh: "your name", number: "Number", shuffle: "Change number", league: "League", note: "This is a preview. You choose your real number when you sign up, from 101 to 9999, and it is yours for good." },
  },
  how: {
    eyebrow: "How it works", title: "From your bib\nto the rankings",
    steps: [
      { t: "Create your bib", d: "Choose a number from 101 to 9999. It is yours for good and takes the colour of your league." },
      { t: "Sign up for a race", d: "Short running and cycling races in your city. You sign up and pay in the app." },
      { t: "Start with your league", d: "At the start you are with people at your level. Nobody is left alone at the back, nobody wins without a fight." },
      { t: "Climb the rankings", d: "After every race your rating, your league and your position in the city change." },
    ],
  },
  screens: {
    eyebrow: "The app", title: "Three tabs,\nthat's all", sub: "These are the real screens of the app, with sample athletes.", alt: "Three screens of the PEAQ app: profile, rankings and events",
    items: [{ t: "Profile", d: "Your bib, your rating, your league and your Stage." }, { t: "Rankings", d: "The mountain of your city, to climb league after league." }, { t: "Events", d: "Find a race, sign up and confirm you'll be there." }],
    sticky: "Create your bib",
  },
  sports: { title: "Running and cycling.\nA rating for each.", text: "You can race in both: you have a separate rating and league for each sport.", run: "Running", bike: "Cycling", runMeta: "Running rating", bikeMeta: "Cycling rating" },
  leagues: {
    eyebrow: "Rating and leagues", title: "Six leagues,\nfrom Valle to PEAQ", sub: "Your rating goes from 0 to 1000 and decides your league. Move the slider and see where you would be.",
    rating: "Rating", range: "Rating {r}", you: "You",
    facts: [
      { t: "It goes up when you beat stronger athletes", d: "It goes up when you finish ahead of someone with a higher rating, and down when you finish behind someone with a lower one." },
      { t: "Position counts, not time", d: "So every course is fair, uphill or flat." },
      { t: "Protected promotions", d: "After a promotion you get three races with no relegation." },
    ],
  },
  stages: {
    eyebrow: "Stages and prizes", title: "The more you race,\nthe more you unlock", sub: "Every race gives you XP. Your Stage goes up and never comes down, and every Stage has its prize.",
    stage: "Stage", earnTitle: "How you earn XP",
  },
  raceDay: {
    eyebrow: "Race day", title: "All in the app,\nfrom briefing to results",
    steps: [
      { t: "Lobby", d: "From 24 hours before: briefing, start grids by league and a chat for everyone signed up." },
      { t: "QR check-in", d: "You arrive, show the app's QR to the staff and collect your bib." },
      { t: "Start by league", d: "Leagues start separately, one after the other." },
      { t: "Results", d: "Position, rating and XP arrive in the app after the race." },
    ],
    rules: ["Sign-ups open 4 weeks before", "Free cancellation up to 48 hours before", "Waitlist: if a spot opens you have 12 hours to take it", "Automatic refund if the race is cancelled"],
  },
  rank: {
    eyebrow: "Rankings", title: "The rankings\nof your city", sub: "One ranking per sport in every city. Follow your friends and see who is ahead of you.",
    sample: "Sample data", sport: "Sport", run: "Running", bike: "Cycling", you: "You", toPass: "{n} points to pass {name}",
  },
  community: {
    eyebrow: "Clubs and friends", title: "Better\ntogether",
    club: { t: "Clubs", d: "Create your club or join your friends'. From three members the club enters the rankings: the best five ratings count, and so does every race finished.", items: ["Captain, vice and members", "Club board", "Outings for members only"] },
    invite: { t: "Invite a friend", d: "You have a personal link. When your friend finishes their first race you get a free race and 100 XP, and they get their first race at half price.", you: "You", friend: "Friend", youGet: "Free race · +100 XP", friendGets: "First race at half price", note: "Up to three free races a year." },
  },
  first: {
    eyebrow: "First race", title: "Pilot race", place: "Prato della Valle, Padua", invite: "Invite only", date: "Date to be set",
    text: "Three starts by league and an elimination race: every lap the last two are out, until three are left to fight for the podium.",
    cities: "Then races open to everyone, starting from", city1: "Milan", city2: "Padua",
  },
  final: { title: "Your bib\nis waiting", sub: "Create your account, choose your number and you are ready for your first race.", cta: "Create your bib", have: "Already have an account?", login: "Log in" },
  footer: { tagline: "Reach your peaq", privacy: "Privacy", terms: "Terms", cookie: "Cookies", rights: "All rights reserved.", adults: "For athletes aged 18 and over." },
};

export const dict = { it, en };
export type Dict = typeof it;

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: "it", t: it, setLang: () => {} });

/** The landing follows the app's language (same "peaq-lang" choice), so the pieces shared with the app switch together. */
export function LangProvider({ children }: { children: ReactNode }) {
  const app = useAppLang();
  const [lang, setLangState] = useState<Lang>("it");
  useEffect(() => { setLangState(app.lang); }, [app.lang]);
  useEffect(() => {
    document.title = dict[lang].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dict[lang].meta.description);
  }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); app.setLang(l); };
  return <Ctx.Provider value={{ lang, t: dict[lang], setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
