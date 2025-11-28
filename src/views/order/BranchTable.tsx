"use client"
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
import { Box, Button, Chip, Divider, Skeleton, Stack } from '@mui/material';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    HeaderGroup,
    useReactTable,
} from '@tanstack/react-table'
import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { useAppDispatch } from 'reduxt/hooks';
import ViewOrderModal from './ViewOrderModal';
import { BranchListData } from 'reduxt/features/branch/models/branch-model';
import { useGetBranchListQuery } from 'reduxt/features/branch/branch-api';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { SaveAdd } from 'iconsax-react';
import RenewPackageModal from './RenewPackageModal';

function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null!)

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer'}
            {...rest}
        />
    )
}

const columnHelper = createColumnHelper<BranchListData>()

const BranchTable = () => {

    const intl = useIntl()

    const dispatch = useAppDispatch();

    const [rowSelection, setRowSelection] = useState<any>({})

    const columns = useMemo<ColumnDef<BranchListData, any>[]>(() => [
        columnHelper.accessor('select', {
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
            size: 10,
            enableColumnFilter: false,
            footer: info => info.column.id,
        }),
        columnHelper.accessor(row => row.packages?.type ?? "-", {
            header: intl.formatMessage({ id: "type" }),
            cell: info => intl.formatMessage({id: info.getValue() ?? "lang"}),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('title', {
            header: intl.formatMessage({ id: "title" }),
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor(row => row.packages?.startDate ?? "-", {
            header: intl.formatMessage({ id: "startDate" }),
            cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
            footer: info => info.column.id,
            meta: {
                filterVariant: 'date',
            },
        }),
        columnHelper.accessor(row => row.packages?.endDate ?? "-", {
            header: intl.formatMessage({ id: "endDate" }),
            cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
            footer: info => info.column.id,
            meta: {
                filterVariant: 'date',
            },
        }),
        columnHelper.accessor(row => row.packages?.remainingDays ?? "-", {
            header: intl.formatMessage({ id: "remainingDays" }),
            cell: (info) => <Chip color={"info"} label={`${info.renderValue()}`} size="small" variant="light" />,
            footer: info => info.column.id,
        }),
    ], [])

    const { data: getBranchListData, isLoading: isBranchLoading, isFetching: isBranchFetching } = useGetBranchListQuery({ simple: true })

    const tableData = useMemo(() => getBranchListData?.data ?? [], [getBranchListData?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            rowSelection,
        },
        getRowId: row => row.id,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        rowCount: getBranchListData?.data?.length,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    })

    return (
        <>
            <ViewOrderModal />
            <RenewPackageModal />
            <MainCard content={false}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 0 }} justifyContent={"end"} alignItems={{ xs: "normal", sm: "center" }} sx={{ padding: 2 }}>
                    <Button variant="dashed" 
                        disabled={JSON.stringify(rowSelection) === "{}"}
                        startIcon={<SaveAdd />} onClick={() => {
                        dispatch(setModal({
                            open: true,
                            modalType: ModalEnum.renewPackage,
                            data: {branchIds: Object.keys(rowSelection)}
                        }))
                    }}>{intl.formatMessage({ id: "renewPackage" })}</Button>
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
                                {isBranchFetching || isBranchLoading ? [0, 1, 2, 3, 4].map((item: number) => (
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
                                                <EmptyTable msg={isBranchFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
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

export default BranchTable