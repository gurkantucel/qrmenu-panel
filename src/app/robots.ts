import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ["/app","/app/register","/app/login","/gizlilik-sozlesmesi","/uyelik-sozlesmesi","/mesafeli-satis-sozlesmesi","/teslimat-ve-iade-sartlari"]
    },
    sitemap: 'https://www.klinikease.com/sitemap.xml',
  }
}