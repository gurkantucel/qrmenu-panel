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
    HeaderGroup,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Chip, Divider, Grid, Skeleton, Stack, Tooltip } from '@mui/material';
import { Eye, } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { useSearchParams } from 'next/navigation';
import { useGetAppointmentListQuery } from 'reduxt/features/appointment/appointment-api';
import { AppointmentListData } from 'reduxt/features/appointment/models/appointment-list-model';
import dayjs from 'dayjs';
import ViewAppointmentModal from './ViewAppointmentModal';

const columnHelper = createColumnHelper<AppointmentListData>()

const PastAppointmentTable = () => {

    const intl = useIntl()

    const dispatch = useAppDispatch();

    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    /*const [getAppointmentList, {
      data: getAppointmentListData,
      isFetching: isAppointmentFetching,
      isLoading: isAppointmentLoading
    }] = useLazyGetAppointmentListQuery();*/

    const columns = useMemo<ColumnDef<AppointmentListData, any>[]>(() => [
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
        columnHelper.accessor('islemler', {
            header: intl.formatMessage({ id: "actions" }),
            size: 10,
            enableColumnFilter: false,
            cell: (info) => {
                return <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    <Tooltip title={intl.formatMessage({ id: "view" })}>
                        <IconButton
                            color="secondary"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                dispatch(setModal({
                                    open: true,
                                    modalType: ModalEnum.viewAppointment,
                                    id: info.row.original.patient_id,
                                    title: info.row.original.patient_full_name,
                                    data: info.row.original
                                }))
                            }}
                        >
                            <Eye />
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

    const [columnFilters, setColumnFilters] = useState<any[]>([{ id: "patient_id", value: patientId }, { id: "appointment_status_id", value: 2 }]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data: getAppointmentListData, isLoading: isAppointmentLoading, isFetching: isAppointmentFetching } = useGetAppointmentListQuery({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        filterSearch: columnFilters?.map((item) => `${item.id}=${item.value}`).join('&')
    })

    const tableData = useMemo(() => getAppointmentListData?.data ?? [], [getAppointmentListData?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        onPaginationChange: setPagination,
        state: { columnFilters, pagination },
        rowCount: getAppointmentListData?.totalCount,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
        onColumnFiltersChange: setColumnFilters,
    })


    /*useEffect(() => {
      getAppointmentList({
        page: table.getState().pagination.pageIndex + 1,
        pageSize: table.getState().pagination.pageSize,
      })
    }, [pagination])*/

    /*useEffect(() => {
      if (columnFilters.length > 0) {
        var stringParams = columnFilters.map((item) => `${item.id}=${item.value}`).join('&')
        getAppointmentList({ filterSearch: stringParams })
      } else {
        getAppointmentList({})
      }
    }, [columnFilters])*/

    return (
        <Grid item xs={12}>
            <ViewAppointmentModal />
            <MainCard title={intl.formatMessage({ id: "pastAppointment" })}>
                <ScrollX>
                    <TableContainer component={Paper}>
                        <Table size='small'>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableCell key={header.id} {...header.column.columnDef.meta} style={{ width: `${header.getSize()}px` }}>
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
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
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