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
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, Divider, Stack, Tooltip } from '@mui/material';
import { Add, Edit, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { useLazyGetPatientPaymentHistoryListQuery } from 'reduxt/features/patient/patient-payment-history-api';
import { PatientPaymentHistoryListData } from 'reduxt/features/patient/models/patient-payment-history-model';
import { RootState } from 'reduxt/store';
import { PatientTabEnum } from 'reduxt/features/definition/patientTabSlice';
import dayjs from 'dayjs';
import AddPatientPaymentHistoryModal from './AddPatientPaymentHistoryModal';
import DeletePatientPaymentHistoryModal from './DeletePatientPaymentHistoryModal';

const columnHelper = createColumnHelper<PatientPaymentHistoryListData>()

const PatientPaymentHistoryTable = ({ params }: { params: { slug: string } }) => {

  const intl = useIntl()

  const { data: { selectTab } } = useAppSelector((state: RootState) => state.patientTab);
  const dispatch = useAppDispatch();

  const [getPatientPaymentHistoryList, {
    data: getPatientPaymentHistoryListData,
    isFetching: isPatientPaymentHistoryFetching,
    isLoading: isPatientPaymentHistoryLoading
  }] = useLazyGetPatientPaymentHistoryListQuery();

  const columns = useMemo<ColumnDef<PatientPaymentHistoryListData, any>[]>(() => [
    columnHelper.accessor('payment_kind_name', {
      header: intl.formatMessage({ id: "paymentKind" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('amount', {
      header: intl.formatMessage({ id: "amount" }),
      cell: info => info.renderValue() == null ? "-" : `${info.row.original.amount} ${info.row.original.currency_name}`,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('payment_method_name', {
      header: intl.formatMessage({ id: "paymentMethod" }),
      cell: info => info.renderValue() == null ? "-" : info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('created_at', {
      header: intl.formatMessage({ id: "date" }),
      cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY HH:mm"),
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
                  open: true, modalType: ModalEnum.newPatientPaymentHistory,
                  id: info.row.original.patient_id,
                  data: info.row.original,
                  title: `${info.row.original.payment_kind_name} ${info.row.original.amount} ${info.row.original.currency_name}`
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
                  open: true, modalType: ModalEnum.deletePatientPaymentHistory,
                  id: info.row.original.patient_id,
                  title: `${info.row.original.payment_kind_name} ${info.row.original.amount} ${info.row.original.currency_name}`,
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

  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  const tableData = useMemo(() => getPatientPaymentHistoryListData?.data ?? [], [getPatientPaymentHistoryListData?.data]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: tableData,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getPatientPaymentHistoryListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  useEffect(() => {
    if (selectTab == PatientTabEnum.odemeler && getPatientPaymentHistoryListData != null) {
      getPatientPaymentHistoryList({
        patientId: params.slug,
        page: table.getState().pagination.pageIndex + 1,
        pageSize: table.getState().pagination.pageSize,
      })
    }
  }, [pagination])

  useEffect(() => {
    if (selectTab == PatientTabEnum.odemeler && columnFilters.length > 0) {
      console.log("columnFilter length > 0");
      var stringParams = columnFilters.map((item) => `${item.id}=${item.value}`).join('&')
      getPatientPaymentHistoryList({ patientId: params.slug, filterSearch: stringParams })
    } else {
      getPatientPaymentHistoryList({ patientId: params.slug })
    }
  }, [columnFilters])

  return (
    <MainCard
      title={intl.formatMessage({ id: "payments" })}
      secondary={
        <Button variant="dashed" startIcon={<Add />} onClick={() => {
          dispatch(setModal({
            open: true,
            modalType: ModalEnum.newPatientPaymentHistory,
            id: params.slug
          }))
        }}>{intl.formatMessage({ id: "newPayment" })}</Button>
      }
    >
     <AddPatientPaymentHistoryModal />
     <DeletePatientPaymentHistoryModal />
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
              {isPatientPaymentHistoryFetching || isPatientPaymentHistoryLoading ? <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <CustomScaleLoader />
                </TableCell>
              </TableRow> :
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
                      <EmptyTable msg={isPatientPaymentHistoryFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
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

export default PatientPaymentHistoryTable