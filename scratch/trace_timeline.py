import json, os, datetime

brain = r'C:\Users\adhua\.gemini\antigravity-ide\brain'

target_files = {
    'App.js', 'AdVideoSection.jsx', 'Footer.jsx', 'LeadPopupModal.jsx',
    'Navbar.jsx', 'OurEventsSection.jsx', 'Admission.jsx', 'AiBoosterProgram.jsx',
    'AiEasyAyiForm.jsx', 'Aptitude.jsx', 'AptitudeV2.jsx', 'Blog.jsx',
    'Contact.jsx', 'Programs.jsx', 'Scholarship.jsx', 'effects.css',
    'global.css', 'slot.css'
}

conv_info = []

for cid in os.listdir(brain):
    p = os.path.join(brain, cid, '.system_generated', 'logs', 'transcript_full.jsonl')
    if os.path.exists(p):
        try:
            with open(p, 'r', encoding='utf-8') as f:
                first_line = f.readline()
                if first_line:
                    d = json.loads(first_line)
                    t_str = d.get('created_at', '')
                    conv_info.append((t_str, cid, p))
        except:
            pass

conv_info.sort(key=lambda x: x[0])

print(f"Total conversations found: {len(conv_info)}")
# Filter to recent ones (e.g. from Oct 20-22)
recent_convs = [c for c in conv_info if c[0] >= '2026-10-20']
print(f"Recent conversations (Oct 20-22): {len(recent_convs)}")

file_timeline = {f: [] for f in target_files}

for t_str, cid, p in recent_convs:
    with open(p, 'r', encoding='utf-8') as f:
        for step_idx, line in enumerate(f):
            if any(f in line for f in target_files):
                data = json.loads(line)
                for tc in data.get('tool_calls', []):
                    name = tc.get('name')
                    if name in ('write_to_file', 'replace_file_content', 'multi_replace_file_content'):
                        tf = os.path.basename(str(tc.get('args', {}).get('TargetFile', '')).replace('\\', '/'))
                        if tf in target_files:
                            file_timeline[tf].append((t_str, cid, step_idx, name, tc))

for tf, events in sorted(file_timeline.items()):
    print(f"\n=== {tf} ({len(events)} events) ===")
    for t_str, cid, step, name, tc in events:
        print(f"  {t_str} [{cid[:8]}] step {step}: {name}")
