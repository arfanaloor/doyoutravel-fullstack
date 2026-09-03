import React, { useState, useEffect } from 'react';
import { 
  Menu, X, MapPin, Calendar, ArrowRight, 
  CheckCircle2, Compass, Briefcase, GraduationCap, 
  PlaneTakeoff, Shield, HeartHandshake, Camera, Ticket
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[28px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-[fadeIn_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
        <div className="relative h-64 sm:h-72 shrink-0">
          <img src={resolveImageUrl(data.image)} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
          <div className="absolute top-5 left-5 flex gap-2">
            <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold text-ink shadow-sm">
              {data.category}
            </span>
          </div>
          <button onClick={onClose} className="absolute top-5 right-5 bg-white/95 backdrop-blur rounded-full p-2 text-ink hover:bg-gold transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-ink-soft text-sm font-medium mb-2">
              <Calendar size={16} className="text-gold-dark"/> {data.duration} · {data.region}
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{data.title}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.tags.map(tag => (
               <span key={tag} className="bg-cream text-ink-soft border border-sand px-3 py-1 rounded-full text-xs font-medium">
                 {tag}
               </span>
            ))}
          </div>
          
          <p className="text-ink-soft leading-relaxed border-l-2 border-gold pl-4">
            {data.description && data.description.trim()
              ? data.description
              : 'Get ready for an unforgettable experience. This package is specially curated to provide the perfect balance of adventure, comfort, and culture.'}
          </p>

          {Array.isArray(data.inclusions) && data.inclusions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-ink-soft mb-3">What's included</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.inclusions.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink">
                    <CheckCircle2 size={16} className="text-gold-dark shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-sand mt-auto">
            <div>
              <p className="text-sm text-ink-soft mb-1">Package price</p>
              <p className="font-display text-2xl text-ink">{data.price === 'Custom' ? 'Custom Quote' : `₹${data.price}`}</p>
            </div>
            <a 
              href={`https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(data.title)}%20package.`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gold text-ink rounded-full font-semibold hover:bg-gold-dark transition-colors text-center flex items-center justify-center gap-2 shadow-sm"
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* LOGO - Clicks to scroll to top */}
        <a 
          href="#" 
          onClick={scrollToTop} 
          className={`font-display text-2xl font-medium tracking-tight transition-colors ${isScrolled ? 'text-ink' : 'text-white'}`}
        >
          Do You Travel<span className="text-gold">.</span>
        </a>
        
        {/* Desktop Nav */}
        <div className={`hidden lg:flex items-center gap-10 text-sm font-medium transition-colors ${isScrolled ? 'text-ink' : 'text-white'}`}>
          <a href="#" onClick={scrollToTop} className="hover:text-gold-dark transition-colors">Home</a>
          <a href="#mice" className="hover:text-gold-dark transition-colors flex items-center gap-1.5">MICE <Briefcase size={15} className="text-gold"/></a>
          <a href="#fixed" className="hover:text-gold-dark transition-colors">Group trips</a>
          <a href="#packages" className="hover:text-gold-dark transition-colors">All packages</a>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <a href="#packages" className="px-6 py-2.5 rounded-full font-semibold bg-gold text-ink hover:bg-gold-dark transition-colors inline-block shadow-sm">
            Plan your trip
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`lg:hidden p-2.5 rounded-full transition-colors ${isScrolled ? 'bg-cream text-ink' : 'bg-white/15 backdrop-blur text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-3xl flex flex-col p-6 gap-1 text-ink">
          <a href="#" onClick={(e) => { scrollToTop(e); setIsMobileMenuOpen(false); }} className="py-3 border-b border-sand font-medium">Home</a>
          <a href="#mice" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-sand font-medium flex justify-between items-center">MICE (Corporate) <Briefcase size={18} className="text-gold-dark"/></a>
          <a href="#fixed" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-sand font-medium">Group fixed trips</a>
          <a href="#packages" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-sand font-medium">All packages</a>
          <a href="#packages" onClick={() => setIsMobileMenuOpen(false)} className="bg-gold text-ink rounded-full mt-4 py-3.5 text-center font-semibold">Plan your trip</a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-ink">
      {/* Background image, full bleed */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
          alt="Kashmir Landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
          <MapPin size={16} className="text-gold" /> Destination spotlight
        </div>
        <h1 className="font-display text-6xl md:text-8xl text-white mb-6 leading-[0.95] drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          Kashmir
        </h1>
        <p className="text-lg md:text-xl text-white/85 mb-10 max-w-xl mx-auto leading-relaxed">
          Discover the paradise that keeps calling you back. Curated experiences for teams, groups, and wanderers.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="#packages" className="px-8 py-4 bg-gold text-ink rounded-full font-semibold text-lg hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/20">
            Explore Kashmir <ArrowRight size={20} />
          </a>
        </div>
      </div>

      {/* Scrolling trust strip at bottom */}
      <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur border-t border-sand py-3.5 z-20 overflow-hidden flex">
         <div className="animate-marquee whitespace-nowrap flex items-center font-medium text-sm tracking-wide uppercase text-ink-soft">
            <span className="mx-6">MICE Specialists</span> <span className="text-gold">•</span>
            <span className="mx-6">Group Departures</span> <span className="text-gold">•</span>
            <span className="mx-6">Student Programs</span> <span className="text-gold">•</span>
            <span className="mx-6">MICE Specialists</span> <span className="text-gold">•</span>
            <span className="mx-6">Group Departures</span> <span className="text-gold">•</span>
            <span className="mx-6">Student Programs</span> <span className="text-gold">•</span>
            <span className="mx-6">MICE Specialists</span> <span className="text-gold">•</span>
            <span className="mx-6">Group Departures</span> <span className="text-gold">•</span>
            <span className="mx-6">Student Programs</span> <span className="text-gold">•</span>
         </div>
      </div>
    </section>
  );
};

const MiceSection = () => {
  return (
    <section id="mice" className="py-28 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 text-ink-soft bg-cream border border-sand px-4 py-1.5 rounded-full font-medium text-sm">
            <Briefcase size={16} className="text-gold-dark" /> Corporate travel, specialized
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-ink leading-[1.1]">
            Your team deserves <span className="bg-gold/25 px-2 rounded">more</span>.
          </h2>
          <p className="text-lg text-ink-soft leading-relaxed">
            Turn corporate travel into an experience. We curate extraordinary offsites, incentive trips, and leadership retreats that build culture and inspire teams.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            {['Corporate offsites', 'Incentive trips', 'Dealer meets', 'Annual conferences'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-ink">
                <div className="bg-gold/15 text-gold-dark rounded-full p-1.5"><CheckCircle2 size={18} /></div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <a href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20planning%20a%20MICE%20experience." target="_blank" rel="noreferrer" className="inline-block px-10 py-5 bg-ink text-white rounded-full font-semibold hover:bg-gold hover:text-ink transition-colors text-center shadow-sm">
              Plan a MICE experience
            </a>
          </div>
        </div>

        <div className="lg:w-1/2 relative w-full">
          <div className="relative rounded-[28px] overflow-hidden shadow-xl bg-cream">
            <img 
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Corporate Team Experience" 
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Floating Badge */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur p-6 rounded-2xl max-w-xs shadow-lg">
              <div className="font-display text-4xl text-gold-dark mb-1">500+</div>
              <div className="text-ink-soft text-sm font-medium">Corporate travelers hosted last year globally.</div>
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
    { button: 'bg-cream text-ink group-hover:bg-gold group-hover:text-ink' },
    { button: 'bg-cream text-ink group-hover:bg-gold group-hover:text-ink' }
  ];

  return (
    <section id="fixed" className="py-28 bg-ink text-white relative overflow-hidden border-y border-white/10">
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 text-white bg-white/10 border border-white/15 backdrop-blur px-4 py-1.5 rounded-full font-medium text-sm mb-6">
              <Ticket size={16} className="text-gold" /> Popular with groups
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-white leading-[1.1]">
              Group fixed departures
            </h2>
            <p className="text-lg text-white/70 mt-4 max-w-xl">
              Don't have a corporate team? Join one of our pre-planned group trips. Fixed dates, thoughtful itineraries, and a crew of like-minded travelers.
            </p>
          </div>
          <a href="#packages" className="px-8 py-3.5 border border-white/30 text-white rounded-full font-medium hover:bg-white hover:text-ink transition-colors">
            View calendar
          </a>
        </div>

        {/* Featured Fixed Departures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((pkg, i) => (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="bg-white rounded-3xl p-4 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-center cursor-pointer group"
            >
              <div className="w-full sm:w-2/5 h-48 rounded-2xl overflow-hidden relative">
                <img src={resolveImageUrl(pkg.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={pkg.title} />
                {i === 0 && (
                  <div className="absolute top-3 left-3 bg-gold text-ink font-semibold text-xs px-2.5 py-1 rounded-full">Filling fast</div>
                )}
              </div>
              <div className="w-full sm:w-3/5 text-ink">
                {pkg.featuredDates && (
                  <div className="text-xs font-medium text-ink-soft mb-2">{pkg.featuredDates}</div>
                )}
                <h3 className="font-display text-2xl leading-tight mb-2">{pkg.title}</h3>
                <p className="text-sm text-ink-soft mb-4">{pkg.duration}{pkg.featuredRoute ? ` · ${pkg.featuredRoute}` : ''}</p>
                <div className="flex justify-between items-center">
                  <span className="font-display text-xl text-ink">{pkg.price === 'Custom' ? 'Custom Quote' : `₹${pkg.price}`}</span>
                  <button className={`w-12 h-12 rounded-full flex justify-center items-center transition-colors ${cardStyles[i].button}`}>
                    <ArrowRight size={18} />
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
    className="group bg-white rounded-3xl overflow-hidden shadow-md border border-sand/60 flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={resolveImageUrl(data.image)} 
        alt={data.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-ink shadow-sm">
          {data.region}
        </span>
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {data.tags.map(tag => (
          <span key={tag} className="bg-gold text-ink px-3 py-1.5 rounded-full text-xs font-semibold inline-block text-center shadow-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-2 text-ink-soft text-sm mb-3">
        <Calendar size={16} className="text-gold-dark"/> {data.duration}
      </div>
      
      <h3 className="font-display text-xl text-ink mb-2 leading-snug group-hover:text-gold-dark transition-colors">
        {data.title}
      </h3>
      
      <div className="mt-auto pt-6 flex items-center justify-between border-t border-sand">
        <div>
          <p className="text-xs text-ink-soft mb-1">Starting from</p>
          <p className="font-display text-xl text-ink">{data.price === 'Custom' ? 'Custom Quote' : `₹${data.price}`}</p>
        </div>
        <button className="w-12 h-12 rounded-full bg-cream group-hover:bg-gold flex items-center justify-center transition-colors">
          <ArrowRight size={18} />
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
    <section id="packages" className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-3xl">
            <h2 className="font-display text-5xl md:text-6xl text-ink mb-4">
              Explore all experiences
            </h2>
            <p className="text-lg text-ink-soft">
              Looking for something else? Filter through our wider range of trips below.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-12 bg-white p-1.5 rounded-full shadow-sm border border-sand inline-flex">
          {categories.map((c) => (
            <button 
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === c 
                  ? 'bg-gold text-ink' 
                  : 'bg-transparent text-ink-soft hover:text-ink'
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
            <div className="col-span-full py-16 text-center border border-dashed border-sand rounded-3xl bg-white">
              <Compass size={40} className="mx-auto mb-4 text-gold-dark" />
              <h3 className="text-lg font-medium text-ink-soft">
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
    <section id="destinations" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-5xl md:text-6xl text-ink mb-4">
            Where to next
          </h2>
          <p className="text-lg text-ink-soft">
            Handpicked destinations to create unforgettable memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden shadow-md group cursor-pointer h-[300px] md:h-full">
            <img src={DESTINATIONS[0].image} alt="Kashmir" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="bg-gold text-ink px-3 py-1 rounded-full font-semibold text-xs mb-3 inline-block">Featured</span>
              <h3 className="font-display text-4xl text-white">{DESTINATIONS[0].name}</h3>
            </div>
          </div>
          
          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden shadow-md group cursor-pointer h-[250px] md:h-full">
            <img src={DESTINATIONS[1].image} alt="Dubai" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-sm">
              <h3 className="font-display text-xl text-ink">{DESTINATIONS[1].name}</h3>
            </div>
          </div>
          
          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden shadow-md group cursor-pointer h-[250px] md:h-full">
            <img src={DESTINATIONS[2].image} alt="Bali" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-sm">
              <h3 className="font-display text-xl text-ink">{DESTINATIONS[2].name}</h3>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden shadow-md group cursor-pointer h-[200px] md:h-full">
            <img src={DESTINATIONS[3].image} alt="Thailand" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-sm">
              <h3 className="font-display text-lg text-ink">{DESTINATIONS[3].name}</h3>
            </div>
          </div>

          <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden bg-gold/10 border border-gold/30 group cursor-pointer p-8 flex flex-col justify-center items-center text-center h-[200px] md:h-full transition-colors hover:bg-gold">
             <Compass size={40} className="mb-4 text-gold-dark group-hover:text-ink transition-colors" />
             <h3 className="font-display text-xl text-ink mb-1">View all</h3>
             <span className="text-sm font-medium text-ink-soft group-hover:text-ink transition-colors">Destinations</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const VibeGallery = () => {
  return (
    <section className="py-28 bg-cream border-y border-sand overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16">
        <div className="inline-block bg-white shadow-sm p-3 rounded-2xl mb-6">
          <Camera size={28} className="text-gold-dark" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-ink">Moments from the road</h2>
        <p className="text-lg text-ink-soft mt-4">Snapshots from the trips we've planned.</p>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x hide-scrollbar">
        {[
          { img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Offsite in Goa' },
          { img: 'https://images.unsplash.com/photo-1523480717984-24cba35ae1ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Kashmir crew' },
          { img: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Bali treks' },
          { img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', text: 'Bonfire nights' }
        ].map((item, i) => (
          <div key={i} className="min-w-[280px] md:min-w-[350px] bg-white p-3 pb-8 rounded-2xl shadow-md snap-center">
            <img src={item.img} alt={item.text} className="w-full h-64 object-cover rounded-xl mb-4" />
            <p className="font-display text-lg text-ink text-center">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const StudentSection = () => (
  <section className="py-28 bg-gold relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12">
      <div className="lg:w-1/2">
        <div className="rounded-[28px] overflow-hidden shadow-xl bg-white">
          <img 
            src="https://images.unsplash.com/photo-1527525443983-6e60c75fff50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Student Travel" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="lg:w-1/2 text-ink">
        <div className="inline-flex items-center gap-2 font-medium text-sm mb-6 bg-white/70 backdrop-blur px-4 py-2 rounded-full">
          <GraduationCap size={18} /> University & college programs
        </div>
        <h2 className="font-display text-5xl md:text-6xl mb-6 leading-tight">
          Big trips.<br/>Small budgets.
        </h2>
        <p className="text-lg text-ink/80 mb-8 max-w-lg border-l-2 border-ink/20 pl-4">
          Exclusive group travel packages designed specifically for students and institutions. Affordable, safe, and packed with adventure.
        </p>
        <a href="#packages" className="inline-block px-10 py-5 bg-ink text-white rounded-full font-semibold text-lg hover:bg-white hover:text-ink transition-colors mt-4 text-center shadow-sm">
          Explore student trips
        </a>
      </div>
    </div>
  </section>
);

const WhyChooseUs = () => {
  const features = [
    { icon: <Shield size={28} />, title: 'Curated trips', desc: 'Designed around the people travelling, not just places.' },
    { icon: <Briefcase size={28} />, title: 'Corporate expertise', desc: 'Specialized MICE planning for forward-thinking teams.' },
    { icon: <PlaneTakeoff size={28} />, title: 'A-to-Z planning', desc: 'Transportation, stays, and logistics handled completely.' },
    { icon: <HeartHandshake size={28} />, title: 'Real support', desc: 'Human assistance before, during, and after your journey.' },
  ];

  return (
    <section className="py-28 bg-white text-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="font-display text-5xl md:text-6xl text-ink mb-16">Why travel with us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-cream p-8 rounded-3xl border border-sand hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gold/15 text-gold-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">{f.title}</h3>
              <p className="text-ink-soft leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-28 bg-ink text-center px-6 border-t border-white/10 relative overflow-hidden">
    <div className="max-w-4xl mx-auto relative z-10">
      <h2 className="font-display text-5xl md:text-7xl text-white leading-tight mb-6">
        Where are we taking you next?
      </h2>
      <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
        Tell us where you want to go. Whether it's a corporate retreat or a weekend escape, we'll take care of the rest.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <a href="#packages" className="px-10 py-5 bg-gold text-ink rounded-full font-semibold text-lg hover:bg-white transition-colors inline-block shadow-lg shadow-gold/20">
          Plan my trip
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-ink text-white/70 py-16">
    <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="md:col-span-1">
        <div className="font-display text-2xl text-white mb-6">
          Do You Travel<span className="text-gold">.</span>
        </div>
        <p className="text-sm leading-relaxed mb-6">
          Creating exceptional travel experiences for companies, teams, students, and groups.
        </p>
      </div>
      
      <div>
        <h4 className="text-white font-semibold text-sm mb-6">Offerings</h4>
        <ul className="space-y-4 text-sm">
          <li><a href="#mice" className="hover:text-gold transition-colors">MICE (Corporate)</a></li>
          <li><a href="#fixed" className="hover:text-gold transition-colors">Group fixed packages</a></li>
          <li><a href="#packages" className="hover:text-gold transition-colors">Student travel</a></li>
          <li><a href="#packages" className="hover:text-gold transition-colors">Custom itineraries</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold text-sm mb-6">Destinations</h4>
        <ul className="space-y-4 text-sm">
          <li><a href="#destinations" className="hover:text-gold transition-colors">Kashmir</a></li>
          <li><a href="#destinations" className="hover:text-gold transition-colors">Dubai</a></li>
          <li><a href="#destinations" className="hover:text-gold transition-colors">Bali</a></li>
          <li><a href="#destinations" className="hover:text-gold transition-colors">Rajasthan</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold text-sm mb-6">Contact</h4>
        <ul className="space-y-4 text-sm">
          <li>hello@doyoutravel.com</li>
          <li>+91 98765 43210</li>
          <li>Business Hub, New Delhi, India</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-xs border-t border-white/10 pt-8 text-white/40">
      © {new Date().getFullYear()} Do You Travel. All rights reserved.
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
    <div className="min-h-screen bg-white font-sans text-ink selection:bg-gold selection:text-ink antialiased relative">
      <style>{`
        @keyframes marquee { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        .animate-marquee { 
          display: flex; 
          width: 200%; 
          animation: marquee 30s linear infinite; 
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
        <div className="fixed top-0 left-0 w-full z-[200] bg-red-500 text-white text-center text-sm py-2 font-medium">
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
