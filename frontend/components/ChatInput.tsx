import { useState } from "react";

interface Props {
  onSend: (msg: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex gap-2 p-4 bg-white border-t">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Skriv ett meddelande..."
        className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Skicka
      </button>
    </div>
  );
}

