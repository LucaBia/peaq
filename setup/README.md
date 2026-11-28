# PEAQ — conectar a tu propio Supabase (hosted) + Resend

La app corre en tu máquina (`bun dev`) pero usa **tu proyecto de Supabase en
supabase.com** (no el de Lovable, no Docker local). Los emails de autenticación
los envía tu propio proyecto de Supabase vía **Resend**.

La app habla con Supabase **solo desde el cliente** (con el JWT del usuario), así
que para funcionar solo necesita la **URL del proyecto** y la **anon/publishable
key** (ambas públicas). La `service_role` key **no** se usa. El único secreto del
lado servidor es `RESEND_API_KEY`, y solo para el email de bienvenida de la waitlist.

---

## 1. Crear el proyecto en Supabase

1. Entra en https://supabase.com → **New project**.
2. Cuando esté listo, ve a **Project Settings → API** y copia:
   - **Project URL** → `https://<ref>.supabase.co`
   - **anon public** key (o la **publishable** `sb_publishable_…`)

## 2. Cargar el esquema

Abre **SQL Editor** en el dashboard, pega el contenido de
[`setup/supabase-schema.sql`](./supabase-schema.sql) y pulsa **Run**.

Crea todo: tablas, RLS, funciones `SECURITY DEFINER` (claim_bib, save_personal_info,
…), grants, las 100 ciudades y el bucket privado `athlete-documents` con sus políticas.

(Alternativa por terminal: `psql "<connection-string>" -f setup/supabase-schema.sql`.)

## 3. Apuntar la app a tu proyecto (local)

`.env` está **gitignored** (no se commitea). Para desarrollo local, copia
`.env.example` a `.env` y rellena los valores públicos:

```
VITE_SUPABASE_URL="https://<ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon-o-publishable-key>"
SUPABASE_URL="https://<ref>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<anon-o-publishable-key>"
```

Luego:

```
bun install
bun dev
```

La app abre en http://localhost:8080 (si el puerto está ocupado, 8081).
Para producción (Cloudflare) estos valores NO salen de `.env` — ver sección 6.

## 4. Emails de autenticación con Resend (en el dashboard de Supabase)

Estos emails (confirmación, recuperación, etc.) los manda **tu proyecto de
Supabase**, no la app. Configúralos una vez:

**Authentication → URL Configuration**
- **Site URL**: `http://localhost:8080` (o tu dominio de producción)
- **Redirect URLs**: añade `http://localhost:8080/**`, `http://localhost:8081/**`
  y tu dominio de producción (`https://tudominio.com/**`).

**Authentication → Emails → SMTP Settings** → *Enable Custom SMTP*
- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: tu **RESEND_API_KEY** (`re_…`)
- Sender email: `noreply@updates.peaqrace.com`
  *(usa `updates.peaqrace.com`: es el único dominio verificado en tu cuenta de
  Resend. `peaqrace.com` sin verificar sería rechazado por Resend.)*
- Sender name: `PEAQ`

**Authentication → Emails → Templates**: para cada tipo, pega el HTML de
[`setup/email-templates/`](./email-templates) y pon el asunto:

| Plantilla de Supabase | Archivo | Asunto |
|---|---|---|
| Confirm signup | `confirmation.html` | `Conferma la tua email — PEAQ` |
| Reset password | `recovery.html` | `Reimposta la password — PEAQ` |
| Magic Link | `magic_link.html` | `Il tuo link di accesso — PEAQ` |
| Invite user | `invite.html` | `Sei stato invitato su PEAQ` |
| Change email | `email_change.html` | `Conferma la nuova email — PEAQ` |
| Reauthentication | `reauthentication.html` | `Il tuo codice di verifica — PEAQ` |

> Las plantillas son el diseño de marca (italiano) renderizado desde
> `src/lib/email-templates`. Para regenerarlas: `bun run emails:render`.

## 5. (Opcional) Email de bienvenida de la waitlist

La waitlist funciona sin esto; solo el email de bienvenida necesita Resend.
Como es un **secreto**, va en `.env.local` (gitignored, no se commitea):

```
RESEND_API_KEY="re_…"
```

El envío va directo a la API de Resend desde `src/lib/waitlist.functions.ts`.
El remitente es `hello@updates.peaqrace.com` (dominio verificado en Resend).

## 6. Despliegue en Cloudflare (producción)

La web (`peaqrace.com`) se despliega en Cloudflare Workers con `wrangler`. Como
`.env` está gitignored, **el build de producción NO lo lee**: las variables deben
estar en Cloudflare. Hay dos tipos:

**a) Build variables** (se hornean en el bundle del navegador en el build):
```
VITE_SUPABASE_URL           = https://<ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_...
```
> Si faltan, el cliente queda sin la URL de Supabase y la web rompe. Si construyes
> en tu máquina (`bun run build` antes de `wrangler deploy`), basta con tenerlas en
> tu `.env` local. Si el build corre en CI al hacer commit, ponlas como **build
> variables** en la config de build del Worker.

**b) Runtime variables / secrets** (las lee el Worker en ejecución, en el dashboard
del Worker → Settings → Variables and Secrets):
```
SUPABASE_URL              = https://<ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY  = sb_publishable_...
RESEND_API_KEY            = re_...        (como Secret)
```
Borra `LOVABLE_API_KEY` si existe (así el email de waitlist usa Resend directo).

Tras cambiar variables: **rebuild + redeploy** para que el cliente use tu proyecto.

---

## Notas

- La **anon/publishable** key es pública por diseño (viaja en el bundle del
  navegador): se puede commitear. La **service_role** key y la **RESEND_API_KEY**
  son secretos: nunca en `.env` ni en el repo.
- En Lovable: la preview de Lovable puede seguir inyectando su propio Supabase.
  Esta configuración es para correr la app **en local contra tu proyecto**.
