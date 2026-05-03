import React from 'react';
import DownloadCV from '../ui/DownloadCV';
import { motion } from 'framer-motion';
import useMedia from '../../hooks/useMedia';

const Hero = ({ onNavigateToContact }) => {
    const { url: heroImageUrl } = useMedia('hero', './home/Viv.png');

    const textVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: (customDelay) => ({
            opacity: 1,
            y: 0,
            transition: { delay: customDelay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        })
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center pt-32 md:pt-40 overflow-hidden px-4">

            <motion.p
                variants={textVariant}
                initial="hidden"
                animate="visible"
                custom={0.1}
                className="text-zinc-400 text-lg md:text-xl mb-2 text-center relative z-10"
            >
                👋, my name is Vivek Kumar and I am a freelance
            </motion.p>

            <div className="relative z-10 text-center leading-[0.85]">
                <motion.h2
                    variants={textVariant}
                    initial="hidden"
                    animate="visible"
                    custom={0.3}
                    className="text-[13vw] md:text-[11rem] font-black text-white block"
                >
                    Webdesigner
                </motion.h2>
                <motion.h2
                    variants={textVariant}
                    initial="hidden"
                    animate="visible"
                    custom={0.5}
                    className="text-[13vw] md:text-[11rem] font-black text-outline block"
                >
                    &amp; Programmer
                </motion.h2>
            </div>

            <div className="relative z-20 mt-12 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center px-8 text-center md:text-left">
                <p className="text-zinc-500 font-bold text-lg mb-6 md:mb-0">based in Mumbai, India</p>
                <div className="flex items-center space-x-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="h-6 text-zinc-400 font-bold tracking-wide text-sm">React</div>
                    <div className="h-4 w-px bg-zinc-700" />
                    <div className="h-6 text-zinc-400 font-bold tracking-wide text-sm">Node.js</div>
                    <div className="h-4 w-px bg-zinc-700" />
                    <div className="h-6 text-zinc-400 font-bold tracking-wide text-sm">MongoDB</div>
                    <div className="h-4 w-px bg-zinc-700" />
                    <div className="h-6 text-zinc-400 font-bold tracking-wide text-sm">JS</div>
                </div>
            </div>

            <div className="relative z-30 mt-auto mb-12 flex flex-col md:flex-row gap-4">
                <button
                    onClick={onNavigateToContact}
                    className="bg-[#1a1a1a] hover:bg-white hover:text-black border border-zinc-800 text-white px-8 py-4 rounded-lg font-medium transition duration-300 w-64"
                >
                    Contact Me
                </button>
                <DownloadCV />
            </div>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-[500px] pointer-events-none">
                <img
                    src={heroImageUrl}
                    alt="Vivek Kumar"
                    className="w-full h-auto object-cover mask-image-gradient"
                />
            </div>
        </section>
    );
};

export default Hero;
