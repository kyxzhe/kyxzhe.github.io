"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Sparkles, Send } from "lucide-react";
import { cardVariants, textVariants } from "@/lib/animation/variants";
import ChatBotModal from "./ChatBotModal";

const previewMessages = [
  {
    role: "visitor",
    text: "Hey Kevin, what are you researching right now?",
  },
  {
    role: "kevin",
    text: "I’m mapping how information flows online and how to keep ML models robust in the wild.",
  },
  {
    role: "visitor",
    text: "Nice. Do you ever leave the lab?",
  },
  {
    role: "kevin",
    text: "Absolutely — film camera in hand, looking for a good flat white or the next trail run.",
  },
];

const interests = ["Trustworthy ML", "Misinformation", "Teaching", "Film Photography", "Coffee chats"];

export default function ChatIntroPanel() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <motion.div
      className="w-full lg:w-[40%] rounded-[20px] p-6 flex flex-col gap-4 glass-panel relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{
        background: "radial-gradient(circle at 20% 20%, rgba(232,206,194,0.25), transparent 50%), radial-gradient(circle at 80% 0%, rgba(102,156,70,0.25), transparent 45%)"
      }} />
      <div className="relative flex flex-col gap-4">
        <motion.div
          className="flex items-center justify-between"
          variants={textVariants}
          initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2">
          <span className="chip inline-flex items-center gap-2">
            <Sparkles size={12} />
            Chatbot
          </span>
          <span className="text-xs text-muted-foreground">coming soon</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </div>
      </motion.div>

      <div className="surface-card p-4 flex flex-col gap-3 min-h-[240px] overflow-hidden relative">
        <div className="space-y-2 text-sm">
          {previewMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[90%] rounded-2xl px-4 py-2 ${msg.role === "kevin" ? "bg-[var(--accent)] text-white ml-auto" : "bubble-muted"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="card-row text-sm text-muted-foreground">
          <MessageCircle size={16} />
          Ask me anything about research, coffee, or film cameras.
        </div>
      </div>

      <motion.div
        className="flex flex-wrap gap-2"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        {interests.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-col gap-2"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <button
          type="button"
          className="btn-primary inline-flex items-center justify-center gap-2"
          onClick={() => setIsChatOpen(true)}
        >
          <Send size={16} />
          Chat now
        </button>
        <p className="text-xs text-muted-foreground">
          I’m a PhD student at UTS working with Dr. Marian-Andrei Rizoiu in the Behavioral Data Science Lab.
          The chatbot will share stories about research, photography, and the best flat whites in Sydney soon.
        </p>
      </motion.div>
      </div>
      <ChatBotModal open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.div>
  );
}
