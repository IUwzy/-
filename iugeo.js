// 1. 状态检查
if (!$response || $response.statusCode != 200) {
  $done({});
}

// 2. 预设值与校验函数
var city0 = "高谭市";
var isp0 = "Cross-GFW.org";

function City_ValidCheck(para) {
  return para ? para : city0;
}

function Area_check(para) {
  if(para == "中华民国") return "台湾";
  return para ? para : "Unknown";
}

// 3. 国旗映射表 (由你的代码简化，保留核心)
var flags = new Map([
  ["CN","🇨🇳"],["HK","🇭🇰"],["TW","🇨🇳"],["SG","🇸🇬"],["US","🇺🇸"],["JP","🇯🇵"],["KR","🇰🇷"],["GB","🇬🇧"],["FR","🇫🇷"],["DE","🇩🇪"]
  // ...此处可按需补全你之前的 Map 列表
]);

// 4. 解析逻辑
try {
  var obj = JSON.parse($response.body);
  var code = obj['countryCode'];
  
  // 获取国旗，如果 Map 里没有则根据代码自动生成
  var emoji = flags.get(code) || (code ? code.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397)) : "📍");
  
  var country = Area_check(obj['country']);
  var ipAddr = obj['query'] || "";
  var asInfo = obj['as'] || "";

  // --- 关键修改：重新定义显示行 ---
  
  // 第一行：国旗 国家 IP
  var title = `${emoji} ${country}  ${ipAddr}`;
  
  // 第二行：AS信息
  var subtitle =      asInfo;

  // 详细面板内容
  var description = '------------------------------' + '\n' +
    '🖥️ 服务商: ' + (obj['isp'] || "Unknown") + '\n' +
    '🌍 地区: ' + City_ValidCheck(obj['regionName']) + '\n' +
    '🗺️ IP地址: ' + ipAddr + ' ' + emoji + '\n' +
    '🕗 时区: ' + (obj['timezone'] || "Unknown") + '\n' +
    '📍 经纬度: ' + (obj['lon'] || "0") + ',' + (obj['lat'] || "0") + '\n' +
    '🪙 货币: ' + (obj['currency'] || "Unknown");

  // 5. 正确返回结果给 QX
  $done({title, subtitle, ip: ipAddr, description});

} catch (e) {
  console.log("QXGeo Error: " + e);
  $done({});
}
