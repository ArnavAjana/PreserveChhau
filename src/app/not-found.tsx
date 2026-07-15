import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center"
      id="main-content"
    >
      <p className="font-display text-6xl font-bold text-laterite-700">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-laterite-900">
        This page is missing
      </h1>
      <p className="mt-4 max-w-md text-midnight-800">
        The address does not lead to a page. Return home or open the eBook from
        the main menu.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-laterite-700 px-7 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-laterite-600"
      >
        Go to the home page
      </Link>
    </main>
  );
}
