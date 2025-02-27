import { MetadataRoute } from "next";
import Constants from "utils/Constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const result = await fetch(`${Constants.APIURL()}/api/definition/blog/list`,{ next: { revalidate: 3600 } })
    var postEntries: any;
    if (result.status == 200) {
        var model = await result.json();
        postEntries = model.data.map((item:any) =>({
            url: `${process.env.NEXT_PUBLIC_URL_PROD}/blog/${item.slug}`,
            lastModified: new Date(item.updated_at),
            changeFrequency: 'weekly',
            priority: 0.6
        }))
    }
    return [
        {
            url: `${process.env.NEXT_PUBLIC_URL_PROD}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL_PROD}/fiyatlar`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL_PROD}/hakkimda`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL_PROD}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...postEntries
    ];
}