import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  BrainCircuit,
  Lock,
  CheckCircle2,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
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
import "./TopicsPage.css";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState("viva");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const orderedTopics = useMemo(
    () => [...topics].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [topics]
  );

  const modeFilteredTopics = useMemo(
    () => orderedTopics.filter((t) => t.mode === activeMode),
    [orderedTopics, activeMode]
  );

  const displayedTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return modeFilteredTopics;
    return modeFilteredTopics.filter(
      (t) =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [modeFilteredTopics, searchQuery]);

  const fetchTopics = useCallback(async () => {
    try {
      const { data } = await api.get("/topics");
      setTopics(data.topics || []);
    } catch {
      console.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleStart = (topic) => {
    if (!topic.unlocked) return;
    navigate(`/quizzes/${topic._id}`, { state: { topic } });
  };

  const modeStats = useMemo(() => {
    const viva = orderedTopics.filter((t) => t.mode === "viva");
    const nptel = orderedTopics.filter((t) => t.mode === "nptel");
    return {
      viva: {
        total: viva.length,
        unlocked: viva.filter((t) => t.unlocked).length,
        completed: viva.filter((t) => t.completed).length,
      },
      nptel: {
        total: nptel.length,
        unlocked: nptel.filter((t) => t.unlocked).length,
        completed: nptel.filter((t) => t.completed).length,
      },
    };
  }, [orderedTopics]);

  const navTabs = useMemo(
    () => [
      {
        id: "viva",
        label: "College Viva",
        count: modeStats.viva.total,
      },
      {
        id: "nptel",
        label: "NPTEL Prep",
        count: modeStats.nptel.total,
      },
    ],
    [modeStats]
  );

  if (loading) {
    return (
      <div className="quiz-shell quiz-shell--loading">
        <div className="spinner" />
      </div>
    );
  }

  const modeLabel = activeMode === "viva" ? "College Viva" : "NPTEL Prep";

  return (
    <div className="quiz-shell fade-in">
      <header className="quiz-page-header">
        {/* Breadcrumb Navigation matching YearPage */}
        <Breadcrumb className="quiz-breadcrumb-wrap">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/quizzes">QuizEngine</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{modeLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Row matching YearPage exactly + Searchbar */}
        <div className="quiz-header-bar">
          <h1 className="quiz-page-heading">
            <BrainCircuit size={27} />
            <span>QuizEngine</span>
          </h1>

          <div className="quiz-header-actions">
            {/* Real-time Topic Search Bar */}
            <div className="quiz-search-bar" role="search">
              <Search size={14} className="quiz-search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder={`Search ${modeLabel.toLowerCase()} topics...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="quiz-search-input"
                aria-label="Search topics"
              />
              {searchQuery && (
                <WarmTooltip content="Clear search" side="bottom">
                  <button
                    type="button"
                    className="quiz-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search query"
                  >
                    <X size={13} strokeWidth={2.4} />
                  </button>
                </WarmTooltip>
              )}
            </div>

            {/* Category Switcher matching YearPage .res-year-switcher */}
            <div className="quiz-mode-switcher" role="tablist" aria-label="Quiz category">
              {navTabs.map((tab) => {
                const isActive = activeMode === tab.id;
                return (
                  <WarmTooltip
                    key={tab.id}
                    content={`Browse ${tab.label} (${tab.count} ${tab.count === 1 ? "topic" : "topics"})`}
                    side="bottom"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setActiveMode(tab.id);
                        setSearchQuery("");
                      }}
                      className={`quiz-mode-switcher-btn ${isActive ? "active" : ""}`}
                    >
                      {tab.label}
                    </button>
                  </WarmTooltip>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Topics Content Grid */}
      {displayedTopics.length === 0 ? (
        <div className="quiz-empty-state">
          {searchQuery ? (
            <>
              <p className="quiz-empty-title">
                No topics found matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
              </p>
              <p className="hint">Try searching for a different keyword or check spelling.</p>
              <button
                type="button"
                className="btn btn-secondary quiz-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="quiz-empty-title">
                No topics available for {modeLabel} yet.
              </p>
              <p className="hint">Topics will appear here once configured.</p>
            </>
          )}
        </div>
      ) : (
        <div className="quiz-topic-grid">
          {displayedTopics.map((topic, i) => (
            <TopicCard
              key={topic._id || topic.name}
              topic={topic}
              onStart={handleStart}
              style={{ animationDelay: `${i * 0.04}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicCard({ topic, onStart, style }) {
  const isLocked = !topic.unlocked;
  const isCompleted = topic.completed;
  const passScore = topic.passingScore || 60;

  return (
    <article
      className={`quiz-card ${isLocked ? "is-locked" : ""} ${isCompleted ? "is-completed" : ""}`}
      style={style}
      onClick={() => !isLocked && onStart(topic)}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-disabled={isLocked}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isLocked) {
          e.preventDefault();
          onStart(topic);
        }
      }}
    >
      {/* Full-card Background Image */}
      {topic.image ? (
        <img
          src={topic.image}
          alt=""
          className="quiz-card-bg"
          loading="lazy"
          aria-hidden="true"
        />
      ) : (
        <div className="quiz-card-bg-fallback" aria-hidden="true">
          <span>{topic.icon || "📚"}</span>
        </div>
      )}

      {/* Low-intensity ASCII Overlay Above the Image */}
      <div className="quiz-card-ascii" aria-hidden="true">
        <GradientASCII
          shape="horizon"
          colors={["#115d62", "#1f7771", "#3e9b8f", "#5cc2b4"]}
          density={0.5}
          glyphOpacity={0.35}
          glow={0.12}
          flicker={0.08}
          mouseInteraction={false}
          intro={false}
        />
      </div>

      {/* Subtle Bottom Scrim for Text Contrast */}
      <div className="quiz-card-scrim" aria-hidden="true" />

      {/* Minimal Status Indicator (only shown when Completed or Locked) */}
      {(isCompleted || isLocked) && (
        <div className="quiz-card-status">
          {isCompleted ? (
            <span className="quiz-status-text completed">
              <CheckCircle2 size={13} strokeWidth={2.4} />
              <span>Completed</span>
            </span>
          ) : (
            <span className="quiz-status-text locked">
              <Lock size={13} strokeWidth={2.2} />
              <span>Locked</span>
            </span>
          )}
        </div>
      )}

      {/* Minimal Content */}
      <div className="quiz-card-content">
        <h3 className="quiz-card-title">{topic.name}</h3>
        {topic.description && (
          <p className="quiz-card-desc">{topic.description}</p>
        )}
        <div className="quiz-card-meta">
          <span className="quiz-card-pass">Pass {passScore}%</span>
          {!isLocked && (
            <ArrowRight size={15} strokeWidth={2.2} className="quiz-card-arrow" />
          )}
        </div>
      </div>
    </article>
  );
}
