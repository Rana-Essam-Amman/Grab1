import "package:flutter/material.dart";
import "../../theme/tokens.dart";

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CatchTokens.bg,
      appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(18, 8, 18, 40),
        children: const [
          Text("Terms of Use", style: TextStyle(fontFamily: "Georgia", fontSize: 28, color: CatchTokens.dark)),
          SizedBox(height: 8),
          Text("Catch the deals · Last updated: 10 September 2026", style: TextStyle(color: CatchTokens.muted, fontSize: 12)),
          SizedBox(height: 16),
          Text("Catch the deals is a classifieds platform. Users publish listings and contact each other. The sale, payment, delivery, inspection, and any agreement happen outside the application, between buyer and seller only.", style: TextStyle(height: 1.45)),
          SizedBox(height: 14),
          Text("1. Nature of the service", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("The operator provides hosting, discovery, and messaging tools. It is not a party to any deal, not an escrow agent, not a payment provider, and not a guarantor of any listing or user."),
          SizedBox(height: 12),
          Text("2. Eligibility", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("You must be at least 18. You are responsible for the accuracy of your name, email, phone, country, and photo."),
          SizedBox(height: 12),
          Text("3. Account country", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("The country chosen at registration is your listing country. Browse country may change. Publishing uses the account country."),
          SizedBox(height: 12),
          Text("4. Prohibited content", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("No stolen goods, weapons, drugs, counterfeit items, fraud, hate, or illegal content in Jordan, Lebanon, Palestine, or Syria. We may remove content or accounts."),
          SizedBox(height: 12),
          Text("5. Contact details", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("Seller phone is shown only to registered users. Catch the deals is not responsible for calls, chats, or meetings."),
          SizedBox(height: 12),
          Text("6. Offline deals", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("We do not inspect items, hold money, or complete delivery. You accept the risk of the offline transaction."),
          SizedBox(height: 12),
          Text("7. Liability", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("To the maximum extent permitted by law, the operator is not liable for user fraud, offline harm, or lost deals. If liability cannot be excluded, it is limited to fees paid in the previous 3 months or USD 20."),
          SizedBox(height: 12),
          Text("8. Law", style: TextStyle(fontWeight: FontWeight.w700)),
          Text("Governed by the laws of the Hashemite Kingdom of Jordan. Courts of Amman have non-exclusive jurisdiction, without limiting mandatory consumer rights."),
          SizedBox(height: 16),
          Text("This document does not replace advice from a licensed lawyer in each country.", style: TextStyle(color: CatchTokens.muted, fontSize: 12)),
        ],
      ),
    );
  }
}
