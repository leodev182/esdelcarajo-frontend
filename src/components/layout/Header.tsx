"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, User, Menu, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useCart } from "@/src/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/src/components/cart/CartDrawer";
import { GarageMenu } from "./GarageMenu";
import { useState, useEffect } from "react";

const MAIN_CATEGORIES = [
  { name: "CARAJOS", slug: "carajos" },
  { name: "CARAJAS", slug: "carajas" },
  { name: "CARAJITOS", slug: "carajitos" },
  { name: "OTRAS VAINAS", slug: "otras-vainas" },
];
export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);
  const garageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (garageRef.current && !garageRef.current.contains(e.target as Node)) {
        setGarageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = cart?.totalItems || 0;

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full shadow-sm backdrop-blur-md bg-black/30 border-b border-white/10 text-white"
        style={{ fontFamily: "var(--font-zuume-rough)", letterSpacing: "0.28em", fontSize: "2rem" }}
      >
        <div className="container flex h-auto py-2 items-center px-10 mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-devotos.png"
              alt="Del Carajo - Devotos del Arte"
              width={160}
              height={80}
              className="lg:hidden"
              style={{ width: "140px", height: "auto" }}
            />
            <Image
              src="/images/logo-devotos.png"
              alt="Del Carajo - Devotos del Arte"
              width={220}
              height={110}
              priority
              className="hidden lg:block"
              style={{ width: "220px", height: "auto" }}
            />
          </Link>

          {/* Desktop Navigation — mx-auto centra el grupo en el espacio restante */}
          <div className="hidden lg:flex items-center gap-10 mx-auto">
            <nav className="flex items-center gap-1">

              {/* GARAGE dropdown */}
              <div ref={garageRef} className="relative">
                <button
                  onClick={() => setGarageOpen((o) => !o)}
                  className="px-6 py-2 font-bold tracking-wide text-white hover:text-[#E1D7D7] transition-colors flex items-center gap-2"
                >
                  GARAGE
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${garageOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {garageOpen && (
                  <GarageMenu onClose={() => setGarageOpen(false)} />
                )}
              </div>
            </nav>

            <div className="flex items-center space-x-3">
              {mounted && isAuthenticated && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/favoritos">
                    <Heart className="h-5 w-5 text-white" />
                    <span className="sr-only">Favoritos</span>
                  </Link>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCartDrawerOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Carrito</span>
              </Button>

              {mounted &&
                (isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/perfil">
                        <User className="h-4 w-4 mr-2 text-white" />
                        <span className="text-white">{user?.nickname || user?.name}</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={logout} className="text-white">
                      Salir
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="text-white border border-white/30 hover:bg-white/10" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                ))}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3">
            {mounted && isAuthenticated && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/favoritos">
                  <Heart className="h-5 w-5 text-[#FF3500] hover:text-[#FF3500]/80" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartDrawerOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 text-[#FF3500] hover:text-[#FF3500]/80" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-[#FF3500] hover:text-[#FF3500]/80"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mounted && mobileMenuOpen && (
          <div className="lg:hidden backdrop-blur-md bg-black/30 border-t border-white/10 w-full">
            <nav className="flex flex-col py-4">
              {MAIN_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/catalogo/${category.slug}`}
                  className="px-6 py-3 text-base font-bold text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/perfil"
                    className="px-6 py-3 text-base font-bold text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="px-6 py-3 text-base font-bold text-white hover:bg-white/10 transition-colors text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-3 text-base font-bold text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}
