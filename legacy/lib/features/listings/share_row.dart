import "package:flutter/material.dart";
import "../../theme/tokens.dart";

class ShareRow extends StatelessWidget {
  const ShareRow({super.key, required this.listingId, required this.arabic});
  final String listingId;
  final bool arabic;

  @override
  Widget build(BuildContext context) {
    final items = [
      _ShareItem("واتساب", const Color(0xFF25D366), Icons.chat),
      _ShareItem("فيسبوك", const Color(0xFF1877F2), Icons.facebook),
      _ShareItem("تلغرام", const Color(0xFF2AABEE), Icons.send),
      _ShareItem("إنستغرام", const Color(0xFFE1306C), Icons.camera_alt),
      _ShareItem("ماسنجر", const Color(0xFF00B2FF), Icons.messenger_outline),
      _ShareItem("X", const Color(0xFF111111), Icons.close),
      _ShareItem(arabic ? "رسالة" : "SMS", const Color(0xFF8B654D), Icons.sms),
      _ShareItem(arabic ? "نسخ" : "Copy", CatchTokens.accent, Icons.link),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(arabic ? "شارك الإعلان" : "Share", style: const TextStyle(fontWeight: FontWeight.w700)),
        const SizedBox(height: 10),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final item in items)
                Padding(
                  padding: const EdgeInsetsDirectional.only(end: 10),
                  child: GestureDetector(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("${item.label} · $listingId")));
                    },
                    child: Column(
                      children: [
                        CircleAvatar(radius: 22, backgroundColor: item.color, child: Icon(item.icon, color: Colors.white, size: 20)),
                        const SizedBox(height: 4),
                        Text(item.label, style: const TextStyle(fontSize: 10, color: CatchTokens.muted)),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ShareItem {
  const _ShareItem(this.label, this.color, this.icon);
  final String label;
  final Color color;
  final IconData icon;
}
