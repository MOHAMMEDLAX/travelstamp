import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const COUNTRY_NAMES = {
  ma: { ar: 'المغرب',           en: 'Morocco' },
  fr: { ar: 'فرنسا',            en: 'France' },
  us: { ar: 'الولايات المتحدة', en: 'United States' },
  gb: { ar: 'المملكة المتحدة',  en: 'United Kingdom' },
  de: { ar: 'ألمانيا',          en: 'Germany' },
  es: { ar: 'إسبانيا',          en: 'Spain' },
  it: { ar: 'إيطاليا',          en: 'Italy' },
  sa: { ar: 'السعودية',         en: 'Saudi Arabia' },
  ae: { ar: 'الإمارات',         en: 'UAE' },
  eg: { ar: 'مصر',              en: 'Egypt' },
  tr: { ar: 'تركيا',            en: 'Turkey' },
  jp: { ar: 'اليابان',          en: 'Japan' },
  cn: { ar: 'الصين',            en: 'China' },
  br: { ar: 'البرازيل',         en: 'Brazil' },
  ca: { ar: 'كندا',             en: 'Canada' },
  au: { ar: 'أستراليا',         en: 'Australia' },
  ru: { ar: 'روسيا',            en: 'Russia' },
  za: { ar: 'جنوب أفريقيا',     en: 'South Africa' },
  ng: { ar: 'نيجيريا',          en: 'Nigeria' },
  ke: { ar: 'كينيا',            en: 'Kenya' },
  zm: { ar: 'زامبيا',           en: 'Zambia' },
  dz: { ar: 'الجزائر',          en: 'Algeria' },
  tn: { ar: 'تونس',             en: 'Tunisia' },
  iq: { ar: 'العراق',           en: 'Iraq' },
  jo: { ar: 'الأردن',           en: 'Jordan' },
  lb: { ar: 'لبنان',            en: 'Lebanon' },
  kw: { ar: 'الكويت',           en: 'Kuwait' },
  qa: { ar: 'قطر',              en: 'Qatar' },
  om: { ar: 'عُمان',            en: 'Oman' },
  pk: { ar: 'باكستان',          en: 'Pakistan' },
  id: { ar: 'إندونيسيا',        en: 'Indonesia' },
  my: { ar: 'ماليزيا',          en: 'Malaysia' },
  th: { ar: 'تايلاند',          en: 'Thailand' },
  sg: { ar: 'سنغافورة',         en: 'Singapore' },
  kr: { ar: 'كوريا الجنوبية',   en: 'South Korea' },
  nl: { ar: 'هولندا',           en: 'Netherlands' },
  se: { ar: 'السويد',           en: 'Sweden' },
  no: { ar: 'النرويج',          en: 'Norway' },
  pt: { ar: 'البرتغال',         en: 'Portugal' },
  gr: { ar: 'اليونان',          en: 'Greece' },
  nz: { ar: 'نيوزيلندا',        en: 'New Zealand' },
  mv: { ar: 'المالديف',         en: 'Maldives' },
};

function getCountryName(visit, lang) {
  const code = visit.country_code?.toLowerCase();
  if (code && COUNTRY_NAMES[code]) return COUNTRY_NAMES[code][lang];
  return visit.country;
}

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display: 'inline-block' };
  const icons = {
    arrow:       <svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    arrowR:      <svg style={s} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    plane:       <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
    trash:       <svg style={s} viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    edit:        <svg style={s} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    calendar:    <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    star:        <svg style={{ ...s, fill: color }} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    notes:       <svg style={s} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    pin:         <svg style={s} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    externalLink:<svg style={s} viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  };
  return icons[name] || null;
};

function VisitDetail() {
  const { id }   = useParams();
  const { lang } = useApp();

  const T = {
    ar: {
      back: 'رجوع', title: 'تفاصيل الزيارة',
      delete: 'حذف', confirmDelete: 'هل أنت متأكد من حذف هذه الزيارة؟',
      loading: 'جاري التحميل...', notFound: 'الزيارة غير موجودة',
      visitDate: 'تاريخ الزيارة', rating: 'التقييم',
      notes: 'ملاحظاتي', location: 'الموقع الجغرافي',
      lat: 'خط العرض', lng: 'خط الطول',
      openMap: 'فتح في خرائط Google', edit: 'تعديل الزيارة',
    },
    en: {
      back: 'Back', title: 'Visit Details',
      delete: 'Delete', confirmDelete: 'Are you sure you want to delete this visit?',
      loading: 'Loading...', notFound: 'Visit not found',
      visitDate: 'Visit Date', rating: 'Rating',
      notes: 'My Notes', location: 'Location',
      lat: 'Latitude', lng: 'Longitude',
      openMap: 'Open in Google Maps', edit: 'Edit Visit',
    }
  }[lang];

  const [visit,    setVisit]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const token = localStorage.getItem('token');

  const getFlagUrl = code => `https://flagcdn.com/w320/${code?.toLowerCase()}.png`;

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
    fetchVisit();
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchVisit = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/visits/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setVisit(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(T.confirmDelete)) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/visits/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      window.location.href = '/dashboard';
    } catch (err) { console.error(err); }
  };

  const loadingScreen = msg => (
    <div style={{ minHeight: '100vh', background: '#060D18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tajawal, sans-serif', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>{msg}</div>
  );

  if (loading) return loadingScreen(T.loading);
  if (!visit)  return loadingScreen(T.notFound);

  const cardBg     = 'rgba(255,255,255,0.04)';
  const cardBorder = '1px solid rgba(255,255,255,0.08)';

  return (
    <div style={{ minHeight: '100vh', background: '#060D18', fontFamily: 'Tajawal, sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr', position: 'relative' }}>
      <style>{`
        @keyframes twinkle    { 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes pulse-glow { 0%,100%{opacity:0.06;transform:scale(1)} 50%{opacity:0.11;transform:scale(1.04)} }
        ::-webkit-scrollbar{width:6px}
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

      {/* HEADER */}
      <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '0 16px' : '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,13,24,0.85)', backdropFilter: 'blur(20px)' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {lang === 'ar' ? <Icon name="arrowR" size={13} color="rgba(255,255,255,0.5)"/> : <Icon name="arrow" size={13} color="rgba(255,255,255,0.5)"/>}
          {!isMobile && T.back}
        </a>
        <span style={{ color: 'white', fontSize: isMobile ? '13px' : '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Icon name="plane" size={14} color="#D4AC0D"/>{T.title}
        </span>
        <button onClick={handleDelete} style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', color: '#E74C3C', padding: isMobile ? '7px 10px' : '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '5px', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(192,57,43,0.15)'}
        >
          <Icon name="trash" size={13} color="#E74C3C"/>
          {!isMobile && T.delete}
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '20px 16px' : '28px 20px', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <div style={{ borderRadius: '24px', overflow: 'hidden', marginBottom: '16px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : '260px', background: cardBg, border: cardBorder, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

          {/* صورة — فوق على الجوال */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? '200px' : 'auto', order: isMobile ? -1 : 0 }}>
            <img src={visit.photo_url || getFlagUrl(visit.country_code)} alt={visit.city} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: isMobile ? '200px' : '260px' }}/>
            <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to bottom,transparent 60%,rgba(6,13,24,0.5) 100%)' : lang==='ar' ? 'linear-gradient(to left,transparent 60%,rgba(6,13,24,0.4) 100%)' : 'linear-gradient(to right,transparent 60%,rgba(6,13,24,0.4) 100%)' }}/>
            {visit.photo_url && (
              <div style={{ position: 'absolute', bottom: '12px', [lang==='ar'?'right':'left']: '12px', background: 'rgba(6,13,24,0.85)', backdropFilter: 'blur(8px)', borderRadius: '10px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={getFlagUrl(visit.country_code)} alt="" style={{ width: '18px', borderRadius: '2px' }}/>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>{getCountryName(visit, lang)}</span>
              </div>
            )}
          </div>

          {/* معلومات */}
          <div style={{ padding: isMobile ? '20px' : '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,172,13,0.12)', border: '1px solid rgba(212,172,13,0.2)', padding: '4px 12px', borderRadius: '20px', marginBottom: '12px' }}>
                <img src={getFlagUrl(visit.country_code)} alt="" style={{ width: '16px', borderRadius: '2px' }}/>
                <span style={{ color: '#D4AC0D', fontSize: '12px', fontWeight: '700' }}>{getCountryName(visit, lang)}</span>
              </div>
              <div style={{ fontSize: isMobile ? '28px' : 'clamp(28px,4vw,42px)', fontWeight: '900', color: 'white', lineHeight: 1.1 }}>{visit.city}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: isMobile ? '1' : 'unset', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', padding: '12px 14px', borderRadius: '14px' }}>
                <Icon name="calendar" size={16} color="rgba(255,255,255,0.4)"/>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>{T.visitDate}</div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '800', color: 'white' }}>{visit.visit_date}</div>
                </div>
              </div>
              <div style={{ flex: isMobile ? '1' : 'unset', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(212,172,13,0.08)', border: '1px solid rgba(212,172,13,0.15)', padding: '12px 14px', borderRadius: '14px' }}>
                <Icon name="star" size={16} color="#D4AC0D"/>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>{T.rating}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {Array.from({ length: visit.rating }).map((_, i) => <Icon key={i} name="star" size={12} color="#D4AC0D"/>)}
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginRight: '4px', marginLeft: '4px' }}>({visit.rating}/5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ملاحظات + موقع */}
        {(visit.notes || (visit.latitude && visit.longitude)) && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : visit.notes && visit.latitude ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '16px' }}>
            {visit.notes && (
              <div style={{ background: cardBg, border: cardBorder, borderRadius: '20px', padding: isMobile ? '16px' : '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Icon name="notes" size={14} color="rgba(255,255,255,0.5)"/>{T.notes}
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px', borderRight: lang==='ar' ? '3px solid #C0392B' : 'none', borderLeft: lang==='en' ? '3px solid #C0392B' : 'none' }}>
                  {visit.notes}
                </p>
              </div>
            )}
            {visit.latitude && visit.longitude && (
              <div style={{ background: cardBg, border: cardBorder, borderRadius: '20px', padding: isMobile ? '16px' : '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Icon name="pin" size={14} color="rgba(255,255,255,0.5)"/>{T.location}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[{ label: T.lat, val: parseFloat(visit.latitude).toFixed(4) }, { label: T.lng, val: parseFloat(visit.longitude).toFixed(4) }].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>{item.val}</span>
                    </div>
                  ))}
                  <a href={`https://www.google.com/maps?q=${visit.latitude},${visit.longitude}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: 'rgba(46,134,193,0.15)', border: '1px solid rgba(46,134,193,0.3)', color: '#2E86C1', padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                    <Icon name="externalLink" size={13} color="#2E86C1"/>{T.openMap}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* زر تعديل */}
        <a href={`/edit-visit/${visit.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', color: 'white', padding: '15px', borderRadius: '16px', fontSize: '15px', fontWeight: '800', textDecoration: 'none', boxShadow: '0 8px 24px rgba(192,57,43,0.4)' }}>
          <Icon name="edit" size={16} color="white"/>{T.edit}
        </a>
      </div>
    </div>
  );
}

export default VisitDetail;