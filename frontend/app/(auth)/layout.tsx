export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-gutter flex min-h-screen items-center justify-center bg-surface py-xl">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
