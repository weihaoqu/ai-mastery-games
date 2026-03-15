import type { TuringItem } from '../../lib/types';

export const advancedItems: TuringItem[] = [
  // ============================================================
  // EMAIL — AI Generated
  // ============================================================
  {
    id: 'adv-email-01',
    contentType: 'email',
    difficulty: 'advanced',
    title: 'Negotiation Follow-up',
    content: `Subject: Re: Contract terms — few thoughts

Hey David,

Appreciate you sending over the revised terms. Took a look this morning over coffee (well, two coffees — it's been that kind of week).

Most of it looks solid. The payment schedule works for us, and the IP assignment clause is reasonable now that you've scoped it to project deliverables only.

Two things I want to flag though:

The non-compete in Section 7.2 is still pretty broad. "Adjacent markets" is doing a lot of heavy lifting there and I think it'd bite us both if we ever had to test it. Can we narrow it to direct competitors? I can send over some suggested language if that helps.

Also — and this is more of a nitpick — the liability cap is set at 2x contract value, which is standard, but given the scope of the data migration piece, I'd feel more comfortable at 1.5x with a carve-out for gross negligence. Happy to discuss.

Otherwise I think we're close. Want to jump on a call Thursday to hash out the remaining bits? I've got a window at 2pm or 4pm ET.

Cheers,
Rachel`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'well, two coffees — it\'s been that kind of week',
        explanation: 'This casual aside feels inserted to simulate human warmth. It\'s the kind of personality detail AI adds to seem relatable without actually connecting to anything specific.',
        type: 'ai-tell',
      },
      {
        text: 'is doing a lot of heavy lifting there',
        explanation: 'A popular idiomatic phrase that AI has learned to deploy for casual tone. It\'s natural on its own, but combined with the overall polish, it feels performative.',
        type: 'ai-tell',
      },
      {
        text: 'I\'d feel more comfortable at 1.5x with a carve-out for gross negligence',
        explanation: 'The specific contract terminology is accurate but presented too cleanly. Real negotiators would usually reference the actual clause number or prior discussion.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This email is AI-generated, though it\'s a strong imitation. The casual asides feel strategically placed rather than natural, the contract terminology is precise but not grounded in specific prior exchanges, and the overall tone is uniformly polished throughout.',
    skills: { prompting: 0.4, concepts: 0.6, tools: 0.1, criticalThinking: 0.8, ethics: 0.4 },
  },

  // ============================================================
  // EMAIL — Human Written
  // ============================================================
  {
    id: 'adv-email-02',
    contentType: 'email',
    difficulty: 'advanced',
    title: 'Legal Negotiation Response',
    content: `Subject: Re: Re: Contract terms — few thoughts

David —

OK so I finally read through the whole thing (sorry, yesterday was a nightmare with the Meridian client blowing up their own timeline again).

Payment schedule: fine.
IP clause: fine, much better than the last version.

Section 7.2 though — we need to talk. Lisa flagged this too independently so it's not just me being paranoid. "Adjacent markets" is way too vague. We had a similar clause in the Terraform deal in 2022 and it almost torpedoed a partnership with Dataline because their counsel interpreted "adjacent" to include anything in the data infrastructure space. Let's not repeat that. I'll have Lisa draft narrower language.

On the liability cap, I'd actually prefer we keep it at 2x but add a mutual carve-out for data breach. That's where the real risk lives on this one. The migration involves PII and honestly neither of us wants to find out what "2x contract value" feels like if someone exfiltrates a few million records. I know that's a fun conversation to have with your risk team lol.

Can do Thursday. 4pm works, 2pm I'm in a board prep thing that'll probably run over.

R`,
    isAI: false,
    humanSource: 'General counsel at a tech company',
    markers: [
      {
        text: 'yesterday was a nightmare with the Meridian client blowing up their own timeline again',
        explanation: 'Specific client name and a genuine frustration with "again" implying history. This is real professional context, not a generic aside.',
        type: 'human-tell',
      },
      {
        text: 'We had a similar clause in the Terraform deal in 2022 and it almost torpedoed a partnership with Dataline',
        explanation: 'Referencing a specific past deal with named parties and concrete consequences. This is institutional memory, not generic legal reasoning.',
        type: 'human-tell',
      },
      {
        text: 'I know that\'s a fun conversation to have with your risk team lol',
        explanation: 'Sarcastic empathy about organizational politics. This kind of humor requires understanding of the other person\'s internal dynamics.',
        type: 'human-tell',
      },
      {
        text: '2pm I\'m in a board prep thing that\'ll probably run over',
        explanation: 'Specific scheduling conflict with a realistic prediction about it running over. Humans manage real calendars with known patterns.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This email is human-written. The specific client references (Meridian, Terraform deal, Dataline), institutional memory about past legal issues, sarcastic humor about organizational dynamics, and realistic scheduling details all demonstrate authentic professional correspondence.',
    skills: { prompting: 0.4, concepts: 0.6, tools: 0.1, criticalThinking: 0.8, ethics: 0.4 },
  },

  // ============================================================
  // ESSAY — AI Generated
  // ============================================================
  {
    id: 'adv-essay-01',
    contentType: 'essay',
    difficulty: 'advanced',
    title: 'The Quiet Crisis in Local Journalism',
    content: `When the Millbrook Herald shut its doors last April after 127 years of continuous publication, the town of 12,000 didn't hold a vigil. There was no protest, no community fundraiser, no impassioned letters to the editor — because there was no longer an editor to write to. The paper simply stopped arriving one Thursday, and by Monday, most people had adjusted.

This is how local journalism dies: not with a bang, but with a shrug.

The numbers tell a story that should alarm anyone who cares about democratic accountability. Since 2005, the United States has lost roughly 2,900 newspapers. That's more than a quarter of the total. The surviving papers have shed two-thirds of their newsroom staff. In practical terms, this means entire counties — many of them rural, many of them poor — now exist without a single professional journalist covering their school boards, their courts, their municipal budgets.

The consequences are measurable and grim. Research from the Hussman School of Journalism has shown that communities that lose local newspapers see increases in municipal borrowing costs, as bond markets price in reduced fiscal oversight. Voter participation in local elections declines. Corruption, or at least the perception of it, rises.

But the most profound loss may be the hardest to quantify: the erosion of shared civic identity. A local paper doesn't just report on a community; in some fundamental sense, it constitutes one. It tells a town its own story. It decides what matters. Without that narrative infrastructure, a community becomes a collection of individuals consuming national media that speaks to none of them specifically.

I don't have a tidy solution. The advertising model is broken and isn't coming back. Nonprofit ownership shows promise but doesn't scale. AI-generated local news — already being piloted in several markets — fills column inches but lacks the relationships and institutional knowledge that make journalism meaningful. The answer, if there is one, probably involves all of these approaches and some we haven't imagined yet.

What I do know is that the Millbrook Herald deserved more than a shrug.`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'not with a bang, but with a shrug',
        explanation: 'A clever allusion to T.S. Eliot that feels a bit too perfectly placed. AI excels at deploying literary references as structural devices.',
        type: 'ai-tell',
      },
      {
        text: 'Since 2005, the United States has lost roughly 2,900 newspapers',
        explanation: 'The specific statistics sound authoritative but should be verified — AI often generates plausible-sounding numbers from pattern matching across training data.',
        type: 'ai-tell',
      },
      {
        text: 'Research from the Hussman School of Journalism has shown',
        explanation: 'Citing a real institution adds credibility, but AI may be associating the school with plausible-sounding research rather than a specific study.',
        type: 'ai-tell',
      },
      {
        text: 'I don\'t have a tidy solution',
        explanation: 'Strategic humility before listing multiple approaches. AI has learned that admitting uncertainty makes writing feel more authentic.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This essay is AI-generated, though it\'s sophisticated. The tells are subtle: a too-perfect literary allusion, statistics that sound precise but may be approximate, institutional citations that could be pattern-matched rather than sourced, and strategic humility that feels calculated.',
    skills: { prompting: 0.4, concepts: 0.7, tools: 0.1, criticalThinking: 0.8, ethics: 0.5 },
  },

  // ============================================================
  // ESSAY — Human Written
  // ============================================================
  {
    id: 'adv-essay-02',
    contentType: 'essay',
    difficulty: 'advanced',
    title: 'What We Lost When the Paper Closed',
    content: `I reported for the Carver County Gazette for eleven years. I covered the school board, the county commission, two municipal corruption scandals, and one lawsuit against a hog farm that was poisoning a creek. When the paper folded in 2021, I had 340 contacts in my phone and institutional knowledge of this county that nobody else had and nobody was going to replace.

That's the part the "death of local journalism" think pieces always miss. It's not about the platform. It's about the fact that I knew Jim Darrow had been on the planning commission for nineteen years and had a pattern of recusing himself from votes involving the east side development corridor where his brother-in-law owns property. That's not something you can Google. That came from sitting in those meetings, year after year, noticing things.

I'm freelancing now. I write for a regional outlet that covers six counties with two reporters. I can give Carver maybe ten hours a week, which means I'm triaging. School board: yes. County commission: sometimes. The hog farm thing? Nobody's watching that anymore. The injunction expired and I genuinely don't know if they're complying because there's no one to check.

People ask me about AI journalism and I try not to be dismissive. Maybe it can summarize meeting minutes. Maybe it can aggregate police blotter data. But can it notice that the city manager's car was parked at the new golf course developer's office at 7am on a Saturday? Can it know that's significant because there's a rezoning vote next Tuesday? No. And I don't think that's a problem AI will solve, because it's not an information problem. It's a presence problem.

The Gazette building is a CrossFit gym now. I drive past it every day. I don't think that's a metaphor for anything but it sure feels like one.`,
    isAI: false,
    humanSource: 'Former local newspaper reporter',
    markers: [
      {
        text: 'Jim Darrow had been on the planning commission for nineteen years and had a pattern of recusing himself from votes involving the east side development corridor where his brother-in-law owns property',
        explanation: 'Hyper-specific institutional knowledge with named individuals and geographic details. This is real reporting memory, not generated content.',
        type: 'human-tell',
      },
      {
        text: 'The injunction expired and I genuinely don\'t know if they\'re complying because there\'s no one to check',
        explanation: 'Admitting a real, specific knowledge gap with consequences. This isn\'t strategic humility — it\'s genuine professional frustration.',
        type: 'human-tell',
      },
      {
        text: 'can it notice that the city manager\'s car was parked at the new golf course developer\'s office at 7am on a Saturday',
        explanation: 'A concrete, granular example of journalistic presence that could only come from someone who\'s actually done this work.',
        type: 'human-tell',
      },
      {
        text: 'I don\'t think that\'s a metaphor for anything but it sure feels like one',
        explanation: 'Self-aware resistance to neatly symbolizing the ending. A human writer catches themselves reaching for meaning and pulls back.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This essay is human-written. The specific named sources, granular institutional knowledge, acknowledged gaps in current coverage, and the self-aware resistance to metaphor in the final line all mark this as authentic first-person journalism.',
    skills: { prompting: 0.4, concepts: 0.7, tools: 0.1, criticalThinking: 0.8, ethics: 0.5 },
  },

  // ============================================================
  // CODE — AI Generated
  // ============================================================
  {
    id: 'adv-code-01',
    contentType: 'code',
    difficulty: 'advanced',
    title: 'Event Sourcing Implementation',
    content: `class EventStore:
    def __init__(self, db_pool):
        self._pool = db_pool
        self._subscribers: dict[str, list[Callable]] = {}

    async def append(self, stream_id: str, events: list[Event], expected_version: int = -1) -> int:
        async with self._pool.acquire() as conn:
            async with conn.transaction():
                # optimistic concurrency check
                current = await conn.fetchval(
                    "SELECT MAX(version) FROM events WHERE stream_id = $1",
                    stream_id
                )
                current = current if current is not None else -1

                if expected_version != -1 and current != expected_version:
                    raise ConcurrencyError(
                        f"Expected version {expected_version}, got {current}"
                    )

                version = current
                for event in events:
                    version += 1
                    await conn.execute(
                        """INSERT INTO events (stream_id, version, event_type, data, metadata, timestamp)
                           VALUES ($1, $2, $3, $4, $5, NOW())""",
                        stream_id, version, event.type, json.dumps(event.data),
                        json.dumps(event.metadata)
                    )

                # notify subscribers
                for event in events:
                    for handler in self._subscribers.get(event.type, []):
                        await handler(event)

                return version

    def subscribe(self, event_type: str, handler: Callable) -> None:
        self._subscribers.setdefault(event_type, []).append(handler)

    async def read_stream(self, stream_id: str, from_version: int = 0) -> list[Event]:
        async with self._pool.acquire() as conn:
            rows = await conn.fetch(
                """SELECT event_type, data, metadata, version, timestamp
                   FROM events WHERE stream_id = $1 AND version >= $2
                   ORDER BY version""",
                stream_id, from_version
            )
            return [
                Event(
                    type=row["event_type"],
                    data=json.loads(row["data"]),
                    metadata=json.loads(row["metadata"]),
                    version=row["version"],
                    timestamp=row["timestamp"]
                )
                for row in rows
            ]`,
    isAI: true,
    aiModel: 'GPT-4',
    markers: [
      {
        text: '# optimistic concurrency check',
        explanation: 'Textbook-accurate comment naming the exact design pattern. Real developers usually comment on the "why" not the "what pattern this is."',
        type: 'ai-tell',
      },
      {
        text: '# notify subscribers',
        explanation: 'In-transaction subscriber notification is a subtle design flaw. Real event stores separate persistence from notification to avoid holding the transaction open during handlers.',
        type: 'ai-tell',
      },
      {
        text: 'async def read_stream(self, stream_id: str, from_version: int = 0) -> list[Event]',
        explanation: 'A complete, textbook-correct API surface on first pass. Real implementations of event sourcing evolve through iterations — you don\'t ship subscribe + read_stream + append in one go.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This code is AI-generated. The textbook-perfect implementation with pattern-naming comments, the subtle design flaw of notifying subscribers inside a transaction, and the suspiciously complete API surface all indicate AI generation.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.8, criticalThinking: 0.7, ethics: 0.2 },
  },

  // ============================================================
  // CODE — Human Written
  // ============================================================
  {
    id: 'adv-code-02',
    contentType: 'code',
    difficulty: 'advanced',
    title: 'Event Store (Production)',
    content: `class EventStore:
    """
    Append-only event store backed by Postgres.

    Uses advisory locks instead of version checks because we kept hitting
    deadlocks under high write concurrency on the version index.
    See: https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS
    """

    def __init__(self, pool, *, notify_channel="events"):
        self._pool = pool
        self._channel = notify_channel

    async def append(self, stream_id: str, events: list[Event]) -> int:
        lock_id = mmh3.hash(stream_id) & 0x7FFFFFFF  # positive int32
        async with self._pool.acquire() as conn:
            async with conn.transaction():
                await conn.execute("SELECT pg_advisory_xact_lock($1)", lock_id)

                last_ver = await conn.fetchval(
                    "SELECT COALESCE(MAX(version), -1) FROM events WHERE stream_id = $1",
                    stream_id
                )

                rows = []
                for i, evt in enumerate(events):
                    ver = last_ver + 1 + i
                    rows.append((stream_id, ver, evt.type,
                                 json.dumps(evt.data), evt.meta or {}))

                await conn.executemany(
                    """INSERT INTO events (stream_id, version, event_type, data, metadata)
                       VALUES ($1, $2, $3, $4, $5::jsonb)""",
                    rows
                )

                # LISTEN/NOTIFY instead of in-process handlers.
                # learned this the hard way — subscribers were holding txns open
                await conn.execute(
                    f"NOTIFY {self._channel}, $1",
                    json.dumps({"stream": stream_id, "count": len(events)})
                )

                return last_ver + len(events)`,
    isAI: false,
    humanSource: 'Staff engineer at fintech startup',
    markers: [
      {
        text: 'Uses advisory locks instead of version checks because we kept hitting\n    deadlocks under high write concurrency on the version index.',
        explanation: 'Documents a specific production problem and why the design diverges from the textbook approach. This is hard-won operational knowledge.',
        type: 'human-tell',
      },
      {
        text: 'lock_id = mmh3.hash(stream_id) & 0x7FFFFFFF  # positive int32',
        explanation: 'Using murmurhash3 for advisory lock IDs with a bitmask for positive integers shows real Postgres experience. AI would use simpler hashing.',
        type: 'human-tell',
      },
      {
        text: '# learned this the hard way — subscribers were holding txns open',
        explanation: 'A comment documenting a past mistake and its lesson. This kind of institutional knowledge comment is distinctly human.',
        type: 'human-tell',
      },
      {
        text: 'evt.meta or {}',
        explanation: 'Defensive coding against None metadata with a terse inline fallback. AI would add a validation step; humans add pragmatic guards.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This code is human-written. The advisory lock workaround for a real deadlock problem, the murmurhash trick, LISTEN/NOTIFY instead of in-process handlers (with a comment explaining the hard lesson), and pragmatic defensive coding all demonstrate real production experience.',
    skills: { prompting: 0.3, concepts: 0.6, tools: 0.8, criticalThinking: 0.7, ethics: 0.2 },
  },

  // ============================================================
  // SOCIAL MEDIA — AI Generated
  // ============================================================
  {
    id: 'adv-social-01',
    contentType: 'social-media',
    difficulty: 'advanced',
    title: 'Restaurant Review',
    imagePath: '/images/turing/adv-social-01.png',
    content: `Went to Noma's new pop-up in Kyoto last week. I've been thinking about it constantly since.

The omakase opened with what they're calling "forest floor" — a bed of dehydrated moss, fermented mushroom soil, and these impossibly thin crisps of pine bark that shatter on your tongue. It sounds pretentious. It tasted like a forest smells after rain, which I know also sounds pretentious, but there's no other way to describe it.

Third course was the most technically impressive thing I've eaten this year: a dashi made from katsuobushi that had been aged for three years, served in a ceramic bowl shaped like a stone from the Kamo River. The broth was so intensely umami it almost crossed into sweetness. I had to sit with it for a moment.

My one complaint — and it's minor — is that the pacing between courses 7 and 10 dragged. Our server mentioned they were adjusting to the new kitchen setup, which is fair for a pop-up, but there was a solid 25-minute gap that broke the rhythm.

Worth the trip. Worth the price. Not sure I'd say it surpasses the Copenhagen experience but it's a different conversation entirely. Different language, different grammar.`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'It tasted like a forest smells after rain, which I know also sounds pretentious, but there\'s no other way to describe it',
        explanation: 'Preemptive self-awareness about sounding pretentious is a technique AI uses to sound human. The meta-commentary feels calculated rather than genuine.',
        type: 'ai-tell',
      },
      {
        text: 'The broth was so intensely umami it almost crossed into sweetness. I had to sit with it for a moment.',
        explanation: 'Poetic food writing with a contemplative pause. The phrasing is beautiful but has the polished quality of food magazine writing that AI emulates.',
        type: 'ai-tell',
      },
      {
        text: 'Different language, different grammar',
        explanation: 'Ending with a metaphorical flourish comparing cuisine to language. AI tends to close with these literary-sounding observations.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This review is AI-generated. Despite the convincing food knowledge and casual tone, the pre-emptive self-awareness, uniformly polished prose, metaphorical conclusion, and the way every detail serves the narrative all indicate careful AI construction rather than spontaneous recollection.',
    skills: { prompting: 0.4, concepts: 0.5, tools: 0.1, criticalThinking: 0.8, ethics: 0.3 },
  },

  // ============================================================
  // SOCIAL MEDIA — Human Written
  // ============================================================
  {
    id: 'adv-social-02',
    contentType: 'social-media',
    difficulty: 'advanced',
    title: 'Fine Dining Review',
    imagePath: '/images/turing/adv-social-02.png',
    content: `Just back from Noma Kyoto and I have a lot of thoughts but first: if you're going, bring a jacket. The space is in a converted machiya and they keep the windows open for "atmosphere" which is lovely except it was 8°C and I was in a linen shirt like an idiot.

The food. OK. The forest floor course is going to get all the press and it deserves it but honestly the thing I can't stop thinking about is this tiny pickled radish they served around course 5? 6? I lost count. It was almost offensively simple — just a radish, some sort of plum vinegar, maybe yuzu? — but the texture was this perfect intersection of crisp and yielding that I've literally never experienced from a radish. My wife said "it's a radish" in this tone of voice that indicated she thought I was losing my mind.

The dashi course that everyone's raving about was phenomenal but I'll be honest I couldn't tell you exactly what made it different from the extraordinary dashi at Kikunoi where we ate the night before for 1/4 the price. Maybe that's my palate's limitation and not Noma's.

Big gap between course 7 and 8 (or was it 8 and 9). Long enough that I checked my phone, which at Noma feels like a federal crime.

Would I go again: probably not at this price point. Would I tell every person who loves food to go once: absolutely. It's an experience, not just a meal. But the machiya at Kikunoi was also an experience and my wallet didn't need therapy afterward.`,
    isAI: false,
    humanSource: 'Food blogger',
    markers: [
      {
        text: 'bring a jacket. The space is in a converted machiya and they keep the windows open for "atmosphere"',
        explanation: 'Practical, experience-based advice that has nothing to do with the food. Human reviewers share logistical details from real visits.',
        type: 'human-tell',
      },
      {
        text: 'My wife said "it\'s a radish" in this tone of voice that indicated she thought I was losing my mind',
        explanation: 'Quoting a specific companion\'s skeptical reaction. This kind of interpersonal detail is distinctly human.',
        type: 'human-tell',
      },
      {
        text: 'I couldn\'t tell you exactly what made it different from the extraordinary dashi at Kikunoi',
        explanation: 'Honest admission of palate limitations while still praising both restaurants. AI reviews don\'t typically undermine their own expertise.',
        type: 'human-tell',
      },
      {
        text: 'which at Noma feels like a federal crime',
        explanation: 'Hyperbolic humor about the social pressure of fine dining. This kind of self-conscious joke comes from real experience.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This review is human-written. The practical advice (bring a jacket), quoting a companion\'s reaction, honest palate limitations, uncertain course numbering, and price comparisons with another restaurant all indicate someone recounting a real experience.',
    skills: { prompting: 0.4, concepts: 0.5, tools: 0.1, criticalThinking: 0.8, ethics: 0.3 },
  },

  // ============================================================
  // CREATIVE WRITING — AI Generated
  // ============================================================
  {
    id: 'adv-creative-01',
    contentType: 'creative-writing',
    difficulty: 'advanced',
    title: 'Inheritance',
    content: `My father kept his important papers in a shoebox on the top shelf of the hall closet. Not a filing cabinet, not a safe — a Nike shoebox from sometime in the late '90s, the cardboard going soft at the corners. After he died, I stood on a kitchen chair to get it down and the first thing I found was my birth certificate, folded into thirds.

Underneath: his discharge papers from the Navy. A life insurance policy he'd let lapse in 2003. The deed to the house, which turned out to have a second mortgage I didn't know about. A photograph of a woman I'd never seen, standing in front of a church, with no writing on the back.

I sat on the hallway floor with the box in my lap and tried to construct my father from these documents the way an archaeologist reconstructs a civilization from pottery shards. But documents are the opposite of a person. They are the residue of a life, not the life itself. The space between "discharge papers" and "lapsed insurance policy" contains an entire human story that no piece of paper can tell.

The photograph bothered me the most. Not because I suspected anything — my parents' marriage had been solid, or at least it had appeared solid, which might be the same thing. It bothered me because it was a question I could never ask him. And I realized, sitting there, that death is not the absence of a person. It is the absence of the ability to ask them things. All the questions you didn't know you had.`,
    isAI: true,
    aiModel: 'Claude',
    markers: [
      {
        text: 'tried to construct my father from these documents the way an archaeologist reconstructs a civilization from pottery shards',
        explanation: 'An extended, perfectly crafted simile that feels more like a workshop exercise than organic thought. AI creative writing reaches for elaborate comparisons.',
        type: 'ai-tell',
      },
      {
        text: 'documents are the opposite of a person. They are the residue of a life, not the life itself',
        explanation: 'A philosophical observation stated with aphoristic precision. AI loves generating these quotable insights within narrative.',
        type: 'ai-tell',
      },
      {
        text: 'death is not the absence of a person. It is the absence of the ability to ask them things',
        explanation: 'Redefinition structure ("X is not Y, it is Z") used to end on a profound note. This is a common AI rhetorical pattern for emotional conclusions.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This prose is AI-generated. Despite the emotional depth and convincing personal details, the writing shows AI patterns: every paragraph escalates toward a philosophical insight, the similes are too perfectly crafted, and the conclusion uses a redefinition structure for maximum emotional impact.',
    skills: { prompting: 0.5, concepts: 0.5, tools: 0.1, criticalThinking: 0.7, ethics: 0.4 },
  },

  // ============================================================
  // CREATIVE WRITING — Human Written
  // ============================================================
  {
    id: 'adv-creative-02',
    contentType: 'creative-writing',
    difficulty: 'advanced',
    title: 'The Shoebox',
    content: `Dad kept everything in a Nike box on the hall closet shelf. I always knew it was there but I never opened it when he was alive because that felt like reading someone's diary, which I also did once (my sister's, age thirteen, and she still hasn't forgiven me).

The day after the funeral I pulled it down and sat on the hallway floor. On top was my birth certificate, which had a coffee ring on it. Under that, his Navy papers, which I'd seen before because he showed them to my fourth-grade class during Veterans Day and Tommy Huang cried because he thought the Navy meant my dad had killed people. Dad handled that with about as much grace as you'd expect, which is to say he turned red and changed the subject.

There was a life insurance policy that had lapsed. There was the deed to the house. There was a photograph of a woman standing in front of a church, and I sat there for a long time looking at it. I showed it to Mom and she said "Oh that's his Aunt Carol" and that was that. Kind of anticlimactic. I'd been building up a whole mystery in my head for the last fifteen minutes.

The deed turned out to be more interesting than the photograph because there was a second mortgage on the house I didn't know about, dated 2009, which explains why he never replaced the furnace even though the thing sounded like a helicopter taking off every time it kicked on. Some mysteries solve themselves, just not the ones you were hoping for.`,
    isAI: false,
    humanSource: 'Essay writer',
    markers: [
      {
        text: 'which I also did once (my sister\'s, age thirteen, and she still hasn\'t forgiven me)',
        explanation: 'A tangential parenthetical that has nothing to do with the main narrative. Human writers digress; AI stays on theme.',
        type: 'human-tell',
      },
      {
        text: 'Tommy Huang cried because he thought the Navy meant my dad had killed people',
        explanation: 'A specific named childhood memory with an unexpected, awkward detail. This kind of granular recall is distinctly human.',
        type: 'human-tell',
      },
      {
        text: 'she said "Oh that\'s his Aunt Carol" and that was that. Kind of anticlimactic.',
        explanation: 'The mystery is deflated immediately and acknowledged as anticlimactic. AI writing would mine the photograph for dramatic tension; humans accept mundane resolutions.',
        type: 'human-tell',
      },
      {
        text: 'the thing sounded like a helicopter taking off every time it kicked on',
        explanation: 'Specific, funny, non-literary simile grounded in real domestic experience. AI creative writing reaches for more "elegant" comparisons.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This prose is human-written. The tangential digressions (sister\'s diary, Tommy Huang), anticlimactic mystery resolution, non-literary comparisons (furnace like a helicopter), and the way revelations arrive mundanely rather than dramatically all indicate authentic human voice.',
    skills: { prompting: 0.5, concepts: 0.5, tools: 0.1, criticalThinking: 0.7, ethics: 0.4 },
  },

  // ============================================================
  // IMAGE — AI Generated
  // ============================================================
  {
    id: 'adv-image-01',
    contentType: 'image',
    difficulty: 'advanced',
    title: 'Documentary-Style Portrait',
    imagePath: '/images/turing/adv-image-01.png',
    imageDescription: `A photorealistic portrait in a documentary style of an elderly fisherman mending nets on a wooden dock. The image has a warm, desaturated color grade reminiscent of film photography. The man's face has deep wrinkles and weathered skin that looks remarkably natural at first glance. His hands are calloused and work-worn. However, on closer inspection: the net he's mending has an inconsistent weave pattern that shifts between diamond and square mesh in different parts of the image. The rope has a slightly "melted" quality where it overlaps his fingers. A boat in the background has text on the hull that's almost legible but dissolves into abstract shapes when viewed closely. The wood grain on the dock follows suspiciously uniform patterns. The man's left ear is slightly different in shape and size from his right, but in a way that looks more like a rendering error than natural asymmetry — the lobe seems to merge with his jaw.`,
    content: 'See image above.',
    isAI: true,
    aiModel: 'Midjourney v6',
    markers: [
      {
        text: 'net he\'s mending has an inconsistent weave pattern that shifts between diamond and square mesh',
        explanation: 'AI struggles with consistent repeating patterns across large areas of an image. The mesh inconsistency is a structural generation artifact.',
        type: 'ai-tell',
      },
      {
        text: 'rope has a slightly "melted" quality where it overlaps his fingers',
        explanation: 'Object intersections — where one object overlaps another — are a weakness in AI generation, often producing smeared or fused edges.',
        type: 'ai-tell',
      },
      {
        text: 'text on the hull that\'s almost legible but dissolves into abstract shapes',
        explanation: 'Near-legible text that falls apart on inspection is an advanced AI tell. Models are getting better at text but still fail at consistency.',
        type: 'ai-tell',
      },
      {
        text: 'wood grain on the dock follows suspiciously uniform patterns',
        explanation: 'AI-generated textures often tile or repeat in unnaturally regular ways, especially on surfaces like wood or fabric.',
        type: 'ai-tell',
      },
    ],
    explanation:
      'This image is AI-generated. Advanced models produce convincing overall compositions, but fine details reveal the truth: inconsistent net weave, melted rope-finger intersections, illegible text, and repeating wood grain patterns.',
    skills: { prompting: 0.4, concepts: 0.6, tools: 0.7, criticalThinking: 0.8, ethics: 0.4 },
  },

  // ============================================================
  // IMAGE — Human (Real Photo)
  // ============================================================
  {
    id: 'adv-image-02',
    contentType: 'image',
    difficulty: 'advanced',
    title: 'Portrait of a Fisherman',
    imagePath: '/images/turing/adv-image-02.png',
    imageDescription: `A documentary portrait of an older man sitting on an overturned plastic crate, mending fishing nets at a small harbor. Shot on what appears to be medium format film given the shallow depth of field and grain structure. The man's face is deeply tanned and lined, with one eye slightly more squinted than the other — likely from a lifetime of working in sun glare. His left hand has a visible scar across the knuckles and his wedding ring has worn a slight groove into his finger. The net he's working on has a genuine diamond mesh pattern with one section clearly newer than the rest — a patch job in brighter nylon. Behind him, a boat named "SANTA MARIA III" is painted in slightly uneven hand-lettered white paint. There's a plastic water bottle wedged between crates, a cigarette butt on the concrete, and a orange tabby cat sleeping on a coiled rope in the background. The image has a slight cyan cast in the shadows, typical of Kodak Portra film stock.`,
    content: 'See image above.',
    isAI: false,
    humanSource: 'Documentary photographer',
    markers: [
      {
        text: 'wedding ring has worn a slight groove into his finger',
        explanation: 'This kind of subtle physical detail comes from decades of wear and is something AI doesn\'t generate because it\'s not a standard "portrait" feature.',
        type: 'human-tell',
      },
      {
        text: 'one section clearly newer than the rest — a patch job in brighter nylon',
        explanation: 'Evidence of repair and aging that tells a story. Real objects show history through wear patterns; AI generates objects in one consistent state.',
        type: 'human-tell',
      },
      {
        text: 'SANTA MARIA III',
        explanation: 'Legible, consistent text that makes sense contextually. Real photographs capture real text accurately.',
        type: 'human-tell',
      },
      {
        text: 'slight cyan cast in the shadows, typical of Kodak Portra film stock',
        explanation: 'Specific film stock color characteristics are authentic photographic artifacts, not something AI models typically reproduce accurately.',
        type: 'human-tell',
      },
    ],
    explanation:
      'This is a real photograph. The ring groove worn into the finger, patched net in newer nylon, legible boat name, authentic film grain, and incidental details like the cat and water bottle all indicate a real scene captured on film.',
    skills: { prompting: 0.4, concepts: 0.6, tools: 0.7, criticalThinking: 0.8, ethics: 0.4 },
  },
];
