import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

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
  breadcrumbs?: BreadcrumbItem[];
}

const SITE_NAME = "EZFOIA";
const DEFAULT_TITLE = "EZFOIA - File FOIA Requests in Minutes | AI-Powered Public Records";
const DEFAULT_DESCRIPTION = "File Freedom of Information Act requests effortlessly. EZFOIA uses AI to draft, submit, and track your FOIA requests. Get government documents, police reports, and public records fast.";
const DEFAULT_IMAGE = "https://ezfoia.lovable.app/og-image.png";
const SITE_URL = "https://ezfoia.lovable.app";

// FOIA-focused keywords for different intents
const FOIA_KEYWORDS = {
  general: "FOIA, Freedom of Information Act, public records, government documents, FOIA request, records request, transparency, open government, AI FOIA, file FOIA online",
  howTo: "how to file FOIA, FOIA request example, FOIA letter template, submit FOIA request, file public records request",
  types: "police records request, government email FOIA, federal FOIA, state public records, local government records, FOIA exemptions",
  tools: "FOIA tracking software, automated FOIA, AI FOIA service, FOIA management, public records software",
  legal: "FOIA law, Freedom of Information Act 5 USC 552, FOIA rights, public records law, sunshine law, open records act"
};

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = FOIA_KEYWORDS.general,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "EZFOIA",
  section,
  noindex = false,
  jsonLd,
  breadcrumbs,
}: SEOProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  
  // Base organization schema with enhanced sitelinks
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "EZFOIA",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.png`,
      width: 512,
      height: 512
    },
    description: "AI-powered FOIA request service that simplifies filing Freedom of Information Act requests for journalists, researchers, and citizens.",
    slogan: "File FOIA Requests in Minutes",
    address: {
      "@type": "PostalAddress",
      streetAddress: "503 S Saginaw St",
      addressLocality: "Flint",
      addressRegion: "MI",
      postalCode: "48502",
      addressCountry: "US"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-810-618-1449",
        contactType: "customer service",
        email: "help@ezfoia.com",
        availableLanguage: "English",
        areaServed: "US"
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-810-618-1449",
        contactType: "sales",
        email: "sales@ezfoia.com",
        availableLanguage: "English"
      }
    ],
    sameAs: [
      "https://twitter.com/ezfoia",
      "https://linkedin.com/company/ezfoia",
      "https://facebook.com/ezfoia"
    ],
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Andrew Kime"
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "10"
    },
    knowsAbout: [
      "Freedom of Information Act",
      "FOIA Requests",
      "Public Records",
      "Government Transparency",
      "Open Records",
      "Public Records Law"
    ]
  };

  // Website schema with sitelinks searchbox
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ["EZ FOIA", "Easy FOIA"],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@id": `${SITE_URL}/#organization`
    },
    inLanguage: "en-US",
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/help?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ]
  };

  // Software application schema with pricing
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EZFOIA",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Legal Services",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    url: SITE_URL,
    offers: [
      {
        "@type": "Offer",
        name: "Free Trial",
        price: "0",
        priceCurrency: "USD",
        description: "First FOIA request free"
      },
      {
        "@type": "Offer",
        name: "Single Request",
        price: "75",
        priceCurrency: "USD",
        description: "One-time FOIA request filing"
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "149",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "149",
          priceCurrency: "USD",
          unitText: "month",
          billingIncrement: 1,
          billingDuration: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "MON"
          }
        },
        description: "Monthly subscription for unlimited FOIA requests"
      }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "247",
      reviewCount: "89",
      bestRating: "5",
      worstRating: "1"
    },
    featureList: [
      "AI-powered FOIA request drafting",
      "Real-time request tracking",
      "Automatic follow-ups",
      "Document management",
      "Multi-agency support",
      "Request templates"
    ]
  };

  // Sitelinks schema for Google rich results
  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    hasPart: [
      {
        "@type": "WebPage",
        name: "About Us",
        description: "Learn about EZFOIA's mission for government transparency",
        url: `${SITE_URL}/about`
      },
      {
        "@type": "WebPage",
        name: "Pricing",
        description: "Affordable FOIA request plans starting free",
        url: `${SITE_URL}/pricing`
      },
      {
        "@type": "WebPage",
        name: "Features",
        description: "AI-powered FOIA request tools and tracking",
        url: `${SITE_URL}/features`
      },
      {
        "@type": "WebPage",
        name: "FOIA Guide",
        description: "Complete guide to filing FOIA requests",
        url: `${SITE_URL}/foia-guide`
      },
      {
        "@type": "WebPage",
        name: "Help Center",
        description: "FOIA support and frequently asked questions",
        url: `${SITE_URL}/help`
      },
      {
        "@type": "WebPage",
        name: "Blog",
        description: "FOIA news, guides, and transparency tips",
        url: `${SITE_URL}/blog`
      },
      {
        "@type": "WebPage",
        name: "Contact",
        description: "Get help with your FOIA request",
        url: `${SITE_URL}/contact`
      }
    ]
  };

  // Service schema for local SEO
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "FOIA Request Filing Service",
    serviceType: "Legal Document Service",
    provider: {
      "@id": `${SITE_URL}/#organization`
    },
    description: "Professional FOIA request drafting, filing, and tracking service using AI technology.",
    areaServed: {
      "@type": "Country",
      name: "United States"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "FOIA Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Federal FOIA Requests",
            description: "File requests with federal agencies"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "State Public Records Requests",
            description: "File requests with state agencies"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Local Government Records",
            description: "File requests with cities, counties, and local agencies"
          }
        }
      ]
    }
  };

  // Breadcrumb schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.name,
        item: `${SITE_URL}${crumb.url}`
      }))
    ]
  } : null;

  // Combine all schemas
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allSchemas: any[] = [
    organizationSchema, 
    websiteSchema, 
    softwareSchema,
    siteNavigationSchema,
    serviceSchema
  ];
  
  if (breadcrumbSchema) {
    allSchemas.push(breadcrumbSchema);
  }
  
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
      <meta name="geo.position" content="43.0125;-83.6875" />
      <meta name="ICBM" content="43.0125, -83.6875" />
      
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

// Pre-configured SEO for common pages with breadcrumbs
export const HomeSEO = () => (
  <SEO
    title="File FOIA Requests in Minutes | AI-Powered Public Records"
    description="EZFOIA makes Freedom of Information Act requests effortless. AI drafts your request, we handle submission and tracking. Get police records, government documents, and public records fast. First request free."
    keywords={`${FOIA_KEYWORDS.general}, ${FOIA_KEYWORDS.howTo}, ${FOIA_KEYWORDS.types}`}
    url="/"
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      name: "EZFOIA - File FOIA Requests in Minutes",
      description: "AI-powered Freedom of Information Act request service",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: {
        "@type": "Thing",
        name: "Freedom of Information Act",
        sameAs: "https://en.wikipedia.org/wiki/Freedom_of_Information_Act_(United_States)"
      },
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "EZFOIA"
      }
    }}
  />
);

export const PricingSEO = () => (
  <SEO
    title="Pricing - Affordable FOIA Request Plans"
    description="Simple, transparent pricing for FOIA requests. Start free with your first request. Professional plans for journalists, researchers, and organizations. No hidden fees."
    keywords="FOIA pricing, FOIA service cost, public records pricing, FOIA request cost, affordable FOIA, FOIA subscription, FOIA for journalists, FOIA for researchers"
    url="/pricing"
    breadcrumbs={[{ name: "Pricing", url: "/pricing" }]}
    jsonLd={[
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "EZFOIA FOIA Request Service",
        description: "AI-powered FOIA request drafting and filing service",
        brand: {
          "@type": "Brand",
          name: "EZFOIA"
        },
        offers: [
          {
            "@type": "Offer",
            name: "Free Trial",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            priceValidUntil: "2025-12-31",
            description: "First FOIA request completely free"
          },
          {
            "@type": "Offer",
            name: "Single Request",
            price: "75",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            description: "One-time FOIA request filing and tracking"
          },
          {
            "@type": "Offer",
            name: "Pro Monthly",
            price: "149",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            description: "Unlimited monthly FOIA requests"
          }
        ]
      }
    ]}
  />
);

export const AboutSEO = () => (
  <SEO
    title="About Us - Our Mission for Government Transparency"
    description="EZFOIA was founded to democratize access to public records. Learn about our mission to make FOIA requests accessible to everyone through AI-powered technology. Based in Flint, Michigan."
    keywords="about EZFOIA, FOIA company, public records company, government transparency, FOIA mission, Andrew Kime, Flint Michigan, open government advocates"
    url="/about"
    breadcrumbs={[{ name: "About", url: "/about" }]}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "AboutPage",
      mainEntity: {
        "@type": "Organization",
        name: "EZFOIA",
        description: "AI-powered FOIA request service democratizing access to public records"
      }
    }}
  />
);

export const ContactSEO = () => (
  <SEO
    title="Contact Us - Get Help with Your FOIA Request"
    description="Have questions about FOIA requests? Contact EZFOIA for support. Email help@ezfoia.com or call (810) 618-1449. Located in Flint, MI. We're here to help with your public records needs."
    keywords="contact EZFOIA, FOIA help, FOIA support, public records help, FOIA questions, FOIA customer service"
    url="/contact"
    breadcrumbs={[{ name: "Contact", url: "/contact" }]}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "ContactPage",
      mainEntity: {
        "@type": "Organization",
        name: "EZFOIA",
        telephone: "+1-810-618-1449",
        email: "help@ezfoia.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "503 S Saginaw St",
          addressLocality: "Flint",
          addressRegion: "MI",
          postalCode: "48502",
          addressCountry: "US"
        }
      }
    }}
  />
);

export const BlogSEO = () => (
  <SEO
    title="FOIA Blog - Public Records News, Guides & Tips"
    description="Expert FOIA guides, public records news, and government transparency tips. Learn how to file effective Freedom of Information requests and navigate government records."
    keywords="FOIA blog, public records guide, FOIA tips, Freedom of Information news, government transparency blog, FOIA how-to, FOIA examples, FOIA case studies"
    url="/blog"
    breadcrumbs={[{ name: "Blog", url: "/blog" }]}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "EZFOIA Blog",
      description: "Expert FOIA guides and public records news",
      publisher: {
        "@type": "Organization",
        name: "EZFOIA"
      },
      blogPost: []
    }}
  />
);

export const HelpCenterSEO = () => (
  <SEO
    title="Help Center - FOIA Request Support & FAQs"
    description="Get answers to common FOIA questions. Learn about filing requests, tracking status, understanding exemptions, and your rights under Freedom of Information laws."
    keywords="FOIA help, FOIA FAQ, public records FAQ, FOIA questions answered, Freedom of Information help, FOIA exemptions explained, how long does FOIA take, FOIA denied what to do"
    url="/help"
    breadcrumbs={[{ name: "Help Center", url: "/help" }]}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long does a FOIA request take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Federal FOIA requests typically take 20 business days for a response, though complex requests may take longer. State and local public records requests vary by jurisdiction - some respond within 5 days, others may take 30 days or more. EZFOIA tracks your request and sends automatic follow-ups to help speed up the process."
          }
        },
        {
          "@type": "Question",
          name: "How much does a FOIA request cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "With EZFOIA, your first FOIA request is completely free. Single requests cost $75, and our Pro plan offers unlimited requests for $149/month. Agencies may also charge fees for search, review, and copying, though many grant fee waivers for journalists and researchers."
          }
        },
        {
          "@type": "Question",
          name: "What records can I request through FOIA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can request most government records including emails, reports, contracts, meeting minutes, police records, inspection reports, and internal communications. Nine exemptions protect certain information like national security, personal privacy, trade secrets, and law enforcement records. EZFOIA's AI helps you craft requests that maximize your chances of getting the records you need."
          }
        },
        {
          "@type": "Question",
          name: "Can I file a FOIA request for any government agency?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! The federal FOIA applies to all federal executive branch agencies. All 50 states have their own public records laws covering state and local agencies. EZFOIA supports requests to federal, state, and local government agencies across the United States."
          }
        },
        {
          "@type": "Question",
          name: "What happens if my FOIA request is denied?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "If your request is denied, you have the right to appeal. EZFOIA can help you understand the denial reason, determine if it's valid, and draft an appeal. Many initially denied requests are granted on appeal, especially partial denials where some information was redacted."
          }
        },
        {
          "@type": "Question",
          name: "Do I need to be a US citizen to file a FOIA request?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, anyone can file a federal FOIA request regardless of citizenship. State public records laws vary - some require the requester to be a resident, while others are open to anyone. EZFOIA handles these requirements automatically."
          }
        }
      ]
    }}
  />
);

export const FeaturesSEO = () => (
  <SEO
    title="Features - AI-Powered FOIA Request Tools"
    description="Discover EZFOIA's powerful features: AI request drafting, real-time tracking, document management, and automated follow-ups. The smartest way to file Freedom of Information requests."
    keywords={`${FOIA_KEYWORDS.tools}, FOIA automation, FOIA dashboard, request tracking, document organization, FOIA templates`}
    url="/features"
    breadcrumbs={[{ name: "Features", url: "/features" }]}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "EZFOIA Features",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "AI Request Drafting",
          description: "AI writes legally-compliant FOIA requests tailored to your needs"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Real-Time Tracking",
          description: "Monitor request status with automatic updates and notifications"
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Automated Follow-Ups",
          description: "Never miss a deadline with automatic agency follow-ups"
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Document Management",
          description: "Organize and search received documents in one place"
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Multi-Agency Support",
          description: "File requests with federal, state, and local agencies"
        }
      ]
    }}
  />
);

export const FoiaGuideSEO = () => (
  <SEO
    title="Complete FOIA Guide - How to File Public Records Requests"
    description="The ultimate guide to Freedom of Information Act requests. Learn what FOIA is, how to file requests, understand exemptions, file appeals, and get tips for success. Free FOIA templates included."
    keywords={`${FOIA_KEYWORDS.howTo}, ${FOIA_KEYWORDS.legal}, FOIA tutorial, public records guide, FOIA for beginners, FOIA letter template, FOIA exemptions list, FOIA appeal process`}
    url="/foia-guide"
    breadcrumbs={[{ name: "FOIA Guide", url: "/foia-guide" }]}
    jsonLd={[
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to File a FOIA Request",
        description: "Complete step-by-step guide to filing a successful Freedom of Information Act request",
        totalTime: "PT15M",
        estimatedCost: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: "0"
        },
        tool: {
          "@type": "HowToTool",
          name: "EZFOIA"
        },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Identify the Right Agency",
            text: "Determine which federal, state, or local agency has the records you need. Consider that records might exist in multiple agencies.",
            url: `${SITE_URL}/foia-guide#step-1`
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Describe Your Request Clearly",
            text: "Be specific about what records you're requesting, including date ranges, subjects, and any identifying information. The more specific, the faster your response.",
            url: `${SITE_URL}/foia-guide#step-2`
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Submit Your Request",
            text: "File through EZFOIA for AI-assisted drafting and automatic tracking, or submit directly to the agency's FOIA office.",
            url: `${SITE_URL}/foia-guide#step-3`
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Track and Follow Up",
            text: "Monitor your request status and send follow-ups if the agency misses deadlines. EZFOIA handles this automatically.",
            url: `${SITE_URL}/foia-guide#step-4`
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Review and Appeal if Needed",
            text: "Review the response for completeness. If records are withheld, you can file an administrative appeal or seek judicial review.",
            url: `${SITE_URL}/foia-guide#step-5`
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Complete FOIA Guide",
        description: "Everything you need to know about the Freedom of Information Act",
        author: {
          "@type": "Organization",
          name: "EZFOIA"
        },
        publisher: {
          "@type": "Organization",
          name: "EZFOIA"
        },
        mainEntityOfPage: `${SITE_URL}/foia-guide`,
        about: {
          "@type": "Thing",
          name: "Freedom of Information Act",
          sameAs: "https://en.wikipedia.org/wiki/Freedom_of_Information_Act_(United_States)"
        }
      }
    ]}
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

// Export keywords for reuse
export { FOIA_KEYWORDS };

export default SEO;
