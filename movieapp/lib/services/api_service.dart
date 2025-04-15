import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/movie.dart';
import '../services/secure_storage.dart';

class ApiService {
  static const String _baseUrl = 'http://group22cop4331c.xyz:5000/api';

  //Login
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
    String login,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password, 'login': " "}),
      );

      final responseData = jsonDecode(response.body);
      if (response.statusCode == 200) {
        if (responseData['error']?.isNotEmpty ?? false) {
          throw Exception(responseData['error']);
        }
        return responseData;
      } else {
        throw Exception(responseData['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  //Register
  static Future<Map<String, dynamic>> register({
  required String email,
  required String password,
  required String firstName,
  required String lastName,
  required String username,
}) async {
  final response = await http.post(
    Uri.parse('$_baseUrl/register'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'regemail': email,
      'regpassword': password,
      'first': firstName,
      'last': lastName,
      'reglogin': username,
    }),
  );

  final data = _handleResponse(response);

  // The response should include: { error: "", login: ..., password: ... }
  if (data is Map<String, dynamic>) {
    return data;
  } else {
    throw Exception('Unexpected response format during registration.');
  }
}


  //Get trending movies
  static Future<List<Movie>> trendingMovie({
    required int page,
    required String token,
  }) async {
    final rawToken = token.replaceFirst('Bearer ', '');
    final response = await http.post(
      Uri.parse('$_baseUrl/trendingMovie'),
      headers: {'Content-Type': 'application/json', 'Authorization': rawToken},
      body: jsonEncode({'page': page}),
    );

    if (response.statusCode == 401) {
      throw Exception('Invalid token - please login again');
    }

    final result = _handleResponse(response);
    return (result['movieData']['results'] as List)
        .map((json) => Movie.fromJson(json))
        .toList();
  }

  // search movies
  static Future<List<Movie>> searchMovie({
    required String query,
    required String token,
    int page = 1,
  }) async {
    final rawToken = token.replaceFirst('Bearer ', '');
    final response = await http.post(
      Uri.parse('$_baseUrl/searchMovie'),
      headers: {'Authorization': rawToken, 'Content-Type': 'application/json'},
      body: jsonEncode({'searchQuery': query, 'page': page}),
    );

    final data = _handleResponse(response);
    final movieList = data['movieData']['results'];
    return (movieList as List).map((item) => Movie.fromJson(item)).toList();
  }

  //verify email
  static Future<String> verifyEmail(String token) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/verifyEmail?token=$token'),
    );

    final data = _handleResponse(response);

    // If the server sends just a plain string, cast to String. Adjust as needed.
    return data is String ? data : data.toString();
  }

  //send email
  static Future<void> sendEmail({
    required String to,
    required String subject,
    required String html,
    required String token,
  }) async {
    final rawToken = token.replaceFirst('Bearer ', '');

    final response = await http.post(
      Uri.parse('$_baseUrl/sendEmail'),
      headers: {'Authorization': rawToken, 'Content-Type': 'application/json'},
      body: jsonEncode({'to': to, 'subject': subject, 'html': html}),
    );

    _handleResponse(response);
  }

  //get full movie info
  static Future<Map<String, dynamic>> getFullMovieInfo({
    required int id,
    required String token,
  }) async {
    final rawToken = token.replaceFirst('Bearer ', '');

    final response = await http.post(
      Uri.parse('$_baseUrl/fullMovieInfo'),
      headers: {'Authorization': rawToken, 'Content-Type': 'application/json'},
      body: jsonEncode({'id': id}),
    );

    final data = _handleResponse(response);
    return data['movieData'];
  }

  //movie credit
  static Future<Map<String, dynamic>> getMovieCredits({
    required int id,
    required String token,
  }) async {
    final rawToken = token.replaceFirst('Bearer ', '');

    final response = await http.post(
      Uri.parse('$_baseUrl/movieCredit'),
      headers: {'Authorization': rawToken, 'Content-Type': 'application/json'},
      body: jsonEncode({'id': id}),
    );

    final data = _handleResponse(response);
    return data['movieData'];
  }

  //delete post
  static Future<String> deletePost({required String postId}) async {
    final response = await http.delete(
      Uri.parse('$_baseUrl/posts/deletepost/$postId'),
      headers: {'Content-Type': 'application/json'},
    );

    final data = _handleResponse(response);
    return data['message'];
  }

  //edit post
  static Future<Map<String, dynamic>> editPost({
    required String postId,
    required int rating,
    required String comment,
  }) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/posts/edit/$postId'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'rating': rating, 'comment': comment}),
    );

    final data = _handleResponse(response);
    return {'message': data['message'], 'post': data['post']};
  }

  //fetch user's posts
  static Future<List<dynamic>> fetchUserPosts({required String userId}) async {
    final response = await http.get(Uri.parse('$_baseUrl/posts/user/$userId'));

    final data = _handleResponse(response);

    if (data is List) {
      return data;
    } else {
      throw Exception('Unexpected response format for user posts');
    }
  }

  //handle tokens for each route
  static Future<Map<String, dynamic>> getProtectedData() async {
    final token = await SecureStorage.getToken();
    final rawToken = token?.replaceFirst('Bearer ', '');
    final response = await http.get(
      Uri.parse('$_baseUrl/protected-route'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '$rawToken',
      },
    );

    return _handleResponse(response);
  }

  //handle API responses
  static dynamic _handleResponse(http.Response response) {
    switch (response.statusCode) {
      case 200:
        return jsonDecode(response.body);
      case 401:
        throw Exception('Unauthorized: ${response.body} ');
      default:
        throw Exception('Error: ${response.body}');
    }
  }
}
