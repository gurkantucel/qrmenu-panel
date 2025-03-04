"use client"
import { CallCalling, DocumentCode2, SmsEdit, SmsStar, SmsTracking, UserEdit, UserTick } from 'iconsax-react';
import { Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Link from 'next/link';
import MainCard from 'components/MainCard';

const SmsInfoNotFound = () => {
    return (
        <MainCard content={false}>
            <Grid container flexDirection={"column"} alignContent={"center"} justifyContent={"center"} alignItems={"center"} padding={4}>
                <SmsTracking size={48} color='#60d99d' />
                <Typography variant='h5' marginTop={2}>{"SMS Gönderimi İçin Ayarlar Gerekiyor…"}</Typography>
            </Grid>
            <Grid container justifyContent={"center"}>
                <Grid container xs={12} md={9} paddingX={4} paddingBottom={4}>
                    <List sx={{ p: 0 }}>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <UserTick color='#60d99d' />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography>
                                            {"Kendi markanızla veya isminizle SMS gönderimi gerçekleştirmek için telefon numarası tahsis edilmesi gerekiyor. Yasal düzenlemeler gereği, numara tahsis işlemleri"} <b>şahsen</b> yapılmaktadır.
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <DocumentCode2 />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography>
                                            {"Klinik Ease olarak SMS gönderimi için Bilgi Teknolojileri ve İletişim Kurumu (BTK) tarafından lisanslandırılan Sabit Telefon Operatörü"} <b>Netgsm</b> ile entagrasyonumuz bulunuyor.
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <UserEdit color='#60d99d' />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography>
                                            {"Netgsm internet sitesi Online İşlemler menüsünden başvurunuzu hızlıca yapabilir, Müşteri Hizmetleri üzerinden yardım alabilirsiniz."}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <SmsStar />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography>
                                            {"Başvurunuzun onaylanması sonrasında entegrasyon sağlanarak randevu oluşturma, randevu hatırlatma, doğum günü gibi otomatik gönderilen sms şablonlarını kullanmaya başlayabilirsiniz."}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <CallCalling color='#60d99d' />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography>
                                            {"Netgsm başvuru süreci hakkında sizlere destek vermeye hazırız. Aklınıza takılan soruları"} <Link href={"tel:8503081237"} style={{ color: "#60d99d", fontWeight: "bold" }}>{"850 308 12 37"}</Link> telefon numarası üzerinden sorabilirsiniz.
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <SmsEdit />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography>
                                            {"Başvurunuzun onaylanması sonrasında veya Netgsm üzerinde zaten bir aboneliğiniz bulunuyor ise"} <Link href={"mailto:destek@klinikease.com.tr"} style={{ color: "#60d99d", fontWeight: "bold" }}>destek@klinikease.com.tr</Link> {"mail adresimiz üzerinden bize bilgi verebilirsiniz."}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </MainCard>
    )
}

export default SmsInfoNotFound