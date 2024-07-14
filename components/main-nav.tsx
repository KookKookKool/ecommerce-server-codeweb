"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const routes = [
    { href: `/${params.storeId}`, label: "Overview", active: pathname === `/${params.storeId}` },
    { href: `/${params.storeId}/billboards`, label: "Billboards", active: pathname === `/${params.storeId}/billboards` },
    { href: `/${params.storeId}/categories`, label: "Categories", active: pathname === `/${params.storeId}/categories` },
    { href: `/${params.storeId}/sizes`, label: "Package", active: pathname === `/${params.storeId}/sizes` },
    { href: `/${params.storeId}/products`, label: "Products", active: pathname === `/${params.storeId}/products` },
    { href: `/${params.storeId}/blog`, label: "Blog", active: pathname === `/${params.storeId}/blog` },
    { href: `/${params.storeId}/orders`, label: "Orders", active: pathname === `/${params.storeId}/orders` },
    { href: `/${params.storeId}/settings`, label: "Settings", active: pathname === `/${params.storeId}/settings` },
  ];

  return (
    <nav className={cn("flex flex-col space-y-2 px-4 py-2", className)} {...props}>
      {routes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            route.active ? "bg-red-300 text-primary font-bold" : ""
          )}
        >
          {route.label}
        </a>
      ))}
    </nav>
  );
};
