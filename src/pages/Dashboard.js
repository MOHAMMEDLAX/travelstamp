import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const COUNTRY_NAMES = {
  ma: { ar: 'المغرب',       en: 'Morocco' },
  fr: { ar: 'فرنسا',        en: 'France' },
  us: { ar: 'الولايات المتحدة', en: 'United States' },
  gb: { ar: 'المملكة المتحدة',  en: 'United Kingdom' },
  de: { ar: 'ألمانيا',      en: 'Germany' },
  es: { ar: 'إسبانيا',      en: 'Spain' },
  it: { ar: 'إيطاليا',      en: 'Italy' },
  sa: { ar: 'السعودية',     en: 'Saudi Arabia' },
  ae: { ar: 'الإمارات',     en: 'UAE' },
  eg: { ar: 'مصر',          en: 'Egypt' },
  tr: { ar: 'تركيا',        en: 'Turkey' },
  jp: { ar: 'اليابان',      en: 'Japan' },
  cn: { ar: 'الصين',        en: 'China' },
  in: { ar: 'الهند',        en: 'India' },
  br: { ar: 'البرازيل',     en: 'Brazil' },
  mx: { ar: 'المكسيك',      en: 'Mexico' },
  ca: { ar: 'كندا',         en: 'Canada' },
  au: { ar: 'أستراليا',     en: 'Australia' },
  ru: { ar: 'روسيا',        en: 'Russia' },
  za: { ar: 'جنوب أفريقيا', en: 'South Africa' },
  ng: { ar: 'نيجيريا',      en: 'Nigeria' },
  ke: { ar: 'كينيا',        en: 'Kenya' },
  gh: { ar: 'غانا',         en: 'Ghana' },
  tz: { ar: 'تنزانيا',      en: 'Tanzania' },
  zm: { ar: 'زامبيا',       en: 'Zambia' },
  dz: { ar: 'الجزائر',      en: 'Algeria' },
  tn: { ar: 'تونس',         en: 'Tunisia' },
  ly: { ar: 'ليبيا',        en: 'Libya' },
  sd: { ar: 'السودان',      en: 'Sudan' },
  iq: { ar: 'العراق',       en: 'Iraq' },
  sy: { ar: 'سوريا',        en: 'Syria' },
  jo: { ar: 'الأردن',       en: 'Jordan' },
  lb: { ar: 'لبنان',        en: 'Lebanon' },
  kw: { ar: 'الكويت',       en: 'Kuwait' },
  qa: { ar: 'قطر',          en: 'Qatar' },
  bh: { ar: 'البحرين',      en: 'Bahrain' },
  om: { ar: 'عُمان',        en: 'Oman' },
  ye: { ar: 'اليمن',        en: 'Yemen' },
  pk: { ar: 'باكستان',      en: 'Pakistan' },
  id: { ar: 'إندونيسيا',    en: 'Indonesia' },
  my: { ar: 'ماليزيا',      en: 'Malaysia' },
  th: { ar: 'تايلاند',      en: 'Thailand' },
  sg: { ar: 'سنغافورة',     en: 'Singapore' },
  ph: { ar: 'الفلبين',      en: 'Philippines' },
  kr: { ar: 'كوريا الجنوبية', en: 'South Korea' },
  nl: { ar: 'هولندا',       en: 'Netherlands' },
  be: { ar: 'بلجيكا',       en: 'Belgium' },
  ch: { ar: 'سويسرا',       en: 'Switzerland' },
  at: { ar: 'النمسا',       en: 'Austria' },
  se: { ar: 'السويد',       en: 'Sweden' },
  no: { ar: 'النرويج',      en: 'Norway' },
  dk: { ar: 'الدنمارك',     en: 'Denmark' },
  fi: { ar: 'فنلندا',       en: 'Finland' },
  pl: { ar: 'بولندا',       en: 'Poland' },
  pt: { ar: 'البرتغال',     en: 'Portugal' },
  gr: { ar: 'اليونان',      en: 'Greece' },
  cz: { ar: 'التشيك',       en: 'Czech Republic' },
  hu: { ar: 'هنغاريا',      en: 'Hungary' },
  ro: { ar: 'رومانيا',      en: 'Romania' },
  ua: { ar: 'أوكرانيا',     en: 'Ukraine' },
  ar: { ar: 'الأرجنتين',    en: 'Argentina' },
  cl: { ar: 'تشيلي',        en: 'Chile' },
  co: { ar: 'كولومبيا',     en: 'Colombia' },
  pe: { ar: 'بيرو',         en: 'Peru' },
  nz: { ar: 'نيوزيلندا',    en: 'New Zealand' },
  mv: { ar: 'المالديف',     en: 'Maldives' },
};

function getCountryName(visit, lang) {
  const code = visit.country_code?.toLowerCase();
  if (code && COUNTRY_NAMES[code]) return COUNTRY_NAMES[code][lang];
  return visit.country;
}

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 };
  const icons = {
    plane:    <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
    bars:     <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    plus:     <svg style={s} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search:   <svg style={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    bell:     <svg style={s} viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    user:     <svg style={s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout:   <svg style={s} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    pin:      <svg style={s} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    calendar: <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    star:     <svg style={{ ...s, fill: color }} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trophy:   <svg style={s} viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
    check:    <svg style={s} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    close:    <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    map:      <svg style={s} viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    lang:     <svg style={s} viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>,
    medal:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    grid:     <svg style={s} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    chevron:  <svg style={s} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
    menu:     <svg style={s} viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    filter:   <svg style={s} viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  };
  return icons[name] || null;
};

function Dashboard() {
  const { lang, setLang } = useApp();

  const [visits,       setVisits]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy,       setSortBy]       = useState('date_desc');
  const [scrolled,     setScrolled]     = useState(false);
  const [userName,     setUserName]     = useState('');
  const [showNotif,    setShowNotif]    = useState(false);
  const [mobileMenu,   setMobileMenu]   = useState(false);
  const [showFilter,   setShowFilter]   = useState(false);
  const [isMobile,     setIsMobile]     = useState(window.innerWidth < 768);

  const starsRef = useRef([]);
  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i, width: Math.random() * 1.8 + 0.5,
      top: Math.random() * 100, left: Math.random() * 100,
      dur: (Math.random() * 4 + 2).toFixed(1),
      delay: (Math.random() * 5).toFixed(1),
      opacity: (Math.random() * 0.4 + 0.1).toFixed(2),
    }));
  }

  const token = localStorage.getItem('token');

  const T = {
    ar: {
      badge: 'MY TRAVEL JOURNAL', title: 'رحلاتك حول العالم',
      addVisit: 'إضافة', map: 'الخريطة', stats: 'الإحصائيات',
      trips: 'رحلة', countries: 'دولة', cities: 'مدينة',
      searchPlaceholder: 'ابحث عن مدينة أو دولة...',
      allTrips: 'كل الرحلات', ratingLabel: 'التقييم:',
      all: 'الكل', newest: 'الأحدث', oldest: 'الأقدم',
      highRating: 'الأعلى تقييماً', lowRating: 'الأدنى تقييماً',
      noResults: 'لا توجد نتائج', clearFilter: 'مسح الفلتر',
      startFirst: 'ابدأ رحلتك الأولى', startSub: 'وثّق رحلاتك واحفظ ذكرياتك للأبد',
      loading: 'جاري التحميل...', notifTitle: 'الإشعارات',
      profile: 'ملفي', newBadge: 'جديد',
    },
    en: {
      badge: 'MY TRAVEL JOURNAL', title: 'Your Trips Around the World',
      addVisit: 'Add', map: 'Map', stats: 'Stats',
      trips: 'Trips', countries: 'Countries', cities: 'Cities',
      searchPlaceholder: 'Search city or country...',
      allTrips: 'All Trips', ratingLabel: 'Rating:',
      all: 'All', newest: 'Newest', oldest: 'Oldest',
      highRating: 'Highest Rated', lowRating: 'Lowest Rated',
      noResults: 'No Results Found', clearFilter: 'Clear Filter',
      startFirst: 'Start Your First Trip', startSub: 'Document your trips and save memories forever',
      loading: 'Loading...', notifTitle: 'Notifications',
      profile: 'Profile', newBadge: 'New',
    }
  }[lang];

  const totalCountries = [...new Set(visits.map(v => v.country_code))].length;
  const totalCities    = [...new Set(visits.map(v => v.city))].length;

  const buildNotifications = () => {
    const notifs = [];
    notifs.push({ type:'reminder', iconName:'plane', text: lang==='ar'?'لديك رحلات لم توثّقها بعد؟ أضف زيارة جديدة الآن!':'Have unlogged trips? Add a new visit now!', color:'#2E86C1', action:'/add-visit', actionLabel: lang==='ar'?'إضافة الآن':'Add Now' });
    notifs.push({ type:'stats', iconName:'bars', text: lang==='ar'?`عندك ${visits.length} رحلة في ${totalCountries} دولة و${totalCities} مدينة!`:`You have ${visits.length} trips across ${totalCountries} countries & ${totalCities} cities!`, color:'#D4AC0D' });
    [{ n:1,ar:'أول رحلة!',en:'First trip logged!'},{n:5,ar:'5 رحلات! مسافر حقيقي',en:'5 trips! Real traveler!'},{n:10,ar:'10 رحلات! مستوى جديد',en:'10 trips! New level!'},{n:25,ar:'25 رحلة! نخبة المسافرين',en:'25 trips! Elite traveler!'},{n:50,ar:'50 رحلة! أسطورة',en:'50 trips! Legendary!'}].forEach(m=>{ if(visits.length>=m.n) notifs.push({type:'milestone',iconName:'medal',text:lang==='ar'?m.ar:m.en,color:'#D4AC0D'}); });
    [{ n:3,ar:'زرت 3 دول!',en:'3 countries!'},{n:5,ar:'5 دول!',en:'5 countries!'},{n:10,ar:'10 دول!',en:'10 countries!'},{n:20,ar:'20 دولة!',en:'20 countries!'}].forEach(m=>{ if(totalCountries>=m.n) notifs.push({type:'milestone',iconName:'trophy',text:lang==='ar'?m.ar:m.en,color:'#27AE60'}); });
    return notifs;
  };

  const notifications  = buildNotifications();
  const milestoneCount = notifications.filter(n => n.type === 'milestone').length;

  const bg         = '#060D18';
  const cardBg     = 'rgba(255,255,255,0.04)';
  const cardBorder = 'rgba(255,255,255,0.08)';
  const textColor  = 'white';
  const subColor   = 'rgba(255,255,255,0.45)';
  const inputBg    = 'rgba(255,255,255,0.06)';
  const dropdownBg = '#0d1e32';

  useEffect(() => {
    fetchVisits(); fetchUser();
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get('https://travelstamp-backend-production.up.railway.app/api/visits', { headers: { Authorization: `Bearer ${token}` } });
      setVisits(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('https://travelstamp-backend-production.up.railway.app/api/user', { headers: { Authorization: `Bearer ${token}` } });
      setUserName(res.data.name);
    } catch (err) {}
  };

  const getInitials = name => name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  const getFlagUrl  = code  => `https://flagcdn.com/w320/${code?.toLowerCase()}.png`;

  const filtered = visits
    .filter(v => {
      const q = search.toLowerCase();
      const countryDisplay = getCountryName(v, lang).toLowerCase();
      const matchSearch = v.city.toLowerCase().includes(q) || countryDisplay.includes(q) || (v.notes && v.notes.toLowerCase().includes(q));
      return matchSearch && (filterRating === 0 || v.rating === filterRating);
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc')   return new Date(b.visit_date) - new Date(a.visit_date);
      if (sortBy === 'date_asc')    return new Date(a.visit_date) - new Date(b.visit_date);
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'rating_asc')  return a.rating - b.rating;
      return 0;
    });

  const iconBtn = { background: cardBg, border: `1px solid ${cardBorder}`, color: subColor, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 };

  return (
    <div
      style={{ minHeight:'100vh', background:bg, fontFamily:'Tajawal, sans-serif', direction:lang==='ar'?'rtl':'ltr', position:'relative' }}
      onClick={() => { showNotif && setShowNotif(false); mobileMenu && setMobileMenu(false); showFilter && setShowFilter(false); }}
    >
      <style>{`
        @keyframes twinkle    { 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes pulse-glow { 0%,100%{opacity:0.06;transform:scale(1)} 50%{opacity:0.11;transform:scale(1.04)} }
        @keyframes slideDown  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.03);border-radius:10px}
        ::-webkit-scrollbar-thumb{background:rgba(192,57,43,0.4);border-radius:10px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(192,57,43,0.7)}
        .dash-input::placeholder{color:rgba(255,255,255,0.25)}
        .dash-input:focus{border-color:rgba(192,57,43,0.4)!important;outline:none}
        .visit-card:hover{transform:translateY(-6px)!important;box-shadow:0 20px 40px rgba(0,0,0,0.25)!important}
      `}</style>

      {/* نجوم */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        {starsRef.current.map(s => (
          <div key={s.id} style={{ position:'absolute', width:s.width+'px', height:s.width+'px', borderRadius:'50%', background:'white', top:s.top+'%', left:s.left+'%', opacity:s.opacity, animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }}/>
        ))}
        <div style={{ position:'absolute', top:'-150px', right:'-150px', width:'500px', height:'500px', background:'rgba(192,57,43,0.07)', borderRadius:'50%', filter:'blur(80px)', animation:'pulse-glow 7s ease-in-out infinite' }}/>
        <div style={{ position:'absolute', bottom:'-150px', left:'-150px', width:'500px', height:'500px', background:'rgba(46,134,193,0.07)', borderRadius:'50%', filter:'blur(80px)', animation:'pulse-glow 9s ease-in-out 2s infinite' }}/>
      </div>

      {/* ══ NAVBAR ══ */}
      <div style={{
        padding: isMobile ? '0 16px' : '0 24px', height:'64px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        position:'sticky', top:0, zIndex:1000, transition:'all 0.3s',
        background: scrolled ? 'rgba(6,13,24,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom:`1px solid ${scrolled ? cardBorder : 'transparent'}`,
      }}>
        {/* لوغو */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
          <img src="/logo.png" alt="TravelStamp" style={{ width:'38px', height:'38px', objectFit:'contain' }}/>
          <span style={{ color:textColor, fontSize: isMobile ? '15px' : '17px', fontWeight:'900', letterSpacing:'-0.5px' }}>
            <a href="/" style={{ color:'inherit', textDecoration:'none' }}>
              Travel<span style={{ color:'#D4AC0D' }}>Stamp</span>
            </a>
          </span>
          {visits.length > 0 && !isMobile && (
            <div style={{ background:'rgba(192,57,43,0.12)', border:'1px solid rgba(192,57,43,0.22)', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'800', color:'#E74C3C', display:'flex', alignItems:'center', gap:'5px' }}>
              <Icon name="plane" size={10} color="#E74C3C" strokeWidth={2}/>
              {visits.length} {lang==='ar'?'رحلة':'trips'}
            </div>
          )}
        </div>

        {/* روابط وسط — تختفي على الجوال */}
        {!isMobile && (
          <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
            {[{ href:'/map', label:T.map, icon:'globe' }, { href:'/stats', label:T.stats, icon:'bars' }].map(item => (
              <a key={item.href} href={item.href} style={{ display:'flex', alignItems:'center', gap:'6px', color:subColor, textDecoration:'none', padding:'7px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', background:cardBg, border:`1px solid ${cardBorder}`, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color=textColor; e.currentTarget.style.background=inputBg; }}
                onMouseLeave={e => { e.currentTarget.style.color=subColor;  e.currentTarget.style.background=cardBg; }}
              >
                <Icon name={item.icon} size={13} color="currentColor"/>
                {item.label}
              </a>
            ))}
            <a href="/add-visit" style={{ display:'flex', alignItems:'center', gap:'6px', background:'linear-gradient(135deg,#C0392B,#E74C3C)', color:'white', textDecoration:'none', padding:'7px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:'800', boxShadow:'0 4px 14px rgba(192,57,43,0.35)' }}>
              <Icon name="plus" size={13} color="white" strokeWidth={2.5}/>
              {T.addVisit}
            </a>
          </div>
        )}

        {/* يمين الناف */}
        <div style={{ display:'flex', gap:'6px', alignItems:'center', flexShrink:0 }}>
          {/* زر اللغة */}
          {!isMobile && (
            <button onClick={e => { e.stopPropagation(); setLang(lang==='ar'?'en':'ar'); }} style={{ ...iconBtn, width:'auto', borderRadius:'20px', padding:'7px 12px', gap:'5px', fontSize:'11px', fontWeight:'800', color:subColor, fontFamily:'Tajawal, sans-serif' }}>
              <Icon name="lang" size={13} color={subColor}/>
              {lang==='ar'?'EN':'عر'}
            </button>
          )}

          {/* الإشعارات */}
          <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowNotif(!showNotif)} style={{ ...iconBtn, border: milestoneCount>0 ? '1px solid rgba(212,172,13,0.45)' : `1px solid ${cardBorder}`, position:'relative' }}>
              <Icon name="bell" size={15} color={subColor}/>
              {milestoneCount > 0 && (
                <span style={{ position:'absolute', top:'-2px', right:lang==='ar'?'auto':'-2px', left:lang==='ar'?'-2px':'auto', width:'16px', height:'16px', background:'#E74C3C', borderRadius:'50%', border:`2px solid ${bg}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:'900', color:'white' }}>{milestoneCount}</span>
              )}
            </button>
            {showNotif && (
              <div style={{ position:'absolute', top:'calc(100% + 10px)', right: isMobile ? 'auto' : (lang==='ar' ? 'auto' : 0),
left: isMobile ? '50%' : (lang==='ar' ? 0 : 'auto'),
transform: isMobile ? 'translateX(-50%)' : 'none',
width: isMobile ? '220px' : '290px', background:dropdownBg, border:`1px solid ${cardBorder}`, borderRadius:'18px', boxShadow:'0 20px 50px rgba(0,0,0,0.3)', overflow:'hidden', zIndex:9999, animation:'slideDown 0.2s ease' }}>
                <div style={{ padding:'13px 16px', borderBottom:`1px solid ${cardBorder}`, fontSize:'12px', fontWeight:'800', color:subColor, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'7px' }}><Icon name="bell" size={13} color={subColor}/><span>{T.notifTitle}</span></div>
                  {milestoneCount > 0 && <span style={{ background:'rgba(212,172,13,0.15)', border:'1px solid rgba(212,172,13,0.25)', color:'#D4AC0D', padding:'2px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:'800' }}>{milestoneCount} {T.newBadge}</span>}
                </div>
                <div style={{ maxHeight:'300px', overflowY:'auto' }}>
                  {notifications.map((n, i) => (
                    <div key={i} style={{ padding:'12px 16px', borderBottom: i<notifications.length-1 ? `1px solid ${cardBorder}` : 'none', background: n.type==='milestone' ? `${n.color}0D` : 'transparent', display:'flex', gap:'10px', alignItems:'flex-start' }}>
                      <div style={{ width:'32px', height:'32px', flexShrink:0, background:`${n.color}18`, border:`1px solid ${n.color}30`, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon name={n.iconName} size={14} color={n.color}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'12px', color:textColor, lineHeight:'1.6', fontWeight:'600' }}>{n.text}</div>
                        {n.action && <a href={n.action} style={{ display:'inline-block', marginTop:'6px', background:`${n.color}18`, border:`1px solid ${n.color}30`, color:n.color, padding:'4px 10px', borderRadius:'10px', fontSize:'11px', fontWeight:'800', textDecoration:'none' }}>{n.actionLabel}</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ProfileMenu */}
          <ProfileMenu userName={userName} getInitials={getInitials} cardBg={cardBg} cardBorder={cardBorder} inputBg={inputBg} subColor={subColor} lang={lang} T={T} bg={bg} dropdownBg={dropdownBg} isMobile={isMobile}/>

          {/* هامبرغر على الجوال */}
          {isMobile && (
            <button onClick={e => { e.stopPropagation(); setMobileMenu(!mobileMenu); }} style={{ ...iconBtn, width:'36px' }}>
              <Icon name={mobileMenu ? 'close' : 'menu'} size={17} color={subColor}/>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && isMobile && (
        <div onClick={e => e.stopPropagation()} style={{ position:'fixed', top:'64px', left:0, right:0, zIndex:999, background:'rgba(6,13,24,0.97)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${cardBorder}`, padding:'12px 16px', display:'flex', flexDirection:'column', gap:'8px', animation:'slideDown 0.2s ease' }}>
          {[{ href:'/map', label:T.map, icon:'globe' }, { href:'/stats', label:T.stats, icon:'bars' }].map(item => (
            <a key={item.href} href={item.href} style={{ display:'flex', alignItems:'center', gap:'10px', color:'rgba(255,255,255,0.7)', textDecoration:'none', padding:'12px 16px', borderRadius:'12px', fontSize:'14px', fontWeight:'700', background:cardBg, border:`1px solid ${cardBorder}` }}>
              <Icon name={item.icon} size={16} color={subColor}/>{item.label}
            </a>
          ))}
          <div style={{ display:'flex', gap:'8px' }}>
            <a href="/add-visit" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', background:'linear-gradient(135deg,#C0392B,#E74C3C)', color:'white', textDecoration:'none', padding:'12px', borderRadius:'12px', fontSize:'13px', fontWeight:'800' }}>
              <Icon name="plus" size={14} color="white" strokeWidth={2.5}/>{T.addVisit}
            </a>
            <button onClick={() => setLang(lang==='ar'?'en':'ar')} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', background:cardBg, border:`1px solid ${cardBorder}`, color:subColor, padding:'12px', borderRadius:'12px', fontSize:'13px', fontWeight:'800', cursor:'pointer', fontFamily:'Tajawal, sans-serif' }}>
              <Icon name="lang" size={14} color={subColor}/>{lang==='ar'?'English':'عربي'}
            </button>
          </div>
        </div>
      )}

      {/* ══ CONTENT ══ */}
      <div style={{ padding: isMobile ? '24px 16px 32px' : '40px 32px 32px', maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:1 }}>

        <div style={{ marginBottom:'8px' }}>
          <span style={{ background:'rgba(212,172,13,0.15)', color:'#D4AC0D', fontSize:'11px', fontWeight:'800', padding:'4px 12px', borderRadius:'20px', letterSpacing:'1px' }}>{T.badge}</span>
        </div>
        <h1 style={{ color:textColor, fontSize: isMobile ? '26px' : 'clamp(28px,4vw,48px)', fontWeight:'900', margin:'10px 0 24px', lineHeight:'1.2' }}>{T.title}</h1>

        {/* Stats Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: isMobile ? '10px' : '16px', marginBottom: isMobile ? '20px' : '32px' }}>
          {[
            { num:visits.length,  label:T.trips,     iconName:'plane', color:'#C0392B', glow:'rgba(192,57,43,0.3)'  },
            { num:totalCountries, label:T.countries,  iconName:'globe', color:'#2E86C1', glow:'rgba(46,134,193,0.3)' },
            { num:totalCities,    label:T.cities,     iconName:'pin',   color:'#D4AC0D', glow:'rgba(212,172,13,0.3)' },
          ].map((s, i) => (
            <div key={i} style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:'20px', padding: isMobile ? '16px 12px' : '24px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-20px', left:'-20px', width:'80px', height:'80px', background:s.glow, borderRadius:'50%', filter:'blur(30px)' }}/>
              <div style={{ width: isMobile?'34px':'42px', height: isMobile?'34px':'42px', borderRadius:'12px', background: i===0?'rgba(192,57,43,0.15)':i===1?'rgba(46,134,193,0.12)':'rgba(212,172,13,0.12)', border: i===0?'1px solid rgba(192,57,43,0.25)':i===1?'1px solid rgba(46,134,193,0.2)':'1px solid rgba(212,172,13,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'10px' }}>
                <Icon name={s.iconName} size={isMobile?16:20} color={s.color}/>
              </div>
              <div style={{ fontSize: isMobile?'28px':'40px', fontWeight:'900', color:s.color, lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize: isMobile?'10px':'12px', color:subColor, marginTop:'5px', fontWeight:'600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* شريط البحث والفلترة */}
        {visits.length > 0 && (
          <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:'20px', padding: isMobile?'12px':' 16px 20px', marginBottom:'20px' }}>
            {/* سطر البحث */}
            <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom: isMobile ? '0' : '12px' }}>
              <div style={{ position:'relative', flex:1 }}>
                <span style={{ position:'absolute', [lang==='ar'?'right':'left']:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', display:'flex' }}>
                  <Icon name="search" size={14} color={subColor}/>
                </span>
                <input
                  className="dash-input"
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={T.searchPlaceholder}
                  style={{ width:'100%', padding: lang==='ar'?'10px 38px 10px 12px':'10px 12px 10px 38px', borderRadius:'12px', border:`1px solid ${cardBorder}`, background:inputBg, color:textColor, fontSize:'13px', boxSizing:'border-box', fontFamily:'Tajawal, sans-serif' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position:'absolute', [lang==='ar'?'left':'right']:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:subColor, cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <Icon name="close" size={14} color={subColor}/>
                  </button>
                )}
              </div>

              {/* على الجوال: زر الفلتر */}
              {isMobile ? (
                <button onClick={e => { e.stopPropagation(); setShowFilter(!showFilter); }} style={{ ...iconBtn, border: (filterRating>0||sortBy!=='date_desc') ? '1px solid rgba(212,172,13,0.4)' : `1px solid ${cardBorder}`, background: (filterRating>0||sortBy!=='date_desc') ? 'rgba(212,172,13,0.08)' : cardBg, flexShrink:0 }}>
                  <Icon name="filter" size={14} color={(filterRating>0||sortBy!=='date_desc')?'#D4AC0D':subColor}/>
                </button>
              ) : null}

              {/* على الديسكتوب: الفلاتر مباشرة */}
              {!isMobile && (
                <>
                  <div style={{ display:'flex', gap:'5px', alignItems:'center' }}>
                    <span style={{ fontSize:'11px', color:subColor, fontWeight:'700', whiteSpace:'nowrap' }}>{T.ratingLabel}</span>
                    {[0,5,4,3,2,1].map(r => (
                      <button key={r} onClick={() => setFilterRating(r)} style={{ padding:'6px 10px', borderRadius:'20px', border: filterRating===r?'1px solid rgba(212,172,13,0.5)':`1px solid ${cardBorder}`, background: filterRating===r?'rgba(212,172,13,0.12)':cardBg, color: filterRating===r?'#D4AC0D':subColor, fontSize:'11px', fontWeight:'700', cursor:'pointer', fontFamily:'Tajawal, sans-serif', display:'flex', alignItems:'center', gap:'3px' }}>
                        {r===0 ? T.all : <>{r} <Icon name="star" size={10} color={filterRating===r?'#D4AC0D':subColor}/></>}
                      </button>
                    ))}
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:'9px 12px', borderRadius:'12px', border:`1px solid ${cardBorder}`, background:inputBg, color:textColor, fontSize:'12px', fontWeight:'700', outline:'none', fontFamily:'Tajawal, sans-serif', cursor:'pointer' }}>
                    <option value="date_desc"   style={{ background:'#060D18' }}>{T.newest}</option>
                    <option value="date_asc"    style={{ background:'#060D18' }}>{T.oldest}</option>
                    <option value="rating_desc" style={{ background:'#060D18' }}>{T.highRating}</option>
                    <option value="rating_asc"  style={{ background:'#060D18' }}>{T.lowRating}</option>
                  </select>
                </>
              )}
            </div>

            {/* فلاتر الجوال المنسدلة */}
            {isMobile && showFilter && (
              <div onClick={e => e.stopPropagation()} style={{ marginTop:'10px', paddingTop:'10px', borderTop:`1px solid ${cardBorder}`, display:'flex', flexDirection:'column', gap:'10px', animation:'slideDown 0.2s ease' }}>
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'11px', color:subColor, fontWeight:'700', width:'100%', marginBottom:'2px' }}>{T.ratingLabel}</span>
                  {[0,5,4,3,2,1].map(r => (
                    <button key={r} onClick={() => setFilterRating(r)} style={{ padding:'7px 12px', borderRadius:'20px', border: filterRating===r?'1px solid rgba(212,172,13,0.5)':`1px solid ${cardBorder}`, background: filterRating===r?'rgba(212,172,13,0.12)':cardBg, color: filterRating===r?'#D4AC0D':subColor, fontSize:'12px', fontWeight:'700', cursor:'pointer', fontFamily:'Tajawal, sans-serif', display:'flex', alignItems:'center', gap:'3px' }}>
                      {r===0 ? T.all : <>{r} <Icon name="star" size={11} color={filterRating===r?'#D4AC0D':subColor}/></>}
                    </button>
                  ))}
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:'12px', border:`1px solid ${cardBorder}`, background:inputBg, color:textColor, fontSize:'13px', fontWeight:'700', outline:'none', fontFamily:'Tajawal, sans-serif' }}>
                  <option value="date_desc"   style={{ background:'#060D18' }}>{T.newest}</option>
                  <option value="date_asc"    style={{ background:'#060D18' }}>{T.oldest}</option>
                  <option value="rating_desc" style={{ background:'#060D18' }}>{T.highRating}</option>
                  <option value="rating_asc"  style={{ background:'#060D18' }}>{T.lowRating}</option>
                </select>
              </div>
            )}
          </div>
        )}

        {visits.length > 0 && (search || filterRating > 0) && (
          <div style={{ fontSize:'12px', color:subColor, marginBottom:'14px', fontWeight:'600', display:'flex', alignItems:'center', gap:'6px' }}>
            {filtered.length === 0
              ? <><Icon name="close" size={12} color="#E74C3C"/> {T.noResults}</>
              : <><Icon name="check" size={12} color="#27AE60"/> {filtered.length} {lang==='ar'?'نتيجة من أصل':'of'} {visits.length}</>
            }
          </div>
        )}

        {/* Grid الزيارات */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'60px', color:subColor, fontSize:'14px' }}>{T.loading}</div>
        ) : visits.length === 0 ? (
          <div style={{ textAlign:'center', padding: isMobile?'50px 16px':'80px 20px', background:cardBg, borderRadius:'24px', border:`1px dashed ${cardBorder}` }}>
            <div style={{ width:'72px', height:'72px', margin:'0 auto 20px', background:'rgba(46,134,193,0.1)', border:'1px solid rgba(46,134,193,0.2)', borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="map" size={32} color="#2E86C1"/>
            </div>
            <div style={{ fontSize: isMobile?'18px':'20px', fontWeight:'800', color:textColor, marginBottom:'8px' }}>{T.startFirst}</div>
            <div style={{ fontSize:'13px', color:subColor, marginBottom:'24px' }}>{T.startSub}</div>
            <a href="/add-visit" style={{ display:'inline-flex', alignItems:'center', gap:'7px', background:'#C0392B', color:'white', padding:'12px 28px', borderRadius:'20px', fontSize:'13px', fontWeight:'800', textDecoration:'none' }}>
              <Icon name="plus" size={14} color="white" strokeWidth={2.5}/>{T.addVisit}
            </a>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', background:cardBg, borderRadius:'24px', border:`1px dashed ${cardBorder}` }}>
            <div style={{ width:'60px', height:'60px', margin:'0 auto 16px', background:'rgba(255,255,255,0.05)', border:`1px solid ${cardBorder}`, borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="search" size={26} color={subColor}/>
            </div>
            <div style={{ fontSize:'16px', fontWeight:'800', color:textColor, marginBottom:'16px' }}>{T.noResults}</div>
            <button onClick={() => { setSearch(''); setFilterRating(0); }} style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:cardBg, border:`1px solid ${cardBorder}`, color:textColor, padding:'9px 20px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', cursor:'pointer', fontFamily:'Tajawal, sans-serif' }}>
              <Icon name="close" size={12} color={subColor}/>{T.clearFilter}
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:'16px', display:'flex', alignItems:'center', gap:'7px' }}>
              <Icon name="grid" size={13} color={subColor}/>
              <span style={{ color:subColor, fontSize:'13px', fontWeight:'700' }}>{T.allTrips} ({filtered.length})</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(220px,1fr))', gap: isMobile?'10px':'16px' }}>
              {filtered.map(visit => (
                <div key={visit.id} className="visit-card"
                  onClick={() => window.location.href = `/visit/${visit.id}`}
                  style={{ borderRadius:'20px', overflow:'hidden', cursor:'pointer', background:cardBg, border:`1px solid ${cardBorder}`, transition:'all 0.25s' }}
                >
                  <div style={{ position:'relative' }}>
                    <img src={visit.photo_url || getFlagUrl(visit.country_code)} alt={visit.city} style={{ width:'100%', height: isMobile?'110px':'140px', objectFit:'cover', display:'block' }}/>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.6) 100%)' }}/>
                    <div style={{ position:'absolute', top:'8px', left:'8px', background:'rgba(15,31,53,0.85)', backdropFilter:'blur(6px)', padding:'3px 7px', borderRadius:'8px', display:'flex', gap:'2px', alignItems:'center' }}>
                      {Array.from({ length: visit.rating }).map((_, i) => <Icon key={i} name="star" size={isMobile?7:9} color="#D4AC0D"/>)}
                    </div>
                  </div>
                  <div style={{ padding: isMobile?'10px':'14px' }}>
                    <div style={{ fontSize: isMobile?'13px':'15px', fontWeight:'800', color:textColor, marginBottom:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{visit.city}</div>
                    <div style={{ fontSize:'11px', color:subColor, display:'flex', alignItems:'center', gap:'4px', marginBottom:'8px' }}>
                      <img src={getFlagUrl(visit.country_code)} alt="" style={{ width:'13px', borderRadius:'2px' }}/>
                      {getCountryName(visit, lang)}
                    </div>
                    <div style={{ fontSize:'10px', color:subColor, borderTop:`1px solid ${cardBorder}`, paddingTop:'7px', display:'flex', alignItems:'center', gap:'4px' }}>
                      <Icon name="calendar" size={10} color={subColor}/>
                      {visit.visit_date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── ProfileMenu ──
function ProfileMenu({ userName, getInitials, cardBg, cardBorder, inputBg, subColor, lang, T, bg, dropdownBg, isMobile }) {
  const [open, setOpen] = useState(false);
  const handleLogout = () => { localStorage.removeItem('token'); window.location.href = '/login'; };

  const Icon = ({ name, size=16, color='currentColor', strokeWidth=1.8 }) => {
    const s = { width:size, height:size, fill:'none', stroke:color, strokeWidth, strokeLinecap:'round', strokeLinejoin:'round', flexShrink:0 };
    const icons = {
      user:    <svg style={s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      logout:  <svg style={s} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
      chevron: <svg style={s} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
    };
    return icons[name] || null;
  };

  return (
    <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
      <a href="#" onClick={e => { e.preventDefault(); setOpen(!open); }} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'6px', background:cardBg, border:`1px solid ${cardBorder}`, padding:'5px 10px 5px 5px', borderRadius:'24px', transition:'all 0.2s', cursor:'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = inputBg}
        onMouseLeave={e => e.currentTarget.style.background = cardBg}
      >
        <div style={{ width:'28px', height:'28px', background:'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius:'50%', fontSize:'11px', fontWeight:'900', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {getInitials(userName)}
        </div>
        {!isMobile && (
          <>
            <span style={{ fontSize:'12px', fontWeight:'700', color:subColor }}>{userName.split(' ')[0] || T.profile}</span>
            <Icon name="chevron" size={10} color={subColor}/>
          </>
        )}
      </a>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 10px)', [lang==='ar'?'left':'right']:0, width:'180px', background:dropdownBg, border:`1px solid ${cardBorder}`, borderRadius:'16px', boxShadow:'0 20px 50px rgba(0,0,0,0.35)', overflow:'hidden', zIndex:9999 }}>
          <a href="/profile" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', textDecoration:'none', color:'white', fontSize:'13px', fontWeight:'700', borderBottom:`1px solid ${cardBorder}` }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <Icon name="user" size={14} color="rgba(255,255,255,0.6)"/>{T.profile}
          </a>
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'12px 16px', background:'transparent', border:'none', color:'#E74C3C', fontSize:'13px', fontWeight:'700', cursor:'pointer', fontFamily:'Tajawal, sans-serif', direction:lang==='ar'?'rtl':'ltr' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(192,57,43,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <Icon name="logout" size={14} color="#E74C3C"/>{lang==='ar'?'تسجيل الخروج':'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;