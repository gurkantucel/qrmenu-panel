import * as Yup from 'yup';
import { IntlShape } from "react-intl";

const addFoodValidationSchema = (intl: IntlShape) => Yup.object({
    title_tr: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
    title_en: Yup.string().required(intl.formatMessage({ id: "fieldRequired" })),
    branches: Yup.array().of(Yup.object({
        categoryId: Yup.string().required(intl.formatMessage({ id: "required" })),
        currencyCode: Yup.string().required(intl.formatMessage({ id: "required" })),
        price: Yup.string().trim().required(intl.formatMessage({ id: "required" })),
    }))
})

const addSelectedFoodValidationSchema = Yup.object({
    branchFoods: Yup.array().of(Yup.string().required("Zorunlu")).min(1, "Zorunlu")
})

export { addFoodValidationSchema, addSelectedFoodValidationSchema }