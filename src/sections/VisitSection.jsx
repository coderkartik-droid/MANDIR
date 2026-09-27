import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Compass, Car, Train, Plane, Phone, Mail, Navigation, ShieldCheck } from 'lucide-react';
import { templeSchedule, visitGuidelines } from '../data/templeData';

export default function VisitSection() {
  const nearbyAttractions = [
    {
      name: "Maa Bhimeshwari Devi Mandir, Beri",
      dist: "Approx 16 km",
      desc: "Ancient historic Shaktipeeth shrine dedicated to Goddess Bhimeshwari, visited by thousands of pilgrims."
    },
    {
      name: "Pratapgarh Farms & Cultural Village",
      dist: "Approx 22 km",
      desc: "Traditional Haryanvi village heritage experience offering rural arts, camel rides, and folk crafts."
    },
    {
      name: "Bhindawas Bird Sanctuary & Lake",
      dist: "Approx 28 km",
      desc: "Serene freshwater lake and protected bird sanctuary hosting over 250 species of migratory birds."
    }
  ];

  return (
    <section id="visit" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-cinzel text-xs tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span>PILGRIMAGE & DARSHAN GUIDE</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient tracking-wide mb-3">
            Plan Your Sacred Visit
          </h2>

          <p className="font-marcellus text-sm sm:text-base text-sacred-ivory/80 leading-relaxed">
            Welcome to the tranquil sanctum of Ashram Jhadheena. Find comprehensive directions, daily aarti schedules, vehicle parking facilities, and nearby spiritual destinations.
          </p>
        </div>

        {/* Top Grid: Temple Timings & Location Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Temple Aarti Schedule (Left 6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-navy-900 border border-gold-400/40 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-sacred-ivory">
                    Daily Aarti & Darshan Schedule
                  </h3>
                  <span className="font-marcellus text-xs text-sacred-amber">
                    Open all 365 days for devotees
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {templeSchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-navy-950/70 border border-gold-500/15 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-cinzel text-xs sm:text-sm font-bold text-gold-200">
                        {item.name}
                      </h4>
                      <p className="font-marcellus text-[11px] sm:text-xs text-sacred-ivory/60 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <span className="font-cinzel text-xs sm:text-sm font-bold text-sacred-saffron px-3 py-1 rounded-full bg-sacred-saffron/10 border border-sacred-saffron/30 shrink-0 ml-3">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-marcellus text-gold-300/80">
              <span>Temple Gates Open: 04:30 AM</span>
              <span>Sanctum Rest: 09:00 PM</span>
            </div>
          </div>

          {/* Interactive Map & Direct Address (Right 6 cols) */}
          <div className="lg:col-span-6 glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-navy-900 border border-gold-400/40 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-sacred-ivory">
                    Ashram Jhadheena Sanctuary
                  </h3>
                  <span className="font-marcellus text-xs text-sacred-amber">
                    Jhajjar District, Haryana
                  </span>
                </div>
              </div>

              <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/90 mb-4 leading-relaxed">
                <strong>Address:</strong> {visitGuidelines.address}
              </p>

              {/* Stylized Map Viewport */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gold-500/30 bg-navy-950 flex flex-col items-center justify-center p-6 text-center shadow-inner group mb-4">
                {/* Background topographic grid effect */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 border-2 border-gold-400 flex items-center justify-center text-sacred-saffron mb-2 shadow-[0_0_20px_#FFD700]">
                    <MapPin className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-gold-200">
                    Shree Baba Sidhnath Mandir
                  </h4>
                  <span className="font-marcellus text-xs text-sacred-ivory/70">
                    GPS: {visitGuidelines.coordinates}
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Baba Sidhnath Mandir Ashram Jhadheena Jhajjar Haryana")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-cinzel text-[11px] font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all z-20"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>

              {/* Quick Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-marcellus">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950/60 border border-gold-500/20">
                  <Phone className="w-3.5 h-3.5 text-gold-400" />
                  <span>{visitGuidelines.phone}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950/60 border border-gold-500/20">
                  <Mail className="w-3.5 h-3.5 text-gold-400" />
                  <span>{visitGuidelines.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Reach & Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl glass-panel border border-gold-500/20">
            <div className="flex items-center gap-2.5 text-sacred-saffron font-cinzel text-sm font-bold mb-3">
              <Car className="w-4 h-4" />
              <span>BY ROAD</span>
            </div>
            <p className="font-marcellus text-xs text-sacred-ivory/80 leading-relaxed">
              {visitGuidelines.byRoad}
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-gold-500/20">
            <div className="flex items-center gap-2.5 text-sacred-amber font-cinzel text-sm font-bold mb-3">
              <Train className="w-4 h-4" />
              <span>BY TRAIN</span>
            </div>
            <p className="font-marcellus text-xs text-sacred-ivory/80 leading-relaxed">
              {visitGuidelines.byTrain}
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-gold-500/20">
            <div className="flex items-center gap-2.5 text-gold-400 font-cinzel text-sm font-bold mb-3">
              <Plane className="w-4 h-4" />
              <span>BY AIR</span>
            </div>
            <p className="font-marcellus text-xs text-sacred-ivory/80 leading-relaxed">
              {visitGuidelines.byAir}
            </p>
          </div>
        </div>

        {/* Nearby Holy Places & Etiquette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nearby holy spots */}
          <div className="p-6 rounded-2xl glass-panel border border-gold-500/20">
            <h4 className="font-cinzel text-sm font-bold text-gold-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-400" />
              <span>Nearby Spiritual & Cultural Excursions</span>
            </h4>
            <div className="space-y-3">
              {nearbyAttractions.map((spot, i) => (
                <div key={i} className="p-3 rounded-xl bg-navy-950/60 border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-cinzel text-xs font-bold text-sacred-ivory">{spot.name}</span>
                    <span className="text-[10px] text-sacred-amber font-cinzel">{spot.dist}</span>
                  </div>
                  <p className="text-[11px] font-marcellus text-sacred-ivory/70">{spot.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pilgrim Etiquette */}
          <div className="p-6 rounded-2xl glass-panel border border-gold-500/20">
            <h4 className="font-cinzel text-sm font-bold text-gold-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sacred Sanctuary Code of Conduct</span>
            </h4>
            <div className="space-y-2.5">
              {visitGuidelines.etiquette.map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs font-marcellus text-sacred-ivory/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs font-marcellus text-gold-300">
              <strong>Pilgrim Vehicle Parking:</strong> Ample shaded parking available inside the ashram premises free of charge.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
