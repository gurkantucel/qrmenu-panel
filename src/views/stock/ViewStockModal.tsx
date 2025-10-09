import { Dialog, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import dayjs from 'dayjs';
import { CloseSquare } from 'iconsax-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';

const ViewStockModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
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
        <Dialog open={open && modalType == ModalEnum.viewStock} onClose={handleClose} fullWidth maxWidth="sm">
            <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
            >
                <Grid item>
                    <DialogTitle>{intl.formatMessage({ id: "stockDetail" })}</DialogTitle>
                </Grid>
                <Grid item sx={{ mr: 1.5 }}>
                    <IconButton color="secondary" onClick={handleClose}>
                        <CloseSquare />
                    </IconButton>
                </Grid>
            </Grid>
            <List sx={{ px: 2.5 }}>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "type" })}</Typography>} secondary={<Typography component="span" variant='body1'>{`${data?.movement_type == true ? "Artış" : "Azalış"}`}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "code" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_process_code ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "name" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_process_name ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "stock" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.quantity ? String(parseFloat(data?.quantity)) : ""}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "appointment" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_start !=null ? <Link target='_blank' href={`appointment/${data?.appointment_id}?${data?.patient_id}`} className='custom-link'>{`${dayjs(data?.appointment_start).format("DD.MM.YYYY")} (${data?.patient_full_name})`}</Link> : "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "createdBy" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.created_person ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "createdDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.created_at != null ? dayjs(data?.created_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "updatedBy" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.created_person ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "updatedDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.created_at != null ? dayjs(data?.updated_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
            </List>
        </Dialog>
    )
}

export default ViewStockModal