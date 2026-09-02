import React, { useState, useEffect } from 'react';
import { 
  Menu, X, MapPin, Calendar, Users, ArrowRight, 
  CheckCircle2, Compass, Briefcase, GraduationCap, 
  Star, ChevronRight, PlaneTakeoff, Shield, HeartHandshake,
  Sparkles, Smile, Sun, Camera, Ticket
} from 'lucide-react';
import './index.css'
import { fetchPackages, resolveImageUrl } from './lib/api';

// --- DATA MODELS ---
// Packages used to be hardcoded here. They now live in the SQLite database and
// are loaded at runtime via fetchPackages() — see the App component below.

const DESTINATIONS = [
  { name: 'Kashmir', type: 'large', image: 'https://images.unsplash.com/photo-1622308644420-b2fc4569ce10?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { name: 'Dubai', type: 'medium', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Bali', type: 'medium', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Thailand', type: 'small', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { name: 'Goa', type: 'small', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
];

const PackageModal = ({ data, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white border-4 border-black rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto fun-shadow flex flex-col animate-[fadeIn_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
        <div className="relative h-64 sm:h-72 border-b-4 border-black shrink-0">
          <img src={resolveImageUrl(data.image)} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-yellow-400 border-2 border-black px-3 py-1.5 rounded-full text-xs font-black text-black uppercase tracking-wide fun-shadow-sm">
              {data.category}
            </span>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white border-4 border-black rounded-full p-2 text-black hover:bg-yellow-400 hover:-translate-y-1 transition-all fun-shadow-sm">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 text-gray-500 font-black text-sm mb-2 uppercase tracking-widest">
              <Calendar size={18} className="text-yellow-500"/> {data.duration} • {data.region}
            </div>
            <h3 className="text-4xl font-black text-black uppercase leading-tight">{data.title}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.tags.map(tag => (
               <span key={tag} className="bg-gray-100 border-2 border-black text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                 {tag}
               </span>
            ))}
          </div>
          
          <p className="text-lg font-bold text-gray-700 border-l-4 border-yellow-400 pl-4">
            {data.description && data.description.trim()
              ? data.description
              : 'Get ready for an unforgettable experience. This package is specially curated to provide the perfect balance of adventure, comfort, and culture.'}
          </p>

          {Array.isArray(data.inclusions) && data.inclusions.length > 0 && (
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">What's Included</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.inclusions.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-black">
                    <CheckCircle2 size={16} className="text-yellow-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-4 border-dashed border-gray-200 mt-auto">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Package Price</p>
              <p className="text-3xl font-black text-black">{data.price === 'Custom' ? 'Custom Quote' : `₹${data.price}`}</p>
            </div>
            <a 
              href={`https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(data.title)}%20package.`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-green-400 border-4 border-black text-black rounded-xl font-black uppercase tracking-widest text-lg hover:bg-green-500 hover:-translate-y-1 fun-shadow-hover transition-all text-center flex items-center justify-center gap-2"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white border-b-4 border-black py-3 fun-shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* LOGO - Clicks to scroll to top */}
        <a 
          href="#" 
          onClick={scrollToTop} 
          className="font-black text-2xl tracking-tighter bg-yellow-400 text-black border-4 border-black px-4 py-1 transform transition-transform hover:rotate-2 -rotate-2 fun-shadow-sm inline-block cursor-pointer"
        >
          DO YOU TRAVEL<span className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">.</span>
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-8 font-black text-sm uppercase tracking-wider text-black bg-white/90 px-6 py-3 rounded-full border-2 border-black fun-shadow-sm">
          <a href="#" onClick={scrollToTop} className="hover:text-yellow-500 hover:-translate-y-1 transition-transform">Home</a>
          <a href="#mice" className="text-yellow-500 hover:text-yellow-400 transition-colors flex items-center gap-1">MICE <Briefcase size={16}/></a>
          <a href="#fixed" className="hover:text-yellow-500 hover:-translate-y-1 transition-transform">Group Trips</a>
          <a href="#packages" className="hover:text-yellow-500 hover:-translate-y-1 transition-transform">All Packages</a>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <a href="#packages" className="px-6 py-3 rounded-full font-black uppercase tracking-wide bg-yellow-400 text-black border-4 border-black fun-shadow-hover transition-all inline-block">
            Plan Your Trip
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 rounded-xl border-4 border-black text-black bg-yellow-400 fun-shadow-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black flex flex-col p-6 space-y-4 font-black uppercase text-black fun-shadow">
          <a href="#" onClick={(e) => { scrollToTop(e); setIsMobileMenuOpen(false); }} className="py-3 border-b-2 border-gray-100">Home</a>
          <a href="#mice" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b-2 border-gray-100 text-yellow-500 flex justify-between items-center">MICE (Corporate) <Sparkles size={20}/></a>
          <a href="#fixed" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b-2 border-gray-100">Group Fixed Trips</a>
          <a href="#packages" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b-2 border-gray-100">All Packages</a>
          <a href="#packages" onClick={() => setIsMobileMenuOpen(false)} className="bg-yellow-400 text-black border-4 border-black py-4 rounded-xl mt-4 text-center fun-shadow-sm">Plan Your Trip</a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Framed Background Image */}
      <div className="absolute inset-0 z-0 p-4 md:p-8 pb-32">
         <div className="w-full h-full rounded-[2rem] md:rounded-[3rem] border-4 border-black overflow-hidden relative fun-shadow">
            <img 
              src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
              alt="Kashmir Landscape" 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-black/40"></div>
         </div>
      </div>

      {/* Floating Fun Stickers */}
      <div className="absolute top-40 left-10 md:left-24 animate-[bounce_4s_infinite] bg-yellow-400 border-4 border-black p-4 rounded-full fun-shadow rotate-12 z-20 hidden sm:block">
        <PlaneTakeoff size={36} className="text-black" />
      </div>
      <div className="absolute bottom-48 right-10 md:right-24 animate-[bounce_5s_infinite] bg-white border-4 border-black p-4 rounded-full fun-shadow -rotate-12 z-20 hidden sm:block">
        <Smile size={36} className="text-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-4 border-black text-black text-sm uppercase tracking-widest font-black mb-8 fun-shadow-sm rotate-[-2deg]">
          <MapPin size={18} className="text-yellow-500" /> Destination Spotlight
        </div>
        <h1 className="text-7xl md:text-9xl font-black text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wide uppercase font-serif">
          Kashmir
        </h1>
        <p className="text-xl md:text-2xl text-white font-bold mb-10 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/40 p-4 rounded-2xl border-2 border-white/20">
          Discover the paradise that keeps calling you back. Curated experiences for teams, groups, and wanderers.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="#packages" className="px-8 py-5 bg-yellow-400 border-4 border-black text-black rounded-full font-black uppercase tracking-widest text-xl hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
            Explore Kashmir <ArrowRight size={24} />
          </a>
        </div>
      </div>

      {/* Scrolling Marquee Banner at bottom */}
      <div className="absolute bottom-0 w-full bg-yellow-400 border-y-4 border-black py-4 z-20 overflow-hidden flex shadow-[0_-4px_0_0_rgba(0,0,0,0.1)]">
         <div className="animate-marquee whitespace-nowrap flex items-center font-black text-2xl tracking-widest uppercase text-black">
            <span className="mx-6">🌍 MICE EXPERTS</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">✈️ GROUP DEPARTURES</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">🎒 STUDENT TRIPS</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">🌍 MICE EXPERTS</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">✈️ GROUP DEPARTURES</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">🎒 STUDENT TRIPS</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">🌍 MICE EXPERTS</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">✈️ GROUP DEPARTURES</span> <span className="mx-6 text-xl">•</span>
            <span className="mx-6">🎒 STUDENT TRIPS</span> <span className="mx-6 text-xl">•</span>
         </div>
      </div>
    </section>
  );
};

const MiceSection = () => {
  return (
    <section id="mice" className="py-24 bg-white text-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 text-black bg-yellow-400 border-2 border-black px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-sm fun-shadow-sm">
            <Briefcase size={18} /> Specialized Corporate Travel
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] uppercase">
            Your Team Deserves <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">More</span>.
          </h2>
          <p className="text-xl text-gray-700 font-bold leading-relaxed">
            Turn corporate travel into an experience. We curate extraordinary offsites, incentive trips, and leadership retreats that build culture and inspire teams.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4 font-black">
            {['Corporate Offsites', 'Incentive Trips', 'Dealer Meets', 'Annual Conferences'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-black">
                <div className="bg-yellow-400 border-2 border-black rounded-full p-1"><CheckCircle2 size={20} /></div>
                <span className="uppercase text-sm tracking-wide">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <a href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20planning%20a%20MICE%20experience." target="_blank" rel="noreferrer" className="inline-block px-10 py-5 bg-black text-yellow-400 border-4 border-black rounded-full font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black fun-shadow-hover transition-all text-center">
              Plan a MICE Experience
            </a>
          </div>
        </div>

        <div className="lg:w-1/2 relative w-full">
          {/* Fun image styling */}
          <div className="relative rounded-3xl overflow-hidden border-4 border-black fun-shadow rotate-2 bg-yellow-100">
            <img 
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Corporate Team Experience" 
              className="w-full h-[500px] object-cover mix-blend-multiply opacity-90"
            />
            
            {/* Floating Badge */}
            <div className="absolute bottom-8 left-8 bg-white border-4 border-black p-6 rounded-2xl max-w-xs fun-shadow-sm -rotate-3">
              <div className="text-5xl font-black text-yellow-500 mb-1">500+</div>
              <div className="text-black font-bold uppercase text-xs tracking-wider">Corporate travelers hosted last year globally.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GroupFixedSection = ({ onSelectPackage, packages }) => {
  // Prefer packages the admin has marked "Featured" in the dashboard; fall back
  // to the first couple of packages so the section never looks broken while
  // nothing is marked featured yet.
  const featured = packages.filter((p) => p.featured);
  const cards = (featured.length >= 2 ? featured : packages).slice(0, 2);
  const cardStyles = [
    { bg: 'bg-yellow-400', button: 'bg-black text-white group-hover:bg-white group-hover:text-black group-hover:border-4 group-hover:border-black' },
    { bg: 'bg-white', button: 'bg-yellow-400 border-4 border-black text-black group-hover:bg-black group-hover:text-white' }
  ];

  return (
    <section id="fixed" className="py-24 bg-black text-white relative overflow-hidden border-y-8 border-yellow-400">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 text-black bg-white border-4 border-white px-5 py-2 rounded-full font-black uppercase tracking-widest text-sm mb-6 transform rotate-2">
              <Ticket size={20} /> Second Most Popular
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] uppercase text-yellow-400">
              Group Fixed<br/>Departures
            </h2>
            <p className="text-xl text-gray-300 font-bold mt-4 max-w-xl">
              Don't have a corporate team? Join one of our pre-planned group trips. Fixed dates, awesome itineraries, and a crew of like-minded travelers.
            </p>
          </div>
          <a href="#packages" className="px-8 py-4 bg-white text-black border-4 border-white rounded-full font-black uppercase tracking-widest hover:bg-yellow-400 hover:border-yellow-400 transition-all fun-shadow-sm">
            View Calendar
          </a>
        </div>

        {/* Featured Fixed Departures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((pkg, i) => (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className={`${cardStyles[i].bg} rounded-3xl p-4 border-4 border-white transform hover:-translate-y-2 transition-transform duration-300 flex flex-col sm:flex-row gap-6 items-center cursor-pointer group`}
            >
              <div className="w-full sm:w-2/5 h-48 rounded-2xl overflow-hidden border-4 border-black relative">
                <img src={resolveImageUrl(pkg.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={pkg.title} />
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-black text-white font-black text-xs uppercase px-2 py-1 rounded">Filling Fast</div>
                )}
              </div>
              <div className="w-full sm:w-3/5 text-black">
                {pkg.featuredDates && (
                  <div className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-2 inline-block">{pkg.featuredDates}</div>
                )}
                <h3 className="text-3xl font-black uppercase leading-tight mb-2">{pkg.title}</h3>
                <p className="font-bold text-sm mb-4">{pkg.duration}{pkg.featuredRoute ? ` • ${pkg.featuredRoute}` : ''}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black">{pkg.price === 'Custom' ? 'Custom Quote' : `₹${pkg.price}`}</span>
                  <button className={`w-12 h-12 rounded-full flex justify-center items-center transition-all ${cardStyles[i].button}`}>
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PackageCard = ({ data, onClick }) => (
  <div 
    onClick={() => onClick(data)}
    className="group bg-white rounded-3xl overflow-hidden border-4 border-black fun-shadow flex flex-col h-full hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer"
  >
    <div className="relative h-56 overflow-hidden border-b-4 border-black">
      <img 
        src={resolveImageUrl(data.image)} 
        alt={data.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="bg-white border-2 border-black px-3 py-1.5 rounded-full text-xs font-black text-black uppercase tracking-wide fun-shadow-sm">
          {data.region}
        </span>
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {data.tags.map(tag => (
          <span key={tag} className="bg-yellow-400 border-2 border-black text-black px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide inline-block fun-shadow-sm text-center">
            {tag}
          </span>
        ))}
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-2 text-black font-bold text-sm mb-3">
        <Calendar size={18} className="text-yellow-500"/> {data.duration}
      </div>
      
      <h3 className="text-2xl font-black text-black mb-2 leading-tight uppercase group-hover:text-yellow-500 transition-colors">
        {data.title}
      </h3>
      
      <div className="mt-auto pt-6 flex items-center justify-between border-t-4 border-black border-dashed">
        <div>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Starting from</p>
          <p className="text-2xl font-black text-black">{data.price === 'Custom' ? 'Custom Quote' : `₹${data.price}`}</p>
        </div>
        <button className="w-14 h-14 rounded-full bg-yellow-400 border-4 border-black group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all fun-shadow-sm group-hover:-translate-y-1">
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  </div>
);

const PackagesSection = ({ onSelectPackage, packages, isLoading }) => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const categories = ['All', 'MICE', 'Group Fixed', 'Student'];
  
  const filteredPackages = packages.filter(p => {
    if (categoryFilter === 'All') return true;
    return p.category === categoryFilter;
  });

  return (
    <section id="packages" className="py-24 bg-yellow-50 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-tight mb-4 uppercase">
              Explore All <br/>Experiences
            </h2>
            <p className="text-xl text-black font-bold">
              Looking for something else? Filter through our wider range of trips below.
            </p>
          </div>
        </div>

        {/* FUN CATEGORY SWITCHER */}
        <div className="flex flex-wrap gap-4 mb-12 bg-white p-2 rounded-3xl border-4 border-black inline-flex fun-shadow-sm">
          {categories.map((c) => (
            <button 
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all ${
                categoryFilter === c 
                  ? 'bg-yellow-400 text-black border-4 border-black' 
                  : 'bg-transparent text-gray-500 hover:text-black border-4 border-transparent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => <PackageCard key={pkg.id} data={pkg} onClick={onSelectPackage} />)
          ) : (
            <div className="col-span-full py-12 text-center border-4 border-black border-dashed rounded-3xl bg-white">
              <Compass size={48} className="mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-black uppercase">
                {isLoading ? 'Loading packages...' : 'More packages coming soon!'}
              </h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const DestinationShowcase = () => {
  return (
    <section id="destinations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-black tracking-tight mb-4 uppercase">
            The Hit List
          </h2>
          <p className="text-xl text-black font-bold">
            Handpicked destinations to create unforgettable memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden border-4 border-black fun-shadow group cursor-pointer h-[300px] md:h-full">
            <img src={DESTINATIONS[0].image} alt="Kashmir" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="bg-yellow-400 text-black px-3 py-1 border-2 border-black rounded-full font-black tracking-widest text-xs uppercase mb-3 inline-block fun-shadow-sm">Featured</span>
              <h3 className="text-5xl font-black text-white mb-2 uppercase">{DESTINATIONS[0].name}</h3>
            </div>
          </div>
          
          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden border-4 border-black fun-shadow group cursor-pointer h-[250px] md:h-full">
            <img src={DESTINATIONS[1].image} alt="Dubai" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 left-6 bg-white border-4 border-black px-4 py-2 rounded-xl fun-shadow-sm transform -rotate-2">
              <h3 className="text-2xl font-black text-black uppercase">{DESTINATIONS[1].name}</h3>
            </div>
          </div>
          
          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden border-4 border-black fun-shadow group cursor-pointer h-[250px] md:h-full">
            <img src={DESTINATIONS[2].image} alt="Bali" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 left-6 bg-white border-4 border-black px-4 py-2 rounded-xl fun-shadow-sm transform rotate-2">
              <h3 className="text-2xl font-black text-black uppercase">{DESTINATIONS[2].name}</h3>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden border-4 border-black fun-shadow group cursor-pointer h-[200px] md:h-full">
            <img src={DESTINATIONS[3].image} alt="Thailand" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 left-6 bg-white border-4 border-black px-4 py-2 rounded-xl fun-shadow-sm">
              <h3 className="text-xl font-black text-black uppercase">{DESTINATIONS[3].name}</h3>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden bg-yellow-400 border-4 border-black fun-shadow-hover group cursor-pointer p-8 flex flex-col justify-center items-center text-center h-[200px] md:h-full transition-all hover:bg-black hover:text-yellow-400">
             <Sun size={48} className="mb-4 animate-[spin_10s_linear_infinite]" />
             <h3 className="text-2xl font-black mb-2 uppercase">View All</h3>
             <span className="text-sm font-bold uppercase border-b-4 border-current pb-1">Destinations</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const VibeGallery = () => {
  return (
    <section className="py-24 bg-gray-50 border-y-4 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16">
        <div className="inline-block bg-yellow-400 border-4 border-black p-3 rounded-2xl fun-shadow-sm mb-6 transform rotate-3">
          <Camera size={32} />
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-black uppercase">The Vibe Check</h2>
        <p className="text-xl font-bold mt-4">Real moments. Unfiltered chaos. Pure joy.</p>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x hide-scrollbar">
        {[
          { img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Offsite in Goa' },
          { img: 'https://images.unsplash.com/photo-1523480717984-24cba35ae1ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Kashmir Crew' },
          { img: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Bali Treks' },
          { img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Bonfire Nights' }
        ].map((item, i) => (
          <div key={i} className={`min-w-[280px] md:min-w-[350px] bg-white p-4 pb-12 rounded-xl border-4 border-black fun-shadow snap-center ${i % 2 === 0 ? 'transform -rotate-2' : 'transform rotate-2'}`}>
            <img src={item.img} alt={item.text} className="w-full h-64 object-cover border-4 border-black rounded-lg mb-4" />
            <p className="font-black text-xl text-center uppercase tracking-wider">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const StudentSection = () => (
  <section className="py-24 bg-yellow-400 border-b-4 border-black relative overflow-hidden">
    <div className="absolute top-10 right-20 hidden md:block animate-[spin_12s_linear_infinite]">
      <Star size={100} className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" fill="white" />
    </div>
    
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12">
      <div className="lg:w-1/2">
        <div className="border-4 border-black rounded-3xl overflow-hidden fun-shadow rotate-3 bg-white">
          <img 
            src="https://images.unsplash.com/photo-1527525443983-6e60c75fff50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Student Travel" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="lg:w-1/2 text-black">
        <div className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-6 bg-white border-4 border-black px-4 py-2 rounded-full fun-shadow-sm">
          <GraduationCap size={20} /> University & College
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase leading-none">
          Big Trips.<br/><span className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Small Budgets.</span>
        </h2>
        <p className="text-xl font-bold text-black mb-8 max-w-lg border-l-8 border-black pl-4">
          Exclusive group travel packages designed specifically for students and institutions. Affordable, safe, and packed with adventure.
        </p>
        <a href="#packages" className="inline-block px-10 py-5 bg-black text-yellow-400 border-4 border-black rounded-full font-black uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-all fun-shadow-hover mt-4 text-center">
          Explore Student Trips
        </a>
      </div>
    </div>
  </section>
);

const WhyChooseUs = () => {
  const features = [
    { icon: <Shield size={32} />, title: 'Curated Trips', desc: 'Designed around the people travelling, not just places.' },
    { icon: <Briefcase size={32} />, title: 'Corp Expertise', desc: 'Specialized MICE planning for forward-thinking teams.' },
    { icon: <PlaneTakeoff size={32} />, title: 'A-to-Z Planning', desc: 'Transportation, stays, and logistics handled completely.' },
    { icon: <HeartHandshake size={32} />, title: 'Real Support', desc: 'Human assistance before, during, and after your journey.' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-5xl md:text-6xl font-black text-black mb-16 uppercase">Why Travel With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-yellow-50 p-8 rounded-3xl border-4 border-black fun-shadow hover:-translate-y-2 hover:bg-yellow-100 transition-all">
              <div className="w-20 h-20 bg-yellow-400 border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 fun-shadow-sm rotate-3">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">{f.title}</h3>
              <p className="text-black font-bold leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-24 bg-black text-center px-6 border-t-8 border-yellow-400 relative overflow-hidden">
    <div className="max-w-4xl mx-auto relative z-10">
      <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase">
        Where Are We Taking You Next?
      </h2>
      <p className="text-2xl text-yellow-400 font-bold mb-10 max-w-2xl mx-auto">
        Tell us where you want to go. Whether it's a corporate retreat or a weekend escape, we'll take care of the rest.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <a href="#packages" className="px-12 py-6 bg-yellow-400 text-black border-4 border-yellow-400 rounded-full font-black uppercase tracking-widest text-xl hover:bg-white hover:border-white transition-all fun-shadow-hover inline-block">
          Plan My Trip
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black text-white py-16">
    <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="md:col-span-1">
        <div className="font-black text-3xl tracking-tighter bg-yellow-400 text-black inline-block px-3 py-1 border-2 border-black transform -rotate-2 mb-6">
          DO YOU TRAVEL<span className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">.</span>
        </div>
        <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6 uppercase mt-2">
          Creating exceptional travel experiences for companies, teams, students, and groups.
        </p>
      </div>
      
      <div>
        <h4 className="text-yellow-400 font-black uppercase tracking-widest mb-6">Offerings</h4>
        <ul className="space-y-4 font-bold text-sm">
          <li><a href="#mice" className="hover:text-yellow-400 hover:pl-2 transition-all">MICE (Corporate)</a></li>
          <li><a href="#fixed" className="hover:text-yellow-400 hover:pl-2 transition-all">Group Fixed Packages</a></li>
          <li><a href="#packages" className="hover:text-yellow-400 hover:pl-2 transition-all">Student Travel</a></li>
          <li><a href="#packages" className="hover:text-yellow-400 hover:pl-2 transition-all">Custom Itineraries</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-yellow-400 font-black uppercase tracking-widest mb-6">Destinations</h4>
        <ul className="space-y-4 font-bold text-sm">
          <li><a href="#destinations" className="hover:text-yellow-400 hover:pl-2 transition-all">Kashmir</a></li>
          <li><a href="#destinations" className="hover:text-yellow-400 hover:pl-2 transition-all">Dubai</a></li>
          <li><a href="#destinations" className="hover:text-yellow-400 hover:pl-2 transition-all">Bali</a></li>
          <li><a href="#destinations" className="hover:text-yellow-400 hover:pl-2 transition-all">Rajasthan</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-yellow-400 font-black uppercase tracking-widest mb-6">Contact</h4>
        <ul className="space-y-4 font-bold text-sm text-gray-300">
          <li>hello@doyoutravel.com</li>
          <li>+91 98765 43210</li>
          <li>Business Hub, New Delhi, India</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-xs font-bold uppercase tracking-widest border-t-2 border-gray-800 pt-8 text-gray-500">
      © {new Date().getFullYear()} Do You Travel. All rights reserved. Designed to be different.
    </div>
  </footer>
);

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPackages()
      .then((data) => { if (!cancelled) setPackages(data); })
      .catch((err) => { if (!cancelled) setLoadError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-yellow-400 selection:text-black antialiased relative">
      <style>{`
        @keyframes marquee { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        .animate-marquee { 
          display: flex; 
          width: 200%; 
          animation: marquee 20s linear infinite; 
        }
        .fun-shadow { 
          box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); 
        }
        .fun-shadow-sm { 
          box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); 
        }
        .fun-shadow-hover:hover { 
          box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); 
          transform: translate(-2px, -2px); 
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {selectedPackage && (
        <PackageModal data={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}

      {loadError && (
        <div className="fixed top-0 left-0 w-full z-[200] bg-red-500 text-white font-black text-center text-sm py-2 uppercase tracking-wide">
          Couldn't load packages from the server ({loadError}). Is the backend running?
        </div>
      )}

      <Navbar />
      <Hero />
      <MiceSection />
      <GroupFixedSection onSelectPackage={setSelectedPackage} packages={packages} />
      <PackagesSection onSelectPackage={setSelectedPackage} packages={packages} isLoading={isLoading} />
      <DestinationShowcase />
      <VibeGallery />
      <StudentSection />
      <WhyChooseUs />
      <CTASection />
      <Footer />
    </div>
  );
}