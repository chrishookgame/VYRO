import RegisterForm from "@/components/auth/RegisterForm";
import { ReferralCapture } from "@/components/referral/ReferralCapture";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <ReferralCapture />
      <RegisterForm />
    </main>
  );
}
