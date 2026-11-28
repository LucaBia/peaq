import { useState } from "react";
import { DocumentsForm, FriendlyNote } from "../Documents";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService } from "@/lib/app/athlete";
import { useOb } from "./context";

/** Step 5. The cards and their forms live in ../Documents, shared with Settings › Documents. */
export function DocumentsStep() {
  const { t } = useAppLang();
  const { userId, data, goTo } = useOb();
  const [count, setCount] = useState(data.documents.length);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function next() {
    setBusy(true); setErr(false);
    try { await athleteService.completeOnboarding(); await goTo(6); } catch { setErr(true); } finally { setBusy(false); }
  }

  return (
    <>
      <Body>
        <Title sub={t.ob.doc.sub}>{t.ob.doc.title}</Title>
        <div className="space-y-4">
          <FriendlyNote />
          <DocumentsForm userId={userId} initial={data.documents} onDocs={(d) => setCount(d.length)} />
          {err && <Notice tone="error">{t.common.networkError}</Notice>}
        </div>
      </Body>
      <BottomBar>
        <PrimaryButton onClick={next} loading={busy}>{t.common.continue}</PrimaryButton>
        {count === 0 && <PrimaryButton variant="ghost" onClick={next} disabled={busy}>{t.ob.skip}</PrimaryButton>}
      </BottomBar>
    </>
  );
}
