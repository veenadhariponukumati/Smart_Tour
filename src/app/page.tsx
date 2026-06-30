import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              S
            </div>
            <span className="text-lg font-semibold text-slate-900">SmartTour</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
            <a href="#how-it-works" className="transition-colors hover:text-indigo-600">
              How it works
            </a>
            <a href="#features" className="transition-colors hover:text-indigo-600">
              Features
            </a>
            <Link href="/admin" className="transition-colors hover:text-indigo-600">
              For Managers
            </Link>
          </nav>
          <Link
            href="/tours/book"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Book a Tour
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Self-Guided Tour Platform
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Tour apartments on{" "}
              <span className="text-indigo-600">your schedule</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
              Skip the agent. Book a self-guided tour of your preferred apartment
              and get secure access — no coordination, no delays, no waiting.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tours/book"
                className="rounded-lg bg-indigo-600 px-8 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Book a Tour
              </Link>
              <Link
                href="/admin"
                className="rounded-lg border border-slate-300 bg-white px-8 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Manager Dashboard
              </Link>
            </div>
          </div>

          {/* Feature cards */}
          <div id="features" className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">Instant booking</h3>
              <p className="mt-1 text-sm text-slate-500">Pick a time that works for you — no back-and-forth with agents</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">Secure access</h3>
              <p className="mt-1 text-sm text-slate-500">Manager-approved access codes delivered to your confirmation page</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">Verified &amp; safe</h3>
              <p className="mt-1 text-sm text-slate-500">Every booking reviewed by a property manager before access is granted</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">Fast leasing</h3>
              <p className="mt-1 text-sm text-slate-500">Tour on your own time and apply right after — move in faster</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-slate-200/60 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
          <p className="mt-2 text-center text-sm text-slate-500">Three steps from request to walkthrough</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">1</div>
              <h3 className="font-semibold text-slate-900">Pick a slot</h3>
              <p className="mt-2 text-sm text-slate-500">Choose your property, unit, and a time slot that fits your schedule</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">2</div>
              <h3 className="font-semibold text-slate-900">Get approved</h3>
              <p className="mt-2 text-sm text-slate-500">A property manager reviews your request and approves it — usually within hours</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">3</div>
              <h3 className="font-semibold text-slate-900">Tour the unit</h3>
              <p className="mt-2 text-sm text-slate-500">Use your access code to enter and explore the apartment at your own pace</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-slate-200/60 bg-indigo-600 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-white">4.8×</p>
              <p className="mt-1 text-sm text-indigo-200">Faster time-to-lease</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">73%</p>
              <p className="mt-1 text-sm text-indigo-200">Reduction in agent hours</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">92%</p>
              <p className="mt-1 text-sm text-indigo-200">Tenant satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/60 bg-white py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Ready to tour?</h2>
          <p className="mt-3 text-slate-500">
            Browse available slots and book your self-guided apartment tour in under two minutes.
          </p>
          <Link
            href="/tours/book"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-10 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Book a Tour
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-xs font-bold text-white">S</div>
            <span>SmartTour — Self-Guided Apartment Tours</span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} SmartTour. Built with Next.js, Prisma &amp; Clerk.
          </p>
        </div>
      </footer>
    </div>
  );
}
