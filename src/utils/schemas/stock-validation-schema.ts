import * as Yup from 'yup';

const newStockValidationSchema = Yup.object({
    person_id: Yup.string().nullable(),
    appointment_process_id: Yup.string().uuid().required("Bu alan zorunlu"),
    quantity: Yup.number().required("Bu alan zorunlu"),
    process_date: Yup.string().required("Bu alan zorunlu")
})

export { newStockValidationSchema }