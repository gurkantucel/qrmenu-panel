'use client';

import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';


// third-party
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { Chip } from '@mui/material';

const featureChat = '/assets/images/landing/chat.png';
const featureMail = '/assets/images/landing/mail.png';
const featureSocial = '/assets/images/landing/social.png';

// ==============================|| LANDING - APPS PAGE ||============================== //

export default function FeaturesPage() {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ width: "65vw", paddingLeft: 2 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ bgcolor: "#edf8f4", overflow: 'hidden', pt: { md: 10, xs: 5 } }}>
      <Container>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', marginBottom: 3 }}>
              <Grid item xs={12}>
                <Typography variant="h2">
                  Öne Çıkan Özellikler
                </Typography>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography>
                  Klinik yönetimi ve hasta takibi için ihtiyaç duyacağınızdan fazlası.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ pt: { md: 10, xs: 2.5 } }}>
          <Grid item xs={12}>
            <Grid container spacing={3} alignItems="start">
              <Box
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', padding: 6 }}
              >
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: 'divider', }}
                >
                  <Tab label="Randevu Yönetimi" {...a11yProps(0)} />
                  <Tab label="Hasta Bilgilendirme" {...a11yProps(1)} />
                  <Tab label="Finansal Bilgiler" {...a11yProps(2)} />
                  <Tab label="Döküman Yönetimi" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <MainCard>
                    <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                    <Chip label="Randevu Yönetimi" variant="combined" color="primary" sx={{marginRight: 1}} />{"Çalışma programınızı ve muayene sürelerinizi dikkate alarak, randevularınızı etkin bir şekilde yönetebileceğiniz gelişmiş randevu takip sistemi sunuyoruz."}
                    </Typography>
                    <CardMedia component="img" image={featureChat} sx={{ width: '100%', minHeight: '100%' }} />
                  </MainCard>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <MainCard>
                    <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                    <Chip label="Hasta Bilgilendirme" variant="combined" color="primary" sx={{marginRight: 1}} />
                    {"Hasta bilgilendirme modülü sayesinde hastalarınıza otomatik olarak doğum günü kutlamaları, randevu bilgilendirmeleri, geri bildirim talepleri vb. tüm mesajları SMS olarak gönderebilirsiniz."}
                    </Typography>
                    <CardMedia component="img" image={featureMail} sx={{ width: '100%', minHeight: '100%' }} />
                  </MainCard>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <MainCard>
                    <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                    <Chip label="Finansal Bilgiler" variant="combined" color="primary" sx={{marginRight: 1}} /> {"Hastalarınıza sağladığınız tüm hizmetleri hizmet girişi olarak kaydederek, bu hizmetlere bağlı finansal çıktıları kolayca yönetebilirsiniz."}
                    </Typography>
                    <CardMedia component="img" image={featureChat} sx={{ width: '100%', minHeight: '100%' }} />
                  </MainCard>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <Grid container justifyContent={"center"} alignItems={"center"}>
                    <MainCard>
                      <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                      <Chip label="Döküman Yönetimi" variant="combined" color="primary" sx={{marginRight: 1}} />{"Kliniğiniz ve hastalarınız için gerekli tüm dokümanları güvenle KlinikEase\'te depolayabilirsiniz."}
                      </Typography>
                      <CardMedia component="img" image={featureSocial} sx={{ width: '100%', minHeight: '100%' }} />
                    </MainCard>
                  </Grid>
                </TabPanel>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
