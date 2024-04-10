// FeaturesSection.js

import React from 'react';
import BarGraph from './BarGraph';

const FeatureCard = ({ title, description }) => {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="features">
      <h2>Key Features</h2>
      <div className="feature-cards">
        <FeatureCard
          title="Easy-to-Use Interface"
          description="Create stunning charts quickly with our intuitive user interface."
        />
        <FeatureCard
          title="Customizable Charts"
          description="Customize every aspect of your charts to suit your needs and style."
        />
        <FeatureCard
          title="Data Import"
          description="Import data from various sources seamlessly for immediate visualization."
        />
      </div>
      {/* <BarGraph /> */}
    </section>
  );
};

export default FeaturesSection;
