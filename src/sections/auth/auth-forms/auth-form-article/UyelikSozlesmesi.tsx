import { Checkbox, FormHelperText, Grid, Link, Typography } from '@mui/material'
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react'
import AuthFormArticleModal from './AuthFormArticleModal';
import { useLazyGetStaticPageReadQuery } from 'reduxt/features/static-page/static-page-api';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { closeModal, ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';

const AuthFormsUyelikSozlesmesi = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);

    const handleClose = () => {
        dispatch(closeModal())
    };

    const { handleChange, errors, touched } = useFormikContext<any>();

    const [getStaticPageRead, {
        data: getStaticPageReadData,
        isLoading: getStaticPageReadLoading
    }] = useLazyGetStaticPageReadQuery();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.uyelikSozlesmesi) {
            getStaticPageRead({ code: "00006" });
        }
    }, [open, modalType])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <AuthFormArticleModal open={open && modalType == ModalEnum.uyelikSozlesmesi} title='Üyelik Sözleşmesi' content={getStaticPageReadData?.data.content} onClose={handleClose} isLoading={getStaticPageReadLoading} />
            <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                <Grid><Checkbox name='membershipAgreement' onChange={handleChange} /></Grid>
                <Grid>
                    <Typography
                        component={Link}
                        onClick={() => {
                            dispatch(setModal({
                                open: true,
                                modalType: ModalEnum.uyelikSozlesmesi
                            }))
                        }}
                        variant="body2"
                        sx={{ textDecoration: 'none' }}
                        color="primary"
                    >
                        {"Üyelik Sözleşmesi *"}
                    </Typography><>{" Okudum ve Kabul Ediyorum."}</></Grid>
                {touched.membershipAgreement && errors.membershipAgreement && (
                    <Grid> <FormHelperText style={{ marginTop: 0 }} error id="membershipAgreement">
                        {`(${errors.membershipAgreement})`}
                    </FormHelperText></Grid>
                )}
            </Grid>
        </>
    )
}

export default AuthFormsUyelikSozlesmesi