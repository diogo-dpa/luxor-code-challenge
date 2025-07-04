import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageWrapperProps {
  title: string;
  actionText?: string;
  actionLink?: string;
  children: React.ReactNode;
}

export function PageWrapper({
  children,
  title,
  actionText,
  actionLink,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="flex items-center justify-between px-8">
          <h1 className="text-3xl">{title}</h1>
          {actionText && actionLink && (
            <Button className="cursor-pointer">
              <Link href={actionLink} className="text-white">
                {actionText}
              </Link>
            </Button>
          )}
        </section>
        <div className="py-4">{children}</div>
      </main>
      <footer className="w-full flex justify-center p-4 bg-gray-100">
        <p className="text-gray-500 text-sm">
          Created by{" "}
          <a
            href="https://github.com/diogo-dpa"
            className="text-blue-500 ml-1 hover:underline">
            Diogo Almazan
          </a>
        </p>
      </footer>
    </div>
  );
}
