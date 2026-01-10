import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logger } from "@/lib/logger";
import { Search, Home, FileText, HelpCircle, ArrowLeft, BookOpen, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const quickLinks = [
  { icon: Home, label: "Home", href: "/", description: "Return to the main page" },
  { icon: FileText, label: "Submit Request", href: "/#request", description: "File a new FOIA request" },
  { icon: BookOpen, label: "FOIA Guide", href: "/foia-guide", description: "Learn about FOIA process" },
  { icon: HelpCircle, label: "Help Center", href: "/help", description: "Find answers to common questions" },
  { icon: MessageSquare, label: "Contact Us", href: "/contact", description: "Get in touch with our team" },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    logger.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/help?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* 404 Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-[12rem] sm:text-[16rem] font-bold leading-none text-gradient select-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              404
            </motion.h1>
            <motion.div
              className="h-1 w-32 mx-auto bg-cta-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.div>

          {/* Error message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>
            <p className="text-muted-foreground/70 text-sm mt-2 font-mono">
              {location.pathname}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch}
            className="mb-12"
          >
            <div className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button type="submit" className="bg-cta-gradient hover:opacity-90">
                Search
              </Button>
            </div>
          </motion.form>

          {/* Quick navigation links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="group flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/50 hover:bg-card transition-all duration-200"
                  >
                    <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {link.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
