import { ApiType, SessionTypeResponse, MediaContextTypeResponse, MediaTypeResponse } from "./interface";
import axios, { Axios } from "axios";
const BaseURL: string = "https://api.veriff.internal"

const instance: Axios = axios;

export const base: ApiType = {
    async session(sessionId: string) {

        const { data } = await instance.get<SessionTypeResponse>(`${BaseURL}/sessions/${sessionId}`).catch(e => e)

        return data === undefined ? {} : data
    
    },
    async media(sessionId: string) {

        const { data } = await axios.get<MediaTypeResponse>(`${BaseURL}/sessions/${sessionId}/media/`).catch(e => e)

        return data === undefined ? [] : data

    },
    async mediaContext(sessionId: string) {
        const { data } = await axios.get<MediaContextTypeResponse>(`${BaseURL}/media-context/${sessionId}`).catch(e => e)

        return data === undefined ? [] : data

    }
}