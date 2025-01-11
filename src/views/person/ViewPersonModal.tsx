import { Dialog, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import CustomScaleLoader from 'components/CustomScaleLoader';
import { CloseSquare } from 'iconsax-react';
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useLazyReadPersonQuery } from 'reduxt/features/person/person-api';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import dayjs from 'dayjs';

const ViewPersonModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [readPerson, {
        data: readPersonData,
        isLoading: readPersonLoading,
        isFetching: readPersonFetching
    }] = useLazyReadPersonQuery();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.viewPerson) {
            readPerson({ person_id: id });
        }
    }, [open])


    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <Dialog open={open && modalType == ModalEnum.viewPerson} onClose={handleClose} fullWidth maxWidth="sm">
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
            {readPersonLoading || readPersonFetching ? <CustomScaleLoader /> : <List sx={{ px: 2.5 }}>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "nameSurname" })}</Typography>} secondary={<Typography component="span" variant='body1'>{`${readPersonData?.data.name} ${readPersonData?.data.surname}`}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "personType" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readPersonData?.data.person_type_name}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "phone" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readPersonData?.data.phone_number}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "email" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readPersonData?.data.email}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "authorities" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readPersonData?.data.person_authorizations.map((item) => item.module_name).join(', ')}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "acceptingAppointment" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readPersonData?.data.accepting_appointment ? intl.formatMessage({ id: "yes" }) : intl.formatMessage({ id: "no" })}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "createdDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readPersonData?.data.created_at != null ? dayjs(readPersonData?.data?.created_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<Typography component="p" variant='body2' color={"GrayText"}>{intl.formatMessage({ id: "updatedDate" })}</Typography>} secondary={<Typography component="span" variant='body1'>{readPersonData?.data.created_at != null ? dayjs(readPersonData?.data?.updated_at ?? "").locale("tr").format("DD.MM.YYYY HH:mm") : "-"}</Typography>} />
                </ListItem>
            </List>}
        </Dialog>
    )
}

export default ViewPersonModal