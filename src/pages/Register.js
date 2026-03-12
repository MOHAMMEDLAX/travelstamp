import { useState, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display: 'inline-block' };
  const icons = {
    plane:  <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
    lang:   <svg style={s} viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>,
    mail:   <svg style={s} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:   <svg style={s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    user:   <svg style={s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    rocket: <svg style={s} viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    arrow:  <svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    alert:  <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };
  return icons[name] || null;
};

function Register() {
  const { lang, setLang } = useApp();
  const T = {
    ar: {
      back:            'الصفحة الرئيسية',
      subtitle:        'أنشئ حسابك وابدأ رحلتك',
      nameLabel:       'الاسم',
      namePlaceholder: 'اسمك الكامل',
      emailLabel:      'البريد الإلكتروني',
      passLabel:       'كلمة المرور',
      submit:          'إنشاء الحساب',
      loading:         'جاري الإنشاء...',
      error:           'حدث خطأ، تأكد من البيانات',
      hasAccount:      'عندك حساب؟',
      login:           'سجّل دخولك',
    },
    en: {
      back:            'Home',
      subtitle:        'Create your account and start your journey',
      nameLabel:       'Name',
      namePlaceholder: 'Your full name',
      emailLabel:      'Email',
      passLabel:       'Password',
      submit:          'Create Account',
      loading:         'Creating...',
      error:           'An error occurred, please check your data',
      hasAccount:      'Already have an account?',
      login:           'Sign in',
    }
  }[lang];

  const [name,     setName]     = useState('');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://travelstamp-backend-production.up.railway.app/api/register', {
        name, email, password, password_confirmation: password,
      });
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

  const fields = [
    { label: T.nameLabel,  iconName: 'user',  type: 'text',     val: name,     set: setName,     placeholder: T.namePlaceholder    },
    { label: T.emailLabel, iconName: 'mail',  type: 'email',    val: email,    set: setEmail,    placeholder: 'example@email.com'  },
    { label: T.passLabel,  iconName: 'lock',  type: 'password', val: password, set: setPassword, placeholder: '••••••••'           },
  ];

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
        .reg-input:focus { border-color: rgba(192,57,43,0.5) !important; background: rgba(255,255,255,0.08) !important; }
        .reg-input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* زر اللغة */}
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{
        position: 'fixed', top: '16px',
        [lang === 'ar' ? 'left' : 'right']: '16px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.7)',
        padding: '7px 14px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '700',
        cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
        zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px',
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
          <Icon name="arrow" size={13} color="currentColor"/>
          {T.back}
        </a>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        <form onSubmit={handleRegister}>
          {fields.map((field, i) => (
            <div key={i} style={{ marginBottom: i === fields.length - 1 ? '28px' : '16px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
              }}>
                <Icon name={field.iconName} size={12} color="rgba(255,255,255,0.4)"/>
                {field.label}
              </label>
              <input
                className="reg-input"
                type={field.type}
                value={field.val}
                onChange={e => field.set(e.target.value)}
                placeholder={field.placeholder}
                style={inputStyle}
              />
            </div>
          ))}

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
            {loading ? T.loading : (
              <>
                <Icon name="rocket" size={16} color="white"/>
                {T.submit}
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          {T.hasAccount}{' '}
          <a href="/login" style={{ color: '#D4AC0D', fontWeight: '800', textDecoration: 'none' }}>
            {T.login}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;