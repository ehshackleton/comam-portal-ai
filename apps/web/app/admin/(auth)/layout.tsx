export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero-glow flex min-h-[calc(100vh-0px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
