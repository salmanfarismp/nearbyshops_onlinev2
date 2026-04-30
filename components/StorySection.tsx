import React from 'react';
import Image from 'next/image';
import { Container } from './ui/Container';

export const StorySection = () => {
  return (
    <section className="py-32 bg-white border-y border-surface-variant/10 overflow-hidden">
      <Container>
        <div className="text-center mb-24">
          <h2 className="text-4xl font-extrabold text-on-surface mb-3 tracking-tight">How about a story?</h2>
          <h3 className="text-2xl font-semibold text-primary-container italic font-display-serif">A Local Story from Kerala</h3>
        </div>

        <div className="max-w-[1000px] mx-auto">
          {/* Row 1: Anjali & The Loss */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-16 md:mb-24">
            <div className="flex-1 min-w-[300px] w-full">
              <div className="relative w-full aspect-4/3 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(151,72,0,0.15)]">
                <Image 
                  src="/assets/first.jpg" 
                  alt="Anjali sitting at her desk with a laptop in a cozy room"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="flex-1 max-w-[600px] md:max-w-none">
              <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed font-serif">
                <p>When Anjali clicked "confirm order" on the massive online clothing site, she felt a small thrill. A new dress, arriving in two days. Total spent: ₹3000.</p>
                <p>That ₹3000 traveled instantly across the country, perhaps across an ocean, straight into the account of a colossal corporation. The money paid for warehouse automation, an executive salary far away, and global marketing. It was efficient, fast, and convenient.</p>
                <p>But that money, swift as it was, was gone from her town forever. It skipped her community entirely, leaving nothing behind but a box on her doorstep and a faint feeling of economic emptiness.</p>
              </div>
            </div>
          </div>

          {/* Row 2: Diya's Boutique (Reverse) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 mb-16 md:mb-24">
            <div className="flex-1 min-w-[300px] w-full">
              <div className="relative w-full aspect-4/3 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(151,72,0,0.15)]">
                <Image 
                  src="/assets/second.jpg" 
                  alt="Warm boutique interior with vibrant Kerala sarees"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="flex-1 max-w-[600px] md:max-w-none">
              <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed font-serif">
                <p>Now, imagine the alternative. Anjali walks down Main Street and buys the same dress from Diya's Boutique. The cost is the same: ₹3000.</p>
                <p>Diya takes that ₹3000. It's not just a number; it's a certainty. That evening, she walks to The Daily Grocer and spends ₹2000 of it, ensuring her family has fresh food for the week.</p>
              </div>
            </div>
          </div>

          {/* Row 3: The Grocer & The Tailor */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-16 md:mb-24">
            <div className="flex-1 min-w-[300px] w-full">
              <div className="relative w-full aspect-4/3 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(151,72,0,0.15)]">
                <Image 
                  src="/assets/third.jpg" 
                  alt="Traditional local grocer and tailor workshop scene"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="flex-1 max-w-[600px] md:max-w-none">
              <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed font-serif">
                <p>The Grocer, Mr. Hyder Ali, now has Diya's ₹2000. He was just worrying about his daughter's worn school clothes. He takes ₹600 and walks to Mr. Satheeshan, the Local Tailor, to have her uniform mended and fit perfectly. Mr. Hyder Ali is proud his daughter will look sharp for school.</p>
                <p>Mr. Satheeshan, the Tailor, feels relieved. He takes that ₹600 and immediately spends ₹200 at the farmers' market stall run by Ammachi (Old Mother), buying crisp carrots and onion. He thinks of his family's dinner.</p>
              </div>
            </div>
          </div>

          {/* Row 4: Ammachi & Conclusion (Reverse) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 mb-16 md:mb-24">
            <div className="flex-1 min-w-[300px] w-full">
              <div className="relative w-full aspect-4/3 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(151,72,0,0.15)]">
                <Image 
                  src="/assets/fourth.jpg" 
                  alt="Atmospheric Kerala farmers market with fresh produce"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="flex-1 max-w-[600px] md:max-w-none">
              <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed font-serif">
                <p>The story doesn't end there. Ammachi will use her ₹200 to buy more produce. It will go to another farmer, another worker, another family. That first ₹3000 hasn't left the community; it has multiplied.</p>
                
                <p className="italic text-on-surface/80 border-l-4 border-primary-container pl-6 py-2">
                  It bought a dress for Anjali. It bought groceries for Ms. Diya. It mended a uniform for Mr. Hyder Ali's daughter. It bought fresh vegetables for Mr. Satheeshan's family.
                </p>
                
                <div className="mt-8 pt-8 border-t border-surface-variant/20">
                  <p className="text-on-surface font-semibold text-xl leading-relaxed">
                    In the first scenario, ₹3000 delivered a dress. In the second, the same ₹3000 delivered a dress, security, education, and sustenance, binding the community together one transaction at a time.
                  </p>
                  <p className="text-primary-container font-bold mt-4 text-lg">The local purchase isn't just a transaction; it's a commitment to the well-being of your neighbor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
