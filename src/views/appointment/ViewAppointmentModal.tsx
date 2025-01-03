import { Dialog, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { CloseSquare } from 'iconsax-react';
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import dayjs from 'dayjs';

const ViewAppointmentModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <Dialog open={open && modalType == ModalEnum.viewAppointment} onClose={handleClose} fullWidth maxWidth="sm">
            <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
            >
                <Grid item>
                    <DialogTitle>{intl.formatMessage({ id: "employeeDetail" })}</DialogTitle>
                </Grid>
                <Grid item sx={{ mr: 1.5 }}>
                    <IconButton color="secondary" onClick={handleClose}>
                        <CloseSquare />
                    </IconButton>
                </Grid>
            </Grid>
            <List sx={{ px: 2.5 }}>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "patientNameSurname" })}</Typography>} secondary={<Typography component="span" variant='body1'>{`${data?.patient_full_name ?? "-"}`}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "personNameSurname" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.person_full_name ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "status" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_status_name ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "appointmentDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_start != null ? dayjs(data?.appointment_start).format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "appointmentEndDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_end != null ? dayjs(data?.appointment_end).format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "appointmentDuration" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_duration ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "appointmentNote" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.appointment_note ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "appointmentCreatedPerson" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.created_person ?? "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "createdDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.created_at != null ? dayjs(data?.created_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "updatedDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{data?.created_at != null ? dayjs(data?.updated_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
            </List>
        </Dialog>
    )
}

export default ViewAppointmentModal