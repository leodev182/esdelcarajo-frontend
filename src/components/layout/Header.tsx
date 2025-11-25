"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, User, Menu, Search } from "lucide-react";
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
  const { user, isAuthenticated, login, logout } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const cartItemsCount = cart?.totalItems || 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-dark bg-white shadow-sm">
        <div className="container flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/rayitohd.svg"
              alt="Del Carajo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold tracking-tight">
              DEL CARAJO
            </span>
          </Link>

          <nav
            className="hidden lg:flex items-center gap-1"
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            {MAIN_CATEGORIES.map((category) => (
              <div
                key={category.slug}
                className="relative"
                onMouseEnter={() => setActiveMegaMenu(category.slug)}
              >
                <Link
                  href={`/catalogo/${category.slug}`}
                  className="px-6 py-2 text-base font-bold tracking-wide hover:text-primary transition-colors"
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
            <Button variant="ghost" size="icon" asChild>
              <Link href="/buscar">
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Link>
            </Button>

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
              <div className="hidden lg:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/perfil">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Salir
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={login}
                className="hidden lg:inline-flex"
              >
                Iniciar Sesión
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-dark">
            <nav className="container flex flex-col space-y-4 py-6 px-6">
              {MAIN_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/catalogo/${category.slug}`}
                  className="text-base font-bold hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/perfil"
                    className="text-base font-bold hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-base font-bold hover:text-primary transition-colors text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    login();
                  }}
                  className="text-base font-bold hover:text-primary transition-colors text-left"
                >
                  Iniciar Sesión
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}
