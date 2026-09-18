import "package:flutter/material.dart";
import "../../theme/tokens.dart";

void showListingShareSheet(BuildContext context, {required String listingId, required bool arabic}) {
  final items = [
    (Icons.chat, "WhatsApp"),
    (Icons.facebook, "Facebook"),
    (Icons.telegram, "Telegram"),
    (Icons.camera_alt_outlined, "Instagram"),
    (Icons.send_outlined, "Messenger"),
    (Icons.close, "X"),
    (Icons.sms_outlined, arabic ? "رسالة" : "SMS"),
    (Icons.copy, arabic ? "نسخ الرابط" : "Copy link"),
  ];
  showModalBottomSheet<void>(
    context: context,
    backgroundColor: CatchTokens.bg,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
    builder: (_) {
      return Padding(
        padding: const EdgeInsets.fromLTRB(18, 16, 18, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(arabic ? "مشاركة الإعلان" : "Share listing", style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
            const SizedBox(height: 16),
            Wrap(
              spacing: 14,
              runSpacing: 16,
              children: [
                for (final item in items)
                  GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text(arabic ? "${item.$2} · رقم الإعلان $listingId" : "${item.$2} · $listingId"),
                      ));
                    },
                    child: SizedBox(
                      width: 72,
                      child: Column(
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: CatchTokens.card,
                              border: Border.all(color: CatchTokens.border),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(item.$1, color: CatchTokens.accent),
                          ),
                          const SizedBox(height: 6),
                          Text(item.$2, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      );
    },
  );
}
