import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import ProfileModal from './components/ui/ProfileModal';
import PencilCursor from './components/ui/PencilCursor';
import ProjectSection from './components/sections/ProjectSection';
import ContactPage from './components/sections/ContactPage';
import AboutSection from './components/sections/AboutSection';
import Footer from './components/layout/Footer';
import MasterPortfolioTimeline from './components/timeline/MasterPortfolioTimeline';
import PhotosSection from './components/sections/PhotoSection';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  // Admin panel accessible at /#admin
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === '#admin');
  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (isAdmin) return <AdminDashboard />;

  const handleOpenProfile = () => setIsProfileOpen(true);
  const handleCloseProfile = () => setIsProfileOpen(false);

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleNavigateHome = () => handleNavigate('home');
  const handleNavigateToContact = () => handleNavigate('contact');

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = { duration: 0.5, ease: 'easeInOut' };

  return (
    <>
      <PencilCursor />
      <div className="min-h-screen bg-dark text-light">
        <Header onOpenProfile={handleOpenProfile} onNavigate={handleNavigate} />
        <main>
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <Hero onNavigateToContact={handleNavigateToContact} />
                <MasterPortfolioTimeline />
                <Footer />
              </motion.div>
            )}
            {currentView === 'photos' && (
              <motion.div key="photos" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <PhotosSection />
              </motion.div>
            )}
            {currentView === 'contact' && (
              <motion.div key="contact" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ContactPage onNavigateHome={handleNavigateHome} />
              </motion.div>
            )}
            {currentView === 'projects' && (
              <motion.div key="projects" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ProjectSection onNavigateHome={handleNavigateHome} />
              </motion.div>
            )}
            {currentView === 'about' && (
              <motion.div key="about" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <AboutSection onNavigateHome={handleNavigateHome} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <ProfileModal isOpen={isProfileOpen} onClose={handleCloseProfile} />
      </div>
    </>
  );
}

export default App;