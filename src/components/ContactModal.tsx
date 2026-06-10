"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  SendHorizonal,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { generateAvailability } from "@/lib/constants/availability";

interface ContactModalProps {
  onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const availability = useMemo(() => generateAvailability(new Date(), 30), []);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const WINDOW_SIZE = 5;
  const SUCCESS_DISMISS_DELAY = 1400; // short pause to show "Confirmed" badge
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
  const nameInputId = "booking-name";
  const emailInputId = "booking-email";
  const emailErrorId = "booking-email-error";
  const noteInputId = "booking-note";
  const emailHasError = formValues.email.length > 0 && !emailValid;

  const resetScheduler = useCallback(() => {
    setWindowStart(0);
    setSelectedDate(availability[0]?.dateISO ?? "");
    setSelectedSlotId(null);
    setFormValues({ name: "", email: "", note: "" });
    setSubmissionState("idle");
  }, [availability]);

  const handleDismiss = useCallback(() => {
    onClose();
    resetScheduler();
  }, [onClose, resetScheduler]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDismiss]);

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
      setBookedSlots((prev) => ({
        ...prev,
        [selectedSlot.id]: true,
      }));
      setTimeout(() => {
        onClose();
        resetScheduler();
      }, SUCCESS_DISMISS_DELAY);
    } catch (error) {
      console.error(error);
      setSubmissionState("error");
    }
  };

  return (
    <div
      className="contact-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.25)] p-3 backdrop-blur-sm sm:p-4"
      onClick={() => {
        handleDismiss();
      }}
    >
      <div
        className="contact-modal-panel surface-card relative max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto p-4 sm:max-h-[90vh] sm:p-6 md:p-8 lg:p-12"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close contact modal"
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition-colors hover:opacity-80 md:right-5 md:top-5 md:h-11 md:w-11"
            onClick={() => {
              handleDismiss();
            }}
          >
            <X size={22} className="text-foreground" />
          </button>

          <div className="mb-6 pr-10 text-center md:mb-12 md:pr-0">
            <h1 id="contact-modal-title" className="mb-3 text-[34px] font-medium leading-none md:text-6xl lg:text-7xl">
              Book a time
            </h1>
            <p id="contact-modal-description" className="text-[15px] leading-relaxed text-muted-foreground md:text-xl">
              Choose a time and add a short note. I will confirm by email.
            </p>
          </div>

          <div>
            <div className="flex flex-col gap-4 md:gap-6">
              <div
                className="flex flex-wrap gap-3 items-center justify-end"
                role="status"
                aria-live="polite"
              >
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {slotsForDate.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.booked || submissionState === "loading"}
                      onClick={() => setSelectedSlotId(slot.id)}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor={nameInputId} className="text-sm text-muted-foreground">Your name</label>
                  <input
                    id={nameInputId}
                    type="text"
                    value={formValues.name}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor={emailInputId} className="text-sm text-muted-foreground">Contact email</label>
                  <input
                    id={emailInputId}
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                    className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                    placeholder="you@example.com"
                    aria-invalid={emailHasError}
                    aria-describedby={emailHasError ? emailErrorId : undefined}
                  />
                  {emailHasError && (
                    <span id={emailErrorId} className="text-xs text-red-400">Please enter a valid email.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={noteInputId} className="text-sm text-muted-foreground">Notes (optional)</label>
                <textarea
                  id={noteInputId}
                  value={formValues.note}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                  placeholder="Context, collaborators, or agenda."
                />
              </div>

              <button
                type="button"
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
                    Confirm request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
