import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import robot from "../assets/robot.png";


export default function Welcome() {
  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="logo">🛡 CyberSafe</div> 
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#impact">Impact</a>
          <a href="#assistant">Assistant</a>
          <a href="#audience">Audience</a>
          <a href="#features">Features</a>
    
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">AI Cybersecurity Platform</span>

          <h1>
            Protect yourself <br />
            in the digital world
          </h1>

          <p>
            Learn how real cyber attacks work, detect threats,
            and build secure digital habits with AI-powered guidance.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-ghost">
              Login
            </Link>
          </div>
        </motion.div>
        
        {/* VISUAL */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img src={robot} alt="AI Robot" className="hero-robot" />
          <div className="voice-waves">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>


          <div className="grid-bg" />
          <div className="glow orb-1" />
          <div className="glow orb-2" />
        </motion.div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="impact">
        <motion.div
          className="impact-content"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>CyberSafe Security Impact</h2>
          <p className="impact-subtitle">
            Our platform helps users build real-world cybersecurity awareness
            through AI-driven training and threat analysis.
          </p>

          <div className="impact-grid">
            {[
              ["95%", "Threat Recognition Accuracy"],
              ["3x", "Faster Incident Understanding"],
              ["24/7", "AI Security Assistance"],
              ["100%", "Educational Focus"]
            ].map(([value, label], i) => (
              <motion.div
                key={i}
                className="impact-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3>{value}</h3>
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ASSISTANT */}
      <section id="assistant" className="assistant-preview">
        <div className="assistant-content">
          <div className="assistant-text">
            <h2>AI Security Assistant</h2>
            <p>
              CyberSafe includes an intelligent AI assistant that helps users understand
              cyber threats, analyze risks, and learn how to stay protected online.
            </p>

            <ul>
              <li>Instant explanations of cyber attacks</li>
              <li>Real-time security recommendations</li>
              <li>Threat analysis and risk insights</li>
              <li>Educational cybersecurity guidance</li>
            </ul>
          </div>

          <div className="assistant-ui">
            <div className="chat-window">
              <div className="chat-message user">
                What is phishing?
              </div>
              <div className="chat-message ai">
                Phishing is a social engineering attack where attackers try to steal
                sensitive information by pretending to be a trusted entity.
              </div>
              <div className="chat-message user">
                How can I protect myself?
              </div>
              <div className="chat-message ai">
                Use strong passwords, verify links, and avoid sharing personal data.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="audience" className="audience">
        <div className="audience-content">
          <h2>Who is CyberSafe for?</h2>
          <p className="audience-subtitle">
            CyberSafe is designed for different user groups who want to improve their
            cybersecurity awareness and digital safety skills.
          </p>

          <div className="audience-grid">
            <div className="audience-item">
              <h4>Students</h4>
              <p>Learn cybersecurity fundamentals and real-world attack scenarios.</p>
            </div>

            <div className="audience-item">
              <h4>Professionals</h4>
              <p>Improve threat awareness and digital protection skills.</p>
            </div>

            <div className="audience-item">
              <h4>IT Beginners</h4>
              <p>Understand common cyber threats and how to prevent them.</p>
            </div>

            <div className="audience-item">
              <h4>Organizations</h4>
              <p>Train employees to recognize and avoid cyber attacks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        {[
          {
            title: "Phishing & Social Engineering",
            text: "Understand how attackers manipulate users and steal data.",
          },
          {
            title: "Malware & Password Attacks",
            text: "Learn how malware spreads and how weak passwords are exploited.",
          },
          {
            title: "AI Security Assistant",
            text: "Get real-time explanations and security tips powered by AI.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            className="feature-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </motion.div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 CyberSafe · Educational Cybersecurity Platform
      </footer>
    </>
  );
}
