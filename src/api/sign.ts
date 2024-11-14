import md5 from 'md5'

const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52
]

// 对 imgKey 和 subKey 进行字符顺序打乱编码
const getMixinKey = (orig: string) =>
  mixinKeyEncTab
    .map((n) => orig[n])
    .join("")
    .slice(0, 32);

// 为请求参数进行 wbi 签名
function encWbi(
  params: { [key: string]: string | number | object },
  img_key: string,
  sub_key: string
) {
  const mixin_key = getMixinKey(img_key + sub_key),
    curr_time = Math.round(Date.now() / 1000),
    chr_filter = /[!'()*]/g;

  Object.assign(params, { wts: curr_time }); // 添加 wts 字段
  // 按照 key 重排参数
  const query = Object.keys(params)
    .sort()
    .map((key) => {
      // 过滤 value 中的 "!'()*" 字符
      const value = params[key].toString().replace(chr_filter, "");
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");

  const wbi_sign = md5(query + mixin_key); // 计算 w_rid

  return query + "&w_rid=" + wbi_sign;
}
// 获取最新的 img_key 和 sub_key
async function getWbiKeys(SESSDATA: string) {
  const res = await fetch('https://api.bilibili.com/x/web-interface/nav', {
    mode: 'no-cors',
    headers: {
      // SESSDATA 字段
      Cookie: `SESSDATA=${SESSDATA}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      Referer: 'https://www.bilibili.com/'//对于直接浏览器调用可能不适用
    }
  })
  const {
    data: {
      wbi_img: { img_url, sub_url },
    },
  } = (await res.json()) as {
    data: {
      wbi_img: { img_url: string; sub_url: string };
    };
  };

  return {
    img_key: img_url.slice(
      img_url.lastIndexOf('/') + 1,
      img_url.lastIndexOf('.')
    ),
    sub_key: sub_url.slice(
      sub_url.lastIndexOf('/') + 1,
      sub_url.lastIndexOf('.')
    )
  }
}

async function main() {
  const web_keys = await getWbiKeys("buvid_fp_plain=undefined; buvid4=18A68FB2-F597-AF65-5F3B-7CF1A758861504264-023041811-ex5UQvvtG351fkucjsxdxw%3D%3D; enable_web_push=DISABLE; CURRENT_BLACKGAP=0; FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW3; CURRENT_QUALITY=80; buvid3=014F6001-B296-6944-8130-3933A874E7EE85205infoc; b_nut=1713335685; _uuid=B49410F89-710F4-8558-752F-65410C48B28C211180infoc; header_theme_version=CLOSE; hit-dyn-v2=1; rpdid=|(k|J|~|muRk0J'u~uYJY|l)k; fingerprint=49495033dc74747a84ddfa9d12d82580; buvid_fp=49495033dc74747a84ddfa9d12d82580; DedeUserID=312811426; DedeUserID__ckMd5=3fdfdd712bd29342; LIVE_BUVID=AUTO7917235357201806; PVID=2; CURRENT_FNVAL=4048; home_feed_column=5; browser_resolution=2048-983; bmg_af_switch=1; bmg_src_def_domain=i0.hdslb.com; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE4MDg3MzMsImlhdCI6MTczMTU0OTQ3MywicGx0IjotMX0.-6uX5rnM4rWC6vKEmQFkaI7arbZ15EIv_d6t8-adXVI; bili_ticket_expires=1731808673; bili_jct=734cc39a8e920684a25f4c7b2313631e; sid=4rrfeb4f; bp_t_offset_312811426=999487379959971840; b_lsid=DCC1029A6_1932970E236")
  const params = { foo: '114', bar: '514', baz: 1919810 },
    img_key = web_keys.img_key,
    sub_key = web_keys.sub_key
  const query = encWbi(params, img_key, sub_key)
  return query
}

export default main
