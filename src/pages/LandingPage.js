import { useState, useEffect, useRef } from 'react';
import Globe from '../components/Globe';

const features = [
  { icon: '🗺️', title: 'خريطة تفاعلية', desc: 'شاهد كل رحلاتك على خريطة عالمية تفاعلية مع pins مخصصة لكل دولة زرتها', color: '#2E86C1' },
  { icon: '📸', title: 'ذاكرة بصرية', desc: 'أرفق صور رحلاتك وأنشئ ألبوماً مرئياً يحكي قصتك مع كل مدينة', color: '#C0392B' },
  { icon: '📊', title: 'إحصائيات ذكية', desc: 'اكتشف أنماط سفرك — أكثر الدول زيارة، تقييماتك، وإنجازاتك', color: '#D4AC0D' },
  { icon: '⭐', title: 'تقييم الرحلات', desc: 'قيّم كل رحلة من 1 إلى 5 نجوم واحتفظ بملاحظاتك الشخصية', color: '#27AE60' },
  { icon: '🏆', title: 'إنجازات وميداليات', desc: 'احصل على إشعارات عند وصولك لـ milestones مميزة في رحلاتك', color: '#8E44AD' },
  { icon: '🌐', title: 'متعدد اللغات', desc: 'استخدم الموقع بالعربية أو الإنجليزية مع دعم كامل للواجهتين', color: '#E67E22' },
];

const stats = [
  { num: '100+', label: 'دولة مدعومة' },
  { num: '∞', label: 'رحلات يمكن توثيقها' },
  { num: '3', label: 'أنواع خرائط' },
  { num: '5⭐', label: 'نظام تقييم' },
];

const steps = [
  { title: 'أنشئ حسابك', desc: 'سجّل في ثوانٍ بالبريد الإلكتروني', icon: '👤' },
  { title: 'أضف رحلاتك', desc: 'اختر الدولة والمدينة والتاريخ والصورة', icon: '➕' },
  { title: 'استكشف إحصائياتك', desc: 'شاهد رحلاتك على الخريطة وتابع تقدمك', icon: '🚀' },
];

// نقاط على الكوكب تمثل مدن مشهورة
const CITY_PINS = [
  { name: 'باريس',    lat: 48.85,  lng: 2.35,   color: '#E74C3C' },
  { name: 'طوكيو',   lat: 35.68,  lng: 139.69, color: '#D4AC0D' },
  { name: 'نيويورك', lat: 40.71,  lng: -74.00, color: '#2E86C1' },
  { name: 'دبي',     lat: 25.20,  lng: 55.27,  color: '#27AE60' },
  { name: 'لندن',    lat: 51.50,  lng: -0.12,  color: '#8E44AD' },
  { name: 'سيدني',   lat: -33.86, lng: 151.20, color: '#E67E22' },
  { name: 'القاهرة', lat: 30.04,  lng: 31.23,  color: '#E74C3C' },
  { name: 'ريو',     lat: -22.90, lng: -43.17, color: '#D4AC0D' },
];



export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
 

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
   
    window.addEventListener('scroll', onScroll);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
     
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060D18',
      fontFamily: 'Tajawal, sans-serif',
      direction: 'rtl',
      color: 'white',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #060D18; }
        ::-webkit-scrollbar-thumb { background: rgba(192,57,43,0.5); border-radius: 10px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%,100% { opacity:.4; transform:scale(1);    }
          50%      { opacity:.8; transform:scale(1.06); }
        }
        @keyframes twinkle {
          0%,100% { opacity:.15; }
          50%      { opacity:.7;  }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .ha { animation: fadeUp .75s ease forwards; }

        .btn-red {
          display:inline-flex; align-items:center; gap:7px;
          background: linear-gradient(135deg,#C0392B,#E74C3C);
          color:white; text-decoration:none;
          padding:13px 28px; border-radius:50px;
          font-size:14px; font-weight:800;
          box-shadow:0 8px 28px rgba(192,57,43,0.45);
          transition:all .3s; font-family:'Tajawal',sans-serif;
          cursor:pointer; border:none; position:relative; overflow:hidden;
        }
        .btn-red:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(192,57,43,0.55); }

        .btn-ghost {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.06);
          color:rgba(255,255,255,0.8); text-decoration:none;
          padding:13px 28px; border-radius:50px;
          font-size:14px; font-weight:700;
          border:1px solid rgba(255,255,255,0.14);
          transition:all .3s; font-family:'Tajawal',sans-serif; cursor:pointer;
        }
        .btn-ghost:hover { background:rgba(255,255,255,0.11); border-color:rgba(255,255,255,0.28); transform:translateY(-2px); }

        .btn-gold {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(212,172,13,0.09);
          color:#D4AC0D; text-decoration:none;
          padding:13px 28px; border-radius:50px;
          font-size:14px; font-weight:800;
          border:1px solid rgba(212,172,13,0.22);
          transition:all .3s; font-family:'Tajawal',sans-serif; cursor:pointer;
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
          background: radial-gradient(circle at 0% 0%, var(--cc,rgba(46,134,193,0.1)) 0%, transparent 55%);
          opacity:0; transition:opacity .32s;
        }
        .fcard:hover::before { opacity:1; }

        .star-bg { position:absolute; border-radius:50%; background:white; animation: twinkle var(--d,3s) ease-in-out infinite; animation-delay:var(--dl,0s); }

        .shimmer {
          background: linear-gradient(90deg,#D4AC0D 0%,#F4D03F 25%,#D4AC0D 50%,#F4D03F 75%,#D4AC0D 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 3s linear infinite;
        }

        .orbit-ring {
          position:absolute; border-radius:50%;
          border:1px solid rgba(46,134,193,0.12);
          animation: spinSlow var(--speed,30s) linear infinite;
        }
      `}</style>

      {/* ── نجوم الخلفية ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="star-bg" style={{
            width: (Math.random()*1.8+0.6)+'px',
            height:(Math.random()*1.8+0.6)+'px',
            top: Math.random()*100+'%', left:Math.random()*100+'%',
            '--d':(Math.random()*4+2)+'s', '--dl':(Math.random()*5)+'s',
            opacity: Math.random()*0.4+0.08,
          }}/>
        ))}
      </div>

     

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        padding:'0 36px', height:'64px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background: scrollY>40 ? 'rgba(6,13,24,0.9)' : 'transparent',
        backdropFilter: scrollY>40 ? 'blur(22px)' : 'none',
        borderBottom: scrollY>40 ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition:'all .4s ease',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
          <div style={{
            width:'36px', height:'36px',
            background:'linear-gradient(135deg,#C0392B,#E74C3C)',
            borderRadius:'11px', fontSize:'17px',
            display:'flex', alignItems:'center', justifyContent:'center',
            transform:'rotate(-8deg)', boxShadow:'0 4px 14px rgba(192,57,43,0.45)',
          }}>✈️</div>
          <span style={{ fontSize:'18px', fontWeight:'900', letterSpacing:'-0.4px' }}>
            Travel<span style={{ color:'#D4AC0D' }}>Stamp</span>
          </span>
        </div>

        <div style={{ display:'flex', gap:'2px' }}>
          <a href="#features" className="nav-a">المميزات</a>
          <a href="#how"      className="nav-a">كيف يعمل</a>
          <a href="#stats"    className="nav-a">الإحصائيات</a>
        </div>

        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <a href="/login"    className="btn-ghost" style={{ padding:'7px 18px', fontSize:'12px' }}>تسجيل الدخول</a>
          <a href="/register" className="btn-red"   style={{ padding:'7px 18px', fontSize:'12px' }}>ابدأ مجاناً 🚀</a>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        minHeight:'100vh',
        display:'grid', gridTemplateColumns:'1fr 1fr',
        alignItems:'center',
        padding:'100px 60px 60px',
        maxWidth:'1300px', margin:'0 auto',
        gap:'40px', position:'relative', zIndex:1,
      }}>

        {/* النص */}
        <div>
          {/* Badge */}
          <div className="ha" style={{
            animationDelay:'.1s', opacity:0,
            display:'inline-flex', alignItems:'center', gap:'7px',
            background:'rgba(212,172,13,0.1)', border:'1px solid rgba(212,172,13,0.24)',
            padding:'5px 14px', borderRadius:'50px',
            fontSize:'11px', fontWeight:'800', color:'#D4AC0D',
            marginBottom:'24px', letterSpacing:'.5px',
          }}>
            <span style={{
              width:'5px', height:'5px', borderRadius:'50%', background:'#D4AC0D',
              animation:'pulse 1.6s ease-in-out infinite', display:'inline-block',
            }}/>
            يوميات السفر الرقمية ✈️
          </div>

          <h1 className="ha" style={{
            animationDelay:'.22s', opacity:0,
            fontSize:'clamp(34px,4.5vw,68px)',
            fontWeight:'900', lineHeight:'1.15', marginBottom:'20px',
          }}>
            وثّق رحلاتك،
            <br/>
            <span className="shimmer">احفظ ذكرياتك</span>
          </h1>

          <p className="ha" style={{
            animationDelay:'.36s', opacity:0,
            fontSize:'clamp(14px,1.6vw,17px)',
            color:'rgba(255,255,255,0.48)',
            lineHeight:'1.85', marginBottom:'38px', maxWidth:'480px',
          }}>
            TravelStamp يحوّل رحلاتك إلى طوابع رقمية مميزة —
            خريطة تفاعلية، إحصائيات ذكية، وذكريات تدوم للأبد
          </p>

          {/* أزرار */}
          <div className="ha" style={{
            animationDelay:'.5s', opacity:0,
            display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'44px',
          }}>
            <a href="/register" className="btn-red">ابدأ مجاناً الآن 🚀</a>
            <a href="/login"    className="btn-ghost">تسجيل الدخول ←</a>
            <button className="btn-gold">📲 تحميل التطبيق</button>
          </div>

          {/* أرقام صغيرة */}
          <div className="ha" style={{
            animationDelay:'.64s', opacity:0,
            display:'flex', gap:'28px',
          }}>
            {[
              { n:'100+', l:'دولة مدعومة' },
              { n:'∞',    l:'رحلات' },
              { n:'5⭐',  l:'تقييم' },
            ].map((s,i)=>(
              <div key={i}>
                <div style={{ fontSize:'22px', fontWeight:'900', color:'#D4AC0D', lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'4px', fontWeight:'700' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* الكوكب */}
        <div className="ha" style={{
          animationDelay:'.3s', opacity:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative',
        }}>
          {/* حلقات مدارية ديكور */}
          <div className="orbit-ring" style={{
            width:'520px', height:'520px',
            top:'50%', left:'50%',
            transform:'translate(-50%,-50%) rotateX(70deg)',
            '--speed':'28s',
            position:'absolute',
          }}/>
          <div className="orbit-ring" style={{
            width:'620px', height:'620px',
            top:'50%', left:'50%',
            transform:'translate(-50%,-50%) rotateX(70deg)',
            '--speed':'40s',
            position:'absolute',
            animationDirection:'reverse',
            borderColor:'rgba(212,172,13,0.08)',
          }}/>

          {/* الكوكب نفسه */}
          <div style={{ animation:'float 6s ease-in-out infinite', position:'relative', zIndex:2 }}>
            <Globe size={380}/>
          </div>

          {/* بطاقات تحوم حول الكوكب */}
          {[
            { city:'باريس',  code:'fr', rotate:'-12deg', top:'-30px',  right:'-20px', delay:'0s'    },
            { city:'طوكيو',  code:'jp', rotate:'8deg',   bottom:'-20px',right:'-40px',delay:'0.4s'  },
            { city:'دبي',    code:'ae', rotate:'-6deg',  bottom:'60px', left:'-50px', delay:'0.8s'  },
          ].map((v,i)=>(
            <div key={i} style={{
              position:'absolute', ...( v.top    ? { top:v.top }    : {} ),
              ...( v.bottom ? { bottom:v.bottom } : {} ),
              ...( v.right  ? { right:v.right }   : {} ),
              ...( v.left   ? { left:v.left }     : {} ),
              zIndex:3,
              background:'rgba(15,25,45,0.85)',
              backdropFilter:'blur(12px)',
              border:'1px solid rgba(255,255,255,0.13)',
              borderRadius:'16px', padding:'10px 14px',
              display:'flex', alignItems:'center', gap:'9px',
              animation:`float ${3.5+i*0.6}s ease-in-out infinite`,
              animationDelay:v.delay,
              transform:`rotate(${v.rotate})`,
              boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
              minWidth:'120px',
            }}>
              <img src={`https://flagcdn.com/w40/${v.code}.png`} alt=""
                style={{ width:'28px', borderRadius:'6px', flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:'12px', fontWeight:'800' }}>{v.city}</div>
                <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.4)', marginTop:'2px' }}>{'⭐⭐⭐⭐⭐'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section id="stats" style={{ padding:'50px 40px', position:'relative', zIndex:1 }}>
        <div style={{
          maxWidth:'860px', margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'22px', overflow:'hidden',
        }}>
          {stats.map((s,i)=>(
            <div key={i} style={{
              padding:'28px 16px', textAlign:'center',
              borderLeft: i>0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize:'32px', fontWeight:'900', color:'#D4AC0D', lineHeight:1, marginBottom:'7px' }}>{s.num}</div>
              <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.38)', fontWeight:'700' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" style={{ padding:'70px 40px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:'1060px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'52px' }}>
            <div style={{
              display:'inline-block',
              background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.2)',
              padding:'4px 14px', borderRadius:'50px',
              fontSize:'10px', fontWeight:'800', color:'#E74C3C',
              marginBottom:'14px', letterSpacing:'1px',
            }}>المميزات</div>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,44px)', fontWeight:'900', lineHeight:'1.2' }}>
              كل ما تحتاجه لتوثيق <span style={{ color:'#C0392B' }}>رحلاتك</span>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'14px', marginTop:'12px', maxWidth:'440px', margin:'12px auto 0', lineHeight:'1.7' }}>
              منصة متكاملة تجمع التوثيق، الخرائط، والإحصائيات في تجربة واحدة
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'14px' }}>
            {features.map((f,i)=>(
              <div key={i} className="fcard" style={{ '--cc': f.color+'18' }}>
                <div style={{
                  width:'46px', height:'46px',
                  background:f.color+'18', border:`1px solid ${f.color}28`,
                  borderRadius:'13px', fontSize:'20px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:'14px',
                }}>{f.icon}</div>
                <h3 style={{ fontSize:'15px', fontWeight:'800', marginBottom:'9px' }}>{f.title}</h3>
                <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.42)', lineHeight:'1.75' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how" style={{ padding:'70px 40px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:'860px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'52px' }}>
            <div style={{
              display:'inline-block',
              background:'rgba(212,172,13,0.1)', border:'1px solid rgba(212,172,13,0.2)',
              padding:'4px 14px', borderRadius:'50px',
              fontSize:'10px', fontWeight:'800', color:'#D4AC0D',
              marginBottom:'14px', letterSpacing:'1px',
            }}>كيف يعمل</div>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,44px)', fontWeight:'900' }}>
              3 خطوات <span style={{ color:'#D4AC0D' }}>فقط</span>
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
            {steps.map((s,i)=>(
              <div key={i} style={{
                textAlign:'center', padding:'32px 20px',
                background: i===1 ? 'rgba(192,57,43,0.07)' : 'rgba(255,255,255,0.03)',
                border: i===1 ? '1px solid rgba(192,57,43,0.22)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius:'22px', position:'relative',
              }}>
                <div style={{
                  width:'60px', height:'60px', margin:'0 auto 18px',
                  background: i===1 ? 'linear-gradient(135deg,#C0392B,#E74C3C)' : 'rgba(255,255,255,0.05)',
                  border: i===1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius:'18px', fontSize:'24px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow: i===1 ? '0 10px 28px rgba(192,57,43,0.4)' : 'none',
                  position:'relative',
                }}>
                  {s.icon}
                  <span style={{
                    position:'absolute', top:'-8px', right:'-8px',
                    width:'20px', height:'20px',
                    background: i===1 ? '#D4AC0D' : 'rgba(255,255,255,0.14)',
                    borderRadius:'50%', fontSize:'9px', fontWeight:'900',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: i===1 ? '#060D18' : 'rgba(255,255,255,0.6)',
                  }}>{i+1}</span>
                </div>
                <h3 style={{ fontSize:'15px', fontWeight:'800', marginBottom:'9px' }}>{s.title}</h3>
                <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', lineHeight:'1.75' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ padding:'70px 40px 90px', position:'relative', zIndex:1 }}>
        <div style={{
          maxWidth:'660px', margin:'0 auto', textAlign:'center',
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'28px', padding:'54px 36px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:'-50px', left:'50%', transform:'translateX(-50%)',
            width:'280px', height:'180px',
            background:'radial-gradient(ellipse,rgba(192,57,43,0.14) 0%,transparent 70%)',
            filter:'blur(18px)', pointerEvents:'none',
          }}/>
          <div style={{ fontSize:'44px', marginBottom:'18px' }}>✈️</div>
          <h2 style={{ fontSize:'clamp(22px,3.5vw,38px)', fontWeight:'900', marginBottom:'14px', lineHeight:'1.2' }}>
            ابدأ رحلتك الرقمية <span className="shimmer">اليوم</span>
          </h2>
          <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.42)', marginBottom:'32px', lineHeight:'1.8', maxWidth:'400px', margin:'0 auto 32px' }}>
            انضم وابدأ بتوثيق رحلاتك — مجاناً تماماً، بدون أي قيود
          </p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginBottom:'16px' }}>
            <a href="/register" className="btn-red"   style={{ fontSize:'14px', padding:'13px 32px' }}>إنشاء حساب مجاني 🚀</a>
            <a href="/login"    className="btn-ghost" style={{ fontSize:'14px', padding:'13px 32px' }}>تسجيل الدخول</a>
          </div>
          <button className="btn-gold" style={{ fontSize:'12px', padding:'9px 22px' }}>
            📲 تحميل التطبيق على جهازك
          </button>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{
        borderTop:'1px solid rgba(255,255,255,0.06)',
        padding:'24px 36px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        flexWrap:'wrap', gap:'10px', position:'relative', zIndex:1,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
          <div style={{
            width:'26px', height:'26px',
            background:'linear-gradient(135deg,#C0392B,#E74C3C)',
            borderRadius:'7px', fontSize:'12px',
            display:'flex', alignItems:'center', justifyContent:'center',
            transform:'rotate(-8deg)',
          }}>✈️</div>
          <span style={{ fontSize:'13px', fontWeight:'900' }}>
            Travel<span style={{ color:'#D4AC0D' }}>Stamp</span>
          </span>
        </div>
        <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.22)' }}>
          يوميات السفر الرقمية — وثّق كل خطوة 🌍
        </div>
        <div style={{ display:'flex', gap:'14px' }}>
          <a href="/login"    style={{ fontSize:'11px', color:'rgba(255,255,255,0.28)', textDecoration:'none' }}>دخول</a>
          <a href="/register" style={{ fontSize:'11px', color:'rgba(255,255,255,0.28)', textDecoration:'none' }}>تسجيل</a>
        </div>
      </footer>
    </div>
  );
}