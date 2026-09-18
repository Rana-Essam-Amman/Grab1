import "listing_store.dart";

class ChatMessage {
  const ChatMessage({required this.text, required this.fromBuyer});
  final String text;
  final bool fromBuyer;
}

class Conversation {
  Conversation({
    required this.id,
    required this.listingId,
    required this.title,
    required this.imageUrl,
  });
  final String id;
  final String listingId;
  final String title;
  final String imageUrl;
  final List<ChatMessage> messages = [];
}

class ConversationStore {
  ConversationStore._();
  static final ConversationStore instance = ConversationStore._();
  final List<Conversation> threads = [];

  Conversation openFor(Listing listing) {
    final found = threads.where((t) => t.listingId == listing.id);
    if (found.isNotEmpty) return found.first;
    final thread = Conversation(
      id: "c-${listing.id}",
      listingId: listing.id,
      title: listing.title,
      imageUrl: listing.imageUrl,
    );
    threads.insert(0, thread);
    return thread;
  }
}
