import { Box, Container, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import MainCard from 'components/MainCard'
import { APP_DEFAULT_PATH } from 'config';
import React from 'react'

let breadcrumbLinks = [
    { title: 'Ana Sayfa', to: APP_DEFAULT_PATH },
    { title: 'Blog', to: '/blog' },
    { title: 'Tüm Sektörlerde Dijitalleşme Vakti | Doktorlar ve Uzmanlar İçin Online Klinik Platformu' }
];

const BlogDetail = () => {
    return (
        <Box sx={{ pt: 15, pb: 10.5 }}>
            <Container>
                <Grid container spacing={2}>
                    <Breadcrumbs custom links={breadcrumbLinks} />
                    <Grid item xs={8}>
                        <MainCard
                            title="Tüm Sektörlerde Dijitalleşme Vakti | Doktorlar ve Uzmanlar İçin Online Klinik Platformu"
                        >
                            <Typography variant="body1">
                                {"Sağlık sektöründe dijitalleşme sayesinde artık daha verimli hale geliyor. Kliniklere özel geliştirilen yazılım platformları danışanların yönetimi randevu takibi gibi bir çok manuel süreci dijital dünyaya katarak daha da geliştiriliyor. Bu yazımızda özel kliniklere yönelik platformumuzun sunduğu özellikleeri ele alıyoruz."}
                            </Typography>
                        </MainCard>
                    </Grid>
                    <Grid item xs={4}>
                        <MainCard
                            title="Bağlantılar"
                        >
                            <List sx={{ p: 0 }}>
                                <ListItem disablePadding divider>
                                    <ListItemButton>
                                        <ListItemText primary="List item 01" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding divider>
                                    <ListItemButton>
                                        <ListItemText primary="List item 02" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding divider>
                                    <ListItemButton>
                                        <ListItemText primary="List item 03" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </MainCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default BlogDetail