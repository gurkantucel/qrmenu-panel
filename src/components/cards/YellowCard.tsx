"use client"
import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { OverrideIcon } from 'types/root';

type Props = {
    title?: string
    iconPrimary?: OverrideIcon;
    content?: string[]
    sumText?: string
}

const YellowCard = (props: Props) => {
    const IconPrimary = props.iconPrimary!;
    const primaryIcon = props.iconPrimary ? <IconPrimary size={52} variant="Bulk" /> : null;
    return (
        <MainCard
            content={false}
            sx={{
                bgcolor: "success.main",
                position: 'relative',
                overflow: 'hidden',
                '&:before, &:after': {
                    content: '""',
                    width: 1,
                    height: 1,
                    position: 'absolute',
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.0001) 22.07%, rgba(255, 255, 255, 0.15) 83.21%)',
                    transform: 'matrix(0.9, 0.44, -0.44, 0.9, 0, 0)'
                },
                '&:after': {
                    top: '50%',
                    right: '-20px'
                },
                '&:before': {
                    right: '-70px',
                    bottom: '80%'
                }
            }}
        >
            <Box sx={{ px: 4.5, py: 4 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Box sx={{ color: 'common.white', opacity: 0.5 }}>{primaryIcon}</Box>
                    </Grid>
                    <Grid item>
                        <Stack spacing={1} alignItems="flex-end">
                            <Typography variant="h5" color="common.white" sx={{ fontWeight: 500 }}>
                                {props.title ?? "Yeni Abonelik Paketi"}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Stack spacing={1} direction="column" alignItems={"flex-end"} sx={{ pt: 1.25 }}>
                    {props.content?.map((item, index) => (item == "" ? <></> : <Typography variant="h6" color="common.white" sx={{ fontWeight: 400 }} key={`yellow-card-${index}`}>
                        {item}
                    </Typography>))}
                    {props.sumText && <Typography variant="h4" color="common.white" sx={{ fontWeight: 400 }}>
                        {props.sumText}
                    </Typography>}
                </Stack>
            </Box>
        </MainCard>
    )
}

export default YellowCard