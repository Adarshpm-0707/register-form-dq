import json
p = r'C:\Users\adhua\.gemini\antigravity-ide\brain\9f08c6b5-babb-4c32-93e2-2616e75a7d50\.system_generated\logs\transcript_full.jsonl'
with open(p, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        data = json.loads(line)
        for tc in data.get('tool_calls', []):
            if tc.get('name') in ('write_to_file', 'replace_file_content', 'multi_replace_file_content'):
                tf = tc.get('args', {}).get('TargetFile')
                print(f"step {i}: {tc.get('name')} -> {tf}")
