import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AnimateButton from 'components/@extended/AnimateButton';
import Link from 'next/link';
import AuthWrapper2 from 'sections/auth/AuthWrapper2';

const PaySuccessPage = () => {
    return (
        <AuthWrapper2>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">Ödeme başarıyla alındı</Typography>
                    <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
                       {"Ödemeniz alındı. Hesabınız aktifleştirildi. E-posta adresinize gelen bilgilerle giriş sağlayabilirsiniz. Bizi tercih ettiğiniz için teşekkür ederiz :)"}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <AnimateButton>
                    <Button
                        component={Link}
                        href={'/app/auth/login'}
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {"Giriş Yap"}
                    </Button>
                </AnimateButton>
            </Grid>
        </Grid>
        </AuthWrapper2>
    )
}

export default PaySuccessPage