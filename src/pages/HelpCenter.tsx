import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  HelpCircle, 
  FileText, 
  CreditCard, 
  User, 
  Settings, 
  MessageCircle, 
  Search,
  ChevronRight,
  Mail,
  Phone
} from "lucide-react";
import AIChatbot from "@/components/help/AIChatbot";

type HelpArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  is_faq: boolean;
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "FOIA Requests": FileText,
  "Billing & Plans": CreditCard,
  "Account": User,
  "Technical": Settings,
  "General": HelpCircle,
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("help_articles")
        .select("id, title, slug, content, category, is_faq")
        .eq("is_published", true)
        .order("sort_order");

      if (!error && data) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // Group articles by category
  const categories = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, HelpArticle[]>);

  const faqs = articles.filter((a) => a.is_faq);
  const popularArticles = articles.filter((a) => !a.is_faq).slice(0, 8);

  // Filter articles based on search
  const filteredArticles = searchQuery.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageHeader
        badge="Help Center"
        badgeIcon={HelpCircle}
        title="How can we"
        titleHighlight="help you?"
      >
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-background"
          />
        </div>
      </PageHeader>

      {/* Search Results */}
      {searchQuery.trim() && (
        <section className="py-8 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-display text-xl font-bold mb-4">
              Search Results ({filteredArticles.length})
            </h2>
            {filteredArticles.length === 0 ? (
              <p className="text-muted-foreground">No articles found matching your search.</p>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  {filteredArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      to={`/help/article/${article.slug}`}
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                        index !== filteredArticles.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div>
                        <span className="text-foreground font-medium">{article.title}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({article.category})</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {loading ? (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          </div>
        </section>
      ) : !searchQuery.trim() && (
        <>
          {/* Categories */}
          <section className="py-16 px-6">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-display text-2xl font-bold mb-8">Browse by Category</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(categories).map(([category, categoryArticles]) => {
                  const IconComponent = CATEGORY_ICONS[category] || HelpCircle;
                  return (
                    <Link key={category} to={`/help/category?category=${encodeURIComponent(category)}`}>
                      <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group h-full">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-2">
                            {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
                {Object.keys(categories).length === 0 && (
                  <p className="col-span-4 text-center text-muted-foreground py-8">
                    No categories yet. Check back soon!
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Popular Articles */}
          {popularArticles.length > 0 && (
            <section className="py-16 px-6 bg-muted/30">
              <div className="container mx-auto max-w-4xl">
                <h2 className="font-display text-2xl font-bold mb-8">Popular Articles</h2>
                <Card className="bg-card border-border">
                  <CardContent className="p-0">
                    {popularArticles.map((article, index) => (
                      <Link
                        key={article.id}
                        to={`/help/article/${article.slug}`}
                        className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                          index !== popularArticles.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        <span className="text-foreground">{article.title}</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="py-16 px-6">
              <div className="container mx-auto max-w-4xl">
                <h2 className="font-display text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <Card key={faq.id} className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Contact Support */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground">Our support team is here to assist you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Available 9am-6pm EST</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Response within 24 hours</p>
                <Link to="/contact">
                  <Button variant="outline" size="sm">Send Email</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-4">For Pro & Enterprise</p>
                <Button variant="outline" size="sm">Call Us</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default HelpCenter;
