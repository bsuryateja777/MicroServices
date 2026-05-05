import React, { useState, useEffect } from 'react'
import HeaderBG from '../Assets/Header-bg.jpg'
import { AccountIcon, CartIcon, HomeIcon, MainIcon, ProductsIcon, WalletIcon } from '../Utils/Icons'
import { NavLink } from 'react-router-dom';

export default function Header() {

  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: "Home", path: "/home", icon: HomeIcon },
    { name: "Products", path: "/products", icon: ProductsIcon },
    { name: "Cart", path: "/cart", icon: CartIcon },
    { name: "wallet", path: "/wallet", icon: WalletIcon},
    { name: "Account", path: "/account", icon: AccountIcon },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 py-3 px-20 flex items-center justify-between transition-all duration-300 z-50
      ${scrolled ? "bg-white/20 backdrop-blur-md shadow-2xl" : "bg-cover bg-top text-black"}`}
      style={!scrolled ? { backgroundImage: `url(${HeaderBG})` } : {}}>

      {/* Logo Section */}
      <div className="flex items-center gap-4 text-4xl lora-font">
        <MainIcon />
        <span>Cloud Cart</span>
      </div>

      {/* Navigation Section */}
       <nav className="relative z-20 flex items-center gap-10 text-lg text-black">
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path} className={({ isActive }) => `flex items-begin justify-center gap-2 capitalize transition-all duration-200 font-noto
             ${ isActive ? "border-b-2 border-blue-600 scale-110" : "hover:scale-105 hover:text-blue-300" }`}>
            {item.name}
            {<item.icon />}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}