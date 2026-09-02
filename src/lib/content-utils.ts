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
  projects: {
    title: string;
    description: string;
    image: string;
    result: string;
    client?: string;
    link?: string;
  }[];
  products: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      tag: string;
      description: string;
      highlight: string;
      highlights: string[];
      image: string;
      link: string;
    }[];
  };
  about: {
    eyebrow: string;
    headline: string;
    description: string;
    founder: {
      name: string;
      role: string;
      quote: string;
      bio: string;
    };
    values: {
      title: string;
      description: string;
    }[];
    whoWeAre: {
      title: string;
      paragraph1: string;
      paragraph2: string;
      stats: {
        value: string;
        label: string;
      }[];
    };
    direction: {
      title: string;
      subtitle: string;
      items: {
        phase: string;
        title: string;
        description: string;
      }[];
    };
    whyChoose: {
      title: string;
      subtitle: string;
      items: {
        emoji: string;
        title: string;
        description: string;
      }[];
    };
    cta: {
      message: string;
      description: string;
    };
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
    service?: string;
    link?: string;
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

function toOptionalString(value: unknown, path: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return toString(value, path);
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
    projects: toArray(content.projects, 'content.projects', (item, path) => {
      const project = toRecord(item, path);

      return {
        title: toString(project.title, `${path}.title`),
        description: toString(project.description, `${path}.description`),
        image: toString(project.image, `${path}.image`),
        result: toString(project.result, `${path}.result`),
        client: toOptionalString(project.client, `${path}.client`),
        link: toOptionalString(project.link, `${path}.link`),
      };
    }),
    products: (() => {
      const products = toRecord(content.products, 'content.products');
      return {
        eyebrow: toString(products.eyebrow, 'content.products.eyebrow'),
        title: toString(products.title, 'content.products.title'),
        subtitle: toString(products.subtitle, 'content.products.subtitle'),
        items: toArray(products.items, 'content.products.items', (item, path) => {
          const product = toRecord(item, path);
          return {
            title: toString(product.title, `${path}.title`),
            tag: toString(product.tag, `${path}.tag`),
            description: toString(product.description, `${path}.description`),
            highlight: toString(product.highlight, `${path}.highlight`),
            highlights: toArray(product.highlights, `${path}.highlights`, toString),
            image: toString(product.image, `${path}.image`),
            link: toString(product.link, `${path}.link`),
          };
        }),
      };
    })(),
    about: {
      eyebrow: toString(about.eyebrow, 'content.about.eyebrow'),
      headline: toString(about.headline, 'content.about.headline'),
      description: toString(about.description, 'content.about.description'),
      founder: (() => {
        const founder = toRecord(about.founder, 'content.about.founder');
        return {
          name: toString(founder.name, 'content.about.founder.name'),
          role: toString(founder.role, 'content.about.founder.role'),
          quote: toString(founder.quote, 'content.about.founder.quote'),
          bio: toString(founder.bio, 'content.about.founder.bio'),
        };
      })(),
      values: toArray(about.values, 'content.about.values', toTitleDescription),
      whoWeAre: (() => {
        const whoWeAre = toRecord(about.whoWeAre, 'content.about.whoWeAre');
        return {
          title: toString(whoWeAre.title, 'content.about.whoWeAre.title'),
          paragraph1: toString(whoWeAre.paragraph1, 'content.about.whoWeAre.paragraph1'),
          paragraph2: toString(whoWeAre.paragraph2, 'content.about.whoWeAre.paragraph2'),
          stats: toArray(whoWeAre.stats, 'content.about.whoWeAre.stats', toLabelValue),
        };
      })(),
      direction: (() => {
        const direction = toRecord(about.direction, 'content.about.direction');
        return {
          title: toString(direction.title, 'content.about.direction.title'),
          subtitle: toString(direction.subtitle, 'content.about.direction.subtitle'),
          items: toArray(direction.items, 'content.about.direction.items', (item, path) => {
            const dirItem = toRecord(item, path);
            return {
              phase: toString(dirItem.phase, `${path}.phase`),
              title: toString(dirItem.title, `${path}.title`),
              description: toString(dirItem.description, `${path}.description`),
            };
          }),
        };
      })(),
      whyChoose: (() => {
        const whyChoose = toRecord(about.whyChoose, 'content.about.whyChoose');
        return {
          title: toString(whyChoose.title, 'content.about.whyChoose.title'),
          subtitle: toString(whyChoose.subtitle, 'content.about.whyChoose.subtitle'),
          items: toArray(whyChoose.items, 'content.about.whyChoose.items', (item, path) => {
            const chooseItem = toRecord(item, path);
            return {
              emoji: toString(chooseItem.emoji, `${path}.emoji`),
              title: toString(chooseItem.title, `${path}.title`),
              description: toString(chooseItem.description, `${path}.description`),
            };
          }),
        };
      })(),
      cta: (() => {
        const cta = toRecord(about.cta, 'content.about.cta');
        return {
          message: toString(cta.message, 'content.about.cta.message'),
          description: toString(cta.description, 'content.about.cta.description'),
        };
      })(),
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
        service: toOptionalString(testimonial.service, `${path}.service`),
        link: toOptionalString(testimonial.link, `${path}.link`),
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
