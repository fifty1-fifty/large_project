import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/secure_storage.dart';

class ProfileScreen extends StatefulWidget {
  // You can pass the userId as an argument or fetch it from secure storage.
  // Here, we're assuming it comes as an argument.
  final int userId;

  const ProfileScreen({super.key, required this.userId});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _profileData;
  List<dynamic>? _reviews;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadProfileAndReviews();
  }

  Future<void> _loadProfileAndReviews() async {
    try {
      // Fetch the profile data from the API
      final profile = await ApiService.fetchUserProfile(userId: widget.userId);
      // Fetch the user's reviews/posts
      // Note: fetchUserPosts expects a String, so convert widget.userId accordingly.
      final reviews = await ApiService.fetchUserPosts(
        userId: widget.userId.toString(),
      );

      setState(() {
        _profileData = profile;
        _reviews = reviews;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  // Helper method to build profile header
  Widget _buildProfileHeader() {
    return Column(
      children: [
        // Profile picture
        CircleAvatar(
          radius: 50,
          backgroundImage:
              _profileData!['profilePic'] != null &&
                      _profileData!['profilePic'].isNotEmpty
                  ? NetworkImage(_profileData!['profilePic'])
                  : const AssetImage('assets/images/default_profile.png')
                      as ImageProvider,
        ),
        const SizedBox(height: 12),
        // Full name
        Text(
          '${_profileData!['firstName']} ${_profileData!['lastName']}',
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        // Email
        Text(
          _profileData!['email'],
          style: TextStyle(fontSize: 14, color: Colors.grey[400]),
        ),
        const SizedBox(height: 12),
        // Bio
        if (_profileData!['bio'] != null && _profileData!['bio'].isNotEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              _profileData!['bio'],
              style: const TextStyle(fontSize: 14, color: Colors.white70),
              textAlign: TextAlign.center,
            ),
          ),
        const SizedBox(height: 16),
        // Followers and Following counts
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildStatColumn(
              "Followers",
              (_profileData!['followers'] as List).length,
            ),
            const SizedBox(width: 24),
            _buildStatColumn(
              "Following",
              (_profileData!['following'] as List).length,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatColumn(String label, int count) {
    return Column(
      children: [
        Text(
          '$count',
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 14, color: Colors.grey)),
      ],
    );
  }

  // Helper widget to build each review card
  Widget _buildReviewCard(Map<String, dynamic> review) {
    // Assuming each review has at least 'rating' and 'comment'
    return Card(
      color: Colors.grey[900],
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // You can add more information here, e.g. the movie title if provided in review.
            Text(
              "Rating: ${review['rating']}",
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              review['comment'] ?? "No comment provided.",
              style: const TextStyle(color: Colors.white70),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        centerTitle: true,
        title: const Text("Profile"),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // TODO: Add functionality to edit the profile
            },
          ),
        ],
      ),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _errorMessage != null
              ? Center(
                child: Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.redAccent),
                ),
              )
              : RefreshIndicator(
                onRefresh: _loadProfileAndReviews,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 20),
                      _buildProfileHeader(),
                      const SizedBox(height: 30),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          'Reviews',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      _reviews == null || _reviews!.isEmpty
                          ? const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 16.0),
                            child: Text(
                              'No reviews yet.',
                              style: TextStyle(color: Colors.white70),
                              textAlign: TextAlign.center,
                            ),
                          )
                          : ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _reviews!.length,
                            itemBuilder:
                                (context, index) =>
                                    _buildReviewCard(_reviews![index]),
                          ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
    );
  }
}
