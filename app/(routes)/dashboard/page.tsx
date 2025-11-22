"use client";
import { LinkForm } from "@/components/LinkForm";
import { LinksTable } from "@/components/LinksTable";

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-neutral-900">

      {/* Header */}
      <section className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Manage all your TinyLink URLs  create, view, and delete short links.
        </p>
      </section>

      {/* Shorten Form */}
      <section className="mb-10">
        <div className="max-w-xl mx-auto">
          <LinkForm onCreated={() => {}} />
        </div>
      </section>

      {/* Links Table */}
      <section className="mt-6">
        <LinksTable />
      </section>
    </main>
  );
}
