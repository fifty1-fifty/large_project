import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/movie.dart';
import '../services/secure_storage.dart';

class ApiService {
  static const String _baseUrl = 'http://group22cop4331c.xyz:5000/api';

  //Login
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = _handleResponse(response);

    // Extra check in case backend returns an invalid id (e.g. -1)
    if (data['id'] == -1) {
      throw Exception('Invalid email or password');
    }

    return {
      'id': data['id'],
      'firstName': data['firstName'],
      'lastName': data['lastName'],
      'token': data['token'],
      'verified': data['verified'],
    };
  }

  //Register
  static Future<Map<String, dynamic>> register({
  required String email,
  required String password,
  required String firstName,
  required String lastName,
  required String username,
}) async {
  // Step 1: register user
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

  if (data is Map<String, dynamic> && data['error'] == "") {
    // Step 2: send verification email
    await sendEmail(to: email);
  }

  return data;
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

  //send email
  static Future<void> sendEmail({ required String to }) async {
  final response = await http.post(
    Uri.parse('$_baseUrl/sendEmail'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'to': to}),
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
      throw Exception(
        'Unexpected response format for user posts, not a list of posts',
      );
    }
  }

  // Get friend posts for feed
  static Future<List<PostCard>> fetchFriendsPosts(int userId) async {
    final url = Uri.parse('$_baseUrl/api/friends-posts/$userId');
    final response = await http.get(url);
    final data = _handleResponse(response);

    return (data as List)
        .map((postJson) => PostCard.fromJson(postJson))
        .toList();
  }

  //get a specific user's posts
  // Fetch posts for a specific user by userId
  static Future<List<dynamic>> getUserPosts({required String userId}) async {
    final url = Uri.parse('$_baseUrl/posts/user/$userId');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data;
    } else {
      throw Exception('Failed to load user posts: ${response.reasonPhrase}');
    }
  }

  //request password reset
  static Future<void> requestPasswordReset(String email) async {
    final url = Uri.parse('$_baseUrl/api/requestReset');
    final headers = {'Content-Type': 'application/json'};

    final body = jsonEncode({'email': email});

    try {
      final response = await http.post(url, headers: headers, body: body);

      final result = _handleResponse(response);

      return result['message'];
    } catch (error) {
      throw Exception("Error during password reset request: $error");
    }
  }

  // Method to add a movie to the user's collection
  static Future<Map<String, dynamic>> addMovieToProfile({
    required int userId,
    required String movieId,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/addmovietoprofile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'userid': userId,
        'movieid': movieId,
      }),
    );

    // Handle the response
    final data = _handleResponse(response);

    return data;
  }

  // Reset Password
  static Future<String> resetPassword(String token, String newPassword) async {
    final url = Uri.parse('$_baseUrl/api/resetPassword');
    final headers = {'Content-Type': 'application/json'};

    final body = jsonEncode({'token': token, 'newPassword': newPassword});

    try {
      final response = await http.post(url, headers: headers, body: body);

      final result = _handleResponse(response);

      return result['message'];
    } catch (error) {
      throw Exception('Error during password reset: $error');
    }
  }

  //fetch user data
  static Future<Map<String, dynamic>> fetchUserProfile({
    required int userId,
  }) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/profile/$userId'),
      headers: {'Content-Type': 'application/json'},
    );

    final data = _handleResponse(response);

    return {
      'firstName': data['firstName'],
      'lastName': data['lastName'],
      'email': data['email'],
      'profilePic': data['profilePic'],
      'bio': data['bio'],
      'followers': List<String>.from(data['followers'] ?? []),
      'following': List<String>.from(data['following'] ?? []),
    };
  }

  //edit user profile
  static Future<Map<String, dynamic>> updateUserProfile({
    required int userId,
    required Map<String, dynamic> updateData,
  }) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/profile/$userId/edit'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(updateData),
    );

    final data = _handleResponse(response);

    return {
      'message': data['message'],
      'firstName': data['user']['firstName'],
      'lastName': data['user']['lastName'],
      'email': data['user']['Email'],
      'bio': data['user']['bio'],
      'profilePic': data['user']['profilePic'],
      'password': data['user']['password'],
    };
  }

  /// Follow a user
  static Future<String> followUser({
    required int userId,
    required int targetId,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/profile/$userId/follow/$targetId'),
      headers: {'Content-Type': 'application/json'},
    );

    final data = _handleResponse(response);
    return data['message'];
  }

  /// Unfollow a user
  static Future<String> unfollowUser({
    required int userId,
    required int targetId,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/profile/$userId/unfollow/$targetId'),
      headers: {'Content-Type': 'application/json'},
    );

    final data = _handleResponse(response);
    return data['message'];
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

//define what postcards are
class PostCard {
  final int movieId;
  final int userId;
  final String username; // optional for user-specific posts
  final double rating;
  final String comment;

  PostCard({
    required this.movieId,
    required this.userId,
    required this.rating,
    required this.comment,
    this.username = 'Unknown', // default if not provided
  });

  factory PostCard.fromJson(Map<String, dynamic> json) {
    return PostCard(
      movieId: json['movieId'] ?? json['MovieId'],
      userId: json['userId'] ?? json['UserId'],
      username: json['username'] ?? 'Unknown', // fallback if not present
      rating: (json['rating'] ?? json['Rating']).toDouble(),
      comment: json['comment'] ?? json['Comment'] ?? '',
    );
  }
}
