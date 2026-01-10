import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: FileText,
      title: "FOIA Requests",
      description: "Learn how to create, track, and manage your requests",
      articles: 12,
    },
    {
      icon: CreditCard,
      title: "Billing & Plans",
      description: "Payment methods, subscriptions, and invoices",
      articles: 8,
    },
    {
      icon: User,
      title: "Account",
      description: "Profile settings, security, and preferences",
      articles: 6,
    },
    {
      icon: Settings,
      title: "Technical",
      description: "API access, integrations, and troubleshooting",
      articles: 10,
    },
  ];

  const popularArticles = [
    "How do I submit my first FOIA request?",
    "What happens after I submit a request?",
    "How long does it take to get a response?",
    "Can I cancel or modify a pending request?",
    "What are the different subscription plans?",
    "How do I upgrade or downgrade my plan?",
    "What file formats are supported for documents?",
    "How do I appeal a denied request?",
  ];

  const faqs = [
    {
      question: "What is EZFOIA?",
      answer: "EZFOIA is a platform that simplifies the process of filing Freedom of Information Act requests with government agencies. We handle the paperwork, tracking, and follow-ups so you can focus on the information you need.",
    },
    {
      question: "How much does it cost?",
      answer: "We offer flexible pricing plans starting with a free tier that includes 3 requests per month. Paid plans offer unlimited requests, priority processing, and additional features. Check our pricing page for details.",
    },
    {
      question: "Which agencies can I request records from?",
      answer: "You can submit requests to any federal agency covered by FOIA. We also support many state and local agencies across the United States through their respective open records laws.",
    },
    {
      question: "How long does it take to receive documents?",
      answer: "Response times vary by agency. Federal agencies are required to respond within 20 business days, but complex requests may take longer. We track all deadlines and follow up automatically.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Help Center</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            How can we help you?
          </h1>
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
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-2">{category.description}</CardDescription>
                  <span className="text-sm text-primary">{category.articles} articles</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold mb-8">Popular Articles</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {popularArticles.map((article, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    index !== popularArticles.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-foreground">{article}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default HelpCenter;
