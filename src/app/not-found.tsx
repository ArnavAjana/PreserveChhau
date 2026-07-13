import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center"
      id="main-content"
    >
      <p className="font-display text-6xl font-bold text-laterite-700">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-laterite-900">
        This page has left the stage
      </h1>
      <p className="mt-4 max-w-md text-midnight-800">
        Like a dancer slipping behind the torchlight, the page you&apos;re
        looking for isn&apos;t here. The performance continues elsewhere.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-laterite-700 px-7 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-laterite-600"
      >
        Return home
      </Link>
    </main>
  );
}
