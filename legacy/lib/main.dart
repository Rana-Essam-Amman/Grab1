import "package:flutter/material.dart";
import "app.dart";
import "state/app_scope.dart";

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final scope = AppScope();
  await scope.restore();
  runApp(CatchTheDealsApp(scope: scope));
}
