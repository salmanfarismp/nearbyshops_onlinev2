import React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Container } from './ui/Container';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      <Container className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight">
            Discover the <span className="text-primary-container">Heart</span> of Your Neighborhood
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg">
            Connecting you with the soul of your community through curated local artisans, hidden gems, and hand-crafted treasures right at your doorstep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" href="/#download-app" className="hover:brightness-110 transition-all">Get the App</Button>
            <Button variant="outline" className="transition-all">Learn More</Button>
          </div>
        </div>
        
        <div className="relative flex justify-center lg:justify-end gap-6 h-[600px] items-center">
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl -z-10"></div>
          
          <div className="iphone-frame w-[260px] h-[530px] -translate-y-12 rotate-[-5deg] relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo_-1wtkxqa5oWFfIy7HODYMR-n6dzj9RDSyRCeTaGC3e4RgU3LupcqjZodptQZRy5JVxipBFHtaWwGn46KXrx6RvGX-ub8hdNtE3SmFVU3AtMrEhAYwwTCLLzeJmMRxkaanZtO69GfBDiDbSPtnvjIWI-pk3_e7DcmzHdmv4kKNQZM519isXnlA6oKESMrF0RoVGejM0tF4Rgoa_VzecR7hYIu4p46_1hLDdn1xuNtSj0JTb-L1GJT-8l6ln6MCLMGE-HcyVU6FI"
              alt="App screenshot"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 260px"
              priority
            />
          </div>
          
          <div className="iphone-frame w-[260px] h-[530px] translate-y-12 rotate-[5deg] relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1DJWuevn3icNnpP0LUXEaQaYl7ejwGwSzTFQdnrC2l0UoFN7bjlL2CDu1pLBNkfiVjuhmbobH6aTrQMK43thgI8cGutFNZR5Bko5iD1cNBtADUrC7QHqIG8BkgUeFsWpzzoKIArP97IAfb34iqGG9tDWfQ1KeIB-GU4TXXfWwQ0Zl2Oh-ztPZ10_SYulFYHhVCTDbvnJopcmhcOZI3ywumCEDqUfvKLuJduamP1iH51SNI2rJdyWtjh-bPCY_pkge59llzC-EV4o"
              alt="App screenshot product detail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 260px"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
