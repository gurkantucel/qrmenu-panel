import {  Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import {  ArrowSwapVertical, CloseSquare, HambergerMenu } from 'iconsax-react';
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useGetCategoryListQuery, useUpdateCategoryOrderMutation } from 'reduxt/features/category/category-api';
import { closeModal, ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { CategoryListData } from 'reduxt/features/category/models/category-model';
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
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AnimateButton from 'components/@extended/AnimateButton';
import { PuffLoader } from 'react-spinners';
import { enqueueSnackbar } from 'notistack';

const UpdateCategoryOrderModal = ({ branchSlug }: { branchSlug?: string | null }) => {

    const dispatch = useAppDispatch();

    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [categories, setCategories] = useState<CategoryListData[]>([]);

    const { data: getCategoryListData } = useGetCategoryListQuery({
        branchSlug: branchSlug,
    },
        { skip: !branchSlug }
    )

    const [updateCategoryOrder, { isLoading: updateCategoryOrderIsLoading, data: updateCategoryOrderResponse, error: updateCategoryOrderError }] = useUpdateCategoryOrderMutation();

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (open && modalType == ModalEnum.updateCategoryOrder && getCategoryListData?.data != null) {
            setCategories(getCategoryListData.data);
        }
    }, [open, modalType, getCategoryListData])

    useEffect(() => {
        if (updateCategoryOrderResponse) {
            enqueueSnackbar(updateCategoryOrderResponse.message, {
                variant: updateCategoryOrderResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateCategoryOrderResponse?.success == true) {
                handleClose();
            }
        }
        if (updateCategoryOrderError) {
            const error = updateCategoryOrderError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateCategoryOrderResponse, updateCategoryOrderError])


    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = categories.findIndex((c) => c.id === active.id);
        const newIndex = categories.findIndex((c) => c.id === over.id);
        const newCategories = arrayMove(categories, oldIndex, newIndex);
        setCategories(newCategories);

        // Backend’e yeni sıralamayı gönder
        //const orderArray = newCategories.map((c) => c.id);
        //setLoading(true);
        try {
        } finally {
        }
    };

    const handleSubmit = () => {
        const orderArray = categories.map((c) => c.id);
        updateCategoryOrder({ branchSlug: branchSlug, newCategoryList: orderArray })
    }

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <>
            <Button variant="dashed" startIcon={<ArrowSwapVertical />} onClick={() => {
                dispatch(setModal({
                    open: true,
                    modalType: ModalEnum.updateCategoryOrder
                }))
            }}>{intl.formatMessage({ id: "updateOrder" })}</Button>
            <Dialog open={open && modalType == ModalEnum.updateCategoryOrder} onClose={handleClose} maxWidth="lg" disablePortal>
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
                        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                            {categories.map((cat) => (
                                <SortableItem key={cat.id} id={cat.id} title={cat.title.tr} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </DialogContent>
                <DialogActions sx={{ marginTop: 5 }}>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <AnimateButton>
                        <Button disableElevation
                            disabled={updateCategoryOrderIsLoading}
                            type="button" variant="contained" color="primary" onClick={handleSubmit}>
                            {(updateCategoryOrderIsLoading) && <PuffLoader size={20} color='white' />}
                            {(updateCategoryOrderIsLoading == false) && intl.formatMessage({ id: "save" })}
                        </Button>
                    </AnimateButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UpdateCategoryOrderModal

function SortableItem({ id, title }: { id: string; title: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        transition,
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        border: "1px solid #e0e0e0",
        background: "#fafafa",
        cursor: "grab",
    };
    return (
        <ListItem ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <ListItemIcon sx={{ minWidth: 40 }}>
                <HambergerMenu />
            </ListItemIcon>
            <ListItemText primary={title} />
        </ListItem>
    );
}