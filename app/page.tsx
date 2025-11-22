import { LinkForm } from "@/components/LinkForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gray-50 dark:bg-neutral-900">
      
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          TinyLink
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Create short, trackable URLs instantly  fast and free.
        </p>
      </section>

      {/* URL Shortener Form */}
      <section className="w-full max-w-xl">
        <LinkForm />
      </section>

      
    </main>
  );
}
