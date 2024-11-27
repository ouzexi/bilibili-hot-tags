export const OrderOptions: Array<Record<PropertyKey, String>> = [
    { label: '综合排序', value: 'totalrank' },
    { label: '最多点击', value: 'click' },
    { label: '最新发布', value: 'pubdate' },
    { label: '最多弹幕', value: 'dm' },
    { label: '最多收藏', value: 'stow' },
    { label: '最多评论', value: 'scores' }
]

export type SearchType = {
  keyword: string;
  order?: string;
};

export type TagType = {
    tag: string;
}

export enum ResponseEnum {
    'SUCCESS' = 200,
    'FAIL' = 503
}