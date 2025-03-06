'use server'
import Constants from "utils/Constants"

export const getStaticPage = (async (slug: string) => {
    try {
        const result = await fetch(`${Constants.APIURL()}/api/definition/static-page/read?slug=${slug}`,{ next: { revalidate: 3600 } })
        if (result.status == 200) {
            var model = await result.json();
            return {
                status: "success",
                data: model
            }
        }
        return { status: "failure", data: null }
    } catch (error) {
        return { status: "failure", data: null }
    }
});

/*export async function getStaticPage(slug?: string) {
    try {
        const result = await fetch(`${Constants.APIURL()}/api/definition/static-page/read?slug=${slug}`)
        if (result.status == 200) {
            var model = await result.json();
            return {
                status: "success",
                data: model
            }
        }
        return { status: "failure", data: null }
    } catch (error) {
        return { status: "failure", data: null }
    }
}*/
