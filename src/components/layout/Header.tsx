"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Menu, Search } from "lucide-react";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useCart } from "@/src/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart?.totalItems || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">DEL CARAJO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/catalogo/carajos"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            CARAJOS
          </Link>
          <Link
            href="/catalogo/carajas"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            CARAJAS
          </Link>
          <Link
            href="/catalogo/carajitos"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            CARAJITOS
          </Link>
          <Link
            href="/catalogo/otras-vainas"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            OTRAS VAINAS
          </Link>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/buscar">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Link>
          </Button>

          {/* Favorites */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favoritos">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favoritos</span>
              </Link>
            </Button>
          )}

          {/* Cart with Badge */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/carrito">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
              <span className="sr-only">Carrito</span>
            </Link>
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
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
              className="hidden md:inline-flex"
            >
              Iniciar Sesión
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menú</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link
              href="/catalogo/carajos"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              CARAJOS
            </Link>
            <Link
              href="/catalogo/carajas"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              CARAJAS
            </Link>
            <Link
              href="/catalogo/carajitos"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              CARAJITOS
            </Link>
            <Link
              href="/catalogo/otras-vainas"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              OTRAS VAINAS
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/perfil"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-sm font-medium hover:text-primary transition-colors text-left"
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
                className="text-sm font-medium hover:text-primary transition-colors text-left"
              >
                Iniciar Sesión
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
