import { useState, useEffect, useRef } from "react";
import "./AIChat.css";
import robot from "../assets/robo.png";
import { useAuth } from "../context/AuthContext";

/* ===== TYPES ===== */
type Message = {
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

/* ===== QUICK REPLIES ===== */
const QUICK_REPLIES = [
  "What is phishing?",
  "How to create a strong password?",
  "What is malware?",
  "How to stay safe online?",
  "What is two-factor authentication?",
  "How to detect a virus?",
];

/* ===== FEEDBACK MODAL ===== */
function FeedbackModal({ onClose, token }: { onClose: () => void; token: string | null }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const submitFeedback = async () => {
    if (!rating) return;
    try {
      await fetch("http://localhost:4000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ rating, comment }),
      });
      setSent(true);
      setTimeout(onClose, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="feedback-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={e => e.stopPropagation()}>
        {sent ? (
          <div className="feedback-success">
            <span>✅</span>
            <p>Thanks for your feedback!</p>
          </div>
        ) : (
          <>
            <h3>Rate CyberSafe AI</h3>
            <p>How was your experience?</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  className={`star ${s <= rating ? "active" : ""}`}
                  onClick={() => setRating(s)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              placeholder="Any comments? (optional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />
            <div className="feedback-actions">
              <button className="feedback-cancel" onClick={onClose}>Cancel</button>
              <button
                className="feedback-submit"
                onClick={submitFeedback}
                disabled={!rating}
              >
                Send Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ===== MAIN COMPONENT ===== */
export default function AIChat() {
  const { token } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ===== LOAD CHATS FROM DB ===== */
  useEffect(() => {
    if (!token) {
      setInitializing(false);
      return;
    }

    fetch("http://localhost:4000/api/chats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(async (dbChats: { id: number; title: string }[]) => {
        if (dbChats.length === 0) {
          // Create first chat
          const res = await fetch("http://localhost:4000/api/chats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: "New chat" }),
          });
          const newChat = await res.json();
          setChats([{ id: newChat.id, title: "New chat", messages: [WELCOME_MSG()] }]);
          setActiveChatId(newChat.id);
        } else {
          // Load messages for first chat
          const firstChat = dbChats[0];
          const msgs = await loadMessages(firstChat.id);
          setChats(
            dbChats.map((c, i) => ({
              id: c.id,
              title: c.title,
              messages: i === 0 ? msgs : [],
            }))
          );
          setActiveChatId(firstChat.id);
        }
        setInitializing(false);
      })
      .catch(() => setInitializing(false));
  }, [token]);

  const WELCOME_MSG = (): Message => ({
    role: "assistant",
    content: "Hi, I'm CyberSafe AI! Ask me anything about cybersecurity, phishing, malware or online safety.",
  });

  const loadMessages = async (chatId: number): Promise<Message[]> => {
    if (!token) return [WELCOME_MSG()];
    try {
      const res = await fetch(`http://localhost:4000/api/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const msgs: Message[] = await res.json();
      return msgs.length > 0 ? msgs : [WELCOME_MSG()];
    } catch (err: any) {
      return [WELCOME_MSG()];
    }
  };

  /* ===== SWITCH CHAT ===== */
  const switchChat = async (chatId: number) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    // Load messages if not loaded yet
    if (chat.messages.length === 0) {
      const msgs = await loadMessages(chatId);
      setChats(prev =>
        prev.map(c => (c.id === chatId ? { ...c, messages: msgs } : c))
      );
    }
    setActiveChatId(chatId);
  };

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId]);

  /* ===== ACTIVE CHAT ===== */
  const activeChat = chats.find(c => c.id === activeChatId);
  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ===== SEND MESSAGE ===== */
  const sendMessage = async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || !activeChatId) return;

    const userMessage: Message = { role: "user", content: msgText };

    // Rename chat if default
    const isDefault =
      activeChat?.title === "New chat" ||
      activeChat?.messages.filter(m => m.role === "user").length === 0;

    const newTitle = isDefault
      ? msgText.split(" ").slice(0, 5).join(" ").substring(0, 50)
      : undefined;

    setChats(prev =>
      prev.map(c =>
        c.id === activeChatId
          ? {
              ...c,
              title: newTitle || c.title,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    );
    setInput("");
    setLoading(true);

    // Save user message to DB
    if (token) {
      fetch(`http://localhost:4000/api/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "user", content: msgText }),
      });

      // Rename chat in DB
      if (newTitle) {
        fetch(`http://localhost:4000/api/chats/${activeChatId}/title`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle }),
        });
      }
    }

    try {
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: msgText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }
      const data = await res.json();
      const reply = data.reply || "No response from AI.";

      setChats(prev =>
        prev.map(c =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, { role: "assistant", content: reply }] }
            : c
        )
      );

      // Save assistant reply to DB
      if (token) {
        fetch(`http://localhost:4000/api/chats/${activeChatId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: "assistant", content: reply }),
        });
      }
    } catch (err: any) {
      setChats(prev =>
        prev.map(c =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "assistant", content: `⚠️ ${err.message}` },
                ],
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===== CREATE CHAT ===== */
  const createNewChat = async () => {
    if (!token) return;
    const res = await fetch("http://localhost:4000/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "New chat" }),
    });
    const newChat = await res.json();
    setChats(prev => [{ id: newChat.id, title: "New chat", messages: [WELCOME_MSG()] }, ...prev]);
    setActiveChatId(newChat.id);
    setSearch("");
  };

  /* ===== DELETE CHAT ===== */
  const deleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chats.length <= 1) {
      alert("Cannot delete the last chat.");
      return;
    }
    if (token) {
      await fetch(`http://localhost:4000/api/chats/${chatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    const updated = chats.filter(c => c.id !== chatId);
    setChats(updated);
    if (chatId === activeChatId) setActiveChatId(updated[0]?.id ?? null);
  };

  /* ===== RENDER ===== */
  if (initializing) {
    return (
      <div className="ai-layout">
        <div className="ai-loading">
          <div className="ai-spinner" />
          <p>Loading your chats...</p>
        </div>
      </div>
    );
  }

  const showQuickReplies =
    activeChat &&
    activeChat.messages.filter(m => m.role === "user").length === 0;

  return (
    <div className="ai-layout">
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} token={token} />
      )}

      {/* SIDEBAR */}
      <aside className="ai-sidebar">
        <div className="sidebar-header">
          <h3>🛡 CyberSafe AI</h3>
          <span>Your security assistant</span>
        </div>

        <button className="new-chat-btn" onClick={createNewChat}>
          + New chat
        </button>

        <input
          className="chat-search"
          placeholder="Search chats..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="chat-history">
          {filteredChats.length === 0 ? (
            <div className="no-chats">No chats found</div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
                onClick={() => switchChat(chat.id)}
              >
                <div className="chat-item-content">
                  <span className="chat-icon">💬</span>
                  <span className="chat-title" title={chat.title}>
                    {chat.title}
                  </span>
                </div>
                <button
                  className="delete-chat-btn"
                  onClick={e => deleteChat(chat.id, e)}
                  title="Delete chat"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* FEEDBACK BUTTON */}
        <button className="feedback-btn" onClick={() => setShowFeedback(true)}>
          ⭐ Rate this app
        </button>

        <div className="robot-container">
          <img src={robot} alt="CyberSafe AI Robot" />
          <p>AI Security Bot</p>
        </div>
      </aside>

      {/* CHAT MAIN */}
      <main className="chat-container">
        <div className="chat-messages">
          {activeChat?.messages.map((m, i) => (
            <div key={i} className={`message-row ${m.role}`}>
              <div className="message-bubble">{m.content}</div>
            </div>
          ))}

          {/* QUICK REPLIES */}
          {showQuickReplies && (
            <div className="quick-replies">
              <p className="quick-replies-label">Quick questions:</p>
              <div className="quick-replies-grid">
                {QUICK_REPLIES.map(q => (
                  <button
                    key={q}
                    className="quick-reply-btn"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LOADING INDICATOR */}
          {loading && (
            <div className="message-row assistant">
              <div className="message-bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about cybersecurity..."
            onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
            disabled={loading}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}>
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}