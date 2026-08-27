import { AuthForm } from "@/components/auth-form/auth-form";

export const metadata = {
  title: "Sign in — Lexep",
  description: "Sign in to continue your Lexep journey.",
};

export default function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
