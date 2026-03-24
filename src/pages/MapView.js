import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display: 'inline-block' };
  const icons = {
    arrow:    <svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    arrowR:   <svg style={s} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
    pin:      <svg style={s} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    map:      <svg style={s} viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    star:     <svg style={{ ...s, fill: color }} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    calendar: <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    plus:     <svg style={s} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    move:     <svg style={s} viewBox="0 0 24 24"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>,
    chevronR: <svg style={s} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
    chevronL: <svg style={s} viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
    paint:    <svg style={s} viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5" fill={color}/><circle cx="17.5" cy="10.5" r=".5" fill={color}/><circle cx="8.5" cy="7.5" r=".5" fill={color}/><circle cx="6.5" cy="12.5" r=".5" fill={color}/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
    notes:    <svg style={s} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    eye:      <svg style={s} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  };
  return icons[name] || null;
};

export default function MapView() {
  const { lang } = useApp();

  const T = {
    ar: {
      back: 'رجوع', title: 'خريطة رحلاتي',
      drag: 'اسحب الكرة للتدوير', loading: 'جاري تحميل الكرة...', failed: 'فشل تحميل البيانات',
      colorGuide: 'دليل الألوان', excellent: 'تقييم ممتاز', good: 'تقييم جيد', normal: 'تقييم عادي',
      clickHint: 'اضغط على نقطة في الكرة لعرض تفاصيل الزيارة',
      allLocations: 'كل المواقع', noLocations: 'لا توجد مواقع',
      noLocationsSub: 'أضف زيارة مع إحداثيات وستظهر على الكرة',
      addVisit: 'إضافة زيارة', viewDetails: 'عرض التفاصيل', location: 'موقع',
    },
    en: {
      back: 'Back', title: 'My Travel Map',
      drag: 'Drag to rotate', loading: 'Loading globe...', failed: 'Failed to load data',
      colorGuide: 'Color Guide', excellent: 'Excellent rating', good: 'Good rating', normal: 'Average rating',
      clickHint: 'Click a dot on the globe to see visit details',
      allLocations: 'All Locations', noLocations: 'No Locations',
      noLocationsSub: 'Add a visit with coordinates and it will appear on the globe',
      addVisit: 'Add Visit', viewDetails: 'View Details', location: 'location',
    }
  }[lang];

  const canvasRef = useRef(null);
  const rotRef    = useRef([20, -20, 0]);
  const animRef   = useRef(null);
  const geoRef    = useRef(null);
  const dragRef   = useRef({ active: false, last: null });

  const [loaded,   setLoaded]   = useState(false);
  const [error,    setError]    = useState(false);
  const [visits,   setVisits]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPanel, setShowPanel] = useState(false); // للجوال: إظهار/إخفاء اللوحة

  const [size, setSize] = useState(() => {
    if (window.innerWidth < 768) return Math.min(window.innerWidth - 32, 340);
    const s = Math.min(window.innerWidth * 0.5, window.innerHeight - 140);
    return Math.max(280, s);
  });

  const token = localStorage.getItem('token');

  const starsRef = useRef([]);
  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i, width: Math.random() * 1.8 + 0.5,
      top: Math.random() * 100, left: Math.random() * 100,
      dur: (Math.random() * 4 + 2).toFixed(1), delay: (Math.random() * 5).toFixed(1),
      opacity: (Math.random() * 0.4 + 0.1).toFixed(2),
    }));
  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/visits', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setVisits(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(w => {
        geoRef.current = { land: feature(w, w.objects.land), borders: mesh(w, w.objects.countries, (a, b) => a !== b) };
        setLoaded(true);
      }).catch(() => setError(true));
  }, []);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSize(Math.min(window.innerWidth - 32, 340));
      else setSize(Math.max(280, Math.min(window.innerWidth * 0.5, window.innerHeight - 140)));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const { land, borders } = geoRef.current;
    const cx = size / 2, cy = size / 2, R = size / 2 - 8;
    const mappedVisits = visits.filter(v => v.latitude && v.longitude);

    const proj      = d3.geoOrthographic().scale(R).translate([cx, cy]).clipAngle(90).rotate(rotRef.current);
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
      return Math.sin(phi) * Math.sin(phiRot) + Math.cos(phi) * Math.cos(phiRot) * Math.cos(lambda);
    }

    function drawVisitDot(visit) {
      const lat = parseFloat(visit.latitude), lng = parseFloat(visit.longitude);
      const dotZ = isVisible(lat, lng);
      if (dotZ < 0.05) return;
      const point = proj([lng, lat]);
      if (!point) return;
      const depth = Math.min(1, (dotZ + 0.3) / 1.3);
      const [px, py] = point;
      const color = getColor(visit.rating);
      const isSelected = selected?.id === visit.id;
      const dotSize = isSelected ? 6 : 4, ringSize = isSelected ? 12 : 7.5, haloSize = isSelected ? 22 : 14;

      const grd = ctx.createRadialGradient(px, py, 0, px, py, haloSize * depth);
      grd.addColorStop(0, color + 'CC'); grd.addColorStop(1, color + '00');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(px, py, haloSize * depth, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = isSelected ? 'white' : color;
      ctx.beginPath(); ctx.arc(px, py, dotSize * depth, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = color + 'DD'; ctx.lineWidth = (isSelected ? 2.5 : 1.5) * depth;
      ctx.beginPath(); ctx.arc(px, py, ringSize * depth, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.arc(px - 1, py - 1, 1.4 * depth, 0, Math.PI * 2); ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);

      const sea = ctx.createRadialGradient(cx - R*.28, cy - R*.28, 0, cx, cy, R);
      sea.addColorStop(0, '#5dade2'); sea.addColorStop(.30, '#2471a3'); sea.addColorStop(.72, '#0d4070'); sea.addColorStop(1, '#051525');
      ctx.beginPath(); pathGen(sphere); ctx.fillStyle = sea; ctx.fill();

      ctx.save(); ctx.beginPath(); pathGen(sphere); ctx.clip();
        ctx.beginPath(); pathGen(graticule); ctx.strokeStyle = 'rgba(100,170,220,.12)'; ctx.lineWidth = .5; ctx.stroke();
        ctx.beginPath(); pathGen(land); ctx.fillStyle = '#1a6b3a'; ctx.fill();
        ctx.beginPath(); pathGen(land); ctx.strokeStyle = '#0d3d20'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.beginPath(); pathGen(borders); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = .5; ctx.stroke();
        const atm = ctx.createRadialGradient(cx, cy, R*.76, cx, cy, R);
        atm.addColorStop(0, 'rgba(30,140,255,0)'); atm.addColorStop(.82, 'rgba(30,140,255,.05)'); atm.addColorStop(1, 'rgba(70,170,255,.25)');
        ctx.beginPath(); pathGen(sphere); ctx.fillStyle = atm; ctx.fill();
      ctx.restore();

      const spec = ctx.createRadialGradient(cx - R*.40, cy - R*.42, 0, cx - R*.17, cy - R*.20, R*.52);
      spec.addColorStop(0, 'rgba(255,255,255,.18)'); spec.addColorStop(.6, 'rgba(255,255,255,.04)'); spec.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); pathGen(sphere); ctx.fillStyle = spec; ctx.fill();

      const edge = ctx.createRadialGradient(cx, cy, R*.57, cx, cy, R);
      edge.addColorStop(0, 'rgba(0,0,0,0)'); edge.addColorStop(.83, 'rgba(0,0,0,.15)'); edge.addColorStop(1, 'rgba(0,0,0,.72)');
      ctx.beginPath(); pathGen(sphere); ctx.fillStyle = edge; ctx.fill();

      mappedVisits.forEach(v => drawVisitDot(v));

      if (!dragRef.current.active) { rotRef.current[0] += .10; proj.rotate(rotRef.current); }
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [loaded, size, visits, selected]);

  function handleCanvasClick(e) {
    if (!loaded || visits.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const R = size / 2 - 8, cx = size / 2, cy = size / 2;
    const proj = d3.geoOrthographic().scale(R).translate([cx, cy]).clipAngle(90).rotate(rotRef.current);
    const mappedVisits = visits.filter(v => v.latitude && v.longitude);
    let closest = null, minDist = 20;
    mappedVisits.forEach(v => {
      const lat = parseFloat(v.latitude), lng = parseFloat(v.longitude);
      const rot = rotRef.current;
      const lambda = (lng + rot[0]) * Math.PI / 180, phi = lat * Math.PI / 180, phiRot = rot[1] * Math.PI / 180;
      const dotZ = Math.sin(phi) * Math.sin(phiRot) + Math.cos(phi) * Math.cos(phiRot) * Math.cos(lambda);
      if (dotZ < 0.05) return;
      const point = proj([lng, lat]);
      if (!point) return;
      const dist = Math.hypot(point[0] - mx, point[1] - my);
      if (dist < minDist) { minDist = dist; closest = v; }
    });
    setSelected(closest);
    if (closest && isMobile) setShowPanel(true);
  }

  function onMouseDown(e) { dragRef.current = { active: true, last: [e.clientX, e.clientY] }; }
  function onMouseMove(e) {
    if (!dragRef.current.active) return;
    const [lx, ly] = dragRef.current.last;
    rotRef.current[0] += (e.clientX - lx) * .36;
    rotRef.current[1] -= (e.clientY - ly) * .36;
    rotRef.current[1]  = Math.max(-85, Math.min(85, rotRef.current[1]));
    dragRef.current.last = [e.clientX, e.clientY];
  }
  function onMouseUp() { dragRef.current.active = false; }
  function onTouchStart(e) { dragRef.current = { active: true, last: [e.touches[0].clientX, e.touches[0].clientY] }; }
  function onTouchMove(e) {
    if (!dragRef.current.active) return;
    const [lx, ly] = dragRef.current.last;
    rotRef.current[0] += (e.touches[0].clientX - lx) * .36;
    rotRef.current[1] -= (e.touches[0].clientY - ly) * .36;
    rotRef.current[1]  = Math.max(-85, Math.min(85, rotRef.current[1]));
    dragRef.current.last = [e.touches[0].clientX, e.touches[0].clientY];
  }
  function onTouchEnd() { dragRef.current.active = false; }

  const getFlagUrl    = code => `https://flagcdn.com/w80/${code?.toLowerCase()}.png`;
  const mappedVisits  = visits.filter(v => v.latitude && v.longitude);

  // ── مكوّن الشريط الجانبي (مشترك بين موبايل وديسكتوب) ──────────
  const SidePanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* دليل الألوان */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '14px 16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon name="paint" size={12} color="rgba(255,255,255,0.4)"/>{T.colorGuide}
        </div>
        {[
          { color: '#D4AC0D', label: T.excellent, count: 4 },
          { color: '#2E86C1', label: T.good,      count: 3 },
          { color: '#C0392B', label: T.normal,    count: 2 },
        ].map(({ color, label, count }) => (
          <div key={color} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: color, boxShadow: `0 0 8px ${color}` }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: 'white', fontWeight: '700' }}>{label}</div>
            </div>
            <div style={{ display: 'flex', gap: '1px' }}>{Array.from({length:count}).map((_,i)=><Icon key={i} name="star" size={9} color={color}/>)}</div>
          </div>
        ))}
      </div>

      {/* بطاقة الزيارة المختارة */}
      {selected ? (
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,172,13,0.3)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <img src={selected.photo_url || `https://flagcdn.com/w320/${selected.country_code?.toLowerCase()}.png`} alt={selected.city} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}/>
          <div style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <img src={getFlagUrl(selected.country_code)} alt="" style={{ width: '18px', borderRadius: '3px' }}/>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{selected.country}</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{selected.city}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Icon name="calendar" size={11} color="rgba(255,255,255,0.3)"/>{selected.visit_date}
            </div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
              {Array.from({length: selected.rating}).map((_,i) => <Icon key={i} name="star" size={13} color="#D4AC0D"/>)}
            </div>
            {selected.notes && (
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', marginBottom: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', gap: '6px' }}>
                <Icon name="notes" size={11} color="rgba(255,255,255,0.3)"/>
                <span>{selected.notes.slice(0, 80)}{selected.notes.length > 80 ? '...' : ''}</span>
              </div>
            )}
            <a href={`/visit/${selected.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', color: 'white', padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', textDecoration: 'none' }}>
              <Icon name="eye" size={13} color="white"/>{T.viewDetails}
            </a>
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><Icon name="globe" size={28} color="rgba(255,255,255,0.15)"/></div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.7' }}>{T.clickHint}</div>
        </div>
      )}

      {/* قائمة الزيارات */}
      {mappedVisits.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="pin" size={12} color="rgba(255,255,255,0.4)"/>
            {T.allLocations} ({mappedVisits.length})
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {mappedVisits.map(v => (
              <div key={v.id} onClick={() => { setSelected(selected?.id === v.id ? null : v); if (isMobile) setShowPanel(true); }}
                style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: selected?.id === v.id ? 'rgba(212,172,13,0.08)' : 'transparent', display: 'flex', alignItems: 'center', gap: '9px', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = selected?.id === v.id ? 'rgba(212,172,13,0.08)' : 'transparent'}
              >
                <img src={getFlagUrl(v.country_code)} alt="" style={{ width: '20px', borderRadius: '3px', flexShrink: 0 }}/>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.city}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {v.country} •
                    {Array.from({length:v.rating}).map((_,i)=><Icon key={i} name="star" size={8} color="#D4AC0D"/>)}
                  </div>
                </div>
                {selected?.id === v.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AC0D', flexShrink: 0 }}/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* لا توجد زيارات */}
      {mappedVisits.length === 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '22px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><Icon name="map" size={32} color="rgba(255,255,255,0.15)"/></div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', marginBottom: '5px' }}>{T.noLocations}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', lineHeight: '1.7' }}>{T.noLocationsSub}</div>
          <a href="/add-visit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', color: 'white', padding: '8px 18px', borderRadius: '14px', fontSize: '12px', fontWeight: '800', textDecoration: 'none' }}>
            <Icon name="plus" size={13} color="white"/>{T.addVisit}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#060D18', fontFamily: 'Tajawal, sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes twinkle    { 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes pulse-glow { 0%,100%{opacity:0.06;transform:scale(1)} 50%{opacity:0.11;transform:scale(1.04)} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.03);border-radius:10px}
        ::-webkit-scrollbar-thumb{background:rgba(192,57,43,0.4);border-radius:10px}
      `}</style>

      {/* نجوم */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {starsRef.current.map(s => (
          <div key={s.id} style={{ position: 'absolute', width: s.width+'px', height: s.width+'px', borderRadius: '50%', background: 'white', top: s.top+'%', left: s.left+'%', opacity: s.opacity, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }}/>
        ))}
        <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', background: 'rgba(192,57,43,0.07)', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse-glow 7s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', background: 'rgba(46,134,193,0.07)', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse-glow 9s ease-in-out 2s infinite' }}/>
      </div>

      {/* ══ HEADER ══ */}
      <div style={{ position: 'relative', zIndex: 10, padding: isMobile ? '0 16px' : '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,13,24,0.85)', backdropFilter: 'blur(20px)' }}>

        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {lang === 'ar' ? <Icon name="arrowR" size={13} color="rgba(255,255,255,0.5)"/> : <Icon name="arrow" size={13} color="rgba(255,255,255,0.5)"/>}
          {!isMobile && T.back}
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'white', fontSize: isMobile ? '13px' : '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Icon name="globe" size={15} color="#D4AC0D"/>{T.title}
          </span>
          <div style={{ background: mappedVisits.length > 0 ? 'rgba(39,174,96,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${mappedVisits.length > 0 ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.08)'}`, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', color: mappedVisits.length > 0 ? '#27AE60' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="pin" size={10} color={mappedVisits.length > 0 ? '#27AE60' : 'rgba(255,255,255,0.3)'}/>
            {mappedVisits.length} {T.location}
          </div>
        </div>

        {/* زر اللوحة على الجوال */}
        {isMobile ? (
          <button onClick={() => setShowPanel(!showPanel)} style={{ background: showPanel ? 'rgba(212,172,13,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${showPanel ? 'rgba(212,172,13,0.3)' : 'rgba(255,255,255,0.08)'}`, color: showPanel ? '#D4AC0D' : 'rgba(255,255,255,0.5)', padding: '7px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="map" size={13} color={showPanel ? '#D4AC0D' : 'rgba(255,255,255,0.5)'}/>
          </button>
        ) : (
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="move" size={12} color="rgba(255,255,255,0.3)"/>{T.drag}
          </div>
        )}
      </div>

      {/* ══ DESKTOP LAYOUT ══ */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', gap: '20px', padding: '16px 24px', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

          {/* الكرة */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: size*1.18+'px', height: size*1.18+'px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(25,110,190,0.35) 0%,rgba(25,110,190,0.1) 45%,rgba(25,110,190,0) 70%)', filter: 'blur(14px)', pointerEvents: 'none', zIndex: 0 }}/>
            {!loaded && !error && <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7fb3d8', fontSize: '14px', zIndex: 2, position: 'relative' }}>{T.loading}</div>}
            {error && <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c', fontSize: '14px' }}>{T.failed}</div>}
            <canvas ref={canvasRef} width={size} height={size} style={{ display: loaded ? 'block' : 'none', cursor: 'grab', position: 'relative', zIndex: 1, borderRadius: '50%' }}
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
              onClick={handleCanvasClick} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}/>
          </div>

          {/* اللوحة الجانبية */}
          <div style={{ width: '240px', flexShrink: 0, maxHeight: 'calc(100vh - 92px)', overflowY: 'auto' }}>
            <SidePanel/>
          </div>
        </div>
      )}

      {/* ══ MOBILE LAYOUT ══ */}
      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px', position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 60px)' }}>

          {/* hint للجوال */}
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="move" size={11} color="rgba(255,255,255,0.3)"/>{T.drag}
          </div>

          {/* الكرة */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: size*1.18+'px', height: size*1.18+'px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(25,110,190,0.35) 0%,rgba(25,110,190,0.1) 45%,rgba(25,110,190,0) 70%)', filter: 'blur(14px)', pointerEvents: 'none' }}/>
            {!loaded && !error && <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7fb3d8', fontSize: '14px' }}>{T.loading}</div>}
            {error && <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c', fontSize: '14px' }}>{T.failed}</div>}
            <canvas ref={canvasRef} width={size} height={size} style={{ display: loaded ? 'block' : 'none', cursor: 'grab', borderRadius: '50%' }}
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
              onClick={handleCanvasClick} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}/>
          </div>

          {/* اللوحة — تظهر عند الضغط على الزر أو النقر على نقطة */}
          {showPanel && (
            <div style={{ width: '100%', maxWidth: '420px', animation: 'slideUp 0.3s ease' }}>
              <SidePanel/>
            </div>
          )}

          {/* زر إظهار اللوحة إذا فيه زيارات ومخفية */}
          {!showPanel && mappedVisits.length > 0 && (
            <button onClick={() => setShowPanel(true)} style={{ marginTop: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '9px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Icon name="map" size={13} color="rgba(255,255,255,0.5)"/>
              {T.allLocations} ({mappedVisits.length})
              {lang==='ar' ? <Icon name="chevronL" size={12} color="rgba(255,255,255,0.4)"/> : <Icon name="chevronR" size={12} color="rgba(255,255,255,0.4)"/>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
