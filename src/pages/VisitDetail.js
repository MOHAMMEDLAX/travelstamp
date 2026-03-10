import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VisitDetail() {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const getFlagUrl = (code) => `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
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

  useEffect(() => { fetchVisit(); }, []);

  const fetchVisit = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/visits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisit(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الزيارة؟')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/visits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0F1F35',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Tajawal, sans-serif', color: 'rgba(255,255,255,0.3)'
    }}>جاري التحميل...</div>
  );

  if (!visit) return (
    <div style={{
      minHeight: '100vh', background: '#0F1F35',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Tajawal, sans-serif', color: 'rgba(255,255,255,0.3)'
    }}>الزيارة غير موجودة</div>
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
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '28px 20px', position: 'relative', zIndex: 1 }}>
        <a href="/dashboard" style={{
          color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          background: 'rgba(255,255,255,0.06)',
          padding: '7px 16px', borderRadius: '20px',
          fontSize: '12px', fontWeight: '700',
        }}>→ رجوع</a>
        <span style={{ color: 'white', fontSize: '16px', fontWeight: '800' }}>
          ✈️ تفاصيل الزيارة
        </span>
        <button onClick={handleDelete} style={{
          background: 'rgba(192,57,43,0.2)',
          border: '1px solid rgba(192,57,43,0.3)',
          color: '#E74C3C', padding: '7px 16px',
          borderRadius: '20px', fontSize: '12px',
          fontWeight: '700', cursor: 'pointer',
          fontFamily: 'Tajawal, sans-serif'
        }}>🗑️ حذف</button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 20px' }}>

        {/* Hero Card */}
        <div style={{
          borderRadius: '24px', overflow: 'hidden',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '260px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* يمين — معلومات */}
          <div style={{
            padding: '32px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(212,172,13,0.12)',
                border: '1px solid rgba(212,172,13,0.2)',
                padding: '4px 12px', borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <img src={getFlagUrl(visit.country_code)} alt="" style={{ width: '16px', borderRadius: '2px' }} />
                <span style={{ color: '#D4AC0D', fontSize: '12px', fontWeight: '700' }}>
                  {visit.country}
                </span>
              </div>
              <div style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '900', color: 'white', lineHeight: 1.1 }}>
                {visit.city}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.06)',
                padding: '12px 16px', borderRadius: '14px',
              }}>
                <span style={{ fontSize: '16px' }}>📅</span>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>تاريخ الزيارة</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'white' }}>{visit.visit_date}</div>
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(212,172,13,0.08)',
                border: '1px solid rgba(212,172,13,0.15)',
                padding: '12px 16px', borderRadius: '14px',
              }}>
                <span style={{ fontSize: '16px' }}>⭐</span>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>التقييم</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#D4AC0D' }}>
                    {'⭐'.repeat(visit.rating)} ({visit.rating}/5)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* يسار — صورة أو علم */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src={visit.photo_url || getFlagUrl(visit.country_code)}
              alt={visit.city}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block', minHeight: '260px'
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to left, transparent 60%, rgba(15,31,53,0.4) 100%)'
            }} />
            {visit.photo_url && (
              <div style={{
                position: 'absolute', bottom: '12px', right: '12px',
                background: 'rgba(15,31,53,0.8)',
                backdropFilter: 'blur(8px)',
                borderRadius: '10px', padding: '6px 10px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <img src={getFlagUrl(visit.country_code)} alt="" style={{ width: '18px', borderRadius: '2px' }} />
                <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>{visit.country}</span>
              </div>
            )}
          </div>
        </div>

        {/* الصف الثاني */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: visit.notes ? '1fr 1fr' : '1fr',
          gap: '16px', marginBottom: '20px'
        }}>

          {/* الملاحظات */}
          {visit.notes && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '20px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>
                📝 ملاحظاتي
              </div>
              <p style={{
                margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.8',
                background: 'rgba(255,255,255,0.04)',
                padding: '14px', borderRadius: '12px',
                borderRight: '3px solid #C0392B'
              }}>
                {visit.notes}
              </p>
            </div>
          )}

          {/* الموقع */}
          {visit.latitude && visit.longitude && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '20px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>
                📍 الموقع الجغرافي
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'خط العرض', val: parseFloat(visit.latitude).toFixed(4) },
                  { label: 'خط الطول', val: parseFloat(visit.longitude).toFixed(4) },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.04)', padding: '10px 14px',
                    borderRadius: '10px', display: 'flex', justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>{item.val}</span>
                  </div>
                ))}
                <a
                  href={`https://www.google.com/maps?q=${visit.latitude},${visit.longitude}`}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: 'block', textAlign: 'center',
                    background: 'rgba(46,134,193,0.15)',
                    border: '1px solid rgba(46,134,193,0.3)',
                    color: '#2E86C1', padding: '10px',
                    borderRadius: '12px', fontSize: '12px',
                    fontWeight: '700', textDecoration: 'none'
                  }}
                >🗺️ فتح في خرائط Google</a>
              </div>
            </div>
          )}
        </div>

        {/* زر تعديل */}
        <a href={`/edit-visit/${visit.id}`} style={{
          display: 'block', textAlign: 'center',
          background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
          color: 'white', padding: '15px',
          borderRadius: '16px', fontSize: '15px',
          fontWeight: '800', textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(192,57,43,0.4)'
        }}>
          ✏️ تعديل الزيارة
        </a>

      </div>
    </div>
  );
}

export default VisitDetail;