// Long-form articles + guides surfaced inside the in-app Library. Each entry
// is keyed by its `contentId` so the library cards in
// `src/data/content-library.ts` can resolve to a `/library/article/<slug>`
// route through this table.

export interface LibraryArticle {
  slug: string;
  contentId: string;
  title: string;
  excerpt: string;
  category: "body" | "mind" | "spirit";
  pillarSlug: string;
  readTime: string;
  kind: "article" | "guide";
  content: string;
}

export const LIBRARY_ARTICLES: LibraryArticle[] = [
  {
    slug: "thought-reset-technique",
    contentId: "content-thought-reset",
    title: "Mastering the Thought Reset Technique",
    excerpt:
      "Negative thought loops are one of the biggest barriers to transformation. A Vedic-inspired four-step technique for observing, interrupting, and redirecting unhelpful mental patterns.",
    category: "mind",
    pillarSlug: "thoughts-intention",
    readTime: "8 min read",
    kind: "article",
    content: `<p>If you have ever lain awake at 2 AM running the same conversation through your head for the seventh time, you have experienced what the Vedic tradition calls <em>vrittis</em> — turnings of the mind. Patanjali opens the <em>Yoga Sutras</em> with a single, almost mathematical definition of the path: <em>yogaḥ cittavṛtti-nirodhaḥ</em> — "Yoga is the cessation of the fluctuations of the mind" (1.2). Two and a half millennia later, neuroscientists who study what they call the default-mode network describe the same phenomenon: a self-referential mental engine that runs unbidden, generating loops of worry, regret, and rehearsal whenever you are not actively engaged.</p>

<p>The thought reset technique sits squarely at the intersection of those two traditions. It does not ask you to stop thinking — that is impossible, and the attempt usually amplifies the very thoughts you wanted to silence. Instead, it teaches you to notice a thought, name it, release it, and replace it. Four steps. Each step is rooted in a specific Vedic principle, and each is supported by a specific finding in modern cognitive science.</p>

<h2>Step 1 — Notice (sākṣī-bhāva)</h2>

<p>The first move is the most counterintuitive: do nothing. The instant you become aware of a negative thought loop — a worry, a self-criticism, a replay of an old argument — you do not try to suppress it. You watch it. The Upanishads call this <em>sākṣī-bhāva</em>, the state of the witness. The watcher is not the thought; the watcher is the consciousness in which the thought arises. The simple act of stepping back to observe a thought, rather than being inside it, reduces its emotional grip dramatically. Brain-imaging studies of long-term meditators show measurably reduced activity in the medial prefrontal cortex — the region most associated with rumination — when this witnessing stance is engaged.</p>

<h2>Step 2 — Name (vāk-śakti)</h2>

<p>Once you are watching the thought, give it a label. Three or four words is plenty. "Catastrophizing about the meeting." "Replaying what she said." "Comparing myself to him." The Vedic tradition holds <em>vāk</em>, speech, as one of the great creative powers — the same syllable that creates can, in the hands of the practitioner, contain. Cognitive-behavioral therapists rediscovered this principle in the 1960s and gave it the clunky name "affect labeling." A study from UCLA by Matthew Lieberman showed that simply naming an emotion in a single word reduces amygdala activity and shifts processing to the ventrolateral prefrontal cortex, where rational evaluation lives. The mystic and the neuroscientist agree: <em>what you can name, you can hold at arm's length.</em></p>

<h2>Step 3 — Release (vairāgya)</h2>

<p>Now you let the thought go — but with a specific posture. Patanjali's word is <em>vairāgya</em>, usually translated as non-attachment, though "uncoloring" is closer to the literal sense. You are not pushing the thought away (suppression rebounds), nor are you analyzing it further (which feeds it). You are exhaling it. A long, slow out-breath is the physical correlate. Try this: as you breathe out, mentally place the labeled thought on the breath and let the breath carry it past you. The point is not that the thought disappears — it may return five seconds later — but that you have shown your nervous system that you are not at war with it.</p>

<h2>Step 4 — Replace (saṅkalpa)</h2>

<p>The mind abhors a vacuum. If you release a thought without offering it something to do, it will return to the same groove within seconds. Vedic practice fills the gap with <em>saṅkalpa</em> — a short, present-tense, affirmative intention. Not "I will stop worrying," which still contains the word "worry" and the future tense the mind cannot act on. Instead: "I am steady." "I am here." "I trust this day." Pick one short Sankalpa and use it every time you complete the reset. Within a few weeks the mind learns the new route: noticing a negative thought triggers the labeled-release-Sankalpa sequence almost automatically. That is the neuroplasticity that the <em>Yoga Sutras</em> describe in 1.14 — practice (<em>abhyāsa</em>) performed consistently, over a long period, with reverence, becomes firm.</p>

<h2>Putting it together</h2>

<p>The reset takes about fifteen seconds when you are practiced. You will not be practiced for the first few weeks. Expect to forget. Expect the mind to push back. Expect days where every attempt feels mechanical. This is the work. The Bhagavad Gita (6.35) addresses Arjuna's same complaint — <em>"the mind is restless, turbulent, strong, and unyielding"</em> — with one of the most useful lines in the whole text: <em>"by practice, Arjuna, and by non-attachment, it can be restrained."</em> Two tools. The same two tools we are still using.</p>

<p>Pair this technique with the daily check-ins in your Thoughts and Intention pillar. Every catch is a win, even when the reset itself fails. The point is not to stop the thoughts — that goal will exhaust you. The point is to change your relationship to them, one fifteen-second cycle at a time, until the mind that used to lie awake at 2 AM has somewhere else to be.</p>`,
  },
  {
    slug: "gratitude-neuroscience-vedic",
    contentId: "content-gratitude",
    title: "The Neuroscience and Vedic Roots of Gratitude",
    excerpt:
      "Gratitude is both an ancient Vedic virtue and a scientifically validated practice. How regular gratitude rewires neural pathways, reduces cortisol, and aligns with the principle of Santosha.",
    category: "mind",
    pillarSlug: "gratitude",
    readTime: "10 min read",
    kind: "article",
    content: `<p>Gratitude is one of the few practices where ancient wisdom and contemporary neuroscience reach essentially the same conclusion: <em>the consistent cultivation of thankfulness changes the person who cultivates it.</em> The Vedic tradition has known this for millennia. The Yajurveda opens its evening recitations with the line "<em>tasmai sva ham namaḥ</em>" — "to that, I offer myself in gratitude" — and Patanjali names <em>santoṣa</em>, contentment, as one of the five <em>niyamas</em> a yogi commits to before attempting any deeper practice (<em>Yoga Sutras</em> 2.32). Modern research, beginning with the systematic gratitude studies of Robert Emmons at UC Davis in the early 2000s, has produced the same finding in the language of cortisol levels, prefrontal cortex activation, and self-reported well-being scores.</p>

<p>This article walks the bridge between the two — what the Rishis observed in stillness, and what the laboratory has measured in fMRI scanners.</p>

<h2>The Vedic concept: gratitude as alignment, not transaction</h2>

<p>The Sanskrit word usually translated as "gratitude" is <em>kṛtajñatā</em> — literally, "knowing what has been done for you." It is a noticing word more than a thanking word. The emphasis is not on the polite expression to the giver, but on the recognition by the receiver. The <em>Taittiriya Upanishad</em> (1.11.2) instructs the student leaving the teacher's home with one of the oldest commencement addresses in human literature: <em>"mātṛdevo bhava, pitṛdevo bhava, ācāryadevo bhava, atithidevo bhava"</em> — let your mother be a god to you, your father a god, your teacher a god, your guest a god. The injunction is not to perform thanks; it is to <em>see</em> the divinity in those who have shaped your life.</p>

<p>This framing matters. Gratitude in the Vedic sense is not a debt being acknowledged ("I owe you one") but a fundamental orientation toward reality ("everything is being given to me, continuously"). The breath you just took was not your achievement. The body that processed your last meal was not engineered by you. The language you are reading this article in was handed to you by your parents and a thousand teachers. <em>Kṛtajñatā</em> is the practice of remembering this — not as guilt, but as wonder.</p>

<h2>The neuroscience: gratitude as practice-induced plasticity</h2>

<p>In 2015, researchers at UCLA published an fMRI study in <em>NeuroImage</em> showing that subjects who maintained a daily gratitude journal for eight weeks showed measurable changes in the medial prefrontal cortex — the region responsible for understanding others' perspectives, decision-making, and emotional regulation. The changes persisted for months after the active practice ended. The brain had not just felt grateful during the journal sessions; it had become <em>structurally different.</em></p>

<p>This is the same mechanism the <em>Yoga Sutras</em> describe in 2.33 — <em>vitarka-bādhane pratipakṣa-bhāvanam</em> — "when negative thoughts arise, cultivate their opposite." Patanjali's claim that consistent counter-cultivation alters the substrate of the mind is now measurable. Three specific findings from contemporary gratitude research are worth holding on to:</p>

<p><strong>Cortisol reduction.</strong> A 2008 study by Emmons and McCullough found that participants who wrote weekly gratitude lists for ten weeks showed a 23 percent reduction in salivary cortisol. The stress hormone that erodes immune function and accelerates aging dropped substantially with no other intervention.</p>

<p><strong>Heart rate variability.</strong> Research from the HeartMath Institute has shown that even brief gratitude meditation increases heart rate variability — a key indicator of vagal tone and autonomic flexibility. The body literally moves into a more coherent, parasympathetic-dominant state when gratitude is held in awareness.</p>

<p><strong>Sleep architecture.</strong> A 2009 study in the <em>Journal of Psychosomatic Research</em> found that listing three things one was grateful for before sleep improved both sleep duration and sleep quality. The mind that goes to bed in <em>kṛtajñatā</em> falls into deeper non-REM cycles than the mind that goes to bed in rehearsal.</p>

<h2>The practice: three forms of gratitude</h2>

<p>The 10X Vedic Gratitude pillar invites you to practice gratitude in three distinct registers each day, because the tradition recognizes that each accesses a different layer of the psyche.</p>

<p><strong>Gratitude for a person.</strong> Each morning, bring to mind one person and the specific gift they have placed in your life. Not "my parents in general" — the actual moment your mother stayed up with you when you had a fever, the actual sentence your teacher said that you still live by. Specificity is the engine of feeling.</p>

<p><strong>Gratitude for a moment.</strong> Recall one moment from the past 24 hours that, in retrospect, you would not trade. The morning light on the kitchen counter. A laugh you shared. The smell of coffee. The Upanishads call the present moment <em>ananda</em> — bliss is the substance of reality when you are not running away from it.</p>

<p><strong>Gratitude for yourself.</strong> This is the hardest of the three for most practitioners. Name one thing you did in the past day that you respect. Not something grand — something honest. You showed up. You apologized. You finished the chapter. Western culture has so thoroughly conflated self-gratitude with arrogance that this practice can feel transgressive. It is not. The Bhagavad Gita is explicit (6.5): <em>"uddhared ātmanā ātmānaṁ"</em> — let one lift oneself by one's own self. Self-respect is not the enemy of humility; it is the soil in which it grows.</p>

<h2>The slow accumulation</h2>

<p>The Vedic and the scientific traditions converge on one practical point: the effect of gratitude is not in any single session. It is in the slow accumulation. The Mandala journey is 48 days for a reason — long enough for neural pathways to thicken, long enough for the new orientation to become the default. By day 48, most practitioners report that gratitude has stopped being a practice they perform and started being the lens through which they see the world. That is <em>santoṣa</em> — not the absence of difficulty, but the presence of a deeper "yes" underneath whatever is happening.</p>

<p>Five thousand years ago, a Rishi sat in a cave and noticed that the mind that lives in <em>kṛtajñatā</em> is a different mind. Last year, an fMRI machine in California confirmed it. The path from noticing to being remains, as it always has, daily, undramatic, and entirely up to you.</p>`,
  },
  {
    slug: "understanding-brahman",
    contentId: "content-brahman-connection",
    title: "Understanding Brahman: The Universal Consciousness",
    excerpt:
      "An accessible introduction to the Vedantic concept of Brahman — the infinite, unchanging reality that underlies all existence — and how to make daily contact with it through meditation and contemplation.",
    category: "spirit",
    pillarSlug: "brahman-connection",
    readTime: "14 min read",
    kind: "guide",
    content: `<p>Brahman is the most ambitious word in the Vedic vocabulary. It names the one reality that the Upanishadic sages believed underlies, pervades, and outlasts everything you can see, touch, name, or imagine. To say "I am studying Brahman" is, in the tradition, equivalent to saying "I am studying the ground of being itself." That sounds either grand or vague depending on where you are sitting. This guide is an attempt to make it neither — to walk patiently through what the word means, why the Rishis spent their lives investigating it, and what a daily practitioner in the 21st century can actually <em>do</em> with the concept.</p>

<h2>The literal meaning</h2>

<p>The Sanskrit root <em>bṛh</em> means "to expand," "to grow," "to swell beyond limit." Brahman is, etymologically, "that which expands without end." It is not a god in the personal sense — the personal forms of divinity (Vishnu, Shiva, Devi) are <em>īśvara</em>, the manifest face of Brahman. Brahman itself is impersonal, attributeless, beyond gender, beyond form. The <em>Mandukya Upanishad</em> describes it in four famous negations: <em>"adṛṣṭam, avyavahāryam, agrāhyam, alakṣaṇam"</em> — unseen, unmanifest, ungraspable, indefinable.</p>

<p>That sounds discouraging until you realize what the Rishis were doing. They were not refusing to describe Brahman because they were being mysterious. They were refusing because every description by its nature limits — and Brahman, by definition, is what is left when nothing is being limited. <em>Neti, neti</em> — "not this, not this" — is the most famous Upanishadic method. You point to anything finite and say <em>not this</em>. What remains, when you have negated everything, is Brahman.</p>

<h2>The four great statements</h2>

<p>The Upanishads contain four <em>mahāvākyas</em> — great statements — that crystallize the central Vedantic claim. They are worth holding in awareness as you read the rest of this guide, because every other concept downstream comes back to them.</p>

<p><em>Prajñānaṁ brahma</em> — "Consciousness is Brahman" (Aitareya Upanishad 3.3). Whatever is doing the knowing in you right now is, at its root, identical with the ultimate reality.</p>

<p><em>Ahaṁ brahmāsmi</em> — "I am Brahman" (Brihadaranyaka Upanishad 1.4.10). The deepest layer of your own being is not separate from the ground of being.</p>

<p><em>Tat tvam asi</em> — "That thou art" (Chandogya Upanishad 6.8.7). What you are looking for, you already are.</p>

<p><em>Ayam ātmā brahma</em> — "This Self is Brahman" (Mandukya Upanishad 1.2). The individual soul (<em>ātman</em>) and the universal absolute (<em>Brahman</em>) are not two.</p>

<p>These are not philosophical propositions to be argued for. In the tradition they are <em>upadeśa</em> — pointing instructions, given by a teacher to a prepared student at the right moment, intended to provoke direct recognition rather than belief.</p>

<h2>Why does this matter to a modern practitioner?</h2>

<p>It would be reasonable to read everything above and ask, fairly: <em>what does this have to do with my Tuesday?</em> The answer, in the Vedantic view, is everything. If you and the ultimate reality are not two, then every interaction in your day is, at some level, a conversation with Brahman through the disguise of a coworker, a child, a stranger. The 10X Vedic Brahman Connection pillar exists to make this less abstract — to give you specific, repeatable practices that move the realization from a sentence in a book to a felt sense in the body.</p>

<p>Three practical effects are worth naming:</p>

<p><strong>Diminished separation anxiety.</strong> Most psychological suffering is downstream of the feeling of being a small, separate, threatened self. The Vedantic claim is that this feeling is, technically, a misreading of the data. Sustained Brahman contemplation does not deny that you have a body, a name, a history — it relocates the center of identity behind those things. You still go to work; you are just no longer afraid that work might end you.</p>

<p><strong>Equanimity in success and failure.</strong> The Bhagavad Gita (2.48) puts it more directly than any other text: <em>"samatvaṁ yoga ucyate"</em> — "evenness of mind is called yoga." When you have made even tentative contact with the layer of you that does not change, the layer that does change becomes less frightening. You can lose and still be. You can win and still be.</p>

<p><strong>Deepened compassion.</strong> If <em>tat tvam asi</em>, then the person across from you is not other. The same consciousness that is reading this article is reading itself through them. The Rishis are insistent on this implication: realization without compassion is not realization. The <em>Isha Upanishad</em> opens with the line "<em>īśāvāsyam idaṁ sarvaṁ</em>" — "all this, whatever moves in the moving world, is enveloped by the Lord." Every face is a face of Brahman.</p>

<h2>How to actually practice</h2>

<p>The Vedantic path traditionally has four limbs — <em>śravaṇa</em> (hearing), <em>manana</em> (reflecting), <em>nididhyāsana</em> (sustained meditation), and <em>anubhava</em> (direct experience). A 21st-century practitioner can engage all four in twenty minutes a day.</p>

<p><strong>Hear.</strong> Each morning, read or listen to one verse from a Vedantic text — the Bhagavad Gita, an Upanishad, or a teacher in the lineage. Three minutes. Do not try to understand it intellectually; let the words wash over you. The <em>Brihadaranyaka</em> says simply, "let it be heard."</p>

<p><strong>Reflect.</strong> Sit with one phrase from what you read for another five minutes. Not analyzing — turning it over slowly, the way you turn a stone in your hand. "I am Brahman." What would have to be true for that to be true? What in your day today would change?</p>

<p><strong>Meditate.</strong> Then sit in silence for ten minutes. Not to achieve anything — to <em>not</em> achieve anything. The witness that has been listening and reflecting now turns its attention on itself. You are looking for the looker. The <em>Kena Upanishad</em> asks the only question that matters: <em>kena iṣitam patati preṣitam manaḥ</em> — "by whom directed does the mind fly?" The answer is not a thought. The answer is the silence under the question.</p>

<p><strong>Experience.</strong> Carry the silence into the day. The Vedantic claim is that after enough <em>nididhyāsana</em>, the silence does not stay on the cushion. It begins to follow you into the kitchen, the commute, the difficult conversation. That is <em>anubhava</em> — the direct knowing of Brahman as the substrate of every moment, not just the meditation moment.</p>

<h2>A note on doubt</h2>

<p>If most of this guide sounds either thrilling or implausible — that is the right response. Vedanta is not asking you to believe in a metaphysical claim on someone else's authority. It is offering a hypothesis and a method, and inviting you to test it on the only laboratory available, which is your own attention. The 48-day Mandala is not long enough to settle the question. It is long enough to begin asking it seriously.</p>

<p>The Rishis spent decades, sometimes lifetimes, in this inquiry. They handed us their conclusions in compressed Sanskrit so we would not have to start from scratch — but they also insisted that no one's realization can be borrowed. The work is yours. The reward, if the tradition is right, is also yours: a recognition that what you have been looking for, you already are.</p>`,
  },
];

export function getLibraryArticleByContentId(
  contentId: string,
): LibraryArticle | undefined {
  return LIBRARY_ARTICLES.find((a) => a.contentId === contentId);
}

export function getLibraryArticleBySlug(
  slug: string,
): LibraryArticle | undefined {
  return LIBRARY_ARTICLES.find((a) => a.slug === slug);
}
