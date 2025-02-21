import { Box, Container, Grid, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import MainCard from 'components/MainCard'
import { APP_DEFAULT_PATH } from 'config';
import React from 'react'
import { getStaticPage } from './actions';
import { Metadata } from 'next';

type Params = {
    params: {
        slug: string
    }
}

export const generateMetadata = async ({params}:Params): Promise<Metadata | undefined> => {
    const result = await getStaticPage(params?.slug);
    if(!result || result.status == "failure"){
        return;
    }
    return { title: result.data.data.title, description: result.data.data.description };
};

const ArticlePage = async ({params}: Params) => {
    const result = await getStaticPage(params?.slug);

    return (
        <Box sx={{ pt: 15, pb: 10.5 }}>
            <Container>
                {result && result.data && <Grid container spacing={2}>
                    <Breadcrumbs custom links={[
                        { title: 'Ana Sayfa', to: APP_DEFAULT_PATH },
                        { title: result.data.data.title }
                    ]} />
                    <Grid item xs={12}>
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

                </Grid>}
            </Container>
        </Box>
    )
}

export default ArticlePage