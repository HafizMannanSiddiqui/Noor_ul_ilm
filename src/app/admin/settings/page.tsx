import { requireUser } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import type { Tri } from "@/lib/lang";
import { can } from "@/lib/roles";
import { saveSettings } from "../_actions/settings";
import { Msg, Shell } from "../_components/ui";

export const metadata = { title: "Site settings" };
export const dynamic = "force-dynamic";

const EXTRA = 3; // empty rows offered for adding new items

function Field({ name, label, value, dir, help, type = "text" }: { name: string; label: string; value?: string; dir?: "rtl" | "ltr"; help?: string; type?: string }) {
  return (
    <div>
      <label className="l" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={value} dir={dir} />
      {help && <p className="help">{help}</p>}
    </div>
  );
}

function TriFields({ name, label, value }: { name: string; label: string; value?: Tri }) {
  return (
    <fieldset className="tri">
      <legend>{label}</legend>
      <div className="row row-3">
        <Field name={`${name}_ur`} label="اردو" value={value?.ur} dir="rtl" />
        <Field name={`${name}_en`} label="English" value={value?.en} dir="ltr" />
        <Field name={`${name}_ar`} label="عربی (optional)" value={value?.ar} dir="rtl" />
      </div>
    </fieldset>
  );
}

const local = (n?: string) => (n && n.startsWith("92") ? `0${n.slice(2, 5)} ${n.slice(5)}` : n || "");

export default async function Settings({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const u = await requireUser(can.manageUsers);
  const { ok, err } = await searchParams;
  const { contact, donate, team, dailyAyat } = await getConfig();
  const pad = <T,>(list: T[]) => [...list, ...Array.from({ length: EXTRA }, () => undefined)] as (T | undefined)[];

  return (
    <Shell user={u}>
      <h1>Site settings · ویب سائٹ ترتیبات</h1>
      <p className="sub">Changes appear on the website as soon as you press Save. No code needed. · محفوظ کرتے ہی ویب سائٹ پر تبدیلی آ جاتی ہے۔</p>
      <Msg ok={ok} err={err} />
      <nav className="actions" style={{ margin: "10px 0 16px" }}>
        <a className="btn btn-o btn-s" href="#contact">Contact</a>
        <a className="btn btn-o btn-s" href="#donate">Donations</a>
        <a className="btn btn-o btn-s" href="#team">Team</a>
        <a className="btn btn-o btn-s" href="#ayat">Ayah of the Day</a>
      </nav>

      <form id="contact" className="box f" action={saveSettings}>
        <input type="hidden" name="section" value="contact" />
        <h2>Contact · رابطہ</h2>
        <div className="row row-2">
          <Field name="whatsappGeneral" label="Main WhatsApp number · واٹس ایپ" value={local(contact.whatsappGeneral)} dir="ltr" help="e.g. 0331 4375356 — used by the green WhatsApp button on every page" />
          <Field name="phone" label="Phone (shown as text) · فون" value={contact.phone} dir="ltr" />
          <Field name="whatsappSisters" label="Sisters' WhatsApp (a woman's number) · بہنوں کے لیے" value={local(contact.whatsappSisters)} dir="ltr" help="Leave empty to hide the sisters' button" />
          <Field name="email" label="Email (optional)" value={contact.email} dir="ltr" type="email" />
          <Field name="whatsappCommunity" label="WhatsApp Community / Channel link" value={contact.whatsappCommunity} dir="ltr" help="https://chat.whatsapp.com/… — shows a 'Join our WhatsApp community' button on the Join page" />
          <Field name="facebook" label="Facebook page link (optional)" value={contact.facebook} dir="ltr" />
          <Field name="mapQuery" label="Map search (place name for Google Maps)" value={contact.mapQuery} dir="ltr" />
        </div>
        <TriFields name="address" label="Address · پتا" value={contact.address} />
        <div><button className="btn btn-p">Save contact · محفوظ کریں</button></div>
      </form>

      <form id="donate" className="box f" action={saveSettings}>
        <input type="hidden" name="section" value="donate" />
        <h2>Donations · عطیات</h2>
        <Field name="receiptWhatsapp" label="WhatsApp for payment screenshots · اسکرین شاٹ کے لیے نمبر" value={local(donate.receiptWhatsapp)} dir="ltr" />
        <h3>Accounts · اکاؤنٹس</h3>
        <p className="help">Clear the title to remove an account.</p>
        {pad(donate.accounts).map((a, i) => (
          <div className="row row-3 setting-row" key={i}>
            <input type="hidden" name={`acc_${i}_present`} value="1" />
            <div>
              <label className="l" htmlFor={`acc_${i}_type`}>Type</label>
              <select id={`acc_${i}_type`} name={`acc_${i}_type`} defaultValue={a?.type || "jazzcash"}>
                <option value="jazzcash">JazzCash</option><option value="easypaisa">Easypaisa</option><option value="bank">Bank</option>
              </select>
            </div>
            <Field name={`acc_${i}_title`} label="Account title · نام" value={a?.title} />
            <Field name={`acc_${i}_number`} label="Number · نمبر" value={a?.number} dir="ltr" />
            <Field name={`acc_${i}_bank`} label="Bank & branch (bank only)" value={a?.bank} />
            <Field name={`acc_${i}_iban`} label="IBAN (bank only)" value={a?.iban} dir="ltr" />
          </div>
        ))}
        <h3>Where donations are spent · رقم کہاں خرچ ہوتی ہے</h3>
        {pad(donate.spending).map((x, i) => (
          <div key={i}><input type="hidden" name={`sp_${i}_present`} value="1" /><TriFields name={`sp_${i}`} label={`Item ${i + 1}`} value={x} /></div>
        ))}
        <h3>Monthly report (optional) · ماہانہ حساب</h3>
        <p className="help">Fill this only with real figures. Shows a &ldquo;Transparency&rdquo; chart on the Donate page.</p>
        <TriFields name="period" label="Period, e.g. November 2026 · مہینہ" value={donate.funds.period} />
        {pad(donate.funds.items).map((x, i) => (
          <div className="row row-2 setting-row" key={i}>
            <input type="hidden" name={`fund_${i}_present`} value="1" />
            <TriFields name={`fund_${i}`} label={`Spending item ${i + 1}`} value={x?.label} />
            <Field name={`fund_${i}_pct`} label="% of total" value={x ? String(x.percent) : ""} dir="ltr" type="number" />
          </div>
        ))}
        <TriFields name="registration" label="Charity registration number (optional) · رجسٹریشن" value={donate.registration} />
        <label className="check"><input type="checkbox" name="zakatAccepted" defaultChecked={donate.zakatAccepted} /> We accept Zakat — tick ONLY after a Mufti has confirmed in writing · زکوٰۃ</label>
        <div><button className="btn btn-p">Save donations · محفوظ کریں</button></div>
      </form>

      <form id="team" className="box f" action={saveSettings}>
        <input type="hidden" name="section" value="team" />
        <h2>Team (About page) · ٹیم</h2>
        <p className="help">Clear the name to remove someone. The phone adds Call and WhatsApp buttons; leave it empty to keep a number private.</p>
        {pad(team).map((m, i) => (
          <div className="setting-row" key={i}>
            <input type="hidden" name={`tm_${i}_present`} value="1" />
            <TriFields name={`tm_${i}_name`} label={`Member ${i + 1}: name · نام`} value={m?.name} />
            <TriFields name={`tm_${i}_role`} label="Role · ذمہ داری" value={m?.role} />
            <Field name={`tm_${i}_phone`} label="Phone / WhatsApp (optional)" value={local(m?.phone)} dir="ltr" />
          </div>
        ))}
        <div><button className="btn btn-p">Save team · محفوظ کریں</button></div>
      </form>

      <form id="ayat" className="box f" action={saveSettings}>
        <input type="hidden" name="section" value="dailyAyat" />
        <h2>Ayah of the Day · آج کی آیت</h2>
        <p className="help">One verse per day, in this order. Write references as surah:ayah (e.g. 2:255), one per line. The Arabic and Kanz-ul-Iman translation load automatically from verified sources. Please agree the list with your scholars.</p>
        <textarea name="refs" dir="ltr" rows={10} defaultValue={dailyAyat.join("\n")} />
        <div><button className="btn btn-p">Save list · محفوظ کریں</button></div>
      </form>
    </Shell>
  );
}
