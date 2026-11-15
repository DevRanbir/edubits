import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Info,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import GradientASCII from "../../../components/ui/GradientASCII";
import "../styles/global.css";
import "../styles/quizEngine.css";
import "./ResultsPage.css";

const LETTERS = ["A", "B", "C", "D", "E"];

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Shared ASCII Background
  const asciiBackground = (
    <div className="quiz-ascii-bg" aria-hidden="true">
      <GradientASCII
        shape="horizon"
        colors={["#115d62", "#1f7771", "#3e9b8f", "#5cc2b4"]}
        density={0.7}
        glyphOpacity={0.5}
        glow={0.3}
        flicker={0.12}
        mouseInteraction={false}
        intro={false}
      />
    </div>
  );

  if (!state?.result) {
    return (
      <main className="quiz-results-shell">
        {asciiBackground}
        <div className="quiz-results-canvas">
          <section className="results-empty-state">
            <div className="results-empty-icon"><Info size={24} /></div>
            <h1>No result to display</h1>
            <p>Complete a quiz round first, then your score summary and answer review will appear here.</p>
            <Link to="/quizzes" className="quiz-cta-button">
              <span>Browse topics</span> <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const { result, topic, questions = [] } = state;
  const {
    score = 0,
    maxPossibleScore = 0,
    percentage = 0,
    passed = false,
    correctCount = 0,
    wrongCount = 0,
    history = [],
  } = result;
  const normalizedPercentage = Math.max(0, Math.min(100, Number(percentage) || 0));
  const questionMap = new Map(questions.map((question) => [String(question._id), question]));
  const timedOutCount = history.filter((answer) => answer.result === "timeout").length;
  const topicName = topic?.name || "Quiz";

  const stats = [
    { label: "Points", value: `${score} / ${maxPossibleScore}`, tone: "points" },
    { label: "Correct", value: correctCount, tone: "correct" },
    { label: "Incorrect", value: wrongCount, tone: "incorrect" },
    { label: "Unanswered", value: timedOutCount, tone: "unanswered" },
  ];

  return (
    <main className="quiz-results-shell">
      {asciiBackground}

      <div className="quiz-results-canvas">
        <button className="quiz-nav-back" onClick={() => navigate("/quizzes")}>
          <ArrowLeft size={16} />
          <span>All topics</span>
        </button>

        <section className="results-overview-single">
          <div className="results-overview-topline">
            <span className="results-eyebrow">QUIZ COMPLETE</span>
            <span className={`results-status ${passed ? "is-passed" : "is-failed"}`}>
              {passed ? <CheckCircle2 size={14} /> : <RotateCcw size={14} />}
              {passed ? "Passed" : "Keep practising"}
            </span>
          </div>

          <div className="results-hero">
            <div className="results-message">
              <div className={`results-trophy ${passed ? "is-passed" : "is-failed"}`}>
                <Trophy size={24} />
              </div>
              <h1 className="results-title">{passed ? "Nice work!" : "Keep building."}</h1>
              <p className="results-topic-name">{topicName}</p>
              <p className="results-message-copy">
                {passed
                  ? "You passed this round. Keep sharpening your conceptual edge."
                  : "Review the answers below, then re-attempt the topic when you're ready."}
              </p>
            </div>

            <div
              className="results-score-ring"
              style={{ "--score-angle": `${normalizedPercentage * 3.6}deg` }}
              role="img"
              aria-label={`Score: ${normalizedPercentage}%`}
            >
              <div className="results-score-ring-inner">
                <strong>{normalizedPercentage}%</strong>
                <span>Score</span>
              </div>
            </div>
          </div>

          <div className="results-stats-grid">
            {stats.map(({ label, value, tone }) => (
              <div className={`results-stat ${tone}`} key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button
              className="quiz-cta-button"
              onClick={() => navigate(`/quizzes/${topic?._id || ""}`, { state: { topic } })}
            >
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </button>
            <Link to="/quizzes" className="results-secondary-link">
              <span>Choose another topic</span> <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {history.length > 0 && (
          <section className="results-review-section">
            <div className="results-review-heading">
              <div>
                <span className="results-eyebrow">YOUR ATTEMPT</span>
                <h2>Detailed Answer Review</h2>
              </div>
              <span className="results-review-count">{history.length} questions</span>
            </div>

            <div className="results-review-list">
              {history.map((answer, index) => {
                const question = questionMap.get(String(answer.questionId)) || {};
                const isCorrect = answer.result === "correct";
                const isTimeout = answer.result === "timeout";
                const correctIndices = answer.correctAnswer ?? question.correctAnswer ?? [];
                const correctOptions = Array.isArray(correctIndices) ? correctIndices : [correctIndices];
                const selectedOptions = answer.selectedOptions?.length
                  ? answer.selectedOptions
                  : answer.selectedOption !== undefined && answer.selectedOption !== null
                    ? [answer.selectedOption]
                    : [];
                const reviewTone = isCorrect ? "is-correct" : isTimeout ? "is-timeout" : "is-incorrect";

                return (
                  <article className={`results-review-item ${reviewTone}`} key={answer.questionId || index}>
                    <div className="results-review-card-top">
                      <span className="results-question-number">Question {String(index + 1).padStart(2, "0")}</span>
                      <div className="results-review-tags">
                        {question.difficulty && (
                          <span className={`results-difficulty ${question.difficulty.toLowerCase()}`}>
                            {question.difficulty}
                          </span>
                        )}
                        <span className={`results-answer-status ${reviewTone}`}>
                          {isCorrect ? <Check size={13} /> : isTimeout ? <Clock3 size={13} /> : <X size={13} />}
                          {isCorrect ? "Correct" : isTimeout ? "Timed out" : "Incorrect"}
                        </span>
                      </div>
                    </div>

                    <h3 className="results-question-text">
                      {answer.questionText || question.text || "Question text unavailable"}
                    </h3>

                    {question.options?.length > 0 ? (
                      <div className="results-answer-options">
                        {question.options.map((option, optionIndex) => {
                          const isAnswerCorrect = correctOptions.includes(optionIndex);
                          const wasSelected = selectedOptions.includes(optionIndex);
                          const optionTone = isAnswerCorrect
                            ? "is-answer-correct"
                            : wasSelected
                              ? "is-answer-wrong"
                              : "";

                          return (
                            <div className={`results-answer-option ${optionTone}`} key={optionIndex}>
                              <span className="results-option-letter">{LETTERS[optionIndex]}</span>
                              <span className="results-option-text">{option}</span>
                              {isAnswerCorrect && <span className="results-option-label correct">Correct</span>}
                              {wasSelected && !isAnswerCorrect && <span className="results-option-label your-choice">Your choice</span>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="results-answer-summary">
                        <span><strong>Correct:</strong> {formatAnswerLetters(correctOptions)}</span>
                        <span><strong>Your answer:</strong> {formatAnswerLetters(selectedOptions)}</span>
                      </div>
                    )}

                    {answer.explanation && (
                      <div className="results-explanation">
                        <Info size={15} />
                        <p>{answer.explanation}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function formatAnswerLetters(indices) {
  if (!indices?.length) return "No answer";
  return indices.map((index) => LETTERS[index] || "?").join(", ");
}
