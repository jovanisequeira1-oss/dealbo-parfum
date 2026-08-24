import React from 'react';
import { Instagram, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/site';

export const InstagramSection: React.FC = () => {
  const instagramPosts = [
    {
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
      title: 'Dior Sauvage Elixir',
      caption: 'Potencia pura y magnetismo en cada gota.'
    },
    {
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop',
      title: 'Baccarat Rouge 540',
      caption: 'El lujo cristalino y dulce más deseado.'
    },
    {
      image: 'https://images.unsplash.com/photo-1588405748480-1cf414c84382?q=80&w=600&auto=format&fit=crop',
      title: 'Good Girl Blush',
      caption: 'Feminidad y elegancia para cualquier ocasión.'
    },
    {
      image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=600&auto=format&fit=crop',
      title: 'Tom Ford Ombré Leather',
      caption: 'Cuero negro y sofisticación sin límites.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#d4af37]/15">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-[#d4af37] uppercase font-bold">
            <Instagram className="w-4 h-4" />
            <span>COMUNIDAD & NOVEDADES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight uppercase">
            SEGUINOS EN <span className="gold-gradient-text">INSTAGRAM</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9c9586]">
            Enterate de nuevos ingresos, reseñas olfativas y recomendaciones exclusivas en {siteConfig.instagramHandle}
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#aa821c]/20 border border-[#d4af37]/40 text-[#f5ebd2] hover:bg-[#d4af37] hover:text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            <span>{siteConfig.instagramHandle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={siteConfig.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-[#14151a] border border-white/10 text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
            title="Seguinos en TikTok"
          >
            <span className="text-xs font-bold">TikTok</span>
          </a>
        </div>
      </div>

      {/* Visual Feed Showcase */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {instagramPosts.map((post, idx) => (
          <a
            key={idx}
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden aspect-square bg-[#15161a] border border-white/10 hover:border-[#d4af37]/60 transition-all duration-300 block shadow-lg"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            
            {/* Hover overlay with instagram icon and caption */}
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-center items-center backdrop-blur-xs">
              <Instagram className="w-6 h-6 text-[#d4af37] mt-2" />
              <div>
                <h4 className="text-xs font-serif font-bold text-white line-clamp-1">{post.title}</h4>
                <p className="text-[11px] text-[#ccc] mt-1 line-clamp-2">{post.caption}</p>
              </div>
              <span className="text-[10px] text-[#d4af37] tracking-widest uppercase font-semibold">
                Ver en Instagram →
              </span>
            </div>
          </a>
        ))}
      </div>

    </section>
  );
};
