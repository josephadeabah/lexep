import { AuthForm } from "@/components/auth-form";

export const metadata = {
  title: "Create your account — Lexep",
  description: "Create your Lexep account and start your journey.",
};

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}
