import { Box, Container, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import MainCard from 'components/MainCard'
import { APP_DEFAULT_PATH } from 'config';
import React from 'react'
import { getBlogDetail, getBlogExcludeSlug } from './actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation'
import Link from 'next/link';

type Params = {
    params: {
        slug: string
    }
}

export const generateMetadata = async ({ params }: Params): Promise<Metadata | undefined> => {
    const result = await getBlogDetail(params?.slug);
    if (!result || result.status == "failure") {
        return;
    }
    return { title: result.data.data.title, description: result.data.data.description };
};

const BlogDetail = async ({ params }: Params) => {
    const result = await getBlogDetail(params?.slug);
    const blogs = await getBlogExcludeSlug(params?.slug);
    if (result.status == "failure") {
        return notFound();
    }
    return (
        <Box sx={{ pt: 15, pb: 10.5 }}>
            <Container>
                {result && result.data && <Grid container spacing={2}>
                    <Breadcrumbs custom links={[
                        { title: 'Ana Sayfa', to: APP_DEFAULT_PATH },
                        { title: 'Blog', to: "/blog" },
                        { title: result.data.data.title }
                    ]} />
                    <Grid item xs={8}>
                        <MainCard
                            title={result.data.title}
                        >
                            <Typography variant="body1">
                                <div
                                    dangerouslySetInnerHTML={{ __html: result.data.data.content ?? "" }}
                                />
                            </Typography>
                        </MainCard>
                    </Grid>
                    {blogs && blogs.data && blogs.data.data?.length > 0 && <Grid item xs={4}>
                        <MainCard
                            title="Bağlantılar"
                        >
                            <List sx={{ p: 0 }}>
                                {blogs.data.data.map((item: any, index: number) => (
                                    <Link href={`/blog/${item.slug}`} key={`blog-${index}`}>
                                        <ListItem disablePadding divider>
                                            <ListItemButton>
                                                <ListItemText primary={item.title ?? ""} />
                                            </ListItemButton>
                                        </ListItem>
                                    </Link>
                                ))}
                            </List>
                        </MainCard>
                    </Grid>}
                </Grid>}
            </Container>
        </Box>
    )
}

export default BlogDetail