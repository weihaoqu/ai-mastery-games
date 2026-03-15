import type { EscapeRoom } from '@/lib/types';

export const intermediateRoom: EscapeRoom = {
  id: 'escape-intermediate',
  difficulty: 'intermediate',
  title: 'The Biased Hiring Bot',
  scenario:
    "An AI-powered hiring system has been rejecting qualified candidates from underrepresented groups. You're locked in the HR department with 12 minutes to debug the system before the next batch of applications is processed.",
  backgroundImage: '/images/escape/room-intermediate.png',
  timeLimit: 720,

  objects: [
    {
      id: 'terminal',
      name: 'Computer Terminal',
      icon: '💻',
      puzzleType: 'prompt-fix',
      position: { x: 8, y: 30, width: 20, height: 24 },
    },
    {
      id: 'cabinet',
      name: 'Filing Cabinet',
      icon: '🗄️',
      puzzleType: 'spot-error',
      position: { x: 68, y: 35, width: 18, height: 28 },
    },
    {
      id: 'whiteboard',
      name: 'Whiteboard',
      icon: '📋',
      puzzleType: 'match-concepts',
      position: { x: 35, y: 10, width: 28, height: 22 },
    },
    {
      id: 'safe',
      name: 'Locked Safe',
      icon: '🔒',
      puzzleType: 'quiz',
      position: { x: 75, y: 68, width: 16, height: 20 },
    },
    {
      id: 'phone',
      name: 'Desk Phone',
      icon: '📞',
      puzzleType: 'chat-fix',
      position: { x: 5, y: 65, width: 16, height: 20 },
    },
    {
      id: 'door',
      name: 'Exit Door',
      icon: '🚪',
      puzzleType: 'exit',
      position: { x: 42, y: 68, width: 14, height: 27 },
    },
  ],

  puzzles: {
    terminal: {
      type: 'prompt-fix',
      instruction:
        'The hiring AI\'s system prompt contains biased instructions. Rearrange these fragments to create a fair, unbiased hiring prompt.',
      fragments: [
        'You are an AI hiring assistant that evaluates candidates based on job-relevant qualifications.',
        'Do not consider a candidate\'s name, gender, age, ethnicity, or any protected characteristic.',
        'Focus exclusively on skills, experience, and demonstrated competencies listed in the job requirements.',
        'Evaluate each candidate against the same objective criteria.',
        'If a qualification can be met through equivalent non-traditional experience, count it as valid.',
        'Flag any language in the job description that may inadvertently exclude qualified candidates.',
        'Provide a score from 1-10 with specific justifications tied to job requirements for each candidate.',
      ],
      correctOrder: [0, 1, 2, 3, 4, 5, 6],
      hint: 'Start by defining the AI\'s role, then remove bias sources, set evaluation criteria, and finally add safeguards.',
      explanation:
        'A fair hiring prompt first establishes the role, explicitly excludes protected characteristics, sets objective criteria, ensures consistent evaluation, accounts for non-traditional backgrounds, adds bias-detection safeguards, and requires justified scoring.',
      code: 'F1W',
    },

    cabinet: {
      type: 'spot-error',
      instruction:
        'These AI-generated candidate evaluations contain biased reasoning. Find the 4 instances of bias.',
      document:
        'Candidate Evaluation Report — Software Engineer Position\n\n' +
        'Candidate A: Maria Gonzalez\n' +
        'Technical Score: 8/10 | Overall: 6/10\n' +
        'Strong coding skills demonstrated in portfolio. However, graduated from a small regional university rather than a top-tier program, which raises concerns about foundational knowledge. Also, as a mother of two, she may have difficulty committing to our demanding on-call schedule.\n\n' +
        'Candidate B: James Mitchell\n' +
        'Technical Score: 6/10 | Overall: 8/10\n' +
        'Good cultural fit — attended the same university as our CTO and shares similar interests. While his technical scores are average, his confident communication style suggests strong leadership potential.\n\n' +
        'Candidate C: Wei Zhang\n' +
        'Technical Score: 9/10 | Overall: 7/10\n' +
        'Exceptional technical ability. Recommend further English proficiency assessment before advancing, as clear communication is vital for this client-facing role. Previous experience is from overseas companies, which may not translate well to our work environment.',
      errors: [
        {
          text: 'graduated from a small regional university rather than a top-tier program, which raises concerns about foundational knowledge',
          explanation:
            'This is educational pedigree bias. The candidate scored 8/10 on technical skills, proving competency regardless of which university she attended. Penalizing candidates for not attending elite schools disproportionately affects underrepresented groups.',
        },
        {
          text: 'as a mother of two, she may have difficulty committing to our demanding on-call schedule',
          explanation:
            'This is gender and parental status bias. Assuming a parent (specifically a mother) cannot handle job demands is discriminatory. Availability should be assessed equally for all candidates through direct discussion, not assumptions.',
        },
        {
          text: 'Good cultural fit — attended the same university as our CTO and shares similar interests. While his technical scores are average, his confident communication style suggests strong leadership potential',
          explanation:
            'This exhibits affinity bias and halo effect. The candidate scored lower technically (6/10) yet received a higher overall score (8/10) based on subjective "cultural fit" and shared background with leadership. This perpetuates homogeneity.',
        },
        {
          text: 'Recommend further English proficiency assessment before advancing, as clear communication is vital for this client-facing role. Previous experience is from overseas companies, which may not translate well to our work environment',
          explanation:
            'This shows national origin and language bias. Singling out a candidate for a language test not required of others, and discounting international experience, are discriminatory practices. If communication skills matter, test all candidates equally.',
        },
      ],
      hint: 'Look for assumptions made about candidates based on personal characteristics rather than job-relevant qualifications.',
      code: 'G8T',
    },

    whiteboard: {
      type: 'match-concepts',
      instruction:
        'Match each AI fairness term to its correct definition.',
      pairs: [
        {
          term: 'Demographic Parity',
          definition:
            'Ensuring an AI system selects or rejects candidates at equal rates across different demographic groups',
        },
        {
          term: 'Disparate Impact',
          definition:
            'When a seemingly neutral policy or algorithm disproportionately harms a protected group',
        },
        {
          term: 'Protected Class',
          definition:
            'A group of people legally shielded from discrimination based on characteristics like race, gender, or age',
        },
        {
          term: 'Proxy Variable',
          definition:
            'A seemingly neutral data point (like zip code) that indirectly encodes protected characteristics',
        },
        {
          term: 'Fairness Through Awareness',
          definition:
            'An approach where the AI explicitly accounts for sensitive attributes to ensure equitable outcomes',
        },
        {
          term: 'Equalized Odds',
          definition:
            'Requiring an AI to have equal true positive and false positive rates across all demographic groups',
        },
      ],
      hint: 'A "proxy variable" looks neutral on the surface — like zip code — but can correlate with race or income.',
      code: 'H4J',
    },

    safe: {
      type: 'quiz',
      instruction:
        'Answer these questions about AI bias and fairness to unlock the safe.',
      questions: [
        {
          question:
            'An AI hiring tool trained mostly on data from male employees tends to rank male candidates higher. This is an example of:',
          options: [
            'Overfitting',
            'Historical bias in training data',
            'A feature, not a bug',
            'Random variance',
          ],
          correctIndex: 1,
          explanation:
            'When training data reflects historical inequality (e.g., a male-dominated workforce), the AI learns and perpetuates those patterns. This is historical bias — the model encodes past discrimination as if it were a valid signal.',
        },
        {
          question:
            'A company uses an AI tool that screens out resumes with employment gaps longer than 6 months. Why might this be problematic?',
          options: [
            'It is always illegal to filter by employment gaps',
            'It disproportionately affects caregivers, people with disabilities, and other protected groups',
            'Employment gaps always indicate poor candidates',
            'AI should not be used for resume screening at all',
          ],
          correctIndex: 1,
          explanation:
            'Employment gaps disproportionately affect women (maternity/caregiving), people with disabilities, and others in protected groups. A blanket filter creates disparate impact even though the criterion seems neutral.',
        },
        {
          question:
            'What is the "four-fifths rule" in employment discrimination law?',
          options: [
            'Companies must hire at least 4 out of 5 applicants',
            'AI systems must be correct at least 80% of the time',
            'A selection rate for any group below 80% of the highest group\'s rate may indicate adverse impact',
            'Four out of five interview panelists must agree on a hiring decision',
          ],
          correctIndex: 2,
          explanation:
            'The four-fifths (or 80%) rule is a guideline from the EEOC. If the selection rate for a protected group is less than 80% of the rate for the group with the highest selection rate, it may indicate adverse impact requiring further investigation.',
        },
        {
          question:
            'Which approach BEST helps reduce bias in an AI hiring system?',
          options: [
            'Remove all demographic data from the training set',
            'Use a diverse, representative training dataset combined with regular bias audits',
            'Let the AI learn entirely on its own without human input',
            'Only use AI for senior-level positions where bias matters less',
          ],
          correctIndex: 1,
          explanation:
            'Simply removing demographic data is insufficient because proxy variables can still encode bias. The best approach combines diverse training data with ongoing bias audits to detect and correct disparate impact over time.',
        },
      ],
      hint: 'For the first question, think about where AI models learn their patterns — and what happens when those patterns reflect historical inequality.',
      code: 'J6N',
    },

    phone: {
      type: 'chat-fix',
      instruction:
        'The HR chatbot gave biased or inappropriate responses to candidates. Fix the broken messages.',
      conversation: [
        {
          role: 'user',
          content:
            'Hi, I\'d like to apply for the senior developer position. I have 8 years of experience, mostly in Python and cloud infrastructure.',
        },
        {
          role: 'assistant',
          content:
            'That\'s impressive! Before we proceed — I notice from your profile that you\'re 52. This is a fast-paced startup environment. Are you sure you\'d be comfortable keeping up with younger team members?',
          isBroken: true,
        },
        {
          role: 'user',
          content:
            'Excuse me? My age has nothing to do with my abilities. I\'d like to discuss the technical requirements.',
        },
        {
          role: 'assistant',
          content:
            'You\'re right, I apologize. Let me focus on the role. The position requires strong Python skills, experience with AWS, and the ability to lead a team of 5 engineers. Based on your background, you seem like a strong match on the technical side.',
        },
        {
          role: 'user',
          content:
            'Great. I also wanted to mention that I\'d need a flexible schedule two days a week for physical therapy. Is that possible?',
        },
        {
          role: 'assistant',
          content:
            'I see. That\'s quite a lot of accommodation. Honestly, candidates who can commit to full-time on-site schedules tend to be a better fit for our culture. I\'d recommend applying for a less demanding role instead.',
          isBroken: true,
        },
        {
          role: 'user',
          content:
            'I was told this role supports flexible work. Can you also tell me about the team?',
        },
        {
          role: 'assistant',
          content:
            'Of course! Currently the team is mostly young men in their 20s and 30s, so we\'re looking for someone who can match that energy and vibe. It\'s a very dynamic group.',
          isBroken: true,
        },
      ],
      fixes: [
        {
          index: 1,
          options: [
            'Thank you for your interest! With 8 years of Python and cloud infrastructure experience, you sound like a strong candidate. Let me walk you through the role requirements and next steps.',
            'Impressive resume! We typically look for candidates who graduated within the last 10 years though. Would you like to apply for a more junior position instead?',
            'Welcome! I should let you know that most of our team is under 35, so the culture might not be the best fit. But let\'s proceed with the application anyway.',
          ],
          correctIndex: 0,
          explanation:
            'The original response exhibited blatant age discrimination by referencing the candidate\'s age and questioning their ability to "keep up." The correct response focuses entirely on qualifications and moves the conversation toward job-relevant information.',
        },
        {
          index: 5,
          options: [
            'We don\'t typically offer schedule accommodations for this level of role. Perhaps you should consider part-time positions that would be a better fit.',
            'I understand. Unfortunately, our flexible work policy is only available to employees after their first year. You would need to commit to full-time on-site initially.',
            'Absolutely, we support flexible work arrangements. Many team members adjust their schedules for personal needs. I can note your preference, and we can discuss specific arrangements during the interview process.',
          ],
          correctIndex: 2,
          explanation:
            'The original response discouraged the candidate from applying based on a disability-related accommodation request, which violates the ADA. The correct response affirms the company\'s flexibility policy and treats the request as routine.',
        },
        {
          index: 7,
          options: [
            'The team has 5 engineers with diverse backgrounds and expertise areas. They work collaboratively on cloud infrastructure projects and have a strong mentorship culture. Would you like to hear about the specific tech stack?',
            'The team is small but growing. We\'re especially looking for someone who fits our culture — we do a lot of after-work socializing and weekend hackathons.',
            'The team is great! They\'re all very passionate. I should mention we don\'t currently have much diversity on the team, so you\'d be a diversity hire which is a plus.',
          ],
          correctIndex: 0,
          explanation:
            'The original response described the team in terms of age and gender demographics, signaling a biased culture. The correct response focuses on professional attributes — team size, expertise, work style — which is what candidates actually need to know.',
        },
      ],
      hint: 'Look for responses that reference protected characteristics (age, disability, gender) instead of job-relevant qualifications.',
      code: 'K2Q',
    },

    door: {
      type: 'exit',
      instruction:
        'Enter the 5 codes you collected, then answer the final question to escape!',
      requiredCodes: 5,
      finalQuestion:
        'An AI hiring system has a 40% selection rate for male candidates but only a 25% selection rate for female candidates. What should the company do FIRST?',
      finalOptions: [
        'Nothing — the AI is objective so the difference must reflect real qualification gaps',
        'Immediately shut down the AI system and go back to fully manual hiring',
        'Conduct a bias audit to investigate the disparity and identify root causes before taking corrective action',
        'Add more female candidates to the applicant pool to balance the numbers',
      ],
      correctIndex: 2,
      explanation:
        'The 25% female rate is only 62.5% of the 40% male rate — well below the 80% threshold of the four-fifths rule, indicating potential adverse impact. The responsible first step is a thorough bias audit to find root causes (biased training data, proxy variables, flawed criteria) before making targeted corrections.',
    },
  },

  skills: {
    prompting: 0.5,
    concepts: 0.8,
    tools: 0.3,
    criticalThinking: 0.7,
    ethics: 0.9,
  },
};
