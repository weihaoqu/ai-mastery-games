import type { TuringItem } from '../../lib/types';

export const expertItems: TuringItem[] = [
  // ============================================================
  // EMAIL — AI Generated (with very human-like qualities)
  // ============================================================
  {
    id: 'exp-email-01',
    contentType: 'email',
    difficulty: 'expert',
    title: 'Project Delay Apology',
    content: `Subject: Re: Lighthouse redesign — I owe you an update (and an apology)

Hey Marcus,

So I'm just going to be upfront: we're behind. Not dramatically behind, but enough that I should've flagged it last week instead of hoping we'd recover over the weekend. That's on me.

The auth module refactor ended up being way more tangled than we scoped. You know how Jake always jokes about the codebase being "held together with duct tape and prayers"? Turns out that's not entirely a joke. We pulled on the session management thread and discovered that half the user permission checks were bypassing the middleware entirely and going straight to the database. Which, honestly, explains some of those weird access bugs from Q3 that we never fully tracked down.

Anyway — revised timeline: I think we need another 8-9 days on the auth piece. I'm going to pull Sarah onto it starting Monday because she wrote most of the original middleware and still remembers where the bodies are buried (her words, not mine). The frontend work is actually tracking fine, so the overall project slip should be about a week, maybe less if Sarah finds a clean abstraction layer we can build on.

I know this isn't what you want to hear before the board meeting. If it helps, I can put together a one-pager on the technical debt we're resolving — might actually play well with the board since they've been asking about security posture.

Sorry again. I'll have a proper revised schedule by Wednesday EOD.

—Teresa`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'we pulled on the session management thread and discovered that half the user permission checks were bypassing the middleware entirely and going straight to the database',
        explanation: 'The technical detail sounds plausible but is described in a way that explains itself too neatly. A real engineer would reference specific file names, PR numbers, or Jira tickets — not narrate the discovery like a story.',
        type: 'ai-tell',
      },
      {
        text: 'still remembers where the bodies are buried (her words, not mine)',
        explanation: 'Attributing a common idiom to a specific colleague is a technique AI uses to add human texture. The parenthetical feels calculated to demonstrate personality.',
        type: 'ai-tell',
      },
      {
        text: 'might actually play well with the board since they\'ve been asking about security posture',
        explanation: 'Reframing bad news as a strategic opportunity is a hallmark of AI communication advice. Real people delivering bad news rarely pivot this smoothly to silver linings.',
        type: 'ai-tell',
      },
      {
        text: 'I\'ll have a proper revised schedule by Wednesday EOD',
        explanation: 'The email wraps up with a precise, professional commitment. Every loose thread is addressed. Real delay apologies tend to be messier and less comprehensively resolved.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This email is AI-generated despite its convincing casual tone. The tells are subtle: technical problems are described narratively rather than with specific references, personality details feel planted, bad news is reframed too smoothly into opportunity, and every concern is addressed with suspicious thoroughness.',
    skills: { prompting: 0.5, concepts: 0.6, tools: 0.1, criticalThinking: 0.9, ethics: 0.4 },
  },

  // ============================================================
  // EMAIL — Human Written (looks AI-like: polished, systematic)
  // ============================================================
  {
    id: 'exp-email-02',
    contentType: 'email',
    difficulty: 'expert',
    title: 'Infrastructure Migration Plan',
    content: `Subject: AWS to GCP migration — phased approach recommendation

Hi team,

After reviewing our current AWS infrastructure costs and the GCP commitment discount Google offered us last week, I want to propose a phased migration approach. I've broken this into three stages with clear decision gates between each.

Phase 1 (Weeks 1-4): Non-critical workloads
- Move staging environments and CI/CD pipelines to GCP
- Migrate the internal analytics dashboard (it's just a Grafana instance talking to BigQuery anyway, so this is almost free)
- Set up mirrored logging in Cloud Logging so we can validate parity

Phase 2 (Weeks 5-10): Stateless production services
- API gateway and edge functions
- Image processing pipeline (this alone saves us $14k/month because of the Cloud Run pricing difference I showed you in the spreadsheet from Tuesday)
- Authentication service — note: this depends on Raj finishing the OIDC provider abstraction he's been working on. I checked with him yesterday and he says two more weeks, which in Raj-time means three. Plan accordingly.

Phase 3 (Weeks 11-16): Stateful services and databases
- This is the scary one and I'm not going to pretend otherwise
- PostgreSQL primary + replicas via Cloud SQL
- Redis cluster migration (we need to solve the cross-region latency issue BEFORE this phase — I don't have a solution yet and would love suggestions)
- S3 to Cloud Storage bucket migration with dual-write period

Decision gates: After each phase, we do a one-week assessment. If latency p99 increases by more than 15% or error rates exceed 0.1%, we pause and reassess. No heroics.

I know this looks aggressive. It is. But the current AWS bill is $847k/year and Google's offering us $620k committed for equivalent capacity. That $227k delta funds approximately two senior engineers, which we need regardless.

Let me know if you want to walk through this Thursday. I'll block 90 minutes.

Priya`,
    isAI: false,
    humanSource: 'VP of Engineering at a SaaS company',
    markers: [
      {
        text: 'it\'s just a Grafana instance talking to BigQuery anyway, so this is almost free',
        explanation: 'Parenthetical that reveals insider knowledge of the actual current architecture. This specificity about existing infrastructure comes from someone who lives in this system daily.',
        type: 'human-tell',
      },
      {
        text: 'which in Raj-time means three. Plan accordingly',
        explanation: 'Referencing a specific colleague\'s pattern of underestimating timelines by name, with dry humor. This is real team knowledge that AI wouldn\'t fabricate with such confidence.',
        type: 'human-tell',
      },
      {
        text: 'This is the scary one and I\'m not going to pretend otherwise',
        explanation: 'Direct emotional honesty about risk, placed at the critical juncture of the plan. This isn\'t performative vulnerability — it\'s a leader signaling genuine concern to calibrate the team\'s expectations.',
        type: 'human-tell',
      },
      {
        text: 'I don\'t have a solution yet and would love suggestions',
        explanation: 'Admitting a concrete unsolved problem within a structured plan. AI-generated plans typically propose solutions for every issue; humans admit real gaps.',
        type: 'human-tell',
      },
      {
        text: 'That $227k delta funds approximately two senior engineers, which we need regardless',
        explanation: 'Connecting infrastructure savings to headcount is a business-savvy framing that comes from someone who manages real budgets and has hiring needs.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This email is human-written despite its polished, systematic structure. The insider architecture knowledge, named colleague habits, admitted unsolved problems, and business-case framing tied to real headcount needs all demonstrate authentic organizational context that AI would not generate with this level of specificity.',
    skills: { prompting: 0.5, concepts: 0.6, tools: 0.1, criticalThinking: 0.9, ethics: 0.4 },
  },

  // ============================================================
  // ESSAY — AI Generated (with human-like imperfections)
  // ============================================================
  {
    id: 'exp-essay-01',
    contentType: 'essay',
    difficulty: 'expert',
    title: 'Why I Stopped Using Productivity Apps',
    content: `I used to have seventeen productivity apps on my phone. I know the exact number because I counted them during a particularly unproductive afternoon when I should have been finishing a grant proposal. Todoist, Notion, Obsidian, Things 3, Fantastical, Forest, Toggl, Habitica — I could keep going. Each one was supposed to be the system that finally organized my chaotic brain into something resembling a functional adult.

The turning point came in February when I realized I'd spent forty-five minutes building a Notion template to track my daily habits, and one of the habits I was tracking was "spend less time on screens." The irony wasn't lost on me, but what really stung was the recognition that template-building had become my procrastination of choice. It felt like work. It had the aesthetics of productivity — color-coded databases, linked relations, rollup properties. But it produced nothing except itself.

So I quit all of them. Cold turkey. I bought a $3 spiral notebook from CVS and started writing my to-do list by hand. The first week was genuinely uncomfortable — I kept reaching for my phone to "capture a thought" before it disappeared, which is the productivity-app equivalent of a smoker patting their pocket for a lighter.

Here's what I noticed after a month: I got roughly the same amount of stuff done. Maybe slightly more, because I wasn't spending time maintaining the system that was supposed to help me do stuff. The notebook couldn't send me notifications. It couldn't gamify my water intake. It couldn't generate a weekly productivity report. And it turned out I didn't need any of those things. I needed a list, and I needed to do the things on the list. The whole productivity-industrial complex had convinced me that the gap between my current self and my organized self could be bridged by the right app, when the actual gap was just discipline. And discipline isn't an app. It's not even a skill, really. It's more like a muscle you've been told is a bone.`,
    isAI: true,
    aiModel: 'GPT-4o',
    markers: [
      {
        text: 'I used to have seventeen productivity apps on my phone. I know the exact number because I counted them during a particularly unproductive afternoon',
        explanation: 'The self-aware opening with a specific number and a meta-ironic framing is a signature AI move — creating a hook that simultaneously establishes personality and theme.',
        type: 'ai-tell',
      },
      {
        text: 'the productivity-app equivalent of a smoker patting their pocket for a lighter',
        explanation: 'A perfectly constructed analogy that is clever but generic. AI generates analogies that sound personal but draw from common cultural references rather than lived experience.',
        type: 'ai-tell',
      },
      {
        text: 'The whole productivity-industrial complex had convinced me',
        explanation: 'Coining a compound phrase ("productivity-industrial complex") by riffing on a well-known term is a technique AI uses to sound like an original thinker. It\'s too tidy a coinage for casual writing.',
        type: 'ai-tell',
      },
      {
        text: 'It\'s more like a muscle you\'ve been told is a bone',
        explanation: 'Ending with a pithy, philosophical one-liner that reframes the entire essay. AI consistently reaches for these mic-drop closings that sound profound but don\'t quite survive scrutiny.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This essay is AI-generated despite its convincing first-person voice and self-deprecating tone. The tells are in the structure: a precisely engineered opening hook, analogies that are clever but culturally generic rather than personally specific, a too-tidy coinage, and a pithy closing line that prioritizes sounding profound over making rigorous sense.',
    skills: { prompting: 0.5, concepts: 0.7, tools: 0.1, criticalThinking: 0.9, ethics: 0.5 },
  },

  // ============================================================
  // ESSAY — Human Written (looks AI-like: systematic, polished)
  // ============================================================
  {
    id: 'exp-essay-02',
    contentType: 'essay',
    difficulty: 'expert',
    title: 'The Case Against Productivity Systems',
    content: `I have a confession that will make me unpopular in certain corners of the internet: I think most productivity systems are elaborate procrastination engines. I say this as someone who has tried, genuinely tried, all of them. GTD. Zettelkasten. Bullet journaling. The Pomodoro Technique. Building a Second Brain. I even did the Franklin Covey planner thing in 2006, which dates me in a way I'm not comfortable with.

The pattern is always the same. Week one: euphoria. You've found the system. Everything clicks. You spend hours setting it up, and the setup feels indistinguishable from progress because it involves effort and decisions and the satisfying creation of structure. Week two: refinement. You adjust the system because the default categories don't quite fit your workflow. This also feels like progress. Week three: the first missed entry. You forget to do your weekly review, or you capture a task in the wrong place, and now the system has a gap in it. Week four: you read a blog post about a different system that seems to address the exact failure mode you just experienced. Repeat.

I know this cycle intimately because I've written about it. In 2019, I published a piece in Wired arguing that Notion was going to revolutionize personal knowledge management. I believed it at the time. I built a workspace with 47 linked databases. I can tell you exactly how many because when I finally exported everything to markdown files last year, the export script counted them. Forty-seven databases, and I could not point to a single project that was completed because of them rather than in spite of them.

The uncomfortable truth — and I've confirmed this with my therapist, who laughed in a way that was not entirely professional — is that for people like me, system-building is a way to simulate the feeling of control without exercising actual control. It's the planning fallacy weaponized against yourself. The most productive period of my career was the eighteen months I spent writing my first book, during which my entire organizational system was a single text file called "book.txt" and a kitchen timer.`,
    isAI: false,
    humanSource: 'Technology journalist and author',
    markers: [
      {
        text: 'I even did the Franklin Covey planner thing in 2006, which dates me in a way I\'m not comfortable with',
        explanation: 'A culturally specific, self-dating reference with genuine embarrassment. The Franklin Covey planner is a deep cut that reveals real generational experience, not a curated list of productivity methods.',
        type: 'human-tell',
      },
      {
        text: 'In 2019, I published a piece in Wired arguing that Notion was going to revolutionize personal knowledge management',
        explanation: 'Citing a specific publication and a specific past opinion the author now disagrees with. This kind of self-contradicting professional history is something humans reference but AI rarely fabricates.',
        type: 'human-tell',
      },
      {
        text: 'I\'ve confirmed this with my therapist, who laughed in a way that was not entirely professional',
        explanation: 'Referencing a real therapeutic relationship with a specific, funny reaction. The "not entirely professional" qualifier is the kind of precise social observation that comes from memory, not generation.',
        type: 'human-tell',
      },
      {
        text: 'a single text file called "book.txt" and a kitchen timer',
        explanation: 'The anticlimactic, mundane specificity of the actual solution. AI would construct a more narratively satisfying punchline; humans report what actually happened, even when it\'s boring.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This essay is human-written despite its systematic structure and polished prose. The self-dating Franklin Covey reference, citation of a specific past article the author now regrets, the therapist anecdote with a precise social observation, and the anticlimactically mundane "book.txt" reveal all point to authentic lived experience.',
    skills: { prompting: 0.5, concepts: 0.7, tools: 0.1, criticalThinking: 0.9, ethics: 0.5 },
  },

  // ============================================================
  // CODE — AI Generated (with human-like quirks)
  // ============================================================
  {
    id: 'exp-code-01',
    contentType: 'code',
    difficulty: 'expert',
    title: 'Rate Limiter with Sliding Window',
    content: `import time
import hashlib
from typing import Optional

class SlidingWindowRateLimiter:
    """
    Token bucket-ish rate limiter using Redis sorted sets.

    Not a true token bucket — more like a sliding window log.
    I keep mixing up the terminology tbh. The important thing is
    it doesn't have the burst problem that fixed windows have.
    """

    def __init__(self, redis_client, max_requests: int = 100,
                 window_seconds: int = 60):
        self._redis = redis_client
        self._max = max_requests
        self._window = window_seconds

    def _make_key(self, identifier: str) -> str:
        # hash the identifier so we don't end up with weird
        # characters in redis keys (learned that one the hard way
        # with email addresses containing +)
        hashed = hashlib.md5(identifier.encode()).hexdigest()[:12]
        return f"rl:{{hashed}}"

    def is_allowed(self, identifier: str) -> tuple[bool, dict]:
        key = self._make_key(identifier)
        now = time.time()
        window_start = now - self._window

        pipe = self._redis.pipeline()
        # remove expired entries
        pipe.zremrangebyscore(key, 0, window_start)
        # count remaining
        pipe.zcard(key)
        # add current request optimistically
        pipe.zadd(key, {f"{now}": now})
        pipe.expire(key, self._window)
        results = pipe.execute()

        current_count = results[1]

        if current_count >= self._max:
            # we already added it, so remove it
            self._redis.zrem(key, f"{now}")
            oldest = self._redis.zrange(key, 0, 0, withscores=True)
            retry_after = (oldest[0][1] + self._window - now) if oldest else self._window
            return False, {
                "limit": self._max,
                "remaining": 0,
                "retry_after": round(retry_after, 1)
            }

        return True, {
            "limit": self._max,
            "remaining": self._max - current_count - 1,
            "retry_after": None
        }`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'I keep mixing up the terminology tbh',
        explanation: 'This casual aside in a docstring is designed to mimic human imprecision, but the implementation itself is precise and correct. Real developers who confuse terminology also make corresponding implementation inconsistencies.',
        type: 'ai-tell',
      },
      {
        text: '# hash the identifier so we don\'t end up with weird\n        # characters in redis keys (learned that one the hard way\n        # with email addresses containing +)',
        explanation: 'The "learned the hard way" comment mimics human experience, but using MD5 for key hashing is a textbook choice that a real developer with that experience would likely have replaced with a simpler sanitization or used a more specific encoding.',
        type: 'ai-tell',
      },
      {
        text: '# add current request optimistically',
        explanation: 'The optimistic-add-then-rollback pattern is a technically valid approach, but a real production rate limiter would check first then add to avoid the extra round trip on rejection. This is the "correct" algorithmic solution, not the practical one.',
        type: 'ai-tell',
      },
      {
        text: 'return False, {\n                "limit": self._max,\n                "remaining": 0,\n                "retry_after": round(retry_after, 1)\n            }',
        explanation: 'The response format mirrors HTTP rate limit headers perfectly. AI produces API-standard responses instinctively; human code often returns simpler values and adds structured responses later.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This code is AI-generated despite the casual docstring and "learned the hard way" comments. The artificial imperfections (confused terminology, anecdotal comments) are layered onto code that is structurally too clean: textbook algorithm choice, perfectly HTTP-standard response format, and an optimistic-then-rollback pattern that is correct but impractical.',
    skills: { prompting: 0.4, concepts: 0.7, tools: 0.8, criticalThinking: 0.8, ethics: 0.2 },
  },

  // ============================================================
  // CODE — Human Written (looks AI-like: clean, well-documented)
  // ============================================================
  {
    id: 'exp-code-02',
    contentType: 'code',
    difficulty: 'expert',
    title: 'Rate Limiter (Production)',
    content: `import time
from typing import Optional

class RateLimiter:
    """
    Sliding window rate limiter backed by Redis sorted sets.

    We tried the token bucket approach first (see git blame, March 2024)
    but it couldn't handle our bursty traffic pattern where a single
    webhook delivery can trigger 50+ API calls in <1s. Sorted sets
    give us exact counts at the cost of more memory per key.

    Memory note: at peak we have ~340k active keys. Each key holds
    up to max_requests scored members. Redis memory usage from this
    is roughly 2.1GB which is fine on our current 8GB instance but
    worth monitoring. Alert is set at 6GB in Datadog.
    """

    SCRIPT = """
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local limit = tonumber(ARGV[3])

    redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
    local count = redis.call('ZCARD', key)

    if count < limit then
        redis.call('ZADD', key, now, now .. ':' .. math.random(1000000))
        redis.call('EXPIRE', key, window)
        return {1, limit - count - 1}
    end

    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local retry = oldest[2] + window - now
    return {0, retry}
    """

    def __init__(self, redis_client, *, max_requests: int = 100,
                 window_seconds: int = 60):
        self._redis = redis_client
        self._max = max_requests
        self._window = window_seconds
        self._sha: Optional[str] = None

    def _ensure_script(self):
        if self._sha is None:
            self._sha = self._redis.script_load(self.SCRIPT)

    def check(self, identifier: str) -> tuple[bool, int]:
        """Returns (allowed, remaining_or_retry_after)."""
        self._ensure_script()
        # no hashing — caller is responsible for clean keys.
        # we had the md5 thing before but it made debugging
        # impossible when you're trying to find a specific
        # user's key in redis-cli at 2am
        key = f"rl:{identifier}"
        result = self._redis.evalsha(
            self._sha, 1, key,
            time.time(), self._window, self._max
        )
        return bool(result[0]), result[1]`,
    isAI: false,
    humanSource: 'Backend engineer at a payments company',
    markers: [
      {
        text: 'see git blame, March 2024',
        explanation: 'Referencing a specific point in version control history. This is real institutional memory pointing to traceable project history, not a generic mention of past decisions.',
        type: 'human-tell',
      },
      {
        text: 'at peak we have ~340k active keys. Each key holds\n    up to max_requests scored members. Redis memory usage from this\n    is roughly 2.1GB',
        explanation: 'Specific production metrics (340k keys, 2.1GB memory) from real monitoring. These numbers have the texture of actual observation, not estimation.',
        type: 'human-tell',
      },
      {
        text: 'we had the md5 thing before but it made debugging\n        # impossible when you\'re trying to find a specific\n        # user\'s key in redis-cli at 2am',
        explanation: 'A design decision explicitly reversed because of a real debugging experience. The "2am" detail and the specificity of the problem (finding keys in redis-cli) come from lived operational pain.',
        type: 'human-tell',
      },
      {
        text: 'now .. \':\' .. math.random(1000000)',
        explanation: 'Appending a random suffix to prevent collisions when multiple requests arrive at the same timestamp. This edge case fix comes from encountering real production issues, not from theoretical design.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This code is human-written despite its clean structure and thorough documentation. The git blame reference, specific production metrics, a deliberately reversed design decision with an operational war story, and the Lua script with a collision-prevention hack all point to code shaped by real production experience.',
    skills: { prompting: 0.4, concepts: 0.7, tools: 0.8, criticalThinking: 0.8, ethics: 0.2 },
  },

  // ============================================================
  // SOCIAL MEDIA — AI Generated (with human-like casualness)
  // ============================================================
  {
    id: 'exp-social-01',
    contentType: 'social-media',
    difficulty: 'expert',
    title: 'Freelancer Rant',
    imagePath: '/images/turing/exp-social-01.png',
    content: `ok rant incoming, sorry in advance

just got off a call with a potential client who wanted me to design their entire brand identity — logo, brand guidelines, website mockups, social media templates — for $500. when I quoted my actual rate they said "but we're a startup" as if that changes the number of hours it takes to do the work??

I've been freelancing for six years now and I swear the "exposure" offers are getting WORSE not better. at least in 2019 people were embarrassed when they lowballed you. now they act offended when you say no, like you're the one being unreasonable.

the thing that kills me is I know someone will take that job. some junior designer who needs the portfolio piece, and they'll do an ok job, and the client will spend the next five years wondering why their brand feels "off" without connecting it to the $500 they refused to spend properly. and when they eventually hire someone to fix it they'll pay twice what it would have cost to do it right.

I'm not even mad at the junior who takes it. I would have taken it too at 22. I'm mad at the ecosystem that's trained non-creative people to think creative work is a commodity. you wouldn't ask your accountant to do your taxes for exposure.

anyway. back to work. I have three actual paying clients who treat me like a professional and that's enough to keep me going. just needed to scream into the void for a minute.`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'ok rant incoming, sorry in advance',
        explanation: 'A socially-aware preamble that AI adds to signal casual register. Real social media rants typically just start ranting without the metacommentary.',
        type: 'ai-tell',
      },
      {
        text: 'the client will spend the next five years wondering why their brand feels "off" without connecting it to the $500 they refused to spend properly',
        explanation: 'A perfectly structured cause-and-effect narrative about future consequences. Real frustrated freelancers vent about the immediate insult; AI constructs satisfying long-arc arguments even in rant mode.',
        type: 'ai-tell',
      },
      {
        text: 'you wouldn\'t ask your accountant to do your taxes for exposure',
        explanation: 'This is a well-known talking point in creative industry discourse. AI draws from common arguments in its training data. A human making this comparison would more likely use a specific, unusual analogy from their own life.',
        type: 'ai-tell',
      },
      {
        text: 'I have three actual paying clients who treat me like a professional and that\'s enough to keep me going',
        explanation: 'The rant resolves into gratitude and perspective. AI consistently adds emotional balance to negative posts. Real rants on social media often just end angry.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This post is AI-generated despite its convincing casual tone and lowercase style. The tells: a self-aware preamble framing it as a rant, a too-perfectly-structured long-arc argument, a borrowed talking point rather than original analogy, and a tidy emotional resolution that real social media venting rarely includes.',
    skills: { prompting: 0.5, concepts: 0.5, tools: 0.1, criticalThinking: 0.9, ethics: 0.3 },
  },

  // ============================================================
  // SOCIAL MEDIA — Human Written (looks AI-like: structured thread)
  // ============================================================
  {
    id: 'exp-social-02',
    contentType: 'social-media',
    difficulty: 'expert',
    title: 'Pricing Advice Thread',
    imagePath: '/images/turing/exp-social-02.png',
    content: `Thread on freelance pricing since my DMs have been full of this after the talk I gave at CreativeMornings Portland last month:

1/ Your rate is not what you think your time is worth. Your rate is what it costs to sustain a business that does what you do. Those are completely different numbers. I didn't understand this until my accountant (shout out Deb at Greenleaf Tax, she saved my business in 2021) showed me what my actual overhead was.

2/ I track every single project in a spreadsheet I've maintained since 2018. 247 projects. My average effective hourly rate — meaning total fee divided by actual hours spent — has ranged from $12/hr (a nightmare rebrand for a Portland food cart chain, never again) to $340/hr (a one-day brand audit for Patagonia's retail division). Same person, wildly different outcomes.

3/ The projects that went badly almost always had the same pattern: unclear scope, no written contract, and I said yes because I liked the people. Liking the client is a terrible reason to take a project. Respecting the client's process is a great reason.

4/ Fixed project pricing changed everything for me but ONLY after I got accurate at estimating hours. If you can't estimate, hourly is safer. I was bad at estimating for the first three years and I ate probably $40k in underquoted projects. That's not a metaphor, I added it up.

5/ The hardest thing I've learned: sometimes the right price is "no." I turned down $60k in work last year that would have required me to work nights and weekends for four months. My marriage is worth more than $60k. Specifically, my wife told me it was worth more than $60k, in those words, during a conversation I will not soon forget.`,
    isAI: false,
    humanSource: 'Freelance brand designer',
    markers: [
      {
        text: 'shout out Deb at Greenleaf Tax, she saved my business in 2021',
        explanation: 'Naming a specific person at a specific business with a specific year. This is a real professional relationship being acknowledged, not a constructed detail.',
        type: 'human-tell',
      },
      {
        text: '247 projects',
        explanation: 'An oddly precise number that isn\'t round or memorable. AI generates round or narratively convenient numbers; humans report what their actual spreadsheet says.',
        type: 'human-tell',
      },
      {
        text: 'a nightmare rebrand for a Portland food cart chain, never again',
        explanation: 'A specific type of client (Portland food cart chain) with a visceral emotional reaction. The local specificity and the "never again" suggest real regret from a real project.',
        type: 'human-tell',
      },
      {
        text: 'my wife told me it was worth more than $60k, in those words, during a conversation I will not soon forget',
        explanation: 'A quote attributed to a spouse with the rueful acknowledgment that the conversation was memorable. This is a real relationship moment being recalled with genuine emotional weight.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This thread is human-written despite its polished numbered format. The named accountant, the non-round project count, the specific bad client (Portland food cart chain), and the wife\'s direct quote about their marriage all demonstrate real lived experience that AI would not fabricate with this level of granular specificity.',
    skills: { prompting: 0.5, concepts: 0.5, tools: 0.1, criticalThinking: 0.9, ethics: 0.3 },
  },

  // ============================================================
  // CREATIVE WRITING — AI Generated (with human-like voice)
  // ============================================================
  {
    id: 'exp-creative-01',
    contentType: 'creative-writing',
    difficulty: 'expert',
    title: 'The Commute',
    content: `The 7:42 to Penn Station was four minutes late, which meant I had to take the 7:46 local, which meant I'd be standing because the local is always full by Maplewood, which meant my back would be ruined by Newark, which meant I'd be in a foul mood for the 9am with Henderson, which meant I'd probably say something I'd regret, which meant I'd spend the rest of the day composing an apology email in my head while pretending to work. All because NJ Transit couldn't keep a schedule.

That's how I used to think about Tuesdays. This cascading logic of catastrophe, where a four-minute delay became a career-ending event through a chain of reasoning that felt airtight while I was standing on the platform but would seem insane if I described it to another person.

I don't commute anymore. I work from my kitchen table, which has a wobble I keep meaning to fix, and I drink coffee from a mug my daughter made in fourth grade that says "WORLDS BEST DALD" because the kiln warped the last letter. Most mornings are quiet enough that I can hear the neighbor's sprinkler system clicking on at 6:15, which is too early for sprinklers but it's not the kind of thing you bring up with a neighbor.

I thought I'd miss the commute. Everyone says you miss the transition, the liminal space between home-self and work-self. I don't miss it. I miss being the kind of person who had a reason to put on shoes before 10am. There's a difference, and it's a sadder one than I expected.`,
    isAI: true,
    aiModel: 'GPT-4o',
    markers: [
      {
        text: 'which meant I had to take the 7:46 local, which meant I\'d be standing because the local is always full by Maplewood, which meant my back would be ruined by Newark',
        explanation: 'The cascading "which meant" structure is a literary device executed with mechanical precision. It\'s impressively constructed but each link in the chain is a bit too perfectly calibrated for maximum narrative effect.',
        type: 'ai-tell',
      },
      {
        text: 'WORLDS BEST DALD',
        explanation: 'A charming, specific detail that seems like a real memory but is actually a perfectly engineered heartwarming detail. AI excels at generating this kind of endearing imperfection — note how the "error" is explained immediately, leaving nothing unresolved.',
        type: 'ai-tell',
      },
      {
        text: 'it\'s not the kind of thing you bring up with a neighbor',
        explanation: 'An observational aside about social norms that sounds like personal voice but is actually a universally relatable insight. AI generates these "everyone thinks it but nobody says it" observations to simulate personality.',
        type: 'ai-tell',
      },
      {
        text: 'I miss being the kind of person who had a reason to put on shoes before 10am. There\'s a difference, and it\'s a sadder one than I expected.',
        explanation: 'The distinction between missing the commute and missing the identity is insightful but arrives with the precision of a therapy session conclusion. AI endings consistently reframe the essay\'s premise into a more nuanced formulation.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This piece is AI-generated despite its convincing personal voice. The mechanically perfect cascading structure, the too-perfectly-engineered "DALD" mug detail, universally relatable observations masquerading as personal quirks, and the therapeutically precise reframing in the conclusion all indicate sophisticated AI writing.',
    skills: { prompting: 0.5, concepts: 0.6, tools: 0.1, criticalThinking: 0.9, ethics: 0.4 },
  },

  // ============================================================
  // CREATIVE WRITING — Human Written (looks AI-like: literary)
  // ============================================================
  {
    id: 'exp-creative-02',
    contentType: 'creative-writing',
    difficulty: 'expert',
    title: 'Platform 3',
    content: `I took the same train for eleven years. The 7:38 from South Orange to Penn, platform 3. I know that platform the way you know a room you've slept in a thousand times — the patch where they repoured the concrete in 2016 and it's still a slightly different shade, the bench with the slat missing that nobody's fixed since at least 2014, the spot near the south end where the overhang doesn't cover and you get rained on if you're not paying attention.

Eleven years I stood on that platform and I don't think I had a single original thought the entire time. Your brain goes somewhere else. You're watching the track but you're not watching it. You're composing arguments with people you'll never have the arguments with. You're remembering something your mother said in 1997 for no discernible reason. Once I spent the entire wait mentally redesigning my kitchen and when I got to work I couldn't remember a single detail of what I'd imagined. Just the feeling of having imagined it.

My wife thinks I romanticize the commute now that I work from home. She's probably right. But last Tuesday the dishwasher broke and while I was waiting for the repair guy I stood in my kitchen for forty minutes doing nothing, and I thought: this is what the platform felt like. The permission to be unproductive because you're waiting for something that's coming whether you're productive or not.

The repair guy charged me $180 to replace a part that costs $11 on Amazon. I know because I looked it up afterward, which my wife says is a form of self-harm. She's probably right about that too. She's probably right about most things, which is something I've known for eleven years but have only recently started saying out loud, which is its own kind of late arrival.`,
    isAI: false,
    humanSource: 'Essayist, previously published in The Sun',
    markers: [
      {
        text: 'the patch where they repoured the concrete in 2016 and it\'s still a slightly different shade',
        explanation: 'Hyper-specific environmental memory with a year attached. This is the kind of detail you accumulate from standing in the same spot for a decade, not something that can be generated from patterns.',
        type: 'human-tell',
      },
      {
        text: 'You\'re remembering something your mother said in 1997 for no discernible reason',
        explanation: 'The "for no discernible reason" is key — it\'s an observation about how memory actually works, with a specific year that has no narrative payoff. AI assigns meaning to details; humans report meaningless specificity.',
        type: 'human-tell',
      },
      {
        text: 'I spent the entire wait mentally redesigning my kitchen and when I got to work I couldn\'t remember a single detail of what I\'d imagined. Just the feeling of having imagined it.',
        explanation: 'Describing the experience of forgetting a daydream is a phenomenological observation that requires real introspective experience. AI describes thoughts; humans describe the experience of losing thoughts.',
        type: 'human-tell',
      },
      {
        text: 'my wife says is a form of self-harm',
        explanation: 'A spouse\'s darkly funny characterization of looking up part prices. This specific, quotable moment from a real relationship has the texture of something actually said, not generated.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This piece is human-written despite its literary quality. The concrete-patch memory with a specific year, the meaningless 1997 detail, the description of forgetting a daydream, and the wife\'s "self-harm" quip all demonstrate the kind of phenomenological specificity and narrative dead-ends that come from real experience rather than pattern generation.',
    skills: { prompting: 0.5, concepts: 0.6, tools: 0.1, criticalThinking: 0.9, ethics: 0.4 },
  },

  // ============================================================
  // IMAGE — AI Generated (very convincing)
  // ============================================================
  {
    id: 'exp-image-01',
    contentType: 'image',
    difficulty: 'expert',
    title: 'Street Photography — Tokyo Night',
    imagePath: '/images/turing/exp-image-01.png',
    imageDescription: `A striking nighttime street photograph of a narrow Tokyo alley (yokocho) with rain-slicked pavement reflecting neon signs. The composition is strong — a lone figure with a transparent umbrella walks away from camera, silhouetted against warm lantern light from an izakaya. The color palette is cinematic: deep teals in shadows, warm ambers from paper lanterns, and pink-magenta from neon kanji signs. On close inspection: the kanji on the nearest sign reads as plausible strokes but doesn't form actual characters — it's "kanji-like" rather than real Japanese. A second sign further back mixes what appear to be katakana and hangul characters nonsensically. The rain reflections on the ground are slightly too symmetrical — real puddle reflections distort and fragment, but these mirror the signs almost perfectly. The umbrella's transparent material shows no realistic distortion of the lights behind it. A bicycle leaning against a wall has spokes that merge into each other near the hub. The overall mood and composition are magazine-quality, but the small details betray generation.`,
    content: 'See image above.',
    isAI: true,
    aiModel: 'Midjourney v6.1',
    markers: [
      {
        text: 'kanji on the nearest sign reads as plausible strokes but doesn\'t form actual characters',
        explanation: 'AI models generate character-like shapes that look convincing to non-readers but fail linguistic scrutiny. This is one of the most reliable tells in AI-generated images featuring East Asian text.',
        type: 'ai-tell',
      },
      {
        text: 'rain reflections on the ground are slightly too symmetrical',
        explanation: 'Real puddle reflections are distorted by uneven pavement, water depth variations, and surface tension. AI renders reflections as near-perfect mirrors, which is physically incorrect.',
        type: 'ai-tell',
      },
      {
        text: 'umbrella\'s transparent material shows no realistic distortion of the lights behind it',
        explanation: 'Transparent vinyl umbrellas refract light and create distortion patterns. AI struggles with the physics of transparent materials, often rendering them as simple opacity layers.',
        type: 'ai-tell',
      },
      {
        text: 'bicycle leaning against a wall has spokes that merge into each other near the hub',
        explanation: 'Fine, repetitive mechanical structures like bicycle spokes remain difficult for generative models, which tend to merge or lose count of regular repeating elements.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This image is AI-generated despite its cinematic composition and convincing atmosphere. The fake kanji, physically incorrect puddle reflections, lack of refraction through the transparent umbrella, and merged bicycle spokes all reveal generation artifacts that an expert eye would catch.',
    skills: { prompting: 0.5, concepts: 0.7, tools: 0.7, criticalThinking: 0.9, ethics: 0.4 },
  },

  // ============================================================
  // IMAGE — Human (Real Photo, looks AI-like)
  // ============================================================
  {
    id: 'exp-image-02',
    contentType: 'image',
    difficulty: 'expert',
    title: 'Neon Alley — Shinjuku',
    imagePath: '/images/turing/exp-image-02.png',
    imageDescription: `A nighttime photograph of a narrow alley in Shinjuku's Golden Gai district, shot during rain. The image is almost suspiciously beautiful — the kind of perfect cyberpunk aesthetic that screams AI generation. Neon reflections paint the wet asphalt in vivid pinks and blues. A woman in a dark coat walks through the middle distance, slightly motion-blurred from a slow shutter speed. However, every detail holds up under scrutiny: the kanji on signs is real and readable — one says "やきとり" (yakitori), another partially obscured reads "営業中" (open for business). The reflections in puddles are realistically fragmented by uneven pavement, with some signs reflected and others not depending on angle. A crumpled Strong Zero can sits in the gutter. A hand-written paper sign taped to a door reads "本日貸切" (reserved today) in uneven handwriting. The motion blur on the walking figure is physically consistent with roughly a 1/15s shutter speed. A cat is barely visible under a vending machine on the right edge of the frame. The image was shot on a Sony A7III at ISO 3200 based on the characteristic noise pattern in the shadow areas.`,
    content: 'See image above.',
    isAI: false,
    humanSource: 'Street photographer based in Tokyo',
    markers: [
      {
        text: 'one says "やきとり" (yakitori), another partially obscured reads "営業中" (open for business)',
        explanation: 'Real, correct, contextually appropriate Japanese text. The partial obscuring of the second sign is a natural result of the camera angle, not an attempt to hide illegibility.',
        type: 'human-tell',
      },
      {
        text: 'crumpled Strong Zero can sits in the gutter',
        explanation: 'A culturally specific piece of litter (Strong Zero is a popular Japanese chuhai brand). AI doesn\'t generate this kind of culturally accurate incidental detail in the background.',
        type: 'human-tell',
      },
      {
        text: 'hand-written paper sign taped to a door reads "本日貸切" (reserved today) in uneven handwriting',
        explanation: 'Hand-written text with natural unevenness is extremely difficult for AI to generate convincingly. The content is also contextually perfect for a small Golden Gai bar.',
        type: 'human-tell',
      },
      {
        text: 'cat is barely visible under a vending machine on the right edge of the frame',
        explanation: 'An incidental, easy-to-miss detail at the frame\'s edge. Real photographs contain these unplanned elements; AI compositions tend to place every element intentionally.',
        type: 'human-tell',
      },
      {
        text: 'characteristic noise pattern in the shadow areas',
        explanation: 'Sensor noise from high-ISO photography has specific patterns per camera model. This is a physical artifact of real hardware that AI generation doesn\'t authentically reproduce.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This is a real photograph despite looking "too perfect." The readable Japanese text, culturally specific litter (Strong Zero can), hand-written sign with natural irregularity, incidental cat at the frame edge, and camera-specific sensor noise all confirm this was captured with a real camera by someone who knows Tokyo intimately.',
    skills: { prompting: 0.5, concepts: 0.7, tools: 0.7, criticalThinking: 0.9, ethics: 0.4 },
  },
];
