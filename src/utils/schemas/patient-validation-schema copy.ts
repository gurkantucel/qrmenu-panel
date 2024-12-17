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
    phone_number: Yup.string().min(10).max(10)
        .matches(/^[0-9]+$/, { message: "Telefon numarası girin." }).required("Bu alan zorunlu"),
})


export { newPatientValidationSchema }