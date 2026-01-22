import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
  variant?: "default" | "chat" | "compact";
}

const MarkdownContent = ({ content, className, variant = "default" }: MarkdownContentProps) => {
  const baseTextClass = variant === "compact" ? "text-xs" : "text-sm";
  
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h3 className={cn("font-semibold text-foreground mt-3 mb-1", variant === "compact" ? "text-sm" : "text-base")}>
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className={cn("font-semibold text-foreground mt-3 mb-1", baseTextClass)}>
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className={cn("font-medium text-foreground mt-2 mb-1", baseTextClass)}>
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className={cn("leading-relaxed mb-2", baseTextClass)}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className={cn("list-disc pl-4 mb-2 space-y-1", baseTextClass)}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={cn("list-decimal pl-4 mb-2 space-y-1", baseTextClass)}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={cn("leading-relaxed", baseTextClass)}>
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs mb-2">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground mb-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
