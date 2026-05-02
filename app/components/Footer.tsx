export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>2026 Evergreen Hospital. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="transition hover:text-slate-900">
            Privacy
          </a>
          <a href="#" className="transition hover:text-slate-900">
            Terms
          </a>
          <a href="#" className="transition hover:text-slate-900">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
