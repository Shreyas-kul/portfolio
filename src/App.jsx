import React from 'react';
import './App.css';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import AIHub from './components/AIHub';
import Contact from './components/Contact';
import { ScrollProgress, BackToTop, Footer } from './components/Footer';

export default function App() {
  return (
    <div className="relative text-slate-50 font-sans bg-[#020204]">
      <ScrollProgress />
      <Background />
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Certifications />
      <Projects />
      <AIHub />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}
