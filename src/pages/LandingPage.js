import { useState, useEffect, useRef } from 'react';
import Globe from '../components/Globe';
import { useApp } from '../context/AppContext';

// ── SVG Icons ──
const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display:'inline-block' };
  const icons = {
    plane:    <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
    map:      <svg style={s} viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    camera:   <svg style={s} viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    bars:     <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    star:     <svg style={{ ...s, fill: color }} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trophy:   <svg style={s} viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
    lang:     <svg style={s} viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>,
    plus:     <svg style={s} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    user:     <svg style={s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    rocket:   <svg style={s} viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    menu:     <svg style={s} viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close:    <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    download: <svg style={s} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    check:    <svg style={s} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return icons[name] || null;
};

const featuresData = {
  ar: [
    { iconName: 'map',    title: 'خريطة تفاعلية',     desc: 'شاهد كل رحلاتك على خريطة عالمية تفاعلية مع pins مخصصة لكل دولة زرتها', color: '#2E86C1' },
    { iconName: 'camera', title: 'ذاكرة بصرية',        desc: 'أرفق صور رحلاتك وأنشئ ألبوماً مرئياً يحكي قصتك مع كل مدينة',           color: '#C0392B' },
    { iconName: 'bars',   title: 'إحصائيات ذكية',      desc: 'اكتشف أنماط سفرك — أكثر الدول زيارة، تقييماتك، وإنجازاتك',             color: '#D4AC0D' },
    { iconName: 'star',   title: 'تقييم الرحلات',      desc: 'قيّم كل رحلة من 1 إلى 5 نجوم واحتفظ بملاحظاتك الشخصية',               color: '#27AE60' },
    { iconName: 'trophy', title: 'إنجازات وميداليات',  desc: 'احصل على إشعارات عند وصولك لـ milestones مميزة في رحلاتك',             color: '#8E44AD' },
    { iconName: 'lang',   title: 'متعدد اللغات',       desc: 'استخدم الموقع بالعربية أو الإنجليزية مع دعم كامل للواجهتين',            color: '#E67E22' },
  ],
  en: [
    { iconName: 'map',    title: 'Interactive Map',  desc: 'See all your trips on an interactive world map with custom pins for every country you visited', color: '#2E86C1' },
    { iconName: 'camera', title: 'Visual Memory',    desc: 'Attach photos and create a visual album that tells your story with every city',                color: '#C0392B' },
    { iconName: 'bars',   title: 'Smart Stats',      desc: 'Discover your travel patterns — most visited countries, ratings, and achievements',           color: '#D4AC0D' },
    { iconName: 'star',   title: 'Trip Ratings',     desc: 'Rate each trip from 1 to 5 stars and keep your personal notes',                               color: '#27AE60' },
    { iconName: 'trophy', title: 'Achievements',     desc: 'Get notified when you reach special travel milestones',                                        color: '#8E44AD' },
    { iconName: 'lang',   title: 'Multilingual',     desc: 'Use the site in Arabic or English with full support for both interfaces',                      color: '#E67E22' },
  ],
};

const statsData = {
  ar: [
    { num: '100+', label: 'دولة مدعومة' },
    { num: '∞',   label: 'رحلات يمكن توثيقها' },
    { num: '3',   label: 'أنواع خرائط' },
    { num: '5',   label: 'نظام تقييم' },
  ],
  en: [
    { num: '100+', label: 'Supported Countries' },
    { num: '∞',   label: 'Trips You Can Log' },
    { num: '3',   label: 'Map Types' },
    { num: '5',   label: 'Rating System' },
  ],
};

const stepsData = {
  ar: [
    { title: 'أنشئ حسابك',        desc: 'سجّل في ثوانٍ بالبريد الإلكتروني',              iconName: 'user'   },
    { title: 'أضف رحلاتك',        desc: 'اختر الدولة والمدينة والتاريخ والصورة',          iconName: 'plus'   },
    { title: 'استكشف إحصائياتك', desc: 'شاهد رحلاتك على الخريطة وتابع تقدمك',           iconName: 'rocket' },
  ],
  en: [
    { title: 'Create Your Account', desc: 'Sign up in seconds with your email',                   iconName: 'user'   },
    { title: 'Add Your Trips',       desc: 'Choose country, city, date, and photo',                iconName: 'plus'   },
    { title: 'Explore Your Stats',   desc: 'View your trips on the map and track progress',        iconName: 'rocket' },
  ],
};

const T = {
  ar: {
    tagline: 'يوميات السفر الرقمية',
    h1a: 'وثّق رحلاتك،',
    h1b: 'احفظ ذكرياتك',
    subtitle: 'TravelStamp يحوّل رحلاتك إلى طوابع رقمية مميزة — خريطة تفاعلية، إحصائيات ذكية، وذكريات تدوم للأبد',
    startFree: 'ابدأ مجاناً الآن',
    login: 'تسجيل الدخول',
    loginArrow: 'تسجيل الدخول',
    downloadApp: 'تحميل التطبيق',
    countries: 'دولة مدعومة',
    trips: 'رحلات',
    rating: 'تقييم',
    navFeatures: 'المميزات',
    navHow: 'كيف يعمل',
    navStats: 'الإحصائيات',
    featuresTag: 'المميزات',
    featuresTitle: 'كل ما تحتاجه لتوثيق',
    featuresRed: 'رحلاتك',
    featuresSub: 'منصة متكاملة تجمع التوثيق، الخرائط، والإحصائيات في تجربة واحدة',
    howTag: 'كيف يعمل',
    howTitle: '3 خطوات',
    howGold: 'فقط',
    ctaTitle: 'ابدأ رحلتك الرقمية',
    ctaGold: 'اليوم',
    ctaSub: 'انضم وابدأ بتوثيق رحلاتك — مجاناً تماماً، بدون أي قيود',
    createFree: 'إنشاء حساب مجاني',
    footerSub: 'يوميات السفر الرقمية — وثّق كل خطوة',
    footerLogin: 'دخول',
    footerRegister: 'تسجيل',
    privacy: 'سياسة الخصوصية',
    cities: [
      { city: 'باريس', code: 'fr' },
      { city: 'طوكيو', code: 'jp' },
      { city: 'دبي',   code: 'ae' },
    ],
  },
  en: {
    tagline: 'Digital Travel Diary',
    h1a: 'Document your trips,',
    h1b: 'Keep your memories',
    subtitle: 'TravelStamp turns your trips into unique digital stamps — interactive map, smart stats, and memories that last forever',
    startFree: 'Start Free Now',
    login: 'Sign In',
    loginArrow: 'Sign In',
    downloadApp: 'Download App',
    countries: 'Supported Countries',
    trips: 'Trips',
    rating: 'Rating',
    navFeatures: 'Features',
    navHow: 'How It Works',
    navStats: 'Stats',
    featuresTag: 'FEATURES',
    featuresTitle: 'Everything you need to document your',
    featuresRed: 'Trips',
    featuresSub: 'An all-in-one platform combining documentation, maps, and statistics in one experience',
    howTag: 'HOW IT WORKS',
    howTitle: 'Only',
    howGold: '3 Steps',
    ctaTitle: 'Start your digital journey',
    ctaGold: 'Today',
    ctaSub: 'Join and start documenting your trips — completely free, no restrictions',
    createFree: 'Create Free Account',
    footerSub: 'Digital Travel Diary — Document every step',
    footerLogin: 'Sign In',
    footerRegister: 'Register',
    privacy: 'Privacy Policy',
    cities: [
      { city: 'Paris',  code: 'fr' },
      { city: 'Tokyo',  code: 'jp' },
      { city: 'Dubai',  code: 'ae' },
    ],
  },
};

export default function LandingPage() {
  const { lang, setLang } = useApp();
  const t        = T[lang];
  const features = featuresData[lang];
  const stats    = statsData[lang];
  const steps    = stepsData[lang];

  const [scrollY,    setScrollY]    = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 768);
  const [isTablet,   setIsTablet]   = useState(window.innerWidth < 1024);

  const starsRef = useRef([]);
  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      w:   Math.random() * 1.8 + 0.6,
      top: Math.random() * 100,
      left:Math.random() * 100,
      dur: (Math.random() * 4 + 2).toFixed(1),
      del: (Math.random() * 5).toFixed(1),
      op:  (Math.random() * 0.4 + 0.08).toFixed(2),
    }));
  }

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060D18',
      fontFamily: 'Tajawal, sans-serif',
      direction: dir,
      color: 'white',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#060D18; }
        ::-webkit-scrollbar-thumb { background:rgba(192,57,43,0.5); border-radius:10px; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.06)} }
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.7} }
        @keyframes spinSlow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes langPop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

        .ha { animation:fadeUp .75s ease forwards; }

        .btn-red {
          display:inline-flex; align-items:center; gap:7px;
          background:linear-gradient(135deg,#C0392B,#E74C3C);
          color:white; text-decoration:none;
          padding:13px 28px; border-radius:50px;
          font-size:14px; font-weight:800;
          box-shadow:0 8px 28px rgba(192,57,43,0.45);
          transition:all .3s; font-family:'Tajawal',sans-serif;
          cursor:pointer; border:none; white-space:nowrap;
        }
        .btn-red:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(192,57,43,0.55); }

        .btn-ghost {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.06);
          color:rgba(255,255,255,0.8); text-decoration:none;
          padding:13px 28px; border-radius:50px;
          font-size:14px; font-weight:700;
          border:1px solid rgba(255,255,255,0.14);
          transition:all .3s; font-family:'Tajawal',sans-serif;
          cursor:pointer; white-space:nowrap;
        }
        .btn-ghost:hover { background:rgba(255,255,255,0.11); transform:translateY(-2px); }

        .btn-gold {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(212,172,13,0.09);
          color:#D4AC0D; text-decoration:none;
          padding:13px 28px; border-radius:50px;
          font-size:14px; font-weight:800;
          border:1px solid rgba(212,172,13,0.22);
          transition:all .3s; font-family:'Tajawal',sans-serif;
          cursor:pointer; white-space:nowrap;
        }
        .btn-gold:hover { background:rgba(212,172,13,0.16); transform:translateY(-2px); }

        .nav-a {
          color:rgba(255,255,255,0.55); text-decoration:none;
          font-size:13px; font-weight:700;
          padding:7px 13px; border-radius:18px; transition:all .2s;
        }
        .nav-a:hover { color:white; background:rgba(255,255,255,0.07); }

        .fcard {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:22px; padding:26px;
          transition:all .32s; position:relative; overflow:hidden;
        }
        .fcard:hover {
          background:rgba(255,255,255,0.06);
          border-color:rgba(255,255,255,0.14);
          transform:translateY(-5px);
          box-shadow:0 20px 44px rgba(0,0,0,0.28);
        }
        .fcard::before {
          content:''; position:absolute; inset:0; border-radius:22px;
          background:radial-gradient(circle at 0% 0%, var(--cc,rgba(46,134,193,0.1)) 0%, transparent 55%);
          opacity:0; transition:opacity .32s;
        }
        .fcard:hover::before { opacity:1; }

        .shimmer {
          background:linear-gradient(90deg,#D4AC0D 0%,#F4D03F 25%,#D4AC0D 50%,#F4D03F 75%,#D4AC0D 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:shimmer 3s linear infinite;
        }

        .orbit-ring {
          position:absolute; border-radius:50%;
          border:1px solid rgba(46,134,193,0.12);
          animation:spinSlow var(--speed,30s) linear infinite;
        }

        .lang-btn {
          position:fixed; bottom:24px; z-index:9999;
          background:rgba(15,25,45,0.9);
          border:1px solid rgba(255,255,255,0.15);
          border-radius:50px; padding:10px 18px;
          display:flex; align-items:center; gap:8px;
          cursor:pointer; transition:all .3s;
          backdrop-filter:blur(20px);
          box-shadow:0 8px 32px rgba(0,0,0,0.4);
          font-family:'Tajawal',sans-serif;
          animation:langPop .4s ease forwards;
        }
        .lang-btn:hover {
          border-color:rgba(212,172,13,0.4);
          transform:translateY(-2px);
        }

        .mobile-menu {
          animation:slideDown .25s ease forwards;
        }

        /* mobile adjustments */
        @media (max-width:767px) {
          .hero-grid   { grid-template-columns:1fr !important; text-align:center; }
          .hero-btns   { justify-content:center !important; }
          .hero-stats  { justify-content:center !important; }
          .hero-sub    { margin-left:auto !important; margin-right:auto !important; }
          .globe-wrap  { display:none !important; }
          .stats-grid  { grid-template-columns:repeat(2,1fr) !important; }
          .how-grid    { grid-template-columns:1fr !important; }
          .nav-links   { display:none !important; }
          .nav-btns    { display:none !important; }
          .hamburger   { display:flex !important; }
          .footer-inner{ flex-direction:column !important; align-items:center !important; text-align:center !important; gap:14px !important; }
        }

        @media (min-width:768px) and (max-width:1023px) {
          .hero-grid   { grid-template-columns:1fr 1fr !important; }
          .globe-size  { width:280px !important; height:280px !important; }
          .stats-grid  { grid-template-columns:repeat(2,1fr) !important; }
          .how-grid    { grid-template-columns:1fr !important; }
          .nav-links   { display:none !important; }
          .hamburger   { display:flex !important; }
        }

        @media (min-width:768px) {
          .hamburger { display:none !important; }
        }
      `}</style>

      {/* زر اللغة الثابت */}
      <button
        className="lang-btn"
        style={{ [lang === 'ar' ? 'left' : 'right']: '24px' }}
        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      >
        <Icon name="lang" size={16} color="rgba(255,255,255,0.7)"/>
        <span style={{ fontSize:'13px', fontWeight:'800', color:'white' }}>
          {lang === 'ar' ? 'English' : 'عربي'}
        </span>
        <span style={{
          background:'rgba(212,172,13,0.15)', border:'1px solid rgba(212,172,13,0.3)',
          color:'#D4AC0D', fontSize:'10px', fontWeight:'900',
          padding:'2px 8px', borderRadius:'20px',
        }}>
          {lang === 'ar' ? 'EN' : 'AR'}
        </span>
      </button>

      {/* نجوم الخلفية */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        {starsRef.current.map(s => (
          <div key={s.id} style={{
            position:'absolute', borderRadius:'50%', background:'white',
            width:s.w+'px', height:s.w+'px',
            top:s.top+'%', left:s.left+'%', opacity:s.op,
            animation:`twinkle ${s.dur}s ease-in-out ${s.del}s infinite`,
          }}/>
        ))}
        <div style={{ position:'absolute', top:'-150px', right:'-150px', width:'500px', height:'500px', background:'rgba(192,57,43,0.07)', borderRadius:'50%', filter:'blur(80px)' }}/>
        <div style={{ position:'absolute', bottom:'-150px', left:'-150px', width:'500px', height:'500px', background:'rgba(46,134,193,0.07)', borderRadius:'50%', filter:'blur(80px)' }}/>
      </div>

      {/* NAVBAR */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        padding:'0 20px', height:'64px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background: scrollY>40 ? 'rgba(6,13,24,0.92)' : 'transparent',
        backdropFilter: scrollY>40 ? 'blur(22px)' : 'none',
        borderBottom: scrollY>40 ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition:'all .4s ease',
      }}>
        {/* لوغو */}
        <div style={{ display:'flex', alignItems:'center', gap:'9px', flexShrink:0 }}>
          <img src="/logo.png" alt="TravelStamp" style={{ width:'38px', height:'38px', objectFit:'contain' }}/>
          <span style={{ fontSize:'18px', fontWeight:'900', letterSpacing:'-0.4px' }}>
            Travel<span style={{ color:'#D4AC0D' }}>Stamp</span>
          </span>
        </div>

        {/* روابط — تختفي على الجوال */}
        <div className="nav-links" style={{ display:'flex', gap:'2px' }}>
          <a href="#features" className="nav-a">{t.navFeatures}</a>
          <a href="#how"      className="nav-a">{t.navHow}</a>
          <a href="#stats"    className="nav-a">{t.navStats}</a>
        </div>

        {/* أزرار — تختفي على الجوال */}
        <div className="nav-btns" style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <a href="/login"    className="btn-ghost" style={{ padding:'7px 18px', fontSize:'12px' }}>{t.login}</a>
          <a href="/register" className="btn-red"   style={{ padding:'7px 18px', fontSize:'12px' }}>
            <Icon name="plane" size={12} color="white" strokeWidth={2}/>
            {t.startFree}
          </a>
        </div>

        {/* هامبرغر — يظهر على الجوال فقط */}
        <button
          className="hamburger"
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{
            background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:'10px', padding:'8px',
            display:'none', alignItems:'center', justifyContent:'center',
            cursor:'pointer', color:'white',
          }}
        >
          <Icon name={mobileMenu ? 'close' : 'menu'} size={20} color="white"/>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div className="mobile-menu" style={{
          position:'fixed', top:'64px', left:0, right:0, zIndex:999,
          background:'rgba(6,13,24,0.97)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(255,255,255,0.08)',
          padding:'16px 20px 20px',
          display:'flex', flexDirection:'column', gap:'8px',
        }}>
          {[
            { href:'#features', label:t.navFeatures },
            { href:'#how',      label:t.navHow      },
            { href:'#stats',    label:t.navStats     },
          ].map(item => (
            <a key={item.href} href={item.href}
              onClick={() => setMobileMenu(false)}
              style={{
                color:'rgba(255,255,255,0.7)', textDecoration:'none',
                padding:'12px 16px', borderRadius:'12px',
                fontSize:'14px', fontWeight:'700',
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.07)',
              }}
            >{item.label}</a>
          ))}
          <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
            <a href="/login"    className="btn-ghost" style={{ flex:1, justifyContent:'center', fontSize:'13px', padding:'11px' }}>{t.login}</a>
            <a href="/register" className="btn-red"   style={{ flex:1, justifyContent:'center', fontSize:'13px', padding:'11px' }}>{t.startFree}</a>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{
        minHeight:'100vh',
        display:'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
        alignItems:'center',
        padding: isMobile ? '90px 20px 50px' : isTablet ? '90px 32px 60px' : '100px 60px 60px',
        maxWidth:'1300px', margin:'0 auto',
        gap:'40px', position:'relative', zIndex:1,
        textAlign: isTablet ? 'center' : (lang === 'ar' ? 'right' : 'left'),
      }}>
        {/* النص */}
        <div>
          <div className="ha" style={{
            animationDelay:'.1s', opacity:0,
            display:'inline-flex', alignItems:'center', gap:'7px',
            background:'rgba(212,172,13,0.1)', border:'1px solid rgba(212,172,13,0.24)',
            padding:'5px 14px', borderRadius:'50px',
            fontSize:'11px', fontWeight:'800', color:'#D4AC0D',
            marginBottom:'24px', letterSpacing:'.5px',
          }}>
            <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#D4AC0D', animation:'pulse 1.6s ease-in-out infinite', display:'inline-block' }}/>
            <Icon name="plane" size={11} color="#D4AC0D" strokeWidth={2}/>
            {t.tagline}
          </div>

          <h1 className="ha" style={{
            animationDelay:'.22s', opacity:0,
            fontSize: isMobile ? '32px' : 'clamp(34px,4.5vw,68px)',
            fontWeight:'900', lineHeight:'1.15', marginBottom:'20px',
          }}>
            {t.h1a}<br/>
            <span className="shimmer">{t.h1b}</span>
          </h1>

          <p className="ha hero-sub" style={{
            animationDelay:'.36s', opacity:0,
            fontSize: isMobile ? '14px' : 'clamp(14px,1.6vw,17px)',
            color:'rgba(255,255,255,0.48)',
            lineHeight:'1.85', marginBottom:'38px',
            maxWidth: isTablet ? '500px' : '480px',
          }}>{t.subtitle}</p>

          <div className="ha hero-btns" style={{
            animationDelay:'.5s', opacity:0,
            display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'36px',
            justifyContent: isTablet ? 'center' : 'flex-start',
          }}>
            <a href="/register" className="btn-red" style={{ fontSize: isMobile ? '13px' : '14px' }}>
              <Icon name="rocket" size={14} color="white"/>
              {t.startFree}
            </a>
            <a href="/login" className="btn-ghost" style={{ fontSize: isMobile ? '13px' : '14px' }}>
              <Icon name="user" size={14} color="rgba(255,255,255,0.8)"/>
              {t.loginArrow}
            </a>
            {!isMobile && (
              <button className="btn-gold" style={{ fontSize:'13px' }}>
                <Icon name="download" size={14} color="#D4AC0D"/>
                {t.downloadApp}
              </button>
            )}
          </div>

          <div className="ha hero-stats" style={{
            animationDelay:'.64s', opacity:0,
            display:'flex', gap:'28px',
            justifyContent: isTablet ? 'center' : 'flex-start',
          }}>
            {[
              { n:'100+', l: t.countries },
              { n:'∞',    l: t.trips     },
              { n:'5', l: t.rating, icon: true },
            ].map((s,i)=>(
              <div key={i} style={{ textAlign: isTablet ? 'center' : (lang==='ar'?'right':'left') }}>
                <div style={{ fontSize:'22px', fontWeight:'900', color:'#D4AC0D', lineHeight:1, display:'flex', alignItems:'center', gap:'3px', justifyContent: isTablet ? 'center' : 'flex-start' }}>
                  {s.n}
                  {s.icon && <Icon name="star" size={16} color="#D4AC0D"/>}
                </div>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'4px', fontWeight:'700' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* الكوكب — مخفي على الجوال */}
        {!isTablet && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative', animation:'fadeUp .75s .3s ease forwards', opacity:0,
          }}>
            <div className="orbit-ring" style={{
              width:'520px', height:'520px', top:'50%', left:'50%',
              transform:'translate(-50%,-50%) rotateX(70deg)',
              '--speed':'28s', position:'absolute',
            }}/>
            <div className="orbit-ring" style={{
              width:'620px', height:'620px', top:'50%', left:'50%',
              transform:'translate(-50%,-50%) rotateX(70deg)',
              '--speed':'40s', position:'absolute',
              animationDirection:'reverse', borderColor:'rgba(212,172,13,0.08)',
            }}/>
            <div style={{ animation:'float 6s ease-in-out infinite', position:'relative', zIndex:2 }}>
              <Globe size={380}/>
            </div>
            {t.cities.map((v, i) => {
              const positions = [
                { top:'-30px',   right:'-20px', rotate:'-12deg', delay:'0s'   },
                { bottom:'-20px',right:'-40px', rotate:'8deg',   delay:'0.4s' },
                { bottom:'60px', left:'-50px',  rotate:'-6deg',  delay:'0.8s' },
              ];
              const pos = positions[i];
              return (
                <div key={i} style={{
                  position:'absolute', zIndex:3,
                  top:pos.top, bottom:pos.bottom, right:pos.right, left:pos.left,
                  background:'rgba(15,25,45,0.85)', backdropFilter:'blur(12px)',
                  border:'1px solid rgba(255,255,255,0.13)',
                  borderRadius:'16px', padding:'10px 14px',
                  display:'flex', alignItems:'center', gap:'9px',
                  animation:`float ${3.5+i*0.6}s ease-in-out infinite`,
                  animationDelay:pos.delay,
                  transform:`rotate(${pos.rotate})`,
                  boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
                  minWidth:'120px',
                }}>
                  <img src={`https://flagcdn.com/w40/${v.code}.png`} alt="" style={{ width:'28px', borderRadius:'6px', flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:'800' }}>{v.city}</div>
                    <div style={{ display:'flex', gap:'2px', marginTop:'3px' }}>
                      {Array.from({length:5}).map((_,j)=>(
                        <Icon key={j} name="star" size={8} color="#D4AC0D"/>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* STATS BAR */}
      <section id="stats" style={{ padding: isMobile ? '30px 16px' : '50px 40px', position:'relative', zIndex:1 }}>
        <div style={{
          maxWidth:'860px', margin:'0 auto',
          display:'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'22px', overflow:'hidden',
        }}>
          {stats.map((s,i)=>(
            <div key={i} style={{
              padding: isMobile ? '20px 12px' : '28px 16px',
              textAlign:'center',
              borderLeft: (lang==='ar' && i>0) ? 'none' : (i>0 ? '1px solid rgba(255,255,255,0.06)' : 'none'),
              borderRight: (lang==='ar' && i>0) ? '1px solid rgba(255,255,255,0.06)' : 'none',
              borderBottom: isMobile && i<2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize: isMobile ? '26px' : '32px', fontWeight:'900', color:'#D4AC0D', lineHeight:1, marginBottom:'7px' }}>{s.num}</div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', color:'rgba(255,255,255,0.38)', fontWeight:'700' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: isMobile ? '50px 16px' : '70px 40px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:'1060px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'44px' }}>
            <div style={{
              display:'inline-block',
              background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.2)',
              padding:'4px 14px', borderRadius:'50px',
              fontSize:'10px', fontWeight:'800', color:'#E74C3C',
              marginBottom:'14px', letterSpacing:'1px',
            }}>{t.featuresTag}</div>
            <h2 style={{ fontSize: isMobile ? '24px' : 'clamp(26px,3.5vw,44px)', fontWeight:'900', lineHeight:'1.2' }}>
              {t.featuresTitle} <span style={{ color:'#C0392B' }}>{t.featuresRed}</span>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'14px', marginTop:'12px', maxWidth:'440px', margin:'12px auto 0', lineHeight:'1.7' }}>
              {t.featuresSub}
            </p>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
            gap:'12px',
          }}>
            {features.map((f,i)=>(
              <div key={i} className="fcard" style={{ '--cc': f.color+'18' }}>
                <div style={{
                  width:'46px', height:'46px',
                  background:f.color+'18', border:`1px solid ${f.color}28`,
                  borderRadius:'13px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:'14px',
                }}>
                  <Icon name={f.iconName} size={22} color={f.color}/>
                </div>
                <h3 style={{ fontSize:'15px', fontWeight:'800', marginBottom:'9px' }}>{f.title}</h3>
                <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.42)', lineHeight:'1.75' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: isMobile ? '50px 16px' : '70px 40px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:'860px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'44px' }}>
            <div style={{
              display:'inline-block',
              background:'rgba(212,172,13,0.1)', border:'1px solid rgba(212,172,13,0.2)',
              padding:'4px 14px', borderRadius:'50px',
              fontSize:'10px', fontWeight:'800', color:'#D4AC0D',
              marginBottom:'14px', letterSpacing:'1px',
            }}>{t.howTag}</div>
            <h2 style={{ fontSize: isMobile ? '24px' : 'clamp(26px,3.5vw,44px)', fontWeight:'900' }}>
              {t.howTitle} <span style={{ color:'#D4AC0D' }}>{t.howGold}</span>
            </h2>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
            gap:'14px',
          }}>
            {steps.map((s,i)=>(
              <div key={i} style={{
                textAlign:'center', padding: isMobile ? '24px 16px' : '32px 20px',
                background: i===1 ? 'rgba(192,57,43,0.07)' : 'rgba(255,255,255,0.03)',
                border: i===1 ? '1px solid rgba(192,57,43,0.22)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius:'22px', position:'relative',
                display:'flex', flexDirection: isMobile ? 'row' : 'column',
                alignItems: isMobile ? 'center' : 'center',
                gap: isMobile ? '16px' : '0',
                textAlign: isMobile ? (lang==='ar'?'right':'left') : 'center',
              }}>
                <div style={{
                  width:'56px', height:'56px', flexShrink:0,
                  margin: isMobile ? '0' : '0 auto 18px',
                  background: i===1 ? 'linear-gradient(135deg,#C0392B,#E74C3C)' : 'rgba(255,255,255,0.05)',
                  border: i===1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius:'18px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow: i===1 ? '0 10px 28px rgba(192,57,43,0.4)' : 'none',
                  position:'relative',
                }}>
                  <Icon name={s.iconName} size={24} color={i===1?'white':'rgba(255,255,255,0.6)'} strokeWidth={1.8}/>
                  <span style={{
                    position:'absolute', top:'-8px', right:'-8px',
                    width:'20px', height:'20px',
                    background: i===1 ? '#D4AC0D' : 'rgba(255,255,255,0.14)',
                    borderRadius:'50%', fontSize:'9px', fontWeight:'900',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: i===1 ? '#060D18' : 'rgba(255,255,255,0.6)',
                  }}>{i+1}</span>
                </div>
                <div>
                  <h3 style={{ fontSize:'15px', fontWeight:'800', marginBottom:'7px' }}>{s.title}</h3>
                  <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', lineHeight:'1.75' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '40px 16px 80px' : '70px 40px 90px', position:'relative', zIndex:1 }}>
        <div style={{
          maxWidth:'660px', margin:'0 auto', textAlign:'center',
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'28px', padding: isMobile ? '36px 20px' : '54px 36px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:'-50px', left:'50%', transform:'translateX(-50%)',
            width:'280px', height:'180px',
            background:'radial-gradient(ellipse,rgba(192,57,43,0.14) 0%,transparent 70%)',
            filter:'blur(18px)', pointerEvents:'none',
          }}/>
          <div style={{
            width:'60px', height:'60px', margin:'0 auto 20px',
            background:'linear-gradient(135deg,#C0392B,#E74C3C)',
            borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 10px 30px rgba(192,57,43,0.4)',
          }}>
            <Icon name="plane" size={28} color="white" strokeWidth={2}/>
          </div>
          <h2 style={{ fontSize: isMobile ? '22px' : 'clamp(22px,3.5vw,38px)', fontWeight:'900', marginBottom:'14px', lineHeight:'1.2' }}>
            {t.ctaTitle} <span className="shimmer">{t.ctaGold}</span>
          </h2>
          <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.42)', marginBottom:'32px', lineHeight:'1.8', maxWidth:'400px', margin:'0 auto 32px' }}>
            {t.ctaSub}
          </p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap', marginBottom:'12px' }}>
            <a href="/register" className="btn-red" style={{ fontSize: isMobile ? '13px' : '14px', padding: isMobile ? '11px 22px' : '13px 32px' }}>
              <Icon name="rocket" size={14} color="white"/>
              {t.createFree}
            </a>
            <a href="/login" className="btn-ghost" style={{ fontSize: isMobile ? '13px' : '14px', padding: isMobile ? '11px 22px' : '13px 32px' }}>
              <Icon name="user" size={14} color="rgba(255,255,255,0.8)"/>
              {t.login}
            </a>
          </div>
          <button className="btn-gold" style={{ fontSize:'12px', padding:'9px 22px' }}>
            <Icon name="download" size={13} color="#D4AC0D"/>
            {t.downloadApp}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop:'1px solid rgba(255,255,255,0.06)',
        padding: isMobile ? '20px 16px' : '24px 36px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        flexWrap:'wrap', gap:'12px', position:'relative', zIndex:1,
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'unset',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <img src="/logo.png" alt="TravelStamp" style={{ width:'26px', height:'26px', objectFit:'contain' }}/>
          <span style={{ fontSize:'13px', fontWeight:'900' }}>
            Travel<span style={{ color:'#D4AC0D' }}>Stamp</span>
          </span>
        </div>
        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', gap:'6px' }}>
          <Icon name="globe" size={11} color="rgba(255,255,255,0.22)"/>
          {t.footerSub}
        </div>
        <div style={{ display:'flex', gap:'14px' }}>
          <a href="/login"    style={{ fontSize:'11px', color:'rgba(255,255,255,0.28)', textDecoration:'none' }}>{t.footerLogin}</a>
          <a href="/register" style={{ fontSize:'11px', color:'rgba(255,255,255,0.28)', textDecoration:'none' }}>{t.footerRegister}</a>
          {/* إضافة رابط سياسة الخصوصية */}
          <a href="/privacy"  style={{ fontSize:'11px', color:'rgba(255,255,255,0.28)', textDecoration:'none' }}>{t.privacy}</a>
        </div>
      </footer>
    </div>
  );
}