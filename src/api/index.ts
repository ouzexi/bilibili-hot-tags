import axios from "axios";
// import getSignQuery from './sign'
import type { SearchType } from "../enum";
const API = axios.create({
    // baseURL: '/ouzx',
    method: 'POST',
    timeout: 45 * 1000,
    headers: {
        Accept: '*',
        'Content-Type': 'application/json'
    }
})

// export const FetchURL = '/bilibili-tags'
export const FetchURL = 'https://bilibili-hot-tags-git-master-ouzexis-projects.vercel.app/ouzx/bilibili-tags'
// const query = await getSignQuery()

const FetchVideos = (params: SearchType): Promise<Record<PropertyKey, any>> => {
    return API.get(FetchURL, {
        params
    })
}

export default FetchVideos;