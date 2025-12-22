"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, User, Menu } from "lucide-react";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useCart } from "@/src/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/src/components/cart/CartDrawer";
import { MegaMenu } from "./MegaMenu";
import { useState } from "react";

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

  const cartItemsCount = cart?.totalItems || 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-transparent shadow-sm">
        <div className="container flex h-auto py-2 items-center justify-around px-10 mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* Mobile Logo */}
            <Image
              src="/Logo.svg"
              alt="Del Carajo"
              width={150}
              height={144}
              className="lg:hidden"
            />

            {/* Desktop Logo */}
            <Image
              src="/Logo.svg"
              alt="Del Carajo"
              width={150}
              height={50}
              className="hidden lg:block absolute bottom-[-30px]"
              style={{ width: "290px", height: "auto" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 bg-[#FF6501]">
            <nav
              className="flex items-center gap-1"
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              {MAIN_CATEGORIES.map((category) => (
                <div
                  key={category.slug}
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu(category.slug)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={`/catalogo/${category.slug}`}
                    className="px-6 py-2 text-xl font-bold tracking-wide text-white hover:text-[#E1D7D7] transition-colors inline-block"
                  >
                    {category.name}
                  </Link>

                  <MegaMenu
                    categorySlug={category.slug}
                    isOpen={activeMegaMenu === category.slug}
                  />
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/favoritos">
                    <Heart className="h-5 w-5" />
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
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Carrito</span>
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/perfil">
                      <User className="h-4 w-4 mr-2" />
                      {user?.nickname || user?.name}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Salir
                  </Button>
                </div>
              ) : (
                <Button variant="default" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3">
            {isAuthenticated && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/favoritos">
                  <Heart className="h-5 w-5 text-[#FF6501] hover:text-[#FF6501]/80" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartDrawerOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 text-[#FF6501] hover:text-[#FF6501]/80" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-[#FF6501] hover:text-[#FF6501]/80"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t-2 border-dark w-full">
            <nav className="flex flex-col py-4">
              {MAIN_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/catalogo/${category.slug}`}
                  className="px-6 py-3 text-base font-bold hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/perfil"
                    className="px-6 py-3 text-base font-bold hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="px-6 py-3 text-base font-bold hover:bg-gray-100 transition-colors text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-3 text-base font-bold hover:bg-gray-100 transition-colors"
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
