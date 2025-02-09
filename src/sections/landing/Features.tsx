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
import { Book, CalendarTick, ImportSquare, Notepad2, Profile2User } from 'iconsax-react';

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

  function TabPanel({ children, value, index, ...other }: TabPanelProps) {
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
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
                sx={{
                  bgcolor: 'background.paper', 
                  borderBottom: 1, borderColor: 'divider',
                  padding: {
                    xs: 1,
                    md: 6
                  }
                }}
              >
                <Tabs value={value} onChange={handleChange} variant="scrollable" aria-label="basic tabs example">
                  <Tab label="Randevu Yönetimi" icon={<CalendarTick />} iconPosition="start" {...a11yProps(0)} />
                  <Tab label="Ödemeler" icon={<Notepad2 />} iconPosition="start" {...a11yProps(0)} />
                  <Tab label="Teklif Ver" icon={<ImportSquare />} iconPosition="start" {...a11yProps(0)} />
                  <Tab label="Hasta Bilgilendirme" icon={<Book />} iconPosition="start" {...a11yProps(1)} />
                  <Tab label="Finansal Bilgiler" icon={<Profile2User />} iconPosition="start" {...a11yProps(2)} />
                  <Tab label="Döküman Yönetimi" icon={<Book />} iconPosition="start" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <MainCard>
                    <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                      <Chip label="Randevu Yönetimi" variant="combined" color="primary" sx={{ marginRight: 1, marginBottom: 1 }} />{"Çalışma programınızı ve muayene sürelerinizi dikkate alarak, randevularınızı etkin bir şekilde yönetebileceğiniz gelişmiş randevu takip sistemi sunuyoruz."}
                    </Typography>
                    <CardMedia component="img" image={featureChat} sx={{ width: '90%', minHeight: '80%' }} />
                  </MainCard>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <MainCard>
                    <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                      <Chip label="Hasta Bilgilendirme" variant="combined" color="primary" sx={{ marginRight: 1 }} />
                      {"Hasta bilgilendirme modülü sayesinde hastalarınıza otomatik olarak doğum günü kutlamaları, randevu bilgilendirmeleri, geri bildirim talepleri vb. tüm mesajları SMS olarak gönderebilirsiniz."}
                    </Typography>
                    <CardMedia component="img" image={featureMail} sx={{ width: '100%', minHeight: '100%' }} />
                  </MainCard>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <MainCard>
                    <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                      <Chip label="Finansal Bilgiler" variant="combined" color="primary" sx={{ marginRight: 1 }} /> {"Hastalarınıza sağladığınız tüm hizmetleri hizmet girişi olarak kaydederek, bu hizmetlere bağlı finansal çıktıları kolayca yönetebilirsiniz."}
                    </Typography>
                    <CardMedia component="img" image={featureChat} sx={{ width: '100%', minHeight: '100%' }} />
                  </MainCard>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <Grid container justifyContent={"center"} alignItems={"center"}>
                    <MainCard>
                      <Typography variant="body1" sx={{ fontSize: 15, marginBottom: 2 }} color="text.secondary">
                        <Chip label="Döküman Yönetimi" variant="combined" color="primary" sx={{ marginRight: 1 }} />{"Kliniğiniz ve hastalarınız için gerekli tüm dokümanları güvenle KlinikEase\'te depolayabilirsiniz."}
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
