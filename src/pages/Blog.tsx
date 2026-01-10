import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

const Blog = () => {
  const featuredPost = {
    title: "The Future of Government Transparency: AI-Powered FOIA Requests",
    excerpt: "How artificial intelligence is revolutionizing the way citizens access public records and hold their government accountable.",
    date: "January 8, 2026",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  };

  const posts = [
    {
      title: "5 Tips for Writing Effective FOIA Requests",
      excerpt: "Learn the best practices for crafting requests that get results faster.",
      date: "January 5, 2026",
      readTime: "5 min read",
      category: "Guide",
    },
    {
      title: "Understanding State-Level Open Records Laws",
      excerpt: "A comprehensive look at how FOIA equivalents vary across all 50 states.",
      date: "January 2, 2026",
      readTime: "12 min read",
      category: "Legal",
    },
    {
      title: "Case Study: How Journalists Used FOIA to Uncover Corruption",
      excerpt: "Real-world examples of investigative journalism powered by public records.",
      date: "December 28, 2025",
      readTime: "7 min read",
      category: "Case Study",
    },
    {
      title: "FOIA Response Times: What to Expect in 2026",
      excerpt: "Analyzing agency response patterns and how to plan your requests accordingly.",
      date: "December 22, 2025",
      readTime: "6 min read",
      category: "Analysis",
    },
    {
      title: "Appealing a FOIA Denial: A Step-by-Step Guide",
      excerpt: "Don't give up when your request is denied. Here's how to fight back effectively.",
      date: "December 18, 2025",
      readTime: "9 min read",
      category: "Guide",
    },
    {
      title: "The Most Requested Records of 2025",
      excerpt: "A look at the topics and agencies that saw the most FOIA activity this year.",
      date: "December 15, 2025",
      readTime: "4 min read",
      category: "Trends",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Guide: "bg-green-500/20 text-green-400 border-green-500/30",
      Legal: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Case Study": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      Analysis: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      Trends: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">EZFOIA Blog</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Insights & Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert guides, industry news, and tips to help you navigate the world of 
            public records and government transparency.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-card border-border overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-muted">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className={`w-fit mb-4 ${getCategoryColor(featuredPost.category)}`}>
                  {featuredPost.category}
                </Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <Button variant="hero" className="w-fit">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
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
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">Load More Articles</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
