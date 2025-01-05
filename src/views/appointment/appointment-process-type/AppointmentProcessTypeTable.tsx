"use client"
import { useSearchParams, useParams } from 'next/navigation'
import { alpha, useTheme } from '@mui/material/styles';
import React, { Fragment, useEffect, useMemo } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Grid, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard'
import { Add, ArrowDown2, ArrowRight2, Edit, MinusCirlce, Trash } from 'iconsax-react';
import { useAppDispatch } from 'reduxt/hooks';
import { useIntl } from 'react-intl';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    HeaderGroup,
    useReactTable,
} from '@tanstack/react-table'
import CustomScaleLoader from 'components/CustomScaleLoader';
import { EmptyTable, Filter } from 'components/third-party/react-table';
import { useLazyGetAppointmentProcessTypeListQuery } from 'reduxt/features/appointment/appointment-process-type-api';
import { AppointmentProcessTypeData, SubAppointmentProcess } from 'reduxt/features/appointment/models/appointment-process-type-model';
import AddAppointmentProcessTypeModal from './AddAppointmentProcessTypeModal';
import UpdateAppointmentProcessTypeModal from './UpdateAppointmentProcessTypeModal';
import DeleteAppointmentProcessTypeModal from './DeleteAppointmentProcessTypeModal';


type SubTableProps = {
    data?: SubAppointmentProcess[]
}
const subColumnHelper = createColumnHelper<SubAppointmentProcess>()

const SubTable = (props: SubTableProps) => {

    const theme = useTheme();

    const intl = useIntl()

    const columns = useMemo<ColumnDef<SubAppointmentProcess, any>[]>(() => [
        subColumnHelper.accessor('appointment_process_type_name', {
            header: intl.formatMessage({ id: "type" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
            footer: info => info.column.id,
        }),
        subColumnHelper.accessor('name', {
            header: intl.formatMessage({ id: "name" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
            footer: info => info.column.id,
        }),
        subColumnHelper.accessor('amount', {
            header: intl.formatMessage({ id: "amount" }),
            cell: info => info.renderValue() == null ? "-" : `${info.row.original.amount} ${info.row.original.currency_code}`,
            footer: info => info.column.id,
        }),
        subColumnHelper.accessor('islemler', {
            header: intl.formatMessage({ id: "name" }),
            cell: info => "",
            footer: info => info.column.id,
        }),
    ], [])

    const table = useReactTable({
        data: props.data ?? [],
        columns,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel()
    });

    return (
        <>
            {table.getRowModel().rows.map((row, index) => (
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.35) }} key={index}>
                    <TableCell />
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
}

const columnHelper = createColumnHelper<AppointmentProcessTypeData>()

const AppointmentProcessTypeTable = () => {

    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    const dispatch = useAppDispatch();
    const intl = useIntl()

    const [getAppointmentProcessTypeList, {
        data: getAppointmentProcessTypeListData,
        isFetching: isAppointmentProcessTypeFetching,
        isLoading: isAppointmentProcessTypeLoading
    }] = useLazyGetAppointmentProcessTypeListQuery();

    const columns = useMemo<ColumnDef<AppointmentProcessTypeData, any>[]>(() => [
        columnHelper.accessor('expander', {
            header: () => null,
            enableColumnFilter: false,
            cell: info => {
                return info.row.getCanExpand() && (info.row.original.sub_appointment_process?.length ?? 0) > 0 ? (
                    <Box width={{ xl: 60 }}>
                        <IconButton color={info.row.getIsExpanded() ? 'primary' : 'secondary'} onClick={info.row.getToggleExpandedHandler()} size="small">
                            {info.row.getIsExpanded() ? <ArrowDown2 size="32" variant="Outline" /> : <ArrowRight2 size="32" variant="Outline" />}
                        </IconButton>
                    </Box>
                ) : (
                    <Box width={{ xl: 60 }}>
                        <IconButton color="secondary" size="small" disabled>
                            <MinusCirlce />
                        </IconButton>
                    </Box>
                );
            },
            footer: info => info.column.id,
        }),
        columnHelper.accessor('appointment_process_type_name', {
            header: intl.formatMessage({ id: "type" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('name', {
            header: intl.formatMessage({ id: "name" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('amount', {
            header: intl.formatMessage({ id: "amount" }),
            cell: info => info.renderValue() == null ? "-" : `${info.row.original.amount} ${info.row.original.currency_code}`,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('islemler', {
            header: intl.formatMessage({ id: "actions" }),
            size: 10,
            enableColumnFilter: false,
            cell: (info) => {
                return <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    <Tooltip title={intl.formatMessage({ id: "edit" })}>
                        <IconButton
                            color="primary"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                dispatch(setModal({
                                    open: true,
                                    modalType: ModalEnum.updateAppointmentProcessType,
                                    id: params.slug,
                                    title: info.row.original.name,
                                    data: info.row.original
                                }))
                            }}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({ id: "delete" })}>
                        <IconButton
                            color="error"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                dispatch(setModal({
                                    open: true,
                                    modalType: ModalEnum.deleteAppointmentProcessType,
                                    id: params.slug,
                                    title: info.row.original.name,
                                    data: info.row.original
                                }))
                            }}
                        >
                            <Trash />
                        </IconButton>
                    </Tooltip>
                </Stack>
            },
            footer: info => info.column.id,
            meta: {
                filterVariant: 'select',
            },
        }),
    ], [])

    const tableData = useMemo(() => getAppointmentProcessTypeListData?.data ?? [], [getAppointmentProcessTypeListData?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        getRowCanExpand: () => true,
        rowCount: getAppointmentProcessTypeListData?.totalCount,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: "onChange"
    })

    useEffect(() => {
        getAppointmentProcessTypeList({ appointment_id: params.slug })
    }, [patientId])

    return (
        <Grid item xs={12}>
            <MainCard
                sx={{ marginBottom: 3 }}
                title={intl.formatMessage({ id: "processes" })}
                secondary={
                    <Button variant="dashed" startIcon={<Add />} onClick={() => {
                        dispatch(setModal({
                            open: true,
                            modalType: ModalEnum.newAppointmentProcessType,
                            id: params.slug,
                            data: {
                                patient_id: patientId,
                                appointment_id: params.slug
                            }
                        }))
                    }}>{intl.formatMessage({ id: "add" })}</Button>
                }
            >
                <AddAppointmentProcessTypeModal />
                <UpdateAppointmentProcessTypeModal />
                <DeleteAppointmentProcessTypeModal />
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                                <TableRow key={headerGroup.id} sx={{ '& > th:first-of-type': { width: 58 } }}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id} {...header.column.columnDef.meta}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id} {...header.column.columnDef.meta}>
                                            {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {isAppointmentProcessTypeFetching || isAppointmentProcessTypeLoading ? <TableRow>
                                <TableCell colSpan={table.getAllColumns().length}>
                                    <CustomScaleLoader />
                                </TableCell>
                            </TableRow> :
                                table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <Fragment key={row.id}>
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            {row.getIsExpanded() && <SubTable data={row.original.sub_appointment_process} />}
                                        </Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={table.getAllColumns().length}>
                                            <EmptyTable msg={isAppointmentProcessTypeFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </Grid>
    )
}

export default AppointmentProcessTypeTable