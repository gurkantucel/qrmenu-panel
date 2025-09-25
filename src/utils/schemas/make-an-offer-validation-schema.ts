import * as Yup from 'yup';

const newMakeAnOfferSchema = Yup.object({
    patient_id: Yup.string().nullable(),
    name: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string()
            .matches(/^[a-zA-ZğüşıöçİĞÜŞÖÇ]+(?: [a-zA-ZğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
            .min(1, "Çok Kısa")
            .max(100, "Çok Uzun")
            .required('Hasta adı zorunludur')
    }),
    surname: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string()
            .matches(/^[a-zA-ZğüşıöçİĞÜŞÖÇ]+(?: [a-zA-ZğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
            .min(1, "Çok Kısa")
            .max(100, "Çok Uzun")
            .required('Hasta soyadı zorunludur')
    }),
    phone_code: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(2, 'Hasta telefon numarası zorunludur').required('Hasta telefon numarası zorunludur'),
    }),
    phone_number: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(10, "Telefon numarası girin.").max(10, "Telefon numarası girin.")
            .matches(/^[0-9]+$/, { message: "Telefon numarası girin." }).required("Bu alan zorunlu"),
    }),
    person_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    expiration: Yup.string().required("Bu alan zorunlu"),
    detail: Yup.array(Yup.object({
        appointment_process_code: Yup.string().required("Bu alan zorunlu"),
        amount: Yup.string().required("Bu alan zorunlu"),
        quantity: Yup.number().required("Bu alan zorunlu"),
        discount_percentage: Yup.number().required("Bu alan zorunlu"),
    }))
})

export { newMakeAnOfferSchema }