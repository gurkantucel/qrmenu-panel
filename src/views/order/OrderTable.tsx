"use client"
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { EmptyTable, Filter, TablePagination } from 'components/third-party/react-table';
import { Box, Chip, Divider, IconButton, Skeleton, Stack, Tooltip } from '@mui/material';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    HeaderGroup,
    useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react';
import { APP_DEFAULT_PATH } from 'config';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { BagTick, Eye } from 'iconsax-react';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch } from 'reduxt/hooks';
import { OrderListData } from 'reduxt/features/order/model/order-model';
import { useGetOrderListQuery } from 'reduxt/features/order/order-api';
import currency from 'utils/currency';
import ViewOrderModal from './ViewOrderModal';
import BranchTable from './BranchTable';

const columnHelper = createColumnHelper<OrderListData>()

const OrderTable = () => {

    const intl = useIntl()

    const dispatch = useAppDispatch();

    const breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "myPackage" })}` },
    ];

    const columns = useMemo<ColumnDef<OrderListData, any>[]>(() => [
        columnHelper.accessor('id', {
            header: intl.formatMessage({ id: "orderNumber" }),
            cell: (info) => <Chip color={"info"} label={`#${info.renderValue()}`} size="small" variant="light" />,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('paidPrice', {
            header: intl.formatMessage({ id: "price" }),
            cell: (info) => <Chip color={"secondary"} label={currency(info.renderValue())} size="small" variant="light" />,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('status', {
            header: intl.formatMessage({ id: "status" }),
            cell: (info) => <Chip color={info.renderValue() == "PAYMENT_PENDING" ? "warning" : info.renderValue() == "PAYMENT_SUCCESSFUL" ? 'success' : "error"} label={intl.formatMessage({ id: info.renderValue() })} size="small" variant="light" />,
            footer: info => info.column.id,
            meta: {
                filterVariant: 'orderStatus',
            },
        }),
        columnHelper.accessor('createdAt', {
            header: intl.formatMessage({ id: "date" }),
            cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY HH:mm"),
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
                return <Stack direction="row" spacing={0}>
                    <Tooltip title={intl.formatMessage({ id: "view" })}>
                        <IconButton
                            color="secondary"
                            onClick={(e: any) => {
                                dispatch(setModal({
                                    open: true,
                                    modalType: ModalEnum.viewOrder,
                                    id: info.row.original.id,
                                    //title: info.row.original.title.tr,
                                    data: info.row.original
                                }))
                            }}
                        >
                            <Eye />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({ id: "makePayment" })}>
                        <IconButton
                            color="primary"
                            disabled={info.row.original.status == "PAYMENT_SUCCESSFUL"}
                            onClick={(e: any) => {
                                dispatch(setModal({
                                    open: true,
                                    //modalType: ModalEnum.updateOrder,
                                    id: info.row.original.id,
                                    //title: info.row.original.title.tr,
                                    data: info.row.original
                                }))
                            }}
                        >
                            <BagTick />
                        </IconButton>
                    </Tooltip>
                </Stack>
            },
            footer: info => info.column.id,
        }),
    ], [])

    const { data: getOrderListData, isLoading: isOrderLoading, isFetching: isOrderFetching } = useGetOrderListQuery()

    const tableData = useMemo(() => getOrderListData?.data ?? [], [getOrderListData?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        rowCount: getOrderListData?.data?.length,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    })

    return (
        <>
            <Breadcrumbs custom heading={`${intl.formatMessage({ id: "myPackage" })}`} links={breadcrumbLinks} />
            <ViewOrderModal />
            <BranchTable />
            <MainCard content={false} sx={{marginTop: 4}}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 0 }} justifyContent={"space-between"} alignItems={{ xs: "normal", sm: "center" }} sx={{ padding: 2 }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    </Stack>
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
                                {isOrderFetching || isOrderLoading ? [0, 1, 2, 3, 4].map((item: number) => (
                                    <TableRow key={item}>
                                        {[0, 1, 2, 3, 4, 5, 6].map((col: number) => (
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
                                                <EmptyTable msg={isOrderFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
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

export default OrderTable