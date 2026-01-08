// 1. 状态检查
if (!$response || $response.statusCode != 200) {
  $done({});
}

// 2. 基础校验函数
function City_ValidCheck(para) {
  return para ? para : "高谭市";
}

function Area_check(para) {
  return para === "中华民国" ? "台湾" : (para ? para : "Unknown");
}

// 3. 国旗映射表 (支持自动生成，Map 仅作为特殊修正)
const flags = new Map([
  ["CN","🇨🇳"],["HK","🇭🇰"],["TW","🇨🇳"],["SG","🇸🇬"],["US","🇺🇸"],["JP","🇯🇵"],["KR","🇰🇷"]
]);

// 4. 解析与显示逻辑
try {
  const obj = JSON.parse($response.body);
  const code = obj['countryCode'];
  
  // 自动获取国旗 Emoji
  const emoji = flags.get(code) || (code ? code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) : "📍");
  
  const country = Area_check(obj['country']);
  const region = City_ValidCheck(obj['regionName']);
  const ipAddr = obj['query'] || "Unknown IP";
  const asInfo = obj['as'] || "Unknown AS";

  // --- 按照你的新要求格式化 ---
  
  // 第一行：国旗 + AS信息
  const title = `${emoji} ${asInfo}`;
  
  // 第二行：国家 + 地区 + IP
  const subtitle = `${country} ${region} ${ipAddr}`;

  // 详细面板 (保持原有详细信息显示)
  const description = [
    '------------------------------',
    `🖥️ 服务商: ${obj['isp'] || "Unknown"}`,
    `🌍 地区: ${region}`,
    `🗺️ IP地址: ${ipAddr} ${emoji}`,
    `🕗 时区: ${obj['timezone'] || "Unknown"}`,
    `📍 经纬度: ${obj['lon'] || "0"},${obj['lat'] || "0"}`,
    `🪙 货币: ${obj['currency'] || "Unknown"}`
  ].join('\n\n');

  // 5. 返回结果给 QX
  $done({title, subtitle, ip: ipAddr, description});

} catch (e) {
  console.log("QXGeo Error: " + e);
  $done({title: "解析失败", subtitle: "请检查 API 响应"});
}
