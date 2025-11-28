'use server'

import Constants from "utils/Constants";

export async function getPayForm(orderId:string) {
    try {
        const result = await fetch(`${Constants.APIURL}/payment/step-1`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({"orderId" : orderId})
        })
        var model = await result.json();
        console.log(model);
        if (result.status == 200 && model.success == true && model.data) {
            return {
                status: "SUCCESS",
                data: model.data
            }
        }
        return { status: model?.message ?? "failure", data: null }
    } catch (error) {
        console.log(error);
        return { status: "failure", data: null }
    }
}
