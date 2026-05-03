import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaPython, FaGitAlt } from 'react-icons/fa';
import { SiTailwindcss, SiFramer, SiMongodb, SiTypescript } from 'react-icons/si';
import TimelineDemo from '../timeline/TimelineDemo';

const generateAnimationDuration = (index) => {
  const seed = index * 12.5;
  return 4 + (seed % 2);
};

const skills = [
  { icon: <FaReact />, color: "text-cyan-400", x: "10%", y: "20%" },
  { icon: <FaJs />, color: "text-yellow-400", x: "80%", y: "10%" },
  { icon: <SiTailwindcss />, color: "text-sky-400", x: "50%", y: "50%" },
  { icon: <FaNodeJs />, color: "text-green-500", x: "20%", y: "70%" },
  { icon: <SiFramer />, color: "text-purple-400", x: "70%", y: "80%" },
  { icon: <SiTypescript />, color: "text-blue-500", x: "40%", y: "15%" },
  { icon: <SiMongodb />, color: "text-emerald-500", x: "85%", y: "60%" },
];

const ExperienceSkills = () => {
  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="h-[600px] w-full">
          <h2 className="text-4xl font-bold mb-4 border-l-4 border-blue-500 pl-4">Experience</h2>
          <div className="h-full w-full relative">
            <TimelineDemo />
          </div>
        </motion.div>

        <div className="relative h-[500px] w-full bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
          <h3 className="absolute top-6 left-6 text-xl font-bold opacity-50 uppercase tracking-widest">Skills Cloud</h3>
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className={`absolute text-5xl ${skill.color} p-4 bg-slate-800/40 rounded-2xl backdrop-blur-md border border-slate-700/50 shadow-xl`}
              style={{ left: skill.x, top: skill.y }}
              animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: generateAnimationDuration(index), repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.2, rotate: 0, backgroundColor: "rgba(255, 255, 255, 0.1)", zIndex: 10 }}
            >
              {skill.icon}
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ExperienceSkills;
