import React, { useEffect } from 'react';
import ChartExample from './ChartExample';
import particlesConfig from '/particles-config.json';
import FeaturesSection from './FeaturesSection';

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: 'smooth'
    });
  }
};

const Home = () => {
  useEffect(() => {
    window.particlesJS('hero-particles', particlesConfig);
  }, []);

  return (
    <div className="container-hero">
      <div id="hero-particles" className="hero-particles"></div>
      <header className="hero">
        <div className="hero-content">
          <h1>Visualize Your Data with Ease</h1>
          <p>Turn your data into stunning visualizations effortlessly with our professional chart-making software.</p>
          <button onClick={() => scrollToSection('chart-example')}>Get Started</button>
        </div>
      </header>
      <main>
        <div id='chart-example'>
          <ChartExample />
        </div>
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Home;
