import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Globe2,
  GraduationCap,
  LineChart,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { RevealObserver } from "@/components/Reveal";
import { Eyebrow, Reveal, SectionTitle } from "@/components/ui";
import {
  approach,
  contact,
  cost,
  globalClients,
  heroStats,
  images,
  localClients,
  mission,
  offices,
  presence,
  principles,
  process,
  reputationStats,
  revenue,
  rrrr,
  sectors,
  services,
  socialIntelUses,
  story,
  technology,
} from "@/lib/content";

const serviceIcons = [Brain, ShieldCheck, LineChart, GraduationCap];

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded bg-cyan px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <RevealObserver />
      <main id="main">
        <Hero />
        <About />
        <Story />
        <Mission />
        <Services />
        <Technology />
        <Approach />
        <WhyReputation />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section id="top" className="grain relative isolate flex min-h-dvh flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.jellyfish}
          alt=""
          fill
          preload
          sizes="100vw"
          className="animate-drift object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-16 pt-32 md:px-8">
        <Reveal>
          <Eyebrow>Reputation management · Social intelligence</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
            Clarity
            <br />
            is <Logo className="align-baseline text-[1.05em] normal-case" />
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            We guide brands to step out of the <span className="text-[#ff7a7a]">Red Ocean</span>{" "}
            to conquer <span className="text-cyan">Blue Oceans</span>. Through data-driven
            intelligence, we eliminate noise and unlock new demand instead of fighting for
            existing market share.
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan px-7 font-semibold text-ink transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            Get a free consultation <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a
            href="#services"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-text/25 px-7 font-semibold text-text transition-colors duration-200 hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            Explore services
          </a>
        </Reveal>
      </div>

      <div className="border-t border-line/70 bg-ink/60 backdrop-blur-sm">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 px-5 md:grid-cols-4 md:px-8">
          {heroStats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="border-line/70 py-6 pr-4 odd:border-r md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-semibold text-text md:text-4xl">{s.value}</dd>
              <dd className="mt-1 text-sm text-muted">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="max-w-5xl font-display text-3xl leading-tight md:text-5xl">
            Mushin is a strategic{" "}
            <span className="font-semibold text-teal">reputation management</span> and{" "}
            <span className="font-semibold text-teal">social intelligence</span> company, blending{" "}
            <span className="font-semibold">foresight with insight</span> and{" "}
            <span className="font-semibold">innovation with information.</span>
          </p>
        </Reveal>

        <Reveal className="mt-16">
          <Eyebrow>We use social intelligence to</Eyebrow>
        </Reveal>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {socialIntelUses.map((item, i) => (
            <Reveal
              as="li"
              key={item}
              delay={(i % 3) * 80}
              className="flex gap-4 bg-ink-2 p-7 md:p-8"
            >
              <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-cyan shadow-[0_0_18px_var(--cyan)]" />
              <p className="leading-relaxed text-muted">{item}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            { title: "We increase your revenue", items: revenue, Icon: ArrowUpRight },
            { title: "We reduce your cost", items: cost, Icon: ArrowDownRight },
          ].map(({ title, items, Icon }, i) => (
            <Reveal key={title} delay={i * 100} className="rounded-3xl border border-line bg-surface/60 p-7 md:p-8">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-text">
                <Icon size={18} className="text-cyan" aria-hidden="true" /> {title}
              </h3>
              <ul className="mt-6 flex flex-wrap gap-3">
                {items.map((it) => (
                  <li key={it} className="rounded-full border border-text/20 px-4 py-2 text-sm font-medium">
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="grain relative isolate overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 -z-10">
        <Image src={images.roots} alt="" fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionTitle outline="Our" solid="Story" />
        </Reveal>
        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
          {story.map((s, i) => (
            <Reveal key={s.kicker} delay={i * 120} as="article" className="border-l-2 border-cyan pl-6 md:pl-8">
              <Eyebrow>{s.kicker}</Eyebrow>
              <h3 className="mt-3 font-display text-2xl font-semibold md:text-3xl">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 grid items-center gap-10 overflow-hidden rounded-3xl border border-line bg-ink/70 p-7 backdrop-blur-sm md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <Eyebrow>Our presence · Glocal leadership</Eyebrow>
            <h3 className="mt-3 font-display text-2xl font-semibold md:text-4xl">
              Local expertise, global reach.
            </h3>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              Headquartered in the UAE and Erbil, Iraq, with strategic offices internationally,
              our team brings over 20 years of experience to clients in any market.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {presence.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-1.5 text-sm">
                  <MapPin size={14} className="text-cyan" aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <Image
              src={images.earth}
              alt="Earth from space, showing the Middle East and Europe"
              fill
              sizes="(min-width: 768px) 384px, 90vw"
              className="rounded-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="bg-ink-2 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionTitle outline="Our" solid="Mission" />
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-8 font-display text-2xl leading-snug md:text-3xl">
                To decode <span className="text-teal">consumer behaviors into accessible insights</span>{" "}
                while exploring new technologies to drive industry-defining growth.
              </p>
            </Reveal>
          </div>
          <ul className="grid gap-4 self-end sm:grid-cols-2">
            {mission.map((m, i) => (
              <Reveal as="li" key={m} delay={i * 80} className="border-l-4 border-cyan bg-surface/60 p-5 text-muted">
                {m}
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="mt-24">
          <Eyebrow>Our principles · The Mushin I.D.E.A.L.</Eyebrow>
          <h3 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Five values, one north star.</h3>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={i * 70}
              className="group relative overflow-hidden rounded-3xl border border-line bg-ink p-6 transition-colors duration-300 hover:border-cyan/60"
            >
              <span
                aria-hidden="true"
                className="text-outline block font-display text-7xl font-extrabold leading-none opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              >
                {p.letter}
              </span>
              <h4 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-teal">{p.name}</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <SectionTitle outline="Our" solid="Services" />
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Turning data into your greatest ally, from influential political figures and major
              conglomerates to fast-growing SMEs.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <Reveal
                as="article"
                key={s.id}
                delay={(i % 2) * 100}
                className="group flex flex-col rounded-3xl border border-line bg-gradient-to-b from-surface to-ink-2 p-7 transition-colors duration-300 hover:border-cyan/50 md:p-10"
              >
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-display text-3xl leading-tight md:text-4xl">
                    <span className="font-semibold text-teal">{s.title}</span>
                    <br />
                    {s.subtitle}
                  </h3>
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cyan/10 text-cyan">
                    <Icon size={26} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-6 leading-relaxed text-muted">{s.body}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-teal/30 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-teal"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Technology() {
  return (
    <section className="relative overflow-hidden bg-ink-2 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionTitle outline="The" solid="Technology" />
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-8 text-xl leading-relaxed">
              <span className="text-teal">We don&apos;t just collect data</span> — we transform it
              into tailored, actionable intelligence that drives your business forward.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Deep WEBINT is our hybrid technology, built from the ground up and far beyond the
              limits of prescribed APIs. Born from over 20 years of cybersecurity and political
              expertise, it identifies the root causes of reputation issues with precision down to
              a grain of sand: who, what and where insights originate.
            </p>
          </Reveal>
          <ul className="mt-10 space-y-4">
            {technology.map((t, i) => (
              <Reveal as="li" key={t.name} delay={i * 90} className="rounded-2xl border border-line bg-ink/70 p-5">
                <h3 className="flex items-center gap-3 font-semibold text-teal">
                  <span className="h-3 w-3 rounded-full border-2 border-cyan" aria-hidden="true" />
                  {t.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={150} className="relative mx-auto aspect-square w-full max-w-xl">
          <Image
            src={images.sphere}
            alt="A sphere of glowing data points representing Mushin's listening network"
            fill
            sizes="(min-width: 1024px) 560px, 90vw"
            className="object-contain"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="grain relative isolate overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 -z-10">
        <Image src={images.road} alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionTitle outline="Our" solid="Approach" />
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
            We think about reputation management differently. Every service is bespoke to a brand
            and its needs, from social listening to comprehensive reputation management.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 100} as="article" className="border-t-4 border-teal pt-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.25em]">{a.title}</h3>
              <p className="mt-3 text-lg font-semibold text-teal">{a.lead}</p>
              <p className="mt-3 leading-relaxed text-muted">{a.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24">
          <Eyebrow>Our process · Structured simplicity that works</Eyebrow>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={(i % 4) * 70}
              className="relative overflow-hidden rounded-3xl border border-line bg-ink/80 p-6 backdrop-blur-sm"
            >
              <span
                aria-hidden="true"
                className="absolute -right-2 -top-4 font-display text-8xl font-extrabold text-text/5"
              >
                {i + 1}
              </span>
              <p className="text-xs font-semibold text-cyan">Step {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
            </Reveal>
          ))}
          <Reveal as="li" delay={210} className="flex items-end rounded-3xl bg-cyan p-6 text-ink">
            <p className="font-display text-xl font-semibold leading-snug">
              If you fail to plan, you plan to fail. Well-planned processes deliver the outcome.
            </p>
          </Reveal>
        </ol>
      </div>
    </section>
  );
}

function Gauge({ value }: { value: number }) {
  const r = 52;
  const half = Math.PI * r;
  return (
    <svg viewBox="0 0 120 68" className="w-full max-w-[160px]" aria-hidden="true">
      <path d={`M8 60 A${r} ${r} 0 0 1 112 60`} fill="none" stroke="var(--line)" strokeWidth="12" strokeLinecap="round" />
      <path
        d={`M8 60 A${r} ${r} 0 0 1 112 60`}
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * half} ${half}`}
      />
    </svg>
  );
}

function WhyReputation() {
  return (
    <section className="bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <SectionTitle outline="The other" solid="ROI" />
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 font-display text-2xl text-teal">Reputation on investment.</p>
              <blockquote className="mt-8 border-l-2 border-cyan pl-6 text-xl leading-relaxed md:text-2xl">
                “It takes <span className="text-teal">20 years to build</span> a reputation and{" "}
                <span className="text-teal">5 minutes to ruin</span> it.”
                <footer className="mt-3 text-sm text-muted">— Warren Buffett</footer>
              </blockquote>
              <p className="mt-6 max-w-xl leading-relaxed text-muted">
                In today&apos;s digital landscape your online reputation is your greatest asset, or
                your biggest liability. Even when harmful content can be removed, the damage may
                already be done.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src={images.hand}
              alt="A hand carefully polishing a ceramic bowl"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {reputationStats.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 80} className="flex flex-col items-center rounded-3xl border border-line bg-ink-2 p-6 text-center">
              <Gauge value={s.value} />
              <p className="-mt-6 font-display text-3xl font-semibold">{s.value}%</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.label}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {rrrr.map((r, i) => (
            <Reveal key={r.name} delay={i * 80} as="article" className="rounded-3xl bg-surface p-6">
              <p className="font-display text-3xl font-semibold text-teal">{r.name}</p>
              <h3 className="mt-2 font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clients() {
  return (
    <section id="clients" className="bg-ink-2 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionTitle outline="Sector" solid="Spanning" />
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            Our open-source platform lets us tailor solutions precisely to your industry and
            business goals.
          </p>
        </Reveal>
        <ul className="mt-10 flex flex-wrap gap-3">
          {sectors.map((s, i) => (
            <Reveal
              as="li"
              key={s}
              delay={i * 30}
              className="rounded-full border border-cyan/40 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-teal"
            >
              {s}
            </Reveal>
          ))}
        </ul>

        <div className="mt-24 grid gap-14 lg:grid-cols-2">
          <ClientList title="Highlighted global clients" names={globalClients} />
          <ClientList title="Highlighted regional clients" names={localClients} />
        </div>

        <Reveal className="mt-12 flex gap-4 rounded-3xl border-2 border-cyan/60 p-6 md:p-8">
          <Lock size={22} className="mt-0.5 shrink-0 text-cyan" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-teal">Client confidentiality</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Clients listed have permitted us to use their names as references. Due to the
              sensitive nature of our work, we do not disclose the names of our clients within
              the MENA region. Direct competitors are never assigned to the same team member.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ClientList({ title, names }: { title: string; names: string[] }) {
  return (
    <Reveal>
      <Eyebrow>{title}</Eyebrow>
      <ul className="mt-6 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
        {names.map((n) => (
          <li
            key={n}
            className="flex min-h-20 items-center justify-center border-b border-r border-line px-3 text-center font-display text-sm font-semibold text-text/70 transition-colors duration-200 hover:text-cyan md:text-base"
          >
            {n}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Contact() {
  return (
    <section id="contact" className="grain relative isolate overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 -z-10">
        <Image src={images.dunes} alt="" fill sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionTitle outline="Where" solid="We are" />
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            We believe in face-to-face interaction and old-fashioned hospitality. Visit us and
            meet the people behind Mushin. Arabic hospitality is deeply ingrained in our culture.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {offices.map((o, i) => (
              <Reveal key={o.city} delay={i * 100} className="rounded-3xl border border-line bg-ink/75 p-6 backdrop-blur-sm">
                <h3 className="flex items-center gap-2 font-display text-2xl font-semibold">
                  <MapPin size={20} className="text-cyan" aria-hidden="true" /> {o.city}
                </h3>
                <address className="mt-3 not-italic leading-relaxed text-muted">
                  {o.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </Reveal>
            ))}
            <Reveal delay={200} className="rounded-3xl border border-line bg-ink/75 p-6 backdrop-blur-sm">
              <ul className="space-y-3">
                <li>
                  <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-3 hover:text-cyan">
                    <Mail size={18} className="text-cyan" aria-hidden="true" /> {contact.email}
                  </a>
                </li>
                <li>
                  <a href={contact.phoneHref} className="inline-flex min-h-11 items-center gap-3 hover:text-cyan">
                    <Phone size={18} className="text-cyan" aria-hidden="true" /> {contact.phone}
                  </a>
                </li>
                <li className="inline-flex min-h-11 items-center gap-3">
                  <Globe2 size={18} className="text-cyan" aria-hidden="true" /> {contact.site}
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={150} className="rounded-3xl border border-line bg-ink/80 p-6 backdrop-blur-md md:p-10">
            <h3 className="font-display text-3xl font-semibold">
              Contact us for a <span className="text-cyan">free consultation</span>
            </h3>
            <p className="mt-2 text-muted">Tell us where you want to go. We&apos;ll map the route.</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row md:px-8">
        <Logo className="text-4xl" />
        <p className="font-display text-lg font-semibold">
          No mind. <span className="text-cyan">Blue ocean wins!</span>
        </p>
        <p className="text-sm text-muted">© {new Date().getFullYear()} Mushin. All rights reserved.</p>
      </div>
    </footer>
  );
}
