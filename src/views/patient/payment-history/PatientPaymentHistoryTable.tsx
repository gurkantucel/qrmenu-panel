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
import { Box, Button, Divider, Stack, Tooltip } from '@mui/material';
import { Add, Edit, Eye, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import CustomScaleLoader from 'components/CustomScaleLoader';
import dayjs from 'dayjs';
import AddPatientPaymentHistoryModal from './AddPatientPaymentHistoryModal';
import DeletePatientPaymentHistoryModal from './DeletePatientPaymentHistoryModal';
import { useGetTenantPaymentListQuery } from 'reduxt/features/patient/tenant-payment-api';
import { TenantPaymentListData } from 'reduxt/features/patient/models/tenant-payment-model';
import ViewPatientPaymentHistoryModal from './ViewPatientPaymentHistoryModal';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PatientPaymentUpdateStatusModal from 'views/payment/PatientPaymentUpdateStatusModal';

const columnHelper = createColumnHelper<TenantPaymentListData>()

const PatientPaymentHistoryTable = () => {

  const intl = useIntl()

  const params = useParams<{ slug: string }>()

  const dispatch = useAppDispatch();

  const columns = useMemo<ColumnDef<TenantPaymentListData, any>[]>(() => [
    columnHelper.accessor('payment_method_name', {
      header: intl.formatMessage({ id: "paymentMethod" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('payment_status_name', {
      header: intl.formatMessage({ id: "paymentStatus" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    /*columnHelper.accessor('quantity', {
      header: intl.formatMessage({ id: "quantity" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('amount', {
      header: intl.formatMessage({ id: "amount" }),
      cell: info => info.renderValue() == null ? "-" : `${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: info.row.original.currency_code ?? 'TRY' }).format(Number(info.row.original.amount))}`,
      footer: info => info.column.id,
    }),*/
    columnHelper.accessor('total', {
      header: intl.formatMessage({ id: "amountToBePaid" }),
      cell: info => info.renderValue() == null ? "-" : `${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: info.row.original.currency_code ?? 'TRY' }).format(Number(info.row.original.total))}`,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('appointment_start', {
      header: intl.formatMessage({ id: "appointment" }),
      cell: info => info.renderValue() == null ? "-" : <Link target='_blank' href={`/appointment/${info.row.original.appointment_id}?${info.row.original.patient_id}`} className='custom-link'>{`${dayjs(info.renderValue()).format("DD.MM.YYYY")}`}</Link>,
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
    }),
    columnHelper.accessor('payment_date', {
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
                  modalType: ModalEnum.viewPatientPaymentHistory,
                  id: info.row.original.payment_id,
                  title: `${info.row.original.payment_method_name} ${info.row.original.amount} ${info.row.original.currency_name}`,
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
              onClick={(e: any) => {
                e.stopPropagation();
                if (info.row.original.appointment_id) {
                  dispatch(setModal({
                    open: true, modalType: ModalEnum.updateStatusPatientPayment,
                    id: info.row.original.payment_id,
                    data: info.row.original,
                    title: `${info.row.original.payment_method_name} ${info.row.original.amount} ${info.row.original.currency_name}`
                  }))
                } else {
                  dispatch(setModal({
                    open: true, modalType: ModalEnum.newPatientPaymentHistory,
                    id: info.row.original.payment_id,
                    data: info.row.original,
                    title: `${info.row.original.payment_method_name} ${info.row.original.amount} ${info.row.original.currency_name}`
                  }))
                }
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "delete" })}>
            <IconButton
              color="error"
              disabled={info.row.original.appointment_id}
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true, modalType: ModalEnum.deletePatientPaymentHistory,
                  id: info.row.original.patient_id,
                  title: `${info.row.original.payment_method_name} ${info.row.original.amount} ${info.row.original.currency_name}`,
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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const {
    data: getPatientPaymentHistoryListData,
    isFetching: isPatientPaymentHistoryFetching,
    isLoading: isPatientPaymentHistoryLoading
  } = useGetTenantPaymentListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    patientId: params.slug,
    //filterSearch: columnFilters?.map((item) => `${item.id}=${item.value}`).join('&')
    filterSearch: columnFilters?.filter((item) => item.value != "-").map((item) => `${item.id}=${item.value}`).join('&')
  });

  const tableData = useMemo(() => getPatientPaymentHistoryListData?.data ?? [], [getPatientPaymentHistoryListData?.data]);


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

  return (
    <MainCard
      title={intl.formatMessage({ id: "payments" })}
      secondary={
        <Button variant="dashed" startIcon={<Add />} onClick={() => {
          dispatch(setModal({
            open: true,
            modalType: ModalEnum.newPatientPaymentHistory,
          }))
        }}>{intl.formatMessage({ id: "newPayment" })}</Button>
      }
      contentSX={{
        padding: 0, '&:last-child': {
          paddingBottom: 0
        }
      }}
    >
      <AddPatientPaymentHistoryModal />
      <DeletePatientPaymentHistoryModal />
      <ViewPatientPaymentHistoryModal />
      <PatientPaymentUpdateStatusModal />
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