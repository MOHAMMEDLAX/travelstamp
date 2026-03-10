import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const starsRef = useRef([]);

  // توليد النجوم مرة واحدة
  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      width:  Math.random() * 1.8 + 0.5,
      top:    Math.random() * 100,
      left:   Math.random() * 100,
      dur:    (Math.random() * 4 + 2).toFixed(1),
      delay:  (Math.random() * 5).toFixed(1),
      opacity: (Math.random() * 0.4 + 0.1).toFixed(2),
    }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('البريد أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060D18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Tajawal, sans-serif', direction: 'rtl',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');
        @keyframes twinkle {
          0%,100% { opacity: 0.15; }
          50%      { opacity: 1; }
        }
        @keyframes pulse-red {
          0%,100% { opacity: 0.06; transform: scale(1); }
          50%      { opacity: 0.12; transform: scale(1.05); }
        }
      `}</style>

      {/* ── نجوم ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {starsRef.current.map(s => (
          <div key={s.id} style={{
            position: 'absolute',
            width:  s.width + 'px',
            height: s.width + 'px',
            borderRadius: '50%',
            background: 'white',
            top:   s.top  + '%',
            left:  s.left + '%',
            opacity: s.opacity,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}/>
        ))}
      </div>

      {/* ── glows ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '450px', height: '450px',
          background: 'rgba(192,57,43,0.07)', borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'pulse-red 6s ease-in-out infinite',
        }}/>
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-120px',
          width: '450px', height: '450px',
          background: 'rgba(46,134,193,0.07)', borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'pulse-red 8s ease-in-out 2s infinite',
        }}/>
      </div>

      {/* ── البطاقة ── */}
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px', padding: '40px',
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
          onMouseEnter={e => { e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}
        >
          ← الصفحة الرئيسية
        </a>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
            borderRadius: '18px', fontSize: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', transform: 'rotate(-8deg)',
            boxShadow: '0 8px 24px rgba(192,57,43,0.4)',
          }}>✈️</div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'white', margin: '0 0 6px' }}>
            Travel<span style={{ color: '#D4AC0D' }}>Stamp</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: 0 }}>
            سجّل دخولك لرحلاتك
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(192,57,43,0.15)', color: '#E74C3C',
            border: '1px solid rgba(192,57,43,0.3)',
            padding: '12px', borderRadius: '12px',
            marginBottom: '20px', fontSize: '13px', textAlign: 'center',
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
              البريد الإلكتروني
            </label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{
                width: '100%', padding: '13px 16px', borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'Tajawal, sans-serif',
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
              كلمة المرور
            </label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '13px 16px', borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'Tajawal, sans-serif',
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #C0392B, #E74C3C)',
            color: 'white', border: 'none', borderRadius: '14px',
            fontSize: '15px', fontWeight: '800',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Tajawal, sans-serif',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(192,57,43,0.4)',
          }}>
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول ✈️'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
          ما عندك حساب؟{' '}
          <a href="/register" style={{ color: '#D4AC0D', fontWeight: '800', textDecoration: 'none' }}>
            سجّل الآن
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;