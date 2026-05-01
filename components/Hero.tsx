import React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Container } from './ui/Container';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      <Container className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <h1 className="font-display-lg text-4xl lg:text-display-lg text-on-surface mb-4 lg:mb-6 leading-tight">
            Discover the <span className="text-primary-container">Heart</span> of Your Neighborhood
          </h1>
          <p className="font-body-lg text-base lg:text-body-lg text-on-surface-variant mb-8 lg:mb-10 max-w-lg">
            Connecting you with the soul of your community through curated local artisans, hidden gems, and hand-crafted treasures right at your doorstep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" href="/#download-app" className="hover:brightness-110 transition-all w-full sm:w-auto">Get the App</Button>
            <Button variant="outline" className="transition-all w-full sm:w-auto">Learn More</Button>
          </div>
        </div>
        
        <div className="relative flex justify-center lg:justify-end h-[450px] lg:h-[600px] items-center">
          {/* Decorative background element */}
          <div className="absolute -right-10 lg:-right-20 -top-10 lg:-top-20 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-orange-100/50 rounded-full blur-3xl -z-10"></div>
          
          <div className="w-[180px] sm:w-[220px] lg:w-[260px] h-[380px] sm:h-[460px] lg:h-[530px] -translate-y-8 lg:-translate-y-12 rotate-[-5deg] relative z-10">
            <Image 
              src="/assets/screen 1.png"
              alt="App screenshot"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 50vw, 260px"
              priority
            />
          </div>
          
          <div className="w-[180px] sm:w-[220px] lg:w-[260px] h-[380px] sm:h-[460px] lg:h-[530px] translate-y-8 lg:translate-y-12 rotate-[5deg] relative -ml-16 lg:ml-6">
            <Image 
              src="/assets/screen 2.png"
              alt="App screenshot product detail"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 50vw, 260px"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
