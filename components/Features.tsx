import React from 'react';
import { Container } from './ui/Container';
import { Section } from './ui/Section';

const featuresData = [
  {
    icon: 'map',
    title: 'Wander & Discover',
    description: "Explore an interactive map of your neighborhood's best-kept secrets, from micro-bakeries to hidden galleries."
  },
  {
    icon: 'chat',
    title: 'Connect Instantly',
    description: 'Chat directly with local shop owners to inquire about custom orders, availability, or neighborhood events.'
  },
  {
    icon: 'favorite',
    title: 'Support Local',
    description: 'Join a movement that keeps wealth within the community by supporting small-scale makers and artisans.'
  }
];

export const Features = () => {
  return (
    <Section className="bg-white">
      <Container>
        <div className="text-center mb-20">
          <h2 className="font-headline-lg text-headline-lg mb-4">Crafted for Connection</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Our tools are designed to bridge the gap between digital ease and physical community warmth.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {featuresData.map((feature, index) => (
            <div key={index} className="p-8 rounded-xl hover:shadow-xl hover:shadow-orange-900/5 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-primary-container mb-6 group-hover:bg-primary-container group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4">{feature.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
