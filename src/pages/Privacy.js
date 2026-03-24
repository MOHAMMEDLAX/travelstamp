import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// Reuse the Icon component from LandingPage (or import from a shared file)
const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display:'inline-block' };
  const icons = {
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
    shield:   <svg style={s} viewBox="0 0 24 24"><path d="M12 2L3 7v7c0 5.5 9 8 9 8s9-2.5 9-8V7l-9-5z"/><path d="M12 12l2 2 4-4"/></svg>,
    lock:     <svg style={s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    cookie:   <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="16" cy="16" r="1"/><circle cx="8" cy="16" r="1"/></svg>,
    mail:     <svg style={s} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    arrowLeft:<svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    arrowRight:<svg style={s} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    lang:     <svg style={s} viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>,
    database: <svg style={s} viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  };
  return icons[name] || null;
};

// Privacy content in both languages - updated for local storage only
const privacyContent = {
  ar: {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: 24 مارس 2026',
    intro: 'في TravelStamp، خصوصيتك هي أولويتنا. جميع بياناتك محفوظة محلياً على هاتفك فقط. نحن لا نجمع أي معلومات على خوادمنا، ولا نشارك بياناتك مع أي طرف خارجي.',
    sections: [
      {
        title: 'البيانات التي نجمعها محلياً',
        icon: 'database',
        content: [
          '• الاسم: الاسم الذي تختاره لعرضه في التطبيق.',
          '• صورة الملف الشخصي: صورة شخصية تختارها (تخزن محلياً فقط).',
          '• الدولة: الدولة التي تحددها لرحلاتك.',
          '• بيانات الرحلات: الوجهات، التواريخ، الصور المرفوعة، والتقييمات (تخزن على جهازك فقط).'
        ]
      },
      {
        title: 'تخزين البيانات',
        icon: 'lock',
        content: [
          '• جميع بياناتك محفوظة حصرياً على جهازك (الهاتف).',
          '• لا يتم رفع أي من بياناتك إلى خوادم خارجية.',
          '• يمكنك حذف التطبيق لمسح جميع بياناتك بالكامل.'
        ]
      },
      {
        title: 'مشاركة البيانات',
        icon: 'shield',
        content: [
          '• نحن لا نشارك أي من بياناتك مع أطراف ثالثة.',
          '• لا نبيع أو نؤجر معلوماتك لأي جهة.',
          '• لا توجد خوادم مركزية لتخزين بياناتك.'
        ]
      },
      {
        title: 'الأمان',
        icon: 'lock',
        content: [
          '• بما أن البيانات مخزنة محلياً، فإن أمانها يعتمد على جهازك.',
          '• نوصي باستخدام قفل الشاشة ووسائل الحماية المتاحة على هاتفك.',
          '• التطبيق لا يتطلب أي أذونات إضافية غير ضرورية.'
        ]
      },
      {
        title: 'ملفات تعريف الارتباط (Cookies)',
        icon: 'cookie',
        content: [
          '• التطبيق لا يستخدم ملفات تعريف الارتباط لتتبعك.',
          '• قد تستخدم المتصفحات الداخلية (عند عرض الخريطة) ملفات تعريف ارتباط خاصة بها، ولكنها لا ترتبط ببياناتك الشخصية.'
        ]
      },
      {
        title: 'حقوقك',
        icon: 'mail',
        content: [
          '• يمكنك التحكم الكامل ببياناتك: عرضها، تعديلها، أو حذفها من خلال التطبيق.',
          '• إزالة التطبيق يحذف جميع البيانات المرتبطة به.',
          '• للاستفسارات: support@travelstamp.com'
        ]
      }
    ],
    contact: 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني:',
    email: 'support@travelstamp.com',
    backToHome: 'العودة إلى الرئيسية'
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: March 24, 2026',
    intro: 'At TravelStamp, your privacy is our priority. All your data is stored locally on your device only. We do not collect any information on our servers, nor do we share your data with any external parties.',
    sections: [
      {
        title: 'Data We Collect Locally',
        icon: 'database',
        content: [
          '• Name: The name you choose to display in the app.',
          '• Profile photo: A personal photo you select (stored locally only).',
          '• Country: The country you specify for your trips.',
          '• Trip data: Destinations, dates, uploaded photos, and ratings (stored only on your device).'
        ]
      },
      {
        title: 'Data Storage',
        icon: 'lock',
        content: [
          '• All your data is stored exclusively on your device (phone).',
          '• None of your data is uploaded to external servers.',
          '• You can delete the app to completely erase all your data.'
        ]
      },
      {
        title: 'Data Sharing',
        icon: 'shield',
        content: [
          '• We do not share any of your data with third parties.',
          '• We do not sell or rent your information to anyone.',
          '• There are no central servers storing your data.'
        ]
      },
      {
        title: 'Security',
        icon: 'lock',
        content: [
          '• Since data is stored locally, its security depends on your device.',
          '• We recommend using screen lock and available security measures on your phone.',
          '• The app does not require any unnecessary additional permissions.'
        ]
      },
      {
        title: 'Cookies',
        icon: 'cookie',
        content: [
          '• The app does not use cookies to track you.',
          '• Internal browsers (when viewing the map) may use their own cookies, but these are not linked to your personal data.'
        ]
      },
      {
        title: 'Your Rights',
        icon: 'mail',
        content: [
          '• You have full control over your data: view, edit, or delete it through the app.',
          '• Removing the app deletes all associated data.',
          '• For inquiries: support@travelstamp.com'
        ]
      }
    ],
    contact: 'If you have any questions about this Privacy Policy, please contact us at:',
    email: 'support@travelstamp.com',
    backToHome: 'Back to Home'
  }
};

export default function PrivacyPage() {
  const { lang, setLang } = useApp();
  const content = privacyContent[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Stars background (same as landing page)
  const starsRef = useRef([]);
  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      w: Math.random() * 1.8 + 0.6,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: (Math.random() * 4 + 2).toFixed(1),
      del: (Math.random() * 5).toFixed(1),
      op: (Math.random() * 0.4 + 0.08).toFixed(2),
    }));
  }

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

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
        @keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.7} }
        @keyframes langPop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }

        .fade-up { animation:fadeUp 0.6s ease forwards; }
        .privacy-card {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:22px;
          padding:24px;
          transition:all 0.3s;
        }
        .privacy-card:hover {
          background:rgba(255,255,255,0.05);
          border-color:rgba(255,255,255,0.12);
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
      `}</style>

      {/* Stars background */}
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

      {/* Language toggle */}
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

      {/* Header / Navigation */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        padding:'0 20px', height:'64px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background: scrollY > 40 ? 'rgba(6,13,24,0.92)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(22px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition:'all .4s ease',
      }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:'9px', textDecoration:'none', color:'white' }}>
          <img src="/logo.png" alt="TravelStamp" style={{ width:'38px', height:'38px', objectFit:'contain' }}/>
          <span style={{ fontSize:'18px', fontWeight:'900', letterSpacing:'-0.4px' }}>
            Travel<span style={{ color:'#D4AC0D' }}>Stamp</span>
          </span>
        </a>
        <a href="/" style={{
          display:'flex', alignItems:'center', gap:'8px',
          background:'rgba(255,255,255,0.06)',
          padding:'8px 16px', borderRadius:'40px',
          textDecoration:'none', color:'rgba(255,255,255,0.8)',
          fontSize:'13px', fontWeight:'700',
          border:'1px solid rgba(255,255,255,0.12)',
          transition:'all 0.2s',
        }}>
          <Icon name={lang === 'ar' ? 'arrowRight' : 'arrowLeft'} size={14} color="rgba(255,255,255,0.7)"/>
          {content.backToHome}
        </a>
      </nav>

      {/* Main content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile ? '100px 20px 80px' : '120px 40px 100px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '900',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #fff 0%, #D4AC0D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {content.title}
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '40px',
            borderLeft: lang === 'ar' ? 'none' : '3px solid #D4AC0D',
            borderRight: lang === 'ar' ? '3px solid #D4AC0D' : 'none',
            paddingLeft: lang === 'ar' ? '0' : '16px',
            paddingRight: lang === 'ar' ? '16px' : '0',
          }}>
            {content.lastUpdated}
          </p>
          <div style={{
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '48px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '20px',
            padding: '24px',
            borderLeft: `4px solid #D4AC0D`,
          }}>
            {content.intro}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {content.sections.map((section, idx) => (
            <div
              key={idx}
              className="privacy-card fade-up"
              style={{ animationDelay: `${0.2 + idx * 0.05}s`, opacity: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'rgba(212,172,13,0.12)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={section.icon} size={22} color="#D4AC0D" />
                </div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  margin: 0,
                  color: '#D4AC0D',
                }}>
                  {section.title}
                </h2>
              </div>
              <div style={{
                paddingLeft: lang === 'ar' ? '0' : '58px',
                paddingRight: lang === 'ar' ? '58px' : '0',
              }}>
                {section.content.map((item, i) => (
                  <p key={i} style={{
                    marginBottom: '8px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'rgba(255,255,255,0.6)',
                  }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fade-up" style={{
          marginTop: '48px',
          padding: '24px',
          background: 'rgba(212,172,13,0.05)',
          borderRadius: '20px',
          textAlign: 'center',
          border: '1px solid rgba(212,172,13,0.2)',
          animationDelay: '0.6s', opacity: 0,
        }}>
          <Icon name="mail" size={24} color="#D4AC0D" style={{ marginBottom: '12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
            {content.contact}
          </p>
          <a href={`mailto:${content.email}`} style={{
            color: '#D4AC0D',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '16px',
            borderBottom: '1px dashed rgba(212,172,13,0.5)',
          }}>
            {content.email}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: isMobile ? '20px 16px' : '24px 36px',
        textAlign: 'center',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.22)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span>© 2026 TravelStamp</span>
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>{content.title}</a>
          <a href="/terms" style={{ color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</a>
        </div>
      </footer>
    </div>
  );
}