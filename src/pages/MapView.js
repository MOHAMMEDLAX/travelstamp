import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import axios from 'axios';

export default function MapView() {
  const canvasRef = useRef(null);
  const rotRef    = useRef([20, -20, 0]);
  const animRef   = useRef(null);
  const geoRef    = useRef(null);
  const dragRef   = useRef({ active: false, last: null });

  const [loaded,   setLoaded]   = useState(false);
  const [error,    setError]    = useState(false);
  const [visits,   setVisits]   = useState([]);
  const [selected, setSelected] = useState(null);
const [size, setSize] = useState(Math.min(window.innerWidth, window.innerHeight) - 300);

  const token = localStorage.getItem('token');
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

  // ── جلب بيانات الزيارات ──
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/visits', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setVisits(res.data)).catch(console.error);
  }, []);

  // ── جلب بيانات الأرض ──
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(w => {
        geoRef.current = {
          land:    feature(w, w.objects.land),
          borders: mesh(w, w.objects.countries, (a, b) => a !== b),
        };
        setLoaded(true);
      })
      .catch(() => setError(true));
  }, []);

  // ── تحديث الحجم عند تغيير النافذة ──
  useEffect(() => {
    const onResize = () => setSize(Math.min(window.innerWidth, window.innerHeight) - 80);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── رسم الكرة ──
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const { land, borders } = geoRef.current;
    const cx = size / 2, cy = size / 2, R = size / 2 - 8;
    const mappedVisits = visits.filter(v => v.latitude && v.longitude);

    const proj = d3.geoOrthographic()
      .scale(R).translate([cx, cy])
      .clipAngle(90).rotate(rotRef.current);

    const pathGen   = d3.geoPath(proj, ctx);
    const sphere    = { type: 'Sphere' };
    const graticule = d3.geoGraticule()();

    function getColor(rating) {
      if (rating >= 4) return '#D4AC0D';
      if (rating === 3) return '#2E86C1';
      return '#C0392B';
    }

    function isVisible(lat, lng) {
      const rot    = rotRef.current;
      const lambda = (lng + rot[0]) * Math.PI / 180;
      const phi    = lat * Math.PI / 180;
      const phiRot = rot[1] * Math.PI / 180;
      return Math.sin(phi) * Math.sin(phiRot) +
             Math.cos(phi) * Math.cos(phiRot) * Math.cos(lambda);
    }

    function drawVisitDot(visit) {
      const lat = parseFloat(visit.latitude);
      const lng = parseFloat(visit.longitude);
      const dotZ = isVisible(lat, lng);
      if (dotZ < 0.05) return;

      const point = proj([lng, lat]);
      if (!point) return;

      const depth  = Math.min(1, (dotZ + 0.3) / 1.3);
      const [px, py] = point;
      const color  = getColor(visit.rating);
      const isSelected = selected?.id === visit.id;
      const dotSize = isSelected ? 6 : 4;
      const ringSize = isSelected ? 12 : 7.5;
      const haloSize = isSelected ? 22 : 14;

      // هالة
      const grd = ctx.createRadialGradient(px, py, 0, px, py, haloSize * depth);
      grd.addColorStop(0, color + 'CC');
      grd.addColorStop(1, color + '00');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, haloSize * depth, 0, Math.PI * 2);
      ctx.fill();

      // نقطة مركزية
      ctx.fillStyle = isSelected ? 'white' : color;
      ctx.beginPath();
      ctx.arc(px, py, dotSize * depth, 0, Math.PI * 2);
      ctx.fill();

      // حلقة
      ctx.strokeStyle = color + 'DD';
      ctx.lineWidth   = (isSelected ? 2.5 : 1.5) * depth;
      ctx.beginPath();
      ctx.arc(px, py, ringSize * depth, 0, Math.PI * 2);
      ctx.stroke();

      // بريق أبيض
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(px - 1, py - 1, 1.4 * depth, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);

      // المحيط
      const sea = ctx.createRadialGradient(cx - R*.28, cy - R*.28, 0, cx, cy, R);
      sea.addColorStop(0,   '#5dade2');
      sea.addColorStop(.30, '#2471a3');
      sea.addColorStop(.72, '#0d4070');
      sea.addColorStop(1,   '#051525');
      ctx.beginPath(); pathGen(sphere);
      ctx.fillStyle = sea; ctx.fill();

      ctx.save();
      ctx.beginPath(); pathGen(sphere); ctx.clip();

        // شبكة
        ctx.beginPath(); pathGen(graticule);
        ctx.strokeStyle = 'rgba(100,170,220,.12)';
        ctx.lineWidth = .5; ctx.stroke();

        // اليابسة
        ctx.beginPath(); pathGen(land);
        ctx.fillStyle = '#1a6b3a'; ctx.fill();

        // حواف اليابسة
        ctx.beginPath(); pathGen(land);
        ctx.strokeStyle = '#0d3d20';
        ctx.lineWidth = 1.2; ctx.stroke();

        // حدود الدول
        ctx.beginPath(); pathGen(borders);
        ctx.strokeStyle = 'rgba(0,0,0,.4)';
        ctx.lineWidth = .5; ctx.stroke();

        // غلاف جوي
        const atm = ctx.createRadialGradient(cx, cy, R*.76, cx, cy, R);
        atm.addColorStop(0,   'rgba(30,140,255,0)');
        atm.addColorStop(.82, 'rgba(30,140,255,.05)');
        atm.addColorStop(1,   'rgba(70,170,255,.25)');
        ctx.beginPath(); pathGen(sphere);
        ctx.fillStyle = atm; ctx.fill();

      ctx.restore();

      // بريق سطحي
      const spec = ctx.createRadialGradient(
        cx - R*.40, cy - R*.42, 0,
        cx - R*.17, cy - R*.20, R*.52
      );
      spec.addColorStop(0,  'rgba(255,255,255,.18)');
      spec.addColorStop(.6, 'rgba(255,255,255,.04)');
      spec.addColorStop(1,  'rgba(255,255,255,0)');
      ctx.beginPath(); pathGen(sphere);
      ctx.fillStyle = spec; ctx.fill();

      // ظل الحافة
      const edge = ctx.createRadialGradient(cx, cy, R*.57, cx, cy, R);
      edge.addColorStop(0,   'rgba(0,0,0,0)');
      edge.addColorStop(.83, 'rgba(0,0,0,.15)');
      edge.addColorStop(1,   'rgba(0,0,0,.72)');
      ctx.beginPath(); pathGen(sphere);
      ctx.fillStyle = edge; ctx.fill();

      // نقاط الزيارات
      mappedVisits.forEach(v => drawVisitDot(v));

      // تدوير تلقائي
      if (!dragRef.current.active) {
        rotRef.current[0] += .10;
        proj.rotate(rotRef.current);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [loaded, size, visits, selected]);

  // ── click على الكانفاس لاختيار زيارة ──
  function handleCanvasClick(e) {
    if (!loaded || visits.length === 0) return;
    const rect  = canvasRef.current.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;
    const R     = size / 2 - 8;
    const cx    = size / 2, cy = size / 2;

    const proj = d3.geoOrthographic()
      .scale(R).translate([cx, cy])
      .clipAngle(90).rotate(rotRef.current);

    const mappedVisits = visits.filter(v => v.latitude && v.longitude);
    let closest = null, minDist = 20;

    mappedVisits.forEach(v => {
      const lat = parseFloat(v.latitude);
      const lng = parseFloat(v.longitude);
      const rot    = rotRef.current;
      const lambda = (lng + rot[0]) * Math.PI / 180;
      const phi    = lat * Math.PI / 180;
      const phiRot = rot[1] * Math.PI / 180;
      const dotZ   = Math.sin(phi) * Math.sin(phiRot) +
                     Math.cos(phi) * Math.cos(phiRot) * Math.cos(lambda);
      if (dotZ < 0.05) return;

      const point = proj([lng, lat]);
      if (!point) return;
      const dist = Math.hypot(point[0] - mx, point[1] - my);
      if (dist < minDist) { minDist = dist; closest = v; }
    });

    setSelected(closest);
  }

  // ── أحداث السحب ──
  function onMouseDown(e) {
    dragRef.current = { active: true, last: [e.clientX, e.clientY] };
  }
  function onMouseMove(e) {
    if (!dragRef.current.active) return;
    const [lx, ly] = dragRef.current.last;
    rotRef.current[0] += (e.clientX - lx) * .36;
    rotRef.current[1] -= (e.clientY - ly) * .36;
    rotRef.current[1]  = Math.max(-85, Math.min(85, rotRef.current[1]));
    dragRef.current.last = [e.clientX, e.clientY];
  }
  function onMouseUp() { dragRef.current.active = false; }

  function onTouchStart(e) {
    dragRef.current = { active: true, last: [e.touches[0].clientX, e.touches[0].clientY] };
  }
  function onTouchMove(e) {
    if (!dragRef.current.active) return;
    const [lx, ly] = dragRef.current.last;
    rotRef.current[0] += (e.touches[0].clientX - lx) * .36;
    rotRef.current[1] -= (e.touches[0].clientY - ly) * .36;
    rotRef.current[1]  = Math.max(-85, Math.min(85, rotRef.current[1]));
    dragRef.current.last = [e.touches[0].clientX, e.touches[0].clientY];
  }
  function onTouchEnd() { dragRef.current.active = false; }

  const getFlagUrl   = (code) => `https://flagcdn.com/w80/${code?.toLowerCase()}.png`;
  const mappedVisits = visits.filter(v => v.latitude && v.longitude);

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
      {/* ── Header ── */}
      <div style={{
        maxWidth: '700px', margin: '0 auto', padding: '28px 20px', position: 'relative', zIndex: 1,
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0F1F35', position: 'relative', zIndex: 10
      }}>
        <a href="/dashboard" style={{
          color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
          background: 'rgba(255,255,255,0.06)',
          padding: '7px 16px', borderRadius: '20px',
          fontSize: '12px', fontWeight: '700',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>← رجوع</a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'white', fontSize: '15px', fontWeight: '800' }}>
            🌍 خريطة رحلاتي
          </span>
          <div style={{
            background: mappedVisits.length > 0 ? 'rgba(39,174,96,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${mappedVisits.length > 0 ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.08)'}`,
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '11px', fontWeight: '700',
            color: mappedVisits.length > 0 ? '#27AE60' : 'rgba(255,255,255,0.3)'
          }}>
            📍 {mappedVisits.length} موقع
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>
          🖱️ اسحب الكرة للتدوير
        </div>
      </div>

      {/* ── المحتوى الرئيسي ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 'calc(100vh - 57px)', position: 'relative', gap: '24px',
        padding: '0 24px'
      }}>

        {/* ── الكرة ── */}
        <div style={{ position: 'relative', flexShrink: 0 }}>

          {/* هالة زرقاء */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: size * 1.18 + 'px', height: size * 1.18 + 'px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25,110,190,0.35) 0%, rgba(25,110,190,0.1) 45%, rgba(25,110,190,0) 70%)',
            filter: 'blur(14px)', pointerEvents: 'none', zIndex: 0,
          }} />

          {!loaded && !error && (
            <div style={{
              width: size, height: size,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7fb3d8', fontSize: '14px', zIndex: 2, position: 'relative'
            }}>⏳ جاري تحميل الكرة...</div>
          )}

          {error && (
            <div style={{
              width: size, height: size,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#e74c3c', fontSize: '14px'
            }}>❌ فشل تحميل البيانات</div>
          )}

          <canvas
            ref={canvasRef}
            width={size} height={size}
            style={{
              display: loaded ? 'block' : 'none',
              cursor: 'grab', position: 'relative', zIndex: 1,
              borderRadius: '50%',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onClick={handleCanvasClick}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />

     
</div>
{/* مفتاح الألوان */}
{mappedVisits.length > 0 && (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '14px 16px',
  }}>
    <div style={{
      fontSize: '11px', fontWeight: '800',
      color: 'rgba(255,255,255,0.4)',
      marginBottom: '10px'
    }}>🎨 دليل الألوان</div>
    {[
      { color: '#D4AC0D', label: 'تقييم ممتاز', stars: '⭐⭐⭐⭐+' },
      { color: '#2E86C1', label: 'تقييم جيد',   stars: '⭐⭐⭐' },
      { color: '#C0392B', label: 'تقييم عادي',  stars: '⭐⭐' },
    ].map(({ color, label, stars }) => (
      <div key={color} style={{
        display: 'flex', alignItems: 'center',
        gap: '10px', marginBottom: '8px'
      }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
          background: color, boxShadow: `0 0 8px ${color}`
        }} />
        <div>
          <div style={{ fontSize: '11px', color: 'white', fontWeight: '700' }}>{label}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{stars}</div>
        </div>
      </div>
    ))}
  </div>
)}

        {/* ── الشريط الجانبي ── */}
        <div style={{
          width: '260px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: '12px',
          maxHeight: 'calc(100vh - 100px)', overflow: 'hidden'
        }}>

          {/* بطاقة الزيارة المختارة */}
          {selected ? (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,172,13,0.3)',
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
              <img
                src={selected.photo_url || `https://flagcdn.com/w320/${selected.country_code?.toLowerCase()}.png`}
                alt={selected.city}
                style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <img src={getFlagUrl(selected.country_code)} alt=""
                    style={{ width: '20px', borderRadius: '3px' }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{selected.country}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>
                  {selected.city}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
                  📅 {selected.visit_date}
                </div>
                <div style={{ fontSize: '16px', marginBottom: '12px' }}>
                  {'⭐'.repeat(selected.rating)}
                </div>
                {selected.notes && (
                  <div style={{
                    fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                    lineHeight: '1.6', marginBottom: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '10px'
                  }}>
                    {selected.notes.slice(0, 80)}{selected.notes.length > 80 ? '...' : ''}
                  </div>
                )}
                <a href={`/visit/${selected.id}`} style={{
                  display: 'block', textAlign: 'center',
                  background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                  color: 'white', padding: '9px',
                  borderRadius: '12px', fontSize: '12px',
                  fontWeight: '800', textDecoration: 'none'
                }}>← عرض التفاصيل</a>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌍</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.7' }}>
                اضغط على نقطة<br />في الكرة لعرض تفاصيل الزيارة
              </div>
            </div>
          )}

          {/* قائمة الزيارات */}
          {mappedVisits.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', overflow: 'hidden',
              flex: 1
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: '11px', fontWeight: '800',
                color: 'rgba(255,255,255,0.4)'
              }}>
                📍 كل المواقع ({mappedVisits.length})
              </div>
              <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {mappedVisits.map(v => (
                  <div key={v.id}
                    onClick={() => setSelected(selected?.id === v.id ? null : v)}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      background: selected?.id === v.id ? 'rgba(212,172,13,0.08)' : 'transparent',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = selected?.id === v.id ? 'rgba(212,172,13,0.08)' : 'transparent'}
                  >
                    <img src={getFlagUrl(v.country_code)} alt=""
                      style={{ width: '22px', borderRadius: '3px', flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{
                        fontSize: '12px', fontWeight: '800', color: 'white',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>{v.city}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                        {v.country} • {'⭐'.repeat(v.rating)}
                      </div>
                    </div>
                    {selected?.id === v.id && (
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#D4AC0D', flexShrink: 0
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* لا توجد زيارات */}
          {mappedVisits.length === 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🗺️</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                لا توجد مواقع
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px', lineHeight: '1.7' }}>
                أضف زيارة مع إحداثيات<br />وستظهر على الكرة
              </div>
              <a href="/add-visit" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                color: 'white', padding: '9px 20px',
                borderRadius: '16px', fontSize: '12px',
                fontWeight: '800', textDecoration: 'none'
              }}>➕ إضافة زيارة</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}