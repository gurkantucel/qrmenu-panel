import * as Yup from 'yup';
import { IntlShape } from "react-intl";

const categoryValidationSchema = (intl: IntlShape) => Yup.object({
    title_tr: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
    title_en: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
    title_es: Yup.string().nullable().transform(v => v === "" ? null : v),
    title_fr: Yup.string().nullable().transform(v => v === "" ? null : v),
    branches: Yup.array().of(Yup.object({
        id: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
        slug: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
    })).min(1,intl.formatMessage({ id: "fieldRequired" }))
})

const updateCategoryValidationSchema = (intl: IntlShape) => Yup.object({
    title_tr: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
    title_en: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
    title_es: Yup.string().nullable().transform(v => v === "" ? null : v),
    title_fr: Yup.string().nullable().transform(v => v === "" ? null : v),
})

export { categoryValidationSchema, updateCategoryValidationSchema }