export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  domain: string;
  /** Display name for the brand, used in structured data. */
  brandName: string;
  title: string;
  description: string;
  /** Drives <meta name="theme-color">. Keep in sync with --brand-blue in base.css. */
  themeColor: string;
  /** Path to the 1200x630 social card in public/. */
  ogImage: string;
  analyticsId?: string;
  hero: {
    heading: string;
    subheading?: string;
  };
  purchase: {
    price: string;
    href: string;
    label: string;
    lines: string[];
  };
  faq: FaqItem[];
}

export const site: SiteConfig = {
  domain: "usermanuals.guide",
  brandName: "UserManuals.Guide",
  title: "User Manuals Template for Notion — UserManuals.Guide",
  description:
    "A Notion template that helps your team define and share their work style with peers and managers, to shorten the learning curve of onboarding and team building.",
  themeColor: "#0047d6",
  ogImage: "/og.jpg",
  hero: {
    heading: "User Manuals Template for Notion",
    subheading:
      "Help your team define and share their work style with peers and managers to shorten the learning curve of onboarding and team building.",
  },
  purchase: {
    price: "$79",
    href: "https://jordankrueger.gumroad.com/l/notion-user-manuals",
    label: "Buy now",
    lines: [
      "Lifetime access for every member of your company or team.",
      "Access to updates, forever.",
    ],
  },
  faq: [
    {
      question: "Does this work on the free version of Notion?",
      answer:
        "Yes. Notion has a generous free personal plan. You don't need to pay Notion to use this template.",
    },
    {
      question: "How do I use the template?",
      answer:
        "After you've made the purchase, you'll receive the link immediately and use that to duplicate the template to your Notion workspace.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "If you're having trouble with the template, please contact me (form below) and I'll be happy to assist you and discuss a refund, within 30 days of purchase, if that makes the most sense.",
    },
    {
      question: "Can I share the User Manual Template with my team or friends?",
      answer:
        "Purchasing the template provides a license for all of one company's employees. You'll have all the access you need for your team, or company, to create user manuals. Please do not share the template with friends or others outside your company. If you need a license for a second business entity, reach out to me for a discount.",
    },
  ],
};
