import { Layers, BrainCircuit, GraduationCap, ClipboardList, Code } from "lucide-react";

export const featuredTools = [
  {
    href: "/resources",
    icon: Layers,
    name: "Resources",
    desc: "Notes, PYQs & Playlists",
  },
  {
    href: "/quizzes",
    icon: BrainCircuit,
    name: "QuizEngine",
    desc: "Topic-wise practice and review",
  },
];

export const otherTools = [
  {
    href: "/tasks?tab=sgpa",
    icon: GraduationCap,
    name: "SGPA Calculator",
    desc: "Calculate semester SGPA in Tool Deck",
  },
  {
    href: "/tasks?tab=internals",
    icon: ClipboardList,
    name: "Internal Marks Calculator",
    desc: "Calculate internal marks in Tool Deck",
  },
];

export const features = [
  {
    id: "resources",
    eyebrow: "Resources",
    title: "PYQs, Notes & Playlists",
    desc: "Previous year papers with and without solutions, plus notes and playlists, sorted by year and subject.",
    image: "/images/homepage/Pyq.png",
    alt: "Edubits PYQs page",
  },
  {
    id: "quizzes",
    eyebrow: "QuizEngine",
    title: "Practice for NPTEL and college viva",
    desc: "Take quizzes by topic, review your results and track your progress.",
    image: "/images/homepage/Quiz.png",
    alt: "Edubits QuizEngine page",
  },
];
