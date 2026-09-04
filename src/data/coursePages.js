export const COURSE_PAGES = [
  {
    id: "ai-course",
    slug: "ai-course",
    badge: "Diploma Programme",
    title: "AI / ML & Generative AI — 6-Month Professional Diploma Programme",
    subtitle: "AI isn't coming — it's already here, and the gap between people who use AI tools and people who can build with them is where careers are being made right now. DeepStaq's AI Course is built for exactly that gap: a structured, hands-on, six-month path that takes you from zero coding experience to shipping your own AI/ML capstone project.",
    tagline: "No prior experience required. Whether you're from engineering, business, education, or a completely different background, this course gives you the foundation, the tools, and the hands-on practice to become an AI builder.",
    targetKeyword: "ai course",
    pageType: "Course / Landing Page",
    metaTitle: "AI Course in Kerala | 6-Month AI/ML & GenAI Diploma – DeepStaq",
    metaDescription: "Become an AI Builder in 6 months. DeepStaq's hands-on AI/ML & Generative AI diploma covers Python to agentic AI, RAG & LLM fine-tuning. No coding experience needed.",
    
    whyDeepStaq: {
      title: "Why DeepStaq",
      description: "DeepStaq is an institute built for the next generation of AI practitioners. We sit at the intersection of rigorous technical education and real-world application — for people who want to understand how artificial intelligence actually works, and how to build with it.",
      mission: "Our mission is to make deep AI/ML knowledge accessible, structured, and actionable. Through a comprehensive, hands-on curriculum that takes learners from programming fundamentals all the way through to generative AI and agentic systems, we bridge the gap between theory and real-world practice. Every month builds on the last — with projects, industry-relevant tooling, and a final capstone that learners take into the world as proof of what they can build.",
      vision: "Our vision is to be the leading institute for practical AI education — producing professionals who don't just understand artificial intelligence, but build intelligent systems that solve real problems in the real world."
    },

    formatStructure: [
      { detail: "Duration", info: "6 months core curriculum + ~2 weeks capstone" },
      { detail: "Schedule", info: "3 sessions/week, 2 hours/session (6 hrs/week)" },
      { detail: "Total Instruction Time", info: "~160 hours" },
      { detail: "Format", info: "Instructor-led, with a monthly guest session from an industry professional" },
      { detail: "Prerequisites", info: "None — designed for complete beginners" },
      { detail: "Final Assessment", info: "60% Capstone Project + 40% Theory" }
    ],

    guestSessionNote: "Every month of the programme includes a dedicated session led by an industry professional working in that month's area of study — bringing real-world context, current industry practice, and direct interaction with people actively building in the field, alongside the core instructor-led curriculum.",

    syllabus: [
      {
        month: "Month 1",
        title: "Programming Foundation (Python)",
        description: "Core syntax & control flow, data structures (lists, dictionaries, sets), functions & recursion, an introduction to multithreading/asyncio — capped off with a hands-on Python project."
      },
      {
        month: "Month 2",
        title: "Math, Data & Visualisation",
        description: "Probability & statistics essentials, NumPy & Pandas, data visualisation (Matplotlib/Seaborn), data cleaning, feature engineering & preprocessing."
      },
      {
        month: "Month 3",
        title: "Machine Learning",
        description: "Regression & classification, decision trees & random forests, KNN, SVM, gradient boosting, clustering & PCA, model evaluation & cross-validation."
      },
      {
        month: "Month 4",
        title: "Deep Learning & NLP",
        description: "Neural network fundamentals, activation functions & backpropagation, CNNs & RNNs, LSTMs/GRUs — with hands-on work in TensorFlow, Keras, and PyTorch."
      },
      {
        month: "Month 5",
        title: "Generative AI & LLMs",
        description: "NLP foundations & embeddings, transformers & attention, the BERT/GPT family, large language models, and fine-tuning techniques (LoRA, QLoRA, PEFT)."
      },
      {
        month: "Month 6",
        title: "MLOps, Capstone & Advanced Topics",
        description: "Vector databases & RAG, agentic AI & tool calling, MLOps (Docker, FastAPI, CI/CD, monitoring), your capstone project, plus a closing survey of GANs, diffusion models & multimodal AI."
      }
    ],

    tools: [
      { name: "Python", desc: "Core programming language used throughout the programme" },
      { name: "FastAPI", desc: "Building REST APIs to serve ML models" },
      { name: "Docker", desc: "Containerizing and deploying ML applications" },
      { name: "OpenAI APIs", desc: "Working with LLMs for GenAI applications" },
      { name: "Claude, ChatGPT & Gemini", desc: "AI assistants for coding help, research & ideation" },
      { name: "Google Antigravity", desc: "AI-powered IDE for agentic coding workflows" },
      { name: "Cursor", desc: "AI-powered code editor for faster development" },
      { name: "Google Colab", desc: "Cloud-based notebooks for ML experimentation" }
    ],

    capstone: {
      title: "The Capstone Project",
      description: "The programme culminates in an end-to-end capstone project: an original AI/ML build of your choosing. Choose from a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM.",
      outcome: "You leave with something you actually built — not just a certificate.",
      breakdown: [
        { percentage: "60%", title: "Capstone Project", desc: "Assessed on the end-to-end build, including data handling, model implementation, evaluation, and deployment or RAG/agent components." },
        { percentage: "40%", title: "Theory", desc: "Assessed on conceptual understanding across the full curriculum, from programming foundations through to Generative AI and MLOps." }
      ]
    },

    careers: {
      title: "Where This Course Can Take You",
      description: "AI/ML talent is in serious demand, and the skill gap keeps widening. Here's what this programme can open up for you:",
      pathways: [
        "Machine Learning Engineer",
        "AI/ML Engineer",
        "NLP Engineer",
        "MLOps Engineer",
        "Data Scientist / Data Analyst",
        "Generative AI Engineer",
        "AI Product / Applied AI roles",
        "AI Research / Junior Research roles (with further specialization)"
      ],
      beyondJobs: [
        { title: "Crack a global career", desc: "AI/ML skills are in high global demand, equipping you for roles like ML Engineer, Data Scientist, GenAI Engineer, or MLOps Engineer worldwide." },
        { title: "Work remote", desc: "AI/ML roles are increasingly remote-friendly, letting you work for companies anywhere without relocating." },
        { title: "Become an AI entrepreneur", desc: "Hands-on experience building RAG apps, agents, and fine-tuned LLMs equips you to launch your own AI products or services." },
        { title: "Start freelancing", desc: "Offer AI/ML services like model building, RAG pipelines, chatbots, and data analysis, on your own time." },
        { title: "Move into AI consulting", desc: "Apply your applied AI skills to consulting and advisory work for businesses adopting AI." }
      ]
    },

    targetAudience: [
      "Complete beginners with zero coding background who want a structured path into AI",
      "Engineers and developers looking to specialize in AI/ML",
      "Business, education, or non-technical professionals who want to become AI builders, not just AI users",
      "Anyone serious about a career shift into Machine Learning Engineering, Data Science, or Generative AI"
    ],

    faqs: [
      {
        q: "Do I need coding experience to join this AI course?",
        a: "No. The programme is designed for a mixed audience with no prior experience required — Month 1 starts with Python programming fundamentals from scratch."
      },
      {
        q: "How long is the DeepStaq AI course?",
        a: "The core curriculum runs 6 months, plus approximately 2 additional weeks for the capstone project — around 160 hours of total instruction."
      },
      {
        q: "What will I have at the end of the course?",
        a: "A completed capstone project — a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM — plus a diploma based on your combined capstone and theory evaluation."
      },
      {
        q: "What jobs can I get after this course?",
        a: "Graduates are equipped to pursue roles such as Machine Learning Engineer, AI/ML Engineer, NLP Engineer, MLOps Engineer, Data Scientist, Generative AI Engineer, and Applied AI roles."
      },
      {
        q: "Does the course cover Generative AI and agentic AI?",
        a: "Yes. Month 5 covers Generative AI and LLM fine-tuning (LoRA, QLoRA, PEFT), and Month 6 covers RAG, vector databases, and agentic AI with tool calling."
      },
      {
        q: "How is the course graded?",
        a: "Final evaluation combines a 60% capstone project assessment and a 40% theory assessment covering the full curriculum."
      }
    ],

    ctaSection: {
      heading: "Future Won't Wait. Why Should You?",
      subheading: "AI/ML talent is in short supply and rising demand. Six months from now, you can either be watching this shift from the sidelines — or be the person building it.",
      btnText: "Enroll in DeepStaq's AI Course →"
    }
  },

  {
    id: "machine-learning-course",
    slug: "machine-learning-course",
    badge: "Specialized ML Diploma",
    title: "A 6-Month, Hands-On Machine Learning & AI Diploma Programme",
    subtitle: "Most machine learning courses teach you regression, classification, and a handful of algorithms — then leave you wondering how any of it connects to the AI tools actually shipping in the real world today. DeepStaq's programme is built differently: it takes you through rigorous ML fundamentals first, then carries that foundation forward into deep learning, generative AI, and agentic systems — so what you learn in Month 3 is still relevant in Month 6, not obsolete by it.",
    tagline: "No prior coding experience required. If you're serious about becoming a Machine Learning Engineer or Data Scientist — not just someone who can name a few algorithms — this is that path.",
    targetKeyword: "machine learning course",
    pageType: "Course / Landing Page",
    metaTitle: "Machine Learning Course in Kerala | Hands-On ML + GenAI Diploma – DeepStaq",
    metaDescription: "Learn Machine Learning hands-on — from Python and statistics to ML algorithms, deep learning, and real-world deployment. 6-month diploma, no coding experience needed.",

    whyDeepStaq: {
      title: "Why Learn Machine Learning With DeepStaq",
      description: "DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application. Our mission is to make deep ML/AI knowledge accessible, structured, and actionable — through a comprehensive, hands-on curriculum that takes learners from programming fundamentals all the way through to generative AI and agentic systems.",
      mission: "Every month builds on the last, with projects, industry-relevant tooling, and a final capstone that you take into the world as proof of what you can actually build — not just a certificate saying you sat through a course.",
      vision: "Our vision is to forge engineers capable of taking raw datasets, architecting intelligent pipelines, and deploying robust models into live production environments."
    },

    formatStructure: [
      { detail: "Duration", info: "6 months core curriculum + ~2 weeks capstone" },
      { detail: "Schedule", info: "3 sessions/week, 2 hours/session (6 hrs/week)" },
      { detail: "Total Instruction Time", info: "~160 hours" },
      { detail: "Format", info: "Instructor-led, with a monthly guest session from an industry professional" },
      { detail: "Prerequisites", info: "None — designed for complete beginners" },
      { detail: "Final Assessment", info: "60% Capstone Project + 40% Theory" }
    ],

    guestSessionNote: "Every month includes a dedicated session led by an industry professional working in that month's area — bringing real-world context and direct interaction with people actively building in the field, alongside the core instructor-led curriculum.",

    syllabus: [
      {
        month: "Month 1",
        title: "Programming Foundation (Python)",
        description: "Every ML course lives or dies on your ability to actually code the models, not just understand them conceptually. You'll cover core Python syntax & control flow, data structures (lists, dictionaries, sets), functions & recursion, and an intro to multithreading/asyncio — capped with a hands-on Python project."
      },
      {
        month: "Month 2",
        title: "Math, Data & Visualisation",
        description: "The statistics and data-handling foundation that separates people who can tune a model from people who just call .fit() without understanding what's happening. Covers probability & statistics essentials, NumPy & Pandas, data visualisation (Matplotlib/Seaborn), data cleaning, feature engineering & preprocessing."
      },
      {
        month: "Month 3",
        title: "Machine Learning (Core Module)",
        description: "The heart of the programme: Regression & classification, decision trees & random forests, KNN, SVM, gradient boosting, clustering & PCA, model evaluation & cross-validation. You'll select, train, tune, and evaluate models for real datasets."
      },
      {
        month: "Month 4",
        title: "Deep Learning & NLP",
        description: "Where classical ML hits its limits: neural network fundamentals, activation functions & backpropagation, CNNs & RNNs, LSTMs/GRUs — with hands-on work in TensorFlow, Keras, and PyTorch."
      },
      {
        month: "Month 5",
        title: "Generative AI & LLMs",
        description: "Extending your ML foundation into modern AI: NLP foundations & embeddings, transformers & attention, the BERT/GPT family, large language models, and fine-tuning techniques (LoRA, QLoRA, PEFT)."
      },
      {
        month: "Month 6",
        title: "MLOps, Capstone & Advanced Topics",
        description: "The step most ML courses skip: vector databases & RAG, agentic AI & tool calling, MLOps (Docker, FastAPI, CI/CD, monitoring), your capstone project, plus GANs, diffusion models & multimodal AI."
      }
    ],

    tools: [
      { name: "Python, NumPy & Pandas", desc: "For data handling and classical ML" },
      { name: "scikit-learn", desc: "Workflows for regression, classification, and clustering" },
      { name: "TensorFlow, Keras & PyTorch", desc: "For the deep learning & neural network modules" },
      { name: "FastAPI & Docker", desc: "For serving and deploying your trained models in production" },
      { name: "OpenAI APIs, Claude & Gemini", desc: "For GenAI application-building" },
      { name: "Google Colab", desc: "Cloud-based GPU notebooks for ML experimentation" },
      { name: "Cursor & Google Antigravity", desc: "AI-powered coding tools for faster development" }
    ],

    capstone: {
      title: "Your Machine Learning Capstone Project",
      description: "The programme culminates in an end-to-end capstone project of your choosing — including a classical ML pipeline built entirely on the skills from Month 3, if that's the direction you want to specialize in. Other options include an NLP/deep learning model or a domain-specific RAG application or fine-tuned LLM.",
      outcome: "You leave with a real, working project — evaluated on data handling, model implementation, and evaluation, not a multiple-choice quiz.",
      breakdown: [
        { percentage: "60%", title: "Capstone Project", desc: "Assessed on data handling, pipeline engineering, model performance, and live deployment." },
        { percentage: "40%", title: "Theory", desc: "Assessed on conceptual understanding from statistics through Generative AI and MLOps." }
      ]
    },

    careers: {
      title: "Career Paths This Machine Learning Course Opens Up",
      description: "Because the curriculum doesn't stop at classical ML, graduates aren't limited to entry-level ML roles — the deep learning, GenAI, and MLOps months make you competitive for broader AI/ML Engineer and Applied AI positions too, not just narrow 'data cleaning' work.",
      pathways: [
        "Machine Learning Engineer",
        "Data Scientist / Data Analyst",
        "AI/ML Engineer",
        "NLP Engineer",
        "MLOps Engineer",
        "Generative AI Engineer",
        "AI Product / Applied AI roles"
      ],
      beyondJobs: [
        { title: "Production Model Engineering", desc: "Build pipelines from raw telemetry data straight into live prediction endpoints." },
        { title: "High-Demand Specialization", desc: "Stand out from competitors who only know basic scikit-learn by mastering transformers and MLOps." },
        { title: "Global Freelance & Consulting", desc: "Deliver end-to-end ML predictive systems, customer churn models, and classification engines." }
      ]
    },

    targetAudience: [
      "Beginners with zero coding background who want a structured, guided path into ML",
      "Developers or engineers wanting to formally specialize in machine learning",
      "Data analysts looking to move into a full Data Scientist or ML Engineer role",
      "Anyone who's tried scattered free ML tutorials and wants a structured, hands-on program instead"
    ],

    faqs: [
      {
        q: "Is this a pure machine learning course, or does it include other topics?",
        a: "Machine learning (Month 3) is the core foundation of the programme, but the curriculum extends further — into deep learning, generative AI, and MLOps — so you graduate with a broader, more employable skill set than a standalone ML course alone would provide."
      },
      {
        q: "Do I need a math background to learn machine learning here?",
        a: "No prior background is required. Month 2 covers the probability, statistics, and data-handling foundations you need before the core ML module in Month 3."
      },
      {
        q: "What machine learning algorithms will I learn?",
        a: "Regression and classification, decision trees and random forests, KNN, SVM, gradient boosting, and clustering/PCA — along with proper model evaluation and cross-validation."
      },
      {
        q: "Will I be able to deploy the models I build?",
        a: "Yes. Month 6 covers MLOps — Docker, FastAPI, CI/CD, and monitoring — so you learn to actually ship a model, not just train one in a notebook."
      },
      {
        q: "How is the course graded?",
        a: "Final evaluation combines a 60% capstone project assessment and a 40% theory assessment covering the full curriculum."
      }
    ],

    ctaSection: {
      heading: "Future Won't Wait. Why Should You?",
      subheading: "Machine learning talent is in short supply and rising demand — and the practitioners who stand out are the ones who can go from raw data to a deployed model, not just recite algorithm names.",
      btnText: "Enroll in DeepStaq's Machine Learning Course →"
    }
  },

  {
    id: "ai-ml-course",
    slug: "ai-ml-course",
    badge: "Unified AI-ML Track",
    title: "AI / ML & Generative AI — 6-Month Professional Diploma Programme",
    subtitle: "Job listings don't ask for an 'AI course' or a 'machine learning course' separately anymore — they ask for AI-ML skills, together, in the same person. That's exactly the gap most single-focus courses miss: an ML-only course leaves you behind on GenAI and agents; an AI-only course often skips the statistical rigor that makes ML models actually work. DeepStaq's programme is built as one connected path — so you graduate with both, not a partial view of either.",
    tagline: "No prior coding experience required. Built for engineers, career-switchers, and complete beginners alike.",
    targetKeyword: "ai ml course",
    pageType: "Course / Landing Page",
    metaTitle: "AI-ML Course | Become an AI-ML Engineer in 6 Months – DeepStaq",
    metaDescription: "One diploma, two skill sets. DeepStaq's AI-ML course takes you from Python to deployed AI systems — covering both classical ML and modern GenAI, hands-on.",

    whyDeepStaq: {
      title: "Why 'AI-ML,' Not Just 'AI' or Just 'ML'",
      description: "Artificial Intelligence is the broad goal — machines performing tasks that require human-like intelligence. Machine Learning is the practical engine underneath most of it — models that learn patterns from data. Generative AI and agentic systems are built on top of solid ML foundations, not instead of them.",
      mission: "Employers hiring for 'AI-ML Engineer' roles want someone who can move fluidly across this whole stack — clean and prepare data, train and evaluate a classical model, and also fine-tune or deploy an LLM-based system when the problem calls for it. That's the actual skill set this course is built to produce.",
      vision: "To bridge the engineering gap between foundational statistics and autonomous multi-agent orchestration."
    },

    formatStructure: [
      { detail: "Duration", info: "6 months core curriculum + ~2 weeks capstone" },
      { detail: "Schedule", info: "3 sessions/week, 2 hours/session (~6 hrs/week)" },
      { detail: "Total Instruction Time", info: "~160 total instruction hours" },
      { detail: "Format", info: "Live Instructor-Led + Monthly Industry Professional Sessions" },
      { detail: "Prerequisites", info: "None — beginner-friendly" },
      { detail: "Final Assessment", info: "60% Capstone Project + 40% Theory" }
    ],

    guestSessionNote: "Monthly guest sessions from industry professionals provide real-world insights into production AI architectures and modern engineering practices.",

    outcomesList: [
      "Build and evaluate classical ML models (regression, classification, clustering) on real datasets",
      "Design and train neural networks for image and text tasks",
      "Fine-tune large language models using LoRA, QLoRA, and PEFT",
      "Build a RAG (Retrieval-Augmented Generation) application connected to real data",
      "Design and deploy an agentic AI system that plans and takes multi-step actions",
      "Package and deploy a trained model using Docker, FastAPI, and basic MLOps practices",
      "Present a completed, end-to-end capstone project as proof of what you can build"
    ],

    syllabus: [
      {
        month: "Month 1",
        title: "Programming Foundation",
        description: "Python, data structures, recursion, asyncio, and building robust foundational codebases."
      },
      {
        month: "Month 2",
        title: "Math, Data & Visualisation",
        description: "Statistics, probability, NumPy, Pandas, Matplotlib/Seaborn, and advanced feature engineering."
      },
      {
        month: "Month 3",
        title: "Machine Learning",
        description: "Regression, classification, ensemble trees, clustering, cross-validation, and performance tuning."
      },
      {
        month: "Month 4",
        title: "Deep Learning & NLP",
        description: "Neural networks, CNNs, RNNs, LSTMs, and model development in TensorFlow and PyTorch."
      },
      {
        month: "Month 5",
        title: "Generative AI & LLMs",
        description: "Transformers, attention mechanisms, LLMs, and parameter-efficient fine-tuning (LoRA/QLoRA/PEFT)."
      },
      {
        month: "Month 6",
        title: "MLOps, Capstone & Advanced Topics",
        description: "RAG architectures, agentic AI, Docker, FastAPI, CI/CD, and your production-ready capstone build."
      }
    ],

    tools: [
      { name: "Python, NumPy & Pandas", desc: "Data processing and vector math" },
      { name: "TensorFlow & PyTorch", desc: "Deep neural network architectures" },
      { name: "FastAPI & Docker", desc: "Production API serving and microservices" },
      { name: "OpenAI & Vector DBs", desc: "Vector indexing, embeddings, and RAG pipelines" },
      { name: "Claude, ChatGPT & Gemini", desc: "AI agents & LLM tooling" },
      { name: "Cursor & Google Antigravity", desc: "Modern agentic IDE workflows" }
    ],

    capstone: {
      title: "Your Capstone: Proof, Not Just a Certificate",
      description: "The programme ends with an original, end-to-end capstone project — your choice of a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM. You leave with something real you built, evaluated on data handling, model implementation, and deployment or RAG/agent components — not a multiple-choice exam alone.",
      outcome: "Final grading: 60% Capstone Project + 40% Theory covering the full curriculum.",
      breakdown: [
        { percentage: "60%", title: "Capstone Project", desc: "Real architecture, data ingestion, tuning, and API serving." },
        { percentage: "40%", title: "Theory & Core Concepts", desc: "Conceptual understanding of mathematical & architectural fundamentals." }
      ]
    },

    careers: {
      title: "Career Outcomes: What 'AI-ML Engineer' Actually Opens Up",
      description: "Because you're not siloed into either 'just ML' or 'just GenAI,' you're a stronger fit for the broad, cross-functional job descriptions that dominate current AI-ML hiring:",
      pathways: [
        "Machine Learning Engineer",
        "AI/ML Engineer",
        "Data Scientist / Data Analyst",
        "NLP Engineer",
        "Generative AI Engineer",
        "MLOps Engineer",
        "AI Product / Applied AI roles",
        "AI Research / Junior Research roles (with further specialization)"
      ],
      beyondJobs: [
        { title: "Global remote roles", desc: "AI-ML roles are increasingly remote-friendly, letting you work for companies anywhere." },
        { title: "AI entrepreneurship", desc: "Build and launch your own AI products using RAG, agents, and fine-tuned models." },
        { title: "Freelancing", desc: "Offer model building, RAG pipelines, chatbot, and data analysis services independently." },
        { title: "AI consulting", desc: "Advise businesses adopting AI/ML with real, hands-on credibility." }
      ]
    },

    targetAudience: [
      "Beginners who want one structured path instead of stitching together separate AI and ML courses",
      "Developers and engineers looking to formally cross into AI/ML roles",
      "Data analysts aiming for a full ML Engineer or Data Scientist title",
      "Career switchers from any background — no coding experience required to start"
    ],

    faqs: [
      {
        q: "What's the difference between an 'AI course' and an 'AI-ML course'?",
        a: "In practice, very little when the course is built right — but many standalone courses focus narrowly on one side. This programme is explicitly structured to cover both classical machine learning and modern AI (deep learning, GenAI, agentic systems) in one connected 6-month path."
      },
      {
        q: "Is this course beginner-friendly?",
        a: "Yes. No prior coding or math background is required — Month 1 starts with Python fundamentals from zero."
      },
      {
        q: "Will I learn both traditional ML algorithms and modern GenAI/LLMs?",
        a: "Yes. Month 3 covers classical ML (regression, classification, clustering, ensembles), and Months 5–6 cover LLMs, fine-tuning, RAG, and agentic AI."
      },
      {
        q: "What job titles can I apply for after this course?",
        a: "Machine Learning Engineer, AI/ML Engineer, Data Scientist, NLP Engineer, Generative AI Engineer, MLOps Engineer, and Applied AI roles."
      },
      {
        q: "How long does the course take, and how is it graded?",
        a: "6 months of core curriculum plus ~2 weeks for the capstone (~160 total hours), graded 60% on the capstone project and 40% on theory."
      }
    ],

    ctaSection: {
      heading: "Future Won't Wait. Why Should You?",
      subheading: "The market isn't hiring for 'AI people' and 'ML people' separately anymore — it's hiring for people who can do both. Six months from now, you can be one of them.",
      btnText: "Enroll in DeepStaq's AI-ML Course →"
    }
  },

  {
    id: "offline-ai-course",
    slug: "offline-ai-course",
    badge: "In-Person Classroom Cohort",
    title: "AI / ML & Generative AI — 6-Month Professional Diploma Programme, In-Person",
    subtitle: "Free YouTube tutorials and self-paced online courses have a real problem: nobody's in the room when you get stuck. DeepStaq's AI course is built the other way — in-person, classroom-based, with instructors and industry mentors physically present, and a room full of peers hitting the same bugs and building alongside you.",
    tagline: "If you've tried learning AI online and stalled out somewhere around 'why doesn't my model converge,' this is the format built to actually get you unstuck.",
    locationBadge: "📍 Campus Location — Kerala (Kannur)",
    targetKeyword: "offline ai course",
    pageType: "Course / Landing Page (Local SEO)",
    metaTitle: "Offline AI Course in Kerala | In-Person AI/ML Diploma – DeepStaq",
    metaDescription: "Learn AI/ML in a real classroom, not a video queue. DeepStaq's offline AI course pairs hands-on, in-person instruction with industry mentors. 6-month diploma.",

    whyDeepStaq: {
      title: "Why Learn AI Offline, In-Person",
      description: "DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application — for people who want to understand how artificial intelligence actually works, and how to build with it.",
      mission: "Our mission is to make deep AI/ML knowledge accessible, structured, and actionable through a comprehensive, hands-on curriculum — bridging the gap between theory and real-world practice, one in-person session at a time. We stay current because the field demands it, and we build community because the best builders don't work alone.",
      vision: "To cultivate an immersive engineering environment where physical cohort collaboration accelerates learning 10x."
    },

    offlineAdvantages: [
      {
        title: "Real-time doubt clearing",
        desc: "When your code breaks or a concept doesn't click, an instructor is right there — not a comment thread you're hoping someone answers."
      },
      {
        title: "A cohort, not a subscriber count",
        desc: "You're learning alongside the same group of people for six months — the kind of peer environment that turns into a professional network, not just classmates you never speak to again."
      },
      {
        title: "Structured accountability",
        desc: "Fixed class timings (3 sessions/week) build a real learning habit — the single biggest reason self-paced online learners drop off is the absence of exactly this structure."
      },
      {
        title: "Hands-on guidance on real infrastructure",
        desc: "Deep learning, fine-tuning, and GPU-based training go a lot smoother with someone physically walking you through your first setup, rather than debugging alone from a forum thread."
      },
      {
        title: "Direct access to industry mentors",
        desc: "Every month includes a session led by a working industry professional in that month's subject area — in the room, answering questions live."
      }
    ],

    formatStructure: [
      { detail: "Format", info: "In-person, instructor-led classroom sessions" },
      { detail: "Schedule", info: "3 sessions/week, 2 hours/session" },
      { detail: "Weekly Instruction", info: "6 hours" },
      { detail: "Total Duration", info: "6 months core curriculum + ~2 weeks capstone (~160 total hours)" },
      { detail: "Class Size", info: "Small cohort-based learning" },
      { detail: "Guest Sessions", info: "Monthly, led by an industry professional in that month's focus area" },
      { detail: "Prerequisites", info: "None — beginner-friendly" }
    ],

    guestSessionNote: "Small batch size ensures personal attention and direct hardware support during GPU training sessions.",

    syllabus: [
      { month: "Month 1", title: "Programming Foundation (Python)", description: "Core syntax, data structures, functions & recursion, capped with an in-class Python project." },
      { month: "Month 2", title: "Math, Data & Visualisation", description: "Statistics, NumPy, Pandas, data cleaning & feature engineering with real datasets." },
      { month: "Month 3", title: "Machine Learning", description: "Regression, classification, decision trees, SVM, clustering, model evaluation." },
      { month: "Month 4", title: "Deep Learning & NLP", description: "Neural networks, CNNs, RNNs, hands-on TensorFlow/Keras/PyTorch in the lab." },
      { month: "Month 5", title: "Generative AI & LLMs", description: "Transformers, LLMs, fine-tuning (LoRA, QLoRA, PEFT) on workstation GPUs." },
      { month: "Month 6", title: "MLOps, Capstone & Advanced Topics", description: "RAG, agentic AI, Docker, FastAPI, and your live capstone project presentation." }
    ],

    capstone: {
      title: "Your In-Person Capstone Project",
      description: "The programme ends with an end-to-end capstone project — presented and reviewed in person, not just submitted through a portal. Choose from a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM.",
      outcome: "Final evaluation: 60% Capstone Project + 40% Theory, covering the full curriculum from programming foundations through Generative AI and MLOps.",
      breakdown: [
        { percentage: "60%", title: "Capstone Live Review", desc: "Evaluated in-person on system architecture, model accuracy, and real-time execution." },
        { percentage: "40%", title: "Theory Assessment", desc: "Comprehensive review covering algorithms, calculus/statistics concepts, and AI architecture." }
      ]
    },

    careers: {
      title: "Career Outcomes",
      description: "Graduates are equipped to pursue roles including Machine Learning Engineer, AI/ML Engineer, Data Scientist, NLP Engineer, MLOps Engineer, Generative AI Engineer, and Applied AI roles — with the added advantage of an in-person peer and mentor network built over six months, not just a certificate.",
      pathways: [
        "Machine Learning Engineer",
        "AI/ML Engineer",
        "Data Scientist / Data Analyst",
        "NLP Engineer",
        "MLOps Engineer",
        "Generative AI Engineer",
        "Applied AI Developer"
      ]
    },

    targetAudience: [
      "People who've tried self-paced online courses before and didn't finish them",
      "Beginners who want structure and accountability, not an open-ended playlist",
      "Anyone who learns faster by asking questions out loud than by pausing a video",
      "Career switchers who want a genuine cohort and local professional network, not just a login"
    ],

    faqs: [
      {
        q: "Is this course fully offline, or is there any online component?",
        a: "The core programme is delivered in-person through classroom-based instructor-led sessions, 3 times a week."
      },
      {
        q: "Where is the DeepStaq campus located?",
        a: "DeepStaq campus is located in Kerala (Kannur) — contact admissions at +91 949 595 7011 for exact campus directions and orientation schedules."
      },
      {
        q: "Do I need to attend every session in person?",
        a: "Yes — the in-person format is central to how the programme works, from real-time doubt-clearing to hands-on infrastructure guidance and the cohort-based learning environment."
      },
      {
        q: "Is offline learning better than online for beginners?",
        a: "For many beginners, yes — in-person structure, fixed timings, and immediate access to instructors address the biggest reasons self-paced online learners tend to stall out. That said, it comes down to your own learning style and schedule."
      },
      {
        q: "What's the difference between this and DeepStaq's general AI course page?",
        a: "Same programme and curriculum — this page focuses specifically on the in-person, classroom-based learning experience. See the full AI course page for the complete syllabus and career details."
      }
    ],

    ctaSection: {
      heading: "Future Won't Wait. Why Should You?",
      subheading: "Some things are genuinely better learned in a room with other people — AI is one of them.",
      btnText: "Enroll in DeepStaq's Offline AI Course →"
    }
  },

  {
    id: "ai-course-kannur",
    slug: "ai-course-kannur",
    badge: "Kannur Campus Hub",
    title: "AI / ML & Generative AI — 6-Month Professional Diploma Programme, Kannur",
    subtitle: "Looking for a serious, hands-on AI course in Kannur — not another link to a generic online video subscription? DeepStaq runs an in-person, instructor-led AI/ML diploma right here, built for people who want to actually build AI systems, not just watch someone else build them on a screen.",
    tagline: "No prior coding experience required. Open to students, engineers, career-switchers, and working professionals across Kannur and North Kerala.",
    locationBadge: "📍 Kannur, Kerala Campus",
    targetKeyword: "ai course kannur",
    pageType: "Course / Landing Page (Local SEO)",
    metaTitle: "AI Course in Kannur | 6-Month AI/ML & GenAI Diploma – DeepStaq",
    metaDescription: "Learn AI/ML in Kannur with DeepStaq's hands-on, in-person 6-month diploma — Python to agentic AI, RAG & LLM fine-tuning. No prior coding experience needed.",

    whyDeepStaq: {
      title: "Why Learn AI in Kannur With DeepStaq",
      description: "DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application — for people who want to understand how artificial intelligence actually works, and how to build with it.",
      mission: "Our programme is designed for a mixed audience: no prior experience required. Whether you're coming from engineering, business, education, or any other background, DeepStaq gives you the foundation, tools, and hands-on practice to become an AI builder — right here, without needing to leave Kannur.",
      vision: "Empowering North Kerala's talent to build world-class AI products and access global remote careers."
    },

    offlineAdvantages: [
      {
        title: "No relocation needed",
        desc: "Get industry-relevant AI/ML training without moving to Bangalore, Kochi, or Hyderabad for a bootcamp."
      },
      {
        title: "In-person, classroom-based learning",
        desc: "Real instructors and industry mentors in the room — not a video queue you fall behind on."
      },
      {
        title: "A local peer cohort",
        desc: "Learn alongside others from Kannur and the surrounding region, building a professional network you can actually meet up with after class."
      },
      {
        title: "A genuinely current curriculum",
        desc: "From Python fundamentals through classical ML, deep learning, generative AI, fine-tuning, and agentic AI — not a syllabus that stopped updating two years ago."
      }
    ],

    formatStructure: [
      { detail: "Location", info: "Kannur, Kerala" },
      { detail: "Format", info: "In-person, instructor-led classroom sessions" },
      { detail: "Duration", info: "6 months core curriculum + ~2 weeks capstone" },
      { detail: "Schedule", info: "3 sessions/week, 2 hours/session (6 hrs/week)" },
      { detail: "Total Instruction Time", info: "~160 hours" },
      { detail: "Prerequisites", info: "None — beginner-friendly" },
      { detail: "Final Assessment", info: "60% Capstone Project + 40% Theory" }
    ],

    guestSessionNote: "Every month includes a dedicated session led by an industry professional working in that month's area of study — bringing real-world context and direct interaction with practitioners actively building in the field.",

    syllabus: [
      { month: "Month 1", title: "Programming Foundation (Python)", description: "Core syntax, data structures, functions & recursion, capped with a Python project." },
      { month: "Month 2", title: "Math, Data & Visualisation", description: "Probability & statistics, NumPy, Pandas, data cleaning & feature engineering." },
      { month: "Month 3", title: "Machine Learning", description: "Regression, classification, decision trees, SVM, gradient boosting, clustering, model evaluation." },
      { month: "Month 4", title: "Deep Learning & NLP", description: "Neural networks, CNNs, RNNs, hands-on TensorFlow/Keras/PyTorch in the lab." },
      { month: "Month 5", title: "Generative AI & LLMs", description: "Transformers, LLMs, fine-tuning (LoRA, QLoRA, PEFT)." },
      { month: "Month 6", title: "MLOps, Capstone & Advanced Topics", description: "Vector databases, RAG, agentic AI, Docker, FastAPI, capstone project." }
    ],

    tools: [
      { name: "Python, NumPy & Pandas", desc: "Data processing & analytics" },
      { name: "TensorFlow & PyTorch", desc: "Deep Learning architectures" },
      { name: "FastAPI & Docker", desc: "Production containerization" },
      { name: "OpenAI & Vector DBs", desc: "RAG & LLM toolcalling" },
      { name: "Claude, ChatGPT & Gemini", desc: "Agentic development assistants" },
      { name: "Cursor & Google Antigravity", desc: "Next-gen AI coding tools" },
      { name: "Google Colab", desc: "Cloud GPU experimentation" }
    ],

    capstone: {
      title: "Your Capstone Project in Kannur",
      description: "The programme ends with an original, end-to-end capstone project — a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM. You leave with something you actually built, presented and reviewed in person, not just a certificate.",
      outcome: "Final grading: 60% Capstone Project + 40% Theory, covering the full curriculum from programming foundations through Generative AI and MLOps.",
      breakdown: [
        { percentage: "60%", title: "Capstone Project", desc: "Hands-on build presented live in the Kannur classroom to mentors." },
        { percentage: "40%", title: "Theory Assessment", desc: "Comprehensive conceptual mastery from Python to MLOps." }
      ]
    },

    careers: {
      title: "Career Outcomes for Kannur Graduates",
      description: "Because most AI/ML roles are increasingly remote-friendly, completing this course in Kannur doesn't limit you to local opportunities — graduates can pursue global remote roles, freelance AI/ML work, AI consulting, or launch their own AI products, all without relocating.",
      pathways: [
        "Machine Learning Engineer",
        "AI/ML Engineer",
        "Data Scientist / Data Analyst",
        "NLP Engineer",
        "MLOps Engineer",
        "Generative AI Engineer",
        "AI Product / Applied AI roles"
      ]
    },

    targetAudience: [
      "Students and recent graduates in Kannur looking to specialize before entering the job market",
      "Working professionals wanting to reskill into AI/ML without quitting their job or relocating",
      "Engineers and developers formally transitioning into AI/ML roles",
      "Complete beginners from any background — no coding experience required to start"
    ],

    faqs: [
      {
        q: "Is there an AI/ML course available in Kannur?",
        a: "Yes — DeepStaq runs an in-person, 6-month AI/ML & Generative AI diploma programme right here in Kannur, Kerala."
      },
      {
        q: "Do I need to relocate to take this course?",
        a: "No. The course is designed for people in Kannur and the surrounding region — no relocation to Bangalore or Kochi required."
      },
      {
        q: "Is this course suitable for complete beginners?",
        a: "Yes. No prior coding or math background is required — Month 1 starts with Python fundamentals from zero."
      },
      {
        q: "What will I be able to build by the end of the course?",
        a: "An original capstone project — a classical ML pipeline, a deep learning/NLP model, or a domain-specific RAG application or fine-tuned LLM — plus practical experience across the full AI/ML stack."
      },
      {
        q: "What jobs can I apply for after completing this course?",
        a: "Machine Learning Engineer, AI/ML Engineer, Data Scientist, NLP Engineer, MLOps Engineer, Generative AI Engineer, and Applied AI roles — locally or remote."
      }
    ],

    ctaSection: {
      heading: "Future Won't Wait. Why Should You?",
      subheading: "You don't need to leave Kannur to build a real AI/ML career — you need the right six months.",
      btnText: "Enroll in DeepStaq's AI Course in Kannur →"
    }
  },

  {
    id: "online-ai-course",
    slug: "online-ai-course",
    badge: "Live Interactive Cohort",
    title: "AI / ML & Generative AI — 6-Month Professional Diploma Programme (Online)",
    subtitle: "Most 'online AI courses' are really just a video library you watch alone. DeepStaq's programme is built differently — live, instructor-led sessions where you can ask questions in real time, not a pre-recorded playlist you fall behind on.",
    tagline: "No prior coding experience required. Live interactive sessions, hands-on coding labs, and direct mentor support from anywhere.",
    targetKeyword: "online ai course",
    pageType: "Course / Landing Page",
    metaTitle: "Online AI Course | Live, Instructor-Led AI/ML Diploma – DeepStaq",
    metaDescription: "Learn AI/ML online with DeepStaq's live, instructor-led sessions — from Python to agentic AI. Real-time classes, not pre-recorded videos. 6-month diploma.",

    whyDeepStaq: {
      title: "Why This Isn't a Typical Online Course",
      description: "DeepStaq is an institute built for the next generation of AI practitioners, sitting at the intersection of rigorous technical education and real-world application. Our mission is to make deep AI/ML knowledge accessible, structured, and actionable through a comprehensive, hands-on curriculum — bridging the gap between theory and real-world practice.",
      mission: "We bring the rigour and interaction of a physical classroom straight to your screen with interactive pair programming, live code walkthroughs, and responsive doubt clearing.",
      vision: "To offer the most engaging, high-retention live online AI training experience available."
    },

    offlineAdvantages: [
      {
        title: "Live sessions, not recordings",
        desc: "Classes run on a fixed schedule (3 sessions/week, 2 hours each) with real-time instructor interaction — not a self-paced video queue."
      },
      {
        title: "Direct access to instructors and industry mentors",
        desc: "Every month includes a session led by a working industry professional, with the ability to ask questions live."
      },
      {
        title: "Cohort-based, not solo",
        desc: "You move through the curriculum with the same group for six months, not alone with a login."
      },
      {
        title: "Hands-on project work",
        desc: "Not just conceptual video lectures — the same capstone-driven structure as the in-person programme with cloud lab support."
      }
    ],

    formatStructure: [
      { detail: "Format", info: "Live online instructor-led sessions + digital collaborative labs" },
      { detail: "Duration", info: "6 months core curriculum + ~2 weeks capstone" },
      { detail: "Schedule", info: "3 sessions/week, 2 hours/session (6 hrs/week)" },
      { detail: "Total Instruction Time", info: "~160 hours" },
      { detail: "Prerequisites", info: "None — beginner-friendly" },
      { detail: "Final Assessment", info: "60% Capstone Project + 40% Theory" }
    ],

    guestSessionNote: "Includes live Q&A with working industry practitioners and remote project reviews.",

    syllabus: [
      { month: "Month 1", title: "Programming Foundation (Python)", description: "Core syntax, data structures, functions & recursion with live coding exercises." },
      { month: "Month 2", title: "Math, Data & Visualisation", description: "Statistics, NumPy, Pandas, data cleaning & feature engineering." },
      { month: "Month 3", title: "Machine Learning", description: "Regression, classification, decision trees, SVM, clustering, model evaluation." },
      { month: "Month 4", title: "Deep Learning & NLP", description: "Neural networks, CNNs, RNNs, hands-on TensorFlow/Keras/PyTorch." },
      { month: "Month 5", title: "Generative AI & LLMs", description: "Transformers, LLMs, fine-tuning (LoRA, QLoRA, PEFT)." },
      { month: "Month 6", title: "MLOps, Capstone & Advanced Topics", description: "RAG, agentic AI, Docker, FastAPI, and final capstone project submission." }
    ],

    capstone: {
      title: "Your Capstone Project",
      description: "The programme culminates in an end-to-end capstone project: an original AI/ML build of your choosing. Choose from a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM.",
      outcome: "Graded by mentors via live video review: 60% Capstone Project + 40% Theory.",
      breakdown: [
        { percentage: "60%", title: "Capstone Build", desc: "Live walkthrough of your deployed ML/GenAI application." },
        { percentage: "40%", title: "Theory & Principles", desc: "Conceptual evaluation covering the full 6-month roadmap." }
      ]
    },

    targetAudience: [
      "Working professionals needing flexible live evening/weekend learning",
      "Learners outside Kerala seeking DeepStaq's rigorous practical AI curriculum",
      "Career switchers who want structured accountability without daily commuting"
    ],

    faqs: [
      {
        q: "Are the online classes live or pre-recorded?",
        a: "All core sessions are delivered live with instructors in real-time, allowing instant doubt clearance and interactive coding."
      },
      {
        q: "Can I access class recordings if I miss a live session?",
        a: "Yes, all live sessions are recorded and made available inside your student portal for revision and makeup study."
      },
      {
        q: "What's the difference between this and DeepStaq's in-person course?",
        a: "Both follow the exact same comprehensive 160-hour curriculum and capstone requirements. The online format is delivered via live virtual classrooms with cloud labs."
      }
    ],

    ctaSection: {
      heading: "Future Won't Wait. Why Should You?",
      subheading: "Gain industry-ready AI/ML skills from the comfort of your home with live mentor guidance.",
      btnText: "Enroll in DeepStaq's Online AI Course →"
    }
  },

  {
    id: "ai-ml-course-guide",
    slug: "ai-ml-course-guide",
    isGuide: true,
    badge: "2026 Complete Guide",
    title: "AI & ML Course Guide: Everything You Need to Know Before You Enrol",
    subtitle: "Artificial Intelligence and Machine Learning are no longer 'future skills' — they're the skills employers are hiring for right now. If you're searching for the right AI & ML course, this guide walks you through everything: what AI/ML actually is, who should learn it, eligibility, duration, fees, the skills you'll gain, career paths, and how Deepstaq's 6-month 'From Zero to AI Builder' programme compares to other options.",
    targetKeyword: "AI course Kerala, AI ML course, Deepstaq, AI ML diploma, learn AI ML, AI course eligibility, AI course fees Kerala, AI ML career opportunities",
    pageType: "Guide / Comprehensive Pillar Page",
    metaTitle: "AI & ML Course Guide 2026 | Deepstaq 6-Month AI/ML Diploma",
    metaDescription: "Complete AI & ML course guide — what is AI/ML, eligibility, duration, fees, skills, career scope, and Deepstaq's 6-month AI Builder programme in Kerala.",

    guideSections: [
      {
        id: "what-is-ai-ml",
        heading: "What is AI & ML?",
        content: `Artificial Intelligence (AI) is the science of building machines and software that can perform tasks that normally require human intelligence — understanding language, recognising images, making decisions, or generating new content.

Machine Learning (ML) is a subset of AI. Instead of programming a computer with fixed rules, ML trains algorithms on data so they can identify patterns and make predictions on their own — like how Netflix recommends shows or how a bank flags fraudulent transactions.

Within AI/ML today, three areas matter most to job-seekers:
• Deep Learning — neural networks that power image recognition, speech, and recommendation systems.
• NLP (Natural Language Processing) — how machines understand and generate human language (chatbots, translation, sentiment analysis).
• Generative AI (GenAI) — the technology behind tools like ChatGPT and Claude, including large language models (LLMs), fine-tuning, and AI agents that can take actions on their own.

A good AI & ML course today should cover the full stack — from Python and statistics, to classical ML, to deep learning, all the way to GenAI and MLOps (deploying models in the real world).`
      },
      {
        id: "who-should-learn",
        heading: "Who Should Learn AI & ML?",
        content: `AI/ML is one of the few tech fields genuinely open to a mixed audience. You should consider a course if you are:

• A student or fresh graduate (engineering, science, commerce, or any stream) wanting a head start into a high-demand tech career.
• A working professional in software, data, or analytics looking to upskill and move into ML/AI roles.
• A career switcher from a non-tech background — business, marketing, finance, education — who wants to pivot into tech without starting a full degree over again.
• An entrepreneur or freelancer who wants to build AI-powered products, chatbots, or automation tools for clients or your own business.
• A business owner or marketer who wants to understand AI well enough to apply it — automating workflows, building simple tools, or making informed decisions about AI adoption.

You don't need a computer science degree or prior coding experience — most well-designed programmes (including Deepstaq's) start from Python fundamentals and build up from there.`
      },
      {
        id: "eligibility",
        heading: "AI & ML Course Eligibility",
        content: `Eligibility is intentionally kept broad for most industry-oriented AI/ML diplomas, unlike a university B.Tech/M.Tech. Typical requirements are:

• Educational background: 12th pass or a bachelor's degree in any discipline (engineering, science, commerce, arts) — no AI/CS degree required.
• Prior coding experience: Not mandatory for beginner-friendly programmes; helpful but not required if the course starts with a Python foundation module.
• Math comfort: Basic comfort with numbers and logical thinking helps, since the course covers probability, statistics, and linear algebra concepts — but these are taught, not assumed.
• Devices: A laptop capable of running Python/Jupyter notebooks (most coursework can also run on cloud tools like Google Colab, so a high-end machine isn't essential).
• Age/professional status: Open to students, freshers, and working professionals alike.

If you're unsure whether you qualify, it's worth checking directly with the institute — most, including Deepstaq, assess readiness case by case rather than applying a strict cutoff.`
      },
      {
        id: "duration",
        heading: "AI & ML Course Duration",
        content: `Duration varies a lot depending on course type:`,
        table: {
          headers: ["Course Type", "Typical Duration"],
          rows: [
            ["Short certification (Coursera, Udemy-style)", "4–12 weeks"],
            ["Industry diploma / bootcamp (like Deepstaq)", "4–8 months"],
            ["PG Diploma / Executive programme", "6–12 months"],
            ["Full-time degree (B.Tech/M.Tech/MSc in AI)", "2–4 years"]
          ]
        },
        extraContent: `Deepstaq's programme runs 6 months of core curriculum, plus ~2 additional weeks for the capstone project — around 160 hours of live instruction total, delivered as 3 sessions a week, 2 hours per session. This sits in the "serious but not a full degree" middle ground — enough depth to actually build things, without a multi-year commitment.`
      },
      {
        id: "fees",
        heading: "AI & ML Course Fees",
        content: `Fees for AI/ML courses in India vary widely based on format and depth:

• Short online certifications: ₹1,000 – ₹40,000
• Industry diploma / bootcamp programmes (6 months, instructor-led, project-based): roughly ₹35,000 – ₹1,50,000
• PG-level executive certificates (IIT/IIM-affiliated): ₹1,00,000 – ₹3,00,000+
• Full degree programmes (B.Tech/M.Tech/MSc): ₹2,00,000 – ₹10,00,000+

Where a specific course lands within this range depends on instructor-led hours, mentorship, GPU/cloud access, capstone guidance, and placement support.

For Deepstaq's exact current fee structure and any active offers, it's best to check directly via www.deepstaq.in or contact +91 949 595 7011 / info@deepstaq.in — this article intentionally doesn't quote a number that could go out of date.`
      },
      {
        id: "skills-learned",
        heading: "Skills You'll Learn",
        content: `A comprehensive AI/ML programme should take you from zero to job-ready across six broad areas:

1. Programming Foundations (Python) — syntax, data structures, functions, recursion, and an intro to multithreading/asyncio.
2. Math, Data & Visualisation — probability & statistics, NumPy, Pandas, Matplotlib/Seaborn, data cleaning, and feature engineering.
3. Machine Learning — regression, classification, decision trees, random forests, KNN, SVM, gradient boosting, clustering, PCA, and model evaluation.
4. Deep Learning & NLP — neural network fundamentals, CNNs, RNNs, LSTMs/GRUs, using TensorFlow/Keras/PyTorch.
5. Generative AI & LLMs — embeddings, transformers & attention, the BERT/GPT family, and fine-tuning techniques like LoRA, QLoRA, and PEFT.
6. MLOps & Advanced Topics — vector databases, RAG (Retrieval-Augmented Generation), agentic AI & tool calling, Docker, FastAPI, CI/CD, plus an overview of GANs, diffusion models, and multimodal AI.

Alongside the curriculum, you'll typically get hands-on exposure to industry tools: Python, OpenAI APIs, FastAPI, Claude, Docker, ChatGPT, Google Gemini, Cursor, and Google Colab — the same stack practitioners use day-to-day.`
      },
      {
        id: "career-opportunities",
        heading: "Career Opportunities After an AI & ML Course",
        content: `AI/ML talent demand continues to outpace supply. Roles you can pursue after a solid diploma include:

• Machine Learning Engineer
• Data Scientist / Data Analyst
• AI/ML Engineer
• Generative AI Engineer
• NLP Engineer
• AI Product / Applied AI roles
• MLOps Engineer
• AI Research / Junior Research roles (with further specialisation)

Beyond a traditional job, AI/ML skills also open up:
• Remote work — a large share of AI/ML roles are remote-friendly, letting you work for companies without relocating.
• AI entrepreneurship — building your own RAG apps, agents, or fine-tuned LLM products.
• Freelancing — offering model-building, chatbot, or data-analysis services with minimal upfront investment.
• AI consulting — advising businesses on AI adoption and applied use cases.`
      },
      {
        id: "online-vs-offline",
        heading: "Online vs Offline AI & ML Courses: Which Should You Choose?",
        content: `Choosing the right format depends heavily on your learning preferences and schedule:`,
        table: {
          headers: ["Factor", "Online", "Offline / In-Person"],
          rows: [
            ["Flexibility", "High — learn at your own pace/schedule", "Fixed timings, structured routine"],
            ["Networking", "Limited to community/Slack/Discord", "Direct peer & mentor interaction"],
            ["Doubt-clearing", "Async or scheduled calls", "Immediate, in-person support"],
            ["Discipline required", "High (self-driven)", "Lower (structured accountability)"],
            ["Hands-on/lab access", "Depends on cloud tools provided", "Often better for GPU-heavy or infra-heavy work"],
            ["Cost", "Generally lower", "Generally higher (infrastructure, faculty)"],
            ["Best for", "Working professionals, self-starters", "Students, career switchers wanting structure and mentorship"]
          ]
        },
        extraContent: `In practice, a hybrid model — live instructor-led sessions (online or in a classroom) combined with real project work and mentor access — tends to give the best of both worlds. This is the format most modern bootcamp-style AI/ML diplomas, including cohort-based programmes, are moving toward, since it keeps the flexibility of online learning while preserving accountability and direct feedback.`
      },
      {
        id: "deepstaq-programme",
        heading: "Deepstaq's Programme: From Zero to AI Builder in Six Months",
        content: `Deepstaq is an institute built for the next generation of AI practitioners, positioned at the intersection of rigorous technical education and real-world application. The programme is designed for a mixed audience — no prior experience required, whether you come from engineering, business, education, or any other background.

Programme highlights:
• Duration: 6 months of core curriculum + ~2 weeks for the capstone (~160 hours total instruction)
• Format: 3 sessions/week, 2 hours/session
• Monthly industry sessions: Each month includes a dedicated session led by an industry professional working in that month's subject area, bringing real-world context alongside the core instructor-led curriculum
• Curriculum: Python foundations → Math/Data/Visualisation → Machine Learning → Deep Learning & NLP → Generative AI & LLMs → MLOps, Capstone & Advanced Topics
• Capstone project: An original, end-to-end AI/ML build — choose from a classical ML pipeline, an NLP/deep learning model, or a domain-specific RAG application or fine-tuned LLM
• Final evaluation: 60% capstone project (data handling, model implementation, evaluation, deployment/RAG-agent components) + 40% theory (conceptual understanding across the full curriculum)
• Tools used: Python, OpenAI APIs, FastAPI, Claude, Docker, ChatGPT, Google Gemini, Cursor, Google Colab, Google Antigravity

Vision: To be the leading institute for practical AI education — producing professionals who don't just understand artificial intelligence, but build intelligent systems that solve real problems in the real world.`
      }
    ],

    faqs: [
      {
        q: "1. Do I need a coding background to join an AI & ML course?",
        a: "No. Most beginner-friendly programmes, including Deepstaq's, start with a Python foundation module, so you can join with zero prior coding experience."
      },
      {
        q: "2. How long does it take to become job-ready in AI/ML?",
        a: "A structured, hands-on diploma typically takes 4–8 months to take you from fundamentals to a portfolio-ready capstone project. Short certifications (a few weeks) are useful for awareness but rarely enough for a job switch on their own."
      },
      {
        q: "3. Is AI & ML only for engineering graduates?",
        a: "No. AI/ML courses today are built for a mixed audience — students, working professionals, and career switchers from business, marketing, or other non-technical backgrounds can all learn it."
      },
      {
        q: "4. What's the difference between AI, ML, and Generative AI?",
        a: "AI is the broad goal of building intelligent machines. ML is a method within AI that learns patterns from data. Generative AI is a further subset of ML/deep learning focused on generating new content — text, images, code — using models like LLMs."
      },
      {
        q: "5. What salary can I expect after an AI/ML course?",
        a: "In India, entry-to-mid-level AI/ML professionals typically earn in the ₹3,00,000–₹10,00,000+ per annum range, depending on role, city, and specialisation — with generative AI and MLOps skills commanding a premium."
      },
      {
        q: "6. Is a capstone project necessary?",
        a: "Yes — it's often the most important part of the course. A completed, original AI/ML build (not just a certificate) is what recruiters and clients actually look at when evaluating your practical skill."
      },
      {
        q: "7. Online, offline, or hybrid — what does Deepstaq offer?",
        a: "Deepstaq runs a structured, session-based format (3 sessions/week) combining instructor-led teaching with monthly industry-expert sessions and hands-on project work — check directly with Deepstaq for the current delivery mode (online, offline, or hybrid) in your city."
      },
      {
        q: "8. What jobs can I get after completing an AI/ML diploma?",
        a: "Common roles include Machine Learning Engineer, Data Scientist/Analyst, AI/ML Engineer, Generative AI Engineer, NLP Engineer, MLOps Engineer, and Applied AI/Product roles — with freelancing and consulting as additional paths."
      }
    ],

    ctaSection: {
      heading: "Ready to Start Your AI & ML Journey?",
      subheading: "Contact our admissions team today to get the latest syllabus, schedule a campus visit, or discuss installment plans.",
      btnText: "Apply for DeepStaq AI Diploma →"
    }
  }
];
