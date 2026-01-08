// 1. 状态检查
if (!$response || $response.statusCode != 200) {
  $done({});
}

// 2. 基础函数定义
function City_ValidCheck(para) {
  return para ? para : "高谭市";
}

function Area_check(para) {
  return para === "中华民国" ? "台湾" : (para ? para : "Unknown");
}

// 3. 国旗映射表 (由你的代码库精简)
const flags = new Map([
  ["CN","🇨🇳"],["HK","🇭🇰"],["TW","🇨🇳"],["SG","🇸🇬"],["US","🇺🇸"],["JP","🇯🇵"],["KR","🇰🇷"],["GB","🇬🇧"],["MO","🇲🇴"]
]);

// 4. 解析与显示逻辑
try {
  const obj = JSON.parse($response.body);
  const code = obj['countryCode'];
  
  // 获取国旗：Map 中没有则根据代码自动生成
  const emoji = flags.get(code) || (code ? code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) : "📍");
  
  const country = Area_check(obj['country']);
  const ipAddr = obj['query'] || "Unknown IP";
  const asInfo = obj['as'] || "Unknown AS";

  // --- 格式化显示 ---
  
  // 第一行：国旗 国家 IP
  const title = `${emoji} ${country}  ${ipAddr}`;
  
  // 第二行：🦋 AS信息
  const subtitle = `🦋 ${asInfo}`;

  // 详细面板 (Description)
  const description = [
    '------------------------------',
    `🖥️ 服务商: ${obj['isp'] || "Unknown"}`,
    `🌍 地区: ${City_ValidCheck(obj['regionName'])}`,
    `🗺️ IP地址: ${ipAddr} ${emoji}`,
    `🕗 时区: ${obj['timezone'] || "Unknown"}`,
    `📍 经纬度: ${obj['lon'] || "0"},${obj['lat'] || "0"}`,
    `🪙 货币: ${obj['currency'] || "Unknown"}`
  ].join('\n\n');

  // 5. 返回结果
  $done({title, subtitle, ip: ipAddr, description});

} catch (e) {
  console.log("QXGeo Error: " + e);
  $done({title: "解析失败", subtitle: "请检查 API 响应"});
}
