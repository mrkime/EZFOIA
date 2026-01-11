import { useInView } from "framer-motion";
import { useRef, RefObject } from "react";

interface UseScrollAnimationOptions {
  once?: boolean;
  margin?: `${number}px` | `${number}px ${number}px` | `${number}px ${number}px ${number}px ${number}px`;
  amount?: "some" | "all" | number;
}

interface ScrollAnimationResult {
  ref: RefObject<HTMLDivElement | null>;
  isInView: boolean;
  animationProps: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    transition: { duration: number; delay: number; ease: string };
  };
}

/**
 * Custom hook for scroll-triggered animations
 * Works great on mobile with touch scroll
 */
export const useScrollAnimation = (
  delay: number = 0,
  options: UseScrollAnimationOptions = {}
): ScrollAnimationResult => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: options.margin ?? "-50px",
    amount: options.amount ?? "some",
  });

  const animationProps = {
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: {
      duration: 0.5,
      delay: delay,
      ease: "easeOut",
    },
  };

  return { ref, isInView, animationProps };
};

/**
 * Hook for staggered scroll animations on lists
 */
export const useStaggerAnimation = (
  index: number,
  baseDelay: number = 0,
  staggerDelay: number = 0.1,
  options: UseScrollAnimationOptions = {}
) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: options.margin ?? "-30px",
    amount: options.amount ?? "some",
  });

  const animationProps = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: isInView 
      ? { opacity: 1, y: 0, scale: 1 } 
      : { opacity: 0, y: 40, scale: 0.95 },
    transition: {
      duration: 0.5,
      delay: baseDelay + index * staggerDelay,
      ease: [0.25, 0.1, 0.25, 1],
    },
  };

  return { ref, isInView, animationProps };
};

/**
 * Hook for slide-in animations from different directions
 */
export const useSlideAnimation = (
  direction: "left" | "right" | "up" | "down" = "up",
  delay: number = 0,
  options: UseScrollAnimationOptions = {}
) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: options.margin ?? "-50px",
    amount: options.amount ?? "some",
  });

  const getInitialTransform = () => {
    switch (direction) {
      case "left":
        return { x: -50, y: 0 };
      case "right":
        return { x: 50, y: 0 };
      case "up":
        return { x: 0, y: 50 };
      case "down":
        return { x: 0, y: -50 };
    }
  };

  const initial = getInitialTransform();

  const animationProps = {
    initial: { opacity: 0, ...initial },
    animate: isInView 
      ? { opacity: 1, x: 0, y: 0 } 
      : { opacity: 0, ...initial },
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.1, 0.25, 1],
    },
  };

  return { ref, isInView, animationProps };
};

export default useScrollAnimation;
