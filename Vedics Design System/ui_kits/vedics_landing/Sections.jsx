// ===== Vedics.net umbrella landing — sections =====

const VNav = ({ scrolled }) => {
  const links = ['About', 'Sciences', 'Platforms', 'Why Vedics'];
  return (
    <nav className={'v-nav ' + (scrolled ? 'scrolled' : '')}>
      <a className="v-brand">Vedics</a>
      <ul className="v-links">
        {links.map(l => <li key={l}><a>{l}</a></li>)}
      </ul>
    </nav>
  );
};

const VHero = () => (
  <section className="v-hero">
    <div className="v-hero-bg" />
    <div className="v-hero-content">
      <span className="v-om">🕉️</span>
      <h1 className="v-hero-title">
        <ShimmerText>Vedics</ShimmerText>
      </h1>
      <p className="v-hero-subtitle">Ancient Wisdom · Modern Living</p>
      <p className="v-verse devanagari">"योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय"</p>
      <p className="v-verse-tr">Established in yoga, perform actions without attachment — Bhagavad Gita 2.48</p>
      <PrimaryCTA>Explore Our World ↓</PrimaryCTA>
    </div>

    <div className="v-platform-cards">
      <PlatformCard
        accent="transform" tag="Transform"
        logo={<img src="assets/10x-logo.jpg" alt="10X" className="circle" />}
        bg="linear-gradient(160deg, #1a0e05, #261408, #1a0e05)"
        title="10X Vedic Transform"
        desc="A 48-day guided journey through 11 Vedic pillars. Wake at Brahma Muhurta, practice Pranayama, follow Sattvic diet, chant mantras."
        features={[
          '48-day structured transformation',
          '11 daily Vedic practice pillars',
          'AI wellness chatbot guidance',
          'Karma points and streak tracking',
          '6 language support',
        ]}
        cta="Begin Your Journey →"
      />
      <PlatformCard
        accent="astro" tag="Astrology"
        logo={<img src="assets/astro-logo.png" alt="Astro Vedics" />}
        bg="linear-gradient(160deg, #08101a, #141f10, #08101a)"
        title="Astro Vedics"
        desc="Authentic Vedic astrology powered by AI. Generate your Kundli, explore Nakshatras, check Dasha periods, receive personalized remedies."
        features={[
          'Free birth chart (Kundli) generation',
          'Daily Panchang and horoscopes',
          'Compatibility matching',
          'Dasha period analysis',
          'Personalized remedies and mantras',
        ]}
        cta="Explore Your Stars →"
      />
      <PlatformCard
        accent="wellness" tag="Wellness"
        logo={<span className="emoji-icon">🌿</span>}
        bg="linear-gradient(160deg, #081a0e, #0f2614, #081a0e)"
        title="AyurVeda Living"
        desc="AI-powered Ayurvedic consultation and curated wellness products. Discover your Dosha, get personalized recommendations."
        features={[
          'AI Dosha analysis and consultation',
          '45+ curated Ayurvedic products',
          'Supplements, teas, oils, and rituals',
          'Safety checks for allergies',
          'Personalized wellness routines',
        ]}
        cta="Shop Wellness →"
      />
    </div>
  </section>
);

const PlatformCard = ({ accent, tag, logo, bg, title, desc, features, cta }) => (
  <a className={'v-platform v-platform-' + accent}>
    <div className="v-platform-logo" style={{ background: bg }}>
      {logo}
      <div className="v-platform-logo-fade" />
    </div>
    <div className="v-platform-body">
      <Tag accent={accent}>{tag}</Tag>
      <h3>{title}</h3>
      <p>{desc}</p>
      <ul>
        {features.map((f, i) => (
          <li key={i}><span className={'dot dot-' + accent} />{f}</li>
        ))}
      </ul>
      <span className={'v-platform-cta cta-' + accent}>{cta}</span>
    </div>
  </a>
);

const VAbout = () => (
  <section className="v-about v-section">
    <div className="v-container">
      <div className="v-about-grid">
        <div className="v-about-text">
          <Ornament glyph="✦ ✦ ✦" />
          <h2><GoldText>What is Vedics?</GoldText></h2>
          <p>
            <strong>Vedics.net</strong> is a living bridge between the ancient wisdom
            traditions of India and the intelligent technologies of today. We bring
            together <strong>Jyotish</strong> (Vedic astrology), <strong>Ayurveda</strong> (the
            science of life), and <strong>Yogic transformation</strong> — powered by
            artificial intelligence — to help you live in harmony with your nature.
          </p>
          <p>
            The word <strong>"Veda"</strong> means knowledge — not belief, not dogma — but
            direct, experiential understanding of the cosmos and your place within it.
          </p>
          <div className="v-stats">
            <Stat n="5,000+" l="Years of wisdom tradition" />
            <Stat n="11" l="Transformation pillars" />
            <Stat n="6" l="Languages supported" />
            <Stat n="AI" l="Powered guidance" />
          </div>
        </div>
        <div className="v-about-visual">
          <Pillar sans="आयुर्वेद · Ayurveda"
            text="The science of life and longevity — understanding your unique constitution (Prakriti) to achieve balance through food, herbs, and daily routines." />
          <Pillar sans="ज्योतिष · Jyotish"
            text="The science of light — reading the cosmic blueprint encoded at the moment of your birth to understand your karmic patterns and life purpose." />
          <Pillar sans="योग · Yoga"
            text="The science of union — systematic practices of breath, movement, meditation, and mantra to align body, mind, and spirit with higher consciousness." />
        </div>
      </div>
    </div>
  </section>
);

const Stat = ({ n, l }) => (
  <div className="v-stat-item">
    <span className="v-stat-n">{n}</span>
    <span className="v-stat-l">{l}</span>
  </div>
);
const Pillar = ({ sans, text }) => (
  <div className="v-pillar">
    <h4 className="devanagari">{sans}</h4>
    <p>{text}</p>
  </div>
);

const VSciences = () => {
  const sci = [
    { icon: '🔥', t: 'Transformation', s: 'परिवर्तन · Parivartan',
      p: 'The Vedic path of transformation is a structured, disciplined journey. Through the 11 pillars — from waking at Brahma Muhurta to Sattvic diet, pranayama, mantra, and selfless service — you systematically rewire your body, mind, and energy field over 48 days.',
      l: ['Wake before sunrise to harness cosmic energy', 'Sattvic food to purify body and mind', 'Pranayama to master life force', 'Meditation to connect with Brahman'] },
    { icon: '🌟', t: 'Astrology', s: 'ज्योतिष · Jyotish Shastra',
      p: 'Vedic astrology is far more than prediction — it is a mirror. Your birth chart (Kundli) maps the karmic imprints of past lives and reveals your Dharma in this one. Through Nakshatras, Dashas, and planetary transits, Jyotish illuminates the timing and nature of life\'s unfolding.',
      l: ['27 Nakshatras reveal personality and destiny', 'Dasha periods map life\'s chapters', 'Remedies through mantras, gems, and rituals', 'Compatibility analysis for relationships'] },
    { icon: '🌿', t: 'Wellness', s: 'आरोग्य · Arogya',
      p: 'Ayurveda sees each person as a unique combination of five elements expressed through three Doshas — Vata, Pitta, and Kapha. True wellness isn\'t one-size-fits-all. It\'s about understanding YOUR constitution and living in alignment with your nature.',
      l: ['Discover your Dosha (Vata, Pitta, Kapha)', 'AI-personalized herbal recommendations', '45+ authentic Ayurvedic products', 'Safety-checked for allergies and interactions'] },
  ];
  return (
    <section className="v-sciences v-section">
      <div className="v-container">
        <div className="v-section-head">
          <Ornament glyph="◇ ◇ ◇" />
          <h2><GoldText>The Three Vedic Sciences</GoldText></h2>
          <p>Each platform on Vedics.net is rooted in one of the three great Vedic sciences — interconnected paths to a life of purpose, health, and self-knowledge.</p>
        </div>
        <div className="v-science-cards">
          {sci.map((s, i) => (
            <div key={i} className={'v-science-card v-science-' + i}>
              <span className="v-science-icon">{s.icon}</span>
              <h3>{s.t}</h3>
              <span className="v-science-sans devanagari">{s.s}</span>
              <p>{s.p}</p>
              <ul>{s.l.map((li, j) => <li key={j}>{li}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VWhy = () => {
  const items = [
    { icon: '🧬', t: 'Personalized, Not Generic', p: 'Every recommendation is tailored to your unique constitution, birth chart, and goals — not cookie-cutter advice.' },
    { icon: '🤖', t: 'AI Meets Ancient Wisdom', p: 'We use artificial intelligence to make 5,000 years of Vedic knowledge accessible, interactive, and actionable for modern life.' },
    { icon: '🔗', t: 'Interconnected Sciences', p: 'Astrology, Ayurveda, and Yoga aren\'t separate — they\'re one unified system. Our platforms reflect this wholeness.' },
    { icon: '🌍', t: 'Multilingual Access', p: 'Available in English, Hindi, Tamil, Telugu, Kannada, and Malayalam — making Vedic wisdom accessible across India and beyond.' },
  ];
  return (
    <section className="v-why v-section">
      <div className="v-container">
        <div className="v-section-head">
          <Ornament glyph="◈ ◈ ◈" />
          <h2><GoldText>Why Vedics?</GoldText></h2>
        </div>
        <div className="v-why-grid">
          {items.map((it, i) => (
            <div key={i} className="v-why-item">
              <span className="v-why-icon">{it.icon}</span>
              <h4>{it.t}</h4>
              <p>{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VFooter = () => (
  <footer className="v-footer">
    <div className="v-footer-grid">
      <div>
        <h3 className="v-footer-brand">Vedics.net</h3>
        <p>Rooted in 5,000 years of tradition, powered by modern technology. Transforming lives through the timeless wisdom of the Vedas.</p>
      </div>
      <div className="v-footer-col">
        <h4>Platforms</h4>
        <a>10X Vedic Transform</a><a>Astro Vedics</a><a>AyurVeda Living</a>
      </div>
      <div className="v-footer-col">
        <h4>Sciences</h4>
        <a>Vedic Astrology</a><a>Ayurveda</a><a>Yoga & Transformation</a>
      </div>
      <div className="v-footer-col">
        <h4>Connect</h4>
        <a>Contact Us</a><a>Privacy Policy</a><a>Terms of Service</a><a>Disclaimer</a>
      </div>
    </div>
    <div className="v-footer-bottom">
      <span>© 2026 Vedics.net — All rights reserved</span>
      <span>Built with 🕉️ and AI</span>
    </div>
  </footer>
);

Object.assign(window, { VNav, VHero, VAbout, VSciences, VWhy, VFooter, PlatformCard });
