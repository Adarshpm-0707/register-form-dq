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

def get_transcript_data(cid):
    p = os.path.join(brain, cid, '.system_generated', 'logs', 'transcript_full.jsonl')
    with open(p, 'r', encoding='utf-8') as f:
        return [json.loads(line) for line in f]

d_8fa = get_transcript_data('8fa9d311-01e9-4b9d-903e-e42d751520ce')
d_9f0 = get_transcript_data('9f08c6b5-babb-4c32-93e2-2616e75a7d50')
d_2de = get_transcript_data('2de0dfe4-3530-4a6b-a02e-0cdc2cdd41c5')
d_dc6 = get_transcript_data('dc62835f-02ad-419c-b7a0-7ff48a60ce84')

def apply_tc(content, tc, label=""):
    args = tc.get('args', {})
    t = normalize(args.get('TargetContent', ''))
    r = normalize(args.get('ReplacementContent', ''))
    c = normalize(content)
    if t in c:
        print(f"  [OK] {label}")
        return c.replace(t, r, 1)
    else:
        print(f"  [FAIL] {label}")
        print("    Target preview:", repr(t[:80]))
        return content

print("--- Testing Navbar.jsx ---")
# Start with HEAD
nav = get_head_file('src/components/Navbar.jsx')
nav = apply_tc(nav, d_8fa[203]['tool_calls'][0], '8fa:203')
nav = apply_tc(nav, d_8fa[207]['tool_calls'][0], '8fa:207')
nav = apply_tc(nav, d_8fa[213]['tool_calls'][0], '8fa:213')

# Now transform Navbar according to transform.js
nav = nav.replace('bg-[#090D11]/85', 'bg-[#040e20]/80')
nav = nav.replace('border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]', 'border-sky-500/20 shadow-[0_8px_32px_rgba(2,6,23,0.7)]')
nav = nav.replace('text-[#c6ff34]', 'text-white')
nav = nav.replace('text-[#a3d628]', 'text-white')
nav = nav.replace('text-neon-lime', 'text-white')
nav = nav.replace('hover:text-[#c6ff34]', 'hover:text-white')
nav = nav.replace('hover:text-neon-lime', 'hover:text-white')
nav = nav.replace('group-hover:text-[#c6ff34]', 'group-hover:text-white')

# In transform.js:
# updated = updated.replace(/bg-\[#c6ff34\]/g, 'bg-sky-400');
nav = nav.replace('bg-[#c6ff34]', 'bg-sky-400')

nav = apply_tc(nav, d_dc6[179]['tool_calls'][0], 'dc6:179')
nav = apply_tc(nav, d_dc6[181]['tool_calls'][0], 'dc6:181')
print("Navbar length:", len(nav))

print("\n--- Testing Footer.jsx ---")
# Footer base from 9f0:351
footer = d_9f0[351]['tool_calls'][0]['args']['CodeContent']
# Now transform Footer according to transform.js
footer = footer.replace('min-h-screen bg-[#090D11]', 'min-h-screen bg-transparent')
footer = footer.replace('bg-[#06090D]', 'bg-[#030914]/80')
footer = footer.replace('bg-[#c6ff34]/[0.03]', 'bg-sky-400/[0.05]')
footer = footer.replace('bg-[#c6ff34]/10', 'bg-sky-400/15')
footer = footer.replace(
    'bg-[#c6ff34] hover:bg-[#bbf029] text-[#090D11] font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(198,255,52,0.35)]',
    'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(56,189,248,0.35)]'
)
footer = footer.replace('hover:bg-[#c6ff34] text-slate-300 hover:text-[#090D11] border border-white/10 hover:border-[#c6ff34]', 'hover:bg-sky-400 text-slate-300 hover:text-slate-950 border border-white/10 hover:border-sky-400')
footer = footer.replace('text-[#c6ff34]', 'text-white')
footer = footer.replace('text-[#a3d628]', 'text-white')
footer = footer.replace('text-neon-lime', 'text-white')
footer = footer.replace('hover:text-[#c6ff34]', 'hover:text-white')
footer = footer.replace('hover:text-neon-lime', 'hover:text-white')
footer = footer.replace('group-hover:text-[#c6ff34]', 'group-hover:text-white')

footer = apply_tc(footer, d_dc6[233]['tool_calls'][0], 'dc6:233')
print("Footer length:", len(footer))
