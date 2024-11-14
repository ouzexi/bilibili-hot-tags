import type { TagType } from "../enum";

export const TransferRes = (res: Record<string, any>) => {
    const result: Array<TagType> = res?.data?.result ?? [];
    const tags: Array<string> = result.map(item => item.tag)
    const tagsMap: Record<PropertyKey, number> = {};
    for(let tag of tags) {
        const itemTags = (tag||'').split(',').filter(Boolean);
        for(let itemTag of itemTags) {
            if(!tagsMap[itemTag]) {
                tagsMap[itemTag] = 0
            }
            tagsMap[itemTag]++
        }
    }
    const sortRes = Object.keys(tagsMap).slice(0, 10).sort((a, b) => tagsMap[b] - tagsMap[a])
    const chartData = sortRes.map(cItem => ({ item: cItem, count: tagsMap[cItem] }))
    return chartData;
}