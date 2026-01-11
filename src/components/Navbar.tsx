import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RequestFormModal from "./RequestFormModal";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileProductOpen(false);
    setMobileResourcesOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const scrollToSection = (id: string) => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Product Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Product</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-1 p-3 bg-popover">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/features"
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Features</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              Explore all EZFOIA capabilities
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => scrollToSection("how-it-works")}
                            className="w-full text-left block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">How It Works</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              See our simple 4-step process
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/pricing"
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Pricing</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              Flexible plans for every need
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/api-access"
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">API Access</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              Integrate FOIA into your apps
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-1 p-3 bg-popover">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/foia-guide"
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">FOIA Guide</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              Learn about FOIA and your rights
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/blog"
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Blog</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              News, tips, and transparency insights
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/help"
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Help Center</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              FAQs and support resources
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Company Links */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/about"
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      )}
                    >
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/contact"
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      )}
                    >
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {loading ? null : user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="w-4 h-4" />
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border w-48">
                    <DropdownMenuItem asChild className="cursor-pointer p-0">
                      <ThemeToggle />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <RequestFormModal>
                  <Button variant="hero">New Request</Button>
                </RequestFormModal>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <RequestFormModal>
                  <Button variant="hero">Get Started</Button>
                </RequestFormModal>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-foreground p-2 -mr-2 rounded-lg active:bg-accent/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="pb-6 border-t border-border pt-4 mt-4">
                <nav className="flex flex-col gap-1">
                  {/* Product Accordion */}
                  <motion.button
                    onClick={() => setMobileProductOpen(!mobileProductOpen)}
                    className="flex items-center justify-between py-4 px-2 text-foreground font-medium rounded-lg active:bg-accent/50 transition-colors touch-manipulation"
                    whileTap={{ scale: 0.98 }}
                  >
                    Product
                    <motion.div
                      animate={{ rotate: mobileProductOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {mobileProductOpen && (
                      <motion.div 
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pl-4 flex flex-col gap-1 pb-2">
                          {[
                            { to: "/features", label: "Features" },
                            { action: () => scrollToSection("how-it-works"), label: "How It Works" },
                            { to: "/pricing", label: "Pricing" },
                            { to: "/api-access", label: "API Access" },
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              {item.to ? (
                                <Link 
                                  to={item.to} 
                                  className="block text-muted-foreground hover:text-foreground py-3 px-2 rounded-lg active:bg-accent/50 transition-colors touch-manipulation"
                                >
                                  {item.label}
                                </Link>
                              ) : (
                                <button 
                                  onClick={item.action} 
                                  className="w-full text-left text-muted-foreground hover:text-foreground py-3 px-2 rounded-lg active:bg-accent/50 transition-colors touch-manipulation"
                                >
                                  {item.label}
                                </button>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Resources Accordion */}
                  <motion.button
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                    className="flex items-center justify-between py-4 px-2 text-foreground font-medium rounded-lg active:bg-accent/50 transition-colors touch-manipulation"
                    whileTap={{ scale: 0.98 }}
                  >
                    Resources
                    <motion.div
                      animate={{ rotate: mobileResourcesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {mobileResourcesOpen && (
                      <motion.div 
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pl-4 flex flex-col gap-1 pb-2">
                          {[
                            { to: "/foia-guide", label: "FOIA Guide" },
                            { to: "/blog", label: "Blog" },
                            { to: "/help", label: "Help Center" },
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link 
                                to={item.to} 
                                className="block text-muted-foreground hover:text-foreground py-3 px-2 rounded-lg active:bg-accent/50 transition-colors touch-manipulation"
                              >
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Link 
                    to="/about" 
                    className="py-4 px-2 text-foreground font-medium rounded-lg active:bg-accent/50 transition-colors touch-manipulation"
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="py-4 px-2 text-foreground font-medium rounded-lg active:bg-accent/50 transition-colors touch-manipulation"
                  >
                    Contact
                  </Link>

                  <div className="flex flex-col gap-3 pt-4 border-t border-border mt-3">
                    {loading ? null : user ? (
                      <>
                        <Link to="/dashboard" className="w-full">
                          <Button variant="ghost" className="w-full justify-start h-12">Dashboard</Button>
                        </Link>
                        <Button variant="ghost" onClick={handleSignOut} className="gap-2 justify-start h-12">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Button>
                        <RequestFormModal>
                          <Button variant="hero" className="w-full h-12">New Request</Button>
                        </RequestFormModal>
                      </>
                    ) : (
                      <>
                        <Link to="/auth">
                          <Button variant="ghost" className="w-full h-12">Sign In</Button>
                        </Link>
                        <RequestFormModal>
                          <Button variant="hero" className="w-full h-12">Get Started</Button>
                        </RequestFormModal>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
