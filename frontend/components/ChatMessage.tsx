interface Props {
  sender: "user" | "bot";
  text: string;
}

export default function ChatMessage({ sender, text }: Props) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-lg ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

