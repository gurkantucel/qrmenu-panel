"use client"

import { Box, Card, Grid, Typography } from "@mui/material"
import { Message, Whatsapp,Location } from "iconsax-react"

const ContactContent2 = () => {
    return (
        <Box sx={{
            bgcolor: '#edf8f4', pb: { md: 10, xs: 7 }, pt: 4,
            '& .MuiAccordion-root': {
                borderColor: 'divider',
                borderRadius: 4,
                '& .MuiAccordionSummary-root': {
                    bgcolor: 'transparent',
                }
            },
            '& .MuiAccordionSummary-expandIconWrapper': {
                color: 'primary.main'
            }
        }}>
            <Grid container sx={{ paddingLeft: 4, paddingRight: 4, paddingTop: 4 }} spacing={8}>
                <Grid item xs={6}>
                    <Card sx={{ padding: 2 }}>
                        <Whatsapp size={42} color="#128c7e" />
                        <Typography variant="body1" color={"GrayText"}>{"WhatsApp Destek Hattı"}</Typography>
                        <Typography variant="h4" sx={{marginTop: 2, marginBottom: 2}}>{"510 XXX XX XX"}</Typography>
                        <Typography variant="body1" color={"GrayText"} sx={{marginTop: 1}}>{"Sorularınıza hızlıca yanıt alabilmeniz için WhatsApp destek hattını kullanabilirsiniz."}</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{ padding: 2 }}>
                        <Message size={42} color="#128c7e" />
                        <Typography variant="body1" color={"GrayText"}>{"Bize Yazın"}</Typography>
                        <Typography variant="h4" sx={{marginTop: 2, marginBottom: 2}}>{"destek@klinikease.com.tr"}</Typography>
                        <Typography variant="body1" color={"GrayText"} sx={{marginTop: 1}}>{"Bize e-posta adresimizden ulaşabilirsiniz. Mesajlarınıza en geç 1 iş günü içinde dönüş yapılacaktır."}</Typography>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card sx={{ padding: 2 }}>
                        <Location size={42} color="#128c7e" />
                        <Typography variant="h5" color={"GrayText"}>{"İletişim Adresimiz"}</Typography>
                        <Typography variant="body1" sx={{marginTop: 2, marginBottom: 2}}>{"OSTİM OSB MAH. 100.YIL BLV. NO: 55 A İÇ KAPI NO: 20 YENİMAHALLE/ ANKARA"}</Typography>
                    </Card>
                </Grid>
            </Grid>

        </Box>
    )
}

export default ContactContent2