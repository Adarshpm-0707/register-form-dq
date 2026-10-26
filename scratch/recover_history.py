import json, os, subprocess

conversations_chrono = [
    'b9dc0705-e32c-4c99-856d-50506ed71d95',
    'ae6c3de5-642e-4889-ae44-22b688069168',
    '2de0dfe4-3530-4a6b-a02e-0cdc2cdd41c5',
    'dc62835f-02ad-419c-b7a0-7ff48a60ce84'
]

brain = r'C:\Users\adhua\.gemini\antigravity-ide\brain'

target_files = [
    'src/App.js',
    'src/components/AdVideoSection.jsx',
    'src/components/Footer.jsx',
    'src/components/LeadPopupModal.jsx',
    'src/components/Navbar.jsx',
    'src/components/OurEventsSection.jsx',
    'src/pages/Admission.jsx',
    'src/pages/AiBoosterProgram.jsx',
    'src/pages/AiEasyAyiForm.jsx',
    'src/pages/Aptitude.jsx',
    'src/pages/AptitudeV2.jsx',
    'src/pages/Blog.jsx',
    'src/pages/Contact.jsx',
    'src/pages/Programs.jsx',
    'src/pages/Scholarship.jsx',
    'src/styles/effects.css',
    'src/styles/global.css',
    'src/styles/slot.css'
]

for tf in target_files:
    fname = os.path.basename(tf)
    actions = []
    for cid in conversations_chrono:
        p = os.path.join(brain, cid, '.system_generated', 'logs', 'transcript_full.jsonl')
        if not os.path.exists(p):
            continue
        with open(p, 'r', encoding='utf-8') as f:
            for step_idx, line in enumerate(f):
                if fname in line:
                    data = json.loads(line)
                    if data.get('type') == 'PLANNER_RESPONSE':
                        for tc in data.get('tool_calls', []):
                            target = str(tc.get('args', {}).get('TargetFile', ''))
                            if fname == os.path.basename(target.replace('\\', '/')):
                                actions.append((cid[:8], step_idx, tc.get('name')))
    print(f"{tf:35} -> {len(actions)} edits: {actions}")
