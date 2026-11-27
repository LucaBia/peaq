import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AppLang = "it" | "en";

const it = {
  common: {
    continue: "Continua", back: "Indietro", skip: "Salta", save: "Salva", retry: "Riprova", loading: "Caricamento…",
    close: "Chiudi", search: "Cerca", noResults: "Nessun risultato", networkError: "Connessione assente o errore del server. I tuoi dati sono al sicuro: riprova.",
    language: "Lingua", optional: "Facoltativo", comingSoon: "In arrivo",
  },
  auth: {
    email: "Email", password: "Password", confirmPassword: "Conferma password", show: "Mostra password", hide: "Nascondi password",
    signupTitle: "Crea il tuo account", signupSub: "Bastano email e password. Il profilo atleta lo completi dopo.",
    signupCta: "Crea account", haveAccount: "Hai già un account?", login: "Accedi",
    loginTitle: "Bentornato.", loginSub: "Accedi al tuo profilo PEAQ.", loginCta: "Accedi", noAccount: "Non hai un account?", signup: "Registrati",
    forgot: "Password dimenticata?",
    terms: "Accetto i Termini di servizio e l'Informativa privacy di PEAQ.",
    pwRules: "Almeno 8 caratteri, con una maiuscola, una minuscola e un numero.",
    errEmail: "Inserisci un indirizzo email valido.", errPassword: "La password non rispetta i requisiti.", errMatch: "Le password non coincidono.",
    errTerms: "Devi accettare termini e privacy.", errCredentials: "Email o password non corretti.", errNotConfirmed: "Conferma prima la tua email. Ti abbiamo inviato un link.",
    errExists: "Esiste già un account con questa email.", errRate: "Troppi tentativi. Attendi qualche minuto e riprova.", errWeak: "Password troppo debole o già comparsa in violazioni note. Scegline un'altra.",
    verifyTitle: "Controlla la tua email.", verifySub: "Abbiamo inviato un link di conferma a", verifyHint: "Apri il link per attivare l'account. Poi torna qui: proseguiremo con il tuo profilo.",
    resend: "Invia di nuovo", resent: "Email inviata di nuovo.", resendWait: "Puoi reinviare tra {s}s", changeEmail: "Cambia email", confirmed: "Ho confermato, continua",
    notYet: "Non risulta ancora confermata. Apri il link nell'email, poi accedi.",
    forgotTitle: "Recupera la password", forgotSub: "Ti invieremo un link per impostarne una nuova.", forgotCta: "Invia link", forgotSent: "Se esiste un account con questa email, riceverai a breve un link.",
    resetTitle: "Nuova password", resetCta: "Salva password", resetDone: "Password aggiornata.", resetInvalid: "Il link non è valido o è scaduto. Richiedine uno nuovo.",
    callbackWorking: "Verifica in corso…", linkExpired: "Questo link è scaduto o è già stato usato.", linkExpiredSub: "Accedi oppure richiedi una nuova email di conferma.",
    logout: "Esci",
  },
  ob: {
    step: "Passo {n} di {t}",
    p: {
      title: "Creiamo il tuo profilo.", username: "Username", usernameHint: "3–20 caratteri: lettere minuscole, numeri, punto e trattino basso. Non potrà essere cambiato.",
      checking: "Verifica…", available: "Disponibile", taken: "Già in uso", invalidUser: "Caratteri non validi",
      dob: "Data di nascita", dobErr: "Devi avere almeno 18 anni.", gender: "Genere", nationality: "Nazionalità", city: "Città", cityHint: "Usata per le classifiche cittadine.",
      choose: "Seleziona", searchCountry: "Cerca un paese", searchCity: "Cerca una città",
      genders: { male: "Uomo", female: "Donna", non_binary: "Non binario", undisclosed: "Preferisco non dirlo" },
      errLocked: "Lo username non può più essere cambiato.",
    },
    d: {
      title: "Qual è la tua disciplina?",
      run: { t: "Run", s: "Gare di corsa su strada e trail." },
      bike: { t: "Bike", s: "Gare di ciclismo su strada e gravel." },
      both: { t: "Run & Bike", s: "Entrambe. Rating separati per corsa e bici." },
    },
    n: {
      title: "Scegli il tuo numero.", sub: "Il tuo pettorale permanente. Unico su PEAQ, per sempre.", placeholder: "101–9999",
      pick: "Scegli per me", available: "Disponibile", taken: "Già assegnato", reserved: "Numeri 1–100 riservati ai riconoscimenti", invalid: "Numero non valido",
      confirm: "Conferma numero", conflict: "Qualcuno ha appena preso questo numero. Scegline un altro.", permanent: "Una volta confermato, il numero non potrà essere cambiato.",
      assigned: "Il tuo numero è assegnato.",
    },
    perf: {
      title: "Quanto vai forte?", sub: "Ci aiuta a stimare il tuo livello di partenza.", run: "Corsa", bike: "Ciclismo", distance: "Distanza recente",
      min: "Min", sec: "Sec", time: "Tempo", wkg: "W/kg — FTP / Peso", wkgHint: "Es. 3,2", errRun: "Inserisci un tempo plausibile.", errBike: "Valore tra 0,5 e 7,5.",
      provisional: "Il tuo rating iniziale è provvisorio. Le prime gare ci aiuteranno a determinare il tuo livello.",
      integrity: "Inserisci dati reali: una stima onesta ti mette in gara con atleti del tuo livello.",
    },
    doc: {
      title: "Pronto a gareggiare?", sub: "Alcune gare richiedono documenti. Puoi aggiungerli anche più tardi.",
      medical: "Certificato medico", medicalSub: "Certificato agonistico per atletica o ciclismo.", file: "Carica file (PDF o immagine, max 10 MB)", expiry: "Scadenza",
      membership: "Tessera sportiva", membershipSub: "Requisiti diversi a seconda di evento e disciplina.", org: "Ente", cardNumber: "Numero tessera",
      add: "Aggiungi", uploaded: "Documenti inviati", status: { pending: "In revisione", approved: "Approvato", rejected: "Rifiutato", expired: "Scaduto" },
      peaqTitle: "Tessera PEAQ", peaqSub: "Un'opzione di tesseramento PEAQ è in preparazione. Dettagli e condizioni saranno annunciati.",
      errFile: "File non valido. Usa PDF, JPG o PNG fino a 10 MB.", remove: "Rimuovi", privacy: "I documenti sono privati e visibili solo a te e al team di verifica.",
    },
    bib: { title: "Il tuo pettorale. La tua identità.", sub: "Il tuo numero ti accompagnerà in ogni gara su PEAQ.", league: "Lega", athlete: "Atleta" },
    intro: {
      s1: { t: "Tre spazi, un'app.", profile: "Profilo", profileD: "Pettorale, livello, rating e gare.", events: "Eventi", eventsD: "Scopri le competizioni e iscriviti.", rankings: "Classifiche", rankingsD: "Confronta le prestazioni nella tua città." },
      s2: { t: "Il tuo pettorale.", items: ["Il tuo numero è permanente.", "Il pettorale prende il colore della tua lega.", "Le gare ti fanno guadagnare esperienza.", "Potrai personalizzarne lo stile."] },
      s3: { t: "Rating e leghe.", d: "Il rating misura la tua forza competitiva e può salire o scendere con le gare. Corsa e bici hanno rating separati." },
      s4: { t: "XP e livelli.", d: "L'XP misura l'esperienza e cresce sempre. I livelli dipendono dall'XP, le leghe dal rating.", level: "Livello 1" },
      s5: { t: "Competizioni e community.", items: ["Gare di corsa e ciclismo", "Atleti di livello simile", "Classifiche cittadine", "Risultati e progressione", "Avvisi sugli eventi"], end: "Ci vediamo alla partenza.", cta: "Entra in PEAQ" },
    },
    notif: {
      title: "Restiamo in contatto?", sub: "Scegli cosa vorresti ricevere. Le notifiche arriveranno con l'app mobile.",
      newEvents: "Nuovi eventi", lobby: "Apertura lobby gara", results: "Risultati disponibili", save: "Salva preferenze", notNow: "Non ora",
    },
  },
  leagues: { valle: "Valle", collina: "Collina", passo: "Passo", cresta: "Cresta", vetta: "Vetta", peaq: "PEAQ" },
  disc: { run: "Run", bike: "Bike", both: "Run & Bike" },
  app: {
    tabs: { profile: "Profilo", events: "Eventi", rankings: "Classifiche" },
    rating: "Rating", runRating: "Rating corsa", bikeRating: "Rating bici", provisional: "Provvisorio", placement: "Gare di piazzamento {a}/{b}",
    level: "Livello", xp: "XP", events: "Gare completate", upcoming: "Prossima gara", noUpcoming: "Nessuna gara in programma. Gli eventi arriveranno presto.",
    eventsTitle: "Eventi", eventsEmpty: "Le prime competizioni PEAQ sono in preparazione. Ti avviseremo quando apriranno le iscrizioni.",
    rankTitle: "Classifiche", rankEmpty: "La classifica della tua città sarà disponibile al lancio dell'ecosistema competitivo.",
    settings: "Impostazioni", city: "Città",
  },
  admin: {
    nav: { users: "Utenti", events: "Eventi", admins: "Admin", documents: "Documenti" },
    backToApp: "Torna all'app",
    loadError: "Errore di caricamento. Riprova.",
    users: {
      title: "Utenti registrati", sub: "{n} atleti", search: "Cerca per username o email",
      user: "Utente", email: "Email", bib: "Pettorale", discipline: "Disciplina", city: "Città", onboarding: "Onboarding", joined: "Iscritto",
      done: "Completo", pending: "In corso", empty: "Ancora nessun atleta registrato.",
    },
    events: {
      title: "Eventi", sub: "Crea e gestisci le competizioni PEAQ.",
      new: "Nuovo evento", edit: "Modifica evento", empty: "Nessun evento. Creane uno.",
      colTitle: "Titolo", colDiscipline: "Disciplina", colDate: "Data", colStatus: "Stato", colActions: "Azioni",
      publish: "Pubblica", unpublish: "Ritira", del: "Elimina", delConfirm: "Eliminare questo evento?",
      fTitle: "Titolo", fDesc: "Descrizione", fDiscipline: "Disciplina", fDate: "Data e ora", fLocation: "Luogo", fCapacity: "Capienza", fStatus: "Stato",
      save: "Salva modifiche", create: "Crea evento", saving: "Salvataggio…",
      stDraft: "Bozza", stPublished: "Pubblicato", stCancelled: "Annullato",
      errTitle: "Il titolo deve avere almeno 3 caratteri.", errDate: "Scegli data e ora.",
    },
    admins: {
      title: "Amministratori", sub: "Chi può accedere a questo pannello.",
      add: "Aggiungi admin", empty: "Nessun admin.", remove: "Rimuovi", removeConfirm: "Rimuovere i permessi di admin a questo utente?",
      user: "Utente", email: "Email", actions: "Azioni",
      pickTitle: "Assegna admin", pickSearch: "Cerca un atleta per username o email", grant: "Assegna admin",
      lastAdmin: "Non puoi rimuovere l'ultimo admin.", noUsername: "(senza username)", granted: "Admin assegnato.",
    },
    documents: {
      title: "Revisione documenti", sub: "Certificati medici e tessere caricati dagli atleti.", empty: "Nessun documento da revisionare.",
      all: "Tutti", pending: "In attesa", approved: "Approvati", rejected: "Rifiutati",
      user: "Atleta", type: "Tipo", org: "Ente", status: "Stato", actions: "Azioni",
      view: "Apri file", approve: "Approva", reject: "Rifiuta", noFile: "Nessun file",
      tMedical: "Certificato medico", tMembership: "Tessera",
      stPending: "In attesa", stApproved: "Approvato", stRejected: "Rifiutato", stExpired: "Scaduto",
    },
  },
};

export type AppDict = typeof it;

const en: AppDict = {
  common: {
    continue: "Continue", back: "Back", skip: "Skip", save: "Save", retry: "Retry", loading: "Loading…",
    close: "Close", search: "Search", noResults: "No results", networkError: "No connection or server error. Your data is safe: try again.",
    language: "Language", optional: "Optional", comingSoon: "Coming soon",
  },
  auth: {
    email: "Email", password: "Password", confirmPassword: "Confirm password", show: "Show password", hide: "Hide password",
    signupTitle: "Create your account", signupSub: "Just email and password. You'll complete your athlete profile next.",
    signupCta: "Create account", haveAccount: "Already have an account?", login: "Log in",
    loginTitle: "Welcome back.", loginSub: "Log in to your PEAQ profile.", loginCta: "Log in", noAccount: "Don't have an account?", signup: "Sign up",
    forgot: "Forgot password?",
    terms: "I accept PEAQ's Terms of Service and Privacy Policy.",
    pwRules: "At least 8 characters, with an uppercase letter, a lowercase letter and a number.",
    errEmail: "Enter a valid email address.", errPassword: "The password doesn't meet the requirements.", errMatch: "Passwords don't match.",
    errTerms: "You must accept the terms and privacy policy.", errCredentials: "Incorrect email or password.", errNotConfirmed: "Please confirm your email first. We sent you a link.",
    errExists: "An account with this email already exists.", errRate: "Too many attempts. Wait a few minutes and try again.", errWeak: "Password too weak or found in known breaches. Choose another.",
    verifyTitle: "Check your email.", verifySub: "We sent a confirmation link to", verifyHint: "Open the link to activate your account. Then come back: we'll continue with your profile.",
    resend: "Resend email", resent: "Email sent again.", resendWait: "You can resend in {s}s", changeEmail: "Change email", confirmed: "I've confirmed, continue",
    notYet: "Not confirmed yet. Open the link in the email, then log in.",
    forgotTitle: "Reset your password", forgotSub: "We'll send you a link to set a new one.", forgotCta: "Send link", forgotSent: "If an account exists for this email, you'll receive a link shortly.",
    resetTitle: "New password", resetCta: "Save password", resetDone: "Password updated.", resetInvalid: "This link is invalid or expired. Request a new one.",
    callbackWorking: "Verifying…", linkExpired: "This link has expired or was already used.", linkExpiredSub: "Log in or request a new confirmation email.",
    logout: "Log out",
  },
  ob: {
    step: "Step {n} of {t}",
    p: {
      title: "Let's create your profile.", username: "Username", usernameHint: "3–20 characters: lowercase letters, numbers, dot and underscore. It can't be changed later.",
      checking: "Checking…", available: "Available", taken: "Already taken", invalidUser: "Invalid characters",
      dob: "Date of birth", dobErr: "You must be at least 18.", gender: "Gender", nationality: "Nationality", city: "City", cityHint: "Used for city rankings.",
      choose: "Select", searchCountry: "Search a country", searchCity: "Search a city",
      genders: { male: "Male", female: "Female", non_binary: "Non-binary", undisclosed: "Prefer not to say" },
      errLocked: "Your username can no longer be changed.",
    },
    d: {
      title: "What's your discipline?",
      run: { t: "Run", s: "Road and trail running competitions." },
      bike: { t: "Bike", s: "Road and gravel cycling competitions." },
      both: { t: "Run & Bike", s: "Both. Separate ratings for running and cycling." },
    },
    n: {
      title: "Pick your number.", sub: "Your permanent race bib. Unique on PEAQ, forever.", placeholder: "101–9999",
      pick: "Pick one for me", available: "Available", taken: "Already taken", reserved: "Numbers 1–100 are reserved for awards", invalid: "Invalid number",
      confirm: "Confirm number", conflict: "Someone just claimed this number. Pick another one.", permanent: "Once confirmed, your number can't be changed.",
      assigned: "Your number is assigned.",
    },
    perf: {
      title: "How fast are you?", sub: "It helps us estimate your starting level.", run: "Running", bike: "Cycling", distance: "Recent distance",
      min: "Min", sec: "Sec", time: "Time", wkg: "W/kg — FTP / Weight", wkgHint: "E.g. 3.2", errRun: "Enter a plausible time.", errBike: "Value between 0.5 and 7.5.",
      provisional: "Your initial rating is provisional. Your first races will help determine your level.",
      integrity: "Enter real data: an honest estimate puts you against athletes at your level.",
    },
    doc: {
      title: "Ready to race?", sub: "Some races require documents. You can add them later too.",
      medical: "Medical certificate", medicalSub: "Competitive certificate for athletics or cycling.", file: "Upload file (PDF or image, max 10 MB)", expiry: "Expiry date",
      membership: "Membership card", membershipSub: "Requirements vary by event and discipline.", org: "Organisation", cardNumber: "Card number",
      add: "Add", uploaded: "Submitted documents", status: { pending: "Pending review", approved: "Approved", rejected: "Rejected", expired: "Expired" },
      peaqTitle: "PEAQ membership", peaqSub: "A PEAQ membership option is in preparation. Details and terms will be announced.",
      errFile: "Invalid file. Use PDF, JPG or PNG up to 10 MB.", remove: "Remove", privacy: "Documents are private and visible only to you and the review team.",
    },
    bib: { title: "Your bib. Your identity.", sub: "Your number will be with you in every PEAQ race.", league: "League", athlete: "Athlete" },
    intro: {
      s1: { t: "Three spaces, one app.", profile: "Profile", profileD: "Bib, level, rating and races.", events: "Events", eventsD: "Discover competitions and register.", rankings: "Rankings", rankingsD: "Compare performance in your city." },
      s2: { t: "Your bib.", items: ["Your number is permanent.", "Your bib takes your league's colour.", "Races earn you experience.", "You'll be able to personalise its style."] },
      s3: { t: "Ratings and leagues.", d: "Your rating measures competitive strength and can rise or fall with races. Running and cycling are rated separately." },
      s4: { t: "XP and levels.", d: "XP tracks experience and only goes up. Levels are based on XP, leagues on rating.", level: "Level 1" },
      s5: { t: "Competitions and community.", items: ["Running and cycling races", "Athletes at comparable levels", "City rankings", "Results and progression", "Event notifications"], end: "See you at the starting line.", cta: "Enter PEAQ" },
    },
    notif: {
      title: "Stay in the loop?", sub: "Choose what you'd like to receive. Notifications will arrive with the mobile app.",
      newEvents: "New events", lobby: "Race lobby opening", results: "Results available", save: "Save preferences", notNow: "Not now",
    },
  },
  leagues: { valle: "Valle", collina: "Collina", passo: "Passo", cresta: "Cresta", vetta: "Vetta", peaq: "PEAQ" },
  disc: { run: "Run", bike: "Bike", both: "Run & Bike" },
  app: {
    tabs: { profile: "Profile", events: "Events", rankings: "Rankings" },
    rating: "Rating", runRating: "Running rating", bikeRating: "Cycling rating", provisional: "Provisional", placement: "Placement races {a}/{b}",
    level: "Level", xp: "XP", events: "Races completed", upcoming: "Next race", noUpcoming: "No races scheduled. Events are coming soon.",
    eventsTitle: "Events", eventsEmpty: "The first PEAQ competitions are being prepared. We'll let you know when registration opens.",
    rankTitle: "Rankings", rankEmpty: "Your city ranking will be available when the competitive ecosystem launches.",
    settings: "Settings", city: "City",
  },
  admin: {
    nav: { users: "Users", events: "Events", admins: "Admins", documents: "Documents" },
    backToApp: "Back to app",
    loadError: "Failed to load. Try again.",
    users: {
      title: "Registered users", sub: "{n} athletes", search: "Search by username or email",
      user: "User", email: "Email", bib: "Bib", discipline: "Discipline", city: "City", onboarding: "Onboarding", joined: "Joined",
      done: "Done", pending: "In progress", empty: "No athletes registered yet.",
    },
    events: {
      title: "Events", sub: "Create and manage PEAQ competitions.",
      new: "New event", edit: "Edit event", empty: "No events. Create one.",
      colTitle: "Title", colDiscipline: "Discipline", colDate: "Date", colStatus: "Status", colActions: "Actions",
      publish: "Publish", unpublish: "Unpublish", del: "Delete", delConfirm: "Delete this event?",
      fTitle: "Title", fDesc: "Description", fDiscipline: "Discipline", fDate: "Date & time", fLocation: "Location", fCapacity: "Capacity", fStatus: "Status",
      save: "Save changes", create: "Create event", saving: "Saving…",
      stDraft: "Draft", stPublished: "Published", stCancelled: "Cancelled",
      errTitle: "Title must be at least 3 characters.", errDate: "Pick a date and time.",
    },
    admins: {
      title: "Administrators", sub: "Who can access this panel.",
      add: "Add admin", empty: "No admins.", remove: "Remove", removeConfirm: "Remove admin rights from this user?",
      user: "User", email: "Email", actions: "Actions",
      pickTitle: "Assign admin", pickSearch: "Search an athlete by username or email", grant: "Assign admin",
      lastAdmin: "You can't remove the last admin.", noUsername: "(no username)", granted: "Admin assigned.",
    },
    documents: {
      title: "Document review", sub: "Medical certificates and cards uploaded by athletes.", empty: "No documents to review.",
      all: "All", pending: "Pending", approved: "Approved", rejected: "Rejected",
      user: "Athlete", type: "Type", org: "Org", status: "Status", actions: "Actions",
      view: "Open file", approve: "Approve", reject: "Reject", noFile: "No file",
      tMedical: "Medical certificate", tMembership: "Membership card",
      stPending: "Pending", stApproved: "Approved", stRejected: "Rejected", stExpired: "Expired",
    },
  },
};

export const appDict = { it, en };

export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

const Ctx = createContext<{ lang: AppLang; t: AppDict; setLang: (l: AppLang) => void }>({ lang: "it", t: it, setLang: () => {} });

/** Shares the "peaq-lang" choice with the landing page so language persists everywhere. */
export function AppLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AppLang>("it");
  useEffect(() => {
    const saved = localStorage.getItem("peaq-lang");
    if (saved === "en" || saved === "it") setLangState(saved);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: AppLang) => { setLangState(l); localStorage.setItem("peaq-lang", l); };
  return <Ctx.Provider value={{ lang, t: appDict[lang], setLang }}>{children}</Ctx.Provider>;
}

export const useAppLang = () => useContext(Ctx);
