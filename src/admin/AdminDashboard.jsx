import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, Home, BookOpen, Sparkles, Image, Video, Music, MapPin,
  Phone, Share2, ImagePlus, Palette, Wand2, X, Upload, Download,
  LogOut, Circle, Plus, Trash2, Eye, EyeOff, Save, RotateCcw,
  Check, AlertCircle, GripVertical, ChevronDown, ChevronUp, Grid3x3,
  Link, Clock, User, Mail, Globe, Map as MapIcon, Compass, Car,
  Train, Plane, ShieldCheck
} from 'lucide-react';
import MediaUpload from './MediaUpload';
import { exportContentToZip, importContentFromZip } from './zipUtils';
import { useAdmin } from './AdminContext';

const SIDEBAR_SECTIONS = [
  { id: 'temple', label: 'Temple Information', icon: Landmark },
  { id: 'home', label: 'Home Page', icon: Home },
  { id: 'history', label: 'History', icon: BookOpen },
  { id: 'festivals', label: 'Festivals', icon: Sparkles },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'maps', label: 'Maps', icon: MapPin },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'images', label: 'Images', icon: ImagePlus },
  { id: 'theme', label: 'Theme Colors', icon: Palette },
  { id: 'animations', label: 'Animation Settings', icon: Wand2 },
];

function OrnatePanel({ children, className = '' }) {
  return (
    <div className={`relative glass-panel backdrop-blur-xl border border-gold-500/40 rounded-2xl ${className}`}>
      <div className="ornate-corner-tl" />
      <div className="ornate-corner-tr" />
      <div className="ornate-corner-bl" />
      <div className="ornate-corner-br" />
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="font-cinzel text-[11px] uppercase tracking-[0.15em] text-gold-300 mb-2 block">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <div className={`rounded-xl bg-navy-900/70 border border-gold-500/30 focus-within:border-gold-400 focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all px-4 py-3 ${className}`}>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sacred-ivory font-marcellus placeholder-sacred-ivory/30"
      />
    </div>
  );
}

function NumberInput({ value, onChange, placeholder, min, max, className = '' }) {
  return (
    <div className={`rounded-xl bg-navy-900/70 border border-gold-500/30 focus-within:border-gold-400 focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all px-4 py-3 ${className}`}>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value === '' ? '' : Number(e.target.value);
          onChange(val);
        }}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full bg-transparent outline-none text-sacred-ivory font-marcellus placeholder-sacred-ivory/30"
      />
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4, className = '' }) {
  return (
    <div className={`rounded-xl bg-navy-900/70 border border-gold-500/30 focus-within:border-gold-400 focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all px-4 py-3 ${className}`}>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent outline-none text-sacred-ivory font-marcellus placeholder-sacred-ivory/30 resize-y min-h-[80px]"
      />
    </div>
  );
}

function SelectInput({ value, onChange, options, className = '' }) {
  return (
    <div className={`rounded-xl bg-navy-900/70 border border-gold-500/30 focus-within:border-gold-400 focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all px-4 py-3 ${className}`}>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none text-sacred-ivory font-marcellus"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-navy-900 text-sacred-ivory">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorInput({ value, onChange, className = '' }) {
  const [hex, setHex] = useState(value || '#000000');
  useEffect(() => { setHex(value || '#000000'); }, [value]);
  return (
    <div className={`flex items-center gap-3 rounded-xl bg-navy-900/70 border border-gold-500/30 focus-within:border-gold-400 focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all px-3 py-2 ${className}`}>
      <div className="relative shrink-0">
        <input
          type="color"
          value={hex}
          onChange={(e) => { setHex(e.target.value); onChange(e.target.value); }}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gold-500/40 bg-transparent"
        />
      </div>
      <input
        type="text"
        value={hex}
        onChange={(e) => {
          const v = e.target.value;
          setHex(v);
          if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
        }}
        className="flex-1 bg-transparent outline-none text-sacred-ivory font-marcellus text-sm uppercase tracking-wider"
      />
    </div>
  );
}

function ToggleSwitch({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900/50 border border-gold-500/20 hover:border-gold-500/30 transition-all">
      <span className="font-marcellus text-sm text-sacred-ivory/90">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          value ? 'bg-gradient-to-r from-gold-400 to-gold-600 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-navy-800 border border-gold-500/20'
        }`}
      >
        <motion.div
          animate={{ x: value ? 30 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );
}

function ListEditor({ items, onChange, placeholder = 'Enter item...' }) {
  const arr = Array.isArray(items) ? items : [];
  const updateItem = (idx, val) => {
    const next = [...arr];
    next[idx] = val;
    onChange(next);
  };
  const addItem = () => onChange([...arr, '']);
  const removeItem = (idx) => {
    const next = arr.filter((_, i) => i !== idx);
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {arr.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="flex-1 rounded-xl bg-navy-900/70 border border-gold-500/30 focus-within:border-gold-400 focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all px-4 py-2">
            <input
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-sacred-ivory font-marcellus text-sm placeholder-sacred-ivory/30"
            />
          </div>
          <button
            onClick={() => removeItem(idx)}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900/50 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-gold-200 transition-all font-cinzel text-xs tracking-wider"
      >
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    </div>
  );
}

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-500/40 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gold-400" />
      </div>
      <h2 className="font-cinzel text-xl text-gold-gradient uppercase tracking-wider">{title}</h2>
    </div>
  );
}

function TempleEditor() {
  const admin = useAdmin();
  const t = admin.content.temple;
  const update = (key, val) => admin.updateContent('temple', { ...t, [key]: val });

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={Landmark} title="Temple Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div><FieldLabel>Temple Name</FieldLabel><TextInput value={t.name} onChange={(v) => update('name', v)} placeholder="Shree Baba Sidhnath Mandir" /></div>
        <div><FieldLabel>Hindi Name (हिन्दी नाम)</FieldLabel><TextInput value={t.hindiName} onChange={(v) => update('hindiName', v)} placeholder="श्री बाबा सिद्धनाथ मंदिर" /></div>
        <div><FieldLabel>Subtitle</FieldLabel><TextInput value={t.subTitle} onChange={(v) => update('subTitle', v)} placeholder="Ashram Jhadheena" /></div>
        <div><FieldLabel>Tagline</FieldLabel><TextInput value={t.tagline} onChange={(v) => update('tagline', v)} placeholder="Where Ancient Silence Meets Divine Grace" /></div>
        <div className="md:col-span-2"><FieldLabel>Mantra (मन्त्र)</FieldLabel><TextInput value={t.mantra} onChange={(v) => update('mantra', v)} placeholder="ॐ सिद्धनाथाय नमः" /></div>
        <div className="md:col-span-2"><FieldLabel>Description</FieldLabel><TextArea value={t.description} onChange={(v) => update('description', v)} rows={4} placeholder="Temple description..." /></div>
        <div><FieldLabel>Location</FieldLabel><TextInput value={t.location} onChange={(v) => update('location', v)} placeholder="Ashram Jhadheena, Haryana" /></div>
        <div><FieldLabel>Established</FieldLabel><TextInput value={t.established} onChange={(v) => update('established', v)} placeholder="Centuries of Siddha Tradition" /></div>
        <div><FieldLabel>Presiding Deity</FieldLabel><TextInput value={t.deity} onChange={(v) => update('deity', v)} placeholder="Shree Baba Sidhnath Ji & Lord Shiva" /></div>
        <div><FieldLabel>Founder</FieldLabel><TextInput value={t.founder} onChange={(v) => update('founder', v)} placeholder="Shree Baba Sidhnath Ji" /></div>
        <div><FieldLabel>Temple Timings</FieldLabel><TextInput value={t.templeTimings} onChange={(v) => update('templeTimings', v)} placeholder="05:00 AM – 09:00 PM" /></div>
        <div className="md:col-span-2"><FieldLabel>Special Notes</FieldLabel><TextArea value={t.specialNotes} onChange={(v) => update('specialNotes', v)} rows={3} placeholder="Important notes for visitors..." /></div>
        <div className="md:col-span-2"><FieldLabel>Temple History (मंदिर का इतिहास)</FieldLabel><TextArea value={t.templeHistory} onChange={(v) => update('templeHistory', v)} rows={6} placeholder="Full temple history..." /></div>
        <div className="md:col-span-2"><FieldLabel>About Temple (परिचय)</FieldLabel><TextArea value={t.aboutTemple} onChange={(v) => update('aboutTemple', v)} rows={6} placeholder="About the temple..." /></div>
      </div>
    </OrnatePanel>
  );
}

function HomeEditor() {
  const admin = useAdmin();
  const h = admin.content.home;
  const update = (key, val) => admin.updateContent('home', { ...h, [key]: val });

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={Home} title="Home Page Settings" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2"><FieldLabel>Hero Title</FieldLabel><TextInput value={h.heroTitle} onChange={(v) => update('heroTitle', v)} placeholder="SHREE BABA SIDHNATH" /></div>
        <div className="md:col-span-2"><FieldLabel>Hero Subtitle</FieldLabel><TextInput value={h.heroSubtitle} onChange={(v) => update('heroSubtitle', v)} placeholder="Ashram Jhadheena" /></div>
        <div className="md:col-span-2"><FieldLabel>Hero Description</FieldLabel><TextArea value={h.heroDescription} onChange={(v) => update('heroDescription', v)} rows={4} placeholder="Hero section description..." /></div>
        <div className="md:col-span-2"><FieldLabel>Welcome Text</FieldLabel><TextArea value={h.welcomeText} onChange={(v) => update('welcomeText', v)} rows={5} placeholder="Welcome message..." /></div>
        <div><FieldLabel>CTA Button Text</FieldLabel><TextInput value={h.buttonText} onChange={(v) => update('buttonText', v)} placeholder="ENTER SACRED TEMPLE" /></div>
        <div><FieldLabel>CTA Button Link</FieldLabel><TextInput value={h.buttonLink} onChange={(v) => update('buttonLink', v)} placeholder="#sanctuary" /></div>
      </div>
    </OrnatePanel>
  );
}

function HistoryEditor() {
  const admin = useAdmin();
  const t = admin.content.temple;
  const events = Array.isArray(t.timelineEvents) ? t.timelineEvents : [];

  const updateEvent = (idx, updates) => {
    const next = events.map((e, i) => i === idx ? { ...e, ...updates } : e);
    admin.updateContent('temple', { ...t, timelineEvents: next });
  };
  const addEvent = () => {
    const next = [...events, { era: '', year: '', title: '', sanskritTitle: '', description: '', significance: '' }];
    admin.updateContent('temple', { ...t, timelineEvents: next });
  };
  const deleteEvent = (idx) => {
    const next = events.filter((_, i) => i !== idx);
    admin.updateContent('temple', { ...t, timelineEvents: next });
  };

  return (
    <OrnatePanel className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeading icon={BookOpen} title="Temple History Timeline" />
        <button onClick={addEvent} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-cinzel text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> Add New Event
        </button>
      </div>
      <div className="space-y-5">
        {events.map((event, idx) => (
          <div key={idx} className="relative glass-panel-dark border border-gold-500/30 rounded-2xl p-6">
            <div className="ornate-corner-tl" />
            <div className="ornate-corner-tr" />
            <div className="ornate-corner-bl" />
            <div className="ornate-corner-br" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/30 to-navy-900 border border-gold-500/50 flex items-center justify-center font-cinzel text-gold-400 font-bold">{idx + 1}</div>
                <span className="font-cinzel text-sm tracking-wider text-gold-300 uppercase">Timeline Event</span>
              </div>
              <button onClick={() => deleteEvent(idx)} className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><FieldLabel>Era</FieldLabel><TextInput value={event.era} onChange={(v) => updateEvent(idx, { era: v })} placeholder="Ancient Era" /></div>
              <div><FieldLabel>Year / Period</FieldLabel><TextInput value={event.year} onChange={(v) => updateEvent(idx, { year: v })} placeholder="Siddha Tapobhumi" /></div>
              <div className="md:col-span-2"><FieldLabel>Title</FieldLabel><TextInput value={event.title} onChange={(v) => updateEvent(idx, { title: v })} placeholder="Event title..." /></div>
              <div className="md:col-span-2"><FieldLabel>Sanskrit Title (संस्कृत हिन्दी)</FieldLabel><TextInput value={event.sanskritTitle} onChange={(v) => updateEvent(idx, { sanskritTitle: v })} placeholder="संस्कृत शीर्षक" /></div>
              <div className="md:col-span-2"><FieldLabel>Description</FieldLabel><TextArea value={event.description} onChange={(v) => updateEvent(idx, { description: v })} rows={4} placeholder="Full event description..." /></div>
              <div className="md:col-span-2"><FieldLabel>Significance</FieldLabel><TextInput value={event.significance} onChange={(v) => updateEvent(idx, { significance: v })} placeholder="Why this event matters..." /></div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gold-500/20 rounded-2xl">
            <BookOpen className="w-12 h-12 text-gold-500/40 mx-auto mb-3" />
            <p className="font-marcellus text-sacred-ivory/50">No timeline events yet. Add your first event.</p>
          </div>
        )}
      </div>
    </OrnatePanel>
  );
}

function FestivalsEditor() {
  const admin = useAdmin();
  const col = admin.content.festivals;
  const items = Array.isArray(col.items) ? col.items : [];

  const updateItem = (id, updates) => {
    const item = items.find((i) => i.id === id);
    if (item) admin.updateListItem('festivals', id, { ...item, ...updates });
  };
  const updateRituals = (id, rituals) => updateItem(id, { rituals });
  const addItem = () => {
    const id = `festival-${Date.now()}`;
    admin.addListItem('festivals', { id, name: '', hindi: '', month: '', tag: '', color: 'from-gold-500/20 to-navy-900', border: 'border-gold-500/40', description: '', rituals: [], order: items.length + 1 });
  };
  const removeItem = (id) => admin.removeListItem('festivals', id);

  return (
    <OrnatePanel className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeading icon={Sparkles} title="Festivals & Celebrations" />
        <button onClick={addItem} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-cinzel text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> Add New Festival
        </button>
      </div>
      <div className="space-y-5">
        {items.map((f) => (
          <div key={f.id} className="relative glass-panel-dark border border-gold-500/30 rounded-2xl p-6">
            <div className="ornate-corner-tl" />
            <div className="ornate-corner-tr" />
            <div className="ornate-corner-bl" />
            <div className="ornate-corner-br" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sacred-saffron/30 to-navy-900 border border-sacred-saffron/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-sacred-amber" />
                </div>
                <span className="font-cinzel text-sm tracking-wider text-gold-300 uppercase">{f.name || 'New Festival'}</span>
              </div>
              <button onClick={() => removeItem(f.id)} className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><FieldLabel>Festival Name</FieldLabel><TextInput value={f.name} onChange={(v) => updateItem(f.id, { name: v })} placeholder="Maha Shivratri" /></div>
              <div><FieldLabel>Hindi Name (हिन्दी)</FieldLabel><TextInput value={f.hindi} onChange={(v) => updateItem(f.id, { hindi: v })} placeholder="महाशिवरात्रि" /></div>
              <div><FieldLabel>Month / Season</FieldLabel><TextInput value={f.month} onChange={(v) => updateItem(f.id, { month: v })} placeholder="Phalguna (Feb - Mar)" /></div>
              <div><FieldLabel>Tagline</FieldLabel><TextInput value={f.tag} onChange={(v) => updateItem(f.id, { tag: v })} placeholder="Supreme Night of Shiva" /></div>
              <div><FieldLabel>Color Gradient Class</FieldLabel><TextInput value={f.color} onChange={(v) => updateItem(f.id, { color: v })} placeholder="from-amber-500/20 to-navy-900" /></div>
              <div><FieldLabel>Border Class</FieldLabel><TextInput value={f.border} onChange={(v) => updateItem(f.id, { border: v })} placeholder="border-amber-500/40" /></div>
              <div><FieldLabel>Display Order</FieldLabel><NumberInput value={f.order} onChange={(v) => updateItem(f.id, { order: v })} /></div>
              <div className="md:col-span-2"><FieldLabel>Description</FieldLabel><TextArea value={f.description} onChange={(v) => updateItem(f.id, { description: v })} rows={4} placeholder="Festival description..." /></div>
              <div className="md:col-span-2">
                <FieldLabel>Rituals & Traditions</FieldLabel>
                <ListEditor items={f.rituals} onChange={(v) => updateRituals(f.id, v)} placeholder="Enter a ritual or tradition..." />
              </div>
            </div>
          </div>
        ))}
      </div>
    </OrnatePanel>
  );
}

function GalleryEditor() {
  const admin = useAdmin();
  const col = admin.content.gallery;
  const items = Array.isArray(col.items) ? col.items : [];

  const updateItem = (id, updates) => {
    const item = items.find((i) => i.id === id);
    if (item) admin.updateListItem('gallery', id, { ...item, ...updates });
  };
  const updateHighlights = (id, highlights) => updateItem(id, { highlights });
  const addItem = () => {
    const id = (items.reduce((m, i) => Math.max(m, typeof i.id === 'number' ? i.id : 0), 0) || 0) + 1;
    admin.addListItem('gallery', { id, title: '', subTitle: '', category: 'Architecture', src: '', description: '', aspect: 'landscape', order: items.length + 1, highlights: [] });
  };
  const removeItem = (id) => admin.removeListItem('gallery', id);

  return (
    <OrnatePanel className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeading icon={Image} title="Gallery Collection" />
        <button onClick={addItem} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-cinzel text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> Add New Image
        </button>
      </div>
      <div className="space-y-5">
        {items.map((g) => (
          <div key={g.id} className="relative glass-panel-dark border border-gold-500/30 rounded-2xl p-6">
            <div className="ornate-corner-tl" />
            <div className="ornate-corner-tr" />
            <div className="ornate-corner-bl" />
            <div className="ornate-corner-br" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-500/40 flex items-center justify-center">
                  <Grid3x3 className="w-5 h-5 text-gold-400" />
                </div>
                <span className="font-cinzel text-sm tracking-wider text-gold-300 uppercase">{g.title || 'Gallery Image'} #{g.id}</span>
              </div>
              <button onClick={() => removeItem(g.id)} className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <MediaUpload
                  category="Gallery Image"
                  accept="image/*"
                  currentValue={g.src}
                  onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateItem(g.id, { src: name }); }}
                  onRemove={() => updateItem(g.id, { src: '' })}
                  onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateItem(g.id, { src: name }); }}
                />
              </div>
              <div><FieldLabel>Title</FieldLabel><TextInput value={g.title} onChange={(v) => updateItem(g.id, { title: v })} placeholder="The Royal Archway" /></div>
              <div><FieldLabel>Subtitle</FieldLabel><TextInput value={g.subTitle} onChange={(v) => updateItem(g.id, { subTitle: v })} placeholder="Swarna Dwar" /></div>
              <div>
                <FieldLabel>Category</FieldLabel>
                <SelectInput value={g.category} onChange={(v) => updateItem(g.id, { category: v })} options={[
                  { value: 'Architecture', label: 'Architecture' },
                  { value: 'Sacred Nature', label: 'Sacred Nature' },
                  { value: 'Spiritual Grove', label: 'Spiritual Grove' },
                  { value: 'Heritage', label: 'Heritage' },
                ]} />
              </div>
              <div>
                <FieldLabel>Aspect Ratio</FieldLabel>
                <SelectInput value={g.aspect} onChange={(v) => updateItem(g.id, { aspect: v })} options={[
                  { value: 'landscape', label: 'Landscape (16:9)' },
                  { value: 'portrait', label: 'Portrait (9:16)' },
                  { value: 'square', label: 'Square (1:1)' },
                ]} />
              </div>
              <div><FieldLabel>Display Order</FieldLabel><NumberInput value={g.order} onChange={(v) => updateItem(g.id, { order: v })} /></div>
              <div className="lg:col-span-2"><FieldLabel>Description</FieldLabel><TextArea value={g.description} onChange={(v) => updateItem(g.id, { description: v })} rows={3} placeholder="Image description..." /></div>
              <div className="lg:col-span-2">
                <FieldLabel>Highlights</FieldLabel>
                <ListEditor items={g.highlights} onChange={(v) => updateHighlights(g.id, v)} placeholder="Enter a highlight..." />
              </div>
            </div>
          </div>
        ))}
      </div>
    </OrnatePanel>
  );
}

function VideosEditor() {
  const admin = useAdmin();
  const col = admin.content.videos;
  const items = Array.isArray(col.items) ? col.items : [];

  const updateItem = (idx, updates) => {
    const next = items.map((i, k) => k === idx ? { ...i, ...updates } : i);
    admin.updateContent('videos', { ...col, items: next });
  };
  const addItem = () => {
    const id = `video-${Date.now()}`;
    admin.updateContent('videos', { ...col, items: [...items, { id, title: '', src: '', thumbnail: '', duration: '', resolution: '', fileSize: '', description: '', order: items.length + 1 }] });
  };
  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    admin.updateContent('videos', { ...col, items: next });
  };

  return (
    <OrnatePanel className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeading icon={Video} title="Video Collection" />
        <button onClick={addItem} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-cinzel text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> Add New Video
        </button>
      </div>
      <div className="space-y-5">
        {items.map((v, idx) => (
          <div key={v.id || idx} className="relative glass-panel-dark border border-gold-500/30 rounded-2xl p-6">
            <div className="ornate-corner-tl" />
            <div className="ornate-corner-tr" />
            <div className="ornate-corner-bl" />
            <div className="ornate-corner-br" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-500/40 flex items-center justify-center">
                  <Video className="w-5 h-5 text-gold-400" />
                </div>
                <span className="font-cinzel text-sm tracking-wider text-gold-300 uppercase">{v.title || 'New Video'}</span>
              </div>
              <button onClick={() => removeItem(idx)} className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><FieldLabel>Title</FieldLabel><TextInput value={v.title} onChange={(val) => updateItem(idx, { title: val })} placeholder="Video title..." /></div>
              <div className="md:col-span-2"><FieldLabel>Video Source (URL or Path)</FieldLabel><TextInput value={v.src} onChange={(val) => updateItem(idx, { src: val })} placeholder="https://youtu.be/... or /videos/file.mp4" /></div>
              <div className="md:col-span-2">
                <MediaUpload
                  category="Video Thumbnail"
                  accept="image/*"
                  currentValue={v.thumbnail}
                  onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateItem(idx, { thumbnail: name }); }}
                  onRemove={() => updateItem(idx, { thumbnail: '' })}
                  onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateItem(idx, { thumbnail: name }); }}
                />
              </div>
              <div><FieldLabel>Duration</FieldLabel><TextInput value={v.duration} onChange={(val) => updateItem(idx, { duration: val })} placeholder="12:34" /></div>
              <div><FieldLabel>Resolution</FieldLabel><TextInput value={v.resolution} onChange={(val) => updateItem(idx, { resolution: val })} placeholder="1920x1080 / 4K" /></div>
              <div><FieldLabel>File Size</FieldLabel><TextInput value={v.fileSize} onChange={(val) => updateItem(idx, { fileSize: val })} placeholder="45.2 MB" /></div>
              <div><FieldLabel>Display Order</FieldLabel><NumberInput value={v.order} onChange={(val) => updateItem(idx, { order: val })} /></div>
              <div className="md:col-span-2"><FieldLabel>Description</FieldLabel><TextArea value={v.description} onChange={(val) => updateItem(idx, { description: val })} rows={3} placeholder="Video description..." /></div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gold-500/20 rounded-2xl">
            <Video className="w-12 h-12 text-gold-500/40 mx-auto mb-3" />
            <p className="font-marcellus text-sacred-ivory/50">No videos yet. Add your first video.</p>
          </div>
        )}
      </div>
    </OrnatePanel>
  );
}

function MusicEditor() {
  const admin = useAdmin();
  const col = admin.content.music;
  const items = Array.isArray(col.items) ? col.items : [];

  const updateItem = (id, updates) => {
    const item = items.find((i) => i.id === id);
    if (item) admin.updateListItem('music', id, { ...item, ...updates });
  };
  const addItem = () => {
    const id = `music-${Date.now()}`;
    admin.addListItem('music', { id, title: '', hindi: '', category: '', src: '', duration: '', durationSec: 0, fileSize: '', bitrate: '', format: 'MP3', symbol: '🎵', tag: '', description: '', color: '#D4AF37', order: items.length + 1 });
  };
  const removeItem = (id) => admin.removeListItem('music', id);

  return (
    <OrnatePanel className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionHeading icon={Music} title="Music & Playlist" />
        <button onClick={addItem} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-cinzel text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4" /> Add New Track
        </button>
      </div>
      <div className="space-y-5">
        {items.map((m) => (
          <div key={m.id} className="relative glass-panel-dark border border-gold-500/30 rounded-2xl p-6">
            <div className="ornate-corner-tl" />
            <div className="ornate-corner-tr" />
            <div className="ornate-corner-bl" />
            <div className="ornate-corner-br" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sacred-saffron/20 to-navy-900 border border-sacred-saffron/40 flex items-center justify-center text-xl">
                  {m.symbol || '🎵'}
                </div>
                <span className="font-cinzel text-sm tracking-wider text-gold-300 uppercase">{m.title || 'New Track'}</span>
              </div>
              <button onClick={() => removeItem(m.id)} className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <MediaUpload
                  category="Music Track"
                  accept=".mp3,audio/*"
                  currentValue={m.src}
                  onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateItem(m.id, { src: name }); }}
                  onRemove={() => updateItem(m.id, { src: '' })}
                  onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateItem(m.id, { src: name }); }}
                />
              </div>
              <div><FieldLabel>Track Title</FieldLabel><TextInput value={m.title} onChange={(v) => updateItem(m.id, { title: v })} placeholder="Bansuri Morning Meditation" /></div>
              <div><FieldLabel>Hindi Title (हिन्दी)</FieldLabel><TextInput value={m.hindi} onChange={(v) => updateItem(m.id, { hindi: v })} placeholder="बांसुरी ध्यान" /></div>
              <div><FieldLabel>Category</FieldLabel><TextInput value={m.category} onChange={(v) => updateItem(m.id, { category: v })} placeholder="Divine Instrumental" /></div>
              <div><FieldLabel>Symbol / Emoji</FieldLabel><TextInput value={m.symbol} onChange={(v) => updateItem(m.id, { symbol: v })} placeholder="🪈 🎼 🪕" /></div>
              <div><FieldLabel>Tag</FieldLabel><TextInput value={m.tag} onChange={(v) => updateItem(m.id, { tag: v })} placeholder="Raga Bhairav" /></div>
              <div><FieldLabel>Format</FieldLabel><TextInput value={m.format} onChange={(v) => updateItem(m.id, { format: v })} placeholder="MP3" /></div>
              <div><FieldLabel>Duration (Text)</FieldLabel><TextInput value={m.duration} onChange={(v) => updateItem(m.id, { duration: v })} placeholder="12:40" /></div>
              <div><FieldLabel>Duration (Seconds)</FieldLabel><NumberInput value={m.durationSec} onChange={(v) => updateItem(m.id, { durationSec: v })} /></div>
              <div><FieldLabel>File Size</FieldLabel><TextInput value={m.fileSize} onChange={(v) => updateItem(m.id, { fileSize: v })} placeholder="8.5 MB" /></div>
              <div><FieldLabel>Bitrate</FieldLabel><TextInput value={m.bitrate} onChange={(v) => updateItem(m.id, { bitrate: v })} placeholder="320 kbps" /></div>
              <div><FieldLabel>Display Order</FieldLabel><NumberInput value={m.order} onChange={(v) => updateItem(m.id, { order: v })} /></div>
              <div><FieldLabel>Accent Color</FieldLabel><ColorInput value={m.color} onChange={(v) => updateItem(m.id, { color: v })} /></div>
              <div className="md:col-span-2"><FieldLabel>Description</FieldLabel><TextArea value={m.description} onChange={(v) => updateItem(m.id, { description: v })} rows={3} placeholder="Track description..." /></div>
            </div>
          </div>
        ))}
      </div>
    </OrnatePanel>
  );
}

function MapsEditor() {
  const admin = useAdmin();
  const m = admin.content.maps;
  const update = (key, val) => admin.updateContent('maps', { ...m, [key]: val });

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={MapPin} title="Maps & Directions" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2"><FieldLabel>Google Maps URL</FieldLabel><TextInput value={m.googleMapsUrl} onChange={(v) => update('googleMapsUrl', v)} placeholder="https://maps.google.com/?q=..." /></div>
        <div className="md:col-span-2"><FieldLabel>Directions Link (Get Directions)</FieldLabel><TextInput value={m.directionsLink} onChange={(v) => update('directionsLink', v)} placeholder="https://www.google.com/maps/dir/..." /></div>
        <div><FieldLabel>Marker Label</FieldLabel><TextInput value={m.templeMarker} onChange={(v) => update('templeMarker', v)} placeholder="Shree Baba Sidhnath Mandir" /></div>
        <div><FieldLabel>Zoom Level (1-20)</FieldLabel><NumberInput value={m.zoomLevel} onChange={(v) => update('zoomLevel', v)} min={1} max={20} /></div>
        <div><FieldLabel>Latitude</FieldLabel><TextInput value={m.latitude} onChange={(v) => update('latitude', v)} placeholder="28.5833" /></div>
        <div><FieldLabel>Longitude</FieldLabel><TextInput value={m.longitude} onChange={(v) => update('longitude', v)} placeholder="76.6500" /></div>
      </div>
    </OrnatePanel>
  );
}

function ContactEditor() {
  const admin = useAdmin();
  const c = admin.content.contact;
  const update = (key, val) => admin.updateContent('contact', { ...c, [key]: val });
  const schedule = Array.isArray(c.templeSchedule) ? c.templeSchedule : [];
  const facilities = Array.isArray(c.facilities) ? c.facilities : [];
  const etiquette = Array.isArray(c.etiquette) ? c.etiquette : [];

  const updateSchedule = (idx, updates) => {
    const next = schedule.map((s, i) => i === idx ? { ...s, ...updates } : s);
    update('templeSchedule', next);
  };
  const addSchedule = () => update('templeSchedule', [...schedule, { name: '', time: '', description: '' }]);
  const removeSchedule = (idx) => update('templeSchedule', schedule.filter((_, i) => i !== idx));

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={Phone} title="Contact Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div><FieldLabel>Phone</FieldLabel><TextInput value={c.phone} onChange={(v) => update('phone', v)} placeholder="+91 98123 45678" /></div>
        <div><FieldLabel>Alternate Phone</FieldLabel><TextInput value={c.alternatePhone} onChange={(v) => update('alternatePhone', v)} placeholder="+91 94160 12345" /></div>
        <div><FieldLabel>Email</FieldLabel><TextInput value={c.email} onChange={(v) => update('email', v)} placeholder="ashram@babasidhnath.org" /></div>
        <div><FieldLabel>Website</FieldLabel><TextInput value={c.website} onChange={(v) => update('website', v)} placeholder="https://babasidhnath.org" /></div>
        <div><FieldLabel>Emergency Contact</FieldLabel><TextInput value={c.emergencyContact} onChange={(v) => update('emergencyContact', v)} placeholder="+91 98765 43210" /></div>
        <div><FieldLabel>Coordinates Text</FieldLabel><TextInput value={c.coordinates} onChange={(v) => update('coordinates', v)} placeholder="28.5833° N, 76.6500° E" /></div>
        <div><FieldLabel>Latitude</FieldLabel><TextInput value={c.latitude} onChange={(v) => update('latitude', v)} placeholder="28.5833" /></div>
        <div><FieldLabel>Longitude</FieldLabel><TextInput value={c.longitude} onChange={(v) => update('longitude', v)} placeholder="76.6500" /></div>
        <div className="md:col-span-2"><FieldLabel>Full Address</FieldLabel><TextArea value={c.address} onChange={(v) => update('address', v)} rows={3} placeholder="Shree Baba Sidhnath Mandir..." /></div>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-500/40 flex items-center justify-center">
            <Car className="w-5 h-5 text-gold-400" />
          </div>
          <h3 className="font-cinzel text-lg text-gold-gradient uppercase tracking-wider">Travel & Directions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-gold-400" />
              <FieldLabel>By Road</FieldLabel>
            </div>
            <TextArea value={c.byRoad} onChange={(v) => update('byRoad', v)} rows={6} placeholder="Road access..." />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Train className="w-4 h-4 text-gold-400" />
              <FieldLabel>By Train</FieldLabel>
            </div>
            <TextArea value={c.byTrain} onChange={(v) => update('byTrain', v)} rows={6} placeholder="Nearest stations..." />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-4 h-4 text-gold-400" />
              <FieldLabel>By Air</FieldLabel>
            </div>
            <TextArea value={c.byAir} onChange={(v) => update('byAir', v)} rows={6} placeholder="Nearest airport..." />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <FieldLabel>Facilities Available</FieldLabel>
          </div>
          <ListEditor items={facilities} onChange={(v) => update('facilities', v)} placeholder="Facility..." />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-gold-400" />
            <FieldLabel>Visit Etiquette & Guidelines</FieldLabel>
          </div>
          <ListEditor items={etiquette} onChange={(v) => update('etiquette', v)} placeholder="Guideline..." />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-500/40 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gold-400" />
            </div>
            <h3 className="font-cinzel text-lg text-gold-gradient uppercase tracking-wider">Temple Schedule & Aarti Timings</h3>
          </div>
          <button onClick={addSchedule} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900/60 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-gold-200 transition-all font-cinzel text-xs tracking-wider">
            <Plus className="w-4 h-4" /> Add Timing
          </button>
        </div>
        <div className="space-y-4">
          {schedule.map((s, idx) => (
            <div key={idx} className="relative glass-panel-dark border border-gold-500/25 rounded-2xl p-5">
              <div className="ornate-corner-tl" />
              <div className="ornate-corner-br" />
              <div className="flex items-center justify-between mb-3">
                <span className="font-cinzel text-xs tracking-wider text-gold-300 uppercase">Schedule Entry #{idx + 1}</span>
                <button onClick={() => removeSchedule(idx)} className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><FieldLabel>Pooja / Aarti Name</FieldLabel><TextInput value={s.name} onChange={(v) => updateSchedule(idx, { name: v })} placeholder="Mangala Aarti" /></div>
                <div><FieldLabel>Time</FieldLabel><TextInput value={s.time} onChange={(v) => updateSchedule(idx, { time: v })} placeholder="05:00 AM" /></div>
                <div className="md:col-span-2"><FieldLabel>Description</FieldLabel><TextArea value={s.description} onChange={(v) => updateSchedule(idx, { description: v })} rows={2} placeholder="Details about this ritual..." /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OrnatePanel>
  );
}

function SocialEditor() {
  const admin = useAdmin();
  const s = admin.content.social;
  const update = (key, val) => admin.updateContent('social', { ...s, [key]: val });

  const socialFields = [
    { key: 'facebook', label: 'Facebook URL', icon: Share2, placeholder: 'https://facebook.com/...' },
    { key: 'instagram', label: 'Instagram URL', icon: Share2, placeholder: 'https://instagram.com/...' },
    { key: 'youtube', label: 'YouTube URL', icon: Share2, placeholder: 'https://youtube.com/...' },
    { key: 'whatsapp', label: 'WhatsApp Number', icon: Phone, placeholder: '+91 98123 45678' },
    { key: 'email', label: 'Contact Email', icon: Mail, placeholder: 'ashram@babasidhnath.org' },
  ];

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={Share2} title="Social Media Links" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {socialFields.map((f) => (
          <div key={f.key} className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <f.icon className="w-4 h-4 text-gold-400" />
              <FieldLabel>{f.label}</FieldLabel>
            </div>
            <TextInput value={s[f.key]} onChange={(v) => update(f.key, v)} placeholder={f.placeholder} />
          </div>
        ))}
      </div>
    </OrnatePanel>
  );
}

function ImagesEditor() {
  const admin = useAdmin();
  const img = admin.content.images;
  const update = (key, val) => admin.updateContent('images', { ...img, [key]: val });
  const templeImages = Array.isArray(img.templeImages) ? img.templeImages : [];
  const festivalImages = Array.isArray(img.festivalImages) ? img.festivalImages : [];

  const updateTempleImg = (idx, val) => {
    const next = [...templeImages];
    next[idx] = val;
    update('templeImages', next);
  };
  const addTempleImg = () => update('templeImages', [...templeImages, '']);
  const removeTempleImg = (idx) => update('templeImages', templeImages.filter((_, i) => i !== idx));

  const updateFestivalImg = (idx, val) => {
    const next = [...festivalImages];
    next[idx] = val;
    update('festivalImages', next);
  };
  const addFestivalImg = () => update('festivalImages', [...festivalImages, '']);
  const removeFestivalImg = (idx) => update('festivalImages', festivalImages.filter((_, i) => i !== idx));

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={ImagePlus} title="Featured Images & Media" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <MediaUpload
          category="Hero Image"
          accept="image/*"
          currentValue={img.heroImage}
          onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); update('heroImage', name); }}
          onRemove={() => update('heroImage', '')}
          onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); update('heroImage', name); }}
        />
        <MediaUpload
          category="Background Image"
          accept="image/*"
          currentValue={img.backgroundImage}
          onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); update('backgroundImage', name); }}
          onRemove={() => update('backgroundImage', '')}
          onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); update('backgroundImage', name); }}
        />
        <MediaUpload
          category="Logo / Icon"
          accept="image/*"
          currentValue={img.logo}
          onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); update('logo', name); }}
          onRemove={() => update('logo', '')}
          onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); update('logo', name); }}
        />
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-500/40 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-gold-400" />
            </div>
            <h3 className="font-cinzel text-lg text-gold-gradient uppercase tracking-wider">Temple Images Gallery</h3>
          </div>
          <button onClick={addTempleImg} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900/60 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-gold-200 transition-all font-cinzel text-xs tracking-wider">
            <Plus className="w-4 h-4" /> Add Temple Image
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templeImages.map((src, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => removeTempleImg(idx)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-red-200 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <MediaUpload
                category={`Temple Image ${idx + 1}`}
                accept="image/*"
                currentValue={src}
                onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateTempleImg(idx, name); }}
                onRemove={() => updateTempleImg(idx, '')}
                onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateTempleImg(idx, name); }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sacred-saffron/20 to-navy-900 border border-sacred-saffron/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sacred-amber" />
            </div>
            <h3 className="font-cinzel text-lg text-gold-gradient uppercase tracking-wider">Festival Gallery Images</h3>
          </div>
          <button onClick={addFestivalImg} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900/60 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-gold-200 transition-all font-cinzel text-xs tracking-wider">
            <Plus className="w-4 h-4" /> Add Festival Image
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {festivalImages.map((src, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => removeFestivalImg(idx)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-red-200 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <MediaUpload
                category={`Festival Image ${idx + 1}`}
                accept="image/*"
                currentValue={src}
                onUpload={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateFestivalImg(idx, name); }}
                onRemove={() => updateFestivalImg(idx, '')}
                onReplace={(name, dataUrl) => { admin.updateMedia(name, dataUrl); updateFestivalImg(idx, name); }}
              />
            </div>
          ))}
        </div>
        {festivalImages.length === 0 && (
          <div className="text-center py-8 border border-dashed border-gold-500/20 rounded-2xl">
            <Sparkles className="w-10 h-10 text-gold-500/40 mx-auto mb-2" />
            <p className="font-marcellus text-sacred-ivory/50 text-sm">No festival images yet. Click "Add Festival Image" to begin.</p>
          </div>
        )}
      </div>
    </OrnatePanel>
  );
}

function ThemeEditor() {
  const admin = useAdmin();
  const t = admin.content.theme;
  const update = (key, val) => admin.updateContent('theme', { ...t, [key]: val });

  const colorFields = [
    { key: 'primary', label: 'Primary Navy' },
    { key: 'secondary', label: 'Secondary Gold' },
    { key: 'goldAccent', label: 'Gold Accent Glow' },
    { key: 'background', label: 'Background Dark' },
    { key: 'text', label: 'Text Ivory' },
    { key: 'glow', label: 'Ambient Glow' },
    { key: 'button', label: 'Button Gold' },
  ];

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={Palette} title="Theme Color Palette" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {colorFields.map((f) => (
          <div key={f.key}>
            <FieldLabel>{f.label}</FieldLabel>
            <ColorInput value={t[f.key]} onChange={(v) => update(f.key, v)} />
          </div>
        ))}
      </div>
    </OrnatePanel>
  );
}

function AnimationEditor() {
  const admin = useAdmin();
  const a = admin.content.animations;
  const update = (key, val) => admin.updateContent('animations', { ...a, [key]: val });

  const toggles = [
    { key: 'rain', label: 'Rain Ambient Particles', icon: Wand2 },
    { key: 'fog', label: 'Mystic Fog Overlay', icon: Wand2 },
    { key: 'particles', label: 'Sacred Dust Particles', icon: Sparkles },
    { key: 'bellAnimation', label: 'Temple Bell Sway Animation', icon: Wand2 },
    { key: 'flowerPetals', label: 'Falling Flower Petals', icon: Sparkles },
    { key: 'fireflies', label: 'Fireflies / Divine Lights', icon: Sparkles },
    { key: 'bloom', label: 'Bloom / Post-processing Effect', icon: Wand2 },
    { key: 'music', label: 'Ambient Music Audio', icon: Music },
    { key: 'cameraMotion', label: 'Auto Camera Movement', icon: Wand2 },
  ];

  return (
    <OrnatePanel className="p-8">
      <SectionHeading icon={Wand2} title="Animation & Ambient Effects" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toggles.map((t) => (
          <ToggleSwitch key={t.key} label={t.label} value={!!a[t.key]} onChange={(v) => update(t.key, v)} />
        ))}
      </div>
    </OrnatePanel>
  );
}

export default function AdminDashboard({ isOpen, onClose }) {
  const admin = useAdmin();
  const [activeSection, setActiveSection] = useState('temple');
  const importRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState('');
  const [processError, setProcessError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImportClick = () => {
    if (importRef.current) importRef.current.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setIsProcessing(true);
    setProcessMessage('Importing content from ZIP...');
    setProcessError('');
    try {
      const { content, media } = await importContentFromZip(file);
      admin.importContent(content, media);
      setProcessMessage('✓ Content imported successfully!');
      setTimeout(() => { setProcessMessage(''); setIsProcessing(false); }, 2500);
    } catch (err) {
      setProcessError('Failed to import: ' + (err.message || 'Unknown error'));
      setIsProcessing(false);
    }
    if (importRef.current) importRef.current.value = '';
  };

  const handleExport = async () => {
    setIsProcessing(true);
    setProcessMessage('Exporting content to ZIP...');
    setProcessError('');
    try {
      const exportData = admin.getExportContent();
      await exportContentToZip(exportData.content, exportData.media);
      admin.markAsSaved();
      setProcessMessage('✓ Content exported & marked as saved!');
      setTimeout(() => { setProcessMessage(''); setIsProcessing(false); }, 2500);
    } catch (err) {
      setProcessError('Failed to export: ' + (err.message || 'Unknown error'));
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    admin.logout();
    onClose();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'temple': return <TempleEditor />;
      case 'home': return <HomeEditor />;
      case 'history': return <HistoryEditor />;
      case 'festivals': return <FestivalsEditor />;
      case 'gallery': return <GalleryEditor />;
      case 'videos': return <VideosEditor />;
      case 'music': return <MusicEditor />;
      case 'maps': return <MapsEditor />;
      case 'contact': return <ContactEditor />;
      case 'social': return <SocialEditor />;
      case 'images': return <ImagesEditor />;
      case 'theme': return <ThemeEditor />;
      case 'animations': return <AnimationEditor />;
      default: return <TempleEditor />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-navy-950/95 backdrop-blur-xl overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-navy-radial pointer-events-none opacity-60" />
          <div className="absolute inset-0 bg-divine-glow pointer-events-none opacity-40" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-3 rounded-2xl bg-navy-900/80 hover:bg-navy-800 border border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-gold-200 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 border-b border-gold-500/20 bg-navy-950/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4 gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-700/40 via-gold-500/20 to-sacred-saffron/30 blur-md animate-pulse-glow" />
                  <div className="relative w-full h-full rounded-full border-2 border-gold-500/60 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                    <span className="font-cinzelDeco text-2xl text-gold-gradient">ॐ</span>
                  </div>
                </div>
                <div>
                  <h1 className="font-cinzel text-lg sm:text-xl text-gold-gradient uppercase tracking-[0.15em] font-bold">
                    TEMPLE ADMIN DASHBOARD
                  </h1>
                  <p className="font-marcellus text-[11px] text-sacred-ivory/50 tracking-wider mt-0.5">
                    Sacred Content Management Portal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleImportClick}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-gold-200 transition-all font-cinzel text-xs tracking-wider disabled:opacity-50 group"
                >
                  <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  Import Content
                </button>
                <input ref={importRef} type="file" accept=".zip" onChange={handleImportFile} className="hidden" />

                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500/20 to-sacred-saffron/20 hover:from-gold-500/30 hover:to-sacred-saffron/30 border border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-gold-200 transition-all font-cinzel text-xs tracking-wider disabled:opacity-50 group"
                >
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  Export Content ZIP
                </button>

                {admin.hasUnsavedChanges ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 animate-pulse">
                    <Circle className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                    <span className="font-cinzel text-[11px] tracking-wider text-red-300 uppercase">Unsaved Changes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-cinzel text-[11px] tracking-wider text-emerald-300 uppercase">All Saved</span>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sacred-saffron/15 hover:bg-sacred-saffron/25 border border-sacred-saffron/40 hover:border-sacred-saffron/60 text-sacred-amber hover:text-sacred-saffron transition-all font-cinzel text-xs tracking-wider group"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Logout
                </button>
              </div>
            </div>

            {processMessage && (
              <div className="px-6 pb-3">
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-gold-500/10 border border-gold-500/30">
                  <Check className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <p className="font-marcellus text-sm text-gold-300">{processMessage}</p>
                </div>
              </div>
            )}
            {processError && (
              <div className="px-6 pb-3">
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-950/50 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="font-marcellus text-sm text-red-300">{processError}</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 flex flex-1 overflow-hidden">
            <aside className="w-[280px] shrink-0 border-r border-gold-500/20 overflow-y-auto">
              <div className="glass-panel backdrop-blur-xl h-full py-5 px-3">
                <nav className="space-y-1.5">
                  {SIDEBAR_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-gold-500/25 via-gold-500/10 to-transparent border border-gold-500/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                            : 'hover:bg-navy-900/60 border border-transparent hover:border-gold-500/20'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-gradient-to-br from-gold-500/30 to-navy-900 border border-gold-500/50'
                            : 'bg-navy-900/50 border border-gold-500/15 group-hover:border-gold-500/30'
                        }`}>
                          <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-gold-400' : 'text-gold-500/60 group-hover:text-gold-300'}`} />
                        </div>
                        <span className={`flex-1 text-left font-cinzel text-[11px] tracking-[0.1em] uppercase transition-colors ${
                          isActive ? 'text-gold-gradient font-semibold' : 'text-sacred-ivory/70 group-hover:text-sacred-ivory'
                        }`}>
                          {section.label}
                        </span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="max-w-6xl mx-auto space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {renderSection()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
