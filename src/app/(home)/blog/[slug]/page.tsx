import { Box, CardMedia, Container, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import React from 'react'
import { getBlogDetail, getBlogExcludeSlug } from './actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation'
import Link from 'next/link';
import MainCard2 from 'components/MainCard2';

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
                    <Grid item xs={12}>
                        <Breadcrumbs custom
                            links={[
                                { title: 'Ana Sayfa', to: "/" },
                                { title: 'Blog', to: "/blog" },
                                { title: result.data.data.title }
                            ]} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <MainCard2
                            contentSX={{ padding: "24px" }}
                        >
                            <Typography variant="h1" sx={{
                                fontFamily: 'var(--font-poppins)',
                                fontWeight: 600,
                                lineHeight: 1.21,
                                fontSize: 20
                            }}>{result.data.data.title ?? "-"}</Typography>
                            <div
                                style={{
                                    fontFamily: 'var(--font-poppins)', fontSize: '0.875rem',
                                    lineHeight: 1.57
                                }}
                                dangerouslySetInnerHTML={{ __html: result.data.data.content ?? "" }}
                            />
                        </MainCard2>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {blogs && blogs.data && blogs.data.data?.length > 0 &&
                            <MainCard2
                                title="Bağlantılar"
                            >
                                <List sx={{
                                    p: 0,
                                    "a": {
                                        color: "#5b6b79"
                                    }
                                }}>
                                    {blogs.data.data.map((item: any, index: number) => (
                                        <Link href={`/blog/${item.slug}`} key={`blog-${index}`} style={{ textDecoration: "none" }}>
                                            <ListItem disablePadding divider>
                                                <ListItemButton>
                                                    <Typography variant="h4" sx={{
                                                        fontFamily: 'var(--font-poppins)',
                                                        color: "#5b6b79",
                                                        fontWeight: 300,
                                                        lineHeight: 1.21,
                                                        fontSize: "0.875rem"
                                                    }}>{item.title ?? ""}</Typography>
                                                </ListItemButton>
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                            </MainCard2>
                        }
                        <MainCard2 sx={{marginTop: "10px"}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CardMedia component="img" image={"https://firebasestorage.googleapis.com/v0/b/klinikeasecom.firebasestorage.app/o/images%2Frandevu-yonetimi.jpg?alt=media&token=db36747e-164a-4120-8caf-7e2f7150b9a4"} alt={"Randevu Yönetimi"} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h5' sx={{fontFamily: 'var(--font-poppins)',fontSize: "0.875rem", fontWeight: "500"}}>{"Tüm randevu süreçlerinizi tek bir ekrandan yönetin, hasta bilgilerine anında erişim sağlayın."}</Typography>
                                </Grid>
                            </Grid>
                        </MainCard2>
                        <MainCard2 sx={{marginTop: "10px"}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CardMedia component="img" image={"https://firebasestorage.googleapis.com/v0/b/klinikeasecom.firebasestorage.app/o/images%2Fistatistikler.jpg?alt=media&token=26b989fc-eb46-4318-a92f-a3fb2fddcd9a"} alt={"Randevu Yönetimi"} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h5' sx={{fontFamily: 'var(--font-poppins)',fontSize: "0.875rem", fontWeight: "500"}}>{"Klinik verilerinizi anlık raporlarla analiz edin, kazancınızı takip edin."}</Typography>
                                </Grid>
                            </Grid>
                        </MainCard2>
                        <MainCard2 sx={{marginTop: "10px"}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CardMedia component="img" image={"https://firebasestorage.googleapis.com/v0/b/klinikeasecom.firebasestorage.app/o/images%2Fsms-bildirimleri.jpg?alt=media&token=6bfae82f-d9b6-44b1-9bb6-b177adb452ce"} alt={"Randevu Yönetimi"} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h5' sx={{fontFamily: 'var(--font-poppins)',fontSize: "0.875rem", fontWeight: "500"}}>{"Otomatik SMS bildirimleriyle hastalarınızla her an iletişimde kalın."}</Typography>
                                </Grid>
                            </Grid>
                        </MainCard2>
                    </Grid>
                </Grid>}
            </Container>
        </Box>
    )
}

export default BlogDetail