import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";
import Link from "next/link";

export default function SharedLayout({children}: {children:ReactNode}){

    return(
        <main className="min-h-screen flex flex-col">
            <Navbar/>
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
            <footer className="border-t py-8 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Resumaide
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your professional achievement manager
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 md:items-end">
                    <div className="flex items-center gap-4 text-sm">
                      <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                        Privacy
                      </Link>
                      <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                        Terms
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      © 2026 Resumaide. MIT License.
                    </p>
                  </div>
                </div>
              </div>
            </footer> 
        </main>
    )
}
