"use client";

import { motion } from "motion/react";
import { MessageCircle, Sparkles, Send } from "lucide-react";
import { cardVariants, textVariants } from "@/lib/animation/variants";

const previewMessages = [
  {
    role: "visitor",
    text: "What’s on your desk this week?",
  },
  {
    role: "kevin",
    text: "Diffusion traces from X, Reddit, and YouTube—seeing how ranking nudges change who hears what.",
  },
  {
    role: "visitor",
    text: "And how do you keep the models honest with all that noisy data?",
  },
  {
    role: "kevin",
    text: "Treat the noise as signal: rewrite instances, surface disagreements, and reweight what we trust.",
  },
];

const interests = ["Information diffusion", "Robust ML", "Social data science", "Teaching", "Film photography", "Coffee walks"];

export default function ChatIntroPanel() {
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
          <span className="text-xs text-muted-foreground">lab notes alpha</span>
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
          className="btn-primary inline-flex items-center justify-center gap-2 cursor-default"
        >
          <Send size={16} />
          Ask about research ideas
        </button>
        <p className="text-xs text-muted-foreground">
          I’m a PhD student at UTS working with Marian-Andrei Rizoiu in the Behavioural Data Science Lab.
          This assistant shares ongoing diffusion experiments, messy-label tricks, and the best cafes to debrief in.
        </p>
      </motion.div>
      </div>
    </motion.div>
  );
}
