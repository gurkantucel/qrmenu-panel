'use client';
// next
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import UserProfileBackLeft from './components/UserProfileBackLeft';
import UserProfileBackRight from './components/UserProfileBackRight';

// assets
import { CalendarAdd, CalendarRemove, Timer1, Flag } from 'iconsax-react';
import { useGetBranchListQuery } from 'reduxt/features/branch/branch-api';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { Chip } from '@mui/material';

const HomeView = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

    const intl = useIntl()

    const { data: getBranchListData, isLoading: isBranchLoading, isFetching: isBranchFetching } = useGetBranchListQuery({ simple: true })

    return (
        <>
            <MainCard
                border={false}
                content={false}
                sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.700' : 'primary.lighter', position: 'relative', overflow: 'hidden' }}
            >
                <Box sx={{ position: 'absolute', bottom: '-7px', left: 0, zIndex: 1 }}>
                    <UserProfileBackLeft />
                </Box>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 5 }}>
                    <Grid item>
                        <Stack direction="row" spacing={matchDownSM ? 1 : 2} alignItems="center">
                            <Box sx={{ ml: matchDownSM ? 0 : 1, height: 136 }}>

                            </Box>
                            <Stack spacing={0.75}>
                                <Typography variant="h5">{intl.formatMessage({id: "welcome"})}</Typography>
                                <Typography variant="body2" color={theme.palette.mode === ThemeMode.DARK ? theme.palette.common.white : 'secondary'}>
                                    {intl.formatMessage({id: "welcomeDigitalizeYourBusiness"})}
                                </Typography>
                                <Typography variant="body2" color={theme.palette.mode === ThemeMode.DARK ? theme.palette.common.white : 'secondary'}>
                                    {intl.formatMessage({id: "welcomeDigitalizeYourBusiness2"})}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item sx={{ mx: matchDownSM ? 2 : 3, my: matchDownSM ? 1 : 0, mb: matchDownSM ? 2 : 0 }} xs={matchDownSM ? 12 : 'auto'}>

                    </Grid>
                </Grid>
                <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                    <UserProfileBackRight />
                </Box>
            </MainCard>
            {isBranchLoading || isBranchFetching ? <CustomScaleLoader /> :
                <Grid container spacing={3} marginTop={1}>
                    {getBranchListData?.data?.map((item,index) => (<Grid item xs={12} sm={6} lg={6} key={`branchList-${index}`}>
                        <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
                            <Grid id="print" container spacing={2.25}>
                                <Grid item xs={12}>
                                    <List sx={{ width: 1, p: 0 }}>
                                        <ListItem
                                            disablePadding
                                        >
                                            <ListItemText
                                                primary={<Typography variant="subtitle1">{item.title}</Typography>}
                                                secondary={
                                                    <Typography variant="caption" color="secondary">
                                                        {intl.formatMessage({id: item.packages.active == true ? "active" : "passive"})}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={{ xs: 0, md: 1 }}>
                                        <Grid item xs={12} md={6}>
                                            <List sx={{ p: 0, '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemIcon>
                                                        <Flag size={18} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} color="secondary">
                                                                {intl.formatMessage({id: item.packages.type ?? 'lang'})}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemIcon>
                                                        <CalendarAdd size={18} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography color="secondary">
                                                                {dayjs(item.packages.startDate).format("DD.MM.YYYY")}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <List sx={{ p: 0, '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemIcon>
                                                        <Timer1 size={18} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Chip color="secondary" label={item.packages.remainingDays}/>} />
                                                </ListItem>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemIcon>
                                                        <CalendarRemove size={18} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography color="secondary">
                                                                {dayjs(item.packages.endDate).format("DD.MM.YYYY")}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Stack
                                direction="row"
                                className="hideforPDf"
                                alignItems="center"
                                spacing={1}
                                justifyContent="space-between"
                                sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
                            >
                                <Typography variant="caption" color="secondary">
                                    {intl.formatMessage({id: "createdX"},{x: dayjs(item.createdAt).format("DD.MM.YYYY")})}
                                </Typography>
                            </Stack>
                        </MainCard>
                    </Grid>))}
                </Grid>}
        </>
    )
}

export default HomeView