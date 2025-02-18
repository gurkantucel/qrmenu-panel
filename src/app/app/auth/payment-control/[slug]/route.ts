import { NextResponse, type NextRequest } from 'next/server'
import Constants from 'utils/Constants';
import CryptoJS from 'crypto-js';

export async function POST(req: NextRequest) {
    try {
        console.log(JSON.stringify(req));
        const body = await req.text();

        const apiKey = Constants.IYZICOAPIKEY();
        const secretKey = Constants.IYZICOSECRETKEY();
        const randomKey = new Date().getTime() + "KLINIKHGT7837";
        const uri_path = "/payment/iyzipos/checkoutform/auth/ecom/detail";
        const token = body.split("=")[1];
        console.log("pathname", req.nextUrl.pathname);
        const conversationId = req.nextUrl.pathname.split("/")[4];

        console.log("conversationId", conversationId);

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

        if (response.status == 200) {
            const iyzicoResult = await response.json();
            console.log("iyzicoResult", iyzicoResult);
            console.log(req.url);
            if (iyzicoResult.status == "success") {
                return NextResponse.redirect(new URL(`/app/auth/pay-success/${conversationId}`, Constants.URL()));
            }
            return NextResponse.redirect(new URL('/app/auth/register', req.url))
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "PAY_FORM_NOT_FOUND" },)
    }

}