import Logo from "@/components/Logo";
import { googleEnabled } from "@/lib/google";
import { login } from "../_actions/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in" };

export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <div className="login">
      <div className="box">
        <div style={{ display: "flex", justifyContent: "center" }}><Logo size={84} id="login" /></div>
        <h1 style={{ marginTop: 8 }}>Noor-ul-Ilm Admin</h1>
        <p className="sub ur" dir="rtl">منتظمین کے لیے لاگ اِن</p>
        {e === "1" && <p className="alert alert-err">Wrong username or password. · یوزر نیم یا پاس ورڈ غلط ہے۔</p>}
        {e === "rate" && <p className="alert alert-err">Too many attempts. Please wait 15 minutes. · کچھ دیر بعد کوشش کریں۔</p>}
        {e === "google" && <p className="alert alert-err">Google sign-in did not complete. Please try again. · گوگل سے لاگ اِن مکمل نہیں ہوا، دوبارہ کوشش کریں۔</p>}
        {e === "google-nouser" && <p className="alert alert-err">This Google account has no admin access. Ask the super admin to create an account with this email. · اس ای میل کا کوئی اکاؤنٹ نہیں — نگرانِ اعلیٰ سے رابطہ کریں۔</p>}
        {e === "google-off" && <p className="alert alert-err">Google sign-in is not set up yet. · گوگل لاگ اِن ابھی فعال نہیں۔</p>}
        {googleEnabled() && (
          <>
            <a className="btn btn-google" href="/admin/auth/google">
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              Sign in with Google · گوگل سے داخل ہوں
            </a>
            <p className="or"><span>or · یا</span></p>
          </>
        )}
        <form className="f" action={login}>
          <div><label className="l" htmlFor="email">Username or email · یوزر نیم یا ای میل</label><input id="email" name="email" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required /></div>
          <div><label className="l" htmlFor="password">Password · پاس ورڈ</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
          <button className="btn btn-p" type="submit">Sign in · داخل ہوں</button>
        </form>
      </div>
    </div>
  );
}
