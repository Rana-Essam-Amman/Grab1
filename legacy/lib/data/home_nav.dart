import "package:flutter/material.dart";
import "../theme/tokens.dart";

/// Frozen Home tab look. Change only this file if the owner asks.
class HomeNavSpec {
  static const barHeight = 88.0;
  static const iconSize = 28.0;
  static const postSize = 62.0;
  static const labelSize = 11.0;
  static const active = CatchTokens.accent;
  static const idle = CatchTokens.muted;
  static const postFill = CatchTokens.accent;
  static const postIcon = Colors.white;

  static const exploreIcon = Icons.home_outlined;
  static const categoriesIcon = Icons.grid_view_outlined;
  static const postIconData = Icons.add;
  static const messagesIcon = Icons.chat_bubble_outline;
  static const myAdsIcon = Icons.person_outline;
}
