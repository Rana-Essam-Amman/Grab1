class ListingComment {
  const ListingComment({required this.name, required this.text});
  final String name;
  final String text;
}

class CommentStore {
  CommentStore._();
  static final CommentStore instance = CommentStore._();
  final Map<String, List<ListingComment>> _byListing = {};

  List<ListingComment> forListing(String id) => _byListing[id] ?? const [];

  void add(String listingId, ListingComment comment) {
    _byListing.putIfAbsent(listingId, () => []);
    _byListing[listingId]!.add(comment);
  }
}
