import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';


const CERTIFICATE_NAMES = [
  "Pranav krishnan N K",
  "Safdar",
  "Hamdha ismail",
  "Rushdha Iqbal",
  "Samir zakariya ummer",
  "Ashwin Rajeevan",
  "Mausoofa PK",
  "Devanand",
  "Darshith",
  "Thejus krishna",
  "MUHAMMED SAFWAN MAHABOOB",
  "Faaz muhammed",
  "Muhammed P",
  "Ain Muhammed",
  "Imdadu Rahman K",
  "Sinan K",
  "Meha Ebrahim",
  "Aflah Nayeem",
  "Naja majeed",
  "Fathima Muhammedkunhi",
  "Amaan Ashraf",
  "Al Shammas",
  "Rayyan ashraf",
  "Jwalna Sanoop",
  "Juan Sanu",
  "Muhammed Asif pk",
  "MUHAMMED SHIBILI PTP",
  "Muhammad Nihaan",
  "Safdar Hashmi P A",
  "Muhammed Siyad E p",
  "Muhammed Ameem",
  "Najiya Thasneem M",
  "Muhammed Fahmi N",
  "Muhammed Ansif",
  "Muhammed Suhail",
  "Sreehari"
];

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
  const [name, setName] = useState('');
  const [templateBuffer, setTemplateBuffer] = useState(null);
  const [fontBuffer, setFontBuffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [templateCanvas, setTemplateCanvas] = useState(null);
  const displayCanvasRef = useRef(null);

  // Position constant: 289 points from the bottom of 595.5 points height (perfectly centered between lines)
  const TEXT_Y_POINTS = 289;

  // Load PDF.js library dynamically
  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfjsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      setPdfjsLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Monitor custom font loading
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  // Load assets
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [pdfRes, fontRes] = await Promise.all([
          fetch('/certificate-template.pdf'),
          fetch('/DMSans-Bold.ttf')
        ]);
        if (!pdfRes.ok || !fontRes.ok) {
          throw new Error('Assets failed to load');
        }
        const [pdfBuf, fontBuf] = await Promise.all([
          pdfRes.arrayBuffer(),
          fontRes.arrayBuffer()
        ]);
        setTemplateBuffer(pdfBuf);
        setFontBuffer(fontBuf);
        setLoading(false);
      } catch (err) {
        console.error('Error loading certificate template assets:', err);
      }
    };
    loadAssets();
  }, []);

  // Render PDF to offscreen canvas
  useEffect(() => {
    if (!pdfjsLoaded || !templateBuffer) return;
    
    let isMounted = true;
    const renderTemplate = async () => {
      try {
        let currentTemplate = templateBuffer;
        if (currentTemplate.byteLength === 0) {
          const res = await fetch('/certificate-template.pdf');
          currentTemplate = await res.arrayBuffer();
          setTemplateBuffer(currentTemplate);
        }
        const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(currentTemplate.slice(0)) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const scale = 2.0; // High resolution rendering
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        
        if (isMounted) {
          setTemplateCanvas(canvas);
        }
      } catch (err) {
        console.error('Error rendering template to canvas:', err);
      }
    };
    
    renderTemplate();
    return () => {
      isMounted = false;
    };
  }, [pdfjsLoaded, templateBuffer]);

  // Draw background and text on display canvas
  useEffect(() => {
    if (!templateCanvas) return;
    
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = templateCanvas.width;
    canvas.height = templateCanvas.height;
    
    ctx.drawImage(templateCanvas, 0, 0);
    
    if (name.trim()) {
      ctx.font = 'bold 70px "DM Sans", sans-serif';
      ctx.fillStyle = '#052149';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      
      const x = canvas.width / 2;
      // TEXT_Y_POINTS points from bottom is (595.5 - TEXT_Y_POINTS)/595.5 of canvas height from top
      const y = canvas.height * ((595.499986 - TEXT_Y_POINTS) / 595.499986);
      
      ctx.fillText(name, x, y);
    }
  }, [templateCanvas, name, fontsLoaded, TEXT_Y_POINTS]);

  const handleDownload = async () => {
    if (!templateBuffer || !fontBuffer || !name.trim()) return;
    setGenerating(true);
    try {
      let currentTemplate = templateBuffer;
      if (currentTemplate.byteLength === 0) {
        const res = await fetch('/certificate-template.pdf');
        currentTemplate = await res.arrayBuffer();
        setTemplateBuffer(currentTemplate);
      }
      
      let currentFont = fontBuffer;
      if (currentFont.byteLength === 0) {
        const res = await fetch('/DMSans-Bold.ttf');
        currentFont = await res.arrayBuffer();
        setFontBuffer(currentFont);
      }

      const pdfDoc = await PDFDocument.load(currentTemplate.slice(0));
      pdfDoc.registerFontkit(fontkit.default || fontkit);
      
      const customFont = await pdfDoc.embedFont(currentFont.slice(0));
      const pages = pdfDoc.getPages();
      const page = pages[0];
      const { width } = page.getSize();
      
      const fontSize = 35; 
      const textWidth = customFont.widthOfTextAtSize(name, fontSize);
      const x = (width - textWidth) / 2;
      const y = TEXT_Y_POINTS; // Aligned perfect position
      
      page.drawText(name, {
        x: x,
        y: y,
        size: fontSize,
        font: customFont,
        color: rgb(5/255, 33/255, 73/255), // #052149
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const docUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `Certificate_${name.trim().replace(/\s+/g, '_') || 'Blank'}.pdf`;
      link.href = docUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(docUrl), 100);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Error generating PDF: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const isPreviewLoading = loading || !pdfjsLoaded;

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
           <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              CERTIFICATE <span className="text-[#c6ff34]">GENERATOR</span>
           </h1>
           <div className="h-1 w-full max-w-sm bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#c6ff34] shadow-[0_0_20px_rgba(198,255,52,0.6)] w-full" />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Controls */}
           <div className="lg:col-span-1 space-y-6 bg-white/[0.02] border border-white/10 rounded-[24px] md:rounded-[32px] p-5 md:p-8 backdrop-blur-3xl h-fit">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-2">Recipient Name</label>
                 <div className="relative">
                    <select 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#050521] text-white border border-white/10 rounded-2xl pl-5 pr-12 py-4 appearance-none focus:border-[#c6ff34] focus:outline-none transition-all font-bold text-sm sm:text-base shadow-inner cursor-pointer"
                    >
                      <option value="" className="bg-[#050521] text-white/40">Select Name</option>
                      {CERTIFICATE_NAMES.map((n) => (
                        <option key={n} value={n} className="bg-[#050521] text-white">
                          {n}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                       </svg>
                    </div>
                 </div>
              </div>

              <div className="pt-6">
                 <button 
                   onClick={handleDownload}
                   disabled={loading || generating || !name.trim()}
                   className="w-full bg-[#c6ff34] text-[#050521] font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(198,255,52,0.2)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                 >
                   <Icons.Download /> {generating ? 'Generating...' : 'Download PDF'}
                 </button>
              </div>
           </div>

           {/* Preview */}
           <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 bg-white/[0.02] border border-white/10 rounded-[24px] md:rounded-[32px] p-4 md:p-8 backdrop-blur-3xl overflow-hidden">
                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-[#c6ff34] animate-pulse" /> Live Preview
                 </h2>
                 <div 
                   className="relative w-full rounded-xl overflow-hidden border border-white/5 bg-[#050521] shadow-2xl flex items-center justify-center aspect-[842/595]"
                 >
                   {isPreviewLoading || !templateCanvas ? (
                     <div className="text-white/20 font-black uppercase tracking-widest text-sm animate-pulse">
                       Loading Template...
                     </div>
                   ) : (
                     <canvas 
                       ref={displayCanvasRef}
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
