import { useNavigate, Link } from "react-router-dom";
import BackendStatus from "../components/BackendStatus";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

const industryData = {
  healthcare: {
    title: "Most Common Cyber Threats",
    text: "Phishing remains the most common cyber threat, with over 90% of attacks starting from deceptive emails that trick users into sharing sensitive information. Malware can silently monitor activity and steal data, while ransomware encrypts files and demands payment, often targeting hospitals and universities. Social engineering relies on psychological manipulation rather than technical skills, and DDoS attacks overwhelm websites with traffic, making online services unavailable."
  },
  manufacturing: {
    title: "Who Is Most at Risk",
    text: "Students, employees, seniors, children, and small businesses are among the most vulnerable groups. Students often use weak passwords and public Wi-Fi, employees may fall for realistic phishing messages, seniors tend to trust fake calls and emails, children are exposed through games and social platforms, and small businesses frequently lack proper cybersecurity strategies."
  },
  finance: {
    title: "Types of Cyber Incidents",
    text: "Cyber incidents include data breaches exposing personal information, financial fraud through fake websites and messages, identity theft where criminals misuse stolen data, system hacking of servers and smart devices, and account takeovers that give attackers full control over online profiles."
  },
  government: {
    title: "Digital Safety Topics",
    text: "Digital safety focuses on protecting personal data, avoiding online scams, keeping children safe on the internet, securing social media accounts, and ensuring safe online shopping, as fraudulent platforms often look nearly identical to legitimate ones."
  },
  transport: {
    title: "Cyber Risk Levels",
    text: "Cyber risk ranges from low risk with strong passwords and two-factor authentication, to medium risk caused by outdated software, high risk from unsafe online behavior such as public Wi-Fi use, and critical risk involving confirmed phishing attacks or data leaks."
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<keyof typeof industryData | null>(null);

  return (
    <div className="dashboard-new">

      {/* HEADER */}
      <header className="dashboard-top">
        <div className="brand">
          <span className="logo">🛡 CyberSafe</span>
          <span className="user-email">{user?.email}</span>
        </div>

        <div className="dashboard-actions">
          <BackendStatus />
          <Link to="/profile" className="profile-btn">Profile</Link>
        </div>
      </header>


      {/* HERO */}
      <motion.section
        className="dashboard-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Protect your digital life with AI</h1>

        <p>
          Learn how to avoid cyber threats, secure your accounts,
          and build safe online habits with CyberSafe.
        </p>

        <button
          onClick={() => navigate("/AIChat")}
          className="hero-btn"
        >
          Ask AI Assistant →
        </button>
      </motion.section>


      {/* INDUSTRY INSIGHTS */}
      <section className="industry-section">
        <h2>Cybersecurity Insights</h2>
        <p className="industry-subtitle">
          Learn which sectors are most affected by cyber attacks.
        </p>

        <div className="industry-grid">
          <div onClick={() => setSelected("healthcare")} className="industry-card">Most Common Cyber Threats</div>
          <div onClick={() => setSelected("manufacturing")} className="industry-card">Who Is Most at Risk</div>
          <div onClick={() => setSelected("finance")} className="industry-card">Types of Cyber Incidents</div>
          <div onClick={() => setSelected("government")} className="industry-card">Digital Safety Topics</div>
          <div onClick={() => setSelected("transport")} className="industry-card">Cyber Risk Levels</div>
        </div>

        {selected && (
          <motion.div 
            className="industry-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>{industryData[selected].title}</h3>
            <p>{industryData[selected].text}</p>
          </motion.div>
        )}
      </section>

      {/* ONBOARDING */}
      <section className="dashboard-onboarding">
        <h2>Recommended first steps</h2>
        <ul>
          <li>✔ Complete your profile information</li>
          <li>✔ Learn how to secure your passwords</li>
          <li>✔ Understand phishing attacks</li>
          <li>✔ Explore the AI assistant</li>
        </ul>
      </section>

    </div>
  );
}
