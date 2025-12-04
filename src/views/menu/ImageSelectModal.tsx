"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Radio,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { closeModal2, Modal2Enum } from "reduxt/features/definition/modalSlice2";
import { useGetStockImageGalleryListQuery } from "reduxt/features/stock-image-gallery/stock-image-gallery-api";
import CustomScaleLoader from "components/CustomScaleLoader";
import { useLocalizedField } from "hooks/useLocalizedField";
import { CloseSquare } from "iconsax-react";
import { useIntl } from "react-intl";

export default function ImageSelectModal() {

  const dispatch = useAppDispatch();
  const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal2);

  const intl = useIntl()

  const t = useLocalizedField()

  const { isLoading: getStockImageGalleryLoading, isFetching: getStockImageGalleryFetching, data: getStockImageGalleryData } = useGetStockImageGalleryListQuery(undefined, { skip: modalType != Modal2Enum.imageSelect })

  const [search, setSearch] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search) return getStockImageGalleryData?.data;
    const lower = search.toLowerCase();

    return getStockImageGalleryData?.data?.filter(
      (item) =>
        item.label.tr.toLowerCase().includes(lower) ||
        item.label.en.toLowerCase().includes(lower)
    );
  }, [search, getStockImageGalleryData?.data]);

  const handleClose = () => {
    dispatch(closeModal2())
  };

  return (
    <Dialog open={open && modalType == Modal2Enum.imageSelect} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
        >
          <Grid item>
            <Typography variant="h5">{intl.formatMessage({"id": "selectImage"})}</Typography>
          </Grid>
          <Grid item sx={{ mr: 1.5 }}>
            <IconButton color="secondary" onClick={handleClose}>
              <CloseSquare size={36} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label={intl.formatMessage({id: "search"})}
          size="small"
          margin="dense"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {getStockImageGalleryLoading || getStockImageGalleryFetching ? <CustomScaleLoader /> : <Grid container spacing={2} sx={{ mt: 1 }}>
          {filtered?.map((item: any, idx: any) => {
            const isSelected = selectedIndex === idx;

            return (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <Card
                  sx={{
                    border: isSelected
                      ? "2px solid #1976d2"
                      : "2px solid transparent",
                    borderRadius: 2,
                  }}
                >
                  <CardActionArea onClick={() => setSelectedIndex(idx)}>
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="120"
                        image={item.imageUrl}
                        alt={item.label.tr}
                        sx={{ objectFit: "cover" }}
                      />

                      <Box
                        position="absolute"
                        top={6}
                        right={6}
                        bgcolor="white"
                        borderRadius="50%"
                      >
                        <Radio
                          checked={isSelected}
                          onChange={() => setSelectedIndex(idx)}
                        />
                      </Box>
                    </Box>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        {t(item.label)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{intl.formatMessage({id: "close"})}</Button>
        <Button
          variant="contained"
          disabled={selectedIndex === null}
          onClick={() => {
            if (filtered && selectedIndex !== null) {
              data?.setFieldValue("image_url", filtered[selectedIndex].imageUrl)
            }
            handleClose();
          }}
        >
          {intl.formatMessage({id: "selectImage"})}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
