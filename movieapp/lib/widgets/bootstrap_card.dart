// lib/widgets/bootstrap_card.dart
import 'package:flutter/material.dart';

class BootstrapCard extends StatelessWidget {
  final Widget child;
  final double? width;

  const BootstrapCard({
    super.key,
    required this.child,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? 288, // 18rem = 288px
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: child,
      ),
    );
  }
}