import { expect, test } from '@playwright/test';

test.describe('Production smoke', () => {
  test('homepage responds 200', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });

  test('homepage serves HTML', async ({ request }) => {
    const response = await request.get('/');
    expect(response.headers()['content-type']).toMatch(/text\/html/i);
  });

  test('homepage includes the application mount', async ({ request }) => {
    const response = await request.get('/');
    const body = await response.text();
    expect(body).toContain('id="root"');
  });

  test('robots.txt responds 200 and allows crawling', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
  });

  test('robots.txt advertises the root sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/i);
  });

  test('sitemap.xml responds 200 as a sitemapindex', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<sitemapindex');
  });

  test('root sitemap index includes the Jordan sitemap', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('sitemap-jo.xml');
  });

  test('sitemap-jo.xml responds 200 with a urlset', async ({ request }) => {
    const response = await request.get('/sitemap-jo.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
  });

  test('other per-market sitemaps respond 200 with urlsets', async ({ request }) => {
    for (const market of ['sa', 'lb', 'ps', 'sy']) {
      const response = await request.get(`/sitemap-${market}.xml`);
      expect(response.status(), `${market} sitemap status`).toBe(200);
      const body = await response.text();
      expect(body, `${market} sitemap body`).toContain('<urlset');
    }
  });
});
