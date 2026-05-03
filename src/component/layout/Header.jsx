import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onOpenProfile, onNavigate }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Projects', view: 'projects' },
        { name: 'Photos', view: 'photos' },
        { name: 'About', view: 'about' },
        // { name: 'Contact', view: 'contact' },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleNavLinkClick = (view) => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
    };

    // Lock scroll when menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-[9995] py-6 px-6 md:px-12 flex justify-between items-center bg-dark/90 backdrop-blur-md border-b border-white/5">
            {/* Logo - Clickable for Profile */}
            <div
                className="group cursor-pointer flex items-end"
                onClick={() => onNavigate('home')}
                title="Go to Home"
            >
                <h1 className="text-3xl font-black tracking-tighter relative">
                    Vivek Kumar
                </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-300">
                {navLinks.map((link) => (
                    <button 
                        key={link.name} 
                        onClick={() => onNavigate(link.view)} 
                        className="hover:text-white transition cursor-pointer"
                    >
                        {link.name}
                    </button>
                ))}
                <div className="flex space-x-2 border-l border-zinc-700 pl-8">
                    <span className="text-zinc-500 cursor-pointer hover:text-white">HN</span>
                    <span className="text-white font-bold border-b-2 border-white">EN</span>
                </div>
            </nav>

            <div className="hidden md:block">
                <button 
                    onClick={() => onNavigate('contact')}
                    className="bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-medium px-6 py-3 rounded transition"
                >
                    Contact Me
                </button>
            </div>

            {/* Animated Hamburger Button */}
            <button 
                className="md:hidden z-[9996] relative p-2 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none" 
                onClick={toggleMenu}
            >
                <motion.span
                    animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-0.5 bg-white block rounded-full"
                ></motion.span>
                <motion.span
                    animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-0.5 bg-white block rounded-full"
                ></motion.span>
                <motion.span
                    animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-0.5 bg-white block rounded-full"
                ></motion.span>
            </button>

            {/* Mobile Menu Side Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] md:hidden"
                        />
                        
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-dark/95 backdrop-blur-2xl z-[9991] border-l border-white/10 flex flex-col p-12 md:hidden"
                        >
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                                }}
                                className="flex flex-col space-y-10 mt-20"
                            >
                                <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-4">Navigation</p>
                                {navLinks.map((link) => (
                                    <motion.button
                                        key={link.name}
                                        onClick={() => handleNavLinkClick(link.view)}
                                        variants={{
                                            hidden: { opacity: 0, x: 20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        className="text-4xl font-black hover:text-accent transition uppercase tracking-tighter text-left"
                                    >
                                        {link.name}
                                    </motion.button>
                                ))}
                                
                                <motion.div 
                                    variants={{
                                        hidden: { opacity: 0, x: 20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="pt-12 border-t border-white/5"
                                >
                                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-6">Language</p>
                                    <div className="flex space-x-6">
                                        <span className="text-zinc-500 text-xl font-mono">HN</span>
                                        <span className="text-white text-xl font-bold border-b-2 border-white font-mono">EN</span>
                                    </div>
                                </motion.div>

                                <motion.button 
                                    variants={{
                                        hidden: { opacity: 0, x: 20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    onClick={() => handleNavLinkClick('contact')}
                                    className="mt-auto bg-white text-black px-10 py-5 rounded-2xl text-xl font-black hover:scale-105 transition-transform text-center"
                                >
                                    LET'S TALK
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;