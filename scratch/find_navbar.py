import json, os

brain = r'C:\Users\adhua\.gemini\antigravity-ide\brain'

for cid in os.listdir(brain):
    p = os.path.join(brain, cid, '.system_generated', 'logs', 'transcript_full.jsonl')
    if not os.path.exists(p): continue
    with open(p, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if 'aptitude-v2' in line and 'Navbar.jsx' in line:
                data = json.loads(line)
                for tc in data.get('tool_calls', []):
                    name = tc.get('name')
                    if name in ('write_to_file', 'replace_file_content'):
                        print(f"{cid} step {i}: {name} -> {tc.get('args', {}).get('TargetFile')}")
