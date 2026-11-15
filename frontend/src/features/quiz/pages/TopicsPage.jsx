import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { BrainCircuit, Lock, Unlock, Layers3, CheckCircle2, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import GradientASCII from "../../../components/ui/GradientASCII";
import "./TopicsPage.css";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState("viva");
  const navigate = useNavigate();

  const orderedTopics = useMemo(
    () => [...topics].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [topics]
  );

  const filteredTopics = useMemo(
    () => orderedTopics.filter((t) => t.mode === activeMode),
    [orderedTopics, activeMode]
  );

  const fetchTopics = useCallback(async () => {
    try {
      const { data } = await api.get("/topics");
      setTopics(data.topics);
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

  if (loading) return <div className="spinner" />;

  const stats = modeStats[activeMode];

  return (
    <div className="quiz-shell fade-in">
      <div className="quiz-page-header">
        <div>
          <h1 className="quiz-page-title">
            <BrainCircuit size={34} strokeWidth={2} />
            QuizEngine
          </h1>
        </div>
        <div className="quiz-mode-toggle" role="tablist" aria-label="Quiz category">
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "viva"}
            className={`quiz-mode-btn ${activeMode === "viva" ? "active" : ""}`}
            onClick={() => setActiveMode("viva")}
          >
            <GraduationCap size={17} strokeWidth={1.8} />
            <span className="mode-label">College Viva</span>
            <span className="mode-count">{modeStats.viva.total}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "nptel"}
            className={`quiz-mode-btn ${activeMode === "nptel" ? "active" : ""}`}
            onClick={() => setActiveMode("nptel")}
          >
            <BookOpen size={17} strokeWidth={1.8} />
            <span className="mode-label">NPTEL Prep</span>
            <span className="mode-count">{modeStats.nptel.total}</span>
          </button>
        </div>

      </div>

      <div className="quiz-stats-grid">
        {[
          { label: "Total Topics", value: stats.total, icon: <Layers3 size={21} /> },
          { label: "Unlocked", value: stats.unlocked, icon: <Unlock size={21} /> },
          { label: "Completed", value: stats.completed, icon: <CheckCircle2 size={21} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="quiz-stat-card">
            <span className="quiz-stat-icon">{icon}</span>
            <div>
              <div className="quiz-stat-value">{value}</div>
              <div className="quiz-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-topic-grid">
        {filteredTopics.length === 0 ? (
          <div className="quiz-empty-state">
            <p>No topics available for {activeMode === "viva" ? "College Viva" : "NPTEL Prep"} mode.</p>
            <p className="hint">Topics will appear here after admin adds them via the dashboard.</p>
          </div>
        ) : (
          filteredTopics.map((topic, i) => (
            <TopicPhotoCard
              key={topic._id}
              topic={topic}
              onStart={handleStart}
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TopicPhotoCard({ topic, onStart, style }) {
  const isLocked = !topic.unlocked;
  const isCompleted = topic.completed;

  return (
    <article
      className={`quiz-photo-card ${isLocked ? "locked" : ""} ${isCompleted ? "completed" : ""}`}
      style={style}
      onClick={() => !isLocked && onStart(topic)}
    >
      {/* 1. Image as Full Card Background (Quiz cards only) */}
      {topic.image ? (
        <img
          src={topic.image}
          alt=""
          className="quiz-card-bg-img"
          loading="lazy"
          aria-hidden="true"
        />
      ) : (
        <div className="photo-placeholder quiz-card-bg-placeholder" aria-hidden="true">
          <span className="photo-icon">{topic.icon || "📚"}</span>
        </div>
      )}

      {/* 2. Atmospheric Dark Overlay for Contrast & Readability */}
      <div className="quiz-card-bg-overlay" aria-hidden="true" />

      {/* 3. Top to Mid: Gradient ASCII */}
      <div className="res-card-ascii-wrap quiz-ascii-wrap" aria-hidden="true">
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

      {/* 4. Top Header: Title at Top, Description Below That */}
      <div className="res-card-header quiz-header-layer">
        <h3 className="res-card-title">{topic.name}</h3>
        <div className="res-card-desc">
          {isCompleted ? (
            <span className="quiz-desc-status completed">
              <CheckCircle2 size={13} /> Completed
            </span>
          ) : isLocked ? (
            <span className="quiz-desc-status locked">
              <Lock size={13} /> Locked
            </span>
          ) : (
            <span className="quiz-desc-status active">
              {topic.description || "Practice Quiz"}
            </span>
          )}
        </div>
      </div>

      {/* 5. Bottom Right: Small Start Now Button (No extra layering) */}
      {!isLocked && (
        <span className="quiz-card-start-btn">
          <span>Start Now</span>
          <ArrowRight size={12} strokeWidth={2.4} />
        </span>
      )}
    </article>
  );
}
