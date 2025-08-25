// src/About.jsx
export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <h1>About PropScholar</h1>
        <p className="sub">Trading education. Shorts that teach. Tools that compound skills.</p>
      </section>

      <section className="about-grid">
        <div>
          <h2>What this is</h2>
          <p>PropScholar is a focused learning platform for traders—bite‑size videos, curated notes, and practical workflows.</p>
        </div>
        <div>
          <h2>How it helps</h2>
          <p>Learn faster with short formats, repeat key setups, and apply checklists directly in the market.</p>
        </div>
        <div>
          <h2>Roadmap</h2>
          <ul>
            <li>Creator uploads with hashing/dedup</li>
            <li>Topic tagging and search</li>
            <li>Email lessons and playbook PDFs</li>
          </ul>
        </div>
      </section>

      <section className="about-cta">
        <a className="btn-primary" href="/">{'Open Shorts Feed →'}</a>
      </section>
    </main>
  );
}
