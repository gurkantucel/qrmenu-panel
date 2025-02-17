import { Checkbox, FormHelperText, Grid, Link, Typography } from '@mui/material'
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react'
import AuthFormArticleModal from './AuthFormArticleModal';
import { useLazyGetStaticPageReadQuery } from 'reduxt/features/static-page/static-page-api';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { closeModal, ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';

const AuthFormsAydinlatmaMetni = () => {

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
        if (open == true && modalType == ModalEnum.aydinlatmaMetni) {
            getStaticPageRead({ code: "00007" });
        }
    }, [open, modalType])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <AuthFormArticleModal open={open && modalType == ModalEnum.aydinlatmaMetni} title='Aydınlatma Metni' content={getStaticPageReadData?.data.content} onClose={handleClose} isLoading={getStaticPageReadLoading} />
            <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                <Grid><Checkbox name='illuminationText' onChange={handleChange} /></Grid>
                <Grid>
                    <Typography
                        component={Link}
                        onClick={() => {
                            dispatch(setModal({
                                open: true,
                                modalType: ModalEnum.aydinlatmaMetni
                            }))
                        }}
                        variant="body2"
                        sx={{ textDecoration: 'none' }}
                        color="primary"
                    >
                        {"Aydınlatma Metni *"}
                    </Typography><>{" Okudum ve Kabul Ediyorum."}</></Grid>
                {touched.illuminationText && errors.illuminationText && (
                    <Grid> <FormHelperText style={{ marginTop: 0 }} error id="illuminationText">
                        {`(${errors.illuminationText})`}
                    </FormHelperText></Grid>
                )}
            </Grid>
        </>
    )
}

export default AuthFormsAydinlatmaMetni