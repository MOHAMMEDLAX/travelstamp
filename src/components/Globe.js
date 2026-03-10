import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';

const CITIES = [
  { name:'باريس',   lat:48.85,  lng:2.35   },
  { name:'طوكيو',   lat:35.68,  lng:139.69 },
  { name:'نيويورك', lat:40.71,  lng:-74.00 },
  { name:'دبي',     lat:25.20,  lng:55.27  },
  { name:'لندن',    lat:51.50,  lng:-0.12  },
  { name:'سيدني',   lat:-33.86, lng:151.20 },
  { name:'القاهرة', lat:30.04,  lng:31.23  },
  { name:'ريو',     lat:-22.90, lng:-43.17 },
  { name:'موسكو',   lat:55.75,  lng:37.62  },
  { name:'بكين',    lat:39.91,  lng:116.39 },
];

const CITY_COLORS = [
  '#E74C3C','#F1C40F','#3498DB','#2ECC71',
  '#9B59B6','#E67E22','#E74C3C','#F1C40F',
  '#3498DB','#E74C3C',
];

export default function Globe({ size = 420 }) {
  const canvasRef = useRef(null);
  const rotRef    = useRef([20, -20, 0]);
  const animRef   = useRef(null);
  const geoRef    = useRef(null);
  const dragRef   = useRef({ active: false, last: null });
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

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

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const { land, borders } = geoRef.current;
    const cx = size / 2, cy = size / 2, R = size / 2 - 8;

    const proj = d3.geoOrthographic()
      .scale(R)
      .translate([cx, cy])
      .clipAngle(90)
      .rotate(rotRef.current);

    const pathGen   = d3.geoPath(proj, ctx);
    const sphere    = { type: 'Sphere' };
    const graticule = d3.geoGraticule()();

    function drawCityDot(lat, lng, color) {
      const point = proj([lng, lat]);
      if (!point) return;
      const rot    = rotRef.current;
      const lambda = (lng + rot[0]) * Math.PI / 180;
      const phi    = lat * Math.PI / 180;
      const phiRot = rot[1] * Math.PI / 180;
      const dotZ   = Math.sin(phi) * Math.sin(phiRot) +
                     Math.cos(phi) * Math.cos(phiRot) * Math.cos(lambda);
      if (dotZ < 0.05) return;
      const depth  = Math.min(1, (dotZ + 0.3) / 1.3);
      const [px, py] = point;

      // هالة
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 14 * depth);
      grd.addColorStop(0, color + 'BB');
      grd.addColorStop(1, color + '00');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, 14 * depth, 0, Math.PI * 2);
      ctx.fill();

      // نقطة مركزية
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 4 * depth, 0, Math.PI * 2);
      ctx.fill();

      // حلقة
      ctx.strokeStyle = color + 'CC';
      ctx.lineWidth   = 1.5 * depth;
      ctx.beginPath();
      ctx.arc(px, py, 7.5 * depth, 0, Math.PI * 2);
      ctx.stroke();

      // بريق أبيض
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(px - 1, py - 1, 1.2 * depth, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);

      // ── 1. المحيط ──
      const sea = ctx.createRadialGradient(cx - R*.28, cy - R*.28, 0, cx, cy, R);
      sea.addColorStop(0,   '#5dade2');
      sea.addColorStop(.30, '#2471a3');
      sea.addColorStop(.72, '#0d4070');
      sea.addColorStop(1,   '#051525');
      ctx.beginPath(); pathGen(sphere);
      ctx.fillStyle = sea; ctx.fill();

      // ── 2. كل شيء داخل الكرة ──
      ctx.save();
      ctx.beginPath(); pathGen(sphere); ctx.clip();

        // شبكة
        ctx.beginPath(); pathGen(graticule);
        ctx.strokeStyle = 'rgba(100,170,220,.12)';
        ctx.lineWidth = .5; ctx.stroke();

        // اليابسة — ملء أخضر
        ctx.beginPath(); pathGen(land);
        ctx.fillStyle = '#27ae60'; ctx.fill();

        // حواف اليابسة السوداء
        ctx.beginPath(); pathGen(land);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.4; ctx.stroke();

        // حدود الدول
        ctx.beginPath(); pathGen(borders);
        ctx.strokeStyle = 'rgba(0,0,0,.5)';
        ctx.lineWidth = .5; ctx.stroke();

        // غلاف جوي (داخل الكرة ليبقى دائرياً)
        const atm = ctx.createRadialGradient(cx, cy, R*.76, cx, cy, R);
        atm.addColorStop(0,   'rgba(30,140,255,0)');
        atm.addColorStop(.82, 'rgba(30,140,255,.05)');
        atm.addColorStop(1,   'rgba(70,170,255,.25)');
        ctx.beginPath(); pathGen(sphere);
        ctx.fillStyle = atm; ctx.fill();

      ctx.restore(); // ── انتهى الـ clip ──

      // ── 3. بريق سطحي (فوق الكرة) ──
      const spec = ctx.createRadialGradient(
        cx - R*.40, cy - R*.42, 0,
        cx - R*.17, cy - R*.20, R*.52
      );
      spec.addColorStop(0,  'rgba(255,255,255,.20)');
      spec.addColorStop(.6, 'rgba(255,255,255,.04)');
      spec.addColorStop(1,  'rgba(255,255,255,0)');
      ctx.beginPath(); pathGen(sphere);
      ctx.fillStyle = spec; ctx.fill();

      // ── 4. ظل الحافة ──
      const edge = ctx.createRadialGradient(cx, cy, R*.57, cx, cy, R);
      edge.addColorStop(0,   'rgba(0,0,0,0)');
      edge.addColorStop(.83, 'rgba(0,0,0,.15)');
      edge.addColorStop(1,   'rgba(0,0,0,.72)');
      ctx.beginPath(); pathGen(sphere);
      ctx.fillStyle = edge; ctx.fill();

      // ── 5. نقاط المدن (فوق كل شيء) ──
      CITIES.forEach((c, i) => drawCityDot(c.lat, c.lng, CITY_COLORS[i]));

      // ── تدوير ──
      if (!dragRef.current.active) {
        rotRef.current[0] += .12;
        proj.rotate(rotRef.current);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [loaded, size]);

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

  if (error) return <div style={{ color: '#e74c3c' }}>❌ فشل تحميل بيانات الأرض</div>;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* هالة زرقاء دائرية منفصلة */}
      <div style={{
        position:     'absolute',
        top: '50%', left: '50%',
        transform:    'translate(-50%,-50%)',
        width:        size * 1.18 + 'px',
        height:       size * 1.18 + 'px',
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(25,110,190,0.38) 0%, rgba(25,110,190,0.12) 45%, rgba(25,110,190,0) 70%)',
        filter:       'blur(14px)',
        pointerEvents:'none',
        zIndex: 0,
      }}/>

      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#7fb3d8', fontFamily: 'sans-serif', fontSize: 14,
          width: size, height: size, zIndex: 2,
        }}>⏳ جاري التحميل…</div>
      )}

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          display:  loaded ? 'block' : 'none',
          cursor:   'grab',
          position: 'relative',
          zIndex:   1,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
}