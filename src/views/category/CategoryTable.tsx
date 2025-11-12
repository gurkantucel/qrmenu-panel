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
import { Box, Chip, Divider, IconButton, InputLabel, Skeleton, Stack, Tooltip } from '@mui/material';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    HeaderGroup,
    useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react';
import { APP_DEFAULT_PATH } from 'config';
import { useIntl } from 'react-intl';
import Select from 'react-select'
import { useGetCategoryListQuery } from 'reduxt/features/category/category-api';
import { CategoryListData } from 'reduxt/features/category/models/category-model';
import { useGetBranchDropdownQuery } from 'reduxt/features/branch/branch-api';
import Image from "next/image"
import dayjs from 'dayjs';
import AddCategoryModal from './AddCategoryModal';
import UpdateCategoryOrderModal from './UpdateCategoryOrderModal';
import { Edit, Trash } from 'iconsax-react';
import UpdateCategoryModal from './UpdateCategoryModal';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { useAppDispatch } from 'reduxt/hooks';
import DeleteCategoryModal from './DeleteCategoryModal';
const columnHelper = createColumnHelper<CategoryListData>()

const CategoryTable = () => {

    const intl = useIntl()

    const dispatch = useAppDispatch();

    const breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "categories" })}` },
    ];

    const columns = useMemo<ColumnDef<CategoryListData, any>[]>(() => [
        columnHelper.accessor('imageUrl', {
            header: intl.formatMessage({ id: "image" }),
            cell: info => info.renderValue() == null ? "-" : <Image src={info.renderValue()} alt={info.row.original.title.tr} width={128} height={128} />,
            footer: info => info.column.id,
            enableColumnFilter: false,
        }),
        columnHelper.accessor(row => row.title?.tr ?? "-", {
            header: intl.formatMessage({ id: "titleTr" }),
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor(row => row.title?.en ?? "-", {
            header: intl.formatMessage({ id: "titleEn" }),
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('createdAt', {
            header: intl.formatMessage({ id: "date" }),
            cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY HH:mm"),
            footer: info => info.column.id,
            meta: {
                filterVariant: 'date',
            },
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
                return <Stack direction="row" spacing={0}>
                    <Tooltip title={intl.formatMessage({ id: "edit" })}>
                        <IconButton
                            color="primary"
                            onClick={(e: any) => {
                                dispatch(setModal({
                                    open: true,
                                    modalType: ModalEnum.updateCategory,
                                    id: info.row.original.id,
                                    title: info.row.original.title.tr,
                                    data: info.row.original
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
                                    open: true, modalType: ModalEnum.deleteCategory,
                                    id: info.row.original.id,
                                    title: info.row.original.title.tr,
                                }))
                            }}
                        >
                            <Trash />
                        </IconButton>
                    </Tooltip>
                </Stack>
            },
            footer: info => info.column.id,
        }),
    ], [])

    const [branchSlug, setBranchSlug] = useState<string | null>()

    const { isLoading: getBranchDropdownLoading, data: getBranchDropdownData } = useGetBranchDropdownQuery()

    const selectedBranch = getBranchDropdownData?.data?.find(
        (item: any) => item.field === branchSlug
    );

    const { data: getCategoryListData, isLoading: isCategoryLoading, isFetching: isCategoryFetching } = useGetCategoryListQuery({
        branchSlug: branchSlug,
    },
        { skip: !branchSlug }
    )

    const tableData = useMemo(() => getCategoryListData?.data ?? [], [getCategoryListData?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        rowCount: getCategoryListData?.data?.length,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    })

    useEffect(() => {
        if (getBranchDropdownData?.data != null) {
            setBranchSlug(getBranchDropdownData.data[0].field)
        }
    }, [getBranchDropdownData])

    return (
        <>
            <Breadcrumbs custom heading={`${intl.formatMessage({ id: "categories" })}`} links={breadcrumbLinks} />
            <MainCard content={false}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{xs: 2, sm: 0}} justifyContent={"space-between"} alignItems={{xs: "normal", sm: "center"}} sx={{ padding: 2 }}>
                    <Stack direction={"column"}>
                        <InputLabel sx={{ marginBottom: 1 }}>Şube</InputLabel>
                        <Select
                            placeholder={"Seçim yapınız..."}
                            noOptionsMessage={(label) => "Bulunamadı."}
                            styles={{
                                container: (baseStyles: any) => ({
                                    ...baseStyles,
                                    zIndex: 998
                                }),
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: '#BEC8D0',
                                    borderRadius: '8px',
                                    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(67, 142, 255, 0.25)' : 'var(--tb-border-color)',
                                    color: '#1d2630',
                                    minHeight: '48px',
                                    paddingLeft: '5px',
                                }),
                                placeholder: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: '#aeaeae',
                                }),
                            }}
                            value={
                                branchSlug
                                    ? {
                                        label: selectedBranch?.label ?? "",
                                        value: selectedBranch?.field ?? 0,
                                    }
                                    : null
                            }
                            isLoading={getBranchDropdownLoading}
                            options={getBranchDropdownData?.data?.map((item: any) => ({
                                value: item.field,
                                label: item.label
                            }))}
                            onChange={(val: any) => {
                                setBranchSlug(val?.value);
                            }}
                        />
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <UpdateCategoryOrderModal branchSlug={branchSlug} />
                        <UpdateCategoryModal />
                        <AddCategoryModal />
                        <DeleteCategoryModal />
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
                                {isCategoryFetching || isCategoryLoading ? [0, 1, 2, 3, 4].map((item: number) => (
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
                                                <EmptyTable msg={isCategoryFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
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

export default CategoryTable