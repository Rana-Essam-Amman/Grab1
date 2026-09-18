import "package:flutter/material.dart";

class AppImage extends StatelessWidget {
  const AppImage(this.src, {super.key, this.fit = BoxFit.cover, this.width, this.height});
  final String src;
  final BoxFit fit;
  final double? width;
  final double? height;

  @override
  Widget build(BuildContext context) {
    if (src.startsWith("assets/")) {
      return Image.asset(src, fit: fit, width: width, height: height);
    }
    return Image.network(src, fit: fit, width: width, height: height);
  }
}
