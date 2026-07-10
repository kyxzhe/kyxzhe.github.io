"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  X,
  Mail,
  MapPin,
  Github,
  Linkedin,
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

const WINDOW_SIZE = 5;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_NOTE_LENGTH = 2000;
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const [availability, setAvailability] = useState(() => generateAvailability(new Date(), 30));
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
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
  const trimmedName = formValues.name.trim();
  const trimmedEmail = formValues.email.trim();
  const trimmedNote = formValues.note.trim();
  const nameValid = trimmedName.length > 0 && trimmedName.length <= MAX_NAME_LENGTH;
  const emailValid =
    trimmedEmail.length <= MAX_EMAIL_LENGTH &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const [submissionState, setSubmissionState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const visibleDays = availability.slice(windowStart, windowStart + WINDOW_SIZE);
  const maxWindowIndex = Math.max(0, availability.length - WINDOW_SIZE);

  const slotsForDate = useMemo(
    () => availability.find((day) => day.dateISO === selectedDate)?.slots ?? [],
    [availability, selectedDate]
  );

  const selectedSlot = slotsForDate.find((slot) => slot.id === selectedSlotId);

  const resetScheduler = useCallback(() => {
    setMode(startInSchedule ? "schedule" : "info");
    setWindowStart(0);
    setSelectedDate(availability[0]?.dateISO ?? "");
    setSelectedSlotId(null);
    setFormValues({ name: "", email: "", note: "" });
    setSubmissionState("idle");
  }, [availability, startInSchedule]);

  const closeModal = useCallback(() => {
    requestIdRef.current += 1;
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    onClose();
    resetScheduler();
  }, [onClose, resetScheduler]);

  useEffect(() => {
    if (isOpen) {
      setAvailability(generateAvailability(new Date(), 30));
    }
  }, [isOpen]);

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

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      requestIdRef.current += 1;
      requestControllerRef.current?.abort();
      requestControllerRef.current = null;
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [closeModal, isOpen]);

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

  const handleSubmitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      requestControllerRef.current ||
      submissionState === "loading" ||
      submissionState === "success" ||
      !selectedSlot ||
      selectedSlot.booked ||
      !selectedDate ||
      !nameValid ||
      !emailValid ||
      trimmedNote.length > MAX_NOTE_LENGTH
    ) {
      return;
    }
    const dayMeta = availability.find((d) => d.dateISO === selectedDate);
    if (!dayMeta) return;

    const subject = `Meeting request: ${selectedSlot.label} (${dayMeta.displayLabel})`;
    const body = [
      `Hi Kevin,`,
      ``,
      `I'd like to request ${dayMeta.displayLabel} at ${selectedSlot.label}.`,
      ``,
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      trimmedNote ? `Context: ${trimmedNote}` : ``,
      ``,
      `Best,`,
      trimmedName,
    ]
      .filter(Boolean)
      .join("\n");

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setSubmissionState("loading");
    try {
      const response = await fetch("https://formsubmit.co/ajax/kevin.zheng@student.uts.edu.au", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          name: trimmedName,
          email: trimmedEmail,
          message: body,
          slot: `${dayMeta.displayLabel} · ${selectedSlot.label}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");
      if (requestId !== requestIdRef.current) return;

      setSubmissionState("success");
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) return;
      console.error(error);
      setSubmissionState("error");
    } finally {
      if (requestId === requestIdRef.current) {
        requestControllerRef.current = null;
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.25)] p-3 backdrop-blur-sm sm:p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeModal}
        >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          aria-describedby="contact-modal-description"
          className="surface-card relative max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto p-4 sm:max-h-[90vh] sm:p-6 md:p-8 lg:p-12"
          variants={modalVariants}
          initial="hidden"
          animate={{ scale: 1, opacity: 1 }}
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
            <motion.div>
                <motion.button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close contact modal"
                  className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition-colors hover:opacity-80 md:right-5 md:top-5 md:h-11 md:w-11"
                  onClick={closeModal}
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <X size={22} className="text-foreground" />
                </motion.button>

                <motion.div
                  className="mb-6 pr-10 text-center md:mb-12 md:pr-0"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h2
                    id="contact-modal-title"
                    className="mb-3 text-[34px] font-medium leading-none md:text-6xl lg:text-7xl"
                  >
                    {mode === "info" ? "Contact me" : "Request a time"}
                  </h2>
                  <p
                    id="contact-modal-description"
                    className="text-[15px] leading-relaxed text-muted-foreground md:text-xl"
                  >
                    {mode === "info"
                      ? "Share what you need, who is involved, and any constraints. I will outline the next steps."
                      : "Choose a preferred time and add a short note. I will confirm availability by email."}
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
                    <motion.a
                      href={`mailto:${contactInfo.email}`}
                      className="card-row hoverable w-full flex-col items-start text-left sm:flex-row sm:items-center"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div variants={iconVariants} initial="hidden" animate="visible">
                        <Mail size={24} className="text-brand-accent" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-lg">Email</h3>
                        <p className="text-muted-foreground break-all">{contactInfo.email}</p>
                      </div>
                    </motion.a>
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

                    <motion.button
                      type="button"
                      className="card-row hoverable w-full flex-col items-start text-left sm:flex-row sm:items-center"
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
                          {contactInfo.availability} · Tap to request
                        </p>
                      </div>
                    </motion.button>
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
                  <motion.form
                    onSubmit={handleSubmitBooking}
                    className="flex flex-col gap-4 md:gap-6"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                        <div
                          className="flex min-h-5 flex-wrap items-center justify-end gap-3"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {submissionState === "success" && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
                              <Check size={14} /> Request sent · Awaiting confirmation
                            </span>
                          )}
                          {submissionState === "error" && (
                            <span
                              role="alert"
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400"
                            >
                              <AlertCircle size={14} /> Request failed · Please try again
                            </span>
                          )}
                        </div>

                    <div className="rounded-[18px] bg-[var(--pill-background)] p-3 sm:p-4">
                      <div className="mb-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                          Choose a date
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => shiftWindow(-1)}
                            disabled={windowStart === 0}
                            className="inline-flex h-9 items-center rounded-full bg-white/70 px-3 text-[12px] text-muted-foreground transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-40 dark:bg-white/8"
                          >
                            Prev
                          </button>
                          <button
                            type="button"
                            onClick={() => shiftWindow(1)}
                            disabled={windowStart >= maxWindowIndex}
                            className="inline-flex h-9 items-center rounded-full bg-white/70 px-3 text-[12px] text-muted-foreground transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-40 dark:bg-white/8"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                        {visibleDays.map((day) => {
                          const isActive = selectedDate === day.dateISO;
                          return (
                            <button
                              key={day.dateISO}
                              type="button"
                              onClick={() => {
                                setSelectedDate(day.dateISO);
                                setSelectedSlotId(null);
                              }}
                              aria-pressed={isActive}
                              className={`inline-flex min-h-10 items-center justify-center rounded-full px-3 text-[13px] leading-snug transition-colors ${
                                isActive
                                  ? "bg-[var(--accent)] text-[var(--background)]"
                                  : "bg-white/70 text-muted-foreground hover:bg-[var(--accent-soft)] dark:bg-white/8"
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
                            type="button"
                            disabled={slot.booked || submissionState === "loading"}
                            onClick={() => setSelectedSlotId(slot.id)}
                            aria-pressed={isSelected}
                            className={`rounded-[16px] px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 sm:px-4 sm:py-4 ${
                              slot.booked
                                ? "cursor-not-allowed bg-[var(--pill-background)] text-muted-foreground line-through opacity-55"
                                : isSelected
                                  ? "bg-[var(--accent)] text-[var(--background)]"
                                  : "bg-[var(--pill-background)] hover:bg-[var(--accent-soft)]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className={`text-xs uppercase tracking-[0.3em] ${isSelected ? "text-[var(--background)] opacity-70" : "text-muted-foreground"}`}>
                                Meeting
                              </p>
                              {isSelected && (
                                <Check size={16} className="text-current" />
                              )}
                            </div>
                            <p className="text-lg font-medium">{slot.label}</p>
                          </button>
                        );
                      })}
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="contact-name" className="text-sm text-muted-foreground">
                          Your name
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          maxLength={MAX_NAME_LENGTH}
                          value={formValues.name}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                          className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                          placeholder="Ada Lovelace"
                          aria-invalid={formValues.name.length > 0 && !nameValid}
                          aria-describedby={
                            formValues.name.length > 0 && !nameValid
                              ? "contact-name-error"
                              : undefined
                          }
                        />
                        {formValues.name.length > 0 && !nameValid && (
                          <span id="contact-name-error" className="text-xs text-red-700 dark:text-red-400">
                            Please enter your name.
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="contact-email" className="text-sm text-muted-foreground">
                          Contact email
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          maxLength={MAX_EMAIL_LENGTH}
                          value={formValues.email}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                          className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                          placeholder="you@example.com"
                          aria-invalid={formValues.email.length > 0 && !emailValid}
                          aria-describedby={
                            formValues.email.length > 0 && !emailValid
                              ? "contact-email-error"
                              : undefined
                          }
                        />
                        {!emailValid && formValues.email.length > 0 && (
                          <span id="contact-email-error" className="text-xs text-red-700 dark:text-red-300">
                            Please enter a valid email.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-note" className="text-sm text-muted-foreground">
                        Notes (optional)
                      </label>
                      <textarea
                        id="contact-note"
                        name="note"
                        maxLength={MAX_NOTE_LENGTH}
                        value={formValues.note}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, note: e.target.value }))}
                        rows={3}
                        className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                        placeholder="Context, collaborators, or agenda."
                      />
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Submitting sends these details to FormSubmit for email delivery.
                    </p>

                    <button
                      type="submit"
                      disabled={
                        !selectedSlot ||
                        !nameValid ||
                        !emailValid ||
                        submissionState === "loading" ||
                        submissionState === "success"
                      }
                      className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submissionState === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <SendHorizonal size={18} />
                          Send request
                        </>
                      )}
                    </button>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
