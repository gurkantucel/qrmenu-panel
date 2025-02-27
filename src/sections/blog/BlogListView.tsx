'use client';

// next
import Link from 'next/link';

// material-ui
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// third-party
import { motion } from 'framer-motion';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { BlogData } from 'reduxt/features/definition/models/blog-model';

// ==============================|| BLOG PAGE ||============================== //

type Props = {
  data?: BlogData[]
}

function metniKisalt(metin: string, maksimumUzunluk: number) {
  if (metin.length <= maksimumUzunluk) {
    return metin;
  } else {
    return metin.substring(0, maksimumUzunluk) + "...";
  }
}

export default function BlogListView(props: Props) {

  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ mt: { md: 15, xs: 2.5 }, mb: { md: 10, xs: 2.5 } }}>
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ textAlign: 'center', marginBottom: 3 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.2
                }}
              >
                <Typography variant="h2">Blog</Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4
                }}
              >
                <Typography>{"Sağlık bilgilendirme ve klinik yazılımları üzerine..."}</Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            {props.data?.map((item, index) => (
              <Grid item xs={12} md={6} lg={6} key={index}>
                <MainCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {item.thumb && <CardMedia component="img" image={item.thumb} alt={item.title} />}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h4" component={Link} color={"primary"} sx={{ textDecoration: "none" }} href={`/blog/${item.slug}`}>{item.title}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography><div
                        dangerouslySetInnerHTML={{ __html: metniKisalt(item.content, 200) }}
                      /></Typography>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
