import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

const SITE_NAME = "EZFOIA";
const DEFAULT_TITLE = "EZFOIA - File FOIA Requests in Minutes | AI-Powered Public Records";
const DEFAULT_DESCRIPTION = "File Freedom of Information Act requests effortlessly. EZFOIA uses AI to draft, submit, and track your FOIA requests. Get government documents, police reports, and public records fast.";
const DEFAULT_IMAGE = "https://ezfoia.lovable.app/og-image.png";
const SITE_URL = "https://ezfoia.lovable.app";

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = "FOIA, Freedom of Information Act, public records, government documents, FOIA request, records request, transparency, open government, AI FOIA, file FOIA online",
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "EZFOIA",
  section,
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  
  // Base organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EZFOIA",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description: "AI-powered FOIA request service that simplifies filing Freedom of Information Act requests.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "503 S Saginaw St",
      addressLocality: "Flint",
      addressRegion: "MI",
      postalCode: "48502",
      addressCountry: "US"
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-810-618-1449",
      contactType: "customer service",
      email: "help@ezfoia.com",
      availableLanguage: "English"
    },
    sameAs: [
      "https://twitter.com/ezfoia",
      "https://linkedin.com/company/ezfoia"
    ],
    foundingDate: "2026",
    founder: {
      "@type": "Person",
      name: "Andrew Kime"
    }
  };

  // Website schema with search action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/help?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Software application schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EZFOIA",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "First FOIA request free"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127",
      bestRating: "5",
      worstRating: "1"
    }
  };

  // Combine all schemas
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allSchemas: any[] = [organizationSchema, websiteSchema, softwareSchema];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      allSchemas.push(...jsonLd);
    } else {
      allSchemas.push(jsonLd);
    }
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="bingbot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language and Geo */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="US-MI" />
      <meta name="geo.placename" content="Flint" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} - AI-Powered FOIA Requests`} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article-specific OG tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@ezfoia" />
      <meta name="twitter:creator" content="@ezfoia" />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(allSchemas)}
      </script>
    </Helmet>
  );
};

// Pre-configured SEO for common pages
export const HomeSEO = () => (
  <SEO
    title="File FOIA Requests in Minutes | AI-Powered Public Records"
    description="EZFOIA makes Freedom of Information Act requests effortless. AI drafts your request, we handle submission and tracking. Get police records, government documents, and public records fast. First request free."
    keywords="FOIA request online, file FOIA, Freedom of Information Act, public records request, government transparency, police records, government documents, AI FOIA service, FOIA tracking, open records request"
    url="/"
  />
);

export const PricingSEO = () => (
  <SEO
    title="Pricing - Affordable FOIA Request Plans"
    description="Simple, transparent pricing for FOIA requests. Start free with your first request. Professional plans for journalists, researchers, and organizations. No hidden fees."
    keywords="FOIA pricing, FOIA service cost, public records pricing, FOIA request cost, affordable FOIA, FOIA subscription"
    url="/pricing"
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "PriceSpecification",
      price: "75",
      priceCurrency: "USD",
      description: "Single FOIA request filing"
    }}
  />
);

export const AboutSEO = () => (
  <SEO
    title="About Us - Our Mission for Government Transparency"
    description="EZFOIA was founded to democratize access to public records. Learn about our mission to make FOIA requests accessible to everyone through AI-powered technology."
    keywords="about EZFOIA, FOIA company, public records company, government transparency, FOIA mission, Andrew Kime"
    url="/about"
  />
);

export const ContactSEO = () => (
  <SEO
    title="Contact Us - Get Help with Your FOIA Request"
    description="Have questions about FOIA requests? Contact EZFOIA for support. Email help@ezfoia.com or call (810) 618-1449. We're here to help with your public records needs."
    keywords="contact EZFOIA, FOIA help, FOIA support, public records help, FOIA questions"
    url="/contact"
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "ContactPage",
      mainEntity: {
        "@type": "Organization",
        name: "EZFOIA",
        telephone: "+1-810-618-1449",
        email: "help@ezfoia.com"
      }
    }}
  />
);

export const BlogSEO = () => (
  <SEO
    title="FOIA Blog - Public Records News, Guides & Tips"
    description="Expert FOIA guides, public records news, and transparency tips. Learn how to file effective Freedom of Information requests and navigate government records."
    keywords="FOIA blog, public records guide, FOIA tips, Freedom of Information news, government transparency blog, FOIA how-to"
    url="/blog"
  />
);

export const HelpCenterSEO = () => (
  <SEO
    title="Help Center - FOIA Request Support & FAQs"
    description="Get answers to common FOIA questions. Learn about filing requests, tracking status, and understanding your rights under Freedom of Information laws."
    keywords="FOIA help, FOIA FAQ, public records FAQ, FOIA questions answered, Freedom of Information help"
    url="/help"
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long does a FOIA request take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Federal FOIA requests typically take 20 business days, but complex requests may take longer. State and local requests vary by jurisdiction."
          }
        },
        {
          "@type": "Question",
          name: "How much does a FOIA request cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "EZFOIA offers your first request free. Single requests are $75, with professional plans available for frequent filers."
          }
        },
        {
          "@type": "Question",
          name: "What records can I request through FOIA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can request most government records including emails, reports, contracts, meeting minutes, and police records. Some exemptions apply for national security and privacy."
          }
        }
      ]
    }}
  />
);

export const FeaturesSEO = () => (
  <SEO
    title="Features - AI-Powered FOIA Request Tools"
    description="Discover EZFOIA's powerful features: AI request drafting, real-time tracking, document search, and automated follow-ups. The smartest way to file public records requests."
    keywords="FOIA features, AI FOIA, FOIA tracking, document search, automated FOIA, FOIA tools, public records software"
    url="/features"
  />
);

export const FoiaGuideSEO = () => (
  <SEO
    title="Complete FOIA Guide - How to File Public Records Requests"
    description="The ultimate guide to Freedom of Information Act requests. Learn what FOIA is, how to file requests, exemptions, appeals, and tips for success."
    keywords="FOIA guide, how to file FOIA, Freedom of Information Act explained, FOIA tutorial, public records guide, FOIA for beginners"
    url="/foia-guide"
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to File a FOIA Request",
      description: "Step-by-step guide to filing a Freedom of Information Act request",
      step: [
        {
          "@type": "HowToStep",
          name: "Identify the agency",
          text: "Determine which federal, state, or local agency has the records you need."
        },
        {
          "@type": "HowToStep",
          name: "Describe your request",
          text: "Be specific about what records you're requesting, including dates and subjects."
        },
        {
          "@type": "HowToStep",
          name: "Submit your request",
          text: "File through EZFOIA for AI-assisted drafting and tracking, or submit directly to the agency."
        },
        {
          "@type": "HowToStep",
          name: "Track and follow up",
          text: "Monitor your request status and file appeals if necessary."
        }
      ]
    }}
  />
);

export const DashboardSEO = () => (
  <SEO
    title="Dashboard - Manage Your FOIA Requests"
    description="Track and manage your FOIA requests in one place. View status updates, download documents, and submit new requests."
    noindex={true}
    url="/dashboard"
  />
);

export const AuthSEO = () => (
  <SEO
    title="Sign In - Access Your FOIA Dashboard"
    description="Sign in to your EZFOIA account to manage your FOIA requests, track status, and download documents."
    noindex={true}
    url="/auth"
  />
);

export default SEO;
