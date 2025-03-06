'use server'

import Constants from "utils/Constants"

export async function getHomeMembershipPackages() {
    try {
        const result = await fetch(`${Constants.APIURL()}/api/definition/membership-packages/detailedList`, { next: { revalidate: 0 } })
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
}

export async function getHomeFaq() {
    try {
        const result = await fetch(`${Constants.APIURL()}/api/definition/faq/dropDown?is_home=true`, { next: { revalidate: 0 } })
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
}
