import { type NextRequest } from 'next/server'
import Constants from 'utils/Constants';
import CryptoJS from 'crypto-js';

export async function POST(req: NextRequest) {
    try {
        const apiKey = Constants.IYZICOAPIKEY();
        const secretKey = Constants.IYZICOSECRETKEY();
        const randomKey = new Date().getTime() + "KLINIKHGT7837";
        const uri_path = "/payment/iyzipos/checkoutform/auth/ecom/detail";

        const body = await req.json();

        var token = body.token;
        var conversationId = body.conversationId;

        const raw = JSON.stringify({
            "locale": "tr",
            "conversationId": conversationId,
            "token": token
        });

        const mergeString = `${randomKey}${uri_path}${raw}`;
        var encryptedData = CryptoJS.HmacSHA256(mergeString, secretKey!);
        var authorizationString = "apiKey:" + apiKey
            + "&randomKey:" + randomKey
            + "&signature:" + encryptedData;

        var base64EncodedAuthorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationString));

        var result = `IYZWSv2 ${base64EncodedAuthorization}`

        const response = await fetch(`${Constants.IYZICOAPIURL()}/payment/iyzipos/checkoutform/auth/ecom/detail`, {
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

        return Response.json(responseJsonResponse, { status: response.status })

    } catch (error) {
        return Response.json({ message: "PAYMENT_STEP2_ERROR" }, { status: 400 })
    }
}