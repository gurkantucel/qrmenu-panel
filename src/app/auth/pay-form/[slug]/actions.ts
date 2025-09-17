'use server'

import Constants from "utils/Constants"

export async function getPayForm(orderNumber:string) {
    try {
        const result = await fetch(`${Constants.URL()}/api/payment-step1`, {
            method: "POST",
            body: JSON.stringify({"order_number" : orderNumber})
        })
        var model = await result.json();
        if (result.status == 200) {
            return {
                status: "SUCCESS",
                data: model
            }
        }
        return { status: model?.message ?? "failure", data: null }
    } catch (error) {
        return { status: "failure", data: null }
    }
}
