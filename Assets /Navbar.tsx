import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';
import whiteLogo from './vestore-v1-white.svg';

const NAV_LINKS = [
  { label: 'Calculator', href: '#calculator' },
  { label: 'Product', href: '#product' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
];

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="group relative p-2 rounded-full text-vestora-charcoal/80 hover:text-vestora-forest hover:bg-vestora-sage/10 transition-colors dark:text-vestora-neutral/80 dark:hover:text-vestora-growth dark:hover:bg-vestora-sage/20"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-vestora-charcoal dark:bg-vestora-neutral px-2 py-1 text-xs text-white dark:text-vestora-charcoal opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50">
        Toggle Dark Mode
      </span>
    </motion.button>
  );
};

const Logo = ({ className = "" }: { className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`flex items-center cursor-pointer ${className}`}
  >
    <img
      src={whiteLogo}
      alt="Vestora"
      className="h-10 w-auto object-contain translate-y-1"
    />
  </motion.div>
);

const Button = ({
  children,
  variant = 'primary',
  className = "",
  icon = false,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  icon?: boolean;
  [key: string]: any;
}) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 text-sm";
  const variants = {
    primary: "bg-vestora-forest text-white hover:bg-vestora-forest/90 shadow-vestora-sm hover:shadow-vestora dark:bg-vestora-growth dark:text-vestora-charcoal dark:hover:bg-vestora-growth/90",
    secondary: "bg-vestora-sage/20 text-vestora-forest hover:bg-vestora-sage/30 dark:bg-vestora-sage/20 dark:text-vestora-neutral dark:hover:bg-vestora-sage/30",
    outline: "border border-vestora-sage/40 text-vestora-charcoal hover:border-vestora-forest hover:text-vestora-forest dark:border-vestora-sage/40 dark:text-vestora-neutral dark:hover:border-vestora-growth dark:hover:text-vestora-growth",
    ghost: "text-vestora-sage hover:text-vestora-forest hover:bg-vestora-sage/10 dark:text-vestora-sage dark:hover:text-vestora-growth dark:hover:bg-vestora-sage/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <ArrowRight className="w-4 h-4" />}
    </motion.button>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileMenuOpen]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-vestora-white/80 dark:bg-[#0B120E]/80 backdrop-blur-md border-b border-vestora-sage/20 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-sm font-medium text-vestora-charcoal/80 hover:text-vestora-forest dark:text-vestora-neutral/80 dark:hover:text-vestora-growth transition-colors inline-block"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost">Sign In</Button>
            <Button variant="primary">Get Early Access</Button>
          </div>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-vestora-charcoal dark:text-vestora-neutral hover:bg-vestora-sage/10 rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile menu"
          title="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-vestora-charcoal/40 dark:bg-black/60 backdrop-blur-sm z-50 md:hidden"
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-dvh w-[85vw] max-w-sm bg-vestora-white dark:bg-[#0B120E] z-50 shadow-2xl border-l border-vestora-sage/20 flex flex-col md:hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-vestora-sage/10">
                <Logo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="group relative p-2 -mr-2 text-vestora-charcoal dark:text-vestora-neutral rounded-full hover:bg-vestora-sage/10 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6" />
                  <span className="absolute top-full mt-2 right-0 whitespace-nowrap rounded-md bg-vestora-charcoal dark:bg-vestora-neutral px-2 py-1 text-xs text-white dark:text-vestora-charcoal opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50">
                    Close Menu
                  </span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                <nav className="flex flex-col gap-6">
                  {NAV_LINKS.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      whileHover={{ x: 10 }}
                      className="text-xl font-medium text-vestora-charcoal dark:text-vestora-neutral hover:text-vestora-forest dark:hover:text-vestora-growth transition-colors inline-block"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-vestora-sage/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-vestora-sage">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button variant="outline" className="w-full justify-center">Sign In</Button>
                  <Button variant="primary" className="w-full justify-center">Get Early Access</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
