import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Icons = {
  ArrowLeft: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Download: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
};

export default function CertificateGenerator() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [name, setName] = useState('');
  


  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageObj, setImageObj] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/certificate-bg.png';
    img.onload = () => {
      setImageObj(img);
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (imageLoaded && imageObj && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match image intrinsic size for high quality
      canvas.width = imageObj.width;
      canvas.height = imageObj.height;
      
      // Draw background
      ctx.drawImage(imageObj, 0, 0);
      
      // Draw text
      if (name.trim()) {
        const fixedFontSize = 80;
        const fixedColor = '#000080'; // Dark Blue
        
        ctx.font = `bold ${fixedFontSize}px "Playfair Display", "Times New Roman", Times, serif`;
        ctx.fillStyle = fixedColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Slightly lower to sit near the line without touching it
        const x = canvas.width / 2;
        const y = canvas.height * 0.53;
        
        ctx.fillText(name, x, y);
      }
    }
  }, [name, imageLoaded, imageObj]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `Certificate_${name.trim().replace(/\s+/g, '_') || 'Blank'}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#050521] text-white selection:bg-[#c6ff34]/30">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(198,255,52,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,255,52,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-[#c6ff34] transition-colors mb-8 group uppercase text-xs font-black tracking-[0.2em]"
        >
          <Icons.ArrowLeft /> Back
        </button>

        <div className="mb-12">
           <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              CERTIFICATE <span className="text-[#c6ff34]">GENERATOR</span>
           </h1>
           <div className="h-1 w-full max-w-sm bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.6)] w-full" />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Controls */}
           <div className="lg:col-span-1 space-y-6 bg-white/[0.02] border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-3xl h-fit">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2">Recipient Name</label>
                 <input 
                   type="text" 
                   value={name} 
                   onChange={(e) => setName(e.target.value)}
                   className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 focus:border-[#c6ff34] focus:outline-none transition-all placeholder:text-white/10 font-bold text-base shadow-inner"
                   placeholder="Enter Name"
                 />
              </div>



              <div className="pt-6">
                 <button 
                   onClick={handleDownload}
                   disabled={!imageLoaded || !name.trim()}
                   className="w-full bg-[#c6ff34] text-[#050521] font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(198,255,52,0.2)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                 >
                   <Icons.Download /> Download Image
                 </button>
              </div>
           </div>

           {/* Preview */}
           <div className="lg:col-span-2">
              <div className="sticky top-24 bg-white/[0.02] border border-white/10 rounded-[32px] p-4 md:p-8 backdrop-blur-3xl overflow-hidden">
                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" /> Live Preview
                 </h2>
                 <div className="w-full rounded-xl overflow-hidden border border-white/5 bg-[#050521] shadow-2xl flex items-center justify-center min-h-[300px]">
                   {!imageLoaded ? (
                     <div className="text-white/20 font-black uppercase tracking-widest text-sm animate-pulse">
                       Loading Template...
                     </div>
                   ) : (
                     <canvas 
                       ref={canvasRef} 
                       className="w-full h-auto object-contain block"
                     />
                   )}
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
