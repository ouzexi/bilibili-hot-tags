import axios from "axios";
// import getSignQuery from './sign'
import type { SearchType } from "../enum";
const API = axios.create({
    baseURL: '/ouzx',
    method: 'POST',
    timeout: 45 * 1000,
    headers: {
        Accept: '*',
        'Content-Type': 'application/json'
    }
})

// export const FetchURL = '/x/web-interface/wbi/search/type?search_type=video'
export const FetchURL = '/sys/fetch'
// const query = await getSignQuery()

const FetchVideos = (params: SearchType): Promise<Record<PropertyKey, any>> => {
    return API.get(FetchURL, {
        params
    })
}

export default FetchVideos;