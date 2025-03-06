import { Box, Container, Grid } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import MainCard from 'components/MainCard'
import React from 'react'
import { getStaticPage } from './actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation'

type Params = {
    params: {
        slug: string
    }
}

export const generateMetadata = async ({ params }: Params): Promise<Metadata | undefined> => {
    const result = await getStaticPage(params?.slug);
    if (!result || result.status == "failure") {
        return;
    }
    return { title: result.data.data.title, description: result.data.data.description };
};

const BlogPage = async ({ params }: Params) => {
    const result = await getStaticPage(params?.slug);
    if (result.status == "failure") {
        return notFound();
    }
    return (
        <Box sx={{ pt: 15, pb: 10.5 }}>
            <Container>
                {result && result.data && <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Breadcrumbs custom links={[
                            { title: 'Ana Sayfa', to: "/" },
                            { title: result.data.data.title }
                        ]} />
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard
                            title={result.data.title}
                        >
                            <div
                                    style={{
                                        fontFamily: 'var(--font-poppins)', fontSize: '0.875rem',
                                        lineHeight: 1.57
                                    }}
                                    dangerouslySetInnerHTML={{ __html: result.data.data.content ?? "" }}
                                />
                        </MainCard>

                    </Grid>

                </Grid>}
            </Container>
        </Box>
    )
}

export default BlogPage