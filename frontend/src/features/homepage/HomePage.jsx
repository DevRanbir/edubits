import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  BrainCircuit,
  GraduationCap,
  ClipboardList,
  ArrowRight,
  Clock,
  Code2,
} from "lucide-react";
import { useAuth } from "../../context/authValue";
import { API_URL } from "../../config/api";
import { GoogleIcon } from "./BrandIcons";
import { features } from "./homeData";
import GradientASCII from "../../components/ui/GradientASCII";
import SiteFooterLogo from "../../components/layout/SiteFooterLogo";
import { getRecentActivities, formatTimeAgo } from "../../utils/recentActivity";
import "./homepage.css";

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
    {
      id: "programming",
      name: "Programming Hub",
      desc: "Practice coding problems, debug test cases, and master algorithms.",
      href: "/programming",
      icon: Code2,
      badge: "Code",
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
          Welcome back, <br />
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
                <Link to="/quizzes/leaderboard" className="hp-secondary-nav-link">
                  <span>Leaderboard</span>
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
  return (
    <main className="hp-main">
      <header className="hp-hero">
        <h1 className="hp-headline">
          Engineering made
          <br />
          <span>easier.</span>
        </h1>
        <p className="hp-tagline">
          Get PYQs, Notes, Playlists, Sgpa Calculator &amp; more...
        </p>
        <AuthActions />
      </header>

      <section className="hp-section" aria-label="Edubits reach">
        <p className="hp-eyebrow">Growing with every semester</p>
        <div className="hp-proof">
          <div className="hp-proof-item">
            <span className="hp-proof-value">750+</span>
            <span className="hp-proof-label">students using Edubits</span>
          </div>
          <div className="hp-proof-item">
            <span className="hp-proof-value">~6K</span>
            <span className="hp-proof-label">visits in an average month</span>
          </div>
          <div className="hp-proof-item hp-proof-item--peak">
            <span className="hp-proof-value">~10K</span>
            <span className="hp-proof-label">visits last end sem</span>
          </div>
        </div>
      </section>

      <section className="hp-section hp-section--tight" aria-label="Product preview">
        <figure className="hp-preview">
          <img src="/images/homepage/Resources.png" alt="Edubits Resources page" decoding="async" />
        </figure>
      </section>

      <section className="hp-section" aria-label="Edubits features">
        {features.map((feature, i) => (
          <article key={feature.id} className={`hp-feature${i % 2 ? " hp-feature--reverse" : ""}`}>
            <div className="hp-feature-copy">
              <p className="hp-eyebrow">{feature.eyebrow}</p>
              <h3 className="hp-feature-title">{feature.title}</h3>
              <p className="hp-feature-desc">{feature.desc}</p>
            </div>
            <div className="hp-preview">
              <img src={feature.image} alt={feature.alt} loading="lazy" decoding="async" />
            </div>
          </article>
        ))}
      </section>

      <section className="hp-section" aria-labelledby="hp-cta-title">
        <div className="hp-cta">
          <h2 id="hp-cta-title" className="hp-section-title">
            Make engineering <span className="hp-cta-accent">easier.</span>
          </h2>
          <p className="hp-cta-text">
            Create an account to access everything for <span className="hp-cta-accent">free.</span>
          </p>
          <AuthActions />
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="hp-everything">
      {user ? <MemberView user={user} /> : <LandingView />}
      <SiteFooterLogo />
    </div>
  );
}
