import * as Yup from 'yup';

const newPersonValidationSchema = Yup.object({
    person_type_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
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
    phone_number: Yup.string().min(10,"Telefon numarası girin.").max(10,"Telefon numarası girin.")
            .matches(/^[0-9]+$/, { message: "Telefon numarası girin." }).required("Bu alan zorunlu"),
    email: Yup.string().email("E-posta girin.").required("Bu alan zorunlu"),
    password: Yup.string()
        .matches(/^\S+(?: \S+)*$/, { message: "Boşluklar içermemelidir." })
        .min(6, "Çok Kısa")
        .max(20, "Çok Uzun")
        .required("Bu alan zorunlu"),
    authorizations: Yup.array().min(1,"Min 1 adet seçilmelidir.")
})


export { newPersonValidationSchema }