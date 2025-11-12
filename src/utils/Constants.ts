const URL = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.NEXT_PUBLIC_URL_DEV;
        default:
            return process.env.NEXT_PUBLIC_URL_PROD;
    }
}
const APIURL = process.env.NEXT_PUBLIC_API_URL;

const AUTHURL = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.NEXT_PUBLIC_AUTH_API_URL_DEV;
        default:
            return process.env.NEXT_PUBLIC_AUTH_API_URL_PROD;
    }
}
const WEBAPIKEY = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.NEXT_PUBLIC_WEB_API_KEY_DEV;
        default:
            return process.env.NEXT_PUBLIC_WEB_API_KEY_PROD;
    }
}

const ONESIGNALTOKEN = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.NEXT_PUBLIC_ONESIGNAL_TOKEN_DEV;
        default:
            return process.env.NEXT_PUBLIC_ONESIGNAL_TOKEN_PROD;
    }
}

const ONESIGNALAPPID = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.NEXT_PUBLIC_ONESIGNAL_APPID_DEV;
        default:
            return process.env.NEXT_PUBLIC_ONESIGNAL_APPID_PROD;
    }
}

const IYZICOAPIURL = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.IYZICO_API_URL_DEV;
        default:
            return process.env.IYZICO_API_URL_PROD;
    }
}

const IYZICOAPIKEY = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.IYZICO_APIKEY_DEV;
        default:
            return process.env.IYZICO_APIKEY_PROD;
    }
}

const IYZICOSECRETKEY = (): string | undefined => {
    switch (process.env.NEXT_PUBLIC_APP_ENV) {
        case "DEV":
            return process.env.IYZICO_SECRETKEY_DEV;
        default:
            return process.env.IYZICO_SECRETKEY_PROD;
    }
}

export default {
    URL,
    APIURL,
    AUTHURL,
    WEBAPIKEY,
    ONESIGNALTOKEN,
    ONESIGNALAPPID,
    IYZICOAPIURL,
    IYZICOAPIKEY,
    IYZICOSECRETKEY
}