import "package:flutter/material.dart";
import "../../state/app_scope.dart";
import "../../state/conversation_store.dart";
import "../../theme/tokens.dart";

class ThreadScreen extends StatefulWidget {
  const ThreadScreen({super.key, required this.thread});
  final Conversation thread;

  @override
  State<ThreadScreen> createState() => _ThreadScreenState();
}

class _ThreadScreenState extends State<ThreadScreen> {
  final input = TextEditingController();

  @override
  void dispose() {
    input.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          foregroundColor: CatchTokens.dark,
          elevation: 0,
          title: Text(widget.thread.title, maxLines: 1, overflow: TextOverflow.ellipsis),
        ),
        body: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (widget.thread.messages.isEmpty)
                    Text(ar ? "اكتب للبائع من هون." : "Write the seller here.", style: const TextStyle(color: CatchTokens.muted)),
                  for (final m in widget.thread.messages)
                    Align(
                      alignment: m.fromBuyer ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: m.fromBuyer ? CatchTokens.accent : CatchTokens.card,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: CatchTokens.border),
                        ),
                        child: Text(m.text, style: TextStyle(color: m.fromBuyer ? Colors.white : CatchTokens.dark)),
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: input,
                      decoration: InputDecoration(
                        hintText: ar ? "اكتب رسالة" : "Write a message",
                        filled: true,
                        fillColor: CatchTokens.card,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(18), borderSide: const BorderSide(color: CatchTokens.border)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    style: IconButton.styleFrom(backgroundColor: CatchTokens.accent),
                    onPressed: () {
                      final text = input.text.trim();
                      if (text.isEmpty) return;
                      setState(() {
                        widget.thread.messages.add(ChatMessage(text: text, fromBuyer: true));
                        input.clear();
                      });
                    },
                    icon: const Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
