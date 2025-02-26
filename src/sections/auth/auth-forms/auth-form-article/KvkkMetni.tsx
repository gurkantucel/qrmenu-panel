import { Checkbox, FormHelperText, Grid, Link, Typography } from '@mui/material'
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react'
import AuthFormArticleModal from './AuthFormArticleModal';
import { useLazyGetStaticPageReadQuery } from 'reduxt/features/static-page/static-page-api';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { closeModal, ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';

const AuthFormsKvkk = () => {

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
        if (open == true && modalType == ModalEnum.kvkk) {
            getStaticPageRead({ slug: "kvkk" });
        }
    }, [open, modalType])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <AuthFormArticleModal open={open && modalType == ModalEnum.kvkk} title='Kişisel Verilerin İşlenmesine ilişkin Açık Rıza' content={getStaticPageReadData?.data.content} onClose={handleClose} isLoading={getStaticPageReadLoading} />
            <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                <Grid><Checkbox name='kvkk' onChange={handleChange} /></Grid>
                <Grid>
                    <Typography
                        component={Link}
                        onClick={() => {
                            dispatch(setModal({
                                open: true,
                                modalType: ModalEnum.kvkk
                            }))
                        }}
                        variant="body2"
                        sx={{ textDecoration: 'none' }}
                        color="primary"
                    >
                        {"Kişisel Verilerin İşlenmesine ilişkin Açık Rıza *"}
                    </Typography><>{" Okudum ve Kabul Ediyorum."}</></Grid>
                {touched.kvkk && errors.kvkk && (
                    <Grid> <FormHelperText style={{ marginTop: 0 }} error id="kvkk">
                        {`(${errors.kvkk})`}
                    </FormHelperText></Grid>
                )}
            </Grid>
        </>
    )
}

export default AuthFormsKvkk