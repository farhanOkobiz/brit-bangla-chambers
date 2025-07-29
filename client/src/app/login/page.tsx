import LoginForm from "@/components/Form/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10">
        <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">
          Login
        </h2>
        <LoginForm />
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </section>
  );
}
