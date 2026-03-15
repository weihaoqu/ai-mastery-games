import type { OptimizeChallenge } from '@/lib/types';

export const intermediateOptimizeChallenges: OptimizeChallenge[] = [
  {
    id: 'opt-int-01',
    difficulty: 'intermediate',
    task: 'Generate a Python function to validate email addresses',
    steps: [
      {
        prompt: 'Write a Python function to check if an email is valid',
        output: 'def is_valid_email(email): return "@" in email and "." in email. This checks if the email contains @ and a dot.',
        options: [
          { text: 'Add "Use regex, handle edge cases like consecutive dots and missing TLDs, and include type hints"', isCorrect: true, explanation: 'Specifying the approach, edge cases, and code standards produces robust, production-ready code.' },
          { text: 'Add "Make it really thorough and handle everything"', isCorrect: false, explanation: 'Without naming specific edge cases, the AI can\'t know which validations matter to you.' },
          { text: 'Add "Add comments to the code"', isCorrect: false, explanation: 'Comments are nice but don\'t fix the underlying logic problem of oversimplified validation.' },
        ],
        skill: 'specificity',
      },
      {
        prompt: 'Write a Python function using regex to validate email addresses. Handle edge cases like consecutive dots, missing TLDs, and spaces. Include type hints.',
        output: 'def is_valid_email(email: str) -> bool: pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" return bool(re.match(pattern, email.strip()))...',
        options: [
          { text: 'Add "Include 5 test cases showing valid and invalid emails with expected results"', isCorrect: true, explanation: 'Requesting concrete examples helps verify correctness and serves as documentation.' },
          { text: 'Add "Explain what regex is"', isCorrect: false, explanation: 'A regex explanation doesn\'t improve the function itself — test cases are more valuable.' },
          { text: 'Add "Make it faster"', isCorrect: false, explanation: 'Email validation is not performance-critical; correctness via test cases matters more here.' },
        ],
        skill: 'few-shot',
      },
    ],
    skills: { prompting: 0.7, concepts: 0.4, tools: 0.4, criticalThinking: 0.3, ethics: 0.1 },
  },
  {
    id: 'opt-int-02',
    difficulty: 'intermediate',
    task: 'Create a social media marketing campaign for a new coffee shop',
    steps: [
      {
        prompt: 'Write social media posts for my coffee shop',
        output: 'Post 1: Come visit our coffee shop! We have great coffee. Post 2: Start your morning right with our coffee! Post 3: Best coffee in town!',
        options: [
          { text: 'Add "Target audience is remote workers aged 25-35. The shop has free Wi-Fi, specialty lattes, and a coworking area."', isCorrect: true, explanation: 'Defining the audience and unique selling points lets the AI craft targeted, differentiated messaging.' },
          { text: 'Add "Make them go viral"', isCorrect: false, explanation: 'Virality is an outcome, not an instruction — the AI needs audience and brand details instead.' },
          { text: 'Add "Write 10 more posts"', isCorrect: false, explanation: 'More generic posts won\'t be better than fewer targeted ones with audience context.' },
        ],
        skill: 'context',
      },
      {
        prompt: 'Write social media posts for a coffee shop targeting remote workers aged 25-35. The shop has free Wi-Fi, specialty lattes, and a coworking area.',
        output: 'Post 1: Tired of working from your couch? Our coworking space has fast Wi-Fi and bottomless drip coffee. Post 2: Our oat milk lavender latte pairs perfectly with your morning standup...',
        options: [
          { text: 'Add "For each post, specify the platform (Instagram/Twitter/LinkedIn), include a call-to-action, and suggest a relevant hashtag strategy"', isCorrect: true, explanation: 'Platform-specific formatting and CTAs make posts immediately publishable and actionable.' },
          { text: 'Add "Make them funny"', isCorrect: false, explanation: 'Humor style is subjective — platform constraints and CTAs have more practical impact.' },
          { text: 'Add "Use trendy language"', isCorrect: false, explanation: 'Trendy language without platform strategy won\'t improve campaign effectiveness.' },
        ],
        skill: 'constraints',
      },
      {
        prompt: 'Write social media posts for a coffee shop targeting remote workers aged 25-35. The shop has free Wi-Fi, specialty lattes, and a coworking area. For each post, specify the platform, include a call-to-action, and suggest hashtags.',
        output: 'Instagram: Photo of latte art — "Your office upgrade starts here. Tag a coworker who needs this. #RemoteWorkLife #CoffeeShopOffice" LinkedIn: "We built a space where productivity meets great coffee. Book a free trial day — link in bio."',
        options: [
          { text: 'Add "Create a 1-week content calendar with posting times optimized for each platform"', isCorrect: true, explanation: 'A structured calendar with timing transforms individual posts into a coordinated campaign strategy.' },
          { text: 'Add "Write longer captions"', isCorrect: false, explanation: 'Caption length should vary by platform — a calendar structure is a bigger strategic improvement.' },
          { text: 'Add "Include more emojis"', isCorrect: false, explanation: 'Emojis are a minor stylistic choice compared to scheduling and campaign structure.' },
        ],
        skill: 'chain-of-thought',
      },
    ],
    skills: { prompting: 0.8, concepts: 0.3, tools: 0.3, criticalThinking: 0.4, ethics: 0.1 },
  },
  {
    id: 'opt-int-03',
    difficulty: 'intermediate',
    task: 'Analyze customer survey data to find trends',
    steps: [
      {
        prompt: 'Analyze this survey data and tell me what you find',
        output: 'I\'d be happy to analyze your data. Please share the data and I\'ll look for patterns. Generally, surveys reveal trends in satisfaction and preferences...',
        options: [
          { text: 'Add "Here are 3 example responses: [5 stars, fast shipping, would buy again], [2 stars, late delivery, frustrated], [4 stars, good product, slow support]. Identify the top 3 themes."', isCorrect: true, explanation: 'Providing example data and a specific analytical goal lets the AI demonstrate its actual analysis capabilities.' },
          { text: 'Add "Find all the insights"', isCorrect: false, explanation: 'Without sample data or specific metrics, the AI can only give generic advice about analysis.' },
          { text: 'Add "Use data science techniques"', isCorrect: false, explanation: 'Naming techniques without providing data doesn\'t produce actionable analysis.' },
        ],
        skill: 'few-shot',
      },
      {
        prompt: 'Analyze these customer survey responses and identify the top 3 themes. Examples: [5 stars, fast shipping, would buy again], [2 stars, late delivery, frustrated], [4 stars, good product, slow support].',
        output: 'Theme 1: Shipping speed is a key driver — positive reviews mention fast shipping, negative ones cite delays. Theme 2: Product quality is generally positive. Theme 3: Customer support speed needs improvement.',
        options: [
          { text: 'Add "For each theme, rate its business impact (high/medium/low), suggest one specific action item, and explain your reasoning step by step"', isCorrect: true, explanation: 'Asking for impact ratings and reasoning forces structured, prioritized analysis instead of just listing themes.' },
          { text: 'Add "Give me more themes"', isCorrect: false, explanation: 'More themes from limited data risks hallucination — deeper analysis of existing themes is more valuable.' },
          { text: 'Add "Make it sound more analytical"', isCorrect: false, explanation: 'Tone doesn\'t improve analytical rigor — structured reasoning requirements do.' },
        ],
        skill: 'chain-of-thought',
      },
    ],
    skills: { prompting: 0.7, concepts: 0.4, tools: 0.3, criticalThinking: 0.5, ethics: 0.1 },
  },
  {
    id: 'opt-int-04',
    difficulty: 'intermediate',
    task: 'Draft a project status update email for stakeholders',
    steps: [
      {
        prompt: 'Write a status update email about my project',
        output: 'Subject: Update. Hi team, the project is going well. We\'ve made progress and are on track. Let me know if you have questions.',
        options: [
          { text: 'Add "The project is a mobile app redesign. We completed the user research phase, are 2 weeks behind on wireframes due to a team member leaving, and need budget approval for usability testing."', isCorrect: true, explanation: 'Concrete project details, status, blockers, and asks give the AI everything needed for a useful update.' },
          { text: 'Add "Make it more detailed and informative"', isCorrect: false, explanation: 'Without actual project details, the AI can only add generic filler, not real information.' },
          { text: 'Add "Use a professional template"', isCorrect: false, explanation: 'A template without real content is just a nicer-looking empty update.' },
        ],
        skill: 'context',
      },
      {
        prompt: 'Write a project status update email. The project is a mobile app redesign. We completed user research, are 2 weeks behind on wireframes due to a team member leaving, and need budget approval for usability testing.',
        output: 'Subject: Mobile App Redesign — Status Update. Hi team, User research is complete with 15 interviews conducted. Wireframes are 2 weeks behind schedule due to a staffing gap. We need $5K budget approval for usability testing by March 20...',
        options: [
          { text: 'Add "Structure with sections: Completed, In Progress, Blockers, and Next Steps. Include a risk level (green/yellow/red) and specific dates."', isCorrect: true, explanation: 'A standardized structure with risk indicators makes the update scannable and actionable for busy stakeholders.' },
          { text: 'Add "Keep it short"', isCorrect: false, explanation: 'Brevity without structure can lose important details — organized sections are more effective.' },
          { text: 'Add "CC the whole company"', isCorrect: false, explanation: 'Distribution decisions don\'t improve the email content itself.' },
        ],
        skill: 'constraints',
      },
      {
        prompt: 'Write a project status update email for the mobile app redesign. User research complete, wireframes 2 weeks behind due to staffing, need budget approval for usability testing. Structure with Completed, In Progress, Blockers, Next Steps sections. Include risk level and dates.',
        output: 'Subject: Mobile App Redesign — Week 8 Update [YELLOW]. Completed: User research (15 interviews, synthesis report attached). In Progress: Wireframes (target: March 28, was March 14). Blockers: Need $5K usability testing budget by March 20. Next Steps: Hire contract designer by March 15.',
        options: [
          { text: 'Add "For each blocker, explain the impact if unresolved and who owns the decision, so stakeholders can act immediately"', isCorrect: true, explanation: 'Linking blockers to consequences and owners turns a status report into a decision-driving document.' },
          { text: 'Add "Add a motivational quote at the end"', isCorrect: false, explanation: 'Motivational quotes don\'t help stakeholders make decisions or take action.' },
          { text: 'Add "Mention that the team is working hard"', isCorrect: false, explanation: 'Effort statements don\'t provide actionable information for stakeholders.' },
        ],
        skill: 'chain-of-thought',
      },
    ],
    skills: { prompting: 0.7, concepts: 0.3, tools: 0.2, criticalThinking: 0.5, ethics: 0.2 },
  },
];
