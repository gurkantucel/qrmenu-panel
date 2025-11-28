import { Chip, Dialog, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { CloseSquare } from 'iconsax-react';
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import dayjs from 'dayjs';
import currency from 'utils/currency';
import MainCard from 'components/MainCard';

const ViewOrderModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()


    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <Dialog open={open && modalType == ModalEnum.viewOrder} onClose={handleClose} fullWidth maxWidth="sm">
            <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
            >
                <Grid item>
                    <DialogTitle>{intl.formatMessage({ id: "detail" })}</DialogTitle>
                </Grid>
                <Grid item sx={{ mr: 1.5 }}>
                    <IconButton color="secondary" onClick={handleClose}>
                        <CloseSquare />
                    </IconButton>
                </Grid>
            </Grid>
            <List sx={{ px: 2.5 }}>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "orderId" })}</Typography>} secondary={<Typography component="span" variant='body1'>{`${data?.id}`}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "orderId" })}</Typography>} secondary={<Chip color={data?.status == "PAYMENT_PENDING" ? "warning" : data?.status == "PAYMENT_SUCCESSFUL" ? 'success' : "error"} label={intl.formatMessage({ id: data?.status ?? "locale" })} size="small" variant="light" />} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "createdDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.createdAt != null ? dayjs(data?.createdAt ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "updatedDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.updatedAt != null ? dayjs(data?.updatedAt ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
            </List>
            <MainCard content={false} sx={{ borderRadius: '0 0 12px 12px', borderTop: 'none', padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ad</TableCell>
                                <TableCell align="right">Tür</TableCell>
                                <TableCell align="right">Fiyat</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.branches?.map((item: any, index: number) => (<TableRow key={`row-${index}`}>
                                <TableCell component="th" scope="row">{item.branchName ?? "ANA PAKET"}</TableCell>
                                <TableCell align="right">{intl.formatMessage({ id: item.packageType })}</TableCell>
                                <TableCell align="right">{currency(item.calculatedPrice, item.currencyCode)}</TableCell>
                            </TableRow>))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
            <MainCard sx={{ marginTop: 2, margin: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">{`Ara Toplam`}</Typography>
                    <Typography variant="subtitle1" align="right">
                        {currency(data?.totalPrice ?? 0)}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">{`KDV (%${data?.vat})`}</Typography>
                    <Typography variant="subtitle1" align="right">
                        {currency(data?.vatAmount ?? 0)}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Toplam</Typography>
                    <Typography variant="subtitle1" align="right">
                        {currency(data?.paidPrice ?? 0)}
                    </Typography>
                </Stack>
            </MainCard>
        </Dialog>
    )
}

export default ViewOrderModal