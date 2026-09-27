import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/data/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://projectshe.in';

  // Base core pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const posts = await getPublishedPosts();
    posts.forEach((post) => {
      routes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at || post.created_at),
        changeFrequency: 'weekly',
        priority: post.is_pinned ? 0.85 : 0.75,
      });
    });
  } catch (e) {
    console.warn('Sitemap post generation skipped:', e);
  }

  return routes;
}
