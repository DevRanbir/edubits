import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authValue";
import Hybrid    from "./Hybrid";
import Theory    from "./Theory";
import Practical from "./Practical";
import Aptitude  from "./Aptitude";
import SoftSkill from "./SoftSkill";
import "./InternalMarksPage.css";

import {
  ClipboardCheck,
  BookOpen,
  FlaskConical,
  Wrench,
  Brain,
  Users,
  GraduationCap,
  Cpu,
  ChevronDown,
  Check,
} from "lucide-react";

const PROGRAM_OPTIONS = [
  { key: "cse", label: "BE CSE(General)", description: "", icon: GraduationCap },
  { key: "ait", label: "BE CSE (AIT)", description: "Data Science & AIML Specializations", icon: Cpu },
];

const YEAR_OPTIONS = {
  cse: [
    { key: "1", label: "1st Year" },
    { key: "2", label: "2nd Year" },
    { key: "3", label: "3rd Year" },
    { key: "senior", label: "4th Year" },
  ],
  ait: [
    { key: "3-ds", label: "3rd Year (Data Science)" },
    { key: "3-aiml", label: "3rd Year (AIML)" },
  ],
};

const TAB_CONFIG = {
  cse: {
    "1": [
      { key: "hybrid",    label: "Hybrid",    icon: FlaskConical,    color: "var(--danger)",   desc: "" },
      { key: "theory",    label: "Theory",    icon: BookOpen,        color: "var(--primary)",  desc: "Pure theory subjects (e.g., Mathematics, English)" },
      { key: "practical", label: "Practical", icon: Wrench,          color: "var(--success)",  desc: "Pure lab subjects (e.g., Workshop, Programming Lab)" },
      { key: "aptitude",  label: "Aptitude",  icon: Brain,           color: "var(--warning)",  desc: "Aptitude/Soft skills (e.g., Communication, Reasoning)" },
    ],
    "2": [
      { key: "hybrid",    label: "Hybrid",    icon: FlaskConical,    color: "var(--danger)",   desc: "" },
      { key: "theory",    label: "Theory",    icon: BookOpen,        color: "var(--primary)",  desc: "Pure theory (e.g., Discrete Math, OS Theory)" },
      { key: "practical", label: "Practical", icon: Wrench,          color: "var(--success)",  desc: "Pure lab (e.g., DS Lab, DBMS Lab, OS Lab)" },
      { key: "aptitude",  label: "Aptitude",  icon: Brain,           color: "var(--warning)",  desc: "Aptitude tests (Quant, Logic, Verbal)" },
      { key: "softskill", label: "Soft Skill", icon: Users,           color: "var(--primary)",  desc: "Communication, Leadership, Professional ethics" },
    ],
    "3": [
      { key: "hybrid",    label: "Hybrid",    icon: FlaskConical,    color: "var(--danger)",   desc: "" },
      { key: "theory",    label: "Theory",    icon: BookOpen,        color: "var(--primary)",  desc: "Pure theory (e.g., AI Theory, Cloud Computing)" },
      { key: "practical", label: "Practical", icon: Wrench,          color: "var(--success)",  desc: "Pure lab (e.g., CN Lab, ML Lab, Project Work)" },
      { key: "aptitude",  label: "Aptitude",  icon: Brain,           color: "var(--warning)",  desc: "Placement prep (Coding, Aptitude, GD/PI)" },
      { key: "softskill", label: "Soft Skill", icon: Users,           color: "var(--primary)",  desc: "Communication, Leadership, Professional ethics" },
    ],
    "senior": [
      { key: "hybrid",    label: "Hybrid",    icon: FlaskConical,    color: "var(--danger)",   desc: "" },
      { key: "theory",    label: "Theory",    icon: BookOpen,        color: "var(--primary)",  desc: "Pure theory electives (e.g., Blockchain, Cybersecurity)" },
      { key: "practical", label: "Practical", icon: Wrench,          color: "var(--success)",  desc: "Capstone project, Internship, Major project" },
    ],
  },
  ait: {
    "3-ds": [
      { key: "hybrid",    label: "Hybrid",    icon: FlaskConical,    color: "var(--danger)",   desc: "" },
      { key: "theory",    label: "Theory",    icon: BookOpen,        color: "var(--primary)",  desc: "Pure theory subjects (e.g., Statistics, Deep Learning, Transformers)" },
      { key: "practical", label: "Practical", icon: Wrench,          color: "var(--success)",  desc: "Pure lab subjects (e.g., Python/R, TensorFlow, PyTorch, Data Visualization)" },
      { key: "aptitude",  label: "Aptitude",  icon: Brain,           color: "var(--warning)",  desc: "Aptitude uses the 2nd-year marking scheme." },
      { key: "softskill", label: "Soft Skill", icon: Users,           color: "var(--primary)",  desc: "Communication, Leadership, Professional ethics" },
    ],
    "3-aiml": [
      { key: "hybrid",    label: "Hybrid",    icon: FlaskConical,    color: "var(--danger)",   desc: "" },
      { key: "theory",    label: "Theory",    icon: BookOpen,        color: "var(--primary)",  desc: "Pure theory subjects (e.g., Statistics, Deep Learning, Transformers)" },
      { key: "practical", label: "Practical", icon: Wrench,          color: "var(--success)",  desc: "Pure lab subjects (e.g., Python/R, TensorFlow, PyTorch, Data Visualization)" },
      { key: "aptitude",  label: "Aptitude",  icon: Brain,           color: "var(--warning)",  desc: "Aptitude uses the 2nd-year marking scheme." },
      { key: "softskill", label: "Soft Skill", icon: Users,           color: "var(--primary)",  desc: "Communication, Leadership, Professional ethics" },
    ],
  },
};

const SUBJECT_EXAMPLES = {
  "1": {
    hybrid: ["Engineering physics", "Logical Thinking & Problem Solving (LTPS)"],
    theory: ["biology", "maths"],
    practical: ["Python Programming", "Emerging and Distruptive Technology(EDT)"],
  },
  "2": {
    hybrid: ["Data Base Management System (DBMS)", "Design & Analysis of Algorithms (DAA)"],
    theory: ["Computer Organization & Arhitecture(COA)", "Operating System(OS)"],
    practical: ["Competitive Coding(CC)", "Full Stack Development(FSD)"],
  },
  "3": {
    hybrid: ["Project Based Learning in Java (PBLJ)"],
    theory: ["Computer Networks (CN)", "Probability & Statistics(P&S)"],
    practical: ["Competitive Coding(CC)", "Full Stack Development(FSD)"],
  },
  senior: {
    hybrid: ["Final Year Project", "Industry Capstone Project"],
    theory: ["Cloud Computing", "Information Security", "Professional Electives"],
    practical: ["Major Project", "Internship", "Project Demonstration"],
  },
};

export default function InternalMarksPage({ embedded = false }) {
  const { user } = useAuth();

  const getInitialProgram = () => {
    try {
      const stored =
        localStorage.getItem("edubits_academic_program") ||
        user?.academicProgram ||
        user?.program;
      if (stored && String(stored).toLowerCase().includes("ait")) return "ait";
    } catch {
      // ignore
    }
    return "cse";
  };

  const getInitialYear = (currentProgram) => {
    try {
      const stored =
        localStorage.getItem("edubits_academic_year") || user?.academicYear;
      if (stored) {
        const s = String(stored).toLowerCase();
        if (currentProgram === "ait") {
          return "3-aiml";
        }
        if (s.includes("1")) return "1";
        if (s.includes("2")) return "2";
        if (s.includes("3")) return "3";
        if (s.includes("4") || s.includes("senior")) return "senior";
      }
    } catch {
      // ignore
    }
    return currentProgram === "ait" ? "3-aiml" : "2";
  };

  const [program, setProgram] = useState(getInitialProgram);
  const [year, setYear] = useState(() => getInitialYear(getInitialProgram()));
  const [tab, setTab] = useState("hybrid");

  const [programOpen, setProgramOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const programDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (programDropdownRef.current && !programDropdownRef.current.contains(e.target)) {
        setProgramOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target)) {
        setYearOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setProgramOpen(false);
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const switchProgram = (p) => {
    setProgram(p);
    const newYear = (YEAR_OPTIONS[p] || [])[0]?.key || "1";
    setYear(newYear);
    setTab("hybrid");
    try {
      localStorage.setItem("edubits_academic_program", p);
    } catch {
      // ignore
    }
  };

  const selectYear = (y) => {
    setYear(y);
    setTab("hybrid");
    try {
      const yrMap = {
        "1": "1st_year",
        "2": "2nd_year",
        "3": "3rd_year",
        senior: "4th_year",
      };
      if (yrMap[y]) {
        localStorage.setItem("edubits_academic_year", yrMap[y]);
      }
    } catch {
      // ignore
    }
  };

  const tabs = (TAB_CONFIG[program] && TAB_CONFIG[program][year]) || [];
  const exampleYear = year.startsWith("3-") ? "3" : year;

  const currentProgramObj = PROGRAM_OPTIONS.find((p) => p.key === program) || PROGRAM_OPTIONS[0];
  const ProgramIcon = currentProgramObj.icon;
  const currentYearOptions = YEAR_OPTIONS[program] || [];
  const currentYearObj = currentYearOptions.find((y) => y.key === year) || currentYearOptions[0];

  return (
    <div className={`internal-container ${embedded ? "internal-container--embedded" : ""}`}>
      {!embedded && (
        <div className="internal-header">
          <h1 className="internal-title">
            <ClipboardCheck size={28} strokeWidth={2.2} /> Internal Marks Calculator
          </h1>
        </div>
      )}

      {/* Unified Single Control Bar: Program Dropdown | Year Dropdown | Subject Type Tabs */}
      <div className="internal-unified-bar" role="toolbar" aria-label="Internal marks filters">
        {/* 1. Program Dropdown */}
        <div className="internal-dropdown-wrapper" ref={programDropdownRef}>
          <button
            type="button"
            className={`internal-dropdown-trigger ${programOpen ? "open" : ""}`}
            onClick={() => {
              setProgramOpen((prev) => !prev);
              setYearOpen(false);
            }}
            aria-haspopup="listbox"
            aria-expanded={programOpen}
          >
            <ProgramIcon size={13} className="internal-dropdown-icon" />
            <span className="internal-dropdown-label">{currentProgramObj.label}</span>
            <ChevronDown size={13} className={`internal-dropdown-chevron ${programOpen ? "rotated" : ""}`} />
          </button>

          {programOpen && (
            <div className="internal-dropdown-menu" role="listbox" aria-label="Select Program">
              {PROGRAM_OPTIONS.map(({ key, label, icon: Icon }) => {
                const isSelected = program === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`internal-dropdown-item ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      switchProgram(key);
                      setProgramOpen(false);
                    }}
                  >
                    <Icon size={13} />
                    <span>{label}</span>
                    {isSelected && <Check size={12} className="internal-dropdown-check" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Year Dropdown */}
        <div className="internal-dropdown-wrapper" ref={yearDropdownRef}>
          <button
            type="button"
            className={`internal-dropdown-trigger ${yearOpen ? "open" : ""}`}
            onClick={() => {
              setYearOpen((prev) => !prev);
              setProgramOpen(false);
            }}
            aria-haspopup="listbox"
            aria-expanded={yearOpen}
          >
            <span className="internal-dropdown-label">{currentYearObj?.label || "Select Year"}</span>
            <ChevronDown size={13} className={`internal-dropdown-chevron ${yearOpen ? "rotated" : ""}`} />
          </button>

          {yearOpen && (
            <div className="internal-dropdown-menu" role="listbox" aria-label="Select Year">
              {currentYearOptions.map(({ key, label }) => {
                const isSelected = year === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`internal-dropdown-item ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      selectYear(key);
                      setYearOpen(false);
                    }}
                  >
                    <span>{label}</span>
                    {isSelected && <Check size={12} className="internal-dropdown-check" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="internal-bar-divider" aria-hidden="true" />

        {/* 3. Subject Type Tabs */}
        <div className="internal-bar-group internal-bar-group--types" role="tablist" aria-label="Subject type">
          {tabs.map(({ key, label, icon: Icon, desc }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`internal-bar-btn internal-bar-btn--type ${tab === key ? "active" : ""}`}
              onClick={() => setTab(key)}
              title={desc}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Refined Subject Examples Context Strip */}
      {SUBJECT_EXAMPLES[exampleYear]?.[tab] && (
        <div className="internal-examples-strip">
          <span className="internal-examples-label">Example {tab} subjects:</span>
          <div className="internal-examples-list">
            {SUBJECT_EXAMPLES[exampleYear][tab].map((subj, i) => (
              <span key={i} className="internal-example-chip">{subj}</span>
            ))}
          </div>
        </div>
      )}

      <div className="internal-card">
        {tab === "hybrid"    && <Hybrid    year={year} program={program} />}
        {tab === "theory"    && <Theory    year={year} program={program} />}
        {tab === "practical" && <Practical year={year} program={program} />}
        {tab === "aptitude"  && <Aptitude  year={year} program={program} />}
        {tab === "softskill" && <SoftSkill />}
      </div>
    </div>
  );
}
