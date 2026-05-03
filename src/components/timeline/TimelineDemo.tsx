import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    date: "2024 - Present",
    content: "Tech Solutions Inc. - Built scalable UI components and optimized performance by 40%.",
    category: "Experience",
    icon: Code,
    relatedIds: [2],
    status: "in-progress" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Full Stack Developer",
    date: "2022 - 2024",
    content: "Creative Agency - Developed custom web applications using MERN stack.",
    category: "Experience",
    icon: FileText,
    relatedIds: [1],
    status: "completed" as const,
    energy: 80,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </>
  );
}

export default RadialOrbitalTimelineDemo;
