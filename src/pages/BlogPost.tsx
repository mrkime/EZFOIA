import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  read_time: string | null;
  created_at: string;
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Guide: "bg-green-500/20 text-green-400 border-green-500/30",
      Legal: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Case Study": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      Analysis: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      Trends: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      News: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create article schema for blog post
  const articleSchema = post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image_url || "https://ezfoia.lovable.app/og-image.png",
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: {
      "@type": "Organization",
      name: "EZFOIA"
    },
    publisher: {
      "@type": "Organization",
      name: "EZFOIA",
      logo: {
        "@type": "ImageObject",
        url: "https://ezfoia.lovable.app/favicon.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ezfoia.lovable.app/blog/${post.slug}`
    }
  } : undefined;

  return (
    <div className="min-h-screen bg-background">
      {post && (
        <SEO
          title={post.title}
          description={post.excerpt}
          url={`/blog/${post.slug}`}
          type="article"
          publishedTime={post.created_at}
          section={post.category}
          image={post.image_url || undefined}
          keywords={`FOIA, ${post.category}, public records, ${post.title.toLowerCase()}`}
          jsonLd={articleSchema}
        />
      )}
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : !post ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Article Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/blog">
                <Button variant="hero">Browse All Articles</Button>
              </Link>
            </div>
          ) : (
            <article>
              <Badge className={`mb-4 ${getCategoryColor(post.category)}`}>
                {post.category}
              </Badge>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.created_at)}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.read_time}
                  </span>
                )}
              </div>

              {post.image_url && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
                <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostPage;