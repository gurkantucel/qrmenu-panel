import { Dialog, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { CloseSquare } from 'iconsax-react';
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import dayjs from 'dayjs';

const ViewAppointmentProcessModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <Dialog open={open && modalType == ModalEnum.viewAppointmentProcess} onClose={handleClose} fullWidth maxWidth="sm">
            <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
            >
                <Grid item>
                    <DialogTitle>{intl.formatMessage({ id: "appointmentProcess" })}</DialogTitle>
                </Grid>
                <Grid item sx={{ mr: 1.5 }}>
                    <IconButton color="secondary" onClick={handleClose}>
                        <CloseSquare />
                    </IconButton>
                </Grid>
            </Grid>
            <List sx={{ px: 2.5 }}>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "name" })}</Typography>} secondary={<Typography component="span" variant='body1'>{`${data?.name ?? "-"}`}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "code" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.code ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "type" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_process_type_name ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "amount" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.total ?? "-"} {data?.currency_code ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "vat" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.vat ?? "-"}</Typography>} />
                </ListItem>
                {data?.detail != null && <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "subProcesses" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.detail.map((item:any)=> item.name).join(', ')}</Typography>} />
                </ListItem>}
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

export default ViewAppointmentProcessModal