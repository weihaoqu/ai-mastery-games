import type { TuringItem } from '../../lib/types';

export const intermediateItems: TuringItem[] = [
  // ============================================================
  // EMAIL — AI Generated
  // ============================================================
  {
    id: 'int-email-01',
    contentType: 'email',
    difficulty: 'intermediate',
    title: 'Client Follow-up Email',
    content: `Subject: Follow-up on our conversation — next steps for the rebrand

Hi Sarah,

Thanks so much for taking the time to chat yesterday — it was great to hear your vision for the rebrand, and I think we're very much aligned on the direction.

As discussed, I've put together a few key takeaways and proposed next steps:

- Brand positioning should lean into the "approachable expertise" angle we discussed, moving away from the overly corporate tone of the current materials.
- The color palette refresh will be explored in three directions: warm neutrals, bold primary, and a hybrid approach. We'll present mood boards for each.
- Timeline-wise, I'm confident we can deliver initial concepts by March 15th, with a full brand guide ready by end of Q1.

I want to make sure we're capturing everything accurately, so please don't hesitate to flag anything I might have missed or any additional thoughts that have come to mind since our chat.

Looking forward to collaborating on this — I think it's going to be a really exciting project.

Best,
Marcus Chen
Creative Director, Brightwell Studio`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'it was great to hear your vision for the rebrand, and I think we\'re very much aligned on the direction',
        explanation: 'Polished but vague enthusiasm. A real creative director would reference specific ideas from the conversation.',
        type: 'ai-tell',
      },
      {
        text: 'please don\'t hesitate to flag anything I might have missed',
        explanation: 'Overly deferential closing that AI defaults to. Real creative directors are more direct.',
        type: 'ai-tell',
      },
      {
        text: 'I think it\'s going to be a really exciting project',
        explanation: 'Generic positive closer. AI adds these upbeat sign-offs by default; real professionals vary their endings more.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This email is AI-generated. While it mimics professional tone well, the lack of specific references to the actual conversation, formulaic enthusiasm, and overly polished structure give it away. A real creative director would reference specific ideas discussed.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.1, criticalThinking: 0.8, ethics: 0.3 },
  },

  // ============================================================
  // EMAIL — Human Written
  // ============================================================
  {
    id: 'int-email-02',
    contentType: 'email',
    difficulty: 'intermediate',
    title: 'Designer Client Follow-up',
    content: `Subject: Re: Rebrand kickoff

Hey Sarah,

Good chat yesterday. Few things I want to lock down before we go too far:

That reference you showed me from the Aesop packaging — that's the vibe I keep coming back to. Minimal, confident, doesn't try too hard. But I know you also mentioned wanting to feel "warmer" than that, so I'm thinking we split the difference. Maybe we keep the restraint but swap in a serif with more personality? I'm looking at a few options.

Re: the color thing — I'm going to push back a little on the terra cotta. I know it's trending right now but I've seen three different wellness brands launch with it in the last month. I'd rather find something that still feels warm but gives you more runway. I'll show you what I mean.

Mood boards by the 15th. Brand guide by end of March unless the stakeholder review takes longer than we're planning for (it always does lol).

One more thing — can you send me that competitor deck you mentioned? The one from the board meeting. Would help me understand what leadership has already seen.

Talk soon,
Marcus`,
    isAI: false,
    humanSource: 'Creative director',
    markers: [
      {
        text: 'That reference you showed me from the Aesop packaging',
        explanation: 'Specific callback to an actual conversation with a real brand reference. Humans anchor in shared context.',
        type: 'human-tell',
      },
      {
        text: 'I\'m going to push back a little on the terra cotta',
        explanation: 'Confident professional disagreement with specific market reasoning. AI tends to be agreeable and supportive.',
        type: 'human-tell',
      },
      {
        text: 'unless the stakeholder review takes longer than we\'re planning for (it always does lol)',
        explanation: 'Wry aside based on real professional experience. AI doesn\'t typically inject this kind of earned cynicism.',
        type: 'human-tell',
      },
      {
        text: 'The one from the board meeting',
        explanation: 'Referencing a specific artifact from a real interaction — AI generates generic requests, not callbacks to specific items.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This email is human-written. The specific brand references (Aesop), professional pushback with market reasoning, earned cynicism about stakeholder reviews, and callbacks to specific conversation details all indicate real professional correspondence.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.1, criticalThinking: 0.8, ethics: 0.3 },
  },

  // ============================================================
  // ESSAY — AI Generated
  // ============================================================
  {
    id: 'int-essay-01',
    contentType: 'essay',
    difficulty: 'intermediate',
    title: 'The Psychology of Decision Fatigue',
    content: `We make an estimated 35,000 decisions every day, and most of them happen without our conscious awareness. From the moment we wake up — snooze or rise, coffee or tea, which shirt to wear — our brains are engaged in an endless series of micro-choices that slowly drain our cognitive reserves.

This phenomenon, known as decision fatigue, was first studied extensively by social psychologist Roy Baumeister, whose research demonstrated that the quality of our decisions deteriorates as we make more of them. The implications are surprisingly far-reaching: judges issue harsher sentences later in the day, consumers make more impulsive purchases in the evening, and CEOs often defer critical decisions to morning meetings for exactly this reason.

What makes decision fatigue particularly insidious is that we rarely recognize it as it's happening. Unlike physical fatigue, which comes with obvious signals like sore muscles and heavy eyelids, mental depletion manifests subtly — as irritability, procrastination, or a sudden willingness to accept the default option rather than evaluating alternatives.

The practical takeaways are straightforward but powerful. Automate trivial decisions where possible (hence Steve Jobs' famous black turtleneck uniform). Front-load your most important choices to the morning hours. And perhaps most importantly, recognize that willpower is a finite resource — not a character trait. Understanding this doesn't just make us more effective decision-makers; it makes us more compassionate toward ourselves when we inevitably reach for the easy option at the end of a long day.`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'We make an estimated 35,000 decisions every day',
        explanation: 'This widely-cited statistic is actually unverifiable and has no clear academic source — AI confidently presents it as fact because it appears frequently in training data.',
        type: 'ai-tell',
      },
      {
        text: 'The implications are surprisingly far-reaching',
        explanation: 'Transitional filler that sounds insightful but adds nothing. AI uses these connective phrases to maintain flow.',
        type: 'ai-tell',
      },
      {
        text: 'hence Steve Jobs\' famous black turtleneck uniform',
        explanation: 'This is the go-to AI example for decision fatigue — it appears in nearly every AI-written piece on the topic because it\'s the most common example in training data.',
        type: 'ai-tell',
      },
      {
        text: 'Understanding this doesn\'t just make us more effective decision-makers; it makes us more compassionate toward ourselves',
        explanation: 'The uplifting, self-compassion conclusion is an AI pattern — wrapping up with an emotionally satisfying but generic takeaway.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This essay is AI-generated. Despite being well-written and engaging, it relies on a dubious statistic, uses the most cliched example (Steve Jobs), deploys transitional filler phrases, and wraps up with a formulaic feel-good conclusion. The structure is too polished and the examples too predictable.',
    skills: { prompting: 0.3, concepts: 0.7, tools: 0.1, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // ESSAY — Human Written
  // ============================================================
  {
    id: 'int-essay-02',
    contentType: 'essay',
    difficulty: 'intermediate',
    title: 'On Making Choices When Tired',
    content: `There's a study I keep thinking about — it's the one where Israeli parole judges grant parole at significantly higher rates right after meals than right before them. The researchers framed it as decision fatigue, and that's probably part of it, but I wonder if it's also just about mood. A full stomach puts you in a different frame of mind than a growling one. Hunger makes you conservative. It makes you default to "no."

I notice this pattern in myself in embarrassingly mundane ways. By 6pm I've completely lost the ability to choose what to eat for dinner. I'll open the fridge, stare at its contents like they're written in a foreign language, close it, open Uber Eats, scroll for twenty minutes, close that too, and then eat cereal. It's not that I don't have options. It's that evaluating them feels physically impossible.

What I don't buy is the neat narrative that this is purely a glucose problem — Baumeister's "willpower as fuel" model has taken some serious hits in replication attempts. The effect might be more about motivation than capacity. When you're depleted, you can still make good decisions about things you care deeply about. You just lose the will to engage with things that feel optional.

This matters because the popular advice — "simplify your wardrobe!" "meal prep on Sundays!" — treats the symptom. Sure, removing decisions helps. But maybe the more interesting question is why we've structured modern life to demand so many low-stakes decisions in the first place.`,
    isAI: false,
    humanSource: 'Psychology newsletter writer',
    markers: [
      {
        text: 'I wonder if it\'s also just about mood',
        explanation: 'The writer pushes beyond the standard interpretation with their own speculation — AI typically presents established findings without challenging them.',
        type: 'human-tell',
      },
      {
        text: 'I\'ll open the fridge, stare at its contents like they\'re written in a foreign language, close it, open Uber Eats, scroll for twenty minutes',
        explanation: 'Specific, relatable personal anecdote with self-deprecating detail. This level of mundane specificity is hard for AI to generate.',
        type: 'human-tell',
      },
      {
        text: 'Baumeister\'s "willpower as fuel" model has taken some serious hits in replication attempts',
        explanation: 'Acknowledging that a cited researcher\'s model has been challenged shows genuine familiarity with the field. AI typically presents research uncritically.',
        type: 'human-tell',
      },
      {
        text: 'But maybe the more interesting question is why we\'ve structured modern life to demand so many low-stakes decisions in the first place',
        explanation: 'Ending with a genuinely original question rather than a wrapped-up conclusion. Human writers are comfortable leaving readers with uncertainty.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This essay is human-written. The writer challenges the standard decision fatigue narrative, includes specific personal anecdotes, acknowledges replication issues in the research, and ends with an open question rather than a tidy conclusion.',
    skills: { prompting: 0.3, concepts: 0.7, tools: 0.1, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // CODE — AI Generated
  // ============================================================
  {
    id: 'int-code-01',
    contentType: 'code',
    difficulty: 'intermediate',
    title: 'Rate Limiter Implementation',
    content: `class RateLimiter:
    """A sliding window rate limiter using Redis for distributed rate limiting."""

    def __init__(self, redis_client, max_requests: int = 100, window_seconds: int = 60):
        self.redis = redis_client
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    def is_allowed(self, client_id: str) -> bool:
        """Check if the client is within rate limits using a sliding window."""
        key = f"rate_limit:{client_id}"
        now = time.time()
        window_start = now - self.window_seconds

        pipe = self.redis.pipeline()
        pipe.zremrangebyscore(key, 0, window_start)
        pipe.zadd(key, {str(now): now})
        pipe.zcard(key)
        pipe.expire(key, self.window_seconds)
        results = pipe.execute()

        request_count = results[2]
        return request_count <= self.max_requests

    def get_remaining(self, client_id: str) -> int:
        """Get the number of remaining requests allowed in the current window."""
        key = f"rate_limit:{client_id}"
        now = time.time()
        window_start = now - self.window_seconds

        self.redis.zremrangebyscore(key, 0, window_start)
        current_count = self.redis.zcard(key)
        return max(0, self.max_requests - current_count)

    def get_reset_time(self, client_id: str) -> float:
        """Get the time in seconds until the rate limit window resets."""
        key = f"rate_limit:{client_id}"
        oldest = self.redis.zrange(key, 0, 0, withscores=True)
        if not oldest:
            return 0
        oldest_timestamp = oldest[0][1]
        reset_time = oldest_timestamp + self.window_seconds - time.time()
        return max(0, reset_time)`,
    isAI: true,
    aiModel: 'GPT-4',
    markers: [
      {
        text: 'A sliding window rate limiter using Redis for distributed rate limiting.',
        explanation: 'The docstring repeats information already clear from the class name and parameters — AI over-explains.',
        type: 'ai-tell',
      },
      {
        text: 'def get_remaining',
        explanation: 'The class has a suspiciously complete API surface — is_allowed, get_remaining, and get_reset_time. Real initial implementations usually start with just the core method.',
        type: 'ai-tell',
      },
      {
        text: 'return max(0, self.max_requests - current_count)',
        explanation: 'Every edge case is handled perfectly on the first pass. Real code usually needs iteration to catch these.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This code is AI-generated. While technically sound, the complete API surface with three well-documented methods, perfect edge case handling, and redundant docstrings suggest AI generation. Real developers build incrementally, starting with the core function.',
    skills: { prompting: 0.2, concepts: 0.5, tools: 0.8, criticalThinking: 0.6, ethics: 0.2 },
  },

  // ============================================================
  // CODE — Human Written
  // ============================================================
  {
    id: 'int-code-02',
    contentType: 'code',
    difficulty: 'intermediate',
    title: 'Rate Limiter (Production)',
    content: `class RateLimiter:
    """Sliding window rate limit via Redis sorted sets.
    See: https://blog.cloudflare.com/counting-things-a-lot-of-different-things/
    """

    def __init__(self, redis, *, max_req=100, window=60):
        self.r = redis
        self.max_req = max_req
        self.window = window

    def check(self, key: str) -> tuple[bool, dict]:
        now = time.time()
        rk = f"rl:{key}"

        # atomic pipeline - order matters here
        p = self.r.pipeline()
        p.zremrangebyscore(rk, "-inf", now - self.window)
        p.zadd(rk, {f"{now}:{os.urandom(4).hex()}": now})  # unique member per req
        p.zcard(rk)
        p.expire(rk, self.window + 1)  # +1 to avoid race with last request
        _, _, count, _ = p.execute()

        allowed = count <= self.max_req
        headers = {
            "X-RateLimit-Remaining": str(max(0, self.max_req - count)),
            "X-RateLimit-Reset": str(int(now + self.window)),
        }
        if not allowed:
            headers["Retry-After"] = str(self.window)

        return allowed, headers`,
    isAI: false,
    humanSource: 'Senior backend developer',
    markers: [
      {
        text: 'See: https://blog.cloudflare.com/counting-things-a-lot-of-different-things/',
        explanation: 'Referencing a specific blog post as design inspiration. Real developers cite their sources for non-obvious patterns.',
        type: 'human-tell',
      },
      {
        text: 'f"{now}:{os.urandom(4).hex()}"',
        explanation: 'Solves a subtle bug: using a unique member per request prevents two requests at the same timestamp from colliding. This shows real production experience.',
        type: 'human-tell',
      },
      {
        text: 'p.expire(rk, self.window + 1)  # +1 to avoid race with last request',
        explanation: 'The +1 offset with an explanatory comment shows someone who\'s been bitten by this race condition before. AI gives the "correct" value without the defensive padding.',
        type: 'human-tell',
      },
      {
        text: 'headers["Retry-After"] = str(self.window)',
        explanation: 'Returns HTTP-standard rate limit headers alongside the boolean — this is practical API design from real experience, not textbook implementation.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This code is human-written. The Cloudflare blog reference, unique-member-per-request trick (preventing timestamp collisions), defensive +1 on expire, and practical HTTP header return all show real production experience and lessons learned the hard way.',
    skills: { prompting: 0.2, concepts: 0.5, tools: 0.8, criticalThinking: 0.6, ethics: 0.2 },
  },

  // ============================================================
  // SOCIAL MEDIA — AI Generated
  // ============================================================
  {
    id: 'int-social-01',
    contentType: 'social-media',
    difficulty: 'intermediate',
    title: 'Tweet Thread on Productivity',
    imagePath: '/images/turing/int-social-01.png',
    content: `I've been experimenting with time-blocking for the past 6 months and here's what I've learned (thread):

1/ The biggest mistake people make is scheduling every minute. Leave 20-30% of your day unblocked. You need buffer time for unexpected tasks, creative thinking, and just... being human.

2/ Morning blocks should be for deep work. Not email. Not Slack. Your brain is freshest before noon — protect those hours like they're sacred.

3/ Here's the counterintuitive part: I actually get MORE done by scheduling less. When I packed my calendar wall-to-wall, I'd blow past my time limits and the whole day would cascade into chaos.

4/ The tool doesn't matter as much as you think. I've used Notion, Google Calendar, a paper planner, and honestly they all work fine if you actually commit to the system.

5/ Final thought: productivity isn't about optimizing every moment. It's about creating space to do meaningful work without burning out. Take care of yourself first. The tasks will get done.`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'here\'s what I\'ve learned (thread)',
        explanation: 'The "(thread)" label and numbered format is a well-known Twitter template that AI reproduces perfectly — almost too perfectly.',
        type: 'ai-tell',
      },
      {
        text: 'protect those hours like they\'re sacred',
        explanation: 'Inspirational productivity-speak that sounds good but is generic. AI generates motivational language by default.',
        type: 'ai-tell',
      },
      {
        text: 'Here\'s the counterintuitive part',
        explanation: 'Flagging something as "counterintuitive" before stating a commonly known productivity tip. AI does this to create an illusion of depth.',
        type: 'ai-tell',
      },
      {
        text: 'productivity isn\'t about optimizing every moment. It\'s about creating space to do meaningful work without burning out',
        explanation: 'A neatly packaged wisdom statement to close the thread. AI wraps up with these inspirational conclusions predictably.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This thread is AI-generated. While it reads smoothly, the perfectly structured numbered thread, generic productivity advice, "counterintuitive" framing of obvious points, and inspirational conclusion are all patterns AI defaults to when generating social media content.',
    skills: { prompting: 0.3, concepts: 0.5, tools: 0.2, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // SOCIAL MEDIA — Human Written
  // ============================================================
  {
    id: 'int-social-02',
    contentType: 'social-media',
    difficulty: 'intermediate',
    title: 'Tweet Thread on Time Management',
    imagePath: '/images/turing/int-social-02.png',
    content: `ok so everyone keeps asking about my "system" so here goes, but fair warning it's not that impressive

I time block but badly. Like I'll block 9-11 for deep work and then immediately check slack at 9:04 because I have no discipline. But the block is there as a guilt mechanism and honestly that works?

the real game changer for me was not tracking hours but tracking energy. some days I'm useless after 2pm and fighting it just wastes time. now I just do admin crap in the afternoon and save anything requiring actual thought for morning

tried every app. spent way too much money on Sunsama which is great but I went back to a plain google cal with color coding because I'm fundamentally lazy and anything with friction gets abandoned within a week

also unpopular opinion but I think most productivity advice is written by people who don't have kids or chronic illness or anything else that makes your schedule unpredictable. like cool you wake up at 5am, I was up at 3am with a sick toddler

anyway that's it. not a system, more like a collection of coping mechanisms. works for me most of the time.`,
    isAI: false,
    humanSource: 'Tech worker / parent',
    markers: [
      {
        text: 'fair warning it\'s not that impressive',
        explanation: 'Self-deprecation before sharing advice. Humans hedge about their own systems; AI presents advice confidently.',
        type: 'human-tell',
      },
      {
        text: 'I\'ll block 9-11 for deep work and then immediately check slack at 9:04 because I have no discipline',
        explanation: 'Admitting failure within the system being recommended. AI advice threads don\'t typically undermine their own recommendations.',
        type: 'human-tell',
      },
      {
        text: 'spent way too much money on Sunsama',
        explanation: 'Specific app name with a financial regret. Humans reference specific products from real experience with real consequences.',
        type: 'human-tell',
      },
      {
        text: 'cool you wake up at 5am, I was up at 3am with a sick toddler',
        explanation: 'Direct pushback against common productivity culture with a specific personal situation. AI tends to be inclusive rather than confrontational.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This thread is human-written. The self-deprecation, admitted failures, specific app regrets, pushback against productivity culture from a parent\'s perspective, and the honest "collection of coping mechanisms" framing all indicate authentic human voice.',
    skills: { prompting: 0.3, concepts: 0.5, tools: 0.2, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // CREATIVE WRITING — AI Generated
  // ============================================================
  {
    id: 'int-creative-01',
    contentType: 'creative-writing',
    difficulty: 'intermediate',
    title: 'Memory of Summer',
    content: `The screen door slapped shut behind her and the whole summer opened up like a held breath finally released. Nana's yard was the same as it always was — the vegetable garden in its tidy rows, the tire swing hanging still in the dead air, the sprinkler making its lazy arc across the patchy brown lawn.

She was eleven that last summer, though she didn't know yet that it would be the last. That knowledge belonged to the future, and the future felt impossibly far away, like a country she'd never visit. For now, there was only the weight of July pressing down on everything, slowing the world to the pace of melting popsicles and turning pages.

Her cousin James was already in the pool, his laughter cutting through the thick air like a stone through still water. "Come on, slow poke!" he called, and she didn't need to be asked twice. The shock of cold water against sun-baked skin — that particular gasp that is equal parts agony and ecstasy — was the closest thing to perfection she had ever known.

Years later, she would try to describe that summer to people who hadn't been there. She would reach for words the way you reach for a dream upon waking — fingers closing around nothing. Some things, she eventually understood, lived only in the body. In the memory of skin and muscle and bone. No language could hold them.`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'like a held breath finally released',
        explanation: 'Polished simile that feels crafted rather than discovered. AI creative writing tends toward "literary" comparisons.',
        type: 'ai-tell',
      },
      {
        text: 'That knowledge belonged to the future, and the future felt impossibly far away, like a country she\'d never visit',
        explanation: 'Layered metaphor about temporal awareness reads as sophisticated but calculated. AI excels at this type of neat philosophical observation.',
        type: 'ai-tell',
      },
      {
        text: 'that particular gasp that is equal parts agony and ecstasy',
        explanation: 'Balanced phrasing with opposing concepts ("agony and ecstasy") is an AI pattern — it sounds literary but is formulaically constructed.',
        type: 'ai-tell',
      },
      {
        text: 'She would reach for words the way you reach for a dream upon waking — fingers closing around nothing',
        explanation: 'Meta-commentary about language\'s inadequacy is a favorite AI topic. The simile is elegant but predictable.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This prose is AI-generated. Despite being well-crafted, it shows AI patterns: every paragraph has a polished simile, the piece builds to a neat philosophical observation about memory and language, and the writing is uniformly "literary" without the unevenness of human drafts.',
    skills: { prompting: 0.4, concepts: 0.5, tools: 0.1, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // CREATIVE WRITING — Human Written
  // ============================================================
  {
    id: 'int-creative-02',
    contentType: 'creative-writing',
    difficulty: 'intermediate',
    title: 'Summers at Grandma\'s',
    content: `The thing I remember most clearly is that the pool had a crack in it that Grandpa kept saying he'd fix. He never did. By August the water level would drop two inches a week and you could see this dark green line of algae along the waterline like a ring around a bathtub. We didn't care. We'd been swimming in that pool since we were old enough to not drown in it, which for me was about four.

James was the fast one. He could do a backflip off the diving board by the time he was nine, which I thought was literally the most impressive thing any human had ever accomplished. I tried it once and belly-flopped so hard I had a red mark on my stomach for three days. Mom took a photo. I still have it somewhere.

Grandma made these sandwiches with the crust cut off — not because we asked, she just always did it — and there was this specific brand of lemonade she bought that I've never been able to find as an adult. It came in a green carton. I've googled it. I've asked on Reddit. Nobody knows what I'm talking about. Sometimes I think I made it up but James remembers it too so I'm not completely crazy.

The summer she died we were supposed to go for two weeks and only went for three days at the end. The pool was empty. Not drained, just evaporated I think. It was September by then. We drove home mostly in silence and I fell asleep against the window and when I woke up we were in a McDonald's parking lot and Dad was crying in the front seat while Mom rubbed his back. I pretended I was still asleep.`,
    isAI: false,
    humanSource: 'Creative writing student',
    markers: [
      {
        text: 'the pool had a crack in it that Grandpa kept saying he\'d fix. He never did.',
        explanation: 'Specific, unresolved detail about a real person\'s procrastination. AI narratives tend to resolve or make meaning from every detail.',
        type: 'human-tell',
      },
      {
        text: 'It came in a green carton. I\'ve googled it. I\'ve asked on Reddit. Nobody knows what I\'m talking about.',
        explanation: 'A specific, unsatisfied quest for a mundane memory. This kind of detail — including the failed internet search — is distinctly human.',
        type: 'human-tell',
      },
      {
        text: 'Not drained, just evaporated I think',
        explanation: 'The uncertainty ("I think") and the distinction between drained and evaporated shows real memory\'s imprecision. AI narrators are typically omniscient.',
        type: 'human-tell',
      },
      {
        text: 'I pretended I was still asleep',
        explanation: 'A child\'s instinct to protect a parent from embarrassment. This emotionally complex, understated ending is characteristic of human writing.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This prose is human-written. The unresolved details (Grandpa\'s unfixed crack, the unfindable lemonade), imprecise memories, specific failed internet searches, and the devastating understated ending all indicate authentic human experience and voice.',
    skills: { prompting: 0.4, concepts: 0.5, tools: 0.1, criticalThinking: 0.7, ethics: 0.3 },
  },

  // ============================================================
  // IMAGE — AI Generated
  // ============================================================
  {
    id: 'int-image-01',
    contentType: 'image',
    difficulty: 'intermediate',
    title: 'Urban Street Scene',
    imagePath: '/images/turing/int-image-01.png',
    imageDescription: `A photorealistic image of a bustling city street at golden hour. The scene shows a row of brownstone buildings with detailed architectural features — ornate cornices, fire escapes, and bay windows. Several people walk along the sidewalk, and a yellow taxi is turning a corner. The lighting is cinematic with warm orange tones and long shadows. On closer inspection: a storefront sign reads "COFFE SHOPP" with subtly malformed letters. One pedestrian appears to have six fingers on their left hand. A bicycle leaning against a lamppost has its chain on the wrong side. The reflection in a shop window shows a slightly different scene than what should be reflected. The overall composition is aesthetically perfect — almost like a movie poster rather than a spontaneous photograph.`,
    content: 'See image above.',
    isAI: true,
    aiModel: 'Stable Diffusion XL',
    markers: [
      {
        text: 'COFFE SHOPP',
        explanation: 'Misspelled text on signage is a classic AI image generation artifact. AI models struggle with coherent text rendering.',
        type: 'ai-tell',
      },
      {
        text: 'One pedestrian appears to have six fingers on their left hand',
        explanation: 'Extra or missing fingers remain one of the most common AI image tells, even in advanced models.',
        type: 'ai-tell',
      },
      {
        text: 'reflection in a shop window shows a slightly different scene',
        explanation: 'AI models generate reflections independently rather than computing them from the actual scene, leading to inconsistencies.',
        type: 'ai-tell',
      },
      {
        text: 'The overall composition is aesthetically perfect — almost like a movie poster',
        explanation: 'AI images often have unnaturally perfect composition, trained on curated professional photography.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This image is AI-generated. Despite the overall photorealism, telltale signs include garbled text on signage, extra fingers, inconsistent reflections, and an overly cinematic composition that looks more like concept art than a real photograph.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.6, criticalThinking: 0.7, ethics: 0.4 },
  },

  // ============================================================
  // IMAGE — Human (Real Photo)
  // ============================================================
  {
    id: 'int-image-02',
    contentType: 'image',
    difficulty: 'intermediate',
    title: 'City Street at Dusk',
    imagePath: '/images/turing/int-image-02.png',
    imageDescription: `A photograph of a city street taken at dusk with a smartphone. The image is slightly tilted about 2 degrees to the right. In the foreground, a woman is walking past a bodega with a neon "OPEN" sign in the window — the sign casts a faint pink glow on the wet sidewalk from recent rain. A delivery cyclist in the background is slightly motion-blurred. The brownstone buildings have authentic wear — chipped paint, an AC unit hanging from a window with a slight lean, a faded "FOR RENT" sign with a phone number. There's a garbage bag on the curb that's been torn open, possibly by an animal. The sky is a gradient from deep blue to orange near the horizon, but some highlights are blown out where a streetlight enters the frame. One building has a fire escape with a potted plant and a forgotten towel draped over the railing.`,
    content: 'See image above.',
    isAI: false,
    humanSource: 'Amateur photographer',
    markers: [
      {
        text: 'slightly tilted about 2 degrees to the right',
        explanation: 'Imperfect framing is natural in handheld photography. AI generates level, well-composed images by default.',
        type: 'human-tell',
      },
      {
        text: 'delivery cyclist in the background is slightly motion-blurred',
        explanation: 'Motion blur from a slow shutter speed is a natural artifact of real photography that AI rarely replicates authentically.',
        type: 'human-tell',
      },
      {
        text: 'garbage bag on the curb that\'s been torn open',
        explanation: 'Unpleasant real-world mess. AI images are trained on curated photos and tend to omit urban grime.',
        type: 'human-tell',
      },
      {
        text: 'a forgotten towel draped over the railing',
        explanation: 'Incidental, unintentional details from real life. AI doesn\'t generate "forgotten" objects because everything is placed deliberately.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This is a real photograph. The slight camera tilt, motion blur, blown-out highlights, torn garbage bag, and incidental details like the forgotten towel all point to an authentic scene captured by a real camera in an imperfect world.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.6, criticalThinking: 0.7, ethics: 0.4 },
  },
];
