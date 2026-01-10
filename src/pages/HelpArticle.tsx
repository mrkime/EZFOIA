import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, HelpCircle, ChevronRight, FileText, CreditCard, User, Settings } from "lucide-react";
import AIChatbot from "@/components/help/AIChatbot";

type HelpArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "FOIA Requests": FileText,
  "Billing & Plans": CreditCard,
  "Account": User,
  "Technical": Settings,
  "General": HelpCircle,
};

const HelpArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<HelpArticle[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (slug) {
        // Fetch single article
        const { data: articleData } = await supabase
          .from("help_articles")
          .select("id, title, slug, content, category")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (articleData) {
          setArticle(articleData);
          
          // Fetch related articles from same category
          const { data: relatedData } = await supabase
            .from("help_articles")
            .select("id, title, slug, content, category")
            .eq("category", articleData.category)
            .eq("is_published", true)
            .neq("id", articleData.id)
            .order("sort_order")
            .limit(5);

          if (relatedData) {
            setRelatedArticles(relatedData);
          }
        }
      } else if (category) {
        // Fetch all articles in category
        const { data: categoryData } = await supabase
          .from("help_articles")
          .select("id, title, slug, content, category")
          .eq("category", category)
          .eq("is_published", true)
          .order("sort_order");

        if (categoryData) {
          setCategoryArticles(categoryData);
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [slug, category]);

  const IconComponent = category ? (CATEGORY_ICONS[category] || HelpCircle) : HelpCircle;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/help">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : slug && article ? (
            // Single Article View
            <div>
              <div className="mb-8">
                <p className="text-sm text-primary mb-2">{article.category}</p>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  {article.title}
                </h1>
              </div>

              <div className="prose prose-invert max-w-none mb-12">
                <div className="text-foreground whitespace-pre-wrap leading-relaxed text-lg">
                  {article.content}
                </div>
              </div>

              {relatedArticles.length > 0 && (
                <div className="border-t border-border pt-8">
                  <h2 className="font-display text-xl font-bold mb-4">Related Articles</h2>
                  <Card className="bg-card border-border">
                    <CardContent className="p-0">
                      {relatedArticles.map((related, index) => (
                        <Link
                          key={related.id}
                          to={`/help/article/${related.slug}`}
                          className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                            index !== relatedArticles.length - 1 ? "border-b border-border" : ""
                          }`}
                        >
                          <span className="text-foreground">{related.title}</span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : category ? (
            // Category View
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold">{category}</h1>
                  <p className="text-muted-foreground">
                    {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {categoryArticles.length === 0 ? (
                <p className="text-muted-foreground">No articles in this category yet.</p>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-0">
                    {categoryArticles.map((article, index) => (
                      <Link
                        key={article.id}
                        to={`/help/article/${article.slug}`}
                        className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                          index !== categoryArticles.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        <span className="text-foreground">{article.title}</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            // Not Found
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Article Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/help">
                <Button variant="hero">Browse Help Center</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default HelpArticlePage;