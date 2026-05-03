import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import useMedia from '../../hooks/useMedia';

const SocialIcon = ({ icon, link, label }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-2.5 bg-slate-700/60 rounded-full text-slate-300 hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/25"
  >
    {icon}
  </a>
);

const StatCard = ({ value, label }) => (
  <div className="flex flex-col items-center px-4 py-3 bg-slate-700/40 rounded-2xl border border-slate-600/40">
    <span className="text-2xl font-black text-white">{value}</span>
    <span className="text-xs text-slate-400 mt-0.5 text-center">{label}</span>
  </div>
);

const AboutSection = () => {
  const { url: profileImageUrl } = useMedia('profile', './home/Vivekimg.jpg');
  const [storyExpanded, setStoryExpanded] = useState(false);

  const shortBio = `Hi, I'm Vivek Kumar — a Frontend Developer at Tekunik who's passionate about building web experiences that don't just work, but feel right. I focus on creating fast, clean, and visually engaging interfaces using modern tools like React, Next.js, and Tailwind CSS.

For me, frontend development isn't just about writing code — it's about shaping how people interact with a product. That's why I pay close attention to performance, responsiveness, and the small details that make a big difference. I also enjoy bringing interfaces to life with smooth, meaningful animations using Framer Motion — because a static website rarely leaves a lasting impression.`;

  const myStory = `I like to think my story starts like a slow, warm movie scene — sunlight over open fields in Ballia, Uttar Pradesh. Life there wasn't rushed. It had its own rhythm. Mornings felt fresh, afternoons stretched endlessly, and evenings were calm in a way cities can't really understand. My childhood was simple — running around freely, getting into harmless mischief, sometimes even chasing cows just for the thrill of it. There was no pressure, no noise — just space to grow, observe, and be present.

Then, just when the story felt steady, the plot flipped.

In 9th grade, I moved to Mumbai.

It wasn't just a change of location — it felt like stepping into a completely different world. The quiet fields were replaced by crowded streets, fast-moving people, and the constant rush of local trains. Everything moved faster — decisions, conversations, even time itself. At first, it was overwhelming. The city didn't slow down for anyone, and I had to figure out how to keep up.

But somewhere in that chaos, I started changing.

I learned how to adapt. I learned how to stay focused even when everything around me felt noisy. I learned how to move fast without losing control. From surviving packed trains to navigating a new school and environment, every day felt like a small challenge — and slowly, I got better at handling them.

By the time I finished my high school and graduation in Mumbai, I realized something important: I hadn't left my village behind — I had built on top of it. The calm, patient mindset from Ballia was still there, but now it worked alongside the speed, sharpness, and resilience I picked up in the city.

That's why today, I describe myself as a "village soul with a high-speed city processor."

And honestly, it shapes everything I do — especially coding. I stay patient when solving problems, but I adapt quickly when things get complex. Because in a way, my journey taught me this: whether it's life or code, it's not just about where you start — it's about how well you learn to adapt and keep moving forward.`;

  return (
    <section className="min-h-screen bg-gray-950 text-white py-24 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.p initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-3 text-center">
          — Who I Am —
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-center mb-14 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
            className="lg:col-span-1 bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-sm shadow-xl shadow-black/30">
            <div className="relative mb-5">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-md opacity-70" />
              <img src={profileImageUrl} alt="Vivek Kumar" className="relative w-28 h-28 rounded-full border-4 border-slate-800 object-cover" />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800 shadow-md shadow-emerald-400/50" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Vivek Kumar</h1>
            <p className="text-cyan-400 text-sm font-semibold mb-1">Full Stack Web Developer</p>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2"><MapPin size={12} /> Mumbai, India</div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-6"><Briefcase size={12} /><span className="text-emerald-400 font-semibold">Open to Work</span></div>
            <div className="flex gap-3 mb-8">
              <SocialIcon icon={<Github size={18} />} link="https://github.com/stevenkumar" label="GitHub" />
              <SocialIcon icon={<Linkedin size={18} />} link="https://www.linkedin.com/in/vivek-kumar-733552317/" label="LinkedIn" />
              <SocialIcon icon={<Twitter size={18} />} link="https://x.com/Vivek9653" label="Twitter" />
              <SocialIcon icon={<Mail size={18} />} link="mailto:vkvseri@gmail.com" label="Email" />
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <StatCard value="2+" label="Yrs Exp" />
              <StatCard value="15+" label="Projects" />
              <StatCard value="10+" label="Clients" />
            </div>
          </motion.div>

          {/* Short Bio */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
            className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-black/30 flex flex-col justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-4">Who I Am</h3>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                {shortBio.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'TypeScript'].map(tech => (
                <span key={tech} className="text-xs bg-slate-700/70 text-cyan-300 px-3 py-1 rounded-full border border-slate-600/50 font-medium">{tech}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Story Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }}
          className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-black/30">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl text-cyan-500/30 font-serif leading-none -mt-2 select-none">"</div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">My Story</h3>
              <p className="text-xl font-bold text-white leading-snug">A village soul with a high-speed city processor.</p>
            </div>
          </div>
          <div className="text-slate-300 text-sm leading-relaxed space-y-4">
            {myStory.split('\n\n').slice(0, 2).map((para, i) => <p key={i}>{para}</p>)}
            <AnimatePresence>
              {storyExpanded && (
                <motion.div key="story-rest" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="overflow-hidden space-y-4">
                  {myStory.split('\n\n').slice(2).map((para, i) => <p key={i}>{para}</p>)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => setStoryExpanded(!storyExpanded)}
            className="mt-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors group">
            {storyExpanded
              ? <><ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Read Less</>
              : <><ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" /> Read My Full Story</>}
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;
