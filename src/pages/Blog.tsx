import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  is_featured: boolean;
  read_time: string | null;
  created_at: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, image_url, is_featured, read_time, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const featuredPost = posts.find((p) => p.is_featured) || posts[0];
  const otherPosts = posts.filter((p) => p.id !== featuredPost?.id);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="EZFOIA Blog"
        badgeIcon={BookOpen}
        title="Insights &"
        titleHighlight="Resources"
        description="Expert guides, industry news, and tips to help you navigate the world of public records and government transparency."
      />

      {loading ? (
        <section className="py-8 px-6">
          <div className="container mx-auto max-w-6xl space-y-8">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-8 px-6">
              <div className="container mx-auto max-w-6xl">
                <Link to={`/blog/${featuredPost.slug}`}>
                  <Card className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="grid md:grid-cols-2">
                      <div className="aspect-video md:aspect-auto bg-muted">
                        {featuredPost.image_url ? (
                          <img 
                            src={featuredPost.image_url} 
                            alt={featuredPost.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <BookOpen className="w-16 h-16 text-primary/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <Badge className={`w-fit mb-4 ${getCategoryColor(featuredPost.category)}`}>
                          {featuredPost.category}
                        </Badge>
                        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredPost.created_at)}
                          </span>
                          {featuredPost.read_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {featuredPost.read_time}
                            </span>
                          )}
                        </div>
                        <Button variant="hero" className="w-fit">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </section>
          )}

          {/* All Posts */}
          {otherPosts.length > 0 && (
            <section className="py-16 px-6">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-display text-2xl font-bold mb-8">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group h-full">
                        <CardHeader>
                          <Badge className={`w-fit mb-2 ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </Badge>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">{post.excerpt}</CardDescription>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.created_at)}
                            </span>
                            {post.read_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.read_time}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Blog;
