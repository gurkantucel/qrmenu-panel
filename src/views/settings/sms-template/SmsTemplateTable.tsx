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
import { Box, Chip, Divider, Skeleton, Stack, Tooltip } from '@mui/material';
import { ArrowRotateRight } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { SmsTemplateData } from 'reduxt/features/sms-template/models/sms-template-model';
import { useGetSmsTemplateListQuery } from 'reduxt/features/sms-template/sms-template-api';
import UpdateStatusSmsTemplateModal from './UpdateStatusSmsTemplateModal';


const columnHelper = createColumnHelper<SmsTemplateData>()

const SmsTemplateTable = () => {
  const intl = useIntl()

  const dispatch = useAppDispatch();

  const columns = useMemo<ColumnDef<SmsTemplateData, any>[]>(() => [
    columnHelper.accessor('sms_template_code', {
      header: intl.formatMessage({ id: "code" }),
      cell: info => info.renderValue() == null ? "-" : info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('sms_template_name', {
      header: intl.formatMessage({ id: "type" }),
      cell: info => info.renderValue() == null ? "-" : info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('sms_template_description', {
      header: intl.formatMessage({ id: "name" }),
      cell: info => info.renderValue() == null ? "-" : info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: intl.formatMessage({ id: "status" }),
      cell: (info) => <Chip color={info.renderValue() == true ? "success" : "error"} label={info.renderValue() == true ? intl.formatMessage({ id: "active" }) : intl.formatMessage({ id: "passive" })} size="small" variant="light" />,
      footer: info => info.column.id,
      meta: {
        filterVariant: 'select',
      },
    }),
    columnHelper.accessor('islemler', {
      header: intl.formatMessage({ id: "actions" }),
      size: 10,
      enableColumnFilter: false,
      cell: (info) => {
        return <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
          <Tooltip title={intl.formatMessage({ id: "changeStatus" })}>
            <IconButton
              color="warning"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true,
                  modalType: ModalEnum.smsTemplateUpdateStatus,
                  id: info.row.original.sms_template_id,
                  title: info.row.original.sms_template_name,
                  data: info.row.original
                }))
              }}
            >
              <ArrowRotateRight />
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

  const { data: getSmsTemplateListData, isLoading: isSmsTemplateLoading, isFetching: isSmsTemplateFetching } = useGetSmsTemplateListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    filterSearch: columnFilters?.map((item) => `${item.id}=${item.value}`).join('&')
  })

  const tableData = useMemo(() => getSmsTemplateListData?.data ?? [], [getSmsTemplateListData?.data]);

  const table = useReactTable({
    data: tableData,
    //getSubRows: (row, index) => row.detail ?? [],
    //getRowCanExpand: () => true,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getSmsTemplateListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
        <UpdateStatusSmsTemplateModal />
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
              {isSmsTemplateFetching || isSmsTemplateLoading ? [0, 1, 2, 3, 4].map((item: number) => (
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
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length}>
                      <EmptyTable msg={isSmsTemplateFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
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
  )
}

export default SmsTemplateTable