import json, os, subprocess, re

brain = r'C:\Users\adhua\.gemini\antigravity-ide\brain'

def get_head_file(rel_path):
    res = subprocess.run(['git', 'show', f'HEAD:{rel_path}'], capture_output=True, text=True, encoding='utf-8')
    if res.returncode == 0:
        return res.stdout
    return None

def normalize(s):
    if s is None: return None
    return s.replace('\r\n', '\n')

def apply_replace(content, target, replacement, label=""):
    c_norm = normalize(content)
    t_norm = normalize(target)
    r_norm = normalize(replacement)
    if t_norm in c_norm:
        # replace first occurrence
        res = c_norm.replace(t_norm, r_norm, 1)
        print(f"  [OK] Replaced in {label}")
        return res
    else:
        print(f"  [FAIL] Target NOT found in {label}!")
        print(f"    Target starts: {repr(t_norm[:80])}")
        return content

def apply_multi_replace(content, chunks, label=""):
    c_norm = normalize(content)
    for idx, chunk in enumerate(chunks):
        t_norm = normalize(chunk.get('TargetContent', ''))
        r_norm = normalize(chunk.get('ReplacementContent', ''))
        if t_norm in c_norm:
            c_norm = c_norm.replace(t_norm, r_norm, 1)
            print(f"  [OK] Multi-replace chunk {idx} in {label}")
        else:
            print(f"  [FAIL] Multi-replace chunk {idx} NOT found in {label}!")
    return c_norm

def run_transform(content, filename):
    updated = content
    # 1. Root backgrounds to transparent
    updated = updated.replace('min-h-screen bg-[#090D11]', 'min-h-screen bg-transparent')
    updated = updated.replace('min-h-screen bg-[#09090b]', 'min-h-screen bg-transparent')
    updated = updated.replace('min-h-screen bg-[#070B10]', 'min-h-screen bg-transparent')
    updated = updated.replace('min-h-screen bg-[#050521]', 'min-h-screen bg-transparent')

    # 2. Selection colors from neon lime to light blue
    updated = re.sub(r'selection:bg-\[#c6ff34\]\s+selection:text-\[#090D11\]', 'selection:bg-sky-500/30 selection:text-white', updated)
    updated = re.sub(r'selection:bg-\[#c6ff34\]\s+selection:text-black', 'selection:bg-sky-500/30 selection:text-white', updated)
    updated = re.sub(r'selection:bg-\[#c6ff34\]\s+selection:text-\[#070B10\]', 'selection:bg-sky-500/30 selection:text-white', updated)
    updated = updated.replace('selection:bg-[#c6ff34]', 'selection:bg-sky-500/30')

    # 3. Drop shadows with lime to white/light blue
    updated = updated.replace('drop-shadow-[0_0_30px_rgba(198,255,52,0.35)]', 'drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]')
    updated = updated.replace('drop-shadow-[0_0_20px_rgba(198,255,52,0.35)]', 'drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]')
    updated = updated.replace('drop-shadow-[0_0_25px_rgba(198,255,52,0.35)]', 'drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]')

    # 4. All green text classes to fully white
    updated = updated.replace('text-[#c6ff34]', 'text-white')
    updated = updated.replace('text-[#a3d628]', 'text-white')
    updated = updated.replace('text-neon-lime', 'text-white')
    updated = updated.replace('hover:text-[#c6ff34]', 'hover:text-white')
    updated = updated.replace('hover:text-neon-lime', 'hover:text-white')
    updated = updated.replace('group-hover:text-[#c6ff34]', 'group-hover:text-white')

    # 6. Navbar updates
    if 'Navbar.jsx' in filename:
        updated = updated.replace('bg-[#090D11]/85', 'bg-[#040e20]/80')
        updated = updated.replace('border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]', 'border-sky-500/20 shadow-[0_8px_32px_rgba(2,6,23,0.7)]')
        updated = updated.replace(
            'bg-[#c6ff34]/15 hover:bg-[#c6ff34] text-[#c6ff34] hover:text-[#090D11] border-[#c6ff34]/40 hover:border-[#c6ff34] flex items-center gap-1.5 shadow-[0_0_15px_rgba(198,255,52,0.15)]',
            'bg-sky-500/15 hover:bg-sky-400 text-white hover:text-slate-950 border-sky-400/40 hover:border-sky-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
        )
        updated = updated.replace(
            'bg-[#c6ff34] hover:bg-[#b8f522] text-[#090D11] text-xs font-bold tracking-wide transition-all duration-200 shadow-[0_2px_12px_rgba(198,255,52,0.3)]',
            'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 text-xs font-bold tracking-wide transition-all duration-200 shadow-[0_2px_12px_rgba(56,189,248,0.35)]'
        )
        updated = updated.replace('bg-[#c6ff34]', 'bg-sky-400')

    # 7. Footer updates
    if 'Footer.jsx' in filename:
        updated = updated.replace('bg-[#06090D]', 'bg-[#030914]/80')
        updated = updated.replace('bg-[#c6ff34]/[0.03]', 'bg-sky-400/[0.05]')
        updated = updated.replace('bg-[#c6ff34]/10', 'bg-sky-400/15')
        updated = updated.replace(
            'bg-[#c6ff34] hover:bg-[#bbf029] text-[#090D11] font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(198,255,52,0.35)]',
            'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(56,189,248,0.35)]'
        )
        updated = updated.replace('hover:bg-[#c6ff34] text-slate-300 hover:text-[#090D11] border border-white/10 hover:border-[#c6ff34]', 'hover:bg-sky-400 text-slate-300 hover:text-slate-950 border border-white/10 hover:border-sky-400')

    return updated

print("Setup complete.")
