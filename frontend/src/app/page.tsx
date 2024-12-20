'use client';

import Link from "next/link";
import { SnackbarProvider } from "notistack";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center h-full py-2">
      <SnackbarProvider maxSnack={3}>

        <div className="flex flex-col items-center h-1/4 justify-between w-full">

          <h1 className="text-4xl font-bold text-center">
            Welcome to NYC Project
          </h1>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl py-4">You can go to the following pages:</h2>
            <div className="flex gap-4 mx-auto">
              <Link href={'/map'}>
                <div className="bg-slate-600 text-white font-semibold py-4 px-8 rounded-lg hover:opacity-50 transition-opacity hover:transition-opacity">
                  Map
                </div>
              </Link>
              <Link href={'/statistics'}>
                <div className="bg-slate-600 text-white font-semibold py-4 px-8 rounded-lg hover:opacity-50 transition-opacity hover:transition-opacity">
                  Statistics
                </div>
              </Link>
            </div>
          </div>
        </div>

      </SnackbarProvider>
    </div>
  );
}
