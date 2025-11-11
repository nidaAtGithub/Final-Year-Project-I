import { useState, useEffect, FormEvent } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, User, Search, Bell, Trash2 } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface Chat {
  id: string;
  messages: Message[];
  title: string;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  const navItems = [
    { label: "Dashboard", icon: FileText, active: false },
    { label: "File FIR", icon: FileText },
    { label: "My FIRs", icon: FileText },
    { label: "Track Status", icon: Search },
    { label: "Notifications", icon: Bell },
    { label: "Profile", icon: User },
    { label: "AI Chatbot", icon: User, active: true },
  ];

  // Load chat history from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem("aiChatHistory");
    if (savedChats) setChatHistory(JSON.parse(savedChats));
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem("aiChatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8001/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage: Message = {
        sender: "bot",
        text: data.response || "Error: No response from AI",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const botMessage: Message = {
        sender: "bot",
        text: "Error: Could not get response.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const newChat: Chat = {
        id: Date.now().toString(),
        messages,
        title: messages[0]?.text.slice(0, 20) || "New Chat",
      };
      setChatHistory((prev) => [newChat, ...prev]);
    }
    setMessages([]);
    setInput("");
  };

  const handleLoadChat = (chat: Chat) => {
    setMessages(chat.messages);
  };

  // 🧹 Delete all chat history
  const handleDeleteAllChats = () => {
    if (confirm("Are you sure you want to delete all chat history?")) {
      setChatHistory([]);
      localStorage.removeItem("aiChatHistory");
    }
  };

  // 🗑 Delete a specific chat
  const handleDeleteChat = (chatId: string) => {
    const updatedChats = chatHistory.filter((chat) => chat.id !== chatId);
    setChatHistory(updatedChats);
  };

  return (
    <DashboardLayout role="citizen" navItems={navItems} title="Citizen Portal">
      <div className="flex gap-6 max-w-6xl mx-auto py-6">
        {/* Main Chat Area */}
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleNewChat}>
              + New Chat
            </Button>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>AI Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mb-4 max-h-[60vh] overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary/20 self-end"
                        : "bg-secondary/20 self-start"
                    }`}
                  >
                    <span className="text-sm">{msg.text}</span>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    Bot is typing...
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  placeholder="Type your question about FIR..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Chat History */}
        <div className="w-80">
          <Card className="border-border/50">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Chat History</CardTitle>
              {chatHistory.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-400 hover:bg-blue-50"
                  onClick={handleDeleteAllChats}
                >
                  <Trash2 className="w-4 h-4 mr-1 text-blue-600" /> Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {chatHistory.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No previous chats
                </p>
              )}
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="flex justify-between items-center gap-2"
                >
                  <Button
                    variant="outline"
                    className="flex-1 text-left truncate"
                    onClick={() => handleLoadChat(chat)}
                  >
                    {chat.title}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-blue-600 border-blue-400 hover:bg-blue-50"
                    onClick={() => handleDeleteChat(chat.id)}
                  >
                    <Trash2 className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIChatbot;
