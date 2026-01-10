import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

const AnimatedGridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle background tint for light mode contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-primary/[0.02] dark:from-primary/[0.05] dark:to-transparent" />
      
      {/* Base grid pattern - stronger in light mode */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Animated glow lines - horizontal - stronger for light mode */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-[2px] dark:h-[1px] left-0 right-0"
          style={{ 
            top: `${25 + i * 25}%`,
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.8), transparent)',
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ 
            x: ['100%', '-100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Animated glow lines - vertical - stronger for light mode */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-[2px] dark:w-[1px] top-0 bottom-0"
          style={{ 
            left: `${35 + i * 30}%`,
            background: 'linear-gradient(180deg, transparent, hsl(var(--primary) / 0.7), transparent)',
          }}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ 
            y: ['100%', '-100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Grid intersection glows - stronger in light mode */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            left: `${20 + (i % 2) * 50}%`,
            top: `${25 + Math.floor(i / 2) * 40}%`,
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Corner accent gradients - enhanced for light mode */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 dark:from-primary/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/10 dark:from-primary/5 to-transparent" />
      
      {/* Bottom edge fade for section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

interface PageHeaderProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  titleHighlight?: string;
  description?: string;
  centered?: boolean;
  children?: React.ReactNode;
}

const PageHeader = ({ 
  badge, 
  badgeIcon: BadgeIcon, 
  title, 
  titleHighlight, 
  description,
  centered = true,
  children
}: PageHeaderProps) => {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <AnimatedGridBackground />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={`max-w-4xl ${centered ? 'mx-auto text-center' : ''}`}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
          >
            <BadgeIcon className="w-4 h-4" />
            {badge}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            {title}{' '}
            {titleHighlight && (
              <span className="text-gradient">{titleHighlight}</span>
            )}
          </motion.h1>
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
