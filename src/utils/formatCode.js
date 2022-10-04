export function fChineseCode (code, alphabets) {
  // 用来替换的中文
  var arrPerson = ["小米", "小明", "小红", "小刚", "小强", "小李", "小陈", "小杨",  // 2-9
  "小张", "小秦", "小蒋", "小朱", "小赵", "小王",  // CFGHJM
  "小磊", "小何", "小叶", "小肖", "小周", "小郭"];  // PQRVWX
  var arrNumber = ["一", "二", "三", "四", "五", "六", "七", "八", "九",
    "十", "十一", "十二", "十三", "十四", "十五",  // CFGHJM
    "十六", "十七", "十八", "十九", "二十"]  // PQRVWX
  var arrVerb = ["看", "听", "望", "瞪", "笑", "夸", "逗", "赶",  // 2-9
    "叫", "喊", "骗", "逼", "让", "使",  // CFGHJM
    "给", "送", "找", "选", "放", "抓"];  // PQRVWX
  var arrPeriod = ["年", "月", "日", "季", "昼", "时", "周", "天",  // 2-9
    "秒", "分", "代", "辈", "岁", "世",  // CFGHJM
    "更", "夜", "宵", "载", "暮", "集"]  // PQRVWX
  var arrPlace = ["宫", "寨", "庙", "寺", "村", "镇", "山", "院", "岛", "城", "市",
    "县", "省", "站", "店", "巷", "楼", "亭", "洞", "塔"];
  var arrQuantity = ["一只", "二只", "三只", "四只", "五只", "六只", "七只", "八只", "九只",
    "十只", "一群", "两群", "三群", "四群", "五群",
    "六群", "七群", "八群", "九群", "十群"];
  var arrAnimal = ["鼠", "牛", "虎", "兔", "蛇", "马", "羊", "猴",
    "鸡", "狗", "猪", "猫", "狼", "鸭",
    "鹅", "蛙", "象", "鱼", "驴", "鸟"];

  var finalStr = '';   // 用来存放最终拼接结果
  // 遍历：两个字母为一组，第一个字母代表行，第二个代表列
  for (var i = 0; i < code.length; i += 2) {
    var currentRow = code[i];
    var currentCol = code[i + 1];
    var translatedStr;   // 逐组翻译的结果
    // 语法规则见word文档
    switch (i) {
      case 0:
        translatedStr = arrPlace[alphabets.indexOf(currentRow)] + "里" + arrPerson[alphabets.indexOf(currentCol)] + "说";
        break;
      case 2:
        translatedStr = arrNumber[alphabets.indexOf(currentRow)] + arrPeriod[alphabets.indexOf(currentCol)] + "前";
        break;
      case 4:
        translatedStr = arrPerson[alphabets.indexOf(currentRow)] + "和" + arrPerson[alphabets.indexOf(currentCol)];
        break;
      case 6:
        translatedStr = "在" + arrPlace[alphabets.indexOf(currentRow)] + "里" + arrVerb[alphabets.indexOf(currentCol)];
        break;
      default:
        translatedStr = arrQuantity[alphabets.indexOf(currentRow)] + arrAnimal[alphabets.indexOf(currentCol)];
    }

    finalStr += translatedStr;   // 将该组结果接入最终结果
  }
  console.log(finalStr);
  return finalStr;
}