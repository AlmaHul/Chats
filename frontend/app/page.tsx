"use client";

import { useState, useEffect } from "react";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

export default function ChatPage() {
  const [bot, setBot] = useState("therapist");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  // Första meddelanden per bottype
  const initialBotMessages: Record<string, string> = {
    therapist: "Hej! Jag är din terapeutiska samtalspartner. Vad har du på hjärtat idag?",
    friend: "Tjena! Jag finns här som en kompis att snacka med 😊",
    practical_helper: "Jag är din praktiska medhjälpare! Vad behöver du hjälp att lösa?",
    advisor: 'Här kan du be om råd för dina vardagsproblem – jag hjälper gärna! 📜',
  };

  // När bot-typen ändras, lägg till välkomstmeddelande
  useEffect(() => {
    setMessages([{ sender: "bot", text: initialBotMessages[bot] }]);
  }, [bot]);

  const sendMessage = async (msg: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);

    try {
      const res = await fetch(`http::5000/chat?bot=${bot}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Något gick fel med servern." },
      ]);
    }
  };

  const botOptions = [
    { id: "therapist", label: "Terapeut", emoji: "🛋️" },
    { id: "friend", label: "Kompis", emoji: "👯‍♀️" },
    { id: "practical_helper", label: "Praktisk Medhjälpare", emoji: "🛠️" },
    { id: "advisor", label: "Livsrådgivare", emoji: "📜" },
  ];

  return (
    <div className="flex justify-center py-10 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl border-4 border-blue-600 rounded-xl p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Din Ultimata Vardagshjälp
        </h1>

        {/* Bot-knappar */}
        <div className="flex justify-center gap-3 mb-7 flex-wrap">
          {botOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setBot(option.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
                bot === option.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-700 border border-blue-600 hover:bg-blue-50"
              }`}
            >
              <span>{option.emoji}</span> {option.label}
            </button>
          ))}
        </div>

        {/* Chat fönster */}
        <div className="flex-1 bg-white shadow-inner rounded-lg p-4 h-[60vh] overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} sender={msg.sender as any} text={msg.text} />
          ))}
        </div>

        {/* Chat input */}
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}



