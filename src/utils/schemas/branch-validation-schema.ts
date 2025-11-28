import * as Yup from 'yup';
import { IntlShape } from "react-intl";

const addBranchValidationSchema = (intl: IntlShape) => Yup.object({
    branches: Yup.array().of(Yup.object({
        branchName: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
        country: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
        province: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
        district: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
    }))
})

const updateBranchValidationSchema = (intl: IntlShape) => Yup.object({
    title: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
    country: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
    province: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
    district: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
    phone: Yup.string().trim().required(intl.formatMessage({ id: "fieldRequired" })),
    email: Yup.string().email().required(intl.formatMessage({ id: "fieldRequired" })),
})

export { addBranchValidationSchema, updateBranchValidationSchema }