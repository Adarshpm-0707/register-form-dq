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

print("Loading transcripts...")
transcripts = {
    'ae6': get_transcript_data('ae6c3de5-642e-4889-ae44-22b688069168'),
    '2de': get_transcript_data('2de0dfe4-3530-4a6b-a02e-0cdc2cdd41c5'),
    'dc6': get_transcript_data('dc62835f-02ad-419c-b7a0-7ff48a60ce84'),
    '8fa': get_transcript_data('8fa9d311-01e9-4b9d-903e-e42d751520ce'),
}
print("Transcripts loaded.")

def get_tool_call(cid, step_idx):
    data = transcripts[cid][step_idx]
    calls = data.get('tool_calls', [])
    if calls:
        return calls[0]
    return None

def apply_tc(content, tc, label=""):
    if not tc:
        print(f"  [ERROR] No tool call at {label}")
        return content
    name = tc.get('name')
    args = tc.get('args', {})
    c_norm = normalize(content)
    if name == 'replace_file_content':
        t_norm = normalize(args.get('TargetContent', ''))
        r_norm = normalize(args.get('ReplacementContent', ''))
        if t_norm in c_norm:
            c_norm = c_norm.replace(t_norm, r_norm, 1)
            print(f"  [OK] replace_file_content {label}")
            return c_norm
        else:
            print(f"  [FAIL] Target NOT found in {label}!")
            print(f"    Target preview: {repr(t_norm[:80])}")
            return content
    elif name == 'multi_replace_file_content':
        chunks = args.get('ReplacementChunks', [])
        for idx, chunk in enumerate(chunks):
            t_norm = normalize(chunk.get('TargetContent', ''))
            r_norm = normalize(chunk.get('ReplacementContent', ''))
            if t_norm in c_norm:
                c_norm = c_norm.replace(t_norm, r_norm, 1)
                print(f"  [OK] multi_replace chunk {idx} {label}")
            else:
                print(f"  [FAIL] Multi-replace chunk {idx} NOT found in {label}!")
                print(f"    Target preview: {repr(t_norm[:80])}")
        return c_norm
    else:
        print(f"  [UNKNOWN] {name} in {label}")
        return content

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

reconstructed = {}

# 1. slot.css
print("\nReconstructing src/styles/slot.css...")
c = get_head_file('src/styles/slot.css')
c = apply_tc(c, get_tool_call('dc6', 163), "dc6:163")
reconstructed['src/styles/slot.css'] = c

# 2. global.css
print("\nReconstructing src/styles/global.css...")
c = get_head_file('src/styles/global.css')
c = apply_tc(c, get_tool_call('2de', 90), "2de:90")
c = apply_tc(c, get_tool_call('2de', 96), "2de:96")
c = apply_tc(c, get_tool_call('dc6', 149), "dc6:149")
reconstructed['src/styles/global.css'] = c

# 3. effects.css
print("\nReconstructing src/styles/effects.css...")
c = get_head_file('src/styles/effects.css')
c = apply_tc(c, get_tool_call('2de', 194), "2de:194")
c = apply_tc(c, get_tool_call('dc6', 157), "dc6:157")
c = apply_tc(c, get_tool_call('dc6', 159), "dc6:159")
reconstructed['src/styles/effects.css'] = c

# 4. LeadPopupModal.jsx
print("\nReconstructing src/components/LeadPopupModal.jsx...")
c = transcripts['ae6'][86]['tool_calls'][0]['args']['CodeContent']
c = apply_tc(c, get_tool_call('ae6', 186), "ae6:186")
c = apply_tc(c, get_tool_call('dc6', 237), "dc6:237")
reconstructed['src/components/LeadPopupModal.jsx'] = c

# 5. AptitudeV2.jsx
print("\nReconstructing src/pages/AptitudeV2.jsx...")
# find write_to_file in 8fa
c = None
for row in transcripts['8fa']:
    for tc in row.get('tool_calls', []):
        if tc.get('name') == 'write_to_file' and 'AptitudeV2.jsx' in str(tc.get('args', {}).get('TargetFile')):
            c = tc['args']['CodeContent']
            break
# clean-aptitude replacements
c = c.replace('text-emerald-400', 'text-white')
c = c.replace('text-emerald-300', 'text-white')
c = c.replace('text-emerald-200', 'text-white')
c = c.replace('bg-emerald-500/20', 'bg-sky-500/20')
c = c.replace('bg-emerald-500/10', 'bg-sky-500/10')
c = c.replace('bg-emerald-500/15', 'bg-sky-500/15')
c = c.replace('border-emerald-500/40', 'border-sky-400/40')
c = c.replace('border-emerald-500/25', 'border-sky-400/25')
c = c.replace('border-emerald-500/20', 'border-sky-400/20')
c = c.replace('hover:bg-emerald-500/30', 'hover:bg-sky-500/30')
c = run_transform(c, 'src/pages/AptitudeV2.jsx')
c = apply_tc(c, get_tool_call('dc6', 215), "dc6:215")
reconstructed['src/pages/AptitudeV2.jsx'] = c

# 6. App.js
print("\nReconstructing src/App.js...")
c = get_head_file('src/App.js')
c = apply_tc(c, get_tool_call('ae6', 110), "ae6:110")
c = apply_tc(c, get_tool_call('ae6', 132), "ae6:132")
c = apply_tc(c, get_tool_call('2de', 104), "2de:104")
c = apply_tc(c, get_tool_call('dc6', 145), "dc6:145")
reconstructed['src/App.js'] = c

# 7. Navbar.jsx
print("\nReconstructing src/components/Navbar.jsx...")
c = get_head_file('src/components/Navbar.jsx')
c = run_transform(c, 'src/components/Navbar.jsx')
c = apply_tc(c, get_tool_call('dc6', 179), "dc6:179")
c = apply_tc(c, get_tool_call('dc6', 181), "dc6:181")
reconstructed['src/components/Navbar.jsx'] = c

# 8. Footer.jsx
print("\nReconstructing src/components/Footer.jsx...")
c = get_head_file('src/components/Footer.jsx')
c = run_transform(c, 'src/components/Footer.jsx')
c = apply_tc(c, get_tool_call('dc6', 233), "dc6:233")
reconstructed['src/components/Footer.jsx'] = c

# 9. OurEventsSection.jsx
print("\nReconstructing src/components/OurEventsSection.jsx...")
c = get_head_file('src/components/OurEventsSection.jsx')
c = run_transform(c, 'src/components/OurEventsSection.jsx')
c = apply_tc(c, get_tool_call('dc6', 173), "dc6:173")
c = apply_tc(c, get_tool_call('dc6', 229), "dc6:229")
reconstructed['src/components/OurEventsSection.jsx'] = c

# 10. AdVideoSection.jsx
print("\nReconstructing src/components/AdVideoSection.jsx...")
c = get_head_file('src/components/AdVideoSection.jsx')
c = apply_tc(c, get_tool_call('ae6', 190), "ae6:190")
c = run_transform(c, 'src/components/AdVideoSection.jsx')
c = apply_tc(c, get_tool_call('dc6', 187), "dc6:187")
c = apply_tc(c, get_tool_call('dc6', 189), "dc6:189")
reconstructed['src/components/AdVideoSection.jsx'] = c

# 11. Admission.jsx
print("\nReconstructing src/pages/Admission.jsx...")
c = get_head_file('src/pages/Admission.jsx')
c = run_transform(c, 'src/pages/Admission.jsx')
c = apply_tc(c, get_tool_call('dc6', 193), "dc6:193")
reconstructed['src/pages/Admission.jsx'] = c

# 12. AiBoosterProgram.jsx
print("\nReconstructing src/pages/AiBoosterProgram.jsx...")
c = get_head_file('src/pages/AiBoosterProgram.jsx')
c = apply_tc(c, get_tool_call('ae6', 275), "ae6:275")
c = apply_tc(c, get_tool_call('ae6', 281), "ae6:281")
c = apply_tc(c, get_tool_call('ae6', 287), "ae6:287")
c = apply_tc(c, get_tool_call('ae6', 292), "ae6:292")
c = run_transform(c, 'src/pages/AiBoosterProgram.jsx')
c = apply_tc(c, get_tool_call('2de', 146), "2de:146")
c = apply_tc(c, get_tool_call('dc6', 191), "dc6:191")
reconstructed['src/pages/AiBoosterProgram.jsx'] = c

# 13. AiEasyAyiForm.jsx
print("\nReconstructing src/pages/AiEasyAyiForm.jsx...")
c = get_head_file('src/pages/AiEasyAyiForm.jsx')
c = apply_tc(c, get_tool_call('ae6', 329), "ae6:329")
c = apply_tc(c, get_tool_call('ae6', 333), "ae6:333")
c = apply_tc(c, get_tool_call('ae6', 339), "ae6:339")
c = apply_tc(c, get_tool_call('ae6', 343), "ae6:343")
c = apply_tc(c, get_tool_call('ae6', 349), "ae6:349")
c = apply_tc(c, get_tool_call('ae6', 353), "ae6:353")
c = apply_tc(c, get_tool_call('ae6', 355), "ae6:355")
c = apply_tc(c, get_tool_call('ae6', 359), "ae6:359")
c = run_transform(c, 'src/pages/AiEasyAyiForm.jsx')
c = apply_tc(c, get_tool_call('2de', 154), "2de:154")
c = apply_tc(c, get_tool_call('2de', 156), "2de:156")
c = apply_tc(c, get_tool_call('2de', 158), "2de:158")
c = apply_tc(c, get_tool_call('dc6', 169), "dc6:169")
c = apply_tc(c, get_tool_call('dc6', 223), "dc6:223")
reconstructed['src/pages/AiEasyAyiForm.jsx'] = c

# 14. Aptitude.jsx
print("\nReconstructing src/pages/Aptitude.jsx...")
c = get_head_file('src/pages/Aptitude.jsx')
c = apply_tc(c, get_tool_call('ae6', 295), "ae6:295")
c = apply_tc(c, get_tool_call('ae6', 301), "ae6:301")
c = apply_tc(c, get_tool_call('ae6', 303), "ae6:303")
c = run_transform(c, 'src/pages/Aptitude.jsx')
c = apply_tc(c, get_tool_call('dc6', 209), "dc6:209")
reconstructed['src/pages/Aptitude.jsx'] = c

# 15. Blog.jsx
print("\nReconstructing src/pages/Blog.jsx...")
c = get_head_file('src/pages/Blog.jsx')
c = run_transform(c, 'src/pages/Blog.jsx')
c = apply_tc(c, get_tool_call('dc6', 203), "dc6:203")
reconstructed['src/pages/Blog.jsx'] = c

# 16. Contact.jsx
print("\nReconstructing src/pages/Contact.jsx...")
c = get_head_file('src/pages/Contact.jsx')
c = run_transform(c, 'src/pages/Contact.jsx')
c = apply_tc(c, get_tool_call('dc6', 199), "dc6:199")
reconstructed['src/pages/Contact.jsx'] = c

# 17. Programs.jsx
print("\nReconstructing src/pages/Programs.jsx...")
c = get_head_file('src/pages/Programs.jsx')
c = run_transform(c, 'src/pages/Programs.jsx')
c = apply_tc(c, get_tool_call('dc6', 195), "dc6:195")
reconstructed['src/pages/Programs.jsx'] = c

# 18. Scholarship.jsx
print("\nReconstructing src/pages/Scholarship.jsx...")
c = get_head_file('src/pages/Scholarship.jsx')
c = apply_tc(c, get_tool_call('ae6', 246), "ae6:246")
c = apply_tc(c, get_tool_call('ae6', 248), "ae6:248")
c = apply_tc(c, get_tool_call('ae6', 259), "ae6:259")
c = apply_tc(c, get_tool_call('ae6', 263), "ae6:263")
c = apply_tc(c, get_tool_call('ae6', 265), "ae6:265")
c = run_transform(c, 'src/pages/Scholarship.jsx')
c = apply_tc(c, get_tool_call('2de', 162), "2de:162")
c = apply_tc(c, get_tool_call('dc6', 197), "dc6:197")
reconstructed['src/pages/Scholarship.jsx'] = c

print("\nReconstruction dry run complete! Files verified:", len(reconstructed))
