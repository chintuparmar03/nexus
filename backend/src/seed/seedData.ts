import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Skill, ISkill } from '../models/Skill';
import { Career, ICareer } from '../models/Career';

dotenv.config();

export const SEED_SKILLS = [
  // --- Programming Foundations ---
  {
    skillId: 'python',
    name: 'Python',
    description: 'Versatile, high-level language used extensively in Web Development, AI, Data Science, and Automation.',
    category: 'Programming',
    difficulty: 'Beginner',
    estimatedHours: 25,
    industryDemand: 'Very High',
    popularity: 98,
    prerequisites: [],
    relatedSkills: ['data-structures', 'javascript'],
    resources: [
      { title: 'Python Official Documentation', type: 'Doc', url: 'https://docs.python.org/3/', isFree: true },
      { title: 'Python for Beginners (Full Course)', type: 'YouTube', url: 'https://youtube.com', isFree: true }
    ]
  },
  {
    skillId: 'javascript',
    name: 'JavaScript (ES6+)',
    description: 'The programming language of the web, powering frontend interactivity and backend server runtimes.',
    category: 'Programming',
    difficulty: 'Beginner',
    estimatedHours: 30,
    industryDemand: 'Very High',
    popularity: 99,
    prerequisites: [],
    relatedSkills: ['html-css', 'typescript'],
    resources: [
      { title: 'MDN Web Docs - JavaScript', type: 'Doc', url: 'https://developer.mozilla.org', isFree: true },
      { title: 'JavaScript.info Complete Guide', type: 'Doc', url: 'https://javascript.info', isFree: true }
    ]
  },
  {
    skillId: 'typescript',
    name: 'TypeScript',
    description: 'Strongly typed superset of JavaScript that scales to enterprise web applications.',
    category: 'Programming',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    industryDemand: 'Very High',
    popularity: 92,
    prerequisites: ['javascript'],
    relatedSkills: ['react', 'node-js'],
    resources: [
      { title: 'TypeScript Handbook', type: 'Doc', url: 'https://www.typescriptlang.org/docs/', isFree: true }
    ]
  },
  {
    skillId: 'cplusplus',
    name: 'C++',
    description: 'Performance-critical systems programming language used in Game Engines, High Frequency Trading, and Operating Systems.',
    category: 'Programming',
    difficulty: 'Intermediate',
    estimatedHours: 45,
    industryDemand: 'High',
    popularity: 85,
    prerequisites: [],
    relatedSkills: ['data-structures', 'csharp'],
    resources: [{ title: 'cppreference.com', type: 'Doc', url: 'https://en.cppreference.com', isFree: true }]
  },
  {
    skillId: 'data-structures',
    name: 'Data Structures & Algorithms',
    description: 'Fundamental computer science concepts including Trees, Graphs, Sorting, Hash Maps, and Dynamic Programming.',
    category: 'Programming',
    difficulty: 'Intermediate',
    estimatedHours: 50,
    industryDemand: 'Very High',
    popularity: 95,
    prerequisites: ['python'],
    relatedSkills: ['cplusplus', 'system-design'],
    resources: [
      { title: 'LeetCode Problem Sets', type: 'Practice', url: 'https://leetcode.com', isFree: true },
      { title: 'NeetCode Roadmap', type: 'YouTube', url: 'https://neetcode.io', isFree: true }
    ]
  },

  // --- Frontend ---
  {
    skillId: 'html-css',
    name: 'HTML5 & Modern CSS3',
    description: 'Core building blocks of the web, focusing on semantic structure, Flexbox, CSS Grid, and responsive design.',
    category: 'Frontend',
    difficulty: 'Beginner',
    estimatedHours: 15,
    industryDemand: 'Very High',
    popularity: 98,
    prerequisites: [],
    relatedSkills: ['javascript', 'tailwind-css'],
    resources: [{ title: 'MDN Web Docs - HTML/CSS', type: 'Doc', url: 'https://developer.mozilla.org', isFree: true }]
  },
  {
    skillId: 'react',
    name: 'React 19 & Hooks',
    description: 'The industry-standard declarative UI library for building fast, component-driven web interfaces.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    industryDemand: 'Very High',
    popularity: 96,
    prerequisites: ['javascript', 'html-css'],
    relatedSkills: ['typescript', 'nextjs', 'tailwind-css'],
    resources: [{ title: 'React Official Documentation', type: 'Doc', url: 'https://react.dev', isFree: true }]
  },
  {
    skillId: 'tailwind-css',
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapidly building modern, responsive SaaS application designs.',
    category: 'Frontend',
    difficulty: 'Beginner',
    estimatedHours: 12,
    industryDemand: 'Very High',
    popularity: 94,
    prerequisites: ['html-css'],
    relatedSkills: ['react'],
    resources: [{ title: 'Tailwind CSS Docs', type: 'Doc', url: 'https://tailwindcss.com', isFree: true }]
  },
  {
    skillId: 'nextjs',
    name: 'Next.js App Router',
    description: 'Full-stack React framework featuring Server Components, SSR, Static Site Generation, and API Routes.',
    category: 'Frontend',
    difficulty: 'Advanced',
    estimatedHours: 30,
    industryDemand: 'Very High',
    popularity: 91,
    prerequisites: ['react', 'typescript'],
    relatedSkills: ['node-js', 'graphql'],
    resources: [{ title: 'Next.js Documentation', type: 'Doc', url: 'https://nextjs.org/docs', isFree: true }]
  },

  // --- Backend ---
  {
    skillId: 'node-js',
    name: 'Node.js & Express',
    description: 'Asynchronous event-driven JavaScript runtime for building high-performance backend microservices and APIs.',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedHours: 30,
    industryDemand: 'Very High',
    popularity: 93,
    prerequisites: ['javascript'],
    relatedSkills: ['express-js', 'mongodb', 'rest-api'],
    resources: [{ title: 'Node.js Docs', type: 'Doc', url: 'https://nodejs.org', isFree: true }]
  },
  {
    skillId: 'rest-api',
    name: 'RESTful API Architecture',
    description: 'Designing stateless, scalable HTTP APIs following REST principles, status codes, and authentication standards.',
    category: 'Backend',
    difficulty: 'Beginner',
    estimatedHours: 15,
    industryDemand: 'Very High',
    popularity: 97,
    prerequisites: ['javascript'],
    relatedSkills: ['node-js', 'graphql'],
    resources: [{ title: 'Restful API Guide', type: 'Doc', url: 'https://restfulapi.net', isFree: true }]
  },
  {
    skillId: 'postgresql',
    name: 'PostgreSQL & SQL',
    description: 'Advanced open-source relational database management system supporting ACID compliance and JSON querying.',
    category: 'Databases',
    difficulty: 'Intermediate',
    estimatedHours: 25,
    industryDemand: 'Very High',
    popularity: 95,
    prerequisites: [],
    relatedSkills: ['mongodb', 'redis'],
    resources: [{ title: 'PostgreSQL Tutorial', type: 'Doc', url: 'https://www.postgresqltutorial.com', isFree: true }]
  },
  {
    skillId: 'mongodb',
    name: 'MongoDB & Mongoose',
    description: 'Flexible NoSQL document database suited for agile schema updates and high write throughput.',
    category: 'Databases',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    industryDemand: 'High',
    popularity: 88,
    prerequisites: ['javascript'],
    relatedSkills: ['node-js', 'postgresql'],
    resources: [{ title: 'MongoDB University', type: 'Course', url: 'https://university.mongodb.com', isFree: true }]
  },
  {
    skillId: 'system-design',
    name: 'System Design & Distributed Architecture',
    description: 'Designing large-scale systems handling millions of requests: Load Balancing, Caching, Sharding, Message Queues.',
    category: 'Backend',
    difficulty: 'Advanced',
    estimatedHours: 40,
    industryDemand: 'Very High',
    popularity: 94,
    prerequisites: ['node-js', 'postgresql', 'data-structures'],
    relatedSkills: ['docker', 'kubernetes'],
    resources: [{ title: 'System Design Primer', type: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', isFree: true }]
  },

  // --- Cloud & DevOps ---
  {
    skillId: 'docker',
    name: 'Docker & Containerization',
    description: 'Packaging applications and dependencies into reproducible containers for seamless cloud deployment.',
    category: 'DevOps',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    industryDemand: 'Very High',
    popularity: 93,
    prerequisites: ['node-js'],
    relatedSkills: ['kubernetes', 'aws'],
    resources: [{ title: 'Docker Official Docs', type: 'Doc', url: 'https://docs.docker.com', isFree: true }]
  },
  {
    skillId: 'aws',
    name: 'Amazon Web Services (AWS)',
    description: 'The leading cloud infrastructure platform covering EC2, S3, Lambda, DynamoDB, ECS, and CloudFront.',
    category: 'Cloud',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    industryDemand: 'Very High',
    popularity: 96,
    prerequisites: ['docker'],
    relatedSkills: ['kubernetes', 'terraform'],
    resources: [{ title: 'AWS Skill Builder', type: 'Course', url: 'https://explore.skillbuilder.aws', isFree: true }]
  },
  {
    skillId: 'kubernetes',
    name: 'Kubernetes Container Orchestration',
    description: 'Automating deployment, scaling, and management of containerized microservices across cloud clusters.',
    category: 'DevOps',
    difficulty: 'Advanced',
    estimatedHours: 40,
    industryDemand: 'High',
    popularity: 89,
    prerequisites: ['docker', 'aws'],
    relatedSkills: ['terraform'],
    resources: [{ title: 'Kubernetes Official Basics', type: 'Doc', url: 'https://kubernetes.io/docs/tutorials/', isFree: true }]
  },

  // --- AI & Data Science ---
  {
    skillId: 'machine-learning',
    name: 'Machine Learning & Scikit-Learn',
    description: 'Supervised and unsupervised learning, regression, classification, clustering, and model evaluation.',
    category: 'AI',
    difficulty: 'Intermediate',
    estimatedHours: 40,
    industryDemand: 'Very High',
    popularity: 92,
    prerequisites: ['python', 'data-structures'],
    relatedSkills: ['deep-learning', 'pytorch'],
    resources: [{ title: 'Andrew Ng ML Course', type: 'Course', url: 'https://coursera.org', isFree: true }]
  },
  {
    skillId: 'deep-learning',
    name: 'Deep Learning & Neural Networks',
    description: 'Multi-layer perceptrons, Convolutional Networks (CNNs), Transformers, and Backpropagation algorithms.',
    category: 'AI',
    difficulty: 'Advanced',
    estimatedHours: 45,
    industryDemand: 'Very High',
    popularity: 90,
    prerequisites: ['machine-learning'],
    relatedSkills: ['pytorch', 'llm-engineering'],
    resources: [{ title: 'DeepLearning.AI', type: 'Course', url: 'https://deeplearning.ai', isFree: true }]
  },
  {
    skillId: 'pytorch',
    name: 'PyTorch & Computer Vision',
    description: 'Dynamic neural network framework widely adopted in AI research and production computer vision pipelines.',
    category: 'AI',
    difficulty: 'Advanced',
    estimatedHours: 35,
    industryDemand: 'Very High',
    popularity: 88,
    prerequisites: ['deep-learning'],
    relatedSkills: ['llm-engineering'],
    resources: [{ title: 'PyTorch Tutorials', type: 'Doc', url: 'https://pytorch.org/tutorials/', isFree: true }]
  },
  {
    skillId: 'llm-engineering',
    name: 'LLM Engineering & RAG Architecture',
    description: 'Building generative AI applications using Large Language Models, LangChain, Vector Databases, and Fine-Tuning.',
    category: 'AI',
    difficulty: 'Advanced',
    estimatedHours: 30,
    industryDemand: 'Very High',
    popularity: 97,
    prerequisites: ['python', 'machine-learning'],
    relatedSkills: ['pytorch'],
    resources: [{ title: 'Pinecone RAG Handbook', type: 'Doc', url: 'https://pinecone.io/learn', isFree: true }]
  },

  // --- Cyber Security ---
  {
    skillId: 'web-security',
    name: 'Web Application Security (OWASP Top 10)',
    description: 'Defending web applications against XSS, SQL Injection, CSRF, broken authentication, and CORS exploits.',
    category: 'Cyber Security',
    difficulty: 'Intermediate',
    estimatedHours: 25,
    industryDemand: 'Very High',
    popularity: 87,
    prerequisites: ['javascript', 'rest-api'],
    relatedSkills: ['network-security'],
    resources: [{ title: 'OWASP Foundation Guide', type: 'Doc', url: 'https://owasp.org', isFree: true }]
  },

  // --- Soft Skills ---
  {
    skillId: 'technical-writing',
    name: 'Technical Writing & System Documentation',
    description: 'Communicating complex software designs cleanly via RFCs, architecture diagrams, and developer documentation.',
    category: 'Soft Skills',
    difficulty: 'Beginner',
    estimatedHours: 10,
    industryDemand: 'High',
    popularity: 80,
    prerequisites: [],
    relatedSkills: ['system-design'],
    resources: [{ title: 'Google Technical Writing Course', type: 'Course', url: 'https://developers.google.com/tech-writing', isFree: true }]
  }
];

export const SEED_CAREERS = [
  {
    careerId: 'fullstack-engineer',
    title: 'Full Stack Engineer',
    description: 'Engineers who build end-to-end web applications, handling interactive UI frontends, REST APIs, and databases.',
    category: 'Engineering',
    averageSalary: '$125,000 / yr',
    industryDemand: 'Very High',
    futureGrowth: '+25% growth (High Demand)',
    iconName: 'Layers',
    keyResponsibilities: [
      'Architect responsive frontend interfaces in React and TypeScript',
      'Design RESTful API microservices with Node.js and MongoDB/PostgreSQL',
      'Deploy applications to AWS cloud infrastructure with Docker'
    ],
    requiredSkills: [
      { skillId: 'javascript', importanceWeight: 10, targetProficiency: 5, isMustHave: true },
      { skillId: 'html-css', importanceWeight: 8, targetProficiency: 4, isMustHave: true },
      { skillId: 'react', importanceWeight: 10, targetProficiency: 4, isMustHave: true },
      { skillId: 'typescript', importanceWeight: 9, targetProficiency: 4, isMustHave: true },
      { skillId: 'node-js', importanceWeight: 9, targetProficiency: 4, isMustHave: true },
      { skillId: 'postgresql', importanceWeight: 8, targetProficiency: 3, isMustHave: false },
      { skillId: 'mongodb', importanceWeight: 7, targetProficiency: 3, isMustHave: false },
      { skillId: 'docker', importanceWeight: 6, targetProficiency: 3, isMustHave: false }
    ]
  },
  {
    careerId: 'frontend-engineer',
    title: 'Frontend Engineer',
    description: 'Specializes in crafting slick, pixel-perfect, accessible, and fast web client experiences.',
    category: 'Engineering',
    averageSalary: '$118,000 / yr',
    industryDemand: 'Very High',
    futureGrowth: '+22% growth',
    iconName: 'Layout',
    keyResponsibilities: [
      'Build reactive components with React 19, Tailwind CSS, and Next.js',
      'Optimize web performance, Core Web Vitals, and responsive UI',
      'Implement web animations and state management'
    ],
    requiredSkills: [
      { skillId: 'javascript', importanceWeight: 10, targetProficiency: 5, isMustHave: true },
      { skillId: 'html-css', importanceWeight: 10, targetProficiency: 5, isMustHave: true },
      { skillId: 'react', importanceWeight: 10, targetProficiency: 5, isMustHave: true },
      { skillId: 'typescript', importanceWeight: 9, targetProficiency: 4, isMustHave: true },
      { skillId: 'tailwind-css', importanceWeight: 8, targetProficiency: 4, isMustHave: false },
      { skillId: 'nextjs', importanceWeight: 8, targetProficiency: 4, isMustHave: false }
    ]
  },
  {
    careerId: 'backend-engineer',
    title: 'Backend Engineer',
    description: 'Focuses on server architecture, database throughput, distributed system design, and security.',
    category: 'Engineering',
    averageSalary: '$130,000 / yr',
    industryDemand: 'Very High',
    futureGrowth: '+26% growth',
    iconName: 'Server',
    keyResponsibilities: [
      'Design high-concurrency microservice APIs and database schemas',
      'Implement caching layers, message queues, and indexing',
      'Enforce API security, rate limiting, and system reliability'
    ],
    requiredSkills: [
      { skillId: 'node-js', importanceWeight: 10, targetProficiency: 5, isMustHave: true },
      { skillId: 'postgresql', importanceWeight: 10, targetProficiency: 4, isMustHave: true },
      { skillId: 'system-design', importanceWeight: 10, targetProficiency: 4, isMustHave: true },
      { skillId: 'rest-api', importanceWeight: 9, targetProficiency: 5, isMustHave: true },
      { skillId: 'docker', importanceWeight: 8, targetProficiency: 3, isMustHave: false },
      { skillId: 'data-structures', importanceWeight: 9, targetProficiency: 4, isMustHave: true }
    ]
  },
  {
    careerId: 'ai-engineer',
    title: 'AI & LLM Engineer',
    description: 'Engineers who build, fine-tune, and deploy AI models, LLMs, and RAG search systems.',
    category: 'Artificial Intelligence',
    averageSalary: '$150,000 / yr',
    industryDemand: 'Very High',
    futureGrowth: '+45% growth (Explosive)',
    iconName: 'Cpu',
    keyResponsibilities: [
      'Architect Retrieval-Augmented Generation (RAG) pipelines with Vector Databases',
      'Fine-tune open-weight models using PyTorch and HuggingFace',
      'Integrate AI capabilities into production software applications'
    ],
    requiredSkills: [
      { skillId: 'python', importanceWeight: 10, targetProficiency: 5, isMustHave: true },
      { skillId: 'machine-learning', importanceWeight: 10, targetProficiency: 4, isMustHave: true },
      { skillId: 'deep-learning', importanceWeight: 9, targetProficiency: 4, isMustHave: true },
      { skillId: 'pytorch', importanceWeight: 9, targetProficiency: 4, isMustHave: false },
      { skillId: 'llm-engineering', importanceWeight: 10, targetProficiency: 5, isMustHave: true }
    ]
  },
  {
    careerId: 'devops-cloud-engineer',
    title: 'DevOps & Cloud Engineer',
    description: 'Manages CI/CD pipelines, Kubernetes clusters, AWS cloud infrastructure, and infrastructure as code.',
    category: 'DevOps & Infrastructure',
    averageSalary: '$135,000 / yr',
    industryDemand: 'Very High',
    futureGrowth: '+28% growth',
    iconName: 'Cloud',
    keyResponsibilities: [
      'Automate cloud deployments with Terraform and GitHub Actions',
      'Manage multi-region Kubernetes clusters on AWS/GCP',
      'Ensure 99.99% uptime, monitoring, and automated alerts'
    ],
    requiredSkills: [
      { skillId: 'docker', importanceWeight: 10, targetProficiency: 5, isMustHave: true },
      { skillId: 'aws', importanceWeight: 10, targetProficiency: 4, isMustHave: true },
      { skillId: 'kubernetes', importanceWeight: 9, targetProficiency: 4, isMustHave: true },
      { skillId: 'system-design', importanceWeight: 8, targetProficiency: 3, isMustHave: false }
    ]
  }
];

export async function seedDatabase() {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexus_db';
    await mongoose.connect(connStr);
    console.log('[Seed] Connected to MongoDB for seeding...');

    await Skill.deleteMany({});
    await Career.deleteMany({});

    await Skill.insertMany(SEED_SKILLS);
    await Career.insertMany(SEED_CAREERS);

    console.log(`[Seed Success] Populated ${SEED_SKILLS.length} skills and ${SEED_CAREERS.length} career paths.`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
}

if (process.argv[1]?.includes('seedData')) {
  seedDatabase();
}
