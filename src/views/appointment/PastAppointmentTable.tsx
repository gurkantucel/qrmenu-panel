"use client"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { EmptyTable, Filter, TablePagination } from 'components/third-party/react-table';

import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    HeaderGroup,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table'
import { Fragment, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Chip, Divider, Grid, Skeleton} from '@mui/material';
import { ArrowDown2, ArrowRight2, MinusCirlce, } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useParams, useSearchParams } from 'next/navigation';
import { useListAppointmentHistoryQuery } from 'reduxt/features/appointment/appointment-api';
import { AppointmentHistoryData, AppointmentProcess } from 'reduxt/features/appointment/models/appointment-list-model';
import dayjs from 'dayjs';
import ViewAppointmentModal from './ViewAppointmentModal';

type SubTableProps = {
    data?: AppointmentProcess[]
}
const subColumnHelper = createColumnHelper<AppointmentProcess>()

const SubTable = (props: SubTableProps) => {

    const intl = useIntl()

    const columns = useMemo<ColumnDef<AppointmentProcess, any>[]>(() => [
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
        subColumnHelper.accessor('created_at', {
            header: intl.formatMessage({ id: "date" }),
            cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
            footer: info => info.column.id,
            meta: {
                filterVariant: 'date',
            },
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
        <MainCard
            content={false}
            sx={{ ml: { xs: 2.5, sm: 5, md: 6, lg: 10, xl: 12 } }}
        >
            <ScrollX>
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                                <TableRow key={headerGroup.id} sx={{ '& > th:first-of-type': { width: 'auto' } }}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id} {...header.column.columnDef.meta}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <TableRow>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ScrollX>
        </MainCard>
    )
}

const columnHelper = createColumnHelper<AppointmentHistoryData>()

const PastAppointmentTable = () => {

    const intl = useIntl()

    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    const columns = useMemo<ColumnDef<AppointmentHistoryData, any>[]>(() => [
        columnHelper.accessor('expander', {
            header: () => null,
            enableColumnFilter: false,
            cell: info => {
                return info.row.getCanExpand() && (info.row.original.appointment_process?.length ?? 0) > 0 ? (
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
        columnHelper.accessor('person_full_name', {
            header: intl.formatMessage({ id: "personNameSurname" }),
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('appointment_status_name', {
            header: intl.formatMessage({ id: "status" }),
            //cell: info => info.renderValue() == null ? "-" : info.renderValue(),
            cell: (info) => {
                return <Chip color={info.row.original.appointment_status_id == 1 ? "warning" : info.row.original.appointment_status_id == 2 ? "success" : info.row.original.appointment_status_id == 3 ? "error" : "info"} label={info.row.original.appointment_status_name} size="small" variant="light" />
            },
            footer: info => info.column.id,
        }),
        columnHelper.accessor('appointment_start', {
            header: intl.formatMessage({ id: "appointmentDate" }),
            cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY HH:mm"),
            footer: info => info.column.id,
            meta: {
                filterVariant: 'date',
            },
        }),
        columnHelper.accessor('appointment_duration', {
            header: intl.formatMessage({ id: "duration" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
            footer: info => info.column.id,
        }),
    ], [])

    const [columnFilters, setColumnFilters] = useState<any[]>([]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data: getAppointmentListData, isLoading: isAppointmentLoading, isFetching: isAppointmentFetching } = useListAppointmentHistoryQuery({
        patient_id: patientId ?? 0,
        appointment_id: params.slug,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        filterSearch: columnFilters.length > 0 ? columnFilters?.map((item) => `${item.id}=${item.value}`).join('&') : undefined
    })

    const tableData = useMemo(() => getAppointmentListData?.data ?? [], [getAppointmentListData?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        getRowCanExpand: () => true,
        onPaginationChange: setPagination,
        state: { columnFilters, pagination },
        rowCount: getAppointmentListData?.totalCount,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
        onColumnFiltersChange: setColumnFilters,
    })

    return (
        <Grid item xs={12}>
            <ViewAppointmentModal />
            <MainCard title={intl.formatMessage({ id: "pastAppointment" })}>
                <ScrollX>
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
                                {isAppointmentFetching || isAppointmentLoading ? [0, 1, 2, 3, 4].map((item: number) => (
                                    <TableRow key={item}>
                                        {[0, 1, 2, 3, 4, 5].map((col: number) => (
                                            <TableCell key={col}>
                                                <Skeleton animation="wave" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )) :
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
                                                {row.getIsExpanded() &&
                                                    <TableRow>
                                                        <TableCell colSpan={row.getVisibleCells().length}>
                                                            <SubTable data={row.original.appointment_process} />
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                            </Fragment>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={table.getAllColumns().length}>
                                                <EmptyTable msg={isAppointmentFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                            <TablePagination
                                {...{
                                    setPageSize: table.setPageSize,
                                    setPageIndex: table.setPageIndex,
                                    getState: table.getState,
                                    getPageCount: table.getPageCount
                                }}
                            />
                        </Box>
                    </>
                </ScrollX>
            </MainCard>
        </Grid>
    )
}

export default PastAppointmentTable