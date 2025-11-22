"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  Check,
  Loader2,
  AlertCircle,
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
import { OrcidIconColor } from "@/components/icons/AcademicIcons";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  startInSchedule?: boolean;
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

export default function ContactModal({ isOpen, onClose, startInSchedule }: ContactModalProps) {
  const [mode, setMode] = useState<"info" | "schedule">(startInSchedule ? "schedule" : "info");
  const availability = useMemo(() => generateAvailability(new Date(), 30), []);
  const WINDOW_SIZE = 5;
  const [windowStart, setWindowStart] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    availability[0]?.dateISO ?? ""
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    note: "",
  });
  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email),
    [formValues.email]
  );
  const [submissionState, setSubmissionState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [celebrate, setCelebrate] = useState(false);
  const particles = useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 30 + Math.random() * 80;
        const xStart = (Math.random() - 0.5) * 360; // spread across panel width
        const yStart = (Math.random() - 0.5) * 120; // spread across panel height
        return {
          xStart,
          yStart,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          delay: Math.random() * 0.35 + i * 0.0015,
          size: 3.5 + Math.random() * 5,
          duration: 2 + Math.random() * 1.5,
        };
      }),
    []
  );
  const [bookedSlots, setBookedSlots] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    availability.forEach((day) =>
      day.slots.forEach((slot) => {
        if (slot.booked) initial[slot.id] = true;
      })
    );
    return initial;
  });

  const visibleDays = availability.slice(windowStart, windowStart + WINDOW_SIZE);
  const maxWindowIndex = Math.max(0, availability.length - WINDOW_SIZE);

  const slotsForDate = useMemo(() => {
    return (
      availability
        .find((day) => day.dateISO === selectedDate)
        ?.slots.map((slot) => ({
          ...slot,
          booked: slot.booked || bookedSlots[slot.id],
        })) ?? []
    );
  }, [availability, bookedSlots, selectedDate]);

  const selectedSlot = slotsForDate.find((slot) => slot.id === selectedSlotId);

  const resetScheduler = () => {
    setMode(startInSchedule ? "schedule" : "info");
    setWindowStart(0);
    setSelectedDate(availability[0]?.dateISO ?? "");
    setSelectedSlotId(null);
    setFormValues({ name: "", email: "", note: "" });
    setSubmissionState("idle");
    setCelebrate(false);
  };

  useEffect(() => {
    if (isOpen && startInSchedule) {
      setMode("schedule");
    }
  }, [isOpen, startInSchedule]);

  useEffect(() => {
    if (!availability.find((day) => day.dateISO === selectedDate)) {
      setSelectedDate(availability[windowStart]?.dateISO ?? "");
      setSelectedSlotId(null);
    }
  }, [availability, selectedDate, windowStart]);

  const shiftWindow = (direction: -1 | 1) => {
    const nextStart = Math.min(
      maxWindowIndex,
      Math.max(0, windowStart + direction * WINDOW_SIZE)
    );
    setWindowStart(nextStart);
    const nextVisible = availability[nextStart];
    if (nextVisible) {
      setSelectedDate(nextVisible.dateISO);
      setSelectedSlotId(null);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedSlot || !formValues.name || !formValues.email || !selectedDate) return;
    const dayMeta = availability.find((d) => d.dateISO === selectedDate);
    if (!dayMeta) return;

    const subject = `Meeting request: ${selectedSlot.label} (${dayMeta.displayLabel})`;
    const body = [
      `Hi Kevin,`,
      ``,
      `I'd like to reserve ${dayMeta.displayLabel} at ${selectedSlot.label}.`,
      ``,
      `Name: ${formValues.name}`,
      `Email: ${formValues.email}`,
      formValues.note ? `Context: ${formValues.note}` : ``,
      ``,
      `Best,`,
      formValues.name,
    ]
      .filter(Boolean)
      .join("\n");

    setSubmissionState("loading");
    try {
      const response = await fetch("https://formsubmit.co/ajax/kevin.zheng@student.uts.edu.au", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          name: formValues.name,
          email: formValues.email,
          message: body,
          slot: `${dayMeta.displayLabel} · ${selectedSlot.label}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");

      setSubmissionState("success");
      setCelebrate(true);
      setBookedSlots((prev) => ({
        ...prev,
        [selectedSlot.id]: true,
      }));
      setTimeout(() => {
        onClose();
        resetScheduler();
      }, 10000);
    } catch (error) {
      console.error(error);
      setSubmissionState("error");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.25)] backdrop-blur-sm"
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
          className={
            celebrate
              ? "relative w-full max-w-4xl max-h-[90vh] overflow-visible"
              : "surface-card p-6 md:p-8 lg:p-12 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
          }
          variants={modalVariants}
          initial="hidden"
          animate={
            celebrate
              ? { scale: [1, 0.78, 1.05, 0.45], opacity: [1, 0.6, 0.4, 0] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            celebrate
              ? { duration: 2.4, ease: [0.16, 1, 0.3, 1], times: [0, 0.2, 0.6, 1] }
              : undefined
          }
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
            <AnimatePresence>
              {celebrate && (
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {particles.map((p, i) => (
                    <motion.span
                      key={i}
                      className="absolute rounded-full bg-[var(--accent-link)]"
                      style={{
                        width: p.size,
                        height: p.size,
                        left: "50%",
                        top: "50%",
                      }}
                      initial={{ x: p.xStart, y: p.yStart, opacity: 0.9, scale: 1 }}
                      animate={{
                        x: p.xStart * 0.12,
                        y: p.yStart * 0.12,
                        opacity: 0.95,
                        scale: 0.9,
                      }}
                      transition={{
                        duration: 2,
                        delay: p.delay,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  {particles.map((p, i) => (
                    <motion.span
                      key={`out-${i}`}
                      className="absolute rounded-full bg-[var(--accent-link)]"
                      style={{
                        width: p.size,
                        height: p.size,
                        left: "50%",
                        top: "50%",
                      }}
                      initial={{ x: p.xStart * 0.12, y: p.yStart * 0.12, opacity: 0.95, scale: 0.9 }}
                      animate={{
                        x: p.dx,
                        y: p.dy,
                        opacity: 0,
                        scale: 0.4,
                      }}
                      transition={{
                        duration: p.duration,
                        delay: p.delay + 2,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.92, opacity: 0.45 }}
                    animate={{ scale: [0.92, 1.05, 0.6], opacity: [0.85, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], times: [0, 0.55, 1] }}
                  >
                    <motion.svg
                      viewBox="0 0 48 48"
                      className="w-16 h-16 text-[var(--accent-link)]"
                    >
                      <motion.path
                        d="M15 24l7 7 11-14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      />
                    </motion.svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {!celebrate && (
              <>
                <motion.button
                  className="absolute top-6 right-6 p-2 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] hover:opacity-80 transition-colors z-10"
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
                      ? "Let’s talk about diffusion experiments, moderation strategy, or teaching collaborations."
                      : "Pick a time, leave context, and I’ll reply with a confirmation email."}
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
                      className="card-row hoverable flex-col sm:flex-row items-start sm:items-center cursor-pointer"
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
                      className="card-row hoverable flex-col sm:flex-row items-start sm:items-center cursor-pointer"
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
                      className="card-row flex-col sm:flex-row items-start sm:items-center"
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
                      className="card-row hoverable flex-col sm:flex-row items-start sm:items-center cursor-pointer"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setMode("schedule")}
                    >
                      <motion.div variants={iconVariants} initial="hidden" animate="visible">
                        <CalendarDays size={24} className="text-brand-accent" />
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
                    className="border-t border-border/70 pt-6"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h3 className="text-xl font-medium mb-4 text-center">Connect with me</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[
                        {
                          label: "LinkedIn",
                          href: socials.linkedin,
                          icon: <Linkedin size={24} className="text-brand-accent" />,
                        },
                        {
                          label: "Google Scholar",
                          href: socials.googleScholar,
                          icon: (
                            <Image
                              src="/icons/google-scholar.png"
                              alt="Google Scholar logo"
                              width={24}
                              height={24}
                              className="w-6 h-6"
                              priority={false}
                            />
                          ),
                        },
                        {
                          label: "ORCID",
                          href: socials.orcid,
                          icon: <OrcidIconColor className="w-6 h-6" />,
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
                          className="card-row hoverable justify-center"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                        >
                          {icon}
                          <span>{label}</span>
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
                      className="card-row hoverable justify-center text-sm"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                      </div>
                      {submissionState === "success" && (
                        <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-green-500">
                          <Check size={14} /> Confirmed
                        </span>
                      )}
                      {submissionState === "error" && (
                        <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-red-500">
                          <AlertCircle size={14} /> Failed
                        </span>
                      )}
                    </div>

                    <div className="surface-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                          Choose a date
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => shiftWindow(-1)}
                            disabled={windowStart === 0}
                            className="chip text-[10px] py-2 disabled:opacity-40"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() => shiftWindow(1)}
                            disabled={windowStart >= maxWindowIndex}
                            className="chip text-[10px] py-2 disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {visibleDays.map((day) => {
                          const isActive = selectedDate === day.dateISO;
                          return (
                            <button
                              key={day.dateISO}
                              onClick={() => {
                                setSelectedDate(day.dateISO);
                                setSelectedSlotId(null);
                              }}
                              aria-pressed={isActive}
                    className={`chip text-sm transition-colors ${
                      isActive
                        ? "bg-[rgba(41,151,255,0.08)] text-[var(--accent-link)] border-[var(--accent-link)]"
                        : "hover:bg-[var(--accent-soft)]"
                    }`}
                            >
                              <span className="flex items-center gap-2">
                                {day.displayLabel}
                                {isActive && (
                                  <span className="text-[0.65rem] uppercase tracking-[0.2em] opacity-80">
                                    ✓
                                  </span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3" layout>
                      {slotsForDate.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={slot.booked || submissionState === "loading"}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`surface-card px-4 py-4 text-left transition-all ${
                              slot.booked
                                ? "border-border/30 text-muted-foreground cursor-not-allowed line-through opacity-60"
                                : isSelected
                                  ? "border-brand-accent bg-[rgba(41,151,255,0.12)] shadow-[0_12px_30px_-20px_rgba(0,0,0,0.8)]"
                                  : "border-border hover:bg-[var(--accent-soft)]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Meeting
                              </p>
                              {isSelected && (
                                <Check size={16} className="text-brand-accent" />
                              )}
                            </div>
                            <p className="text-lg font-medium">{slot.label}</p>
                          </button>
                        );
                      })}
                    </motion.div>

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
                          aria-invalid={!emailValid}
                        />
                        {!emailValid && formValues.email.length > 0 && (
                          <span className="text-xs text-red-400">Please enter a valid email.</span>
                        )}
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
                      onClick={handleSubmitBooking}
                      disabled={
                        !selectedSlot ||
                        !formValues.name ||
                        !formValues.email ||
                        !emailValid ||
                        submissionState === "loading"
                      }
                      className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submissionState === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Scheduling…
                        </>
                      ) : (
                        <>
                          <SendHorizonal size={18} />
                          Confirm meeting
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
