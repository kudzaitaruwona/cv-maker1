import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayout({children}: {children:ReactNode}){

    return(
        <main className="min-h-screen flex flex-col">
            <Navbar/>
            <div className="flex-1 flex flex-col gap-20 max-w-5xl mx-auto px-5 w-full">
                {children}
            </div>
            <footer className="border-t py-8 mt-auto">
              <div className="max-w-5xl mx-auto px-5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Resu<span className="text-blue-500">Me</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your professional achievement manager
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    © 2026 ResuMe. MIT License.
                  </p>
                </div>
              </div>
            </footer> 
        </main>
    )
}
