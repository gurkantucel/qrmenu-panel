"use client"
// next
import Image from 'next/image'
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';

import { Alert } from '@mui/material';
import { Bill, ShoppingCart } from 'iconsax-react';
import YellowCard from 'components/cards/YellowCard';

export default function AuthPayFormPage() {
    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container xs={12} marginBottom={5} justifyContent={"center"}>
                        <Image src={"/assets/images/klinik_ease_logo.png"} width={256} height={52} alt='Logo' quality={100} />
                    </Grid>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Ödeme Formu</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <>
                        <Alert color="secondary" icon={<Bill />} sx={{ marginBottom: 2 }}>
                            {"Ödeme adımını tamamlayarak hesabınızı aktifleştirebilirsiniz."}
                        </Alert>
                        <YellowCard title='Yeni Abonelik Paketi' iconPrimary={ShoppingCart} 
                        content={[
                            `Toplam Tutar: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: "TRY" }).format(Number(100))}`,
                            `Hesaplanan KDV (%20): ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: "TRY" }).format(Number(20))}`,
                            `İndirim (HGTUCEL): ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: "TRY" }).format(Number(20))}`,
                        ]} 
                        sumText={`Ödenecek Tutar: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: "TRY" }).format(Number(120))}`}
                        />
                    </>
                </Grid>
            </Grid>
        </AuthWrapper>
    )
}