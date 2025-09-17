"use client"
// next
import Image from 'next/image'
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import { getPayForm } from 'app/auth/pay-form/[slug]/actions';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'next/navigation';
import CustomScaleLoader from 'components/CustomScaleLoader';
import PayErrorView from './PayError';
import { Alert } from '@mui/material';
import YellowCard from 'components/cards/YellowCard';
import { Bill, ShoppingCart } from 'iconsax-react';

// ================================|| REGISTER ||================================ //

export default function AuthPayForm() {

    const params = useParams<{ slug: string }>()

    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const socialAnnexRef = useRef<HTMLDivElement>(null)

    const intl = useIntl()

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getPayForm(params.slug);
                if (response.status == "SUCCESS") {
                    setResult(response?.data);
                    const range = document.createRange()
                    const documentFragment = range.createContextualFragment(response?.data.checkoutFormContent);
                    socialAnnexRef.current?.appendChild(documentFragment)
                } else {
                    setError(response.status);
                }
            } catch (err: any) {
                setError(err.message);
            }
        }

        fetchData();
    }, []);

    if (error != null) {
        return <PayErrorView title='Ödeme Bulunmuyor' content='Ödemeye bekleyen bir sipariş bulunmuyor.' />
    }

    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container xs={12} marginBottom={5} justifyContent={"center"}>
                        <Image src={"/assets/images/logo_new_28.png"} width={350} height={70} alt='Klinik Ease' quality={100} className='mobil-logo' />
                    </Grid>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Ödeme Formu</Typography>
                    </Stack>
                </Grid>
                {(result == null && error == null) && <CustomScaleLoader />}
                <Grid item xs={12}>
                        <>
                            <Alert color="secondary" icon={<Bill />} sx={{ marginBottom: 2 }}>
                                {"Ödeme adımını tamamlayarak hesabınızı aktifleştirebilirsiniz."}
                            </Alert>
                            {result && <YellowCard title={result?.packageData?.order_kind_name} iconPrimary={ShoppingCart}
                                content={[
                                    `${intl.formatMessage({ id: "amount" })}: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: result?.packageData?.currency_code }).format(Number(result?.packageData?.amount))}`,
                                    `${intl.formatMessage({ id: "vat" })} (%${result?.packageData?.vat}): ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: result?.packageData?.currency_code }).format(Number(result?.packageData?.vat_amount))}`,
                                    `${intl.formatMessage({ id: "totalAmount" })}: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: result?.packageData?.currency_code }).format(Number(result?.packageData?.total_amount))}`,
                                    result?.packageData?.coupon_code != null ? `İndirim (${result?.packageData?.coupon_code} - %${result?.packageData?.coupon_discount_percentage}): ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: result?.packageData?.currency_code }).format(Number(result?.packageData?.coupon_discount_percentage))}` : "",
                                    `${intl.formatMessage({ id: "amountToBePaid" })}: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: result?.packageData?.currency_code }).format(Number(result?.packageData?.total))}`
                                ]}
                            />}
                            <div id="iyzipay-checkout-form" className="responsive" ref={socialAnnexRef}></div>
                        </>
                </Grid>
            </Grid>
        </AuthWrapper>
    );
}
