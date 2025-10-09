"use client"
import Chip from '@mui/material/Chip';
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
  RowData,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Button, Divider, Skeleton, Stack, Tooltip } from '@mui/material';
import { ArrowDown, ArrowUp, ExportCircle, Eye, Link2, Link21, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import AddStockModal from './AddStockModal';
import DeleteStockModal from './DeleteStockModal';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import ViewStockModal from './ViewStockModal';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import { StockData } from 'reduxt/features/stock/models/stock-list-model';
import { useGetStockListQuery } from 'reduxt/features/stock/stock-api';
import dayjs from 'dayjs';
import Link from 'next/link';
import ReadAppointmentProcessModal from 'views/settings/appointment-process/ReadAppointmentProcessModal';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select' | 'select2' | 'date' | 'number' | 'appointmentStatus' | 'appointmentType' | 'personNameSurname' | "gender" | 'movementType'
  }
}

const columnHelper = createColumnHelper<StockData>()

const StockTable = () => {

  const intl = useIntl()

  let breadcrumbLinks = [
    { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
    { title: `${intl.formatMessage({ id: "stock" })}` },
  ];

  const dispatch = useAppDispatch();


  const columns = useMemo<ColumnDef<StockData, any>[]>(() => [
    columnHelper.accessor('movement_type', {
      header: intl.formatMessage({ id: "type" }),
      cell: info => info.renderValue() == true ? <Chip color="success" label={<><ArrowUp />{"Artış"}</>} size="small" variant="light" /> : <Chip color="error" label={<><ArrowDown />{"Azalış"}</>} size="small" variant="light" />,
      footer: info => info.column.id,
      meta: {
        filterVariant: 'movementType',
      },
    }),
    columnHelper.accessor('appointment_process_name', {
      header: intl.formatMessage({ id: "name" }),
      cell: info => info.renderValue() == null ? "-" : <Button color='inherit' sx={{textAlign: 'left'}} onClick={() => {
        dispatch(setModal({
          open: true, modalType: ModalEnum.readAppointmentProcess,
          id: info.row.original.stock_id,
          title: info.row.original.appointment_process_name,
          data: { appointment_process_id: info.row.original.appointment_process_id }
        }))
      }}>{info.renderValue()}</Button>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('quantity', {
      header: intl.formatMessage({ id: "stock" }),
      cell: info => info.renderValue() == null ? "-" : parseFloat(info.renderValue()),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('appointment_start', {
      header: intl.formatMessage({ id: "appointment" }),
      cell: info => info.renderValue() == null ? "-" : <Link target='_blank' href={`appointment/${info.row.original.appointment_id}?${info.row.original.patient_id}`} className='custom-link'>{`${dayjs(info.renderValue()).format("DD.MM.YYYY")} (${info.row.original.patient_full_name})`}</Link>,
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
    }),
    columnHelper.accessor('process_date', {
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
                  open: true, modalType: ModalEnum.viewStock,
                  id: info.row.original.stock_id,
                  data: info.row.original
                }))
              }}
            >
              <Eye />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "delete" })}>
            <IconButton
              color="error"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true, modalType: ModalEnum.deleteStock,
                  id: info.row.original.stock_id,
                  title: info.row.original.appointment_process_name,
                  data: { stock_id: info.row.original.stock_id, appointment_process_id: info.row.original.appointment_process_id, movement_type: info.row.original.movement_type }
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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: getStockListData, isLoading: isStockLoading, isFetching: isStockFetching } = useGetStockListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    //filterSearch: columnFilters?.map((item) => `${item.id}=${item.value}`).join('&'),
    filterSearch: columnFilters?.filter((item) => item.value != "-").map((item) => `${item.id}=${item.value}`).join('&')
  })

  const tableData = useMemo(() => getStockListData?.data ?? [], [getStockListData?.data]);

  const table = useReactTable({
    data: tableData,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getStockListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Breadcrumbs custom heading={`${intl.formatMessage({ id: "stock" })}`} links={breadcrumbLinks} />
      <MainCard content={false}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
          <AddStockModal />
          <DeleteStockModal />
          <ViewStockModal />
          <ReadAppointmentProcessModal />
        </Stack>
        <ScrollX>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
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
                {isStockFetching || isStockLoading ? [0, 1, 2].map((item: number) => (
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
                        <EmptyTable msg={isStockFetching ? <FormattedMessage id='loadingDot' /> : <FormattedMessage id='noData' />} />
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
                  getPageCount: table.getPageCount,
                  selectRowLength: table.getRowModel().rows.length,
                  totalCount: table.getRowCount()
                }}
              />
            </Box>
          </>
        </ScrollX>
      </MainCard>
    </>
  )
}

export default StockTable