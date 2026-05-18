export interface Essay {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    if (key) data[key] = val;
  }

  return { data, content: match[2] };
}

const rawModules = import.meta.glob('../essays/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export function getEssays(): Essay[] {
  return Object.entries(rawModules)
    .map(([path, raw]) => {
      const slug = path.replace('../essays/', '').replace('.md', '');
      const { data, content } = parseFrontmatter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEssay(slug: string): Essay | undefined {
  return getEssays().find((e) => e.slug === slug);
}

export function getEssaySlugs(): string[] {
  return getEssays().map((e) => e.slug);
}
