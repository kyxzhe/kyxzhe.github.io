"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircle, Sparkles, Send } from "lucide-react";
import { cardVariants, textVariants } from "@/lib/animation/variants";

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
  return (
    <motion.div
      className="w-full lg:w-[40%] bg-card rounded-[20px] p-6 flex flex-col gap-4 shadow-lg"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div
        className="flex items-center justify-between"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
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

      <div className="bg-background/20 rounded-[16px] border border-border/40 p-4 flex flex-col gap-3 min-h-[240px] overflow-hidden">
        <div className="space-y-2 text-sm">
          {previewMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[90%] rounded-2xl px-4 py-2 ${msg.role === "kevin" ? "bg-foreground text-background ml-auto" : "bg-background/70 text-foreground/80"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-background/40 rounded-full px-4 py-2 text-sm text-muted-foreground">
          <MessageCircle size={16} />
          Ask me anything about research, coffee, or film cameras.
        </div>
      </div>

      <motion.div
        className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        {interests.map((tag) => (
          <span key={tag} className="border border-border rounded-full px-3 py-1">
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
        <Link
          href="#contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-3 text-sm font-semibold transition hover:bg-foreground/80"
        >
          <Send size={16} />
          Say hi or book a chat
        </Link>
        <p className="text-xs text-muted-foreground">
          I’m a PhD student at UTS working with Dr. Marian-Andrei Rizoiu in the Behavioral Data Science Lab.
          The chatbot will share stories about research, photography, and the best flat whites in Sydney soon.
        </p>
      </motion.div>
    </motion.div>
  );
}
