import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, display: 'inline-block' };
  const icons = {
    edit:     <svg style={s} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    arrow:    <svg style={s} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    search:   <svg style={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    globe:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
    city:     <svg style={s} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    calendar: <svg style={s} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    star:     <svg style={{ ...s, fill: color }} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    notes:    <svg style={s} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    camera:   <svg style={s} viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    save:     <svg style={s} viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    pin:      <svg style={s} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    check:    <svg style={s} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    close:    <svg style={s} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    alert:    <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    chevron:  <svg style={s} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  };
  return icons[name] || null;
};

function EditVisit() {
  const { id } = useParams();
  const { lang } = useApp();

  const T = {
    ar: {
      title: 'تعديل الزيارة', back: 'رجوع',
      selectCountry: 'الدولة', searchCountry: 'ابحث عن دولة...',
      noResults: 'لا توجد نتائج', selected: 'تم اختيار:',
      selectCity: 'اختر المدينة', loadingCities: 'جاري جلب المدن...',
      selectFirst: 'اختر دولة أولاً', noCities: 'لا توجد مدن',
      noCity: 'لا توجد مدينة بهذا الاسم', citiesAvailable: 'مدينة متاحة',
      locating: 'جاري تحديد الإحداثيات...', locationSet: 'تم تحديد الموقع',
      date: 'التاريخ', rating: 'التقييم', notes: 'الملاحظات', photo: 'صورة الرحلة',
      changePhoto: 'تغيير الصورة', replacePhoto: 'استبدال الصورة', uploadPhoto: 'رفع صورة جديدة',
      newPhoto: 'صورة جديدة', save: 'حفظ التعديلات', saving: 'جاري الحفظ...',
      loading: 'جاري التحميل...', successMsg: 'تم حفظ التعديلات!', errorMsg: 'حدث خطأ، تأكد من البيانات',
    },
    en: {
      title: 'Edit Visit', back: 'Back',
      selectCountry: 'Country', searchCountry: 'Search for a country...',
      noResults: 'No results', selected: 'Selected:',
      selectCity: 'Select City', loadingCities: 'Loading cities...',
      selectFirst: 'Select a country first', noCities: 'No cities available',
      noCity: 'No city found', citiesAvailable: 'cities available',
      locating: 'Getting coordinates...', locationSet: 'Location set',
      date: 'Date', rating: 'Rating', notes: 'Notes', photo: 'Trip Photo',
      changePhoto: 'Change Photo', replacePhoto: 'Replace Photo', uploadPhoto: 'Upload New Photo',
      newPhoto: 'New Photo', save: 'Save Changes', saving: 'Saving...',
      loading: 'Loading...', successMsg: 'Changes saved!', errorMsg: 'An error occurred, please check your data',
    }
  }[lang];

  const [form, setForm] = useState({ country: '', country_code: '', city: '', visit_date: '', notes: '', rating: 5, latitude: '', longitude: '' });
  const [photo,         setPhoto]         = useState(null);
  const [photoPreview,  setPhotoPreview]  = useState(null);
  const [currentPhoto,  setCurrentPhoto]  = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [cities,        setCities]        = useState([]);
  const [citySearch,    setCitySearch]    = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCoords, setLoadingCoords] = useState(false);
  const [showCities,    setShowCities]    = useState(false);
  const [isMobile,      setIsMobile]      = useState(window.innerWidth < 768);
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

  const countries = [
    { name: 'الإمارات',      nameEn: 'United Arab Emirates', code: 'AE', lat: 23.4241,  lng: 53.8478   },
    { name: 'أفغانستان',     nameEn: 'Afghanistan',          code: 'AF', lat: 33.9391,  lng: 67.7100   },
    { name: 'ألبانيا',       nameEn: 'Albania',              code: 'AL', lat: 41.1533,  lng: 20.1683   },
    { name: 'الجزائر',       nameEn: 'Algeria',              code: 'DZ', lat: 28.0339,  lng: 1.6596    },
    { name: 'أندورا',        nameEn: 'Andorra',              code: 'AD', lat: 42.5063,  lng: 1.5218    },
    { name: 'أنغولا',        nameEn: 'Angola',               code: 'AO', lat: -11.2027, lng: 17.8739   },
    { name: 'الأرجنتين',     nameEn: 'Argentina',            code: 'AR', lat: -38.4161, lng: -63.6167  },
    { name: 'أرمينيا',       nameEn: 'Armenia',              code: 'AM', lat: 40.0691,  lng: 45.0382   },
    { name: 'أستراليا',      nameEn: 'Australia',            code: 'AU', lat: -25.2744, lng: 133.7751  },
    { name: 'النمسا',        nameEn: 'Austria',              code: 'AT', lat: 47.5162,  lng: 14.5501   },
    { name: 'أذربيجان',      nameEn: 'Azerbaijan',           code: 'AZ', lat: 40.1431,  lng: 47.5769   },
    { name: 'البحرين',       nameEn: 'Bahrain',              code: 'BH', lat: 26.0667,  lng: 50.5577   },
    { name: 'بنغلاديش',      nameEn: 'Bangladesh',           code: 'BD', lat: 23.6850,  lng: 90.3563   },
    { name: 'بلجيكا',        nameEn: 'Belgium',              code: 'BE', lat: 50.5039,  lng: 4.4699    },
    { name: 'البوسنة',       nameEn: 'Bosnia and Herzegovina',code:'BA', lat: 43.9159,  lng: 17.6791   },
    { name: 'البرازيل',      nameEn: 'Brazil',               code: 'BR', lat: -14.2350, lng: -51.9253  },
    { name: 'بلغاريا',       nameEn: 'Bulgaria',             code: 'BG', lat: 42.7339,  lng: 25.4858   },
    { name: 'كندا',          nameEn: 'Canada',               code: 'CA', lat: 56.1304,  lng: -106.3468 },
    { name: 'الصين',         nameEn: 'China',                code: 'CN', lat: 35.8617,  lng: 104.1954  },
    { name: 'كولومبيا',      nameEn: 'Colombia',             code: 'CO', lat: 4.5709,   lng: -74.2973  },
    { name: 'كرواتيا',       nameEn: 'Croatia',              code: 'HR', lat: 45.1000,  lng: 15.2000   },
    { name: 'كوبا',          nameEn: 'Cuba',                 code: 'CU', lat: 21.5218,  lng: -77.7812  },
    { name: 'قبرص',          nameEn: 'Cyprus',               code: 'CY', lat: 35.1264,  lng: 33.4299   },
    { name: 'التشيك',        nameEn: 'Czech Republic',       code: 'CZ', lat: 49.8175,  lng: 15.4730   },
    { name: 'الدنمارك',      nameEn: 'Denmark',              code: 'DK', lat: 56.2639,  lng: 9.5018    },
    { name: 'مصر',           nameEn: 'Egypt',                code: 'EG', lat: 26.8206,  lng: 30.8025   },
    { name: 'إثيوبيا',       nameEn: 'Ethiopia',             code: 'ET', lat: 9.1450,   lng: 40.4897   },
    { name: 'فنلندا',        nameEn: 'Finland',              code: 'FI', lat: 61.9241,  lng: 25.7482   },
    { name: 'فرنسا',         nameEn: 'France',               code: 'FR', lat: 46.2276,  lng: 2.2137    },
    { name: 'جورجيا',        nameEn: 'Georgia',              code: 'GE', lat: 42.3154,  lng: 43.3569   },
    { name: 'ألمانيا',       nameEn: 'Germany',              code: 'DE', lat: 51.1657,  lng: 10.4515   },
    { name: 'غانا',          nameEn: 'Ghana',                code: 'GH', lat: 7.9465,   lng: -1.0232   },
    { name: 'اليونان',       nameEn: 'Greece',               code: 'GR', lat: 39.0742,  lng: 21.8243   },
    { name: 'غواتيمالا',     nameEn: 'Guatemala',            code: 'GT', lat: 15.7835,  lng: -90.2308  },
    { name: 'هنغاريا',       nameEn: 'Hungary',              code: 'HU', lat: 47.1625,  lng: 19.5033   },
    { name: 'الهند',         nameEn: 'India',                code: 'IN', lat: 20.5937,  lng: 78.9629   },
    { name: 'إندونيسيا',     nameEn: 'Indonesia',            code: 'ID', lat: -0.7893,  lng: 113.9213  },
    { name: 'إيران',         nameEn: 'Iran',                 code: 'IR', lat: 32.4279,  lng: 53.6880   },
    { name: 'العراق',        nameEn: 'Iraq',                 code: 'IQ', lat: 33.2232,  lng: 43.6793   },
    { name: 'أيرلندا',       nameEn: 'Ireland',              code: 'IE', lat: 53.1424,  lng: -7.6921   },
    { name: 'إيطاليا',       nameEn: 'Italy',                code: 'IT', lat: 41.8719,  lng: 12.5674   },
    { name: 'اليابان',       nameEn: 'Japan',                code: 'JP', lat: 36.2048,  lng: 138.2529  },
    { name: 'الأردن',        nameEn: 'Jordan',               code: 'JO', lat: 30.5852,  lng: 36.2384   },
    { name: 'كازاخستان',     nameEn: 'Kazakhstan',           code: 'KZ', lat: 48.0196,  lng: 66.9237   },
    { name: 'كينيا',         nameEn: 'Kenya',                code: 'KE', lat: -0.0236,  lng: 37.9062   },
    { name: 'كوريا الجنوبية',nameEn: 'South Korea',          code: 'KR', lat: 35.9078,  lng: 127.7669  },
    { name: 'الكويت',        nameEn: 'Kuwait',               code: 'KW', lat: 29.3117,  lng: 47.4818   },
    { name: 'قيرغيزستان',    nameEn: 'Kyrgyzstan',           code: 'KG', lat: 41.2044,  lng: 74.7661   },
    { name: 'لبنان',         nameEn: 'Lebanon',              code: 'LB', lat: 33.8547,  lng: 35.8623   },
    { name: 'ليبيا',         nameEn: 'Libya',                code: 'LY', lat: 26.3351,  lng: 17.2283   },
    { name: 'ليختنشتاين',    nameEn: 'Liechtenstein',        code: 'LI', lat: 47.1660,  lng: 9.5554    },
    { name: 'لوكسمبورغ',     nameEn: 'Luxembourg',           code: 'LU', lat: 49.8153,  lng: 6.1296    },
    { name: 'ماليزيا',       nameEn: 'Malaysia',             code: 'MY', lat: 4.2105,   lng: 101.9758  },
    { name: 'المالديف',      nameEn: 'Maldives',             code: 'MV', lat: 3.2028,   lng: 73.2207   },
    { name: 'مالي',          nameEn: 'Mali',                 code: 'ML', lat: 17.5707,  lng: -3.9962   },
    { name: 'مالطا',         nameEn: 'Malta',                code: 'MT', lat: 35.9375,  lng: 14.3754   },
    { name: 'المكسيك',       nameEn: 'Mexico',               code: 'MX', lat: 23.6345,  lng: -102.5528 },
    { name: 'مولدوفا',       nameEn: 'Moldova',              code: 'MD', lat: 47.4116,  lng: 28.3699   },
    { name: 'موناكو',        nameEn: 'Monaco',               code: 'MC', lat: 43.7384,  lng: 7.4246    },
    { name: 'المغرب',        nameEn: 'Morocco',              code: 'MA', lat: 31.7917,  lng: -7.0926   },
    { name: 'موزمبيق',       nameEn: 'Mozambique',           code: 'MZ', lat: -18.6657, lng: 35.5296   },
    { name: 'ميانمار',       nameEn: 'Myanmar',              code: 'MM', lat: 21.9162,  lng: 95.9560   },
    { name: 'هولندا',        nameEn: 'Netherlands',          code: 'NL', lat: 52.1326,  lng: 5.2913    },
    { name: 'نيوزيلندا',     nameEn: 'New Zealand',          code: 'NZ', lat: -40.9006, lng: 174.8860  },
    { name: 'نيجيريا',       nameEn: 'Nigeria',              code: 'NG', lat: 9.0820,   lng: 8.6753    },
    { name: 'النرويج',       nameEn: 'Norway',               code: 'NO', lat: 60.4720,  lng: 8.4689    },
    { name: 'عُمان',         nameEn: 'Oman',                 code: 'OM', lat: 21.4735,  lng: 55.9754   },
    { name: 'باكستان',       nameEn: 'Pakistan',             code: 'PK', lat: 30.3753,  lng: 69.3451   },
    { name: 'فلسطين',        nameEn: 'Palestine',            code: 'PS', lat: 31.9522,  lng: 35.2332   },
    { name: 'بنما',          nameEn: 'Panama',               code: 'PA', lat: 8.5380,   lng: -80.7821  },
    { name: 'بيرو',          nameEn: 'Peru',                 code: 'PE', lat: -9.1900,  lng: -75.0152  },
    { name: 'الفلبين',       nameEn: 'Philippines',          code: 'PH', lat: 12.8797,  lng: 121.7740  },
    { name: 'بولندا',        nameEn: 'Poland',               code: 'PL', lat: 51.9194,  lng: 19.1451   },
    { name: 'البرتغال',      nameEn: 'Portugal',             code: 'PT', lat: 39.3999,  lng: -8.2245   },
    { name: 'قطر',           nameEn: 'Qatar',                code: 'QA', lat: 25.3548,  lng: 51.1839   },
    { name: 'رومانيا',       nameEn: 'Romania',              code: 'RO', lat: 45.9432,  lng: 24.9668   },
    { name: 'روسيا',         nameEn: 'Russia',               code: 'RU', lat: 61.5240,  lng: 105.3188  },
    { name: 'رواندا',        nameEn: 'Rwanda',               code: 'RW', lat: -1.9403,  lng: 29.8739   },
    { name: 'السعودية',      nameEn: 'Saudi Arabia',         code: 'SA', lat: 23.8859,  lng: 45.0792   },
    { name: 'السنغال',       nameEn: 'Senegal',              code: 'SN', lat: 14.4974,  lng: -14.4524  },
    { name: 'صربيا',         nameEn: 'Serbia',               code: 'RS', lat: 44.0165,  lng: 21.0059   },
    { name: 'سنغافورة',      nameEn: 'Singapore',            code: 'SG', lat: 1.3521,   lng: 103.8198  },
    { name: 'سلوفاكيا',      nameEn: 'Slovakia',             code: 'SK', lat: 48.6690,  lng: 19.6990   },
    { name: 'سلوفينيا',      nameEn: 'Slovenia',             code: 'SI', lat: 46.1512,  lng: 14.9955   },
    { name: 'الصومال',       nameEn: 'Somalia',              code: 'SO', lat: 5.1521,   lng: 46.1996   },
    { name: 'جنوب أفريقيا',  nameEn: 'South Africa',         code: 'ZA', lat: -30.5595, lng: 22.9375   },
    { name: 'إسبانيا',       nameEn: 'Spain',                code: 'ES', lat: 40.4637,  lng: -3.7492   },
    { name: 'سريلانكا',      nameEn: 'Sri Lanka',            code: 'LK', lat: 7.8731,   lng: 80.7718   },
    { name: 'السودان',       nameEn: 'Sudan',                code: 'SD', lat: 12.8628,  lng: 30.2176   },
    { name: 'السويد',        nameEn: 'Sweden',               code: 'SE', lat: 60.1282,  lng: 18.6435   },
    { name: 'سويسرا',        nameEn: 'Switzerland',          code: 'CH', lat: 46.8182,  lng: 8.2275    },
    { name: 'سوريا',         nameEn: 'Syria',                code: 'SY', lat: 34.8021,  lng: 38.9968   },
    { name: 'تايوان',        nameEn: 'Taiwan',               code: 'TW', lat: 23.6978,  lng: 120.9605  },
    { name: 'تنزانيا',       nameEn: 'Tanzania',             code: 'TZ', lat: -6.3690,  lng: 34.8888   },
    { name: 'تايلاند',       nameEn: 'Thailand',             code: 'TH', lat: 15.8700,  lng: 100.9925  },
    { name: 'تونس',          nameEn: 'Tunisia',              code: 'TN', lat: 33.8869,  lng: 9.5375    },
    { name: 'تركيا',         nameEn: 'Turkey',               code: 'TR', lat: 38.9637,  lng: 35.2433   },
    { name: 'أوغندا',        nameEn: 'Uganda',               code: 'UG', lat: 1.3733,   lng: 32.2903   },
    { name: 'أوكرانيا',      nameEn: 'Ukraine',              code: 'UA', lat: 48.3794,  lng: 31.1656   },
    { name: 'بريطانيا',      nameEn: 'United Kingdom',       code: 'GB', lat: 55.3781,  lng: -3.4360   },
    { name: 'أمريكا',        nameEn: 'United States',        code: 'US', lat: 37.0902,  lng: -95.7129  },
    { name: 'أوزبكستان',     nameEn: 'Uzbekistan',           code: 'UZ', lat: 41.3775,  lng: 64.5853   },
    { name: 'فنزويلا',       nameEn: 'Venezuela',            code: 'VE', lat: 6.4238,   lng: -66.5897  },
    { name: 'فيتنام',        nameEn: 'Vietnam',              code: 'VN', lat: 14.0583,  lng: 108.2772  },
    { name: 'اليمن',         nameEn: 'Yemen',                code: 'YE', lat: 15.5527,  lng: 48.5164   },
    { name: 'زامبيا',        nameEn: 'Zambia',               code: 'ZM', lat: -13.1339, lng: 27.8493   },
    { name: 'زيمبابوي',      nameEn: 'Zimbabwe',             code: 'ZW', lat: -19.0154, lng: 29.1549   },
  ];

  const filteredCountries = countries.filter(c =>
    lang === 'ar' ? c.name.includes(countrySearch) : c.nameEn.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredCities = cities.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()));
  const getFlagUrl = code => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
  const selectedCountry = countries.find(c => c.code === form.country_code);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => { fetchVisit(); }, []);

  const fetchVisit = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/visits/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const v = res.data;
      setForm({ country: v.country, country_code: v.country_code, city: v.city, visit_date: v.visit_date, notes: v.notes || '', rating: v.rating, latitude: v.latitude || '', longitude: v.longitude || '' });
      setCitySearch(v.city || '');
      if (v.photo_url) setCurrentPhoto(v.photo_url);
      if (v.country_code) {
        const found = countries.find(c => c.code === v.country_code);
        if (found) fetchCities(found.nameEn);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCities = async (countryNameEn) => {
    setLoadingCities(true); setCities([]); setCitySearch(''); setShowCities(false);
    try {
      const res = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: countryNameEn });
      if (res.data?.data) setCities(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoadingCities(false); }
  };

  const fetchCityCoords = async (cityName, countryNameEn) => {
    setLoadingCoords(true);
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?city=${cityName}&country=${countryNameEn}&format=json&limit=1`);
      if (res.data?.length > 0) {
        setForm(prev => ({ ...prev, city: cityName, latitude: parseFloat(res.data[0].lat), longitude: parseFloat(res.data[0].lon) }));
      } else { setForm(prev => ({ ...prev, city: cityName })); }
    } catch { setForm(prev => ({ ...prev, city: cityName })); }
    finally { setLoadingCoords(false); }
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (photo) {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        formData.append('photo', photo);
        await axios.post(`http://127.0.0.1:8000/api/visits/${id}`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.put(`http://127.0.0.1:8000/api/visits/${id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setSuccess(T.successMsg);
      setTimeout(() => window.location.href = `/visit/${id}`, 1500);
    } catch { setError(T.errorMsg); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Tajawal, sans-serif', transition: 'border-color 0.2s' };
  const cardStyle  = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '16px' : '20px', marginBottom: '14px' };
  const labelStyle = { fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' };

  const cardW = isMobile ? '70px' : '82px';
  const flagW = isMobile ? '44px' : '54px';
  const flagH = isMobile ? '30px' : '36px';

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060D18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tajawal, sans-serif', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
      {T.loading}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#060D18', fontFamily: 'Tajawal, sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr', position: 'relative' }}>
      <style>{`
        @keyframes twinkle    { 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes pulse-glow { 0%,100%{opacity:0.06;transform:scale(1)} 50%{opacity:0.11;transform:scale(1.04)} }
        @keyframes slideDown  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .country-card:hover { border-color:rgba(231,76,60,0.5)!important; background:rgba(255,255,255,0.08)!important; transform:translateY(-2px); }
        .edit-input:focus { border-color:rgba(192,57,43,0.4)!important; }
        .edit-input::placeholder { color:rgba(255,255,255,0.2); }
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.03);border-radius:10px}
        ::-webkit-scrollbar-thumb{background:rgba(192,57,43,0.4);border-radius:10px}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5)}
      `}</style>

      {/* نجوم */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {starsRef.current.map(s => (
          <div key={s.id} style={{ position: 'absolute', width: s.width+'px', height: s.width+'px', borderRadius: '50%', background: 'white', top: s.top+'%', left: s.left+'%', opacity: s.opacity, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }}/>
        ))}
        <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', background: 'rgba(192,57,43,0.07)', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse-glow 7s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', background: 'rgba(46,134,193,0.07)', borderRadius: '50%', filter: 'blur(80px)', animation: 'pulse-glow 9s ease-in-out 2s infinite' }}/>
      </div>

      {/* Header */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: isMobile ? '18px 16px' : '28px 20px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href={`/visit/${id}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon name="arrow" size={13} color="rgba(255,255,255,0.5)"/>{T.back}
        </a>
        <span style={{ color: 'white', fontSize: isMobile ? '14px' : '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="edit" size={16} color="#D4AC0D"/>
          {T.title}
        </span>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: isMobile ? '0 16px 40px' : '0 20px 40px', position: 'relative', zIndex: 1 }}>

        {error && (
          <div style={{ background: 'rgba(192,57,43,0.12)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.3)', padding: '12px 14px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="alert" size={15} color="#E74C3C"/>{error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60', border: '1px solid rgba(39,174,96,0.3)', padding: '12px 14px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="check" size={15} color="#27AE60"/>{success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── الدولة ── */}
          <div style={cardStyle}>
            <label style={labelStyle}>
              <Icon name="globe" size={14} color="rgba(255,255,255,0.4)"/>{T.selectCountry}
            </label>
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <span style={{ position: 'absolute', [lang==='ar'?'right':'left']: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                <Icon name="search" size={14} color="rgba(255,255,255,0.3)"/>
              </span>
              <input className="edit-input" type="text" value={countrySearch} onChange={e => setCountrySearch(e.target.value)} placeholder={T.searchCountry}
                style={{ ...inputStyle, padding: lang==='ar' ? '9px 36px 9px 14px' : '9px 14px 9px 36px' }}/>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '8px' : '10px', maxHeight: isMobile ? '220px' : '300px', overflowY: 'auto', paddingBottom: '4px' }}>
              {filteredCountries.length === 0
                ? <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', padding: '8px' }}>{T.noResults}</div>
                : filteredCountries.map(c => (
                  <div key={c.code} className="country-card"
                    onClick={() => { setForm({ ...form, country: c.name, country_code: c.code, latitude: c.lat, longitude: c.lng, city: '' }); setCitySearch(''); setShowCities(false); fetchCities(c.nameEn); }}
                    style={{ width: cardW, padding: isMobile ? '8px 6px' : '12px 8px', borderRadius: '16px', cursor: 'pointer', background: form.country_code===c.code ? 'linear-gradient(135deg,rgba(192,57,43,0.5),rgba(231,76,60,0.35))' : 'rgba(255,255,255,0.04)', border: `2px solid ${form.country_code===c.code ? '#E74C3C' : 'rgba(255,255,255,0.08)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s', flexShrink: 0, boxShadow: form.country_code===c.code ? '0 4px 16px rgba(192,57,43,0.35)' : 'none' }}
                  >
                    <img src={getFlagUrl(c.code)} alt={c.nameEn} style={{ width: flagW, height: flagH, borderRadius: '5px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}/>
                    <span style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: form.country_code===c.code ? 'white' : 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: '1.3', wordBreak: 'break-word', width: '100%' }}>
                      {lang==='ar' ? c.name : c.nameEn}
                    </span>
                  </div>
                ))
              }
            </div>

            {form.country && (
              <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={getFlagUrl(form.country_code)} alt="" style={{ width: '24px', height: '16px', borderRadius: '3px', objectFit: 'cover' }}/>
                {T.selected} <strong style={{ color: 'white' }}>{lang==='ar' ? form.country : selectedCountry?.nameEn}</strong>
              </div>
            )}
          </div>

          {/* ── المدينة ── */}
          <div style={{ ...cardStyle, position: 'relative' }}>
            <label style={labelStyle}>
              <Icon name="city" size={14} color="rgba(255,255,255,0.4)"/>{T.selectCity}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', [lang==='ar'?'right':'left']: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                <Icon name="chevron" size={13} color="rgba(255,255,255,0.25)"/>
              </span>
              <input className="edit-input" type="text" value={citySearch}
                onChange={e => { setCitySearch(e.target.value); setShowCities(true); }}
                onFocus={() => setShowCities(true)}
                onBlur={() => setTimeout(() => setShowCities(false), 150)}
                placeholder={loadingCities ? T.loadingCities : !form.country ? T.selectFirst : cities.length > 0 ? `${cities.length} ${T.citiesAvailable}` : T.noCities}
                disabled={loadingCities || !form.country || cities.length === 0}
                style={{ ...inputStyle, padding: lang==='ar' ? '12px 40px 12px 16px' : '12px 16px 12px 40px', cursor: (!form.country || cities.length===0) ? 'not-allowed' : 'text', opacity: (!form.country || loadingCities) ? 0.4 : 1 }}
              />
              {showCities && cities.length > 0 && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, left: 0, zIndex: 9999, maxHeight: '220px', overflowY: 'auto', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: '#162840', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', animation: 'slideDown 0.2s ease' }}>
                  <div style={{ padding: '8px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    {citySearch ? `${filteredCities.length} / ${cities.length}` : `${cities.length} ${T.citiesAvailable}`}
                  </div>
                  {filteredCities.length === 0
                    ? <div style={{ padding: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{T.noCity}</div>
                    : filteredCities.map((city, i) => (
                      <div key={i} onMouseDown={() => { setCitySearch(city); setShowCities(false); fetchCityCoords(city, selectedCountry?.nameEn || form.country); }}
                        style={{ padding: '11px 16px', fontSize: '13px', cursor: 'pointer', color: form.city===city ? 'white' : 'rgba(255,255,255,0.65)', background: form.city===city ? 'rgba(192,57,43,0.2)' : 'transparent', borderBottom: i<filteredCities.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                        onMouseLeave={e => e.currentTarget.style.background = form.city===city ? 'rgba(192,57,43,0.2)' : 'transparent'}
                      >
                        {city}
                        {form.city === city && <Icon name="check" size={13} color="#E74C3C"/>}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            {loadingCoords && <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="pin" size={12} color="rgba(255,255,255,0.3)"/>{T.locating}</div>}
            {form.city && !loadingCoords && (
              <div style={{ marginTop: '10px', padding: '9px 14px', background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="pin" size={13} color="#27AE60"/>
                <strong style={{ color: 'white' }}>{form.city}</strong>
                {form.latitude && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginRight: 'auto' }}>{T.locationSet}</span>}
              </div>
            )}
          </div>

          {/* ── التاريخ ── */}
          <div style={cardStyle}>
            <label style={labelStyle}><Icon name="calendar" size={14} color="rgba(255,255,255,0.4)"/>{T.date}</label>
            <input className="edit-input" type="date" value={form.visit_date} onChange={e => setForm({ ...form, visit_date: e.target.value })} style={inputStyle}/>
          </div>

          {/* ── التقييم ── */}
          <div style={cardStyle}>
            <label style={labelStyle}><Icon name="star" size={14} color="rgba(255,255,255,0.4)"/>{T.rating}</label>
            <div style={{ display: 'flex', gap: isMobile ? '12px' : '10px' }}>
              {[1,2,3,4,5].map(s => (
                <div key={s} onClick={() => setForm({ ...form, rating: s })} style={{ cursor: 'pointer', transition: 'transform 0.15s', transform: s === form.rating ? 'scale(1.2)' : 'scale(1)' }}>
                  <Icon name="star" size={isMobile ? 32 : 28} color={s <= form.rating ? '#D4AC0D' : 'rgba(255,255,255,0.1)'}/>
                </div>
              ))}
            </div>
          </div>

          {/* ── الملاحظات ── */}
          <div style={cardStyle}>
            <label style={labelStyle}><Icon name="notes" size={14} color="rgba(255,255,255,0.4)"/>{T.notes}</label>
            <textarea className="edit-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'none' }}/>
          </div>

          {/* ── الصورة ── */}
          <div style={cardStyle}>
            <label style={labelStyle}><Icon name="camera" size={14} color="rgba(255,255,255,0.4)"/>{T.photo}</label>
            {(photoPreview || currentPhoto) && (
              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <img src={photoPreview || currentPhoto} alt="preview" style={{ width: '100%', height: isMobile ? '160px' : '180px', objectFit: 'cover', borderRadius: '12px', display: 'block' }}/>
                {photoPreview && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(39,174,96,0.9)', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Icon name="check" size={11} color="white"/>{T.newPhoto}
                  </div>
                )}
              </div>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.03)' }}>
              <Icon name="camera" size={20} color="rgba(255,255,255,0.25)"/>
              {photoPreview ? T.changePhoto : currentPhoto ? T.replacePhoto : T.uploadPhoto}
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }}/>
            </label>
          </div>

          {/* ── زر الحفظ ── */}
          <button type="submit" disabled={saving} style={{ width: '100%', padding: '15px', background: saving ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#C0392B,#E74C3C)', color: saving ? 'rgba(255,255,255,0.3)' : 'white', border: 'none', borderRadius: '16px', fontSize: '15px', fontWeight: '800', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: saving ? 'none' : '0 8px 24px rgba(192,57,43,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
            {saving ? T.saving : <><Icon name="save" size={16} color="white"/>{T.save}</>}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditVisit;