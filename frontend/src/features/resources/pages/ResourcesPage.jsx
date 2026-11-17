import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layers, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { fetchResourcesSummary } from "../../../services/resourceService";
import { useAuth } from "../../../context/authValue";
import { getUserAcademicYear } from "../../../utils/academicYear";
import GradientASCII from "../../../components/ui/GradientASCII";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/Breadcrumb";
import WarmTooltip from "../../../components/ui/WarmTooltip";
import "./Resources.css";
import "./ResourcesHome.css";

const YEAR_ORDER = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const YEAR_IMAGES = {
  "1st Year": "/images/1st.svg",
  "2nd Year": "/images/2nd.svg",
  "3rd Year": "/images/3rd.svg",
  "4th Year": "/images/4th.svg",
};

export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showAll = searchParams.get("all") === "true";

  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-redirect to the user's preferred onboarding year unless explicitly viewing all years (?all=true)
  useEffect(() => {
    if (!showAll) {
      const preferred = getUserAcademicYear(user);
      if (preferred) {
        navigate(`/resources/${encodeURIComponent(preferred)}`, { replace: true });
      }
    }
  }, [showAll, user, navigate]);

  const loadYears = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { years: yearCounts = {} } = await fetchResourcesSummary();
      const yearList = YEAR_ORDER.map((year) => ({
        year,
        count: yearCounts[year] || 0,
        image: YEAR_IMAGES[year],
      }));
      setYears(yearList);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showAll) {
      loadYears();
    }
  }, [showAll, loadYears]);

  if (!showAll) {
    return (
      <div className="resources-loading">
        <Loader2 className="spin" size={32} />
        <span>Opening your academic year…</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="resources-loading">
        <Loader2 className="spin" size={32} />
        <span>Loading years…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-error">
        <AlertCircle size={32} />
        <span>{error}</span>
        <button onClick={loadYears}>Retry</button>
      </div>
    );
  }

  return (
    <div className="res-home">
      <header className="res-home-header res-home-header--column">
        <Breadcrumb className="res-breadcrumb-wrap">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>All Resources</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="res-home-title">
          <Layers size={27} />
          <span>Select Academic Year</span>
        </h1>
      </header>

      <div className="res-home-grid">
        {years.map(({ year, count, image }, i) => (
          <WarmTooltip
            key={year}
            content={`View ${year} curriculum & study files (${count} resources)`}
            side="top"
          >
            <Link
              to={`/resources/${encodeURIComponent(year)}`}
              onClick={() => {
                try {
                  localStorage.setItem("edubits_academic_year", year);
                } catch {
                  // ignore
                }
              }}
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
                <h3 className="res-card-title">{year}</h3>
                <div className="res-card-desc">
                  <BookOpen size={13} />
                  <span>{count} {count === 1 ? "Resource" : "Resources"}</span>
                </div>
              </div>

              {/* Bottom half illustration fading into card floor */}
              {image && (
                <div className="res-card-bottom-wrap" aria-hidden="true">
                  <img src={image} alt="" className="res-card-bottom-img" loading="lazy" />
                </div>
              )}
            </Link>
          </WarmTooltip>
        ))}
        {years.length === 0 && (
          <div className="resources-empty">
            <AlertCircle size={48} />
            <p>No resources found</p>
          </div>
        )}
      </div>
    </div>
  );
}
