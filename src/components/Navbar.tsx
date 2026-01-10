import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import RequestFormModal from "./RequestFormModal";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
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
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-2">
              {/* Product Accordion */}
              <button
                onClick={() => setMobileProductOpen(!mobileProductOpen)}
                className="flex items-center justify-between py-2 text-foreground font-medium"
              >
                Product
                <ChevronDown className={cn("w-4 h-4 transition-transform", mobileProductOpen && "rotate-180")} />
              </button>
              {mobileProductOpen && (
                <div className="pl-4 flex flex-col gap-2 pb-2">
                  <Link to="/features" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground py-1">
                    Features
                  </Link>
                  <button onClick={() => { scrollToSection("how-it-works"); setIsOpen(false); }} className="text-left text-muted-foreground hover:text-foreground py-1">
                    How It Works
                  </button>
                  <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground py-1">
                    Pricing
                  </Link>
                  <Link to="/api-access" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground py-1">
                    API Access
                  </Link>
                </div>
              )}

              {/* Resources Accordion */}
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="flex items-center justify-between py-2 text-foreground font-medium"
              >
                Resources
                <ChevronDown className={cn("w-4 h-4 transition-transform", mobileResourcesOpen && "rotate-180")} />
              </button>
              {mobileResourcesOpen && (
                <div className="pl-4 flex flex-col gap-2 pb-2">
                  <Link to="/foia-guide" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground py-1">
                    FOIA Guide
                  </Link>
                  <Link to="/blog" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground py-1">
                    Blog
                  </Link>
                  <Link to="/help" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground py-1">
                    Help Center
                  </Link>
                </div>
              )}

              <Link to="/about" onClick={() => setIsOpen(false)} className="py-2 text-foreground font-medium">
                About
              </Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="py-2 text-foreground font-medium">
                Contact
              </Link>

              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                {loading ? null : user ? (
                  <>
                    <Link to="/dashboard" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                    </Link>
                    <Button variant="ghost" onClick={handleSignOut} className="gap-2 justify-start">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                    <RequestFormModal>
                      <Button variant="hero" className="w-full">New Request</Button>
                    </RequestFormModal>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <RequestFormModal>
                      <Button variant="hero" className="w-full">Get Started</Button>
                    </RequestFormModal>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
