import { Box, Dialog, Grid, IconButton, Typography } from '@mui/material'
import CustomScaleLoader from 'components/CustomScaleLoader'
import { CloseSquare } from 'iconsax-react'
import React from 'react'

type Props = {
    title?: string
    content?: string
    open?: boolean
    onClose?: any
    isLoading?: boolean
}

const AuthFormArticleModal = (props: Props) => {
    return (
        <Dialog open={props.open ?? false} onClose={props.onClose} fullWidth>
            {props.isLoading ? <CustomScaleLoader /> : <Box sx={{ px: 3, py: 3 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                >
                    <Grid item>
                        {props.title && <Typography variant="h4">{props.title ?? "-"}</Typography>}
                    </Grid>
                    <Grid item sx={{ mr: 1.5 }}>
                        <IconButton color="secondary" onClick={props.onClose}>
                            <CloseSquare size={36} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div
                            dangerouslySetInnerHTML={{ __html: props.content ?? "" }}
                        />
                    </Grid>
                </Grid>
            </Box>}
        </Dialog>
    )
}

export default AuthFormArticleModal