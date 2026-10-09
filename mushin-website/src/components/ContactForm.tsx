"use client";

import { Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { contact } from "@/lib/content";

const interests = [
  "Social intelligence reporting",
  "Reputation & crisis management",
  "Marketing mix modeling",
  "Workshops & training",
  "Not sure yet",
];

// No backend yet: the form composes an email in the visitor's mail app.
export function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setError("Please fill in your name, a valid email and a short message.");
      form.reportValidity();
      return;
    }
    setError(null);
    const data = new FormData(form);
    const subject = `Consultation request — ${data.get("company") || data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Company: ${data.get("company") || "-"}`,
      `Interested in: ${data.get("interest")}`,
      "",
      `${data.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const field =
    "mt-2 block w-full rounded-xl border border-line bg-ink-2/80 px-4 py-3 text-base text-text placeholder:text-muted/60 transition-colors duration-200 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/30";

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-muted">
        Name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-sm font-medium text-muted">
        Work email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-sm font-medium text-muted">
        Company <span className="text-muted/60">(optional)</span>
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm font-medium text-muted">
        Interested in
        <select name="interest" className={field} defaultValue={interests[0]}>
          {interests.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium text-muted sm:col-span-2">
        How can we help?
        <textarea name="message" required rows={4} className={field} />
      </label>
      {error && (
        <p role="alert" className="text-sm text-[#ff8a8a] sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">Opens your email app with the message ready to send.</p>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan px-7 font-semibold text-ink transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
        >
          Request a free consultation <Send size={16} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
