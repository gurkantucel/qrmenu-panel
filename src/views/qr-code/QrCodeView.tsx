"use client"
import { APP_DEFAULT_PATH } from 'config';
import { useLocalizedField } from 'hooks/useLocalizedField';
import { useIntl } from 'react-intl';
import { useAppDispatch } from 'reduxt/hooks';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { Box, Button, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, InputLabel, Stack, Typography } from '@mui/material';
import { Add, DocumentDownload } from 'iconsax-react';
import Select from 'react-select'
import { useGetBranchDropdownQuery } from 'reduxt/features/branch/branch-api';
import { useEffect, useState } from 'react';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import CreateQrCodeModal from './CreateQrCodeModal';
import { useGetQrCodeListQuery } from 'reduxt/features/qr-code/qr-code-api';

const QrCodeView = () => {

    const intl = useIntl()

    const t = useLocalizedField()

    const dispatch = useAppDispatch();

    const breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "qrCodes" })}` },
    ];

    const [branchSlug, setBranchSlug] = useState<string | null>()

    const { isLoading: getBranchDropdownLoading, isFetching: getBranchDropdownFetching, data: getBranchDropdownData } = useGetBranchDropdownQuery()

    const selectedBranch = getBranchDropdownData?.data?.find(
        (item: any) => item.field === branchSlug
    );

    const { isLoading: qrCodeListLoading, isFetching: qrCodeListFetching, data: qrCodeListData } = useGetQrCodeListQuery({ branchId: `${selectedBranch?.value}` }, { skip: !selectedBranch })

    const downloadImage = async (imageUrl: string) => {
        const proxyUrl = `/api/download?url=${encodeURIComponent(imageUrl)}&name=${selectedBranch?.field ?? "img"}-qrcode.png`;
        const a = document.createElement("a");
        a.href = proxyUrl;
        a.download = `${selectedBranch?.value}-qrcode.png`; // optional
        a.click();
    };


    useEffect(() => {
        if (getBranchDropdownData?.data != null) {
            setBranchSlug(getBranchDropdownData.data[0].field)
        }
    }, [getBranchDropdownData])

    return (
        <>
            <Breadcrumbs custom heading={`${intl.formatMessage({ id: "qrCodes" })}`} links={breadcrumbLinks} />
            <CreateQrCodeModal />
            <MainCard border={false}>
                <Box sx={{ mt: 2.5 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Stack direction={"column"} marginBottom={2}>
                                <InputLabel sx={{ marginBottom: 1 }}>{intl.formatMessage({ id: "branch" })}</InputLabel>
                                <Select
                                    placeholder={intl.formatMessage({id: "makeYourChoice"})}
                                    noOptionsMessage={(label) => intl.formatMessage({id: "notFound"})}
                                    styles={{
                                        container: (baseStyles: any) => ({
                                            ...baseStyles,
                                            zIndex: 998
                                        }),
                                        control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            borderColor: '#BEC8D0',
                                            borderRadius: '8px',
                                            boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(67, 142, 255, 0.25)' : 'var(--tb-border-color)',
                                            color: '#1d2630',
                                            minHeight: '48px',
                                            paddingLeft: '5px',
                                        }),
                                        placeholder: (baseStyles, state) => ({
                                            ...baseStyles,
                                            color: '#aeaeae',
                                        }),
                                    }}
                                    value={
                                        branchSlug
                                            ? {
                                                label: selectedBranch?.label ?? "",
                                                value: selectedBranch?.field ?? 0,
                                            }
                                            : null
                                    }
                                    isLoading={getBranchDropdownLoading}
                                    options={getBranchDropdownData?.data?.map((item: any) => ({
                                        value: item.field,
                                        label: item.label
                                    }))}
                                    onChange={(val: any) => {
                                        setBranchSlug(val?.value);
                                    }}
                                />
                            </Stack>
                            {getBranchDropdownLoading || getBranchDropdownFetching ? <CustomScaleLoader /> : <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <MainCard title={intl.formatMessage({ id: "qrCodes" })} secondary={<Stack direction={"row"} spacing={2}>
                                        {qrCodeListData?.data.length == 0 && <Button variant="dashed" startIcon={<Add />} onClick={() => {
                                            dispatch(setModal({
                                                open: true,
                                                modalType: ModalEnum.createQrCode,
                                                title: intl.formatMessage({id: "createQR"}),
                                                data: { branchId: selectedBranch?.value, branchSlug: selectedBranch?.field }
                                            }))
                                        }}>{intl.formatMessage({ id: "create" })}</Button>}
                                    </Stack>}>
                                        {qrCodeListLoading || qrCodeListFetching ? <CustomScaleLoader /> : qrCodeListData?.data == null || qrCodeListData?.data?.length == 0 ? <Typography>{intl.formatMessage({ id: "notUploadedImage" })}</Typography> : <ImageList variant="masonry" cols={3} gap={8}>
                                            {qrCodeListData?.data?.map((item) => (
                                                <ImageListItem key={item.id}>
                                                    <img
                                                        srcSet={`${item.image}?w=328&h=328&fit=crop&auto=format&dpr=2 2x`}
                                                        src={`${item.image}?w=328&h=328&fit=crop&auto=format`}
                                                        alt={item.id}
                                                        loading="lazy"
                                                    />
                                                    <ImageListItemBar
                                                        sx={{
                                                            background:
                                                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                                        }}
                                                        title={""}
                                                        position="top"
                                                        actionIcon={
                                                            <IconButton
                                                                sx={{ color: 'white' }}
                                                                aria-label={`star ${item.id}`}
                                                                size="large"
                                                                onClick={() => {
                                                                    downloadImage(item.image)
                                                                }}
                                                            >
                                                                <DocumentDownload />
                                                            </IconButton>
                                                        }
                                                        actionPosition="right"
                                                    />
                                                </ImageListItem>
                                            )) ?? []}
                                        </ImageList>}
                                    </MainCard>
                                </Grid>
                            </Grid>}
                        </Grid>
                    </Grid>
                </Box>
            </MainCard>
        </>
    )
}

export default QrCodeView