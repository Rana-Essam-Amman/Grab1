import "package:flutter/material.dart";
import "../../state/app_scope.dart";
import "../../state/conversation_store.dart";
import "../../theme/tokens.dart";
import "thread_screen.dart";

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    final threads = ConversationStore.instance.threads;
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0, title: Text(ar ? "الرسائل" : "Messages")),
        body: threads.isEmpty
            ? Center(child: Text(ar ? "ما في محادثات بعد. تواصل من صفحة الإعلان." : "No conversations yet. Contact a seller from a listing.", textAlign: TextAlign.center, style: const TextStyle(color: CatchTokens.muted)))
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: threads.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (_, i) {
                  final t = threads[i];
                  return ListTile(
                    onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => ThreadScreen(thread: t))),
                    tileColor: CatchTokens.card,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: CatchTokens.border)),
                    leading: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.asset(t.imageUrl, width: 48, height: 48, fit: BoxFit.cover),
                    ),
                    title: Text(t.title, maxLines: 1, overflow: TextOverflow.ellipsis),
                    subtitle: Text(
                      t.messages.isEmpty ? (ar ? "بدون رسائل بعد" : "No messages yet") : t.messages.last.text,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  );
                },
              ),
      ),
    );
  }
}
