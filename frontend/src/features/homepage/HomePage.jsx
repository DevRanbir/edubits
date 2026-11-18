import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  BrainCircuit,
  GraduationCap,
  ClipboardList,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/authValue";
import { API_URL } from "../../config/api";
import { GoogleIcon } from "./BrandIcons";
import GradientASCII from "../../components/ui/GradientASCII";
import SiteFooterLogo from "../../components/layout/SiteFooterLogo";
import LandingParentSquare from "./LandingParentSquare";
import WarmTooltip from "../../components/ui/WarmTooltip";
import { getRecentActivities, formatTimeAgo } from "../../utils/recentActivity";
import "./homepage.css";

const GREETINGS = [
  // Indian Languages
  { text: "स्वागत है", lang: "Hindi", translit: "swaagat hai" },
  { text: "पुनः स्वागत है", lang: "Hindi (Formal)", translit: "Punah swaagat hai" },
  { text: "स्वागतम्", lang: "Sanskrit", translit: "Swagatam" },
  { text: "ਜੀ ਆਇਆਂ ਨੂੰ", lang: "Punjabi", translit: "Ji aayan nu" },
  { text: "ਮੁੜ ਸਵਾਗਤ ਹੈ", lang: "Punjabi", translit: "Murh swaagat hai" },
  { text: "আবার স্বাগতম", lang: "Bengali", translit: "Abar shagotom" },
  { text: "পুনরায় স্বাগতম", lang: "Bengali (Formal)", translit: "Punoray shagotom" },
  { text: "ફરી સ્વાગત છે", lang: "Gujarati", translit: "Fari swaagat chhe" },
  { text: "ફરીથી સ્વાગત છે", lang: "Gujarati", translit: "Farithi swaagat chhe" },
  { text: "फेर से स्वागत बा", lang: "Bhojpuri", translit: "Pher se swagat ba" },
  { text: "फेरु स्वागत छै", lang: "Maithili", translit: "Pheru swagat chhai" },
  { text: "फेर से स्वागत छै", lang: "Magahi", translit: "Pher se swagat chhai" },
  { text: "ମୁଁ ପୁଣି ସ୍ୱାଗତ କରୁଛି", lang: "Odia", translit: "Mu puni swagat karuchhi" },
  { text: "ପୁଣିଥରେ ସ୍ୱାଗତ", lang: "Odia", translit: "Puni thare swagat" },
  { text: "আকৌ আদৰণি", lang: "Assamese", translit: "Aakou adoroni" },
  { text: "পুনৰ স্বাগতম", lang: "Assamese", translit: "Punar swagatam" },
  { text: "மீண்டும் நல்வரவு", lang: "Tamil", translit: "Meendum nalvaravu" },
  { text: "மீண்டும் வருக", lang: "Tamil", translit: "Meendum varuga" },
  { text: "మళ్ళీ స్వాగతం", lang: "Telugu", translit: "Malli swagatham" },
  { text: "మరోసారి స్వాగతం", lang: "Telugu", translit: "Marosari swagatham" },
  { text: "ಮತ್ತೊಮ್ಮೆ ಸ್ವಾಗತ", lang: "Kannada", translit: "Mattomme swagatha" },
  { text: "ಮತ್ತೆ ಸ್ವಾಗತ", lang: "Kannada", translit: "Matte swagatha" },
  { text: "വീണ്ടും സ്വാഗതം", lang: "Malayalam", translit: "Veendum swagatham" },
  { text: "മറുപടി സ്വാഗതം", lang: "Malayalam", translit: "Marupadi swagatham" },
  { text: "पुन्हा स्वागत आहे", lang: "Marathi", translit: "Punha swagat aahe" },
  { text: "पुन्हा एकदा स्वागत", lang: "Marathi", translit: "Punha ekda swagat" },
  { text: "ફરી પધારો", lang: "Gujarati", translit: "Fari padhaaro" },
  { text: "خوش آمدید", lang: "Urdu", translit: "Khush aamdeed" },
  { text: "دوبارہ خوش آمدید", lang: "Urdu", translit: "Dobara khush aamdeed" },
  { text: "دوبارہ ڀليڪار", lang: "Sindhi", translit: "Dobara bhali kar" },
  { text: "पुनः स्वागत", lang: "Konkani", translit: "Punha swagat" },
  { text: "دوبارہ خوش آمدید", lang: "Kashmiri", translit: "Dobara khush aamdeed" },
  { text: "फेर त स्वागत छै", lang: "Dogri", translit: "Pher ta swagat chhai" },
  { text: "ᱫᱚᱦᱲᱟ ᱥᱟᱜᱟᱛ", lang: "Santali", translit: "Dohora sagat" },
  { text: "फेर से स्वागत", lang: "Haryanvi", translit: "Pher te swagat" },
  { text: "फेर पधारो", lang: "Rajasthani", translit: "Pher padhaaro" },
  { text: "फेर स्वागत", lang: "Chhattisgarhi", translit: "Pher swagat" },
  { text: "ફરી આવકાર", lang: "Gujarati", translit: "Fari aavkaar" },

  // Indian Regional / Cultural Variations
  { text: "राम राम सा", lang: "Rajasthani", translit: "Ram Ram sa" },
  { text: "खम्मा घणी", lang: "Marwari", translit: "Khamma Ghani" },
  { text: "राम राम", lang: "Haryanvi", translit: "Ram Ram" },
  { text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", lang: "Punjabi", translit: "Sat Sri Akaal" },
  { text: "நல்வரவு", lang: "Tamil", translit: "Nalvaravu" },
  { text: "స్వాగతం", lang: "Telugu", translit: "Swagatham" },
  { text: "ಸ್ವಾಗತ", lang: "Kannada", translit: "Swagatha" },
  { text: "സ്വാഗതം", lang: "Malayalam", translit: "Swagatham" },
  { text: "স্বাগতম", lang: "Bengali", translit: "Shagotom" },
  { text: "સ્વાગત છે", lang: "Gujarati", translit: "Swaagat chhe" },
  { text: "ସ୍ୱାଗତ", lang: "Odia", translit: "Swagata" },
  { text: "स्वागत आहे", lang: "Marathi", translit: "Swagat aahe" },
  { text: "स्वागत बा", lang: "Bhojpuri", translit: "Swagat ba" },
  { text: "स्वागतम्", lang: "Sanskrit", translit: "Swagatam" },

  // International
  { text: "¡Bienvenido de nuevo!", lang: "Spanish", translit: "Bienvenido de nuevo" },
  { text: "Welcome back", lang: "English", translit: "Welcome back" },
  { text: "Bienvenue à nouveau", lang: "French", translit: "Bienvenue à nouveau" },
  { text: "Willkommen zurück", lang: "German", translit: "Willkommen zurück" },
  { text: "おかえりなさい", lang: "Japanese", translit: "Okaerinasai" },
  { text: "다시 오신 환영합니다", lang: "Korean", translit: "Dasi osin geoseul hwanyeonghamnida" },
  { text: "欢迎回来", lang: "Chinese", translit: "Huanying huilai" },
  { text: "مرحباً بعودتك", lang: "Arabic", translit: "Marhaban bi awdatik" },
  { text: "Добро пожаловать обратно", lang: "Russian", translit: "Dobro pozhalovat obratno" },
  { text: "Hoş geldin", lang: "Turkish", translit: "Hos geldin" },
  { text: "Bem-vindo de volta", lang: "Portuguese", translit: "Bem-vindo de volta" },
  { text: "Καλώς ήρθες ξανά", lang: "Greek", translit: "Kalos irthes xana" },
  { text: "Tervetuloa takaisin", lang: "Finnish", translit: "Tervetuloa takaisin" },
  { text: "Välkommen tillbaka", lang: "Swedish", translit: "Valkommen tillbaka" },
  { text: "Welkom terug", lang: "Dutch", translit: "Welkom terug" },
  { text: "ยินดีต้อนรับกลับ", lang: "Thai", translit: "Yin dee ton rap glap" },
  { text: "Selamat datang kembali", lang: "Indonesian", translit: "Selamat datang kembali" },
  { text: "Maligayang pagbabalik", lang: "Filipino", translit: "Maligayang pagbabalik" },
];

const SUBJECT_IMAGES = {
  "Mathematics-I": "/images/maths2.svg",
  "Digital Electronics": "/images/fede.svg",
  "Engineering Physics": "/images/ep.svg",
  "LTPS": "/images/dsa.svg",
  "Biology": "/images/bio.svg",
  "COA": "/images/coa.svg",
  "DBMS": "/images/dbms.svg",
  "ADSA": "/images/daa.svg",
  "Java": "/images/java.svg",
  "Software Engineering": "/images/se.svg",
  "Operating System": "/images/os.svg",
  "Machine Learning": "/images/ml.svg",
  "Probability & Statistics": "/images/pns.svg",
  "PBL_Java": "/images/java.svg",
  "Computer Networks": "/images/coa.svg",
  "Web Development Fundamentals": "/images/daa.svg",
  "Business Analytics": "/images/business.svg",
  "Ethical Hacking": "/images/java.svg",
  "Mathematics-II": "/images/maths2.svg",
  "OOPS Using Java": "/images/java.svg",
};

const SUBJECTS_BY_YEAR = {
  "1st Year": ["Mathematics-I", "Digital Electronics", "Engineering Physics", "LTPS", "Biology"],
  "2nd Year": ["COA", "DBMS", "ADSA", "Java", "Software Engineering", "Operating System", "Machine Learning", "Probability & Statistics"],
  "3rd Year": ["PBL_Java", "Computer Networks", "Probability & Statistics"],
  "4th Year": ["Ethical Hacking"],
};

const FEATURED_QUIZ_TOPICS = [
  { name: "HTML Fundamentals", qs: "10 Qs", time: "30s / Q" },
  { name: "CSS Styling", qs: "10 Qs", time: "30s / Q" },
  { name: "JavaScript", qs: "10 Qs", time: "30s / Q" },
  { name: "React", qs: "10 Qs", time: "30s / Q" },
  { name: "Java", qs: "10 Qs", time: "30s / Q" },
  { name: "DAA", qs: "10 Qs", time: "30s / Q" },
];

function AuthActions() {
  return (
    <div className="hp-actions">
      <div className="hp-auth-buttons">
        <Link to="/register" className="hp-btn hp-btn-primary">
          Get started
        </Link>
        <a href={`${API_URL}/auth/google`} className="hp-btn hp-btn-secondary">
          <GoogleIcon /> Continue with Google
        </a>
      </div>
      <p className="hp-login-hint">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

function MemberView({ user }) {
  const [recentActivities, setRecentActivities] = useState(() => getRecentActivities(user));

  useEffect(() => {
    setRecentActivities(getRecentActivities(user));
  }, [user]);

  // Multilingual greeting rotating on each page refresh
  const [greetingIndex, setGreetingIndex] = useState(() => {
    try {
      const stored = localStorage.getItem("edubits_dashboard_greeting_idx");
      const nextIdx = stored !== null ? (parseInt(stored, 10) + 1) % GREETINGS.length : 0;
      localStorage.setItem("edubits_dashboard_greeting_idx", String(nextIdx));
      return nextIdx;
    } catch {
      return 0;
    }
  });

  const currentGreeting = GREETINGS[greetingIndex] || GREETINGS[0];

  const cycleGreeting = () => {
    setGreetingIndex((prev) => {
      const next = (prev + 1) % GREETINGS.length;
      try {
        localStorage.setItem("edubits_dashboard_greeting_idx", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const userName = user?.name || user?.email?.split("@")[0] || "Student";
  const defaultYear =
    localStorage.getItem("edubits_academic_year") || user?.academicYear || "3rd Year";
  const [activeYear, setActiveYear] = useState(defaultYear);

  const academicProgram = (
    localStorage.getItem("edubits_academic_program") || user?.academicProgram || "cse"
  ).toUpperCase();

  const currentSubjects = SUBJECTS_BY_YEAR[activeYear] || SUBJECTS_BY_YEAR["3rd Year"];

  const handleYearChange = (yr) => {
    setActiveYear(yr);
    try {
      localStorage.setItem("edubits_academic_year", yr);
    } catch {
      // ignore
    }
  };

  const utilityTools = [
    {
      id: "sgpa",
      name: "SGPA Calculator",
      desc: "Calculate semester SGPA with custom credits and grade scales.",
      href: "/tasks?tab=sgpa",
      icon: GraduationCap,
      badge: "Tool Deck",
    },
    {
      id: "internals",
      name: "Internal Marks",
      desc: "Track MSTs, assignment scores, and attendance requirements.",
      href: "/tasks?tab=internals",
      icon: ClipboardList,
      badge: "Planner",
    },
  ];

  return (
    <main className="hp-main hp-main--member">
      {/* Ambient ASCII texture */}
      <div className="hp-member-ascii-bg" aria-hidden="true">
        <GradientASCII
          shape="horizon"
          colors={["#115d62", "#1f7771", "#3e9b8f", "#5cc2b4"]}
          density={0.7}
          glyphOpacity={0.65}
          glow={0.3}
          flicker={0.12}
          mouseInteraction={true}
        />
      </div>

      {/* Hero Header */}
      <header className="hp-hero hp-member-hero">
        <h1 className="hp-headline">
          <WarmTooltip
            content={`Translates to "${currentGreeting.translit}"  in ${currentGreeting.lang} - Click to change`}
            side="top"
          >
            <span
              className="hp-greeting-interactive"
              onClick={cycleGreeting}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  cycleGreeting();
                }
              }}
            >
              {currentGreeting.text}
            </span>
          </WarmTooltip>
          , <br />
          <span>{userName}</span>
        </h1>
        <p className="hp-tagline">Everything you need for engineering, in one sleek workspace.</p>
      </header>

      {/* Main Workspace Layout */}
      <div className="hp-member-sections">
        {/* 1. Primary Subject Resources Workspace */}
        <section className="hp-section hp-section--spacious">
          <div className="hp-section-header hp-section-header--subjects">
            <div className="hp-section-title-block">
              <div className="hp-section-title-row">
                <h2 className="hp-section-title">{activeYear} Subjects</h2>
                <span className="hp-section-meta-pill">{academicProgram}</span>
              </div>
              <p className="hp-section-desc">
                Previous year papers with verified solutions, lecture playlists, and unit notes.
              </p>
            </div>

            {/* Quick Year Switcher */}
            <div className="hp-year-switcher" role="tablist" aria-label="Select Academic Year">
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleYearChange(yr)}
                  className={`hp-year-switcher-btn ${activeYear === yr ? "active" : ""}`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Rich Subject Cards with Fading Illustration Art */}
          <div className="hp-subjects-grid">
            {currentSubjects.map((subject) => {
              const imgUrl = SUBJECT_IMAGES[subject] || "/images/java.svg";
              return (
                <Link
                  key={subject}
                  to={`/resources/${encodeURIComponent(activeYear)}/${encodeURIComponent(subject)}`}
                  className="hp-subject-card"
                >
                  {/* Subtle top ASCII sheen */}
                  <div className="hp-subject-card-overlay" aria-hidden="true" />

                  {/* Header info */}
                  <div className="hp-subject-card-header">
                    <div className="hp-subject-card-top-row">
                      <span className="hp-subject-kicker">{activeYear}</span>
                      <span className="hp-subject-open-hint">
                        <span>Workspace</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                    <h3 className="hp-subject-name">{subject}</h3>
                    <div className="hp-subject-tags">
                      <span className="hp-subject-tag">PYQs &amp; Solutions</span>
                      <span className="hp-subject-tag">Unit Notes</span>
                      <span className="hp-subject-tag">Playlists</span>
                    </div>
                  </div>

                  {/* Bottom Subject Illustration Fading In */}
                  <div className="hp-subject-art-wrap" aria-hidden="true">
                    <img src={imgUrl} alt="" className="hp-subject-art" loading="lazy" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 2. Command Deck: Practice (QuizEngine) + Tools & Continuity Rail */}
        <section className="hp-section hp-section--spacious">
          <div className="hp-command-deck">
            {/* Left Column: QuizEngine Practice Station */}
            <div className="hp-deck-left">
              <div className="hp-deck-header">
                <div className="hp-deck-title-wrap">
                  <span className="hp-section-kicker">Conceptual Practice</span>
                  <div className="hp-section-title-row">
                    <h2 className="hp-section-title">QuizEngine</h2>
                    <span className="hp-section-meta-pill">Viva &amp; NPTEL</span>
                  </div>
                  <p className="hp-section-desc">
                    Timed multiple-choice challenges with instant answer explanations.
                  </p>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="hp-deck-quiz-grid">
                {FEATURED_QUIZ_TOPICS.map((topic) => (
                  <Link
                    key={topic.name}
                    to="/quizzes"
                    className="hp-deck-quiz-tile"
                  >
                    <div className="hp-deck-quiz-info">
                      <span className="hp-deck-quiz-name">{topic.name}</span>
                      <span className="hp-deck-quiz-meta">{topic.qs} • {topic.time}</span>
                    </div>
                    <ArrowRight size={14} className="hp-deck-quiz-arrow" />
                  </Link>
                ))}
              </div>

              <div className="hp-deck-footer-actions">
                <Link to="/quizzes" className="hp-secondary-nav-link">
                  <span>Browse All Topics</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right Column: Recent Activity Stream & Essential Tool Deck */}
            <div className="hp-deck-right">
              {/* Recent Activity (If available) */}
              {recentActivities.length > 0 && (
                <div className="hp-deck-block hp-deck-block--recent">
                  <div className="hp-block-header">
                    <div className="hp-block-title-wrap">
                      <Clock size={14} className="hp-section-icon" />
                      <h3 className="hp-block-title">Recent Activity</h3>
                    </div>
                    <span className="hp-block-meta">Cached</span>
                  </div>

                  <div className="hp-deck-recent-list">
                    {recentActivities.slice(0, 3).map((item, idx) => {
                      const IconComponent =
                        item.type === "quiz"
                          ? BrainCircuit
                          : item.type === "tool"
                          ? GraduationCap
                          : Layers;

                      return (
                        <Link
                          key={item.id || idx}
                          to={item.href}
                          className="hp-deck-recent-row"
                        >
                          <div className="hp-deck-recent-icon">
                            <IconComponent size={14} />
                          </div>
                          <div className="hp-deck-recent-body">
                            <span className="hp-deck-recent-title">{item.title}</span>
                            <span className="hp-deck-recent-sub">{item.subtitle}</span>
                          </div>
                          <span className="hp-deck-recent-time">{formatTimeAgo(item.timestamp)}</span>
                          <ArrowRight size={12} className="hp-deck-recent-arrow" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Utility Tools */}
              <div className="hp-deck-block hp-deck-block--tools">
                <div className="hp-block-header">
                  <h3 className="hp-block-title">Essential Utilities</h3>
                  <span className="hp-block-meta">Tool Deck</span>
                </div>

                <div className="hp-deck-tools-list">
                  {utilityTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        to={tool.href}
                        className="hp-deck-tool-row"
                      >
                        <div className="hp-deck-tool-icon">
                          <Icon size={16} />
                        </div>
                        <div className="hp-deck-tool-body">
                          <div className="hp-deck-tool-title-row">
                            <span className="hp-deck-tool-name">{tool.name}</span>
                            <span className="hp-deck-tool-badge">{tool.badge}</span>
                          </div>
                          <span className="hp-deck-tool-desc">{tool.desc}</span>
                        </div>
                        <ArrowRight size={13} className="hp-deck-tool-arrow" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LandingView() {
  return <LandingParentSquare />;
}

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="hp-everything">
      {user ? (
        <>
          <MemberView user={user} />
          <SiteFooterLogo />
        </>
      ) : (
        <LandingView />
      )}
    </div>
  );
}
