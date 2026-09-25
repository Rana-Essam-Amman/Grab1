import "dart:convert";
import "dart:io";

class SessionStore {
  SessionStore._();
  static final SessionStore instance = SessionStore._();

  File get _file {
    final home = Platform.environment["HOME"] ?? Directory.systemTemp.path;
    return File("$home/.catch-the-deals-session.json");
  }

  Future<Map<String, dynamic>?> read() async {
    try {
      if (!await _file.exists()) return null;
      return jsonDecode(await _file.readAsString()) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> write(Map<String, dynamic> data) async {
    await _file.writeAsString(jsonEncode(data));
  }

  Future<void> clear() async {
    if (await _file.exists()) await _file.delete();
  }

  Future<bool> verifyRemote(String token) async {
    try {
      final client = HttpClient();
      final req = await client.getUrl(Uri.parse("https://project-1-preview-rana-essam-amman.vercel.app/api/session"));
      req.headers.set("Authorization", "Bearer $token");
      final res = await req.close();
      await res.drain();
      client.close();
      return res.statusCode == 200;
    } catch (_) {
      return true;
    }
  }

  Future<void> logoutRemote(String token) async {
    try {
      final client = HttpClient();
      final req = await client.openUrl("DELETE", Uri.parse("https://project-1-preview-rana-essam-amman.vercel.app/api/session"));
      req.headers.set("Authorization", "Bearer $token");
      final res = await req.close();
      await res.drain();
      client.close();
    } catch (_) {}
    await clear();
  }
}
