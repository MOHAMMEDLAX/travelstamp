import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [userRes, visitsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/user', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:8000/api/visits', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUser(userRes.data);
      setVisits(visitsRes.data);
      setForm({ name: userRes.data.name, email: userRes.data.email });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
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

const handleSave = async () => {
  setSaving(true); setError(''); setSuccess('');
  try {
    const res = await axios.put('http://127.0.0.1:8000/api/user', form, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    setUser({ ...user, ...form });
    setSuccess('✅ تم حفظ التعديلات!');
    setEditing(false);
  } catch (err) {
    console.log('Full error:', err.response);
    console.log('Headers sent:', err.config?.headers);
    setError('حدث خطأ أثناء الحفظ');
  } finally {
    setSaving(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const totalCountries = [...new Set(visits.map(v => v.country))].length;
  const totalCities = [...new Set(visits.map(v => v.city))].length;
  const avgRating = visits.length
    ? (visits.reduce((s, v) => s + v.rating, 0) / visits.length).toFixed(1)
    : 0;
  const topCountry = visits.length
    ? Object.entries(visits.reduce((acc, v) => { acc[v.country] = (acc[v.country] || 0) + 1; return acc; }, {}))
        .sort((a, b) => b[1] - a[1])[0][0]
    : null;

  const getFlagUrl = (code) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0F1F35',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Tajawal, sans-serif', color: 'rgba(255,255,255,0.3)'
    }}>جاري التحميل...</div>
  );

  return (
  <div style={{
  minHeight: '100vh', background: '#060D18',
  fontFamily: 'Tajawal, sans-serif', direction: 'rtl',
  position: 'relative',
}}>
  <style>{`
    @keyframes twinkle {
      0%,100% { opacity: 0.15; }
      50%      { opacity: 1; }
    }
    @keyframes pulse-glow {
      0%,100% { opacity: 0.06; transform: scale(1); }
      50%      { opacity: 0.11; transform: scale(1.04); }
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 10px; }
    ::-webkit-scrollbar-thumb { background: rgba(192,57,43,0.4); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(192,57,43,0.7); }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
  `}</style>

  {/* ── نجوم ── */}
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    {starsRef.current.map(s => (
      <div key={s.id} style={{
        position: 'absolute',
        width: s.width + 'px', height: s.width + 'px',
        borderRadius: '50%', background: 'white',
        top: s.top + '%', left: s.left + '%',
        opacity: s.opacity,
        animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
      }}/>
    ))}
    <div style={{
      position: 'absolute', top: '-150px', right: '-150px',
      width: '500px', height: '500px',
      background: 'rgba(192,57,43,0.07)', borderRadius: '50%',
      filter: 'blur(80px)', animation: 'pulse-glow 7s ease-in-out infinite',
    }}/>
    <div style={{
      position: 'absolute', bottom: '-150px', left: '-150px',
      width: '500px', height: '500px',
      background: 'rgba(46,134,193,0.07)', borderRadius: '50%',
      filter: 'blur(80px)', animation: 'pulse-glow 9s ease-in-out 2s infinite',
    }}/>
  </div>

      {/* Header */}
      <div style={{
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <a href="/dashboard" style={{
          color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          background: 'rgba(255,255,255,0.06)',
          padding: '7px 16px', borderRadius: '20px',
          fontSize: '12px', fontWeight: '700',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>← رجوع</a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', transform: 'rotate(-8deg)',
          }}>✈️</div>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '900' }}>
            Travel<span style={{ color: '#D4AC0D' }}>Stamp</span>
          </span>
        </div>

        <button onClick={handleLogout} style={{
          background: 'rgba(192,57,43,0.15)',
          border: '1px solid rgba(192,57,43,0.3)',
          color: '#E74C3C', padding: '7px 16px',
          borderRadius: '20px', fontSize: '12px',
          fontWeight: '700', cursor: 'pointer',
          fontFamily: 'Tajawal, sans-serif'
        }}>خروج 👋</button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

        {success && (
          <div style={{
            background: 'rgba(39,174,96,0.15)', color: '#27AE60',
            border: '1px solid rgba(39,174,96,0.3)',
            padding: '12px', borderRadius: '12px',
            marginBottom: '20px', fontSize: '13px', textAlign: 'center'
          }}>{success}</div>
        )}
        {error && (
          <div style={{
            background: 'rgba(192,57,43,0.15)', color: '#E74C3C',
            border: '1px solid rgba(192,57,43,0.3)',
            padding: '12px', borderRadius: '12px',
            marginBottom: '20px', fontSize: '13px', textAlign: 'center'
          }}>{error}</div>
        )}

        {/* بطاقة المستخدم */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', padding: '32px',
          marginBottom: '20px',
          display: 'flex', alignItems: 'center',
          gap: '24px', flexWrap: 'wrap'
        }}>
          {/* الأفاتار */}
          <div style={{
            width: '80px', height: '80px', flexShrink: 0,
            background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
            borderRadius: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: '900', color: 'white',
            boxShadow: '0 8px 24px rgba(192,57,43,0.4)',
            border: '3px solid rgba(255,255,255,0.1)'
          }}>
            {getInitials(user?.name)}
          </div>

          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="الاسم"
                  style={{
                    padding: '10px 14px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'white', fontSize: '14px', outline: 'none',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="البريد الإلكتروني"
                  style={{
                    padding: '10px 14px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'white', fontSize: '14px', outline: 'none',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleSave} disabled={saving} style={{
                    padding: '9px 20px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                    color: 'white', border: 'none',
                    fontSize: '12px', fontWeight: '800',
                    cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
                  }}>{saving ? 'جاري الحفظ...' : '💾 حفظ'}</button>
                  <button onClick={() => setEditing(false)} style={{
                    padding: '9px 20px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)', fontSize: '12px',
                    fontWeight: '800', cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif'
                  }}>إلغاء</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                  ✉️ {user?.email}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditing(true)} style={{
                    padding: '8px 18px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)', fontSize: '12px',
                    fontWeight: '800', cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif'
                  }}>✏️ تعديل الملف</button>
                </div>
              </>
            )}
          </div>

          {/* تاريخ الانضمام */}
          <div style={{
            background: 'rgba(212,172,13,0.08)',
            border: '1px solid rgba(212,172,13,0.15)',
            borderRadius: '16px', padding: '16px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🗓️</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
              عضو منذ
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#D4AC0D' }}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }) : '—'}
            </div>
          </div>
        </div>

        {/* إحصائيات المستخدم */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px', marginBottom: '20px'
        }}>
          {[
            { num: visits.length, label: 'رحلة', icon: '✈️', color: '#C0392B' },
            { num: totalCountries, label: 'دولة', icon: '🌍', color: '#2E86C1' },
            { num: totalCities, label: 'مدينة', icon: '🏙️', color: '#27AE60' },
            { num: avgRating, label: 'متوسط التقييم', icon: '⭐', color: '#D4AC0D' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px', padding: '18px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '30px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* أحدث الرحلات */}
        {visits.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '22px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '13px', fontWeight: '800',
              color: 'rgba(255,255,255,0.5)', marginBottom: '16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span>🕐 آخر الرحلات</span>
              <a href="/dashboard" style={{
                fontSize: '11px', color: '#D4AC0D',
                textDecoration: 'none', fontWeight: '700'
              }}>عرض الكل ←</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {visits.slice(0, 4).map((visit) => (
                <a key={visit.id} href={`/visit/${visit.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <img
                    src={visit.photo_url || `https://flagcdn.com/w80/${visit.country_code.toLowerCase()}.png`}
                    alt="" style={{
                      width: '42px', height: '42px',
                      borderRadius: '10px', objectFit: 'cover', flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', marginBottom: '2px' }}>
                      {visit.city}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <img src={getFlagUrl(visit.country_code)} alt="" style={{ width: '13px', borderRadius: '2px' }} />
                      {visit.country}
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '3px' }}>
                      {visit.visit_date}
                    </div>
                    <div style={{ fontSize: '10px' }}>{'⭐'.repeat(visit.rating)}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* الدولة المفضلة */}
        {topCountry && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '22px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ fontSize: '32px' }}>🏆</div>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', fontWeight: '700' }}>
                دولتك المفضلة
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={getFlagUrl(visits.find(v => v.country === topCountry)?.country_code || 'ma')}
                  alt="" style={{ width: '24px', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#D4AC0D' }}>{topCountry}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;