'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Download, ArrowRight } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'how-it-works'>('home');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Direct Google Drive Download Link (Bypasses Supabase 50MB limit)
  const APK_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1XdctwDDxOz1HKmlsXw6r9P9TYLGZLIyt";

  const screenshots = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
    '/5.jpg',
    '/6.jpg',
    '/7.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [screenshots.length]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('waitlist').insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          setMessage({ text: "You're already on the list!", type: 'success' });
        } else {
          setMessage({ text: `Error: ${error.message}`, type: 'error' });
        }
      } else {
        setMessage({ text: 'Success! We will notify you when we launch on Play Store.', type: 'success' });
        setEmail('');
      }
    } catch {
      setMessage({ text: 'Unable to connect to database.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string, tab: 'home' | 'how-it-works') => {
    setActiveTab(tab);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#eae6df] text-[#1c1c1c] font-sans selection:bg-[#2d5235] selection:text-white">
      {/* Navigation Bar - Preserved Full Layout Across Mobile & Desktop */}
      <header className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
        <nav className="flex items-center justify-between w-full max-w-4xl px-3 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-black/10 gap-2">
         {/* Logo Brand Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-semibold text-[11px] xs:text-xs sm:text-base tracking-tight flex-shrink-0">
            <div className="relative w-6 h-6 sm:w-9 sm:h-9 overflow-hidden rounded-full flex-shrink-0 border border-black/10">
              <Image
                src="/logo.png"
                alt="Qurio Learn Logo"
                fill
                sizes="(max-width: 640px) 24px, 36px"
                className="object-cover"
                priority
              />
            </div>
            <span className="inline lowercase font-medium">Qurio Learn</span>
          </div>

          {/* Segmented Navigation Tab Pill */}
          <div className="flex items-center bg-[#dedad3] p-1 rounded-full text-xs sm:text-sm font-medium">
            <button
              onClick={() => scrollToSection('top', 'home')}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                activeTab === 'home' ? 'bg-[#2d5235] text-white shadow-sm' : 'text-gray-700 hover:text-black'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                activeTab === 'how-it-works' ? 'bg-[#2d5235] text-white shadow-sm' : 'text-gray-700 hover:text-black'
              }`}
            >
              How it works
            </button>
          </div>

          {/* Download Button */}
          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 sm:gap-2 bg-[#1c1c1c] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-black transition-all shadow-sm flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Get APK</span>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.15] text-balance">
              Experience the future of{' '}
              <span className="relative inline-block text-[#2d5235] bg-[#2d5235]/10 px-3 py-0.5 rounded-2xl border-b-2 border-[#2d5235]/40 shadow-sm">
                Robotics.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Download the APK directly to try our early release, or leave your email to get notified once live on Google Play.
            </p>

            <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-3xl max-w-md mx-auto lg:mx-0 shadow-md border border-black/10 text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-800 mb-3">
                Get priority access the moment we launch on Play Store.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#f7f5f0] border border-black/10 focus:border-[#2d5235] focus:bg-white outline-none text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2d5235] text-white py-3 rounded-2xl text-sm font-medium hover:bg-[#23422a] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join 100+ early users'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {message && (
                <p className={`mt-3 text-xs font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                  {message.text}
                </p>
              )}
            </div>

            <div id="download-section" className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#2d5235] text-white px-6 py-3.5 rounded-full font-medium hover:bg-[#23422a] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span>Download APK Directly</span>
              </a>
              <span className="text-xs text-gray-600 font-medium">v1.0.0 • Android Direct APK</span>
            </div>
          </div>

          {/* Clean Phone Mockup with Top Camera Bar */}
          <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0">
            <div className="relative w-[280px] sm:w-[320px] h-[570px] sm:h-[650px] bg-[#1a1a1b] rounded-[48px] sm:rounded-[54px] p-2.5 sm:p-3 shadow-2xl border-[4px] border-[#2c2c2e]">
              
              {/* Integrated Side Volume/Power Buttons */}
              <div className="absolute -left-[7px] top-24 w-[3px] h-8 bg-[#3a3a3c] rounded-l-sm"></div>
              <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-[#3a3a3c] rounded-l-sm"></div>
              <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-[#3a3a3c] rounded-r-sm"></div>

              {/* Inner Display Screen Area */}
              <div className="relative w-full h-full bg-black rounded-[38px] sm:rounded-[44px] overflow-hidden">
                
                {/* Front Camera Pill Bar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-black rounded-full z-30 shadow-md"></div>

                {screenshots.map((src, index) => (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`App Screenshot ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 280px, 320px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}

                {/* Subtle Bottom Slide Indicators */}
                <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-1.5">
                  {screenshots.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Bottom Home Bar */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/60 rounded-full z-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="mt-20 sm:mt-32 pt-12 sm:pt-16 border-t border-black/15">
          <div className="text-xs font-semibold tracking-wider text-gray-600 uppercase mb-3 sm:mb-4 text-center sm:text-left">
            How It Works
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-8 sm:mb-12 text-center sm:text-left">
            Getting started is simple.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 01 */}
            <div className="group relative bg-white p-6 sm:p-8 rounded-3xl border border-black/10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#2d5235]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#2d5235]/5 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#2d5235]/10 pointer-events-none" />
              <div className="space-y-3 sm:space-y-4 relative z-10">
                <span className="inline-block text-2xl sm:text-3xl font-serif text-[#2d5235] bg-[#2d5235]/10 px-3 py-1 rounded-2xl transition-transform duration-300 group-hover:scale-105 border border-[#2d5235]/20">
                  01
                </span>
                <h3 className="text-lg sm:text-xl font-medium group-hover:text-[#2d5235] transition-colors">
                  Download the APK
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Click the download button to fetch the latest APK build directly.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="group relative bg-white p-6 sm:p-8 rounded-3xl border border-black/10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#2d5235]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#2d5235]/5 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#2d5235]/10 pointer-events-none" />
              <div className="space-y-3 sm:space-y-4 relative z-10">
                <span className="inline-block text-2xl sm:text-3xl font-serif text-[#2d5235] bg-[#2d5235]/10 px-3 py-1 rounded-2xl transition-transform duration-300 group-hover:scale-105 border border-[#2d5235]/20">
                  02
                </span>
                <h3 className="text-lg sm:text-xl font-medium group-hover:text-[#2d5235] transition-colors">
                  Allow Installation
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Enable installation from unknown sources in your browser or file manager settings.
                </p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="group relative bg-white p-6 sm:p-8 rounded-3xl border border-black/10 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#2d5235]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#2d5235]/5 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#2d5235]/10 pointer-events-none" />
              <div className="space-y-3 sm:space-y-4 relative z-10">
                <span className="inline-block text-2xl sm:text-3xl font-serif text-[#2d5235] bg-[#2d5235]/10 px-3 py-1 rounded-2xl transition-transform duration-300 group-hover:scale-105 border border-[#2d5235]/20">
                  03
                </span>
                <h3 className="text-lg sm:text-xl font-medium group-hover:text-[#2d5235] transition-colors">
                  Get Notified
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Enter your email above to receive an instant update when we go live on Google Play.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}