"use client"
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const error500 = '/assets/images/auth/pay_error_icon.png';

type Props = {
    title?: string
    content?: string
    img?: string
    btnTitle?: string
    btnHref?: string
}

const PayErrorView = (props: Props) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }} spacing={3}>
            <Grid item xs={12}>
                <Image
                    src={error500}
                    alt="mantis"
                    width={matchDownSM ? 350 : 350}
                    height={matchDownSM ? 325 : 325}
                    style={{
                        maxWidth: '100%',
                        height: 'auto'
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Stack justifyContent="center" alignItems="center">
                    <Typography align="center" variant={matchDownSM ? 'h2' : 'h1'}>
                        {props.title ?? "Ödeme Başarısız"}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" align="center" sx={{ width: { xs: '73%', sm: '70%' }, mt: 1 }}>
                        {props.content ?? "Ödeme alınamadı. Kredi kartı bilgilerinizi kontrol edebilir, bankanızla iletişime geçebilirsiniz."}
                    </Typography>
                    <Button component={Link} href={props.btnHref ?? "/app/auth/login"} variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
                        {props.btnTitle ?? "Üye Girişi"}
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default PayErrorView