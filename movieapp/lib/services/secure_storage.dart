import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const _storage = FlutterSecureStorage();

  static Future<void> saveToken(String token) async {
    await _storage.write(
      key: 'auth_token',
      value: token,
      aOptions: _getAndroidOptions(),
    );
  }

  static AndroidOptions _getAndroidOptions() =>
      const AndroidOptions(encryptedSharedPreferences: true);

  static Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  static Future<void> deleteToken() async {
    await _storage.delete(key: 'auth_token');
  }

  static Future<void> saveUserId(int id) async {
    await _storage.write(
      key: 'userId',
      value: id.toString(),
      aOptions: _getAndroidOptions(),
    );
  }

  static Future<int?> getUserId() async {
    final s = await _storage.read(key: 'userId');
    return s == null ? null : int.tryParse(s);
  }
}
