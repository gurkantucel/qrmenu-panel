"use client"
import { APP_DEFAULT_PATH } from 'config';
import { useIntl } from 'react-intl';
import { useAppDispatch } from 'reduxt/hooks';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { Box, Button, Divider, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, InputLabel, List, ListItem, ListItemIcon, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { Add, ArrowSwapVertical, CallCalling, Facebook, Gps, Instagram, Save2, ShopAdd, Sms, Trash, Whatsapp, Youtube } from 'iconsax-react';
import Select from 'react-select'
import { useGetBranchDropdownQuery, useGetBranchQuery, useUpdateBranchThemeMutation } from 'reduxt/features/branch/branch-api';
import { useEffect, useState } from 'react';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { useGetImageGalleryListQuery } from 'reduxt/features/image-gallery/image-gallery-api';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import UpdateBranchModal from './UpdateBranchModal';
import DeleteImageGalleryModal from './DeleteImageGalleryModal';
import AddImageGalleryModal from './AddImageGalleryModal';
import UpdateImageGalleryOrderModal from './UpdateImageGalleryOrderModal';
import CreateBranchLogoComponent from './CreateBranchLogoComponent';
import CreateBranchModal from './CreateBranchModal';
import { useAppSnackbar } from 'hooks/useAppSnackbar';
import Image from 'next/image'
import PassiveBranchModal from './PassiveBranchModal';

const BranchView = () => {

    const intl = useIntl()

    const { showMessage } = useAppSnackbar();

    const dispatch = useAppDispatch();

    const breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "branches" })}` },
    ];

    const [branchSlug, setBranchSlug] = useState<string | null>()

    const [selectedThemeValue, setSelectedThemeValue] = useState('theme1');

    const { isLoading: getBranchDropdownLoading, isFetching: getBranchDropdownFetching, data: getBranchDropdownData } = useGetBranchDropdownQuery()

    const { isLoading: getBranchLoading, isFetching: getBranchFetching, data: getBranchData } = useGetBranchQuery({ slug: `${branchSlug}` }, { skip: !branchSlug })

    const { isLoading: getImageGalleryLoading, isFetching: getImageGalleryFetching, data: getImageGalleryData } = useGetImageGalleryListQuery({ branchSlug: `${branchSlug}` }, { skip: !branchSlug })

    const [updateBranchTheme, { isLoading: updateBranchThemeIsLoading, data: updateBranchThemeResponse, error: updateBranchThemeError }] = useUpdateBranchThemeMutation();

    const branchData = getBranchData?.data;

    const selectedBranch = getBranchDropdownData?.data?.find(
        (item: any) => item.field === branchSlug
    );

    useEffect(() => {
        if (getBranchDropdownData?.data != null) {
            setBranchSlug(getBranchDropdownData.data[0].field)
        }
    }, [getBranchDropdownData])

    useEffect(() => {
        if (getBranchData?.data != null) {
            if (getBranchData.data?.theme != null) {
                setSelectedThemeValue(getBranchData.data.theme)
            }
            if(getBranchData.data?.packages?.active == false){
                dispatch(setModal({open: true, modalType: ModalEnum.passiveBranch, title: getBranchData?.data?.title ?? "-"}))
            }
        }
    }, [getBranchData])

    useEffect(() => {
        if (updateBranchThemeResponse) {
            showMessage(updateBranchThemeResponse.message, updateBranchThemeResponse.success);
        }
        if (updateBranchThemeError) {
            var error = updateBranchThemeError as any;
            showMessage(error?.data?.message, false);
        }
    }, [updateBranchThemeResponse, updateBranchThemeError])


    return (
        <>
            <Breadcrumbs custom heading={`${intl.formatMessage({ id: "branches" })}`} links={breadcrumbLinks} />
            <CreateBranchModal />
            <UpdateBranchModal />
            <PassiveBranchModal />
            <MainCard border={false}>
                <Box sx={{ mt: 2.5 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Stack direction={"column"} marginBottom={2}>
                                <InputLabel sx={{ marginBottom: 1 }}>{intl.formatMessage({ id: "branch" })}</InputLabel>
                                <Select
                                    placeholder={intl.formatMessage({ id: "makeYourChoice" })}
                                    noOptionsMessage={(label) => intl.formatMessage({ id: "notFound" })}
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
                                    components={{
                                        MenuList: (props) => (
                                            <>
                                                {props.children}
                                                <Box display="flex" justifyContent="center" py={1.5}>
                                                    <Button
                                                        variant="text"
                                                        onClick={() => {
                                                            dispatch(setModal({
                                                                open: true,
                                                                modalType: ModalEnum.addBranch
                                                            }))
                                                        }}
                                                        startIcon={<ShopAdd size="18" />}
                                                        sx={{
                                                            textTransform: "none",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            fontWeight: 500,
                                                            fontSize: 14,
                                                        }}
                                                    >
                                                        {intl.formatMessage({ id: "addBranch" })}
                                                    </Button>
                                                </Box>
                                            </>
                                        ),
                                    }}
                                    onChange={(val: any) => {
                                        setBranchSlug(val?.value);
                                    }}
                                />
                            </Stack>
                            {getBranchDropdownLoading || getBranchDropdownFetching || getBranchLoading || getBranchFetching ? <CustomScaleLoader /> : <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <MainCard>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Stack direction="row" justifyContent="flex-end">
                                                    <Button title={intl.formatMessage({ id: "editProfile" })} color='primary' variant="contained" onClick={() => {
                                                        dispatch(setModal({
                                                            open: true, modalType: ModalEnum.updateBranch,
                                                            data: getBranchData?.data
                                                        }))
                                                    }}>{intl.formatMessage({ id: "edit" })}</Button>
                                                </Stack>
                                                <Stack spacing={2.5} alignItems="center">
                                                    <CreateBranchLogoComponent branchId={selectedBranch?.value ?? ""} logoUrl={branchData?.logo} />
                                                    <Stack spacing={0.5} alignItems="center">
                                                        <Typography variant="h5">{branchData?.title ?? "-"}</Typography>
                                                        <Typography color="secondary">{branchData?.address ?? "-"}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Sms size={18} />
                                                        </ListItemIcon>
                                                        <Typography align='left'>{branchData?.email ?? "-"}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <CallCalling size={18} />
                                                        </ListItemIcon>
                                                        <Typography align="right">{branchData?.phone ?? "-"}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Gps size={18} />
                                                        </ListItemIcon>
                                                        <Typography align="right">{`${branchData?.country ?? "-"}/${branchData?.province ?? "-"}/${branchData?.district ?? "-"}`}</Typography>
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Whatsapp size={18} />
                                                        </ListItemIcon>
                                                        <Typography align='left'>{branchData?.social?.whatsapp ?? "-"}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Instagram size={18} />
                                                        </ListItemIcon>
                                                        <Typography align='left'>{branchData?.social?.instagram ?? "-"}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Facebook size={18} />
                                                        </ListItemIcon>
                                                        <Typography align="left">{branchData?.social?.facebook ?? "-"}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Youtube size={18} />
                                                        </ListItemIcon>
                                                        <Typography align="left">{branchData?.social?.x ?? "-"}</Typography>
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <MainCard title={intl.formatMessage({ id: "aboutUs" })}>
                                        {branchData?.description && <div
                                            dangerouslySetInnerHTML={{ __html: branchData?.description }}
                                        />}
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <DeleteImageGalleryModal />
                                    <AddImageGalleryModal />
                                    <UpdateImageGalleryOrderModal branchSlug={branchSlug} />
                                    <MainCard title={intl.formatMessage({ id: "pictureGallery" })} secondary={<Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 2 }} justifyContent={"space-between"} alignItems={{ xs: "normal", sm: "center" }} sx={{ padding: 2 }}>
                                        <Button variant="dashed" startIcon={<Add />} onClick={() => {
                                            dispatch(setModal({
                                                open: true,
                                                modalType: ModalEnum.addImageGallery,
                                                data: { branchId: branchData?.id, branchSlug: branchData?.slug }
                                            }))
                                        }}>{intl.formatMessage({ id: "add" })}</Button>
                                        <Button variant="dashed" startIcon={<ArrowSwapVertical />} onClick={() => {
                                            dispatch(setModal({
                                                open: true,
                                                modalType: ModalEnum.updateImageGalleryOrder
                                            }))
                                        }}>{intl.formatMessage({ id: "updateOrder" })}</Button>
                                    </Stack>}>
                                        {getImageGalleryLoading || getImageGalleryFetching ? <CustomScaleLoader /> : getImageGalleryData?.data == null || getImageGalleryData?.data?.length == 0 ? <Typography>{intl.formatMessage({ id: "notUploadedImage" })}</Typography> : <ImageList gap={8} sx={{
                                            display: "grid !important",
                                            gridTemplateColumns: {
                                                xs: "repeat(2, 1fr) !important",
                                                sm: "repeat(4, 1fr) !important",
                                                md: "repeat(4, 1fr) !important",
                                            },
                                        }}>
                                            {getImageGalleryData?.data?.map((item) => (
                                                <ImageListItem key={item.imageUrl} style={{ position: "relative", height: 200 }} className="responsive-image-item">
                                                    <Image
                                                        src={`${item.imageUrl}`}
                                                        alt={item.id}
                                                        fill
                                                        style={{
                                                            objectFit: "cover",
                                                        }}
                                                        sizes="(max-width: 600px) 100vw, 33vw"
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
                                                                    dispatch(setModal({
                                                                        open: true, modalType: ModalEnum.deleteImageGallery,
                                                                        id: item.id,
                                                                    }));
                                                                }}
                                                            >
                                                                <Trash />
                                                            </IconButton>
                                                        }
                                                        actionPosition="right"
                                                    />
                                                </ImageListItem>
                                            )) ?? []}
                                        </ImageList>}
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <MainCard title={updateBranchThemeIsLoading ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "themeSelection" })} secondary={<Button variant="dashed" startIcon={<Save2 />}
                                        disabled={branchData?.theme == selectedThemeValue || updateBranchThemeIsLoading}
                                        onClick={() => {
                                            updateBranchTheme({ branchId: selectedBranch?.value ?? "0", theme: selectedThemeValue })
                                        }}>{intl.formatMessage({ id: "save" })}</Button>}>
                                        <RadioGroup>
                                            <ImageList gap={8}
                                                sx={{
                                                    display: "grid !important",
                                                    gridTemplateColumns: {
                                                        xs: "repeat(2, 1fr) !important",
                                                        sm: "repeat(4, 1fr) !important",
                                                        md: "repeat(6, 1fr) !important",
                                                    },
                                                }}>
                                                {itemData.map((item) => (
                                                    <ImageListItem key={item.img}>
                                                        <img
                                                            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                            src={`${item.img}?w=248&fit=crop&auto=format`}
                                                            alt={item.title}
                                                            loading="lazy"
                                                        />
                                                        <ImageListItemBar
                                                            title={item.title}
                                                            actionIcon={
                                                                <Radio
                                                                    checked={selectedThemeValue === item.title}
                                                                    onChange={(event) => {
                                                                        setSelectedThemeValue(event.target.value);
                                                                    }}
                                                                    value={item.title}
                                                                    name="radio-buttons"
                                                                    inputProps={{ 'aria-label': item.title }}
                                                                    sx={{
                                                                        color: "white",
                                                                        '&.Mui-checked': {
                                                                            color: "white",
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    </ImageListItem>
                                                ))}
                                            </ImageList>
                                        </RadioGroup>
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

export default BranchView

const itemData = [
    {
        img: 'https://pub-b174b305229b424ab32237bcdf53f76a.r2.dev/common/theme/theme-1.png',
        title: 'theme1',
    },
    {
        img: 'https://pub-b174b305229b424ab32237bcdf53f76a.r2.dev/common/theme/theme-2.png',
        title: 'theme2',
    },
    {
        img: 'https://pub-b174b305229b424ab32237bcdf53f76a.r2.dev/common/theme/theme-3.png',
        title: 'theme3',
    },
    {
        img: 'https://pub-b174b305229b424ab32237bcdf53f76a.r2.dev/common/theme/theme-4.png',
        title: 'theme4',
    },
    {
        img: 'https://pub-b174b305229b424ab32237bcdf53f76a.r2.dev/common/theme/theme-5.png',
        title: 'theme5',
    },
    {
        img: 'https://pub-b174b305229b424ab32237bcdf53f76a.r2.dev/common/theme/theme-6.png',
        title: 'theme6',
    }
]