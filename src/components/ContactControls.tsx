"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarDays, Phone, X } from "lucide-react";

const ContactModal = dynamic(() => import("@/components/ContactModal"), {
  ssr: false,
  loading: () => null,
});

export function ContactPhoneRequest() {
  const [showCallInfo, setShowCallInfo] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!showCallInfo) return;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCallInfo(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCallInfo]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowCallInfo(true)}
        className="w-full text-left font-medium hover:text-foreground transition-colors"
      >
        <div className="flex flex-col gap-1 py-5 border-b border-[rgba(0,0,0,0.08)] dark:border-white/20 transition-colors hover:border-foreground/70 cursor-pointer">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.26em] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            <Phone size={14} />
            <span>Phone</span>
          </div>
          <p className="text-[17px] font-medium text-foreground">Request a call</p>
          <p className="text-[14px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            I rarely answer calls. Please request and I will text first.
          </p>
        </div>
      </button>

      {showCallInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowCallInfo(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="call-request-title"
          aria-describedby="call-request-description"
        >
          <div
            className="surface-card max-w-md w-full p-6 rounded-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="call-request-title" className="text-lg font-semibold">Request a call</h3>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close request call dialog"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full font-medium hover:bg-[var(--accent-soft)]"
                onClick={() => setShowCallInfo(false)}
              >
                <X size={18} />
              </button>
            </div>
            <p id="call-request-description" className="text-[17px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.8)] leading-relaxed">
              Share your number and preferred time in the booking note. I will text first and call if it helps.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export function ContactBookingControl() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLoadedContactModal, setHasLoadedContactModal] = useState(false);
  const unloadContactModalTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (unloadContactModalTimerRef.current !== null) {
        window.clearTimeout(unloadContactModalTimerRef.current);
      }
    };
  }, []);

  const openContactModal = () => {
    if (unloadContactModalTimerRef.current !== null) {
      window.clearTimeout(unloadContactModalTimerRef.current);
      unloadContactModalTimerRef.current = null;
    }
    setHasLoadedContactModal(true);
    setIsModalOpen(true);
  };

  const closeContactModal = () => {
    setIsModalOpen(false);
    if (unloadContactModalTimerRef.current !== null) {
      window.clearTimeout(unloadContactModalTimerRef.current);
    }
    unloadContactModalTimerRef.current = window.setTimeout(() => {
      setHasLoadedContactModal(false);
      unloadContactModalTimerRef.current = null;
    }, 450);
  };

  return (
    <>
      <button
        type="button"
        onClick={openContactModal}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full border text-[15px] font-medium border-[rgba(0,0,0,0.12)] bg-white text-foreground dark:border-none dark:bg-[rgba(255,255,255,0.12)] dark:text-white py-3 transition-colors duration-150 hover:border-foreground/50"
      >
        <CalendarDays size={16} />
        Book a time
      </button>

      {hasLoadedContactModal && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={closeContactModal}
        />
      )}
    </>
  );
}
