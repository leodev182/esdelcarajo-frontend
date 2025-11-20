import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">DEL CARAJO</h3>
            <p className="text-sm text-muted-foreground">Devotos del Arte</p>
            <p className="text-sm text-muted-foreground">
              Ropa urbana venezolana con actitud.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Tienda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/catalogo/carajos"
                  className="hover:text-primary transition-colors"
                >
                  Carajos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo/carajas"
                  className="hover:text-primary transition-colors"
                >
                  Carajas
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo/carajitos"
                  className="hover:text-primary transition-colors"
                >
                  Carajitos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo/otras-vainas"
                  className="hover:text-primary transition-colors"
                >
                  Otras Vainas
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Ayuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/perfil/ordenes"
                  className="hover:text-primary transition-colors"
                >
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link
                  href="/favoritos"
                  className="hover:text-primary transition-colors"
                >
                  Favoritos
                </Link>
              </li>
              <li>
                <Link
                  href="/carrito"
                  className="hover:text-primary transition-colors"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contacto</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/esdelcarajo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="mailto:contacto@esdelcarajo.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
            <p className="text-xs text-muted-foreground">@esdelcarajo</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Del Carajo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
