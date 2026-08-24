export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-gutter py-xl">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
