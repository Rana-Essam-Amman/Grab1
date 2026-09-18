import "dart:convert";
import "dart:io";
import "package:flutter/material.dart";
import "../../api/api_base.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";

class ConfirmScreen extends StatefulWidget {
  const ConfirmScreen({super.key, this.mode = "register"});
  final String mode;

  @override
  State<ConfirmScreen> createState() => _ConfirmScreenState();
}

class _ConfirmScreenState extends State<ConfirmScreen> {
  String? error;
  bool checking = false;

  Future<void> checkStatus() async {
    final scope = AppScopeProvider.of(context);
    setState(() { checking = true; error = null; });
    try {
      final client = HttpClient();
      final req = await client.getUrl(Uri.parse("$apiBase/api/status?email=${Uri.encodeQueryComponent(scope.email)}"));
      final res = await req.close();
      final raw = await res.transform(utf8.decoder).join();
      client.close();
      final data = raw.isEmpty ? <String, dynamic>{} : jsonDecode(raw) as Map<String, dynamic>;
      if (data["confirmed"] == true) {
        if (data["country"] is String) {
          scope.accountCountryCode = data["country"] as String;
        }
        final token = data["sessionToken"] as String?;
        if (token != null && token.isNotEmpty) scope.sessionToken = token;
        scope.markConfirmed();
        if (mounted) Navigator.of(context).popUntil((route) => route.isFirst);
        return;
      }
      setState(() => error = scope.isArabic
          ? "لسا ما انفتح رابط الإيميل. افتح الرسالة وبعدين اضغط تحقق."
          : "The email link is not confirmed yet. Open it, then check again.");
    } catch (_) {
      setState(() => error = scope.isArabic ? "ما قدرنا نتحقق هلق." : "Could not check confirmation yet.");
    }
    if (mounted) setState(() => checking = false);
  }

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final login = widget.mode == "login";
    return Scaffold(
      backgroundColor: CatchTokens.bg,
      appBar: AppBar(backgroundColor: CatchTokens.bg, elevation: 0, foregroundColor: CatchTokens.dark),
      body: Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(login ? (ar ? "دخول من الإيميل" : "Sign in from email") : (ar ? "افتح إيميلك" : "Check your email"),
                style: const TextStyle(fontFamily: "Georgia", fontSize: 28, color: CatchTokens.dark)),
            const SizedBox(height: 10),
            Text(
              ar
                  ? "بعثنا رابط على ${scope.email}. الحساب ما بيتفعل إلا لما تفتح الرابط. ما في زر غش هون."
                  : "We sent a link to ${scope.email}. The account activates only after that link is opened.",
              style: const TextStyle(color: CatchTokens.muted, height: 1.45),
            ),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(50)),
              onPressed: checking ? null : checkStatus,
              child: Text(ar ? "تحقق من التأكيد" : "Check confirmation"),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(ar ? "إعادة إرسال الرابط" : "Resend link"),
            ),
            if (error != null) ...[
              const SizedBox(height: 12),
              Text(error!, style: const TextStyle(color: Color(0xFF8B3A2A))),
            ],
          ],
        ),
      ),
    );
  }
}
