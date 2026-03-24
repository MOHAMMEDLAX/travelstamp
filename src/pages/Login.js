import { useState, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display: 'inline-block' };
  const icons = {
    plane:   <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
    lang:    <svg style={s} viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>,
    mail:    <svg style={s} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:    <svg style={s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    arrow:   <svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    alert:   <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };
  return icons[name] || null;
};

function Login() {
  const { lang, setLang } = useApp();
  const T = {
    ar: {
      back: 'الصفحة الرئيسية',
      subtitle: 'سجّل دخولك لرحلاتك',
      emailLabel: 'البريد الإلكتروني',
      passLabel: 'كلمة المرور',
      emailPlaceholder: 'example@email.com',
      passPlaceholder: '••••••••',
      submit: 'تسجيل الدخول',
      loading: 'جاري الدخول...',
      error: 'البريد أو كلمة المرور غير صحيحة',
      noAccount: 'ما عندك حساب؟',
      register: 'سجّل الآن',
    },
    en: {
      back: 'Home',
      subtitle: 'Sign in to your journeys',
      emailLabel: 'Email',
      passLabel: 'Password',
      emailPlaceholder: 'example@email.com',
      passPlaceholder: '••••••••',
      submit: 'Sign In',
      loading: 'Signing in...',
      error: 'Incorrect email or password',
      noAccount: "Don't have an account?",
      register: 'Sign Up',
    }
  }[lang];

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const starsRef = useRef([]);
  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      width:   Math.random() * 1.8 + 0.5,
      top:     Math.random() * 100,
      left:    Math.random() * 100,
      dur:     (Math.random() * 4 + 2).toFixed(1),
      delay:   (Math.random() * 5).toFixed(1),
      opacity: (Math.random() * 0.4 + 0.1).toFixed(2),
    }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(T.error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.06)',
    color: 'white', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Tajawal, sans-serif',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060D18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Tajawal, sans-serif',
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      padding: '20px',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');
        @keyframes twinkle    { 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes pulse-glow { 0%,100%{opacity:0.06;transform:scale(1)} 50%{opacity:0.12;transform:scale(1.05)} }
        .login-input:focus { border-color: rgba(192,57,43,0.5) !important; background: rgba(255,255,255,0.08) !important; }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* زر اللغة */}
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{
        position: 'fixed',
        top: '16px',
        [lang === 'ar' ? 'left' : 'right']: '16px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.7)',
        padding: '7px 14px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700',
        cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
        zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.2s',
      }}>
        <Icon name="lang" size={13} color="rgba(255,255,255,0.6)"/>
        {lang === 'ar' ? 'EN' : 'عربي'}
      </button>

      {/* نجوم */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {starsRef.current.map(s => (
          <div key={s.id} style={{
            position: 'absolute', borderRadius: '50%', background: 'white',
            width: s.width + 'px', height: s.width + 'px',
            top: s.top + '%', left: s.left + '%', opacity: s.opacity,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}/>
        ))}
        <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '450px', height: '450px', background: 'rgba(192,57,43,0.07)', borderRadius: '50%', filter: 'blur(70px)', animation: 'pulse-glow 6s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', bottom: '-120px', left: '-120px', width: '450px', height: '450px', background: 'rgba(46,134,193,0.07)', borderRadius: '50%', filter: 'blur(70px)', animation: 'pulse-glow 8s ease-in-out 2s infinite' }}/>
      </div>

      {/* البطاقة */}
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px',
        padding: 'clamp(24px, 5vw, 40px)',
        backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 1,
      }}>

        {/* زر رجوع */}
        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
          fontSize: '12px', fontWeight: '700', marginBottom: '24px',
          padding: '6px 12px', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          <Icon name="arrow" size={13} color="currentColor"
            style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}
          />
          {T.back}
        </a>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/logo.png" alt="TravelStamp" style={{ width: '60px', height: '60px', objectFit: 'contain' }}/>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'white', margin: '0 0 6px' }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Travel<span style={{ color: '#D4AC0D' }}>Stamp</span>
            </a>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: 0 }}>
            {T.subtitle}
          </p>
        </div>

        {/* خطأ */}
        {error && (
          <div style={{
            background: 'rgba(192,57,43,0.12)', color: '#E74C3C',
            border: '1px solid rgba(192,57,43,0.3)',
            padding: '12px 14px', borderRadius: '12px',
            marginBottom: '20px', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Icon name="alert" size={15} color="#E74C3C"/>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* البريد */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Icon name="mail" size={12} color="rgba(255,255,255,0.4)"/>
              {T.emailLabel}
            </label>
            <input
              className="login-input"
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={T.emailPlaceholder}
              style={inputStyle}
            />
          </div>

          {/* كلمة المرور */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Icon name="lock" size={12} color="rgba(255,255,255,0.4)"/>
              {T.passLabel}
            </label>
            <input
              className="login-input"
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={T.passPlaceholder}
              style={inputStyle}
            />
          </div>

          {/* زر الدخول */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #C0392B, #E74C3C)',
            color: loading ? 'rgba(255,255,255,0.4)' : 'white',
            border: 'none', borderRadius: '14px',
            fontSize: '15px', fontWeight: '800',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Tajawal, sans-serif',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(192,57,43,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s',
          }}>
            {loading ? (
              T.loading
            ) : (
              <>
                <Icon name="plane" size={16} color="white" strokeWidth={2}/>
                {T.submit}
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          {T.noAccount}{' '}
          <a href="/register" style={{ color: '#D4AC0D', fontWeight: '800', textDecoration: 'none' }}>
            {T.register}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
