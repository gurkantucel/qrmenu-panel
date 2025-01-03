"use client"
import { alpha, useTheme } from '@mui/material/styles';
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
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Divider, Stack, Tooltip } from '@mui/material';
import { ArrowDown2, ArrowRight2, Edit, Eye, MinusCirlce, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import CustomScaleLoader from 'components/CustomScaleLoader';
import dayjs from 'dayjs';
import { AppointmentProcessListData, Detail } from 'reduxt/features/settings/models/appointment-process-model';
import { useLazyGetAppointmentProcessListQuery } from 'reduxt/features/settings/appointment-process-api';
import AddAppointmentProcessModal from './AddAppointmentProcessModal';
import DeleteAppointmentProcessModal from './DeleteAppointmentProcessModal';
import ViewAppointmentProcessModal from './ViewAppointmentProcessModal';

type SubTableProps = {
  data?: Detail[]
}
const subColumnHelper = createColumnHelper<Detail>()

const SubTable = (props: SubTableProps) => {

  const theme = useTheme();

  const intl = useIntl()

  const columns = useMemo<ColumnDef<Detail, any>[]>(() => [
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

const columnHelper = createColumnHelper<AppointmentProcessListData>()

const AppointmentProcessTable = () => {
  const intl = useIntl()

  const dispatch = useAppDispatch();

  const [getAppointmentProcessList, {
    data: getAppointmentProcessListData,
    isFetching: isAppointmentProcessFetching,
    isLoading: isAppointmentProcessLoading
  }] = useLazyGetAppointmentProcessListQuery();

  const columns = useMemo<ColumnDef<AppointmentProcessListData, any>[]>(() => [
    columnHelper.accessor('expander', {
      header: () => null,
      enableColumnFilter: false,
      cell: info => {
        return info.row.getCanExpand() && (info.row.original.detail?.length ?? 0) > 0 ? (
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
    columnHelper.accessor('created_at', {
      header: intl.formatMessage({ id: "date" }),
      cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
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
                  modalType: ModalEnum.viewAppointmentProcess,
                  id: info.row.original.appointment_process_id,
                  title: info.row.original.code,
                  data: info.row.original
                }))
              }}
            >
              <Eye />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "edit" })}>
            <IconButton
              color="primary"
              disabled={info.row.original.appointment_process_id == 3}
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true,
                  modalType: ModalEnum.newAppointmentProcess,
                  id: info.row.original.appointment_process_id,
                  title: info.row.original.name,
                  data: {
                    appointment_process_id: info.row.original.appointment_process_id,
                    currency_id: info.row.original.currency_id,
                    appointment_process_type_id: info.row.original.appointment_process_type_id,
                    code: info.row.original.code,
                    name: info.row.original.name,
                    description: info.row.original.description,
                    amount: info.row.original.amount,
                    vat: info.row.original.vat,
                    sub_appointment_process: info.row.original.detail?.map((item) => (item.appointment_process_id)),
                    status: info.row.original.status
                  }
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
                  open: true, modalType: ModalEnum.deleteAppointmentProcess,
                  id: info.row.original.appointment_process_id,
                  title: info.row.original.code,
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

  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  const tableData = useMemo(() => getAppointmentProcessListData?.data ?? [], [getAppointmentProcessListData?.data]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: tableData,
    //getSubRows: (row, index) => row.detail ?? [],
    getRowCanExpand: () => true,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getAppointmentProcessListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  useEffect(() => {
    if (getAppointmentProcessListData != null) {
      getAppointmentProcessList({
        page: table.getState().pagination.pageIndex + 1,
        pageSize: table.getState().pagination.pageSize,
      })
    }
  }, [pagination])

  useEffect(() => {
    console.log(columnFilters);
    if (columnFilters.length > 0) {
      console.log("columnFilter length > 0");
      var stringParams = columnFilters.map((item) => `${item.id}=${item.value}`).join('&')
      getAppointmentProcessList({ filterSearch: stringParams })
    } else {
      getAppointmentProcessList({})
    }
  }, [columnFilters])

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
        <AddAppointmentProcessModal />
        <DeleteAppointmentProcessModal />
        <ViewAppointmentProcessModal />
      </Stack>
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
              {isAppointmentProcessFetching || isAppointmentProcessLoading ? <TableRow>
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
                      {row.getIsExpanded() && <SubTable data={row.original.detail} />}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length}>
                      <EmptyTable msg={isAppointmentProcessFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
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
  )
}

export default AppointmentProcessTable