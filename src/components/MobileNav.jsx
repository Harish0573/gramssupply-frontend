import React from "react";
import { NavLink } from "react-router-dom";

import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  UserRound
} from "lucide-react";

import { useTranslation } from "react-i18next";
import "./MobileNav.css";

function MobileNav({ cartCount = 0 }) {
  const { t } = useTranslation();

  const links = [
    {
      to: "/",
      label: "Home",
      icon: Home
    },
    {
      to: "/products?view=categories",
      label: "Categories",
      icon: LayoutGrid
    },
    {
      to: "/wishlist",
      label: "Wishlist",
      icon: Heart
    },
    {
      to: "/cart",
      label: "Cart",
      icon: ShoppingCart
    },
    {
      to: "/account",
      label: "Account",
      icon: UserRound
    }
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile navigation"
    >
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="mobile-nav-icon">

            <Icon size={23} strokeWidth={1.8} />

            {to === "/cart" && cartCount > 0 && (
              <b className="mobile-cart-count">
                {cartCount}
              </b>
            )}

          </span>

          <span>{t(label)}</span>

        </NavLink>
      ))}
    </nav>
  );
}

export default MobileNav;