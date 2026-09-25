/// Registry for future AI subscriptions.
/// Add an agent here. Screens keep calling `Agents.listingCopy`.
class AgentIds {
  static const listingCopy = "listing-copy";
  static const categoryMatch = "category-match";
  static const search = "search";
  static const voice = "voice";
}

class AgentConfig {
  const AgentConfig({this.provider = "local"});
  final String provider;
}

class Agents {
  static AgentConfig listingCopy = const AgentConfig();
  static AgentConfig categoryMatch = const AgentConfig();
  static AgentConfig search = const AgentConfig();
  static AgentConfig voice = const AgentConfig();
}
