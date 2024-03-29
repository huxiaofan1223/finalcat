import { Message } from "element-ui";

const deepClone = (a) => {
    return JSON.parse(JSON.stringify(a));
}
const equals = (a,b) => {
    return JSON.stringify(a) === JSON.stringify(b);
}
const isEmpty = (a) => {
    return a === '' || a === undefined || a === null;
}
const CollateOptions = [
    {"Collation":"big5_chinese_ci","Charset":"big5","Id":1,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"big5_bin","Charset":"big5","Id":84,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"dec8_swedish_ci","Charset":"dec8","Id":3,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"dec8_bin","Charset":"dec8","Id":69,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp850_general_ci","Charset":"cp850","Id":4,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp850_bin","Charset":"cp850","Id":80,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"hp8_english_ci","Charset":"hp8","Id":6,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"hp8_bin","Charset":"hp8","Id":72,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"koi8r_general_ci","Charset":"koi8r","Id":7,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"koi8r_bin","Charset":"koi8r","Id":74,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin1_german1_ci","Charset":"latin1","Id":5,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin1_swedish_ci","Charset":"latin1","Id":8,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin1_danish_ci","Charset":"latin1","Id":15,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin1_german2_ci","Charset":"latin1","Id":31,"Default":"","Compiled":"Yes","Sortlen":2},
    {"Collation":"latin1_bin","Charset":"latin1","Id":47,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin1_general_ci","Charset":"latin1","Id":48,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin1_general_cs","Charset":"latin1","Id":49,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin1_spanish_ci","Charset":"latin1","Id":94,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin2_czech_cs","Charset":"latin2","Id":2,"Default":"","Compiled":"Yes","Sortlen":4},
    {"Collation":"latin2_general_ci","Charset":"latin2","Id":9,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin2_hungarian_ci","Charset":"latin2","Id":21,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin2_croatian_ci","Charset":"latin2","Id":27,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin2_bin","Charset":"latin2","Id":77,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"swe7_swedish_ci","Charset":"swe7","Id":10,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"swe7_bin","Charset":"swe7","Id":82,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"ascii_general_ci","Charset":"ascii","Id":11,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"ascii_bin","Charset":"ascii","Id":65,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"ujis_japanese_ci","Charset":"ujis","Id":12,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"ujis_bin","Charset":"ujis","Id":91,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"sjis_japanese_ci","Charset":"sjis","Id":13,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"sjis_bin","Charset":"sjis","Id":88,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"hebrew_general_ci","Charset":"hebrew","Id":16,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"hebrew_bin","Charset":"hebrew","Id":71,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"tis620_thai_ci","Charset":"tis620","Id":18,"Default":"Yes","Compiled":"Yes","Sortlen":4},
    {"Collation":"tis620_bin","Charset":"tis620","Id":89,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"euckr_korean_ci","Charset":"euckr","Id":19,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"euckr_bin","Charset":"euckr","Id":85,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"koi8u_general_ci","Charset":"koi8u","Id":22,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"koi8u_bin","Charset":"koi8u","Id":75,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"gb2312_chinese_ci","Charset":"gb2312","Id":24,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"gb2312_bin","Charset":"gb2312","Id":86,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"greek_general_ci","Charset":"greek","Id":25,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"greek_bin","Charset":"greek","Id":70,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1250_general_ci","Charset":"cp1250","Id":26,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1250_czech_cs","Charset":"cp1250","Id":34,"Default":"","Compiled":"Yes","Sortlen":2},
    {"Collation":"cp1250_croatian_ci","Charset":"cp1250","Id":44,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1250_bin","Charset":"cp1250","Id":66,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1250_polish_ci","Charset":"cp1250","Id":99,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"gbk_chinese_ci","Charset":"gbk","Id":28,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"gbk_bin","Charset":"gbk","Id":87,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin5_turkish_ci","Charset":"latin5","Id":30,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin5_bin","Charset":"latin5","Id":78,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"armscii8_general_ci","Charset":"armscii8","Id":32,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"armscii8_bin","Charset":"armscii8","Id":64,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf8_general_ci","Charset":"utf8","Id":33,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf8_bin","Charset":"utf8","Id":83,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf8_unicode_ci","Charset":"utf8","Id":192,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_icelandic_ci","Charset":"utf8","Id":193,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_latvian_ci","Charset":"utf8","Id":194,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_romanian_ci","Charset":"utf8","Id":195,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_slovenian_ci","Charset":"utf8","Id":196,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_polish_ci","Charset":"utf8","Id":197,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_estonian_ci","Charset":"utf8","Id":198,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_spanish_ci","Charset":"utf8","Id":199,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_swedish_ci","Charset":"utf8","Id":200,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_turkish_ci","Charset":"utf8","Id":201,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_czech_ci","Charset":"utf8","Id":202,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_danish_ci","Charset":"utf8","Id":203,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_lithuanian_ci","Charset":"utf8","Id":204,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_slovak_ci","Charset":"utf8","Id":205,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_spanish2_ci","Charset":"utf8","Id":206,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_roman_ci","Charset":"utf8","Id":207,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_persian_ci","Charset":"utf8","Id":208,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_esperanto_ci","Charset":"utf8","Id":209,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_hungarian_ci","Charset":"utf8","Id":210,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_sinhala_ci","Charset":"utf8","Id":211,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_german2_ci","Charset":"utf8","Id":212,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_croatian_ci","Charset":"utf8","Id":213,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_unicode_520_ci","Charset":"utf8","Id":214,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_vietnamese_ci","Charset":"utf8","Id":215,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8_general_mysql500_ci","Charset":"utf8","Id":223,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"ucs2_general_ci","Charset":"ucs2","Id":35,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"ucs2_bin","Charset":"ucs2","Id":90,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"ucs2_unicode_ci","Charset":"ucs2","Id":128,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_icelandic_ci","Charset":"ucs2","Id":129,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_latvian_ci","Charset":"ucs2","Id":130,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_romanian_ci","Charset":"ucs2","Id":131,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_slovenian_ci","Charset":"ucs2","Id":132,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_polish_ci","Charset":"ucs2","Id":133,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_estonian_ci","Charset":"ucs2","Id":134,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_spanish_ci","Charset":"ucs2","Id":135,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_swedish_ci","Charset":"ucs2","Id":136,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_turkish_ci","Charset":"ucs2","Id":137,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_czech_ci","Charset":"ucs2","Id":138,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_danish_ci","Charset":"ucs2","Id":139,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_lithuanian_ci","Charset":"ucs2","Id":140,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_slovak_ci","Charset":"ucs2","Id":141,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_spanish2_ci","Charset":"ucs2","Id":142,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_roman_ci","Charset":"ucs2","Id":143,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_persian_ci","Charset":"ucs2","Id":144,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_esperanto_ci","Charset":"ucs2","Id":145,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_hungarian_ci","Charset":"ucs2","Id":146,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_sinhala_ci","Charset":"ucs2","Id":147,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_german2_ci","Charset":"ucs2","Id":148,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_croatian_ci","Charset":"ucs2","Id":149,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_unicode_520_ci","Charset":"ucs2","Id":150,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_vietnamese_ci","Charset":"ucs2","Id":151,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"ucs2_general_mysql500_ci","Charset":"ucs2","Id":159,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp866_general_ci","Charset":"cp866","Id":36,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp866_bin","Charset":"cp866","Id":68,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"keybcs2_general_ci","Charset":"keybcs2","Id":37,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"keybcs2_bin","Charset":"keybcs2","Id":73,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"macce_general_ci","Charset":"macce","Id":38,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"macce_bin","Charset":"macce","Id":43,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"macroman_general_ci","Charset":"macroman","Id":39,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"macroman_bin","Charset":"macroman","Id":53,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp852_general_ci","Charset":"cp852","Id":40,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp852_bin","Charset":"cp852","Id":81,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin7_estonian_cs","Charset":"latin7","Id":20,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin7_general_ci","Charset":"latin7","Id":41,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin7_general_cs","Charset":"latin7","Id":42,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"latin7_bin","Charset":"latin7","Id":79,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf8mb4_general_ci","Charset":"utf8mb4","Id":45,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf8mb4_bin","Charset":"utf8mb4","Id":46,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf8mb4_unicode_ci","Charset":"utf8mb4","Id":224,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_icelandic_ci","Charset":"utf8mb4","Id":225,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_latvian_ci","Charset":"utf8mb4","Id":226,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_romanian_ci","Charset":"utf8mb4","Id":227,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_slovenian_ci","Charset":"utf8mb4","Id":228,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_polish_ci","Charset":"utf8mb4","Id":229,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_estonian_ci","Charset":"utf8mb4","Id":230,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_spanish_ci","Charset":"utf8mb4","Id":231,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_swedish_ci","Charset":"utf8mb4","Id":232,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_turkish_ci","Charset":"utf8mb4","Id":233,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_czech_ci","Charset":"utf8mb4","Id":234,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_danish_ci","Charset":"utf8mb4","Id":235,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_lithuanian_ci","Charset":"utf8mb4","Id":236,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_slovak_ci","Charset":"utf8mb4","Id":237,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_spanish2_ci","Charset":"utf8mb4","Id":238,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_roman_ci","Charset":"utf8mb4","Id":239,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_persian_ci","Charset":"utf8mb4","Id":240,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_esperanto_ci","Charset":"utf8mb4","Id":241,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_hungarian_ci","Charset":"utf8mb4","Id":242,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_sinhala_ci","Charset":"utf8mb4","Id":243,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_german2_ci","Charset":"utf8mb4","Id":244,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_croatian_ci","Charset":"utf8mb4","Id":245,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_unicode_520_ci","Charset":"utf8mb4","Id":246,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf8mb4_vietnamese_ci","Charset":"utf8mb4","Id":247,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"cp1251_bulgarian_ci","Charset":"cp1251","Id":14,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1251_ukrainian_ci","Charset":"cp1251","Id":23,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1251_bin","Charset":"cp1251","Id":50,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1251_general_ci","Charset":"cp1251","Id":51,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1251_general_cs","Charset":"cp1251","Id":52,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf16_general_ci","Charset":"utf16","Id":54,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf16_bin","Charset":"utf16","Id":55,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf16_unicode_ci","Charset":"utf16","Id":101,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_icelandic_ci","Charset":"utf16","Id":102,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_latvian_ci","Charset":"utf16","Id":103,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_romanian_ci","Charset":"utf16","Id":104,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_slovenian_ci","Charset":"utf16","Id":105,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_polish_ci","Charset":"utf16","Id":106,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_estonian_ci","Charset":"utf16","Id":107,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_spanish_ci","Charset":"utf16","Id":108,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_swedish_ci","Charset":"utf16","Id":109,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_turkish_ci","Charset":"utf16","Id":110,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_czech_ci","Charset":"utf16","Id":111,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_danish_ci","Charset":"utf16","Id":112,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_lithuanian_ci","Charset":"utf16","Id":113,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_slovak_ci","Charset":"utf16","Id":114,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_spanish2_ci","Charset":"utf16","Id":115,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_roman_ci","Charset":"utf16","Id":116,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_persian_ci","Charset":"utf16","Id":117,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_esperanto_ci","Charset":"utf16","Id":118,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_hungarian_ci","Charset":"utf16","Id":119,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_sinhala_ci","Charset":"utf16","Id":120,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_german2_ci","Charset":"utf16","Id":121,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_croatian_ci","Charset":"utf16","Id":122,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_unicode_520_ci","Charset":"utf16","Id":123,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16_vietnamese_ci","Charset":"utf16","Id":124,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf16le_general_ci","Charset":"utf16le","Id":56,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf16le_bin","Charset":"utf16le","Id":62,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1256_general_ci","Charset":"cp1256","Id":57,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1256_bin","Charset":"cp1256","Id":67,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1257_lithuanian_ci","Charset":"cp1257","Id":29,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1257_bin","Charset":"cp1257","Id":58,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp1257_general_ci","Charset":"cp1257","Id":59,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf32_general_ci","Charset":"utf32","Id":60,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf32_bin","Charset":"utf32","Id":61,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"utf32_unicode_ci","Charset":"utf32","Id":160,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_icelandic_ci","Charset":"utf32","Id":161,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_latvian_ci","Charset":"utf32","Id":162,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_romanian_ci","Charset":"utf32","Id":163,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_slovenian_ci","Charset":"utf32","Id":164,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_polish_ci","Charset":"utf32","Id":165,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_estonian_ci","Charset":"utf32","Id":166,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_spanish_ci","Charset":"utf32","Id":167,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_swedish_ci","Charset":"utf32","Id":168,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_turkish_ci","Charset":"utf32","Id":169,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_czech_ci","Charset":"utf32","Id":170,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_danish_ci","Charset":"utf32","Id":171,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_lithuanian_ci","Charset":"utf32","Id":172,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_slovak_ci","Charset":"utf32","Id":173,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_spanish2_ci","Charset":"utf32","Id":174,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_roman_ci","Charset":"utf32","Id":175,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_persian_ci","Charset":"utf32","Id":176,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_esperanto_ci","Charset":"utf32","Id":177,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_hungarian_ci","Charset":"utf32","Id":178,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_sinhala_ci","Charset":"utf32","Id":179,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_german2_ci","Charset":"utf32","Id":180,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_croatian_ci","Charset":"utf32","Id":181,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_unicode_520_ci","Charset":"utf32","Id":182,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"utf32_vietnamese_ci","Charset":"utf32","Id":183,"Default":"","Compiled":"Yes","Sortlen":8},
    {"Collation":"binary","Charset":"binary","Id":63,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"geostd8_general_ci","Charset":"geostd8","Id":92,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"geostd8_bin","Charset":"geostd8","Id":93,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp932_japanese_ci","Charset":"cp932","Id":95,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"cp932_bin","Charset":"cp932","Id":96,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"eucjpms_japanese_ci","Charset":"eucjpms","Id":97,"Default":"Yes","Compiled":"Yes","Sortlen":1},
    {"Collation":"eucjpms_bin","Charset":"eucjpms","Id":98,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"gb18030_chinese_ci","Charset":"gb18030","Id":248,"Default":"Yes","Compiled":"Yes","Sortlen":2},
    {"Collation":"gb18030_bin","Charset":"gb18030","Id":249,"Default":"","Compiled":"Yes","Sortlen":1},
    {"Collation":"gb18030_unicode_520_ci","Charset":"gb18030","Id":250,"Default":"","Compiled":"Yes","Sortlen":8}
]

const getDefaultCollateByCharset = (charset)=>{
    const filterArr = CollateOptions.filter(item=>item.Charset===charset);
    return filterArr[0].Collation;
}

const isLimitSql = (sql)=>{
    return /.*limit.*?\d+$/i.test(sql);
}
const isCountSql = (sql)=>{
    return /^select count\(.*?\)((?!,).)*? from/i.test(sql);
}
const isMultisql = (sql)=>{
    const arr = ['select','insert','delete','update','alter','rename','drop'];
    const lowReg = arr.map(item=>{return '('+item+')'}).join('|');
    const reg = new RegExp(`;\n* *[${lowReg}|${lowReg.toUpperCase()}]`);
    return reg.test(sql);
}

const msgSuccess = (msgObj,sql="") => {
    let msgHTML = '';
    let msgArr = [];
    if(typeof msgObj === 'object' && !Array.isArray(msgObj)){
        for(let i in msgObj){
            msgArr.push(`${i}：${msgObj[i]}`);
        }
    } else {
        msgArr.push(`toast：success`);
    }
    if(!isEmpty(sql)){
        msgArr.push(`sql：${sql.length>100?sql.substring(0,100)+'...':sql}`);
    }
    msgHTML = msgArr.join("<br>");
    Message({
        dangerouslyUseHTMLString: true,
        type:"success",
        duration:3000,
        showClose:true,
        message:msgHTML
    });
}

// a=>`a`
const formatVal = (val) => {
    return '`'+val+'`'
}

// '=>\'
// \=>\\
const escape = (val) => {
    return val.replace(/['\\]/g,(match)=>{return `\\${match}`});
}


// int(2)=>2
const columnType2Length = (val)=>{
    const mt = val.match(/.*\((\d+)\)/);
    if(mt!==null){
        return mt[1];
    } else {
        return '';
    }
}

const getSqlType = (sql) => {
    const type = sql.split(" ")[0].toLowerCase();
    return type;
}

export default {
    deepClone,
    equals,
    isEmpty,
    CollateOptions,
    formatVal,
    escape,
    columnType2Length,
    msgSuccess,
    getDefaultCollateByCharset,
    isMultisql,
    isLimitSql,
    isCountSql,
    getSqlType
}