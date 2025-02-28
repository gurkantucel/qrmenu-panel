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
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Chip, Divider, Skeleton, Stack } from '@mui/material';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import { useGetOrderListQuery } from 'reduxt/features/order/order-api';
import { OrderListData } from 'reduxt/features/order/model/order-model';
import dayjs from 'dayjs';

const columnHelper = createColumnHelper<OrderListData>()

const OrderListTable = () => {

  const intl = useIntl()

  let breadcrumbLinks = [
    { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
    { title: `${intl.formatMessage({ id: "orders" })}` },
  ];

  const columns = useMemo<ColumnDef<OrderListData, any>[]>(() => [
    columnHelper.accessor('order_number', {
      header: intl.formatMessage({ id: "orderNumber" }),
      cell: (info) => {
        return <Chip label={`#${info.renderValue()}`} variant="outlined" color="info" />
      },
      footer: info => info.column.id,
    }),
    columnHelper.accessor('payment_method_name', {
      header: intl.formatMessage({ id: "paymentMethodName" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('order_status_name', {
      header: intl.formatMessage({ id: "status" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('total', {
      header: intl.formatMessage({ id: "amount" }),
      cell: info => info.renderValue() == null ? "-" : `${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: info.row.original.currency_code ?? 'TRY' }).format(Number(info.row.original.total))}`,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('created_at', {
      header: intl.formatMessage({ id: "date" }),
      cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY HH:mm"),
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
    }),
  ], [])

  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: getOrderListData, isLoading: isOrderLoading, isFetching: isOrderFetching } = useGetOrderListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    //filterSearch: columnFilters?.map((item) => `${item.id}=${item.value}`).join('&'),
    filterSearch: columnFilters?.filter((item) => item.value != "-").map((item) => `${item.id}=${item.value}`).join('&')
  })

  const tableData = useMemo(() => getOrderListData?.data ?? [], [getOrderListData?.data]);

  const table = useReactTable({
    data: tableData,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getOrderListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Breadcrumbs custom heading={`${intl.formatMessage({ id: "orders" })}`} links={breadcrumbLinks} />
      <MainCard content={false}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
          {/*<ViewOrderModal />*/}
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
                {isOrderFetching || isOrderLoading ? [0, 1, 2].map((item: number) => (
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
                        <EmptyTable msg={isOrderFetching ? <FormattedMessage id='loadingDot' /> : <FormattedMessage id='noData' />} />
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

export default OrderListTable