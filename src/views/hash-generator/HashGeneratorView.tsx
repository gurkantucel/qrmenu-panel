"use client"

import { Button, OutlinedInput } from "@mui/material"
import { Form, Formik } from "formik"
import Constants from "utils/Constants"
import CryptoJS from 'crypto-js';
import { encryptData } from "utils/encrypt";

const HashGeneratorView = () => {

    return (
        <Formik initialValues={{
            key: "",
            paymentConversationId: "",
            password: "",
        }} onSubmit={async (values) => {
            if (values.password != process.env.NEXT_PUBLIC_MANUEL_HOOK_PASSWORD) {
                alert("Hey dostum, burada ne işin var :)")
                return;
            } else {
                //const key = await stringEncrypt(values.key, process.env.NEXT_PUBLIC_MANUEL_HOOK_KEY ?? "");
                //const paymentConversationId = await stringEncrypt(values.paymentConversationId, process.env.NEXT_PUBLIC_MANUEL_HOOK_KEY ?? "");

                //console.log("key" ,key);
                //console.log("paymentConversationId" ,paymentConversationId);


                const keyStr = 'v7XqP4bT1kMnGsR9LzjYWu5EQhBDacNo'; // 32 karakter = AES-256
                const ivStr = 'uYm+7eJflmQyL1RxURWyDQ=='; // base64 IV

                const decryptedKeyText = encryptData(values.key,keyStr);
                const decryptedOrderIdText = encryptData(values.paymentConversationId,keyStr);

                const response = await fetch(`${Constants.APIURL()}/middleware/manuelHook`, {
                    method: "POST",
                    body: JSON.stringify({
                        "key": decryptedKeyText,
                        "iyziEventType": "MANUEL_CHECKOUT",
                        "iyziPaymentId": null,
                        "paymentConversationId": decryptedOrderIdText,
                        "token": null,
                        "iyziReferenceCode": null,
                        "iyziEventTime": null
                    })
                })

                if (response.status == 200) {
                    alert("Hoşgeldin :)")
                } else {
                    alert(":(")
                }
            }
        }}>
            {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <Form>
                    <p>{JSON.stringify(values)}</p>
                    <OutlinedInput
                        id="key"
                        type="text"
                        value={values.key}
                        name="key"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={"Key"}
                        fullWidth
                        error={Boolean(touched.key && errors.key)}
                    />
                    <OutlinedInput
                        id="paymentConversationId"
                        type="text"
                        value={values.paymentConversationId}
                        name="paymentConversationId"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={"Sipariş"}
                        fullWidth
                        error={Boolean(touched.paymentConversationId && errors.paymentConversationId)}
                    />
                    <OutlinedInput
                        id="password"
                        type="password"
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={"Şifre"}
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                    />
                    <Button type="submit">Kaydet</Button>
                </Form>)}
        </Formik>
    )
}

export default HashGeneratorView