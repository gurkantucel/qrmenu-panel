import CryptoJS from 'crypto-js';
import Constants from 'utils/Constants';
import { type NextRequest } from 'next/server'
import { OrderQueryModel } from 'reduxt/features/order/model/order-model';

const fetchOrderQuery = async (orderNumber: string) => {
    try {
        const orderQuery = await fetch(`${Constants.APIURL()}/api/app/order/query?order_number=${orderNumber}`);

        if (orderQuery.status == 200) {
            const result = await orderQuery.json() as OrderQueryModel;
            return result;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function POST(req: NextRequest) {

    //const forwardedFor = req.headers.get('x-forwarded-for');
    //const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'; // İlk IP'yi al
    const ip = req.ip;
    const body = await req.json();

    const orderQuery = await fetchOrderQuery(body.order_number);

    if (orderQuery != null && orderQuery.data != null) {

        if (orderQuery.data.order_status_code != "00002") {
            return Response.json({ message: "NOT_WAITING_FOR_PAYMENT" }, { status: 400 })
        }

        const model = orderQuery.data;
        const kdvsizDeger = model.amount;
        const kdvliDeger = model.total;
        const currency = model.currency_code
        const buyer = {
            id: model.user_id,
            name: model.name,
            surname: model.surname,
            identityNumber: model.tax_identification_number,
            phone: model.phone_number,
            phoneCode: model.phone_code,
            email: model.email,
            address: model.address,
            city: model.city_name,
            country: model.country_name
        }
        const basket = {
            id: model.order_id,
            name: model.product_name,
            category1: model.product_id,
            category2: ""
        }
        const callbackUrl = `${Constants.URL()}/app/auth/payment-control/${model.order_number}`
        const apiKey = Constants.IYZICOAPIKEY();
        const secretKey = Constants.IYZICOSECRETKEY();

        const randomKey = new Date().getTime() + "KLINIKHGT7837";
        const uri_path = "/payment/iyzipos/checkoutform/initialize/auth/ecom";

        const raw = JSON.stringify({
            "locale": "tr",
            "conversationId": `${model.order_number}`,
            "price": `${kdvsizDeger}`,
            "basketId": `${basket.id}`,
            "paymentGroup": "PRODUCT",
            "buyer": {
                "id": `${buyer.id}`,
                "name": `${buyer.name}`,
                "surname": `${buyer.surname}`,
                "identityNumber": `${buyer.identityNumber}`,
                "email": `${buyer.email}`,
                "gsmNumber": `${buyer.phoneCode}${buyer.phone}`,
                "registrationAddress": `${buyer.address}`,
                "city": `${buyer.city}`,
                "country": `${buyer.country}`,
                "ip": `${ip}`
            },
            "shippingAddress": {
                "address": `${buyer.address}`,
                "contactName": `${buyer.name} ${buyer.surname}`,
                "city": `${buyer.city}`,
                "country": `${buyer.country}`
            },
            "billingAddress": {
                "address": `${buyer.address}`,
                "contactName": `${buyer.name} ${buyer.surname}`,
                "city": `${buyer.city}`,
                "country": `${buyer.country}`
            },
            "basketItems": [
                {
                    "id": `${basket.id}`,
                    "price": `${kdvsizDeger}`,
                    "name": `${basket.name}`,
                    "category1": `${basket.category1}`,
                    "category2": `${basket.category2}`,
                    "itemType": "VIRTUAL"
                },
            ],
            "enabledInstallments": [1],
            "callbackUrl": `${callbackUrl}`,
            "currency": currency,
            "paidPrice": `${kdvliDeger}`
        });

        const mergeString = `${randomKey}${uri_path}${raw}`
        var encryptedData = CryptoJS.HmacSHA256(mergeString, secretKey!);
        var authorizationString = "apiKey:" + apiKey
            + "&randomKey:" + randomKey
            + "&signature:" + encryptedData;

        var base64EncodedAuthorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationString));

        var result = `IYZWSv2 ${base64EncodedAuthorization}`

        const response = await fetch(`${Constants.IYZICOAPIURL()}/payment/iyzipos/checkoutform/initialize/auth/ecom`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": result,
                "x-iyzi-rnd": randomKey,
            },
            body: raw,
            redirect: "follow"
        });

        let responseJsonResponse = await response.json();
        const packageData = {
            currency_code: model.currency_code,
            amount: model.amount,
            total_amount: model.total_amount,
            vat: model.vat,
            vat_amount: model.vat_amount,
            total: model.total,
            coupon_code: model.coupon_code,
            coupon_discount_percentage: model.coupon_discount_percentage,
            product_name: model.product_name
        }
        if (response.status == 200) {
            return Response.json({
                ...responseJsonResponse,
                packageData: packageData
            }, { status: 200 })
        }
        return Response.json({ message: "PAY_NOT_FOUND" }, { status: 400 })
    }

    return Response.json({ message: "ORDER_NOT_FOUND" }, { status: 400 })
}