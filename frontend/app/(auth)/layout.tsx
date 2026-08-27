export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="w-full">{children}</div>
    </div>
  );
}
