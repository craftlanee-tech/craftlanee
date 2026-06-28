type UnknownRecord = Record<string, unknown>;

export type Content = {
  siteTitle: string;
  meta: {
    description: string;
    keywords: string[];
  };
  nav: {
    label: string;
    href: string;
  }[];
  hero: {
    eyebrow: string;
    headline: string;
    highlight: string;
    description: string;
    actions: {
      label: string;
      href: string;
      variant: 'primary' | 'secondary';
    }[];
    stats: {
      value: string;
      label: string;
    }[];
    focus: string[];
  };
  services: {
    title: string;
    subtitle: string;
    groups: {
      category: string;
      description: string;
      items: string[];
    }[];
  };
  portfolio: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      image: string;
      result: string;
    }[];
  };
  about: {
    eyebrow: string;
    headline: string;
    description: string;
    values: {
      title: string;
      description: string;
    }[];
  };
  contact: {
    eyebrow: string;
    headline: string;
    description: string;
    form: {
      name: string;
      businessName: string;
      mobile: string;
      email: string;
      serviceNeeded: string;
      message: string;
    };
    details: {
      label: string;
      values: string[];
    }[];
  };
  testimonials: {
    quote: string;
    author: string;
    role: string;
  }[];
  footer: {
    company: string;
    description: string;
    links: {
      label: string;
      href: string;
    }[];
    legal: {
      label: string;
      href: string;
    }[];
    copyright: string;
  };
};

function toRecord(value: unknown, path: string): UnknownRecord {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as UnknownRecord;
  }

  throw new Error(`Invalid content at ${path}: expected an object.`);
}

function toString(value: unknown, path: string): string {
  if (typeof value === 'string') {
    return value;
  }

  throw new Error(`Invalid content at ${path}: expected a string.`);
}

function toArray<T>(value: unknown, path: string, convertItem: (item: unknown, itemPath: string) => T): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid content at ${path}: expected an array.`);
  }

  return value.map((item, index) => convertItem(item, `${path}[${index}]`));
}

function toLink(value: unknown, path: string): { label: string; href: string } {
  const record = toRecord(value, path);

  return {
    label: toString(record.label, `${path}.label`),
    href: toString(record.href, `${path}.href`),
  };
}

function toHeroAction(value: unknown, path: string): Content['hero']['actions'][number] {
  const record = toRecord(value, path);
  const variant = toString(record.variant, `${path}.variant`);

  if (variant !== 'primary' && variant !== 'secondary') {
    throw new Error(`Invalid content at ${path}.variant: expected "primary" or "secondary".`);
  }

  return {
    label: toString(record.label, `${path}.label`),
    href: toString(record.href, `${path}.href`),
    variant,
  };
}

function toLabelValue(value: unknown, path: string): { label: string; value: string } {
  const record = toRecord(value, path);

  return {
    label: toString(record.label, `${path}.label`),
    value: toString(record.value, `${path}.value`),
  };
}

function toContactDetail(value: unknown, path: string): { label: string; values: string[] } {
  const record = toRecord(value, path);
  const values = record.values === undefined
    ? [toString(record.value, `${path}.value`)]
    : toArray(record.values, `${path}.values`, toString);

  return {
    label: toString(record.label, `${path}.label`),
    values,
  };
}

function toTitleDescription(value: unknown, path: string): { title: string; description: string } {
  const record = toRecord(value, path);

  return {
    title: toString(record.title, `${path}.title`),
    description: toString(record.description, `${path}.description`),
  };
}

export function convertContent(rawContent: unknown): Content {
  const content = toRecord(rawContent, 'content');
  const meta = toRecord(content.meta, 'content.meta');
  const hero = toRecord(content.hero, 'content.hero');
  const services = toRecord(content.services, 'content.services');
  const portfolio = toRecord(content.portfolio, 'content.portfolio');
  const about = toRecord(content.about, 'content.about');
  const contact = toRecord(content.contact, 'content.contact');
  const contactForm = toRecord(contact.form, 'content.contact.form');
  const footer = toRecord(content.footer, 'content.footer');

  return {
    siteTitle: toString(content.siteTitle, 'content.siteTitle'),
    meta: {
      description: toString(meta.description, 'content.meta.description'),
      keywords: toArray(meta.keywords, 'content.meta.keywords', toString),
    },
    nav: toArray(content.nav, 'content.nav', toLink),
    hero: {
      eyebrow: toString(hero.eyebrow, 'content.hero.eyebrow'),
      headline: toString(hero.headline, 'content.hero.headline'),
      highlight: toString(hero.highlight, 'content.hero.highlight'),
      description: toString(hero.description, 'content.hero.description'),
      actions: toArray(hero.actions, 'content.hero.actions', toHeroAction),
      stats: toArray(hero.stats, 'content.hero.stats', toLabelValue),
      focus: toArray(hero.focus, 'content.hero.focus', toString),
    },
    services: {
      title: toString(services.title, 'content.services.title'),
      subtitle: toString(services.subtitle, 'content.services.subtitle'),
      groups: toArray(services.groups, 'content.services.groups', (item, path) => {
        const group = toRecord(item, path);

        return {
          category: toString(group.category, `${path}.category`),
          description: toString(group.description, `${path}.description`),
          items: toArray(group.items, `${path}.items`, toString),
        };
      }),
    },
    portfolio: {
      title: toString(portfolio.title, 'content.portfolio.title'),
      subtitle: toString(portfolio.subtitle, 'content.portfolio.subtitle'),
      items: toArray(portfolio.items, 'content.portfolio.items', (item, path) => {
        const portfolioItem = toRecord(item, path);

        return {
          title: toString(portfolioItem.title, `${path}.title`),
          description: toString(portfolioItem.description, `${path}.description`),
          image: toString(portfolioItem.image, `${path}.image`),
          result: toString(portfolioItem.result, `${path}.result`),
        };
      }),
    },
    about: {
      eyebrow: toString(about.eyebrow, 'content.about.eyebrow'),
      headline: toString(about.headline, 'content.about.headline'),
      description: toString(about.description, 'content.about.description'),
      values: toArray(about.values, 'content.about.values', toTitleDescription),
    },
    contact: {
      eyebrow: toString(contact.eyebrow, 'content.contact.eyebrow'),
      headline: toString(contact.headline, 'content.contact.headline'),
      description: toString(contact.description, 'content.contact.description'),
      form: {
        name: toString(contactForm.name, 'content.contact.form.name'),
        businessName: toString(contactForm.businessName, 'content.contact.form.businessName'),
        mobile: toString(contactForm.mobile, 'content.contact.form.mobile'),
        email: toString(contactForm.email, 'content.contact.form.email'),
        serviceNeeded: toString(contactForm.serviceNeeded, 'content.contact.form.serviceNeeded'),
        message: toString(contactForm.message, 'content.contact.form.message'),
      },
      details: toArray(contact.details, 'content.contact.details', toContactDetail),
    },
    testimonials: toArray(content.testimonials, 'content.testimonials', (item, path) => {
      const testimonial = toRecord(item, path);

      return {
        quote: toString(testimonial.quote, `${path}.quote`),
        author: toString(testimonial.author, `${path}.author`),
        role: toString(testimonial.role, `${path}.role`),
      };
    }),
    footer: {
      company: toString(footer.company, 'content.footer.company'),
      description: toString(footer.description, 'content.footer.description'),
      links: toArray(footer.links, 'content.footer.links', toLink),
      legal: toArray(footer.legal, 'content.footer.legal', toLink),
      copyright: toString(footer.copyright, 'content.footer.copyright'),
    },
  };
}
