'use client';

import Link from "next/link";
import { SnackbarProvider } from "notistack";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen py-2">
      <SnackbarProvider maxSnack={3}>
        Hello world

        <div className="flex gap-4">
          <Link href={'/map'}>
            Map
          </Link>
          <Link href={'/statistics'}>
            Statistics
          </Link>
        </div>
      </SnackbarProvider>
    </div>
  );
}
