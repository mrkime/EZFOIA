import { ClipboardList, Send, Bell, FileSearch } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Submit Your Info",
    description: "Tell us what records you need and from which agency. As simple as filling out an online form.",
  },
  {
    icon: Send,
    step: "02",
    title: "We File For You",
    description: "Our team handles all the paperwork, proper formatting, and submission to the right agencies.",
  },
  {
    icon: Bell,
    step: "03",
    title: "Track Progress",
    description: "Receive real-time SMS updates as your request moves through the process.",
  },
  {
    icon: FileSearch,
    step: "04",
    title: "Search & Analyze",
    description: "Once approved, our AI scans your documents so you can search and find exactly what you need.",
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Animated connector line */}
      {index < steps.length - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.4 }}
          className="hidden lg:block absolute top-16 left-[65%] w-[70%] h-[2px] origin-left"
          style={{
            background: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.3) 50%, transparent 100%)",
          }}
        />
      )}

      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 h-full"
      >
        {/* Animated background gradient on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 0.8,
          }}
          transition={{ duration: 0.4 }}
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
        />

        {/* Step number with animated ring */}
        <div className="relative flex items-center gap-4 mb-6">
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-primary/30"
              animate={{
                scale: isHovered ? 1.15 : 1,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            {/* Icon container */}
            <motion.div
              className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center relative z-10"
              animate={{
                backgroundColor: isHovered ? "hsl(var(--primary) / 0.2)" : "hsl(var(--primary) / 0.1)",
              }}
            >
              <step.icon className="w-7 h-7 text-primary" />
            </motion.div>
          </div>

          {/* Step number with pulse effect */}
          <motion.span
            className="font-display text-5xl font-bold text-muted-foreground/20"
            animate={{
              color: isHovered ? "hsl(var(--primary) / 0.4)" : "hsl(var(--muted-foreground) / 0.2)",
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {step.step}
          </motion.span>
        </div>

        {/* Title with underline animation */}
        <div className="relative mb-3">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {step.title}
          </h3>
          <motion.div
            className="h-0.5 bg-primary rounded-full mt-2"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "100%" : "40%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">{step.description}</p>

        {/* Progress indicator dot */}
        <motion.div
          className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-primary/50"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: isHovered ? 1 : 0.5,
          }}
          transition={{
            duration: 0.6,
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 bg-background dark:bg-background overflow-hidden relative">
      {/* Section dividers for light mode */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6" ref={sectionRef}>
        {/* Header with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block text-primary font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
          >
            How It Works
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display text-3xl md:text-5xl font-bold mt-6 mb-6"
          >
            Four Simple Steps to{' '}
            <span className="text-gradient">Transparency</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            We've streamlined the entire FOIA process so you can focus on what matters—getting the information you need.
          </motion.p>
        </motion.div>

        {/* Progress bar for mobile */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="lg:hidden h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full mb-12 origin-left"
        />

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
