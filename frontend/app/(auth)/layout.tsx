export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface px-gutter py-xl flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
