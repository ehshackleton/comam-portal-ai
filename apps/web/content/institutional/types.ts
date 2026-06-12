export type ContentImage = {
  src?: string;
  alt: string;
  caption?: string;
};

export type SeoMeta = {
  title: string;
  description: string;
};

export type PageHeaderContent = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export type InstitutionalSection = {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
  imageKey?: string;
};

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type InstitutionalPage = {
  metadata: SeoMeta;
  pageHeader: PageHeaderContent;
  sections: InstitutionalSection[];
  highlights?: string[];
  timeline?: TimelineEvent[];
  heroImageKey?: string;
  timelineImageKey?: string;
};
