import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Eye } from 'lucide-react';
import { Perfume } from '../types';
import { formatPrice } from '../config/site';

interface FragranceQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
}

export const FragranceQuizModal: React.FC<FragranceQuizModalProps> = ({
  isOpen,
  onClose,
  perfumes,
  onSelectPerfume
}) => {
  const [step, setStep] = useState<number>(1);
  const [genderPref, setGenderPref] = useState<'hombre' | 'mujer' | 'unisex' | 'todos'>('todos');
  const [occasion, setOccasion] = useState<string>('');
  const [scentProfile, setScentProfile] = useState<string>('');

  const occasions = [
    { id: 'noche', label: 'Salidas nocturnas & Boliches', desc: 'Seducción, proyección intensa y cumplidos' },
    { id: 'diario', label: 'Uso diario & Oficina', desc: 'Frescura, pulcritud y elegancia constante' },
    { id: 'citas', label: 'Citas románticas', desc: 'Dulzura, calidez y cercanía magnética' },
    { id: 'eventos', label: 'Eventos & Fiestas de gala', desc: 'Lujo, distinción y presencia imponente' }
  ];

  const profiles = [
    { id: 'amaderado', label: 'Amaderado / Cuero / Especias', desc: 'Notas de cedro, cardamomo, cuero, sándalo' },
    { id: 'dulce', label: 'Dulce / Vainilla / Gourmand', desc: 'Notas de miel, vainilla, haba tonka, licor' },
    { id: 'fresco', label: 'Fresco / Acuático / Cítrico', desc: 'Notas marinas, bergamota, menta, pomelo' },
    { id: 'floral', label: 'Floral / Frutal / Elegante', desc: 'Notas de jazmín, cereza, rosas, azahar' }
  ];

  // Match recommendation logic
  const recommendations = perfumes.filter(p => {
    // Gender match
    if (genderPref !== 'todos' && p.gender !== genderPref && p.gender !== 'unisex') {
      return false;
    }

    // Profile match
    if (scentProfile === 'amaderado') {
      return p.family.toLowerCase().includes('amaderada') || p.family.toLowerCase().includes('cuero') || p.family.toLowerCase().includes('especiada');
    }
    if (scentProfile === 'dulce') {
      return p.family.toLowerCase().includes('ambar') || p.family.toLowerCase().includes('gourmand') || p.feelsLike.toLowerCase().includes('dulce') || p.feelsLike.toLowerCase().includes('vainilla');
    }
    if (scentProfile === 'fresco') {
      return p.family.toLowerCase().includes('acuática') || p.family.toLowerCase().includes('cítrica') || p.feelsLike.toLowerCase().includes('frescura') || p.feelsLike.toLowerCase().includes('limpio');
    }
    if (scentProfile === 'floral') {
      return p.family.toLowerCase().includes('floral') || p.family.toLowerCase().includes('frutal');
    }

    return true;
  }).slice(0, 3);

  const resetQuiz = () => {
    setStep(1);
    setGenderPref('todos');
    setOccasion('');
    setScentProfile('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#0e1014] border border-[#d4af37]/35 shadow-2xl overflow-hidden z-10 my-auto text-[#ede8df]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#121419] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                TEST DE FRAGANCIAS DEALBO
              </h3>
              <p className="text-xs text-[#a0998b]">
                Descubrí qué perfume va mejor con tu estilo en 3 preguntas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#999] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s
                    ? 'w-8 bg-[#d4af37]'
                    : step > s
                    ? 'w-4 bg-[#d4af37]/50'
                    : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* STEP 1: Gender */}
          {step === 1 && (
            <div className="space-y-4 text-center">
              <h4 className="text-xl font-serif font-bold text-white">
                1. ¿Para quién estás buscando la fragancia?
              </h4>
              <p className="text-xs text-[#999]">Seleccioná una opción para filtrar el catálogo.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'hombre', title: 'Hombre', desc: 'Aromas masculinos e intensos' },
                  { id: 'mujer', title: 'Mujer', desc: 'Aromas femeninos y seductores' },
                  { id: 'unisex', title: 'Unisex / Todos', desc: 'Versátiles y sin etiquetas' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setGenderPref(opt.id as any);
                      setStep(2);
                    }}
                    className="p-4 rounded-2xl bg-[#14161a] border border-[#d4af37]/20 hover:border-[#d4af37] text-left transition-all hover:scale-102 cursor-pointer group"
                  >
                    <span className="text-sm font-bold text-white group-hover:text-[#d4af37] block font-serif">
                      {opt.title}
                    </span>
                    <span className="text-[11px] text-[#888] mt-1 block">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Occasion */}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <h4 className="text-xl font-serif font-bold text-white">
                2. ¿En qué ocasión planeás usarlo principalmente?
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => {
                      setOccasion(occ.id);
                      setStep(3);
                    }}
                    className="p-4 rounded-2xl bg-[#14161a] border border-[#d4af37]/20 hover:border-[#d4af37] text-left transition-all hover:scale-102 cursor-pointer group"
                  >
                    <span className="text-sm font-bold text-white group-hover:text-[#d4af37] block font-serif">
                      {occ.label}
                    </span>
                    <span className="text-[11px] text-[#888] mt-1 block">
                      {occ.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Scent Family Preference */}
          {step === 3 && (
            <div className="space-y-4 text-center">
              <h4 className="text-xl font-serif font-bold text-white">
                3. ¿Qué sensaciones olfativas te atraen más?
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {profiles.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setScentProfile(prof.id);
                      setStep(4);
                    }}
                    className="p-4 rounded-2xl bg-[#14161a] border border-[#d4af37]/20 hover:border-[#d4af37] text-left transition-all hover:scale-102 cursor-pointer group"
                  >
                    <span className="text-sm font-bold text-white group-hover:text-[#d4af37] block font-serif">
                      {prof.label}
                    </span>
                    <span className="text-[11px] text-[#888] mt-1 block">
                      {prof.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Results & Matches */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-xs font-display tracking-widest text-[#d4af37] uppercase font-bold">
                  RECOMENDACIÓN PERSONALIZADA
                </span>
                <h4 className="text-2xl font-serif font-bold text-white">
                  ¡Encontramos tus fragancias ideales!
                </h4>
                <p className="text-xs text-[#999]">
                  Basado en tus preferencias de uso y perfil aromático.
                </p>
              </div>

              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((perfume) => (
                    <div
                      key={perfume.id}
                      className="p-4 rounded-2xl bg-[#14161b] border border-[#d4af37]/30 flex items-center justify-between gap-4"
                    >
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] uppercase font-display text-[#d4af37] tracking-wider block">
                          {perfume.brand}
                        </span>
                        <h5 className="text-sm font-serif font-bold text-white">
                          {perfume.name}
                        </h5>
                        <p className="text-xs text-[#aaa] line-clamp-1">
                          {perfume.feelsLike}
                        </p>
                        <span className="text-xs font-bold text-white font-display mt-0.5 block">
                          {formatPrice(perfume.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onSelectPerfume(perfume);
                          onClose();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c76c] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-[#aaa]">No hay coincidencias exactas con este filtro específico.</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={resetQuiz}
                  className="text-xs text-[#888] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Volver a hacer el test</span>
                </button>

                <button
                  onClick={onClose}
                  className="text-xs text-[#d4af37] hover:underline font-semibold"
                >
                  Cerrar y ver todo el catálogo →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
