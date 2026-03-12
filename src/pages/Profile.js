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

function getCountryName(visit, lang) {
  const code = visit.country_code?.toLowerCase();
  if (code && COUNTRY_NAMES[code]) return COUNTRY_NAMES[code][lang];
  return visit.country;
}

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display: 'inline-block' };
  const icons = {
    arrow:    <svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    arrowR:   <svg style={s} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    edit:     <svg style={s} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    save:     <svg style={s} viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    close:    <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    logout:   <svg style={s} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plane:    <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
    city:     <svg style={s} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    star:     <svg style={{ ...s, fill: color }} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trophy:   <svg style={s} viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5h12v4a6 6 0 0 1-12 0V5z"/></svg>,
    calendar: <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    mail:     <svg style={s} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    user:     <svg style={s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    camera:   <svg style={s} viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    check:    <svg style={s} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    alert:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    chevronL: <svg style={s} viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
    chevronR: <svg style={s} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
    map:      <svg style={s} viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  };
  return icons[name] || null;
};

// ── مكوّن بادج الإنجاز ──────────────────────────────────────────
function Badge({ icon, label, earned, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      opacity: earned ? 1 : 0.25, transition: 'opacity 0.3s'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: earned ? `rgba(${color},0.18)` : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${earned ? `rgba(${color},0.5)` : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: earned ? `0 4px 14px rgba(${color},0.3)` : 'none',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: '9px', color: earned ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', fontWeight: '700', textAlign: 'center', lineHeight: 1.2, maxWidth: '52px' }}>{label}</span>
    </div>
  );
}

function Profile() {
  const { lang } = useApp();

  const T = {
    ar: {
      back: 'رجوع', logout: 'تسجيل الخروج', logoutConfirm: 'هل أنت متأكد من تسجيل الخروج؟',
      loading: 'جاري التحميل...', memberSince: 'عضو منذ',
      editProfile: 'تعديل الملف', save: 'حفظ', saving: 'جاري الحفظ...', cancel: 'إلغاء',
      savedMsg: 'تم حفظ التعديلات!', errorMsg: 'حدث خطأ أثناء الحفظ',
      namePlaceholder: 'الاسم',
      trips: 'رحلة', countries: 'دولة', cities: 'مدينة', avgRating: 'متوسط التقييم',
      recentTrips: 'آخر الرحلات', viewAll: 'عرض الكل',
      favCountry: 'دولتك المفضلة', changePhoto: 'تغيير الصورة',
      badges: 'الإنجازات',
      badge1: 'مسافر مبتدئ',  badge2: 'جوّال',     badge3: 'رحّالة',
      badge4: 'خبير السفر',   badge5: 'مستكشف',    badge6: 'نجم ٥ ⭐',
      highestRated: 'أعلى تقييم',
      totalRatings: 'إجمالي النقاط',
      explorer: 'مستوى المسافر',
      level1: 'مبتدئ', level2: 'جوّال', level3: 'رحّالة', level4: 'مستكشف', level5: 'أسطورة',
    },
    en: {
      back: 'Back', logout: 'Sign Out', logoutConfirm: 'Are you sure you want to sign out?',
      loading: 'Loading...', memberSince: 'Member since',
      editProfile: 'Edit Profile', save: 'Save', saving: 'Saving...', cancel: 'Cancel',
      savedMsg: 'Changes saved!', errorMsg: 'Error while saving',
      namePlaceholder: 'Name',
      trips: 'Trips', countries: 'Countries', cities: 'Cities', avgRating: 'Avg. Rating',
      recentTrips: 'Recent Trips', viewAll: 'View All',
      favCountry: 'Favorite Country', changePhoto: 'Change Photo',
      badges: 'Achievements',
      badge1: 'First Trip',    badge2: 'Explorer',    badge3: 'Adventurer',
      badge4: 'Travel Pro',    badge5: 'World Chaser', badge6: '5-Star Traveler',
      highestRated: 'Best Rated',
      totalRatings: 'Total Points',
      explorer: 'Traveler Level',
      level1: 'Beginner', level2: 'Explorer', level3: 'Adventurer', level4: 'Nomad', level5: 'Legend',
    }
  }[lang];

  const [user,          setUser]          = useState(null);
  const [visits,        setVisits]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [editing,       setEditing]       = useState(false);
  const [form,          setForm]          = useState({ name: '' });
  const [success,       setSuccess]       = useState('');
  const [error,         setError]         = useState('');
  const [saving,        setSaving]        = useState(false);
  const [avatar,        setAvatar]        = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isMobile,      setIsMobile]      = useState(window.innerWidth < 768);
  const avatarInputRef = useRef(null);
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
    fetchData();
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, visitsRes] = await Promise.all([
        axios.get('https://travelstamp-backend-production.up.railway.app/api/user',   { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://travelstamp-backend-production.up.railway.app/api/visits', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUser(userRes.data);
      setVisits(visitsRes.data);
      setForm({ name: userRes.data.name });
      if (userRes.data.avatar_url) setAvatarPreview(userRes.data.avatar_url);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('_method', 'PUT');
      if (avatar) formData.append('avatar', avatar);
      await axios.post('https://travelstamp-backend-production.up.railway.app/api/user', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setUser({ ...user, name: form.name });
      setSuccess(T.savedMsg); setEditing(false); setAvatar(null);
    } catch {
      try {
        await axios.put('https://travelstamp-backend-production.up.railway.app/api/user', { name: form.name }, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });
        setUser({ ...user, name: form.name });
        setSuccess(T.savedMsg); setEditing(false);
      } catch { setError(T.errorMsg); }
    } finally { setSaving(false); }
  };

  const handleLogout = () => {
    if (window.confirm(T.logoutConfirm)) { localStorage.removeItem('token'); window.location.href = '/login'; }
  };

  // ── إحصائيات ──────────────────────────────────────────
  const totalCountries  = [...new Set(visits.map(v => v.country_code))].length;
  const totalCities     = [...new Set(visits.map(v => v.city))].length;
  const avgRating       = visits.length ? (visits.reduce((s, v) => s + v.rating, 0) / visits.length).toFixed(1) : 0;
  const totalPoints     = visits.reduce((s, v) => s + v.rating, 0);
  const bestVisit       = visits.length ? visits.reduce((a, b) => b.rating > a.rating ? b : a) : null;

  const topCountryCode = visits.length
    ? Object.entries(visits.reduce((acc, v) => { const c = v.country_code?.toLowerCase(); if (c) acc[c] = (acc[c]||0)+1; return acc; }, {})).sort((a,b)=>b[1]-a[1])[0][0]
    : null;

  // ── مستوى المسافر ──────────────────────────────────────
  const getLevelInfo = (n) => {
    if (n >= 20) return { label: T.level5, color: '#D4AC0D', pct: 100, next: 0 };
    if (n >= 10) return { label: T.level4, color: '#9B59B6', pct: (n/20)*100, next: 20-n };
    if (n >= 5)  return { label: T.level3, color: '#2E86C1', pct: (n/10)*100, next: 10-n };
    if (n >= 3)  return { label: T.level2, color: '#27AE60', pct: (n/5)*100, next: 5-n };
    return       { label: T.level1, color: '#C0392B', pct: (n/3)*100, next: 3-n };
  };
  const levelInfo = getLevelInfo(visits.length);

  // ── الإنجازات ──────────────────────────────────────────
  const badgesData = [
    { label: T.badge1, earned: visits.length >= 1,  color: '192,57,43',   icon: <Icon name="plane"   size={20} color={visits.length>=1  ? '#E74C3C' : 'rgba(255,255,255,0.3)'}/> },
    { label: T.badge2, earned: visits.length >= 3,  color: '46,134,193',  icon: <Icon name="globe"   size={20} color={visits.length>=3  ? '#2E86C1' : 'rgba(255,255,255,0.3)'}/> },
    { label: T.badge3, earned: visits.length >= 5,  color: '39,174,96',   icon: <Icon name="map"     size={20} color={visits.length>=5  ? '#27AE60' : 'rgba(255,255,255,0.3)'}/> },
    { label: T.badge4, earned: visits.length >= 10, color: '155,89,182',  icon: <Icon name="trophy"  size={20} color={visits.length>=10 ? '#9B59B6' : 'rgba(255,255,255,0.3)'}/> },
    { label: T.badge5, earned: totalCountries >= 5, color: '52,152,219',  icon: <Icon name="city"    size={20} color={totalCountries>=5 ? '#3498DB' : 'rgba(255,255,255,0.3)'}/> },
    { label: T.badge6, earned: parseFloat(avgRating)>=4.5, color: '212,172,13', icon: <Icon name="star" size={20} color={parseFloat(avgRating)>=4.5 ? '#D4AC0D' : 'rgba(255,255,255,0.3)'}/> },
  ];

  const getFlagUrl    = code => `https://flagcdn.com/w80/${code?.toLowerCase()}.png`;
  const getInitials   = name  => name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : '?';

  const inputStyle = { padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'Tajawal, sans-serif', width: '100%', boxSizing: 'border-box' };
  const cardStyle  = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '18px' : '22px', marginBottom: '16px' };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060D18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tajawal, sans-serif', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>{T.loading}</div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#060D18', fontFamily: 'Tajawal, sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr', position: 'relative' }}>
      <style>{`
        @keyframes twinkle    { 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes pulse-glow { 0%,100%{opacity:0.06;transform:scale(1)} 50%{opacity:0.11;transform:scale(1.04)} }
        @keyframes fadeIn     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .avatar-wrapper:hover .avatar-overlay { opacity:1!important; }
        .profile-input:focus  { border-color:rgba(192,57,43,0.4)!important; }
        .profile-input::placeholder { color:rgba(255,255,255,0.2); }
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
      <div style={{ position: 'relative', zIndex: 10, padding: isMobile ? '0 16px' : '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,13,24,0.85)', backdropFilter: 'blur(20px)' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {lang === 'ar' ? <Icon name="arrowR" size={13} color="rgba(255,255,255,0.5)"/> : <Icon name="arrow" size={13} color="rgba(255,255,255,0.5)"/>}
          {!isMobile && T.back}
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="TravelStamp" style={{ width: '36px', height: '36px', objectFit: 'contain' }}/>
          {!isMobile && <span style={{ color: 'white', fontSize: '16px', fontWeight: '900' }}>Travel<span style={{ color: '#D4AC0D' }}>Stamp</span></span>}
        </div>
        <div style={{ width: isMobile ? '36px' : '80px' }}/>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '20px 16px 40px' : '32px 20px 40px', position: 'relative', zIndex: 1 }}>

        {/* رسائل النجاح/الخطأ */}
        {success && <div style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60', border: '1px solid rgba(39,174,96,0.3)', padding: '12px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="check" size={14} color="#27AE60"/>{success}</div>}
        {error   && <div style={{ background: 'rgba(192,57,43,0.12)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.3)', padding: '12px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="alert" size={14} color="#E74C3C"/>{error}</div>}

        {/* ══ بطاقة المستخدم ══ */}
        <div style={{ ...cardStyle, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: '20px', flexDirection: isMobile ? 'column' : 'row' }}>

          {/* أفاتار */}
          <div className="avatar-wrapper" onClick={() => avatarInputRef.current.click()} style={{ width: isMobile ? '72px' : '88px', height: isMobile ? '72px' : '88px', flexShrink: 0, borderRadius: '50%', cursor: 'pointer', position: 'relative', boxShadow: '0 8px 24px rgba(192,57,43,0.4)', border: '3px solid rgba(255,255,255,0.15)' }}>
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}/>
              : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '22px' : '28px', fontWeight: '900', color: 'white' }}>{getInitials(user?.name)}</div>
            }
            <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
              <Icon name="camera" size={18} color="white"/>
              <span style={{ fontSize: '9px', color: 'white', fontWeight: '700', marginTop: '2px' }}>{T.changePhoto}</span>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }}/>
          </div>

          {/* معلومات / نموذج التعديل */}
          <div style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.2s ease' }}>
                {/* فقط الاسم — بدون إيميل */}
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', [lang==='ar'?'right':'left']: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                    <Icon name="user" size={14} color="rgba(255,255,255,0.3)"/>
                  </span>
                  <input className="profile-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={T.namePlaceholder}
                    style={{ ...inputStyle, padding: lang==='ar' ? '10px 36px 10px 14px' : '10px 14px 10px 36px' }}/>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: saving ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#C0392B,#E74C3C)', color: saving ? 'rgba(255,255,255,0.3)' : 'white', border: 'none', fontSize: '13px', fontWeight: '800', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Icon name="save" size={14} color="white"/>{saving ? T.saving : T.save}
                  </button>
                  <button onClick={() => { setEditing(false); setAvatar(null); }} style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="close" size={13} color="rgba(255,255,255,0.5)"/>{T.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>{user?.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="mail" size={12} color="rgba(255,255,255,0.3)"/>{user?.email}
                </div>
                <button onClick={() => setEditing(true)} style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="edit" size={12} color="rgba(255,255,255,0.5)"/>{T.editProfile}
                </button>
              </div>
            )}
          </div>

          {/* تاريخ الانضمام */}
          {!isMobile && (
            <div style={{ background: 'rgba(212,172,13,0.08)', border: '1px solid rgba(212,172,13,0.15)', borderRadius: '16px', padding: '16px 20px', textAlign: 'center', flexShrink: 0 }}>
              <Icon name="calendar" size={18} color="#D4AC0D"/>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '6px 0 4px', fontWeight: '600' }}>{T.memberSince}</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#D4AC0D' }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString(lang==='ar'?'ar-SA':'en-US', { year: 'numeric', month: 'long' }) : '—'}
              </div>
            </div>
          )}
        </div>

        {/* ══ إحصائيات ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? '10px' : '14px', marginBottom: '16px' }}>
          {[
            { num: visits.length,  label: T.trips,     icon: 'plane',  color: '#C0392B', glow: 'rgba(192,57,43,0.2)' },
            { num: totalCountries, label: T.countries,  icon: 'globe',  color: '#2E86C1', glow: 'rgba(46,134,193,0.2)' },
            { num: totalCities,    label: T.cities,     icon: 'city',   color: '#27AE60', glow: 'rgba(39,174,96,0.2)' },
            { num: avgRating,      label: T.avgRating,  icon: 'star',   color: '#D4AC0D', glow: 'rgba(212,172,13,0.2)' },
          ].map((card, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: isMobile ? '14px' : '18px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', width: '70px', height: '70px', background: card.glow, borderRadius: '50%', filter: 'blur(20px)' }}/>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}><Icon name={card.icon} size={isMobile ? 18 : 20} color={card.color}/></div>
              <div style={{ fontSize: isMobile ? '26px' : '30px', fontWeight: '900', color: card.color, lineHeight: 1 }}>{card.num}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '5px', fontWeight: '600' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* ══ مستوى المسافر ══ */}
        <div style={cardStyle}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.5)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Icon name="trophy" size={14} color="rgba(255,255,255,0.5)"/>{T.explorer}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: '900', color: levelInfo.color }}>{levelInfo.label}</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>{visits.length} {T.trips}</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '10px', width: `${levelInfo.pct}%`, background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}88)`, transition: 'width 1s ease' }}/>
          </div>
          {levelInfo.next > 0 && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
              {lang === 'ar' ? `${levelInfo.next} رحلات للمستوى التالي` : `${levelInfo.next} more trips to next level`}
            </div>
          )}
        </div>

        {/* ══ الإنجازات ══ */}
        <div style={cardStyle}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Icon name="star" size={14} color="rgba(255,255,255,0.5)"/>{T.badges}
            <span style={{ marginRight: 'auto', marginLeft: 'auto' }}/>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontWeight: '600' }}>
              {badgesData.filter(b=>b.earned).length} / {badgesData.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px' }}>
            {badgesData.map((b, i) => <Badge key={i} {...b}/>)}
          </div>
        </div>

        {/* ══ إحصائيات إضافية ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* الدولة المفضلة */}
          {topCountryCode && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212,172,13,0.12)', border: '1px solid rgba(212,172,13,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="trophy" size={20} color="#D4AC0D"/>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', fontWeight: '700' }}>{T.favCountry}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={getFlagUrl(topCountryCode)} alt="" style={{ width: '20px', borderRadius: '3px' }}/>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#D4AC0D' }}>
                    {getCountryName({ country_code: topCountryCode, country: topCountryCode }, lang)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* أعلى تقييم */}
          {bestVisit && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212,172,13,0.12)', border: '1px solid rgba(212,172,13,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img src={bestVisit.photo_url || getFlagUrl(bestVisit.country_code)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', fontWeight: '700' }}>{T.highestRated}</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: 'white', marginBottom: '3px' }}>{bestVisit.city}</div>
                <div style={{ display: 'flex', gap: '2px' }}>{Array.from({length: bestVisit.rating}).map((_,i)=><Icon key={i} name="star" size={11} color="#D4AC0D"/>)}</div>
              </div>
            </div>
          )}
        </div>

        {/* ══ آخر الرحلات ══ */}
        {visits.length > 0 && (
          <div style={cardStyle}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Icon name="plane" size={14} color="rgba(255,255,255,0.5)"/>{T.recentTrips}
              </span>
              <a href="/dashboard" style={{ fontSize: '11px', color: '#D4AC0D', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {T.viewAll}
                {lang==='ar' ? <Icon name="chevronL" size={12} color="#D4AC0D"/> : <Icon name="chevronR" size={12} color="#D4AC0D"/>}
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {visits.slice(0, 4).map(visit => (
                <a key={visit.id} href={`/visit/${visit.id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                >
                  <img src={visit.photo_url || getFlagUrl(visit.country_code)} alt="" style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}/>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', marginBottom: '2px' }}>{visit.city}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <img src={getFlagUrl(visit.country_code)} alt="" style={{ width: '13px', borderRadius: '2px' }}/>
                      {getCountryName(visit, lang)}
                    </div>
                  </div>
                  <div style={{ textAlign: lang==='ar'?'left':'right' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>{visit.visit_date}</div>
                    <div style={{ display: 'flex', gap: '2px', justifyContent: lang==='ar'?'flex-start':'flex-end' }}>
                      {Array.from({length:visit.rating}).map((_,i)=><Icon key={i} name="star" size={10} color="#D4AC0D"/>)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ══ زر الخروج ══ */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleLogout} style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', color: 'rgba(231,76,60,0.7)', padding: '11px 32px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(192,57,43,0.2)'; e.currentTarget.style.color='#E74C3C'; e.currentTarget.style.borderColor='rgba(192,57,43,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(192,57,43,0.08)'; e.currentTarget.style.color='rgba(231,76,60,0.7)'; e.currentTarget.style.borderColor='rgba(192,57,43,0.2)'; }}
          >
            <Icon name="logout" size={14} color="currentColor"/>{T.logout}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;