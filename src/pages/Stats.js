import { useState, useEffect, useRef } from 'react';
import axios from 'axios';


function Stats() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const token = localStorage.getItem('token');

  useEffect(() => { fetchVisits(); }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/visits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalVisits = visits.length;
  const totalCountries = [...new Set(visits.map(v => v.country))].length;
  const totalCities = [...new Set(visits.map(v => v.city))].length;
  const avgRating = totalVisits
    ? (visits.reduce((s, v) => s + v.rating, 0) / totalVisits).toFixed(1)
    : 0;

  // أكثر الدول زيارة
  const countryCounts = visits.reduce((acc, v) => {
    acc[v.country] = (acc[v.country] || 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // توزيع التقييمات
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: visits.filter(v => v.rating === r).length,
  }));

  const maxCount = Math.max(...topCountries.map(c => c[1]), 1);

  const getFlagUrl = (code) => {
    const country = visits.find(v => v.country === code);
    return country ? `https://flagcdn.com/w40/${country.country_code.toLowerCase()}.png` : '';
  };

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
     <div style={{ maxWidth: '700px', margin: '0 auto', padding: '28px 20px', position: 'relative', zIndex: 1 }}>
        <a href="/dashboard" style={{
          color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          background: 'rgba(255,255,255,0.06)',
          padding: '7px 16px', borderRadius: '20px',
          fontSize: '12px', fontWeight: '700',
        }}>→ رجوع</a>
        <span style={{ color: 'white', fontSize: '16px', fontWeight: '800' }}>
          📊 الإحصائيات
        </span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px' }}>

        {/* بطاقات الأرقام */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px', marginBottom: '24px'
        }}>
          {[
            { num: totalVisits, label: 'رحلة موثقة', icon: '✈️', color: '#C0392B', glow: 'rgba(192,57,43,0.25)' },
            { num: totalCountries, label: 'دولة مختلفة', icon: '🌍', color: '#2E86C1', glow: 'rgba(46,134,193,0.25)' },
            { num: totalCities, label: 'مدينة زرتها', icon: '🏙️', color: '#27AE60', glow: 'rgba(39,174,96,0.25)' },
            { num: avgRating, label: 'متوسط التقييم', icon: '⭐', color: '#D4AC0D', glow: 'rgba(212,172,13,0.25)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '20px',
              position: 'relative', overflow: 'hidden', textAlign: 'center'
            }}>
              <div style={{
                position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
                width: '80px', height: '80px',
                background: s.glow, borderRadius: '50%', filter: 'blur(25px)'
              }} />
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: s.color, lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '6px', fontWeight: '600' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* أكثر الدول */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '22px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '18px' }}>
              🏆 أكثر الدول زيارة
            </div>
            {topCountries.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px', padding: '20px' }}>
                لا توجد بيانات
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topCountries.map(([country, count], i) => (
                  <div key={country}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '20px', height: '20px',
                          background: i === 0 ? 'rgba(212,172,13,0.2)' : 'rgba(255,255,255,0.06)',
                          borderRadius: '6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: '900',
                          color: i === 0 ? '#D4AC0D' : 'rgba(255,255,255,0.3)'
                        }}>{i + 1}</span>
                        <img src={getFlagUrl(country)} alt="" style={{ width: '18px', borderRadius: '2px' }} />
                        <span style={{ fontSize: '13px', color: 'white', fontWeight: '700' }}>{country}</span>
                      </div>
                      <span style={{
                        fontSize: '12px', fontWeight: '800',
                        color: i === 0 ? '#D4AC0D' : 'rgba(255,255,255,0.4)'
                      }}>{count} {count === 1 ? 'زيارة' : 'زيارات'}</span>
                    </div>
                    <div style={{
                      height: '5px', background: 'rgba(255,255,255,0.06)',
                      borderRadius: '10px', overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '10px',
                        width: `${(count / maxCount) * 100}%`,
                        background: i === 0
                          ? 'linear-gradient(90deg, #D4AC0D, #F4D03F)'
                          : 'linear-gradient(90deg, #C0392B, #E74C3C)',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* توزيع التقييمات */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '22px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '18px' }}>
              ⭐ توزيع التقييمات
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '6px'
                  }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      {'⭐'.repeat(rating)}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>
                      {count}
                    </span>
                  </div>
                  <div style={{
                    height: '5px', background: 'rgba(255,255,255,0.06)',
                    borderRadius: '10px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '10px',
                      width: totalVisits ? `${(count / totalVisits) * 100}%` : '0%',
                      background: 'linear-gradient(90deg, #D4AC0D, #F4D03F)',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* ملخص سريع */}
            <div style={{
              marginTop: '20px', padding: '14px',
              background: 'rgba(212,172,13,0.08)',
              border: '1px solid rgba(212,172,13,0.15)',
              borderRadius: '14px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#D4AC0D' }}>{avgRating}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                متوسط تقييماتك
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Stats;