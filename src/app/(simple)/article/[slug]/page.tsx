"use client"

import { Box, Container, Grid, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import MainCard from 'components/MainCard'
import { APP_DEFAULT_PATH } from 'config';
import React, { useEffect, useState } from 'react'
import { getStaticPage } from './actions';
import { StaticPageResultModel } from 'reduxt/features/static-page/models/static-page-model';
import { useParams } from 'next/navigation';

const ArticlePage = () => {

    const [result, setResult] = useState<StaticPageResultModel | null>(null);

    const params = useParams<{ slug: string }>()

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getStaticPage(params.slug);
                setResult(response?.data);
            } catch (err: any) {
            }
        }

        fetchData();
    }, []);

    return (
        <Box sx={{ pt: 15, pb: 10.5 }}>
            <Container>
                {result && result.data && <Grid container spacing={2}>
                    <Breadcrumbs custom links={[
                        { title: 'Ana Sayfa', to: APP_DEFAULT_PATH },
                        { title: result.data.title }
                    ]} />
                    <Grid item xs={12}>
                        <MainCard
                            title={result.data.title}
                        >
                            <Typography variant="body1">
                                <div
                                    dangerouslySetInnerHTML={{ __html: result.data.content ?? "" }}
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