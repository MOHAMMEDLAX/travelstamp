import { useState, useEffect, useRef } from 'react';
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
  in: { ar: 'الهند',            en: 'India' },
  br: { ar: 'البرازيل',         en: 'Brazil' },
  mx: { ar: 'المكسيك',          en: 'Mexico' },
  ca: { ar: 'كندا',             en: 'Canada' },
  au: { ar: 'أستراليا',         en: 'Australia' },
  ru: { ar: 'روسيا',            en: 'Russia' },
  za: { ar: 'جنوب أفريقيا',     en: 'South Africa' },
  ng: { ar: 'نيجيريا',          en: 'Nigeria' },
  ke: { ar: 'كينيا',            en: 'Kenya' },
  gh: { ar: 'غانا',             en: 'Ghana' },
  tz: { ar: 'تنزانيا',          en: 'Tanzania' },
  zm: { ar: 'زامبيا',           en: 'Zambia' },
  dz: { ar: 'الجزائر',          en: 'Algeria' },
  tn: { ar: 'تونس',             en: 'Tunisia' },
  ly: { ar: 'ليبيا',            en: 'Libya' },
  sd: { ar: 'السودان',          en: 'Sudan' },
  iq: { ar: 'العراق',           en: 'Iraq' },
  sy: { ar: 'سوريا',            en: 'Syria' },
  jo: { ar: 'الأردن',           en: 'Jordan' },
  lb: { ar: 'لبنان',            en: 'Lebanon' },
  kw: { ar: 'الكويت',           en: 'Kuwait' },
  qa: { ar: 'قطر',              en: 'Qatar' },
  bh: { ar: 'البحرين',          en: 'Bahrain' },
  om: { ar: 'عُمان',            en: 'Oman' },
  ye: { ar: 'اليمن',            en: 'Yemen' },
  pk: { ar: 'باكستان',          en: 'Pakistan' },
  id: { ar: 'إندونيسيا',        en: 'Indonesia' },
  my: { ar: 'ماليزيا',          en: 'Malaysia' },
  th: { ar: 'تايلاند',          en: 'Thailand' },
  sg: { ar: 'سنغافورة',         en: 'Singapore' },
  ph: { ar: 'الفلبين',          en: 'Philippines' },
  kr: { ar: 'كوريا الجنوبية',   en: 'South Korea' },
  nl: { ar: 'هولندا',           en: 'Netherlands' },
  be: { ar: 'بلجيكا',           en: 'Belgium' },
  ch: { ar: 'سويسرا',           en: 'Switzerland' },
  at: { ar: 'النمسا',           en: 'Austria' },
  se: { ar: 'السويد',           en: 'Sweden' },
  no: { ar: 'النرويج',          en: 'Norway' },
  dk: { ar: 'الدنمارك',         en: 'Denmark' },
  fi: { ar: 'فنلندا',           en: 'Finland' },
  pl: { ar: 'بولندا',           en: 'Poland' },
  pt: { ar: 'البرتغال',         en: 'Portugal' },
  gr: { ar: 'اليونان',          en: 'Greece' },
  cz: { ar: 'التشيك',           en: 'Czech Republic' },
  hu: { ar: 'هنغاريا',          en: 'Hungary' },
  ro: { ar: 'رومانيا',          en: 'Romania' },
  ua: { ar: 'أوكرانيا',         en: 'Ukraine' },
  ar: { ar: 'الأرجنتين',        en: 'Argentina' },
  cl: { ar: 'تشيلي',            en: 'Chile' },
  co: { ar: 'كولومبيا',         en: 'Colombia' },
  pe: { ar: 'بيرو',             en: 'Peru' },
  nz: { ar: 'نيوزيلندا',        en: 'New Zealand' },
  mv: { ar: 'المالديف',         en: 'Maldives' },
};

function getCountryName(code, fallback, lang) {
  const c = code?.toLowerCase();
  if (c && COUNTRY_NAMES[c]) return COUNTRY_NAMES[c][lang];
  return fallback;
}

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display: 'inline-block' };
  const icons = {
    arrow:   <svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    arrowR:  <svg style={s} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    chart:   <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    plane:   <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
    globe:   <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
    city:    <svg style={s} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    star:    <svg style={{ ...s, fill: color }} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trophy:  <svg style={s} viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5h12v4a6 6 0 0 1-12 0V5z"/></svg>,
    starEmpty:<svg style={s} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  };
  return icons[name] || null;
};

function Stats() {
  const { lang } = useApp();

  const T = {
    ar: {
      back: 'رجوع', title: 'الإحصائيات', loading: 'جاري التحميل...',
      trips: 'رحلة موثقة', countries: 'دولة مختلفة', cities: 'مدينة زرتها', avgRating: 'متوسط التقييم',
      topCountries: 'أكثر الدول زيارة', noData: 'لا توجد بيانات',
      visit: 'زيارة', visits: 'زيارات',
      ratingDist: 'توزيع التقييمات', avgLabel: 'متوسط تقييماتك',
    },
    en: {
      back: 'Back', title: 'Statistics', loading: 'Loading...',
      trips: 'Trips', countries: 'Countries', cities: 'Cities', avgRating: 'Avg. Rating',
      topCountries: 'Most Visited Countries', noData: 'No data yet',
      visit: 'visit', visits: 'visits',
      ratingDist: 'Rating Distribution', avgLabel: 'Your average rating',
    }
  }[lang];

  const [visits,   setVisits]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
    fetchVisits();
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get('https://travelstamp-backend-production.up.railway.app/api/visits', { headers: { Authorization: `Bearer ${token}` } });
      setVisits(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const totalVisits    = visits.length;
  const totalCountries = [...new Set(visits.map(v => v.country_code))].length;
  const totalCities    = [...new Set(visits.map(v => v.city))].length;
  const avgRating      = totalVisits ? (visits.reduce((s, v) => s + v.rating, 0) / totalVisits).toFixed(1) : 0;

  const countryCodeCounts = visits.reduce((acc, v) => {
    const code = v.country_code?.toLowerCase();
    if (!code) return acc;
    if (!acc[code]) acc[code] = { count: 0, fallback: v.country };
    acc[code].count += 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryCodeCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 5);
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: visits.filter(v => v.rating === r).length }));
  const maxCount = Math.max(...topCountries.map(([, d]) => d.count), 1);

  const statCards = [
    { num: totalVisits,    label: T.trips,     icon: 'plane',  color: '#C0392B', glow: 'rgba(192,57,43,0.25)' },
    { num: totalCountries, label: T.countries,  icon: 'globe',  color: '#2E86C1', glow: 'rgba(46,134,193,0.25)' },
    { num: totalCities,    label: T.cities,     icon: 'city',   color: '#27AE60', glow: 'rgba(39,174,96,0.25)' },
    { num: avgRating,      label: T.avgRating,  icon: 'star',   color: '#D4AC0D', glow: 'rgba(212,172,13,0.25)' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060D18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tajawal, sans-serif', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>{T.loading}</div>
  );

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
      <div style={{ position: 'relative', zIndex: 10, padding: isMobile ? '0 16px' : '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,13,24,0.85)', backdropFilter: 'blur(20px)' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {lang === 'ar' ? <Icon name="arrowR" size={13} color="rgba(255,255,255,0.5)"/> : <Icon name="arrow" size={13} color="rgba(255,255,255,0.5)"/>}
          {!isMobile && T.back}
        </a>
        <span style={{ color: 'white', fontSize: isMobile ? '13px' : '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Icon name="chart" size={15} color="#D4AC0D"/>{T.title}
        </span>
        <div style={{ width: isMobile ? '36px' : '80px' }}/>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '20px 16px 40px' : '28px 20px 40px', position: 'relative', zIndex: 1 }}>

        {/* بطاقات الأرقام */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '14px', marginBottom: '20px' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '16px 12px' : '20px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '80px', background: card.glow, borderRadius: '50%', filter: 'blur(25px)' }}/>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <Icon name={card.icon} size={isMobile ? 20 : 22} color={card.color}/>
              </div>
              <div style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '900', color: card.color, lineHeight: 1 }}>{card.num}</div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.35)', marginTop: '6px', fontWeight: '600' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* أكثر الدول + التقييمات */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>

          {/* أكثر الدول زيارة */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '18px' : '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Icon name="trophy" size={14} color="rgba(255,255,255,0.5)"/>{T.topCountries}
            </div>
            {topCountries.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px', padding: '20px' }}>{T.noData}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {topCountries.map(([code, data], i) => (
                  <div key={code}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '20px', height: '20px', background: i === 0 ? 'rgba(212,172,13,0.2)' : 'rgba(255,255,255,0.06)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', color: i === 0 ? '#D4AC0D' : 'rgba(255,255,255,0.3)' }}>{i + 1}</span>
                        <img src={`https://flagcdn.com/w40/${code}.png`} alt="" style={{ width: '18px', borderRadius: '2px' }}/>
                        <span style={{ fontSize: '13px', color: 'white', fontWeight: '700' }}>{getCountryName(code, data.fallback, lang)}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: i === 0 ? '#D4AC0D' : 'rgba(255,255,255,0.4)' }}>
                        {data.count} {data.count === 1 ? T.visit : T.visits}
                      </span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '10px', width: `${(data.count / maxCount) * 100}%`, background: i === 0 ? 'linear-gradient(90deg,#D4AC0D,#F4D03F)' : 'linear-gradient(90deg,#C0392B,#E74C3C)', transition: 'width 0.8s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* توزيع التقييمات */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '18px' : '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Icon name="starEmpty" size={14} color="rgba(255,255,255,0.5)"/>{T.ratingDist}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: rating }).map((_, i) => <Icon key={i} name="star" size={12} color="#D4AC0D"/>)}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>{count}</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '10px', width: totalVisits ? `${(count / totalVisits) * 100}%` : '0%', background: 'linear-gradient(90deg,#D4AC0D,#F4D03F)', transition: 'width 0.8s ease' }}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(212,172,13,0.08)', border: '1px solid rgba(212,172,13,0.15)', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '4px' }}>
                {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} color={i < Math.round(avgRating) ? '#D4AC0D' : 'rgba(255,255,255,0.1)'}/>)}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#D4AC0D' }}>{avgRating}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{T.avgLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;