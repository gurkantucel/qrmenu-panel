"use client"
import { Alert, AlertTitle, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams, useRouter } from 'next/navigation';
import { getPayForm } from 'app/(dashboard)/checkout/[slug]/actions';
import { PropagateLoader } from 'react-spinners';
import currency from 'utils/currency';

const CheckoutView = () => {

  const intl = useIntl()

  const breadcrumbLinks = [
    { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
    { title: `${intl.formatMessage({ id: "payment" })}` },
  ];

  const params = useParams<{ slug: string }>()

  const [result, setResult] = useState<any>(null);
  const [error] = useState<string | null>(null);
  const socialAnnexRef = useRef<HTMLDivElement>(null)

  const router = useRouter();

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
          router.push('/pay-failed/dont')
          //setError(response.status);
        }
      } catch (err: any) {
        router.push('/pay-failed/dont')
        //setError(err.message);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Breadcrumbs custom heading={`${intl.formatMessage({ id: "payment" })}`} links={breadcrumbLinks} />
      {(result == null && error == null) && <Stack direction={"column"} justifyContent={'center'} alignContent={'center'} alignItems={'center'} spacing={3}>
        <Alert severity="warning">
          <AlertTitle>{intl.formatMessage({id: "pleaseWait"})}</AlertTitle>
          {intl.formatMessage({id: "contactingBank"})}
        </Alert>
        <PropagateLoader />
        
      </Stack>}

      {result != null && <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <div id="iyzipay-checkout-form" className="responsive" ref={socialAnnexRef}></div>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <MainCard content={false} sx={{ borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
              <TableContainer>
                <Table sx={{ minWidth: 'auto' }} size="small" aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1">{intl.formatMessage({ id: "orderSummary" })}</Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                    {result.packageData?.branches?.map((item: any, index: number) => (<TableRow key={`summary-${index}`}>
                      <TableCell sx={{ borderBottom: 'none' }}>{intl.formatMessage({id: item.packageType})}</TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <Typography variant="subtitle1">{currency(item.calculatedPrice)}</Typography>
                      </TableCell>
                    </TableRow>))}
                    <TableRow>
                      <TableCell sx={{ borderBottom: 'none' }}>{`KDV (%${result.packageData?.vat})`}</TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <Typography variant="subtitle1">{currency(result.packageData?.vatAmount)}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: 'none' }}>{intl.formatMessage({ id: "total" })}</TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <Typography variant="subtitle1"> {currency(result.packageData?.paidPrice)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>}
    </>
  )
}

export default CheckoutView