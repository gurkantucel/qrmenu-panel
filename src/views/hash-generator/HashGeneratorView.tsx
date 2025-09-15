"use client"

import { Button, OutlinedInput, Stack } from "@mui/material"
import { Form, Formik } from "formik"
import Constants from "utils/Constants"
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


                const keyStr = `${process.env.NEXT_PUBLIC_MANUEL_HOOK_KEY_STR}`; // 32 karakter = AES-256
                const ivStr = 'uYm+7eJflmQyL1RxURWyDQ=='; // base64 IV

                const decryptedKeyText = encryptData(values.key, keyStr);
                const decryptedOrderIdText = encryptData(values.paymentConversationId, keyStr);

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
                    <Stack spacing={2}>
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
                    </Stack>
                </Form>)}
        </Formik>
    )
}

export default HashGeneratorView