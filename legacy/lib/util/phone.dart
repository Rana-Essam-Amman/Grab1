const countryDial = {
  "JO": "962",
  "LB": "961",
  "PS": "970",
  "SY": "963",
};

String normalizePhone(String countryCode, String raw) {
  var digits = raw.replaceAll(RegExp(r"[^0-9]"), "");
  if (digits.startsWith("00")) digits = digits.substring(2);
  final cc = countryDial[countryCode] ?? "";
  if (cc.isNotEmpty && digits.startsWith(cc)) return "+$digits";
  if (digits.startsWith("0")) digits = digits.substring(1);
  return "+$cc$digits";
}

String cleanPersonName(String raw) {
  return raw.replaceAll(RegExp(r"\s+"), " ").trim();
}

bool isValidPersonName(String raw) {
  final name = cleanPersonName(raw);
  if (name.length < 2 || name.length > 40) return false;
  if (RegExp(r"[0-9]").hasMatch(name)) return false;
  return RegExp(r"^[\p{L} ]+$", unicode: true).hasMatch(name);
}
