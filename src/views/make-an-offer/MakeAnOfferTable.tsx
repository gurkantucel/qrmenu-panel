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
import { Box, Divider, Skeleton, Stack, Tooltip } from '@mui/material';
import { Edit, Eye, Printer, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import dayjs from 'dayjs';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import { useGetMakeAnOfferListQuery, useLazyPrintMakeAnOfferQuery } from 'reduxt/features/make-an-offer/make-an-offer-api';
import { MakeAnOfferListData } from 'reduxt/features/make-an-offer/models/make-an-offer-model';
import AddMakeAnOfferModal from './AddMakeAnOfferModal';
import UpdateMakeAnOfferModal from './UpdateMakeAnOfferModal';
import DeleteMakeAnOfferModal from './DeleteMakeAnOfferModal';
import { PuffLoader } from 'react-spinners';
import ViewMakeAnOfferModal from './ViewMakeAnOfferModal';
import Link from 'next/link';

const columnHelper = createColumnHelper<MakeAnOfferListData>()

const MakeAnOfferTable = () => {

  const intl = useIntl()

  let breadcrumbLinks = [
    { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
    { title: `${intl.formatMessage({ id: "makeAnOffer" })}` },
  ];

  const dispatch = useAppDispatch();

  const [printMakeAnOffer, {
    isFetching: printMakeAnOfferFetching,
    isLoading: printMakeAnOfferLoading
  }] = useLazyPrintMakeAnOfferQuery();

  /*const [getAppointmentList, {
    data: getAppointmentListData,
    isFetching: isAppointmentFetching,
    isLoading: isAppointmentLoading
  }] = useLazyGetAppointmentListQuery();*/

  const columns = useMemo<ColumnDef<MakeAnOfferListData, any>[]>(() => [
    columnHelper.accessor('patient_full_name', {
      header: intl.formatMessage({ id: "patientNameSurname" }),
      cell: info => info.renderValue() == null ? "-" : <Link href={`patient/${info.row.original.patient_id}`} className='custom-link'>
        {`${info.renderValue()}`}
      </Link>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('person_full_name', {
      header: intl.formatMessage({ id: "personNameSurname" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('expiration', {
      header: intl.formatMessage({ id: "expiration" }),
      cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
    }),
    columnHelper.accessor('total', {
      header: intl.formatMessage({ id: "total" }),
      enableColumnFilter: false,
      cell: info => info.renderValue() == null ? "-" : `${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: info.row.original.currency_code ?? 'TRY' }).format(Number(info.row.original.total))}`,
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
                  modalType: ModalEnum.viewMakeAnOffer,
                  id: info.row.original.quote_id,
                  title: info.row.original.patient_full_name,
                  data: info.row.original
                }))
              }}
            >
              <Eye />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "print" })}>
            {printMakeAnOfferLoading || printMakeAnOfferFetching ? <PuffLoader size={24} color='black' /> : <IconButton
              color="warning"
              onClick={(e: any) => {
                e.stopPropagation();
                printMakeAnOffer({quote_id: info.row.original.quote_id})
              }}
            >
              <Printer />
            </IconButton>}
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "edit" })}>
            <IconButton
              color="primary"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true,
                  modalType: ModalEnum.updateMakeAnOffer,
                  id: info.row.original.quote_id,
                  title: info.row.original.patient_full_name,
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
                  open: true, modalType: ModalEnum.deleteMakeAnOffer,
                  id: info.row.original.quote_id,
                  title: info.row.original.patient_full_name
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
  ], [printMakeAnOfferFetching,printMakeAnOfferLoading])

  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: getAppointmentListData, isLoading: isAppointmentLoading, isFetching: isAppointmentFetching } = useGetMakeAnOfferListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    filterSearch: columnFilters?.filter((item) => item.value != "-").map((item) => `${item.id}=${item.value}`).join('&')
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
    <>
      <Breadcrumbs custom heading={`${intl.formatMessage({ id: "makeAnOffer" })}`} links={breadcrumbLinks} />
      <MainCard content={false}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
          <AddMakeAnOfferModal />
          <UpdateMakeAnOfferModal />
          <DeleteMakeAnOfferModal />
          <ViewMakeAnOfferModal />
          {/*<AddAppointmentModal />
          <UpdateAppointmentModal />
          <DeleteAppointmentModal />
          <ViewAppointmentModal />*/}
        </Stack>
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
                    {[0, 1, 2, 3,4].map((col: number) => (
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

export default MakeAnOfferTable