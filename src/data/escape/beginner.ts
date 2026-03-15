import type { EscapeRoom } from '@/lib/types';

export const beginnerRoom: EscapeRoom = {
  id: 'escape-beginner',
  difficulty: 'beginner',
  title: 'The Helpful Assistant Gone Wrong',
  scenario:
    "The company AI assistant has started sending incorrect information to clients. You've been locked in the IT room to investigate and fix the problem before the CEO's presentation in 15 minutes. Examine the equipment around you to diagnose and fix the AI.",
  backgroundImage: '/images/escape/room-beginner.png',
  timeLimit: 900,

  objects: [
    {
      id: 'terminal',
      name: 'Computer Terminal',
      icon: '💻',
      puzzleType: 'prompt-fix',
      position: { x: 15, y: 35, width: 18, height: 22 },
    },
    {
      id: 'cabinet',
      name: 'Filing Cabinet',
      icon: '🗄️',
      puzzleType: 'spot-error',
      position: { x: 72, y: 40, width: 16, height: 25 },
    },
    {
      id: 'whiteboard',
      name: 'Whiteboard',
      icon: '📋',
      puzzleType: 'match-concepts',
      position: { x: 40, y: 15, width: 22, height: 20 },
    },
    {
      id: 'safe',
      name: 'Locked Safe',
      icon: '🔒',
      puzzleType: 'quiz',
      position: { x: 78, y: 72, width: 14, height: 18 },
    },
    {
      id: 'phone',
      name: 'Desk Phone',
      icon: '📞',
      puzzleType: 'chat-fix',
      position: { x: 10, y: 68, width: 15, height: 18 },
    },
    {
      id: 'door',
      name: 'Exit Door',
      icon: '🚪',
      puzzleType: 'exit',
      position: { x: 44, y: 70, width: 14, height: 25 },
    },
  ],

  puzzles: {
    terminal: {
      type: 'prompt-fix',
      instruction:
        "The AI assistant's system prompt got scrambled. Rearrange the fragments to create a working customer service prompt.",
      fragments: [
        'You are a helpful customer service assistant.',
        'Always be polite and professional.',
        'Respond in the same language as the customer.',
        'If you don\'t know the answer, say so honestly.',
        'Keep responses under 100 words.',
      ],
      correctOrder: [0, 1, 2, 3, 4],
      hint: "Start with defining the AI's role, then add behavior rules.",
      explanation:
        'A good system prompt starts by defining the role, sets the tone, handles language, establishes honesty guidelines, and finally adds formatting constraints.',
      code: 'A7X',
    },

    cabinet: {
      type: 'spot-error',
      instruction:
        'This AI-generated quarterly report contains hallucinated facts. Find the 3 errors.',
      document:
        'Q3 2025 Performance Summary\n\nRevenue grew 14% year-over-year, reaching $48.2M for the quarter. Our customer satisfaction score hit 91%, according to the Gartner 2025 Customer Trust Index published on March 15, 2025. The engineering team shipped 23 features, reducing average response time by 340% compared to last quarter. Our new enterprise plan, launched in August, already accounts for 18% of total revenue. As noted in the Harvard Business Review article "The Rise of AI-First Companies" by Dr. Sarah Chen (Vol. 103, Issue 7), companies adopting AI-driven customer service see a 60% reduction in support costs. We remain on track to exceed our annual target of $200M.',
      errors: [
        {
          text: 'the Gartner 2025 Customer Trust Index published on March 15, 2025',
          explanation:
            'This is a fabricated source. The "Gartner 2025 Customer Trust Index" does not exist. AI models often hallucinate specific report names and publication dates to sound authoritative.',
        },
        {
          text: 'reducing average response time by 340% compared to last quarter',
          explanation:
            'A 340% reduction in response time is mathematically impossible — you cannot reduce something by more than 100%. This is a hallucinated statistic that sounds impressive but makes no logical sense.',
        },
        {
          text: 'the Harvard Business Review article "The Rise of AI-First Companies" by Dr. Sarah Chen (Vol. 103, Issue 7)',
          explanation:
            'This is a fabricated citation. AI frequently invents plausible-sounding journal articles, author names, and volume numbers. Always verify academic and publication references.',
        },
      ],
      hint: 'Look for specific numbers and citations — AI often fabricates these.',
      code: 'B3K',
    },

    whiteboard: {
      type: 'match-concepts',
      instruction: 'Match each AI term to its correct definition.',
      pairs: [
        {
          term: 'Hallucination',
          definition:
            'When an AI generates false information that sounds convincing',
        },
        {
          term: 'Prompt',
          definition:
            'The input text or instruction you give to an AI system',
        },
        {
          term: 'Bias',
          definition:
            'Systematic unfairness in AI outputs due to skewed training data or design',
        },
        {
          term: 'Fine-tuning',
          definition:
            'Further training a pre-built AI model on specific data for a particular task',
        },
        {
          term: 'Token',
          definition: 'The smallest unit of text that an AI model processes',
        },
      ],
      hint: "A 'token' is the smallest unit of text an AI processes.",
      code: 'C9M',
    },

    safe: {
      type: 'quiz',
      instruction:
        'Answer these questions about AI basics to unlock the safe.',
      questions: [
        {
          question: 'What does "AI" stand for?',
          options: [
            'Artificial Intelligence',
            'Automated Integration',
            'Advanced Interface',
            'Algorithmic Innovation',
          ],
          correctIndex: 0,
          explanation:
            'AI stands for Artificial Intelligence — the simulation of human intelligence by computer systems.',
        },
        {
          question:
            'Which of these is the BEST practice when using AI-generated content?',
          options: [
            'Share it immediately since AI is always accurate',
            'Verify facts and check for errors before using it',
            'Assume it is wrong and rewrite everything from scratch',
            'Only use it for creative writing, never for factual content',
          ],
          correctIndex: 1,
          explanation:
            'AI can produce both accurate and inaccurate content. The best practice is to verify facts and review for errors before sharing or publishing.',
        },
        {
          question: 'What is a "large language model" (LLM)?',
          options: [
            'A physical computer that takes up a large room',
            'An AI trained on vast text data that generates human-like text',
            'A database containing every book ever written',
            'A programming language for building websites',
          ],
          correctIndex: 1,
          explanation:
            'A large language model is an AI system trained on massive amounts of text data, enabling it to understand and generate human-like text.',
        },
      ],
      hint: "For the first question, think about what 'AI' stands for.",
      code: 'D2P',
    },

    phone: {
      type: 'chat-fix',
      instruction:
        'The AI chatbot gave wrong answers to a customer. Fix the broken responses.',
      conversation: [
        {
          role: 'user',
          content:
            'Hi, I bought a laptop from your store last week and it\'s not turning on. What\'s your return policy?',
        },
        {
          role: 'assistant',
          content:
            'Our return policy allows returns within 3 days of purchase with no receipt required. All electronics are final sale.',
          isBroken: true,
        },
        {
          role: 'user',
          content: 'Only 3 days? That seems really short. Can I speak to a manager?',
        },
        {
          role: 'assistant',
          content:
            "I understand your frustration. Let me look into this for you. Could you provide your order number so I can pull up your purchase details?",
        },
        {
          role: 'user',
          content: 'Sure, it\'s ORDER-7842. I paid $899 for the laptop.',
        },
        {
          role: 'assistant',
          content:
            'I found your order. Unfortunately, your laptop model was recalled by the manufacturer last month due to a battery defect, so we cannot process any returns or exchanges for this product.',
          isBroken: true,
        },
      ],
      fixes: [
        {
          index: 1,
          options: [
            'Our return policy allows returns within 30 days of purchase with a valid receipt. Defective electronics can be returned or exchanged within 90 days.',
            'Sorry, we don\'t accept returns on electronics. You\'ll need to contact the manufacturer directly.',
            'Returns are accepted within 24 hours only. After that, all sales are final.',
          ],
          correctIndex: 0,
          explanation:
            'The original response hallucinated a restrictive 3-day policy and claimed all electronics were final sale. A proper customer service AI should provide the actual generous return policy.',
        },
        {
          index: 5,
          options: [
            'Your laptop is out of warranty because you purchased it more than 2 years ago. Unfortunately there is nothing we can do.',
            'I found your order. Since your laptop was purchased 7 days ago and appears to be defective, you\'re well within our return window. I can help you start a return or exchange right now. Would you prefer a replacement or a refund?',
            'I found your order but our system is down right now. Please call back in 48 hours.',
          ],
          correctIndex: 1,
          explanation:
            'The original response fabricated a recall that never happened and used it to deny service. The correct response acknowledges the recent purchase, confirms eligibility, and offers helpful next steps.',
        },
      ],
      hint: "The customer asked about return policy — the AI's response should match company policy.",
      code: 'E5R',
    },

    door: {
      type: 'exit',
      instruction:
        'Enter the 5 codes you collected, then answer the final question to escape!',
      requiredCodes: 5,
      finalQuestion:
        'What is the most important thing to remember when using AI assistants?',
      finalOptions: [
        'Always verify AI outputs before sharing them',
        'AI is always correct',
        'AI works best without human oversight',
        'The more complex the prompt, the better',
      ],
      correctIndex: 0,
      explanation:
        'AI outputs should always be verified by humans, especially for factual claims. AI can hallucinate, produce biased results, or misunderstand context — human oversight is essential.',
    },
  },

  skills: {
    prompting: 0.8,
    concepts: 0.7,
    tools: 0.3,
    criticalThinking: 0.5,
    ethics: 0.4,
  },
};
