import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';




function Dashboard() {
  const { lang, setLang } = useApp();


  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('date_desc');
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState('');

  const [showNotif, setShowNotif] = useState(false);

  // ── نجوم الخلفية ──
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

  const T = {
    ar: {
      badge: 'MY TRAVEL JOURNAL',
      title: 'رحلاتك حول العالم 🌍',
      addVisit: '➕ إضافة زيارة',
      map: '🗺️ الخريطة',
      stats: '📊 الإحصائيات',
      logout: 'خروج',
      install: '📲 حمّل التطبيق',
      trips: 'رحلة موثقة',
      countries: 'دولة مختلفة',
      cities: 'مدينة زرتها',
      searchPlaceholder: 'ابحث عن مدينة، دولة، أو ملاحظة...',
      allTrips: 'كل الرحلات',
      ratingLabel: 'التقييم:',
      all: 'الكل',
      newest: '📅 الأحدث أولاً',
      oldest: '📅 الأقدم أولاً',
      highRating: '⭐ الأعلى تقييماً',
      lowRating: '⭐ الأدنى تقييماً',
      noResults: 'لا توجد نتائج',
      clearFilter: '↺ مسح الفلتر',
      startFirst: 'ابدأ رحلتك الأولى',
      startSub: 'وثّق رحلاتك واحفظ ذكرياتك للأبد',
      loading: 'جاري التحميل...',
      notifTitle: '🔔 الإشعارات',
      noNotif: 'لا توجد إشعارات جديدة',
      profile: 'ملفي',
    },
    en: {
      badge: 'MY TRAVEL JOURNAL',
      title: 'Your Trips Around the World 🌍',
      addVisit: '➕ Add Visit',
      map: '🗺️ Map',
      stats: '📊 Stats',
      logout: 'Logout',
      install: '📲 Install App',
      trips: 'Trips',
      countries: 'Countries',
      cities: 'Cities',
      searchPlaceholder: 'Search city, country or note...',
      allTrips: 'All Trips',
      ratingLabel: 'Rating:',
      all: 'All',
      newest: '📅 Newest First',
      oldest: '📅 Oldest First',
      highRating: '⭐ Highest Rated',
      lowRating: '⭐ Lowest Rated',
      noResults: 'No Results Found',
      clearFilter: '↺ Clear Filter',
      startFirst: 'Start Your First Trip',
      startSub: 'Document your trips and save memories forever',
      loading: 'Loading...',
      notifTitle: '🔔 Notifications',
      noNotif: 'No new notifications',
      profile: 'Profile',
    }
  }[lang];

  const totalCountries = [...new Set(visits.map(v => v.country))].length;
  const totalCities    = [...new Set(visits.map(v => v.city))].length;

  const buildNotifications = () => {
    const notifs = [];
    notifs.push({
      type: 'reminder', icon: '✈️',
      text: lang === 'ar' ? 'لديك رحلات لم توثّقها بعد؟ أضف زيارة جديدة الآن!' : 'Have unlogged trips? Add a new visit now!',
      color: '#2E86C1', action: '/add-visit',
      actionLabel: lang === 'ar' ? 'إضافة الآن' : 'Add Now',
    });
    notifs.push({
      type: 'stats', icon: '📊',
      text: lang === 'ar'
        ? `عندك ${visits.length} رحلة في ${totalCountries} دولة و${totalCities} مدينة! 🌍`
        : `You have ${visits.length} trips across ${totalCountries} countries & ${totalCities} cities!`,
      color: '#D4AC0D',
    });
    [
      { n:1,  ar:'🎉 أول رحلة! كل الرحلات تبدأ بخطوة واحدة', en:"🎉 First trip logged!" },
      { n:5,  ar:'⭐ 5 رحلات! أنت مسافر حقيقي',              en:"⭐ 5 trips! Real traveler!" },
      { n:10, ar:'🏆 10 رحلات! مبروك المستوى الجديد',         en:"🏆 10 trips! New level!" },
      { n:25, ar:'🚀 25 رحلة! انضممت لنخبة المسافرين',        en:"🚀 25 trips! Elite traveler!" },
      { n:50, ar:'🌟 50 رحلة! أنت من المسافرين الأسطوريين',   en:"🌟 50 trips! Legendary!" },
    ].forEach(m => {
      if (visits.length >= m.n)
        notifs.push({ type:'milestone', icon:'🏅', text: lang==='ar'?m.ar:m.en, color:'#D4AC0D' });
    });
    [
      { n:3,  ar:'🌍 زرت 3 دول!',  en:'🌍 3 countries visited!' },
      { n:5,  ar:'🗺️ 5 دول!',      en:'🗺️ 5 countries!' },
      { n:10, ar:'✈️ 10 دول!',     en:'✈️ 10 countries!' },
      { n:20, ar:'🌐 20 دولة!',    en:'🌐 20 countries!' },
    ].forEach(m => {
      if (totalCountries >= m.n)
        notifs.push({ type:'milestone', icon:'🏆', text: lang==='ar'?m.ar:m.en, color:'#27AE60' });
    });
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
    fetchVisits();
    fetchUser();
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/visits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisits(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserName(res.data.name);
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  const getFlagUrl = (code) =>
    `https://flagcdn.com/w320/${code?.toLowerCase()}.png`;

  const filtered = visits
    .filter(v => {
      const q = search.toLowerCase();
      const matchSearch =
        v.city.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        (v.notes && v.notes.toLowerCase().includes(q));
      const matchRating = filterRating === 0 || v.rating === filterRating;
      return matchSearch && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc')   return new Date(b.visit_date) - new Date(a.visit_date);
      if (sortBy === 'date_asc')    return new Date(a.visit_date) - new Date(b.visit_date);
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'rating_asc')  return a.rating - b.rating;
      return 0;
    });

  const iconBtn = {
    background: cardBg, border: `1px solid ${cardBorder}`,
    color: subColor, width: '36px', height: '36px',
    borderRadius: '50%', fontSize: '15px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', fontFamily: 'Tajawal, sans-serif', flexShrink: 0,
  };

  return (
    <div
      style={{ minHeight: '100vh', background: bg, fontFamily: 'Tajawal, sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr', transition: 'background 0.4s', position: 'relative' }}
      onClick={() => showNotif && setShowNotif(false)}
    >
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: 0.15; }
          50%      { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%,100% { opacity: 0.06; transform: scale(1); }
          50%      { opacity: 0.11; transform: scale(1.04); }
        }
      `}</style>

      {/* ── نجوم الخلفية (في الوضع الداكن فقط) ── */}
     {(
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {starsRef.current.map(s => (
            <div key={s.id} style={{
              position: 'absolute',
              width:  s.width + 'px',
              height: s.width + 'px',
              borderRadius: '50%',
              background: 'white',
              top:   s.top  + '%',
              left:  s.left + '%',
              opacity: s.opacity,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}/>
          ))}
          {/* glows */}
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
      )}

      {/* =========== NAVBAR =========== */}
      <div style={{
        padding: '0 24px', height: '64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 1000, transition: 'all 0.3s',
      background: scrolled ? 'rgba(6,13,24,0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? cardBorder : 'transparent'}`,
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
            borderRadius: '10px', fontSize: '16px', transform: 'rotate(-8deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(192,57,43,0.4)',
          }}>✈️</div>
          <span style={{ color: textColor, fontSize: '17px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            Travel<span style={{ color: '#D4AC0D' }}>Stamp</span>
          </span>
          {visits.length > 0 && (
            <div style={{
              background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.22)',
              padding: '3px 10px', borderRadius: '20px',
              fontSize: '11px', fontWeight: '800', color: '#E74C3C',
            }}>
              {visits.length} {lang === 'ar' ? 'رحلة ✈️' : 'trips ✈️'}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[
            { href: '/map',   label: T.map   },
            { href: '/stats', label: T.stats },
          ].map(item => (
            <a key={item.href} href={item.href} style={{
              color: subColor, textDecoration: 'none',
              padding: '7px 14px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '700',
              background: cardBg, border: `1px solid ${cardBorder}`,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = textColor; e.currentTarget.style.background = inputBg; }}
              onMouseLeave={e => { e.currentTarget.style.color = subColor;  e.currentTarget.style.background = cardBg;  }}
            >{item.label}</a>
          ))}
          <a href="/add-visit" style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
            color: 'white', textDecoration: 'none',
            padding: '7px 16px', borderRadius: '20px',
            fontSize: '12px', fontWeight: '800',
            boxShadow: '0 4px 14px rgba(192,57,43,0.35)',
          }}>{T.addVisit}</a>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>

          <button style={{
            ...iconBtn, width: 'auto', borderRadius: '20px',
            padding: '7px 12px', fontSize: '11px', fontWeight: '800', gap: '5px',
          }}>📲</button>

          <button
            onClick={(e) => { e.stopPropagation(); setLang(lang === 'ar' ? 'en' : 'ar'); }}
            style={{ ...iconBtn, width: 'auto', borderRadius: '20px', padding: '7px 12px', fontSize: '11px', fontWeight: '800' }}
          >{lang === 'ar' ? '🌐 EN' : '🌐 عربي'}</button>

     
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{
                ...iconBtn,
                border: milestoneCount > 0 ? '1px solid rgba(212,172,13,0.45)' : `1px solid ${cardBorder}`,
              }}
            >
              🔔
              {milestoneCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px',
                  right: lang === 'ar' ? 'auto' : '-2px',
                  left:  lang === 'ar' ? '-2px'  : 'auto',
                  width: '16px', height: '16px',
                  background: '#E74C3C', borderRadius: '50%',
                  border: `2px solid ${bg}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: '900', color: 'white',
                }}>{milestoneCount}</span>
              )}
            </button>

            {showNotif && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)',
                [lang === 'ar' ? 'left' : 'right']: 0,
                width: '290px', background: dropdownBg,
                border: `1px solid ${cardBorder}`, borderRadius: '18px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                overflow: 'hidden', zIndex: 9999,
              }}>
                <div style={{
                  padding: '13px 16px', borderBottom: `1px solid ${cardBorder}`,
                  fontSize: '12px', fontWeight: '800', color: subColor,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{T.notifTitle}</span>
                  {milestoneCount > 0 && (
                    <span style={{
                      background: 'rgba(212,172,13,0.15)', border: '1px solid rgba(212,172,13,0.25)',
                      color: '#D4AC0D', padding: '2px 8px', borderRadius: '10px',
                      fontSize: '10px', fontWeight: '800',
                    }}>{milestoneCount} جديد</span>
                  )}
                </div>
                <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  {notifications.map((n, i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      borderBottom: i < notifications.length - 1 ? `1px solid ${cardBorder}` : 'none',
                      background: n.type === 'milestone' ? `${n.color}0D` : 'transparent',
                      display: 'flex', gap: '10px', alignItems: 'flex-start',
                    }}>
                      <div style={{
                        width: '32px', height: '32px', flexShrink: 0,
                        background: `${n.color}18`, border: `1px solid ${n.color}30`,
                        borderRadius: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '14px',
                      }}>{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: textColor, lineHeight: '1.6', fontWeight: '600' }}>{n.text}</div>
                        {n.action && (
                          <a href={n.action} style={{
                            display: 'inline-block', marginTop: '6px',
                            background: `${n.color}18`, border: `1px solid ${n.color}30`,
                            color: n.color, padding: '4px 10px', borderRadius: '10px',
                            fontSize: '11px', fontWeight: '800', textDecoration: 'none',
                          }}>{n.actionLabel}</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a href="/profile" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '7px',
            background: cardBg, border: `1px solid ${cardBorder}`,
            padding: '5px 12px 5px 5px', borderRadius: '24px', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = inputBg}
            onMouseLeave={e => e.currentTarget.style.background = cardBg}
          >
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
              borderRadius: '50%', fontSize: '11px', fontWeight: '900', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{getInitials(userName)}</div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: subColor }}>
              {userName.split(' ')[0] || T.profile}
            </span>
          </a>

          <button onClick={handleLogout} style={{
            background: 'transparent', border: `1px solid ${cardBorder}`,
            color: subColor, padding: '7px 12px', borderRadius: '20px',
            cursor: 'pointer', fontSize: '12px', fontFamily: 'Tajawal, sans-serif',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E74C3C'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = subColor;   e.currentTarget.style.borderColor = cardBorder; }}
          >{T.logout}</button>
        </div>
      </div>

      {/* =========== CONTENT =========== */}
      <div style={{ padding: '40px 32px 32px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '8px' }}>
          <span style={{
            background: 'rgba(212,172,13,0.15)', color: '#D4AC0D',
            fontSize: '11px', fontWeight: '800', padding: '4px 12px',
            borderRadius: '20px', letterSpacing: '1px',
          }}>{T.badge}</span>
        </div>
        <h1 style={{
          color: textColor, fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: '900', margin: '12px 0 32px', lineHeight: '1.2',
        }}>{T.title}</h1>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { num: visits.length,  label: T.trips,     icon: '✈️', color: '#C0392B', glow: 'rgba(192,57,43,0.3)'  },
            { num: totalCountries, label: T.countries,  icon: '🌍', color: '#2E86C1', glow: 'rgba(46,134,193,0.3)' },
            { num: totalCities,    label: T.cities,     icon: '🏙️', color: '#D4AC0D', glow: 'rgba(212,172,13,0.3)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: '20px', padding: '24px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-20px', left: '-20px',
                width: '80px', height: '80px',
                background: s.glow, borderRadius: '50%', filter: 'blur(30px)',
              }}/>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '40px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: subColor, marginTop: '6px', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* شريط البحث والفلترة */}
        {visits.length > 0 && (
          <div style={{
            background: cardBg, border: `1px solid ${cardBorder}`,
            borderRadius: '20px', padding: '16px 20px', marginBottom: '24px',
            display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center',
          }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <span style={{
                position: 'absolute',
                right: lang === 'ar' ? '14px' : 'auto',
                left:  lang === 'ar' ? 'auto' : '14px',
                top: '50%', transform: 'translateY(-50%)',
                fontSize: '14px', pointerEvents: 'none',
              }}>🔍</span>
              <input
                type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={T.searchPlaceholder}
                style={{
                  width: '100%',
                  padding: lang === 'ar' ? '10px 40px 10px 14px' : '10px 14px 10px 40px',
                  borderRadius: '12px', border: `1px solid ${cardBorder}`,
                  background: inputBg, color: textColor,
                  fontSize: '13px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'Tajawal, sans-serif',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{
                  position: 'absolute',
                  left:  lang === 'ar' ? '10px' : 'auto',
                  right: lang === 'ar' ? 'auto' : '10px',
                  top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: subColor, cursor: 'pointer', fontSize: '16px',
                }}>✕</button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: subColor, fontWeight: '700' }}>{T.ratingLabel}</span>
              {[0,5,4,3,2,1].map(r => (
                <button key={r} onClick={() => setFilterRating(r)} style={{
                  padding: '6px 10px', borderRadius: '20px',
                  border: filterRating===r ? '1px solid rgba(212,172,13,0.5)' : `1px solid ${cardBorder}`,
                  background: filterRating===r ? 'rgba(212,172,13,0.12)' : cardBg,
                  color: filterRating===r ? '#D4AC0D' : subColor,
                  fontSize: '11px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                }}>{r===0 ? T.all : '⭐'.repeat(r)}</button>
              ))}
            </div>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              padding: '9px 14px', borderRadius: '12px',
              border: `1px solid ${cardBorder}`, background: inputBg,
              color: textColor, fontSize: '12px', fontWeight: '700',
              outline: 'none', fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              <option value="date_desc"   style={{ background: '#060D18' }}>{T.newest}</option>
<option value="date_asc"    style={{ background: '#060D18' }}>{T.oldest}</option>
<option value="rating_desc" style={{ background: '#060D18' }}>{T.highRating}</option>
<option value="rating_asc"  style={{ background: '#060D18' }}>{T.lowRating}</option>
            </select>
          </div>
        )}

        {visits.length > 0 && (search || filterRating > 0) && (
          <div style={{ fontSize: '12px', color: subColor, marginBottom: '16px', fontWeight: '600' }}>
            {filtered.length === 0
              ? `❌ ${T.noResults}`
              : `✅ ${filtered.length} ${lang==='ar'?'نتيجة من أصل':'of'} ${visits.length}`}
          </div>
        )}

        {/* Grid الزيارات */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'60px', color:subColor, fontSize:'14px' }}>{T.loading}</div>
        ) : visits.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'80px 20px',
            background:cardBg, borderRadius:'24px',
            border:`1px dashed ${cardBorder}`,
          }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>🗺️</div>
            <div style={{ fontSize:'20px', fontWeight:'800', color:textColor, marginBottom:'8px' }}>{T.startFirst}</div>
            <div style={{ fontSize:'13px', color:subColor, marginBottom:'24px' }}>{T.startSub}</div>
            <a href="/add-visit" style={{
              display:'inline-block', background:'#C0392B', color:'white',
              padding:'12px 28px', borderRadius:'20px',
              fontSize:'13px', fontWeight:'800', textDecoration:'none',
            }}>{T.addVisit}</a>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'60px',
            background:cardBg, borderRadius:'24px', border:`1px dashed ${cardBorder}`,
          }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔍</div>
            <div style={{ fontSize:'16px', fontWeight:'800', color:textColor, marginBottom:'16px' }}>{T.noResults}</div>
            <button onClick={() => { setSearch(''); setFilterRating(0); }} style={{
              background:cardBg, border:`1px solid ${cardBorder}`,
              color:textColor, padding:'9px 20px', borderRadius:'20px',
              fontSize:'12px', fontWeight:'700',
              cursor:'pointer', fontFamily:'Tajawal, sans-serif',
            }}>{T.clearFilter}</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:'20px' }}>
              <span style={{ color:subColor, fontSize:'13px', fontWeight:'700' }}>
                🗂️ {T.allTrips} ({filtered.length})
              </span>
            </div>
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',
              gap:'16px',
            }}>
              {filtered.map(visit => (
                <div key={visit.id}
                  onClick={() => window.location.href = `/visit/${visit.id}`}
                  style={{
                    borderRadius:'20px', overflow:'hidden', cursor:'pointer',
                    background:cardBg, border:`1px solid ${cardBorder}`,
                    transition:'all 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ position:'relative' }}>
                    <img
                      src={visit.photo_url || getFlagUrl(visit.country_code)}
                      alt={visit.city}
                      style={{ width:'100%', height:'140px', objectFit:'cover', display:'block' }}
                    />
                    <div style={{
                      position:'absolute', inset:0,
                      background:'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)',
                    }}/>
                    <div style={{
                      position:'absolute', top:'10px', left:'10px',
                      background:'rgba(15,31,53,0.8)', backdropFilter:'blur(6px)',
                      padding:'3px 8px', borderRadius:'10px', fontSize:'9px',
                    }}>{'⭐'.repeat(visit.rating)}</div>
                  </div>
                  <div style={{ padding:'14px' }}>
                    <div style={{
                      fontSize:'15px', fontWeight:'800', color:textColor,
                      marginBottom:'5px', whiteSpace:'nowrap',
                      overflow:'hidden', textOverflow:'ellipsis',
                    }}>{visit.city}</div>
                    <div style={{
                      fontSize:'11px', color:subColor,
                      display:'flex', alignItems:'center', gap:'5px', marginBottom:'10px',
                    }}>
                      <img src={getFlagUrl(visit.country_code)} alt="" style={{ width:'14px', borderRadius:'2px' }}/>
                      {visit.country}
                    </div>
                    <div style={{
                      fontSize:'10px', color:subColor,
                      borderTop:`1px solid ${cardBorder}`, paddingTop:'8px',
                    }}>📅 {visit.visit_date}</div>
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

export default Dashboard;