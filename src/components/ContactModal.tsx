"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
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
import { OrcidIconColor } from "@/components/icons/AcademicIcons";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  startInSchedule?: boolean;
}

const GOOGLE_CALENDAR_BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0g3LXvhwncwBncjl7jkt0zkytDlAztNt6d2vlhVBxnbPRjDgS4hCdzKSb_vuLkGHcKsSN7kDZh?gv=true";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const resetModal = useCallback(() => {
    setMode(startInSchedule ? "schedule" : "info");
  }, [startInSchedule]);

  const closeModal = useCallback(() => {
    onClose();
    resetModal();
  }, [onClose, resetModal]);

  useEffect(() => {
    if (isOpen && startInSchedule) {
      setMode("schedule");
    }
  }, [isOpen, startInSchedule]);

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
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [closeModal, isOpen]);

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
          animate="visible"
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
                    {mode === "info" ? "Contact me" : "Book a time"}
                  </h2>
                  <p
                    id="contact-modal-description"
                    className="text-[15px] leading-relaxed text-muted-foreground md:text-xl"
                  >
                    {mode === "info"
                      ? "Share what you need, who is involved, and any constraints. I will outline the next steps."
                      : "Choose a time and add a short note. I will confirm by email."}
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
                    <motion.a
                      href={`tel:${contactInfo.phoneRaw}`}
                      className="card-row hoverable w-full flex-col items-start text-left sm:flex-row sm:items-center"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div variants={iconVariants} initial="hidden" animate="visible">
                        <Phone size={24} className="text-brand-accent" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-lg">Phone</h3>
                        <p className="text-muted-foreground">{contactInfo.phone}</p>
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
                          {contactInfo.availability} · Tap to reserve
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
                  <motion.div
                    className="flex flex-col gap-3"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="overflow-hidden rounded-[18px] bg-white">
                      <iframe
                        src={GOOGLE_CALENDAR_BOOKING_URL}
                        title="Book a 30-minute call with Kevin Zheng"
                        className="block h-[max(360px,calc(100dvh-12rem))] max-h-[720px] w-full border-0 focus:outline-none md:h-[max(420px,calc(90dvh-17rem))] md:max-h-[600px]"
                        loading="eager"
                      />
                    </div>
                  </motion.div>
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
