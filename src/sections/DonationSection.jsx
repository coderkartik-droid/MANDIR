import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, QrCode, Copy, Check, Sparkles, Building, Landmark, Utensils, BookOpen, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { donationCauses, visitGuidelines } from '../data/templeData';
import { soundEngine } from '../utils/audioEngine';

export default function DonationSection() {
  const [selectedCause, setSelectedCause] = useState(donationCauses[0]);
  const [customAmount, setCustomAmount] = useState('1100');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(visitGuidelines.upiId);
    setCopiedUpi(true);
    soundEngine.ringTempleBell(0.3, 1.4);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    setShowQrModal(true);
    soundEngine.ringTempleBell(0.8, 1.1);
  };

  const confirmDonation = () => {
    setShowQrModal(false);
    setIsCompleted(true);
    soundEngine.ringTempleBell(1.0, 1.0);
    try {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF9E2C', '#FFFFFF', '#D4AF37'],
      });
    } catch {}
  };

  const causeIcons = {
    Utensils: <Utensils className="w-5 h-5 text-sacred-amber" />,
    Heart: <Heart className="w-5 h-5 text-red-400" />,
    Landmark: <Landmark className="w-5 h-5 text-gold-400" />,
    BookOpen: <BookOpen className="w-5 h-5 text-blue-400" />,
  };

  return (
    <section id="seva" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-cinzel text-xs tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5 text-sacred-saffron" />
            <span>SACRED SEVA & CHARITABLE OFFERINGS</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient tracking-wide mb-3">
            Support the Ashram Mandir Seva
          </h2>

          <p className="font-marcellus text-sm sm:text-base text-sacred-ivory/80 leading-relaxed">
            Your sacred contributions fuel continuous langar for the hungry, shelter for indigenous cows, fine marble stonework for the mandir, and spiritual education for rural youth.
          </p>
        </div>

        {/* Cause Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {donationCauses.map((cause) => {
            const isSelected = selectedCause.id === cause.id;

            return (
              <div
                key={cause.id}
                onClick={() => {
                  setSelectedCause(cause);
                  setCustomAmount(String(cause.suggestedAmounts[2] || 1100));
                  soundEngine.ringTempleBell(0.25, 1.2);
                }}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'glass-panel-gold border-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.3)] scale-[1.02]'
                    : 'glass-panel border-gold-500/20 hover:border-gold-500/50 hover:bg-navy-900/60'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-center mb-4">
                    {causeIcons[cause.icon] || <Sparkles className="w-5 h-5 text-gold-400" />}
                  </div>
                  <span className="font-sanskrit text-xs text-gold-400 block mb-1">
                    {cause.hindi}
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-sacred-ivory mb-2">
                    {cause.title}
                  </h3>
                  <p className="font-marcellus text-xs text-sacred-ivory/70 leading-relaxed">
                    {cause.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-cinzel text-gold-300">
                  <span>Selected Cause</span>
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gold-400' : 'bg-transparent'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Donation Amount & Payment Console */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-10 border border-gold-500/40 relative shadow-2xl mb-12">
          <div className="ornate-corner-tl" />
          <div className="ornate-corner-tr" />
          <div className="ornate-corner-bl" />
          <div className="ornate-corner-br" />

          <div className="max-w-2xl mx-auto text-center">
            <span className="font-cinzel text-xs text-sacred-amber uppercase tracking-widest block mb-2">
              Offering for: {selectedCause.title}
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient mb-6">
              Select or Enter Sacred Seva Amount
            </h3>

            {/* Suggested Amounts Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {selectedCause.suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCustomAmount(String(amt))}
                  className={`px-5 py-2 rounded-xl font-cinzel text-sm tracking-wider transition-all ${
                    customAmount === String(amt)
                      ? 'bg-gold-500 text-navy-950 font-bold shadow-[0_0_15px_#FFD700]'
                      : 'bg-navy-900 border border-gold-500/30 text-sacred-ivory hover:border-gold-400'
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Amount Field */}
            <div className="relative max-w-xs mx-auto mb-8">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-cinzel text-xl text-gold-400 font-bold">
                ₹
              </span>
              <input
                type="number"
                min="11"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950/80 border border-gold-400/50 text-center font-cinzel text-xl text-gold-200 focus:outline-none focus:border-gold-300"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDonateSubmit}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-sacred-amber text-navy-950 font-cinzel font-bold text-xs sm:text-sm tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>GENERATE SEVA QR CODE</span>
              </button>

              <button
                onClick={handleCopyUpi}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-navy-900 border border-gold-500/30 text-sacred-ivory hover:text-gold-300 font-cinzel text-xs tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold-400" />}
                <span>{copiedUpi ? 'UPI ID COPIED!' : `COPY UPI: ${visitGuidelines.upiId}`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bank Wire Details Placeholder Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-marcellus text-sacred-ivory/80">
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-gold-500/20">
            <span className="font-cinzel text-xs text-gold-400 block mb-1">TRUST BENEFICIARY</span>
            <p className="font-bold text-sacred-ivory text-sm">Shree Baba Sidhnath Mandir Trust</p>
            <p className="text-sacred-ivory/60 mt-1">Ashram Jhadheena, Jhajjar, Haryana</p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/60 border border-gold-500/20">
            <span className="font-cinzel text-xs text-gold-400 block mb-1">BANK & ACCOUNT</span>
            <p className="font-bold text-sacred-ivory text-sm">State Bank of India (SBI)</p>
            <p className="text-sacred-ivory/60 mt-1">A/C: 398200192837 (Placeholder)</p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/60 border border-gold-500/20">
            <span className="font-cinzel text-xs text-gold-400 block mb-1">IFSC CODE & BRANCH</span>
            <p className="font-bold text-sacred-ivory text-sm">IFSC: SBIN0001234 (Placeholder)</p>
            <p className="text-sacred-ivory/60 mt-1">Branch: Jhadheena / Jhajjar Central</p>
          </div>
        </div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQrModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
              onClick={() => setShowQrModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-sm w-full bg-navy-900 border border-gold-400 rounded-3xl p-6 sm:p-8 text-center text-sacred-ivory shadow-[0_0_50px_rgba(212,175,55,0.4)]"
              >
                <div className="ornate-corner-tl" />
                <div className="ornate-corner-tr" />
                <div className="ornate-corner-bl" />
                <div className="ornate-corner-br" />

                <span className="font-sanskrit text-gold-400 text-sm block mb-1">
                  श्री बाबा सिद्धनाथ मंदिर न्यास
                </span>
                <h3 className="font-cinzel text-lg font-bold text-gold-gradient mb-1">
                  Sacred Seva Offering
                </h3>
                <p className="text-xs text-sacred-ivory/70 mb-4">
                  Offering amount: <strong className="text-gold-300">₹{Number(customAmount).toLocaleString()}</strong>
                </p>

                {/* Stylized QR Code SVG Box */}
                <div className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl border-2 border-gold-400 flex flex-col items-center justify-center shadow-lg relative mb-4">
                  {/* Decorative QR code graphic representation */}
                  <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2 bg-navy-950 rounded-xl">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (i % 2 === 0 || i % 5 === 0) ? 'bg-gold-400' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Center Sacred Om Emblem in QR */}
                  <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-navy-950 border border-gold-400 flex items-center justify-center text-gold-300 font-cinzel text-lg font-bold shadow-md">
                    ॐ
                  </div>
                </div>

                <p className="text-xs font-marcellus text-gold-300/80 mb-6">
                  Scan via any UPI App (GPay, PhonePe, Paytm, BHIM)
                </p>

                <div className="space-y-2">
                  <button
                    onClick={confirmDonation}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-sacred-amber text-navy-950 font-cinzel text-xs font-bold tracking-widest hover:brightness-110 transition-all uppercase"
                  >
                    I HAVE COMPLETED OFFERING
                  </button>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="w-full py-2 rounded-xl text-sacred-ivory/60 hover:text-sacred-ivory text-xs font-marcellus"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Toast / Modal */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setIsCompleted(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-md w-full parchment-card rounded-3xl p-8 border border-gold-400 text-center shadow-2xl"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center mb-4">
                  <Check className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-gold-gradient mb-2">
                  दानम् परमं पुण्यम्
                </h3>
                <p className="font-marcellus text-sm text-sacred-ivory/90 leading-relaxed mb-6">
                  Your divine seva offering has been recorded with deepest gratitude. May the blessings of Shree Baba Sidhnath Ji eternally illuminate your home and lineage.
                </p>
                <button
                  onClick={() => setIsCompleted(false)}
                  className="px-6 py-2 rounded-full bg-gold-500 text-navy-950 font-cinzel text-xs font-bold"
                >
                  Close & Continue
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
