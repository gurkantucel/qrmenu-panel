import * as Yup from 'yup';

const newPatientValidationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    surname: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    phone_number: Yup.string().min(10, "Telefon numarası girin.").max(10, "Telefon numarası girin.")
        .matches(/^[0-9]+$/, { message: "Telefon numarası girin." }).required("Bu alan zorunlu"),
})

const newPatientDiseaseHistorySchema = Yup.object({
    patient_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    disease_status_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientMedicineHistorySchema = Yup.object({
    patient_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientFamilyDiseaseSchema = Yup.object({
    patient_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    kinship_degree_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    disease_status_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientSurgeryHistorySchema = Yup.object({
    patient_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientTreatmentHistorySchema = Yup.object({
    patient_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientInjectionHistorySchema = Yup.object({
    patient_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    injection_type_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientPaymentHistorySchema = Yup.object({
    patient_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    payment_kind_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    payment_method_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    currency_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    amount: Yup.number().required("Bu alan zorunlu"),
})

export { newPatientValidationSchema, newPatientDiseaseHistorySchema, newPatientMedicineHistorySchema, newPatientFamilyDiseaseSchema, newPatientSurgeryHistorySchema, newPatientTreatmentHistorySchema, newPatientInjectionHistorySchema, newPatientPaymentHistorySchema }