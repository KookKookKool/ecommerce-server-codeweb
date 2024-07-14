import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import { StoreSwitcher } from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { Bell, Package2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export const Navbar = async () => {
    const { userId } = auth();
  
    if (!userId) {
      redirect("/sign-in");
    }
  
    const storeSnap = await getDocs(
      query(collection(db, "stores"), where("userId", "==", userId))
    );
  
    let stores = [] as Store[];
  
    storeSnap.forEach((doc) => {
      stores.push(doc.data() as Store);
    });
  
    return (
      <div className="sticky top-0 z-50 bg-muted/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex bg-white h-14 items-center border-b px-4 lg:h-[60px] md:px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Package2 className="h-8 w-8" />
              <StoreSwitcher items={stores} />
            </div>
            <div className="mt-auto p-4 z-80">
                  <UserButton afterSignOutUrl="/" />
                </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8 ">
                  <Menu className="h-8 w-8" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col ">
                <nav className="grid items-start px-2 text-sm font-medium md:px-4">
                  <MainNav />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* <div className="sticky top-0 hidden md:flex flex-1">
            <nav className="grid items-start px-2 text-sm font-medium md:px-4">
              <MainNav />
            </nav>
          </div>
          <div className="mt-auto p-4 hidden md:block">
            <UserButton afterSignOutUrl="/" />
          </div> */}
        </div>
      </div>
    );
  };
  