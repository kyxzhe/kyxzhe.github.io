"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ArrowLeft,
  SendHorizonal,
  CalendarDays,
} from "lucide-react";
import {
  modalVariants,
  backdropVariants,
  textVariants,
  iconVariants,
} from "@/lib/animation/variants";
import { contactInfo } from "@/lib/constants/contact";
import { socials } from "@/lib/constants/socials";
import { generateAvailability } from "@/lib/constants/availability";
import { GoogleScholarIcon, OrcidIcon } from "@/components/icons/AcademicIcons";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const innerSwapVariants: Variants = {
  enter: { opacity: 0, x: 40 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [mode, setMode] = useState<"info" | "schedule">("info");
  const availability = useMemo(() => generateAvailability(new Date(), 12), []);
  const [selectedDate, setSelectedDate] = useState<string>(
    availability[0]?.dateISO ?? ""
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    note: "",
  });
  const [hasComposedEmail, setHasComposedEmail] = useState(false);

  const slotsForDate = useMemo(() => {
    return availability.find((day) => day.dateISO === selectedDate)?.slots ?? [];
  }, [availability, selectedDate]);

  const selectedSlot = slotsForDate.find((slot) => slot.id === selectedSlotId);

  const resetScheduler = () => {
    setMode("info");
    setSelectedDate(availability[0]?.dateISO ?? "");
    setSelectedSlotId(null);
    setFormValues({ name: "", email: "", note: "" });
    setHasComposedEmail(false);
  };

  const handleComposeEmail = () => {
    if (!selectedSlot || !formValues.name || !formValues.email) return;
    const dayMeta = availability.find((d) => d.dateISO === selectedDate);
    const subject = `Meeting request: ${selectedSlot.label} (${dayMeta?.displayLabel})`;
    const body = [
      `Hi Kevin,`,
      ``,
      `I'd like to reserve the slot ${dayMeta?.displayLabel} · ${selectedSlot.label}.`,
      ``,
      `Name: ${formValues.name}`,
      `Email: ${formValues.email}`,
      formValues.note ? `Notes: ${formValues.note}` : ``,
      ``,
      `Looking forward to chatting!`,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
    setHasComposedEmail(true);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => {
            onClose();
            resetScheduler();
          }}
        >
          <motion.div
            className="bg-card rounded-[20px] p-6 md:p-8 lg:p-12 border-3 border-accent w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              className="absolute top-6 right-6 p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors z-10"
              onClick={() => {
                onClose();
                resetScheduler();
              }}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <X size={24} className="text-foreground" />
            </motion.button>

            <motion.div
              className="text-center mb-8 md:mb-12"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium mb-3">
                {mode === "info" ? "Contact me" : "Reserve a slot"}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {mode === "info"
                  ? "Let’s work together and create something meaningful."
                  : "Pick a time, leave details, and we’ll send a crafted email draft."}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {mode === "info" ? (
                <motion.div
                  key="info"
                  variants={innerSwapVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8"
                    layout
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      className="flex items-center gap-4 p-4 rounded-lg bg-background/5 hover:bg-background/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => window.open(`mailto:${contactInfo.email}`)}
                    >
                      <motion.div variants={iconVariants} initial="hidden" animate="visible">
                        <Mail size={24} className="text-brand-accent" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-lg">Email</h3>
                        <p className="text-muted-foreground break-all">{contactInfo.email}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-4 p-4 rounded-lg bg-background/5 hover:bg-background/10 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => window.open(`tel:${contactInfo.phoneRaw}`)}
                    >
                      <motion.div variants={iconVariants} initial="hidden" animate="visible">
                        <Phone size={24} className="text-brand-accent" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-lg">Phone</h3>
                        <p className="text-muted-foreground">{contactInfo.phone}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-4 p-4 rounded-lg bg-background/5"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={iconVariants} initial="hidden" animate="visible">
                        <MapPin size={24} className="text-brand-accent" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-lg">Location</h3>
                        <p className="text-muted-foreground">{contactInfo.location}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-4 p-4 rounded-lg bg-background/5 hover:bg-background/10 transition-colors cursor-pointer"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setMode("schedule")}
                    >
                      <motion.div
                        className="w-11 h-11 rounded-full border border-green-500/40 bg-green-500/5 flex items-center justify-center"
                        variants={iconVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <CalendarDays size={20} className="text-green-500" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-lg">Availability</h3>
                        <p className="text-muted-foreground">
                          {contactInfo.availability} · Tap to reserve
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="border-t border-border pt-6"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h3 className="text-xl font-medium mb-4 text-center">Connect with me</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {[
                        {
                          label: "LinkedIn",
                          href: socials.linkedin,
                          icon: <Linkedin size={24} className="text-brand-accent" />,
                        },
                        {
                          label: "Google Scholar",
                          href: socials.googleScholar,
                          icon: <GoogleScholarIcon className="w-6 h-6" />,
                        },
                        {
                          label: "ORCID",
                          href: socials.orcid,
                          icon: <OrcidIcon className="w-6 h-6" />,
                        },
                        {
                          label: "GitHub",
                          href: socials.github,
                          icon: <Github size={24} className="text-brand-accent" />,
                        },
                      ].map(({ icon, href, label }) => (
                        <motion.a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                        >
                          {icon}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="schedule"
                  variants={innerSwapVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <motion.div
                    className="flex flex-col gap-6"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setMode("info")}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-background/10 transition-colors"
                        >
                          <ArrowLeft size={16} />
                          Back
                        </button>
                      </div>
                      {hasComposedEmail && (
                        <span className="text-xs uppercase tracking-[0.3em] text-green-500">
                          Draft prepared — check your email client
                        </span>
                      )}
                    </div>

                    <div className="bg-background/5 rounded-[20px] p-4">
                      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-2">
                        Choose a date
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availability.map((day) => (
                          <button
                            key={day.dateISO}
                            onClick={() => {
                              setSelectedDate(day.dateISO);
                              setSelectedSlotId(null);
                            }}
                            className={`px-4 py-2 rounded-full text-sm transition-colors border ${
                              selectedDate === day.dateISO
                                ? "bg-foreground text-background border-foreground"
                                : "border-border hover:bg-background/10"
                            }`}
                          >
                            {day.displayLabel}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {slotsForDate.map((slot) => (
                        <button
                          key={slot.id}
                          disabled={slot.booked}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`rounded-[16px] border px-4 py-4 text-left transition-colors ${
                            slot.booked
                              ? "border-border/30 text-muted-foreground cursor-not-allowed line-through"
                              : selectedSlotId === slot.id
                                ? "border-brand-accent bg-brand-accent/10"
                                : "border-border hover:bg-background/10"
                          }`}
                        >
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Meeting
                          </p>
                          <p className="text-lg font-medium">{slot.label}</p>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-muted-foreground">Your name</label>
                        <input
                          type="text"
                          value={formValues.name}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                          className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                          placeholder="Ada Lovelace"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-muted-foreground">Contact email</label>
                        <input
                          type="email"
                          value={formValues.email}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                          className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-muted-foreground">Notes (optional)</label>
                      <textarea
                        value={formValues.note}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, note: e.target.value }))}
                        rows={3}
                        className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                        placeholder="Share context, collaborators, or agenda."
                      />
                    </div>

                    <button
                      onClick={handleComposeEmail}
                      disabled={!selectedSlot || !formValues.name || !formValues.email}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors bg-foreground text-background disabled:bg-foreground/40 disabled:text-background/40"
                    >
                      <SendHorizonal size={18} />
                      Compose email draft
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
