import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Layers, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { fetchResources, fetchResourcesSummary } from "../../../services/resourceService";
import GradientASCII from "../../../components/ui/GradientASCII";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/Breadcrumb";
import "./Resources.css";
import "./ResourcesHome.css";

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

export default function YearPage() {
  const { year } = useParams();
  const decodedYear = decodeURIComponent(year);
  const [resourcesList, setResourcesList] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resResult, sumResult] = await Promise.allSettled([
        fetchResources({ year: decodedYear }),
        fetchResourcesSummary(),
      ]);

      if (resResult.status === "fulfilled") {
        setResourcesList(resResult.value || []);
      }
      if (sumResult.status === "fulfilled") {
        setSummary(sumResult.value?.subjects?.[decodedYear] || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Could not load subjects.");
    } finally {
      setLoading(false);
    }
  }, [decodedYear]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const subjects = useMemo(() => {
    const resBySubject = new Map();
    resourcesList.forEach((r) => {
      if (!r.subject) return;
      if (!resBySubject.has(r.subject)) {
        resBySubject.set(r.subject, { pyqs: new Set(), notes: 0, playlists: 0 });
      }
      const item = resBySubject.get(r.subject);
      if (r.resourceType === "pyqs") {
        if (r.variant !== "solution") {
          item.pyqs.add(r.paperKey || r._id || r.title);
        }
      } else if (r.resourceType === "notes") {
        item.notes += 1;
      } else if (r.resourceType === "playlist") {
        item.playlists += 1;
      }
    });

    const uploadedSummary = new Map(summary.map(({ subject, count }) => [subject, count]));

    return (SUBJECTS_BY_YEAR[decodedYear] || []).map((subject) => {
      const details = resBySubject.get(subject);
      let descText = "";

      if (details) {
        const pyqCount = details.pyqs.size;
        const notesCount = details.notes;
        const playlistCount = details.playlists;
        const total = pyqCount + notesCount + playlistCount;

        if (total === 0) {
          descText = "Curriculum & Notes";
        } else {
          const parts = [];
          if (pyqCount > 0) parts.push(`${pyqCount} ${pyqCount === 1 ? "PYQ" : "PYQs"}`);
          if (notesCount > 0) parts.push(`${notesCount} ${notesCount === 1 ? "Note" : "Notes"}`);
          if (playlistCount > 0) parts.push(`${playlistCount} ${playlistCount === 1 ? "Playlist" : "Playlists"}`);
          descText = parts.join(" • ");
        }
      } else if (uploadedSummary.has(subject)) {
        const count = uploadedSummary.get(subject) || 0;
        descText = count > 0 ? `${count} ${count === 1 ? "PYQ" : "PYQs"}` : "Curriculum & Notes";
      } else {
        descText = "Curriculum & Notes";
      }

      return {
        subject,
        resourceText: descText,
        image: SUBJECT_IMAGES[subject] || "/images/daa.svg",
      };
    });
  }, [decodedYear, resourcesList, summary]);

  if (loading) return <div className="resources-loading"><Loader2 className="spin" size={32} /> Loading subjects…</div>;
  if (error) return <div className="resources-error"><AlertCircle size={32} /> {error} <button onClick={loadSummary}>Retry</button></div>;

  return (
    <div className="res-home">
      <header className="res-home-header res-home-header--column">
        {/* Radix Breadcrumb */}
        <Breadcrumb className="res-breadcrumb-wrap">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/resources?all=true">Resources</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{decodedYear}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="res-header-row">
          <h1 className="res-home-title">
            <Layers size={27} />
            <span>{decodedYear} Subjects</span>
          </h1>

          {/* Quick Year Switcher */}
          <div className="res-year-switcher">
            {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
              <Link
                key={yr}
                to={`/resources/${encodeURIComponent(yr)}`}
                onClick={() => {
                  try {
                    localStorage.setItem("edubits_academic_year", yr);
                  } catch {
                    // ignore
                  }
                }}
                className={`res-year-switcher-btn ${decodedYear === yr ? "active" : ""}`}
              >
                {yr}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="res-home-grid res-home-grid--subjects">
        {subjects.map(({ subject, resourceText, image }, i) => (
          <Link
            key={subject}
            to={`/resources/${encodeURIComponent(decodedYear)}/${encodeURIComponent(subject)}`}
            className="res-thumb-card"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {/* Top-to-mid Gradient ASCII */}
            <div className="res-card-ascii-wrap" aria-hidden="true">
              <GradientASCII
                shape="horizon"
                colors={["#115d62", "#1f7771", "#3e9b8f", "#5cc2b4"]}
                density={0.65}
                glow={0.3}
                flicker={0.1}
                mouseInteraction={false}
                intro={false}
              />
            </div>

            {/* Top Header: Title at Top, Description Below That */}
            <div className="res-card-header">
              <h3 className="res-card-title">{subject}</h3>
              <div className="res-card-desc">
                <BookOpen size={13} />
                <span>{resourceText}</span>
              </div>
            </div>

            {/* Bottom half illustration fading into card floor */}
            <div className="res-card-bottom-wrap" aria-hidden="true">
              <img src={image} alt="" className="res-card-bottom-img" loading="lazy" />
            </div>
          </Link>
        ))}
        {subjects.length === 0 && (
          <div className="resources-empty">
            <AlertCircle size={48} />
            <p>No subjects found for this year</p>
          </div>
        )}
      </div>
    </div>
  );
}
