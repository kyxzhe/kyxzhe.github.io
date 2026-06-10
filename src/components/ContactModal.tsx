"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  SendHorizonal,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { generateAvailability } from "@/lib/constants/availability";

interface ContactModalProps {
  dialogId?: string;
  onClose: () => void;
}

export default function ContactModal({
  dialogId = "contact-booking-dialog",
  onClose,
}: ContactModalProps) {
  const availability = useMemo(() => generateAvailability(new Date(), 30), []);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const submitAbortRef = useRef<AbortController | null>(null);
  const successDismissTimerRef = useRef<number | null>(null);
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
  const trimmedName = formValues.name.trim();
  const trimmedEmail = formValues.email.trim();
  const trimmedNote = formValues.note.trim();
  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail),
    [trimmedEmail]
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
  const emailHasError = trimmedEmail.length > 0 && !emailValid;
  useFocusTrap(dialogRef);

  const resetScheduler = useCallback(() => {
    setWindowStart(0);
    setSelectedDate(availability[0]?.dateISO ?? "");
    setSelectedSlotId(null);
    setFormValues({ name: "", email: "", note: "" });
    setSubmissionState("idle");
  }, [availability]);

  const clearSuccessDismissTimer = useCallback(() => {
    if (successDismissTimerRef.current === null) return;

    window.clearTimeout(successDismissTimerRef.current);
    successDismissTimerRef.current = null;
  }, []);

  const handleDismiss = useCallback(() => {
    clearSuccessDismissTimer();
    submitAbortRef.current?.abort();
    submitAbortRef.current = null;
    onClose();
    resetScheduler();
  }, [clearSuccessDismissTimer, onClose, resetScheduler]);

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
      clearSuccessDismissTimer();
      submitAbortRef.current?.abort();
      submitAbortRef.current = null;
    };
  }, [clearSuccessDismissTimer, handleDismiss]);

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
    if (!selectedSlot || !trimmedName || !trimmedEmail || !emailValid || !selectedDate) return;
    const dayMeta = availability.find((d) => d.dateISO === selectedDate);
    if (!dayMeta) return;

    const subject = `Meeting request: ${selectedSlot.label} (${dayMeta.displayLabel})`;
    const body = [
      `Hi Kevin,`,
      ``,
      `I'd like to reserve ${dayMeta.displayLabel} at ${selectedSlot.label}.`,
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

    setSubmissionState("loading");
    submitAbortRef.current?.abort();
    const submitController = new AbortController();
    submitAbortRef.current = submitController;

    try {
      const response = await fetch("https://formsubmit.co/ajax/kevin.zheng@student.uts.edu.au", {
        method: "POST",
        referrerPolicy: "no-referrer",
        signal: submitController.signal,
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

      setSubmissionState("success");
      setBookedSlots((prev) => ({
        ...prev,
        [selectedSlot.id]: true,
      }));
      clearSuccessDismissTimer();
      successDismissTimerRef.current = window.setTimeout(() => {
        successDismissTimerRef.current = null;
        onClose();
        resetScheduler();
      }, SUCCESS_DISMISS_DELAY);
    } catch {
      if (submitController.signal.aborted) return;
      setSubmissionState("error");
    } finally {
      if (submitAbortRef.current === submitController) {
        submitAbortRef.current = null;
      }
    }
  };

  return (
    <div
      className="contact-modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(0,0,0,0.25)] p-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => {
        handleDismiss();
      }}
    >
      <div
        id={dialogId}
        ref={dialogRef}
        className="contact-modal-panel surface-card relative max-h-[calc(100dvh-3rem)] w-full max-w-4xl overflow-y-auto p-4 sm:max-h-[90vh] sm:p-6 md:p-8 lg:p-12"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
        tabIndex={-1}
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
            <X size={22} className="text-foreground" aria-hidden="true" />
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
            <form
              className="flex flex-col gap-4 md:gap-6"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmitBooking();
              }}
            >
              <div
                className="flex flex-wrap gap-3 items-center justify-end"
                role="status"
                aria-live="polite"
              >
                {submissionState === "success" && (
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-green-500">
                    <Check size={14} aria-hidden="true" /> Confirmed
                  </span>
                )}
                {submissionState === "error" && (
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-red-500">
                    <AlertCircle size={14} aria-hidden="true" /> Failed
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
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] opacity-80" aria-hidden="true">
                              ✓
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                role="group"
                aria-label="Available meeting times"
              >
                {slotsForDate.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.booked || submissionState === "loading"}
                      aria-pressed={isSelected}
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
                          <Check size={16} className="text-current" aria-hidden="true" />
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
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
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
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
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
                  name="message"
                  autoComplete="off"
                  value={formValues.note}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  className="rounded-[12px] border border-border bg-transparent px-4 py-3 focus:outline-none focus:border-foreground placeholder:text-muted-foreground/70"
                  placeholder="Context, collaborators, or agenda."
                />
              </div>

              <button
                type="submit"
                disabled={
                  !selectedSlot ||
                  !trimmedName ||
                  !trimmedEmail ||
                  !emailValid ||
                  submissionState === "loading"
                }
                className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submissionState === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Scheduling…
                  </>
                ) : (
                  <>
                    <SendHorizonal size={18} aria-hidden="true" />
                    Confirm request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
