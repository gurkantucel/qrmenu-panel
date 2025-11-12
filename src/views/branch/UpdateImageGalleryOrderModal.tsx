import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, ImageList, ImageListItem, Typography } from '@mui/material'
import { CloseSquare } from 'iconsax-react';
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import AnimateButton from 'components/@extended/AnimateButton';
import { PuffLoader } from 'react-spinners';
import { enqueueSnackbar } from 'notistack';
import { useGetImageGalleryListQuery, useUpdateImageGalleryOrderMutation } from 'reduxt/features/image-gallery/image-gallery-api';
import { ImageGalleryData } from 'reduxt/features/image-gallery/models/image-gallery-model';
import Image from 'next/image'

const UpdateImageGalleryOrderModal = ({ branchSlug }: { branchSlug?: string | null }) => {

    const dispatch = useAppDispatch();

    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [galleries, setImageGalleries] = useState<ImageGalleryData[]>([]);

    const { data: getImageGalleryData } = useGetImageGalleryListQuery({ branchSlug: `${branchSlug}` }, { skip: !branchSlug })

    const [updateImageGalleryOrder, { isLoading: updateImageGalleryOrderIsLoading, data: updateImageGalleryOrderResponse, error: updateImageGalleryOrderError }] = useUpdateImageGalleryOrderMutation();

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (open && modalType == ModalEnum.updateImageGalleryOrder && getImageGalleryData?.data != null) {
            setImageGalleries(getImageGalleryData.data);
        }
    }, [open, modalType, getImageGalleryData])

    useEffect(() => {
        if (updateImageGalleryOrderResponse) {
            enqueueSnackbar(updateImageGalleryOrderResponse.message, {
                variant: updateImageGalleryOrderResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateImageGalleryOrderResponse?.success == true) {
                handleClose();
            }
        }
        if (updateImageGalleryOrderError) {
            const error = updateImageGalleryOrderError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateImageGalleryOrderResponse, updateImageGalleryOrderError])


    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = galleries.findIndex((c) => c.id === active.id);
        const newIndex = galleries.findIndex((c) => c.id === over.id);
        const newCategories = arrayMove(galleries, oldIndex, newIndex);
        setImageGalleries(newCategories);

        // Backend’e yeni sıralamayı gönder
        //const orderArray = newCategories.map((c) => c.id);
        //setLoading(true);
        try {
        } finally {
        }
    };

    const handleSubmit = () => {
        const orderArray = galleries.map((c) => c.id);
        updateImageGalleryOrder({ branchSlug: branchSlug, newImageList: orderArray })
    }

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.updateImageGalleryOrder} onClose={handleClose} maxWidth="lg" disablePortal>
                <DialogTitle>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                    >
                        <Grid item>
                            <Typography variant="h4">{intl.formatMessage({ id: "updateOrder" })}</Typography>
                        </Grid>
                        <Grid item sx={{ mr: 1.5 }}>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" marginBottom={3}>{"Kategorilerin sırasını sürükleyerek belirleyebilirsiniz. İşlem sonrası kaydetmeyi unutmayın."}</Typography>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={galleries.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                            <ImageList cols={3}>
                                {galleries.map((cat) => (
                                    <SortableItem key={cat.id} id={cat.id} imageUrl={cat.imageUrl} />
                                ))}
                            </ImageList>
                        </SortableContext>
                    </DndContext>
                </DialogContent>
                <DialogActions sx={{ marginTop: 5 }}>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <AnimateButton>
                        <Button disableElevation
                            disabled={updateImageGalleryOrderIsLoading}
                            type="button" variant="contained" color="primary" onClick={handleSubmit}>
                            {(updateImageGalleryOrderIsLoading) && <PuffLoader size={20} color='white' />}
                            {(updateImageGalleryOrderIsLoading == false) && intl.formatMessage({ id: "save" })}
                        </Button>
                    </AnimateButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UpdateImageGalleryOrderModal

function SortableItem({ id, imageUrl }: { id: string; imageUrl: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        transition,
        padding: 12,
        margin: "auto",
        marginBottom: 8,
        borderRadius: 8,
        border: "1px solid #e0e0e0",
        background: "#fafafa",
        cursor: "grab",
    };
    return (
        <ImageListItem ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <Image
                src={`${imageUrl}`}
                alt={"resim"}
                loading="lazy"
                width={164}
                height={164}
            />
        </ImageListItem>

    );
}