'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Download, ArrowRight, Menu, X } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'how-it-works'>('home');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-[#1c1c1c] font-sans selection:bg-[#2d5235] selection:text-white">
      {/* Navigation Bar */}
      <header className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex items-center justify-between w-full max-w-4xl px-4 sm:px-6 py-2.5 sm:py-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-black/5">
          <div className="flex items-center gap-2.5 font-semibold text-base sm:text-lg tracking-tight">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-full flex-shrink-0 border border-black/10">
              <Image
                src="/logo.png"
                alt="Qurio Learn Logo"
                fill
                sizes="(max-width: 640px) 32px, 36px"
                className="object-cover"
                priority
              />
            </div>
            <span>Qurio Learn</span>
          </div>

          <div className="hidden md:flex items-center bg-[#eae7e1] p-1 rounded-full text-sm font-medium">
            <button
              onClick={() => scrollToSection('top', 'home')}
              className={`px-5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'home' ? 'bg-[#2d5235] text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works', 'how-it-works')}
              className={`px-5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'how-it-works' ? 'bg-[#2d5235] text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              How it works
            </button>
          </div>

          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="hidden sm:flex items-center gap-2 bg-[#1c1c1c] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-black transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Get APK</span>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-black focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-40 md:hidden bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-black/5 flex flex-col gap-4 text-center">
          <button
            onClick={() => scrollToSection('top', 'home')}
            className={`py-3 rounded-2xl text-base font-medium transition-all ${
              activeTab === 'home' ? 'bg-[#2d5235] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('how-it-works', 'how-it-works')}
            className={`py-3 rounded-2xl text-base font-medium transition-all ${
              activeTab === 'how-it-works' ? 'bg-[#2d5235] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            How it works
          </button>
          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-center gap-2 bg-[#1c1c1c] text-white py-3 rounded-2xl text-base font-medium hover:bg-black transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Get APK Directly</span>
          </a>
        </div>
      )}

      {/* Hero Section */}
      <main className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.15] text-balance">
              Experience the future of mobile learning.
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Download the APK directly to try our early release, or leave your email to get notified once live on Google Play.
            </p>

            <div className="bg-[#ebe8e1] p-5 sm:p-6 rounded-3xl max-w-md mx-auto lg:mx-0 shadow-inner border border-black/5 text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3">
                Get priority access the moment we launch on Play Store.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-transparent focus:border-[#2d5235] outline-none text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2d5235] text-white py-3 rounded-2xl text-sm font-medium hover:bg-[#23422a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#2d5235] text-white px-6 py-3.5 rounded-full font-medium hover:bg-[#23422a] shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download APK Directly</span>
              </a>
              <span className="text-xs text-gray-500 font-medium">v1.0.0 • Android Direct APK</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-[270px] sm:max-w-[310px] h-[540px] sm:h-[620px] bg-black rounded-[42px] sm:rounded-[50px] p-3 sm:p-3.5 shadow-2xl border-[4px] sm:border-[6px] border-black">
              <div className="absolute top-5 sm:top-5.5 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-4 sm:h-5 bg-black rounded-full z-30"></div>

              <div className="relative w-full h-full bg-black rounded-[32px] sm:rounded-[40px] overflow-hidden">
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
                      sizes="(max-width: 640px) 270px, 310px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}

                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
                  {screenshots.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="how-it-works" className="mt-20 sm:mt-32 pt-12 sm:pt-16 border-t border-black/10">
          <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-3 sm:mb-4 text-center sm:text-left">
            How It Works
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-8 sm:mb-12 text-center sm:text-left">
            Getting started is simple.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-black/5 space-y-3 sm:space-y-4">
              <span className="text-2xl sm:text-3xl font-serif text-[#2d5235]">01</span>
              <h3 className="text-lg sm:text-xl font-medium">Download the APK</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Click the download button to fetch the latest APK build directly.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-black/5 space-y-3 sm:space-y-4">
              <span className="text-2xl sm:text-3xl font-serif text-[#2d5235]">02</span>
              <h3 className="text-lg sm:text-xl font-medium">Allow Installation</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Enable installation from unknown sources in your browser or file manager settings.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-black/5 space-y-3 sm:space-y-4">
              <span className="text-2xl sm:text-3xl font-serif text-[#2d5235]">03</span>
              <h3 className="text-lg sm:text-xl font-medium">Get Notified</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Enter your email above to receive an instant update when we go live on Google Play.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}