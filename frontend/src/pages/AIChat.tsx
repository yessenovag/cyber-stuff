import { useState, useEffect } from "react";
import "./AIChat.css";
import robot from "../assets/robo.png";

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

export default function AIChat() {
  /* ===== STATE ===== */
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const saved = localStorage.getItem("cybersafe-chats");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              title: "New chat",
              messages: [
                {
                  role: "assistant",
                  content:
                    "Hi, I'm CyberSafe AI! Ask me anything about cybersecurity, phishing, malware or online safety.",
                },
              ],
            },
          ];
    } catch (error) {
      console.error("Error loading chats from localStorage:", error);
      return [
        {
          id: 1,
          title: "New chat",
          messages: [
            {
              role: "assistant",
              content:
                "Hi, I'm CyberSafe AI! Ask me anything about cybersecurity, phishing, malware or online safety.",
            },
          ],
        },
      ];
    }
  });

  const [activeChatId, setActiveChatId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("cybersafe-active-chat");
      const parsed = saved ? Number(saved) : 1;
      
      // Проверяем, существует ли чат с таким id
      const savedChats = localStorage.getItem("cybersafe-chats");
      if (savedChats) {
        const chatsArray: Chat[] = JSON.parse(savedChats);
        const chatExists = chatsArray.some(chat => chat.id === parsed);
        if (!chatExists && chatsArray.length > 0) {
          return chatsArray[0].id;
        }
      }
      
      return parsed;
    } catch (error) {
      console.error("Error loading active chat from localStorage:", error);
      return 1;
    }
  });

  const [input, setInput] = useState<string>("");
  const [search, setSearch] = useState("");

  /* ===== LOCALSTORAGE SAVE ===== */
  useEffect(() => {
    try {
      localStorage.setItem("cybersafe-chats", JSON.stringify(chats));
    } catch (error) {
      console.error("Error saving chats to localStorage:", error);
    }
  }, [chats]);

  useEffect(() => {
    try {
      localStorage.setItem("cybersafe-active-chat", String(activeChatId));
    } catch (error) {
      console.error("Error saving active chat to localStorage:", error);
    }
  }, [activeChatId]);

  /* ===== ACTIVE CHAT ===== */
  const activeChat = chats.find(chat => chat.id === activeChatId) || chats[0];

  useEffect(() => {
    // Если активный чат не найден, выбираем первый
    if (!chats.find(chat => chat.id === activeChatId) && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ===== SEND MESSAGE ===== */
  const autoRenameChat = (message: string) => {
    if (!message.trim()) return;
    
    const title = message
      .split(" ")
      .slice(0, 5)
      .join(" ")
      .substring(0, 50); // Ограничиваем длину
    
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId && 
        (chat.title === "New chat" || chat.title.startsWith("New chat"))
          ? { ...chat, title: title || "New chat" }
          : chat
      )
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };


    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );
    
    autoRenameChat(input);
    const userInput = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      setChats(prev =>
        prev.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "assistant", content: data.reply || "No response from AI." },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      
      setChats(prev =>
        prev.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content: "⚠️ Sorry, the AI service is temporarily unavailable. Please try again later.",
                  },
                ],
              }
            : chat
        )
      );
    }
  };

  const createNewChat = () => {
    const newChatId = Date.now();

    const newChat: Chat = {
      id: newChatId,
      title: "New chat",
      messages: [
        {
          role: "assistant",
          content: "Hi, I'm CyberSafe AI! Ask me anything about cybersecurity.",
        },
      ],
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setSearch(""); 
  };

  const deleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (chats.length <= 1) {
      alert("Cannot delete the last chat. Please create a new one first.");
      return;
    }
    
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    
    if (chatId === activeChatId && updatedChats.length > 0) {
      setActiveChatId(updatedChats[0].id);
    }
  };


  return (
    <div className="ai-layout">
      {}
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
                onClick={() => setActiveChatId(chat.id)}
              >
                <div className="chat-item-content">
                  <span className="chat-icon"></span>
                  <span className="chat-title" title={chat.title}>
                    {chat.title}
                  </span>
                </div>
                <button 
                  className="delete-chat-btn"
                  onClick={(e) => deleteChat(chat.id, e)}
                  title="Delete chat"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {}
        <div className="robot-container">
          <img src={robot} alt="CyberSafe AI Robot" />
          <p>AI Security Bot</p>
        </div>
      </aside>

      {}
      <main className="chat-container">
        <div className="chat-messages">
          {activeChat?.messages?.length > 0 ? (
            activeChat.messages.map((m, i) => (
              <div key={i} className={`message-row ${m.role}`}>
                <div className="message-bubble">{m.content}</div>
              </div>
            ))
          ) : (
            <div className="empty-chat">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about cybersecurity..."
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            disabled={!activeChat} 
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim() || !activeChat}
          >
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}