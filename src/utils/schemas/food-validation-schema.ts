import * as Yup from 'yup';

const addFoodValidationSchema = Yup.object({
    branches: Yup.array().of(Yup.object({
        categoryId: Yup.string().required('Zorunlu'),
        currencyCode: Yup.string().required('Zorunlu'),
    }))
})

const addSelectedFoodValidationSchema = Yup.object({
    branchFoods: Yup.array().of(Yup.string().required("Zorunlu")).min(1,"Zorunlu")
})

export {addFoodValidationSchema, addSelectedFoodValidationSchema}