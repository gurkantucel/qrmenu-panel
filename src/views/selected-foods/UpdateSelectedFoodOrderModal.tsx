import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { ArrowSwapVertical, CloseSquare, HambergerMenu } from 'iconsax-react';
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { closeModal, ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
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
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AnimateButton from 'components/@extended/AnimateButton';
import { PuffLoader } from 'react-spinners';
import { enqueueSnackbar } from 'notistack';
import { useGetSelectedFoodListQuery, useUpdateSelectedFoodOrderMutation } from 'reduxt/features/selected-food/selected-food-api';
import { SelectedFoodData } from 'reduxt/features/selected-food/models/selected-food-model';
import CustomScaleLoader from 'components/CustomScaleLoader';

const UpdateSelectedFoodOrderModal = ({ branchSlug }: { branchSlug?: string | null }) => {

    const dispatch = useAppDispatch();

    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [foods, setFoods] = useState<SelectedFoodData[]>([]);

    const { data: getMenuListData, isLoading: isMenuLoading, isFetching: isMenuFetching } = useGetSelectedFoodListQuery({
        branchSlug: branchSlug,
    },
        { skip: !branchSlug }
    )

    const [updateSelectedFoodOrder, { isLoading: updateSelectedFoodOrderIsLoading, data: updateSelectedFoodOrderResponse, error: updateSelectedFoodOrderError }] = useUpdateSelectedFoodOrderMutation();

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (open && modalType == ModalEnum.updateSelectedFoodOrder && getMenuListData?.data != null) {
            setFoods(getMenuListData.data);
        }
    }, [open, modalType, getMenuListData])

    useEffect(() => {
        if (updateSelectedFoodOrderResponse) {
            enqueueSnackbar(updateSelectedFoodOrderResponse.message, {
                variant: updateSelectedFoodOrderResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateSelectedFoodOrderResponse?.success == true) {
                handleClose();
            }
        }
        if (updateSelectedFoodOrderError) {
            const error = updateSelectedFoodOrderError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateSelectedFoodOrderResponse, updateSelectedFoodOrderError])


    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = foods.findIndex((c) => c.id === active.id);
        const newIndex = foods.findIndex((c) => c.id === over.id);
        const newCategories = arrayMove(foods, oldIndex, newIndex);
        setFoods(newCategories);

        // Backend’e yeni sıralamayı gönder
        //const orderArray = newCategories.map((c) => c.id);
        //setLoading(true);
        try {
        } finally {
        }
    };

    const handleSubmit = () => {
        const orderArray = foods.map((c) => c.id);
        updateSelectedFoodOrder({ branchSlug: branchSlug, newSelectedFoodList: orderArray })
    }

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <>
            <Button variant="dashed" startIcon={<ArrowSwapVertical />} onClick={() => {
                dispatch(setModal({
                    open: true,
                    modalType: ModalEnum.updateSelectedFoodOrder
                }))
            }}>{intl.formatMessage({ id: "updateOrder" })}</Button>
            <Dialog open={open && modalType == ModalEnum.updateSelectedFoodOrder} onClose={handleClose} fullWidth maxWidth="md" disablePortal>
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
                    <Typography variant="body1" marginBottom={3}>{"Besinlerin sırasını sürükleyerek belirleyebilirsiniz. İşlem sonrası kaydetmeyi unutmayın."}</Typography>
                    {isMenuLoading || isMenuFetching ? <CustomScaleLoader /> : <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={foods.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                            {foods.map((cat) => (
                                <SortableItem key={cat.id} id={cat.id} title={cat.title.tr} />
                            ))}
                        </SortableContext>
                    </DndContext>}
                </DialogContent>
                <DialogActions sx={{ marginTop: 5 }}>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <AnimateButton>
                        <Button disableElevation
                            disabled={updateSelectedFoodOrderIsLoading || getMenuListData?.data?.length == 1}
                            type="button" variant="contained" color="primary" onClick={handleSubmit}>
                            {(updateSelectedFoodOrderIsLoading) && <PuffLoader size={20} color='white' />}
                            {(updateSelectedFoodOrderIsLoading == false) && intl.formatMessage({ id: "save" })}
                        </Button>
                    </AnimateButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default UpdateSelectedFoodOrderModal

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