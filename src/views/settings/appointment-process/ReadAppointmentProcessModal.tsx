import { Chip, Dialog, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { CloseSquare } from 'iconsax-react';
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import dayjs from 'dayjs';
import { useReadAppointmentProcessQuery } from 'reduxt/features/settings/appointment-process-api';
import CustomScaleLoader from 'components/CustomScaleLoader';

const ReadAppointmentProcessModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, title } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const { data: readAppointmentProcessData, isLoading: readAppointmentProcessLoading, isFetching: readAppointmentProcessFetching } = useReadAppointmentProcessQuery({ appointment_process_id: data?.appointment_process_id }, { skip: open == false && data == null && modalType != ModalEnum.readAppointmentProcess });

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <Dialog open={open && modalType == ModalEnum.readAppointmentProcess} onClose={handleClose} fullWidth maxWidth="sm">
            <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
            >
                <Grid item>
                    <DialogTitle>{title ?? "-"}</DialogTitle>
                </Grid>
                <Grid item sx={{ mr: 1.5 }}>
                    <IconButton color="secondary" onClick={handleClose}>
                        <CloseSquare />
                    </IconButton>
                </Grid>
            </Grid>
            {readAppointmentProcessLoading || readAppointmentProcessFetching ? <CustomScaleLoader /> :
                <List sx={{ px: 2.5 }}>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "name" })}</Typography>} secondary={<Typography component="span" variant='body1'>{`${readAppointmentProcessData?.data?.name ?? "-"}`}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "code" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.code ?? "-"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "type" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.appointment_process_type_name ?? "-"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body1' color={"black"}>{intl.formatMessage({ id: "amount" })}</Typography>} secondary={<Typography component="span" variant='body1'>{`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: readAppointmentProcessData?.data?.currency_code ?? "TRY" }).format(Number(readAppointmentProcessData?.data?.total))}`}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "vat" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.vat ?? "-"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body1' color={"black"}>{intl.formatMessage({ id: "stock" })}</Typography>} secondary={<Chip color={
                            readAppointmentProcessData?.data?.stock_summary != null && readAppointmentProcessData?.data?.critical_stock != null &&
                                parseFloat(readAppointmentProcessData?.data.stock_summary) < parseFloat(readAppointmentProcessData?.data.critical_stock)
                                ? "error"
                                : "info"
                        } variant="light" label={readAppointmentProcessData?.data?.stock_summary != null ? `${parseFloat(readAppointmentProcessData?.data?.stock_summary)}` : "-"} />} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body1' color={"black"}>{intl.formatMessage({ id: "criticalStockLevel" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.critical_stock != null ? `${parseFloat(readAppointmentProcessData?.data?.critical_stock)}` : "-"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "criticalStockNotification" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.notify_critical_stock == true ? "Aktif" : "Pasif"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "createdBy" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.created_person ?? "-"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "createdDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.created_at != null ? dayjs(readAppointmentProcessData?.data?.created_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "updatedBy" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.created_person ?? "-"}</Typography>} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "updatedDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readAppointmentProcessData?.data?.updated_at != null ? dayjs(readAppointmentProcessData?.data?.updated_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                    </ListItem>
                </List>}
        </Dialog>
    )
}

export default ReadAppointmentProcessModal