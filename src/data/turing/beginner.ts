import type { TuringItem } from '../../lib/types';

export const beginnerItems: TuringItem[] = [
  // ============================================================
  // EMAIL — AI Generated
  // ============================================================
  {
    id: 'beg-email-01',
    contentType: 'email',
    difficulty: 'beginner',
    title: 'Project Update Email',
    content: `Subject: Project Status Update — Q3 Deliverables

Dear Team,

I hope this email finds you well. I am writing to provide a comprehensive update regarding the status of our Q3 deliverables and to outline the next steps for our collaborative efforts.

First and foremost, I would like to express my sincere gratitude for your continued dedication and hard work. Your contributions have been invaluable in driving our project forward.

Here is a summary of our current progress:

1. The data migration phase has been completed successfully, with all records transferred to the new system.
2. Quality assurance testing is currently underway, with an estimated completion date of September 15th.
3. Stakeholder feedback has been incorporated into the revised project timeline.
4. Documentation updates are being finalized to reflect the latest changes.

It is worth noting that while we have encountered some minor challenges along the way, the team has demonstrated remarkable resilience and adaptability. Moving forward, I would recommend that we schedule a follow-up meeting to discuss any remaining concerns and ensure alignment across all departments.

Please do not hesitate to reach out if you have any questions or require further clarification.

Best regards,
Project Management Office`,
    isAI: true,
    aiModel: 'GPT-4',
    markers: [
      {
        text: 'I hope this email finds you well',
        explanation: 'Classic AI opening — overly formal and generic. Real workplace emails rarely start this way among teammates.',
        type: 'ai-tell',
      },
      {
        text: 'First and foremost, I would like to express my sincere gratitude for your continued dedication and hard work',
        explanation: 'Unnecessarily formal praise with no specifics. AI tends to pad with polite filler.',
        type: 'ai-tell',
      },
      {
        text: 'It is worth noting that while we have encountered some minor challenges along the way, the team has demonstrated remarkable resilience and adaptability',
        explanation: 'Vague hedging followed by generic praise — a hallmark of AI-generated corporate language.',
        type: 'ai-tell',
      },
      {
        text: 'Please do not hesitate to reach out if you have any questions or require further clarification',
        explanation: 'Boilerplate closing that AI almost always includes. Real people usually just say "let me know."',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This email is AI-generated. The telltale signs include an overly formal tone, generic pleasantries, perfectly structured numbered lists, and the absence of any personal voice or specific details about real project challenges.',
    skills: { prompting: 0.2, concepts: 0.6, tools: 0.1, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // EMAIL — Human Written
  // ============================================================
  {
    id: 'beg-email-02',
    contentType: 'email',
    difficulty: 'beginner',
    title: 'Team Standup Follow-up',
    content: `Subject: re: standup notes

hey all,

quick recap from this morning since Jake wasn't on the call —

- DB migration is DONE (finally lol). took way longer than we thought bc of those legacy timestamp formats. Maria ended up writing a custom parser at like 11pm last night, absolute legend
- QA is running but honestly we're behind. prob won't hit the 15th deadline, more like the 19th? I'll talk to Priya about adjusting the timeline
- the stakeholder feedback thing... yeah. let's just say marketing wants "more pizzazz" in the dashboard. still trying to figure out what that means concretely

also heads up — the coffee machine on 3rd floor is broken again. just use the one by the elevators

if anyone needs me I'll be in the small conf room til 3

-Tomas`,
    isAI: false,
    humanSource: 'Software project manager',
    markers: [
      {
        text: 'finally lol',
        explanation: 'Casual humor and internet slang — human writers naturally inject personality into work communications.',
        type: 'human-tell',
      },
      {
        text: 'Maria ended up writing a custom parser at like 11pm last night, absolute legend',
        explanation: 'Specific personal anecdote with casual praise — humans reference real people and real events.',
        type: 'human-tell',
      },
      {
        text: 'the stakeholder feedback thing... yeah. let\'s just say marketing wants "more pizzazz" in the dashboard',
        explanation: 'Ellipsis, hedging with humor, and quoting a vague request — shows genuine frustration that AI wouldn\'t produce.',
        type: 'human-tell',
      },
      {
        text: 'the coffee machine on 3rd floor is broken again',
        explanation: 'Off-topic tangent about office life — humans naturally mix work and non-work topics.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This email is human-written. The casual tone, specific personal references (Maria, Jake, Priya), humor, tangential comments about the coffee machine, and genuine frustration about vague stakeholder requests all point to a real person.',
    skills: { prompting: 0.2, concepts: 0.6, tools: 0.1, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // ESSAY — AI Generated
  // ============================================================
  {
    id: 'beg-essay-01',
    contentType: 'essay',
    difficulty: 'beginner',
    title: 'The Impact of Social Media on Society',
    content: `In today's rapidly evolving digital landscape, social media has emerged as one of the most transformative forces in modern society. From reshaping interpersonal communication to influencing political discourse, the impact of platforms such as Facebook, Twitter, and Instagram cannot be overstated.

On one hand, social media has democratized access to information, enabling individuals from all walks of life to share their perspectives and connect with like-minded communities across the globe. This unprecedented level of connectivity has fostered greater cultural exchange, facilitated social movements, and provided marginalized voices with platforms for expression.

On the other hand, the proliferation of social media has also given rise to significant concerns. The spread of misinformation, the erosion of privacy, and the potential for addictive usage patterns represent serious challenges that society must address. Furthermore, studies have shown that excessive social media use can contribute to anxiety, depression, and diminished self-esteem, particularly among younger demographics.

In conclusion, while social media offers numerous benefits that have fundamentally altered the way we communicate and interact, it is essential that we approach these platforms with a critical eye. By fostering digital literacy and implementing thoughtful regulation, we can harness the positive potential of social media while mitigating its adverse effects. The responsibility lies with individuals, platforms, and policymakers alike to ensure that social media serves as a force for good in our increasingly connected world.`,
    isAI: true,
    aiModel: 'GPT-4',
    markers: [
      {
        text: 'In today\'s rapidly evolving digital landscape',
        explanation: 'One of the most common AI essay openers — a vague, grandiose phrase that says nothing specific.',
        type: 'ai-tell',
      },
      {
        text: 'cannot be overstated',
        explanation: 'AI frequently uses this hyperbolic filler phrase. Human writers tend to be more measured or specific.',
        type: 'ai-tell',
      },
      {
        text: 'On one hand',
        explanation: 'The "on one hand / on the other hand" structure is an AI default for presenting balanced arguments — mechanically perfect but formulaic.',
        type: 'ai-tell',
      },
      {
        text: 'In conclusion, while social media offers numerous benefits',
        explanation: 'The "In conclusion, while X offers benefits..." pattern is a classic AI essay conclusion template.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This essay is AI-generated. It follows a rigid five-paragraph structure, uses generic hedging language, presents perfectly balanced pros and cons without original insight, and relies heavily on cliched phrases like "rapidly evolving digital landscape."',
    skills: { prompting: 0.3, concepts: 0.7, tools: 0.1, criticalThinking: 0.6, ethics: 0.4 },
  },

  // ============================================================
  // ESSAY — Human Written
  // ============================================================
  {
    id: 'beg-essay-02',
    contentType: 'essay',
    difficulty: 'beginner',
    title: 'Why I Deleted Instagram',
    content: `I deleted Instagram three months ago and I still reach for my phone expecting it to be there. That little muscle memory twitch where my thumb goes to the bottom-right corner of my home screen — it's embarrassing how automatic it was.

The tipping point wasn't some dramatic realization. It was a Tuesday. I was at dinner with my best friend, someone I hadn't seen in two months, and I caught myself mentally composing the caption for a photo of my pasta. Not enjoying the pasta. Not listening to her talk about her new job. Composing a caption. That's when I thought, okay, something is actually wrong here.

The first week was genuinely hard. I kept thinking "oh that would make a good story" or "I should post this." By week three, those impulses mostly faded and something weird happened — I started noticing things differently. Like actually looking at a sunset instead of evaluating whether it was "postable." It sounds corny but it's true.

I'm not gonna pretend I'm some enlightened person now. I still waste plenty of time on YouTube and I check Twitter more than I should. But removing that one app changed something fundamental about how I experience my own life. I'm no longer performing it for an audience. And honestly? That's been worth more than any number of likes ever was.`,
    isAI: false,
    humanSource: 'Personal blog writer',
    markers: [
      {
        text: 'That little muscle memory twitch where my thumb goes to the bottom-right corner of my home screen',
        explanation: 'Hyper-specific sensory detail drawn from personal experience — AI generates generic observations, not physical muscle memory.',
        type: 'human-tell',
      },
      {
        text: 'It was a Tuesday',
        explanation: 'The mundane specificity of naming a random day. Humans remember these trivial details; AI tends to pick dramatic moments.',
        type: 'human-tell',
      },
      {
        text: 'I\'m not gonna pretend I\'m some enlightened person now',
        explanation: 'Self-deprecating honesty and casual contractions — AI essays typically maintain a consistent positive or balanced tone.',
        type: 'human-tell',
      },
      {
        text: 'It sounds corny but it\'s true',
        explanation: 'Meta-commentary acknowledging the cliche of their own statement. AI rarely undermines its own points this way.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This essay is human-written. The deeply personal anecdotes, self-deprecating humor, specific sensory details (thumb muscle memory, Tuesday dinner), and willingness to undermine its own points all indicate a real person reflecting on genuine experience.',
    skills: { prompting: 0.3, concepts: 0.7, tools: 0.1, criticalThinking: 0.6, ethics: 0.4 },
  },

  // ============================================================
  // CODE — AI Generated
  // ============================================================
  {
    id: 'beg-code-01',
    contentType: 'code',
    difficulty: 'beginner',
    title: 'User Authentication Function',
    content: `def authenticate_user(username: str, password: str, database: Database) -> AuthResult:
    """
    Authenticate a user against the database.

    This function takes a username and password, validates them against
    the stored credentials in the database, and returns an AuthResult
    object indicating whether the authentication was successful.

    Args:
        username: The username of the user attempting to authenticate.
        password: The password provided by the user.
        database: The database connection object.

    Returns:
        AuthResult: An object containing the authentication status,
        user details if successful, and an error message if not.

    Raises:
        ValueError: If username or password is empty.
        DatabaseError: If there is an issue connecting to the database.
    """
    # Validate input parameters
    if not username:
        raise ValueError("Username cannot be empty")
    if not password:
        raise ValueError("Password cannot be empty")

    # Retrieve user from database
    user = database.get_user_by_username(username)

    # Check if user exists
    if user is None:
        return AuthResult(success=False, error="User not found")

    # Verify password using secure hashing
    hashed_password = hash_password(password, user.salt)

    # Compare hashed passwords
    if hashed_password == user.password_hash:
        # Generate authentication token
        token = generate_auth_token(user.id)
        return AuthResult(success=True, user=user, token=token)
    else:
        return AuthResult(success=False, error="Invalid password")`,
    isAI: true,
    aiModel: 'GPT-4',
    markers: [
      {
        text: '"""\n    Authenticate a user against the database.\n\n    This function takes a username and password, validates them against\n    the stored credentials in the database, and returns an AuthResult\n    object indicating whether the authentication was successful.',
        explanation: 'Excessively detailed docstring that restates what the function signature already tells you. AI over-documents by default.',
        type: 'ai-tell',
      },
      {
        text: '# Validate input parameters',
        explanation: 'AI adds comments before every logical block, even when the code is self-explanatory. The line "if not username" doesn\'t need a comment.',
        type: 'ai-tell',
      },
      {
        text: '# Check if user exists',
        explanation: 'Another redundant comment — "if user is None" already says exactly this. AI comments narrate each step.',
        type: 'ai-tell',
      },
      {
        text: '# Compare hashed passwords',
        explanation: 'The pattern of commenting every 2-3 lines with obvious descriptions is a classic AI code generation pattern.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This code is AI-generated. The telltale signs include an exhaustive docstring, a comment before nearly every code block (even obvious ones), perfectly structured error handling, and a textbook-perfect implementation with no shortcuts or personal style.',
    skills: { prompting: 0.2, concepts: 0.5, tools: 0.7, criticalThinking: 0.6, ethics: 0.2 },
  },

  // ============================================================
  // CODE — Human Written
  // ============================================================
  {
    id: 'beg-code-02',
    contentType: 'code',
    difficulty: 'beginner',
    title: 'Quick Auth Check',
    content: `def auth(uname, pw, db):
    # TODO: add rate limiting eventually
    if not uname or not pw:
        return None

    usr = db.find_user(uname)
    if not usr:
        return None  # don't reveal whether user exists

    if check_hash(pw, usr.pw_hash, usr.salt):
        tok = make_token(usr.id, expires=3600)  # 1hr
        return {"ok": True, "token": tok, "user_id": usr.id}

    return None  # same as user-not-found to prevent enumeration`,
    isAI: false,
    humanSource: 'Backend developer',
    markers: [
      {
        text: '# TODO: add rate limiting eventually',
        explanation: 'Real developers leave TODO comments about future improvements — AI generates "complete" code without acknowledged gaps.',
        type: 'human-tell',
      },
      {
        text: 'uname',
        explanation: 'Abbreviated parameter names reflect human laziness and personal shorthand. AI uses full descriptive names.',
        type: 'human-tell',
      },
      {
        text: "return None  # don't reveal whether user exists",
        explanation: 'A security-conscious inline comment showing real-world thinking. The developer knows about user enumeration attacks.',
        type: 'human-tell',
      },
      {
        text: 'expires=3600)  # 1hr',
        explanation: 'Terse inline comment translating a magic number. Humans add quick notes for their future selves; AI would use a named constant.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This code is human-written. The abbreviated variable names, TODO comment, terse inline notes, security-aware design choices, and lack of docstring all reflect a real developer\'s pragmatic coding style.',
    skills: { prompting: 0.2, concepts: 0.5, tools: 0.7, criticalThinking: 0.6, ethics: 0.2 },
  },

  // ============================================================
  // SOCIAL MEDIA — AI Generated
  // ============================================================
  {
    id: 'beg-social-01',
    contentType: 'social-media',
    difficulty: 'beginner',
    title: 'Product Review',
    imagePath: '/images/turing/beg-social-01.png',
    content: `I recently purchased the XR-7 Wireless Headphones and I must say, I am thoroughly impressed with the overall quality and performance of this product.

The sound quality is exceptional, delivering rich bass tones and crystal-clear highs that make every listening experience truly enjoyable. The noise cancellation feature works remarkably well, effectively blocking out ambient noise whether you're commuting, working in a busy office, or relaxing at home.

The build quality is outstanding, with premium materials that feel comfortable even during extended listening sessions. The battery life of 30 hours exceeded my expectations, and the quick-charge feature is incredibly convenient.

Overall, I would highly recommend the XR-7 Wireless Headphones to anyone looking for a premium audio experience. Whether you're a music enthusiast, a podcast lover, or someone who simply values high-quality sound, these headphones are an excellent investment. 5/5 stars!`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'I must say, I am thoroughly impressed with the overall quality and performance',
        explanation: 'Overly formal product review language. Real reviewers are more casual and specific about what they liked.',
        type: 'ai-tell',
      },
      {
        text: 'delivering rich bass tones and crystal-clear highs',
        explanation: 'Marketing-speak cliches. AI pulls from product descriptions rather than genuine listening experiences.',
        type: 'ai-tell',
      },
      {
        text: 'Whether you\'re a music enthusiast, a podcast lover, or someone who simply values high-quality sound',
        explanation: 'Covering all audience segments is a marketing tactic, not natural review behavior. Real people describe their own use case.',
        type: 'ai-tell',
      },
      {
        text: 'these headphones are an excellent investment',
        explanation: 'Calling a consumer product an "investment" is classic AI product-review language.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This review is AI-generated. It reads like marketing copy with no personal anecdotes, universally positive assessments, and formulaic coverage of every product feature. Real reviews are messier and more specific.',
    skills: { prompting: 0.3, concepts: 0.5, tools: 0.1, criticalThinking: 0.8, ethics: 0.3 },
  },

  // ============================================================
  // SOCIAL MEDIA — Human Written
  // ============================================================
  {
    id: 'beg-social-02',
    contentType: 'social-media',
    difficulty: 'beginner',
    title: 'Headphone Review on Reddit',
    imagePath: '/images/turing/beg-social-02.png',
    content: `Just got the XR-7s last week. Gonna be honest, I almost returned them on day 1 because the ear cups felt super tight out of the box. Like headache-level tight. But I stuck it out and they loosened up after 3-4 days of wear.

Sound quality is really good for the price point. I mainly listen to hip hop and electronic and the bass hits hard without being muddy. Tried them with some classical stuff too and it was fine, not amazing but fine.

ANC is solid. Tested it on my morning commute (NYC subway) and it cut out maybe 80% of the noise? Still heard the really loud stuff but way better than my old Sony XM3s which were dying.

Battery is as advertised. Got about 28 hrs on medium volume with ANC on, which is close enough to the 30hr claim.

My one gripe: the case. It's like they designed this beautiful headphone and then went to the dollar store for the case. Flimsy zipper, no internal padding. Already paranoid about throwing them in my backpack.

7.5/10 would buy again but FFS give us a decent case`,
    isAI: false,
    humanSource: 'Reddit user',
    markers: [
      {
        text: 'Like headache-level tight',
        explanation: 'Visceral, specific complaint with a personal pain point. AI reviews rarely start with negative first impressions.',
        type: 'human-tell',
      },
      {
        text: 'Tried them with some classical stuff too and it was fine, not amazing but fine',
        explanation: 'Honest mediocre assessment. AI tends toward uniformly positive or perfectly balanced — humans say "fine, not amazing."',
        type: 'human-tell',
      },
      {
        text: 'NYC subway',
        explanation: 'Specific real-world testing context. Humans ground reviews in their actual daily life.',
        type: 'human-tell',
      },
      {
        text: 'FFS give us a decent case',
        explanation: 'Mild profanity and genuine frustration. AI-generated reviews maintain a polite, measured tone.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This review is human-written. The progression from near-return to appreciation, specific testing contexts (NYC subway), honest mixed assessments, casual profanity, and the rant about the case all indicate a real person sharing genuine experience.',
    skills: { prompting: 0.3, concepts: 0.5, tools: 0.1, criticalThinking: 0.8, ethics: 0.3 },
  },

  // ============================================================
  // CREATIVE WRITING — AI Generated
  // ============================================================
  {
    id: 'beg-creative-01',
    contentType: 'creative-writing',
    difficulty: 'beginner',
    title: 'The Last Library',
    content: `The old library stood at the edge of town like a sentinel guarding forgotten knowledge. Its weathered stone walls whispered stories of centuries past, while ivy crept along its facade like nature's attempt to reclaim what was rightfully hers.

Eleanor pushed open the heavy oak door, its hinges groaning in protest as if reluctant to disturb the silence within. The air inside was thick with the scent of aging paper and leather-bound wisdom — a fragrance that transported her back to childhood afternoons spent lost in worlds of imagination.

Dust motes danced in the shafts of golden light that filtered through the stained-glass windows, each particle a tiny dancer performing an eternal waltz. The shelves stretched toward the vaulted ceiling like wooden sentinels, their ranks filled with volumes that had weathered the passage of time.

As Eleanor traced her fingers along the spines of forgotten books, she couldn't help but feel a profound sense of loss. In a world increasingly dominated by screens and algorithms, this sanctuary of paper and ink represented something precious — a tangible connection to the collective wisdom of humanity. She selected a worn copy of "Pride and Prejudice" and settled into the familiar embrace of her favorite armchair, knowing that some treasures could never be digitized.`,
    isAI: true,
    aiModel: 'GPT-4',
    markers: [
      {
        text: 'like a sentinel guarding forgotten knowledge',
        explanation: 'Overwrought simile. AI creative writing leans heavily on dramatic metaphors and "literary" language.',
        type: 'ai-tell',
      },
      {
        text: 'Dust motes danced in the shafts of golden light',
        explanation: 'The "dust motes dancing in light" image is one of the most common AI creative writing cliches.',
        type: 'ai-tell',
      },
      {
        text: 'each particle a tiny dancer performing an eternal waltz',
        explanation: 'Extending a metaphor past its usefulness — AI tends to over-elaborate poetic imagery.',
        type: 'ai-tell',
      },
      {
        text: 'In a world increasingly dominated by screens and algorithms',
        explanation: 'Inserting a generic thematic statement about technology vs tradition. AI often shoehorns in "meaningful" commentary.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This prose is AI-generated. The stacked similes, cliched imagery (dust motes, golden light, heavy oak door), overwrought metaphors, and inserted thematic commentary about technology vs. tradition are all hallmarks of AI creative writing.',
    skills: { prompting: 0.4, concepts: 0.5, tools: 0.1, criticalThinking: 0.6, ethics: 0.3 },
  },

  // ============================================================
  // CREATIVE WRITING — Human Written
  // ============================================================
  {
    id: 'beg-creative-02',
    contentType: 'creative-writing',
    difficulty: 'beginner',
    title: 'Tuesday at the Laundromat',
    content: `The dryer ate my quarters again. Third time this month. I fed it four more because what else are you gonna do, carry wet jeans home?

There was a woman in there I'd never seen before, maybe sixty, reading an actual physical newspaper. She had it spread out across two of the folding tables and was circling things with a red pen. Apartments, I think. Or jobs. I didn't want to stare.

The fluorescent light above the detergent vending machine flickered in this irregular pattern, like it was trying to communicate something in morse code. Probably just "replace me." Nobody ever does, though. That light has been flickering since I moved to this neighborhood four years ago.

My phone was dead so I just sat there. Watched the clothes tumble. There's something hypnotic about it, the way a red sock keeps surfacing and disappearing like a tiny swimmer. I thought about how my mom used to separate whites from colors religiously and how I have never once done that as an adult. She'd be horrified. She'd also probably have something to say about the quarters, like save them in a jar or something. She always had a jar.`,
    isAI: false,
    humanSource: 'Fiction workshop student',
    markers: [
      {
        text: 'Third time this month',
        explanation: 'Mundane specificity — a human writer tracks small frustrations. AI would make the opening more dramatic.',
        type: 'human-tell',
      },
      {
        text: 'Apartments, I think. Or jobs. I didn\'t want to stare.',
        explanation: 'Uncertainty and social awareness. The narrator doesn\'t know and respects boundaries — AI would typically describe the scene with full knowledge.',
        type: 'human-tell',
      },
      {
        text: 'Probably just "replace me."',
        explanation: 'Dry, understated humor. The personification is casual and funny rather than poetic.',
        type: 'human-tell',
      },
      {
        text: 'She always had a jar',
        explanation: 'The ending trails off into memory with no grand conclusion. Human writing often ends on a quiet, unresolved note rather than wrapping up thematically.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This prose is human-written. The mundane setting, uncertain narrator, dry humor, specific personal memories (mom\'s jar, the flickering light for four years), and lack of a neat thematic conclusion all point to authentic human creative writing.',
    skills: { prompting: 0.4, concepts: 0.5, tools: 0.1, criticalThinking: 0.6, ethics: 0.3 },
  },

  // ============================================================
  // IMAGE — AI Generated
  // ============================================================
  {
    id: 'beg-image-01',
    contentType: 'image',
    difficulty: 'beginner',
    title: 'Portrait Photo',
    imagePath: '/images/turing/beg-image-01.png',
    imageDescription: `A photorealistic portrait of a young woman with flawless, porcelain-smooth skin and perfectly symmetrical features. She has vibrant emerald green eyes with an almost luminous quality, and her auburn hair cascades in perfectly even waves over her shoulders. The lighting is studio-perfect with a soft bokeh background of warm golden tones. Her smile is pleasant but somehow generic — the kind of smile stock photo models use. There are no visible pores, moles, freckles, or skin imperfections anywhere. Her teeth are uniformly white and perfectly aligned. The iris of each eye has an unnaturally vivid, almost saturated quality.`,
    content: 'See image above.',
    isAI: true,
    aiModel: 'Midjourney v5',
    markers: [
      {
        text: 'flawless, porcelain-smooth skin and perfectly symmetrical features',
        explanation: 'AI-generated faces tend to have uncanny perfection — no pores, no asymmetry, no natural skin texture variation.',
        type: 'ai-tell',
      },
      {
        text: 'Her smile is pleasant but somehow generic',
        explanation: 'AI portraits often produce expressions that feel "stock photo"-like rather than capturing a genuine moment.',
        type: 'ai-tell',
      },
      {
        text: 'no visible pores, moles, freckles, or skin imperfections anywhere',
        explanation: 'Complete absence of skin imperfections is a strong signal of AI generation. Real photos always show some texture.',
        type: 'ai-tell',
      },
      {
        text: 'iris of each eye has an unnaturally vivid, almost saturated quality',
        explanation: 'Over-saturated, luminous eyes are a common artifact in AI-generated portraits.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This portrait is AI-generated. The perfect symmetry, impossibly smooth skin, over-saturated eye color, and generic expression are all common tells in AI-generated faces. Real photographs always contain subtle imperfections.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.5, criticalThinking: 0.7, ethics: 0.4 },
  },

  // ============================================================
  // IMAGE — Human (Real Photo)
  // ============================================================
  {
    id: 'beg-image-02',
    contentType: 'image',
    difficulty: 'beginner',
    title: 'Candid Street Photo',
    imagePath: '/images/turing/beg-image-02.png',
    imageDescription: `A candid photograph of a middle-aged man sitting on a park bench eating a sandwich. He's slightly overweight, wearing a wrinkled blue polo shirt with a small mustard stain near the collar. His hairline is receding unevenly — more on the left side. The bench is wooden with peeling green paint, and there's a pigeon near his feet eyeing crumbs on the ground. The background shows a slightly overexposed sky (the photographer clearly metered for the subject, not the sky), some out-of-focus trees, and the edge of a trash can. The man's expression is mid-chew, caught unaware — one eye is slightly more squinted than the other. His watch reads 12:47.`,
    content: 'See image above.',
    isAI: false,
    humanSource: 'Street photographer',
    markers: [
      {
        text: 'small mustard stain near the collar',
        explanation: 'Mundane imperfections like food stains are rarely included in AI-generated images, which optimize for aesthetic appeal.',
        type: 'human-tell',
      },
      {
        text: 'hairline is receding unevenly — more on the left side',
        explanation: 'Natural asymmetry in features is a strong indicator of a real photograph. AI tends toward symmetry.',
        type: 'human-tell',
      },
      {
        text: 'slightly overexposed sky',
        explanation: 'Technical imperfections in exposure are common in real photography and rarely appear in AI images.',
        type: 'human-tell',
      },
      {
        text: 'expression is mid-chew, caught unaware',
        explanation: 'Unflattering candid moments are natural in real photos. AI generates composed, intentional-looking expressions.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This is a real photograph. The imperfect exposure, mustard stain, uneven hairline, unflattering mid-chew expression, and mundane details (pigeon, peeling paint, trash can) are all things AI image generators typically avoid or can\'t replicate naturally.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.5, criticalThinking: 0.7, ethics: 0.4 },
  },
];
