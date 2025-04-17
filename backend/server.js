const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const axios = require('axios');



require('dotenv').config();

const app = express();
const PORT = 5000;

const SECRET_KEY = process.env.JWT_KEY;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// MongoDB Connection
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

//var api = require('./api.js');
//api.setApp(app,client);



// Middleware (Apply Before Routes)
app.use(cors());  // Allow Cross-Origin requests
app.use(bodyParser.json());
app.use(express.json());



// Set CORS Headers (You can remove this if CORS middleware works)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});



// Connect to MongoDB & Start Server
client.connect().then(() => {
    console.log("Connected to MongoDB");

    // Use 'Table' database
    const db = client.db('Table');


        app.post('/api/searchMovie', verifyToken, async (req, res) => {
    const { searchQuery, page } = req.body;

        try {
            const key = process.env.API_KEY;

            const movieResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
                params: {
                    api_key: key,
                    query: searchQuery,
                    page: page
                },
            });

            res.json({
                movieData: movieResponse.data, // Use the correct response variable
            });
        }
        catch (error) {
            console.error('Error fetching movie data:', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to fetch movie data' });
        }
    });


    app.post('/api/trendingMovie', verifyToken, async (req, res) => {
        const { page } = req.body;

        try {
            const key = process.env.API_KEY;

            const movieResponse = await axios.get('https://api.themoviedb.org/3/trending/movie/day', {
                params: {
                    api_key: key,
                    page: page
                },
            });

            res.json({
                movieData: movieResponse.data, // Use the correct response variable

            });
        }
        catch (error) {
            console.error('Error fetching movie data:', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to fetch movie data' });
        }
    });

    app.post('/api/fullMovieInfo', verifyToken, async (req, res) => {
    const { id } = req.body;

        try {
            const key = process.env.API_KEY;

            const movieResponse = await axios.get('https://api.themoviedb.org/3/movie/' + id, {
                params: {
                    api_key: key
                },
            });

            res.json({
                movieData: movieResponse.data, // Use the correct response variable

            });
        }
        catch (error) {
            console.error('Error fetching movie data:', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to fetch movie data' });
        }
    });

    app.post('/api/movieCredit', verifyToken, async (req, res) => {
        const { id } = req.body;

        try {
            const key = process.env.API_KEY;

            const movieResponse = await axios.get('https://api.themoviedb.org/3/movie/' + id + "/credits", {
                params: {
                    api_key: key
                },
            });



            res.json({
                movieData: movieResponse.data, // Use the correct response variable

            });
        }
        catch (error) {
            console.error('Error fetching movie data:', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to fetch movie data' });
        }
    });







    // Validate email
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };







    // Send verification email
   app.post('/api/sendEmail', async (req, res) => {
        const { to } = req.body;

        // Validate email
        if (!validateEmail(to)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        try {
            // Generate a verification token valid for 1 hour
            const token = jwt.sign({ email: to }, SECRET_KEY, { expiresIn: '1h' });

            // Construct verification URL
            const verificationLink = `http://group22cop4331c.xyz/api/verifyEmail?token=${token}`;

            // Email message with clickable link
            const htmlMessage = `
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p>This link will expire in 1 hour.</p>
            `;

            // Send the email
            const response = await axios.post(
                'https://api.sendgrid.com/v3/mail/send',
                {
                    personalizations: [
                        {
                            to: [{ email: to }],
                            subject: 'Verify your email address',
                        },
                    ],
                    from: { email: process.env.SENDER_EMAIL },
                    content: [
                        {
                            type: 'text/html',
                            value: htmlMessage,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.EMAIL_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            res.status(200).json({ message: 'Verification email sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to send email' });
        }
    });



    app.get('/api/verifyEmail', async (req, res) => {
        const { token } = req.query;

        console.log(token);

        if (!token) {
            return res.status(400).send("No token provided");
        }

        try {
            // Verify and decode the JWT
            const decoded = jwt.verify(token, SECRET_KEY);
            const userEmail = decoded.email;
            console.log(userEmail);

            // Attempt to update the user's Verified field in the database
            const result = await db.collection('Users').updateOne(
                { Email: userEmail },
                { $set: { Verified: true } }
            );

            console.log("Update result:", result);

            if (result.modifiedCount === 1) {
                res.send("Your email has been successfully verified!");
            } else {
                res.status(404).send("User not found or already verified.");
            }
        } catch (err) {
            console.error("Token verification failed:", err.message);
            res.status(400).send("Invalid or expired verification link.");
        }
    });






    // Request password reset
    app.post('/api/requestReset', async (req, res) => {
        const { email } = req.body;

        // Verify the email exists
        const user = await findUser(email);
        console.log(email);
        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // Generate token
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

        // Link to password reset page
        const resetLink = `http://group22cop4331c.xyz/reset-password?token=${token}`;

        // Send email with reset link
        await sendEmail({
            to: email,
            subject: 'Password Reset',
            html: `<p>Click the link to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>`,
        });

        res.json({ message: 'Password reset link sent!' });
    });




    // Reset Password
    app.post('/api/resetPassword', async (req, res) => {
        const { token, newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            const email = decoded.email;

            // Update the password in the DB
            await updatePassword(email, newPassword);

            res.json({ message: "Password has been reset successfully!" });
        } catch (err) {
            res.status(400).json({ error: "Invalid or expired token." });
        }
    });




    async function findUser(email) {
        const usersCollection = db.collection('Users');
        return await usersCollection.findOne({ Email: email });
    }

    async function updatePassword(email, newPassword) {
        const usersCollection = db.collection('Users');

        // Update the password
        await usersCollection.updateOne(
            { Email: email },
            { $set: { Password: newPassword } }
        );
    }





    async function sendEmail({ to, subject, html }) {
        try {
            await axios.post(
                'https://api.sendgrid.com/v3/mail/send',
                {
                    personalizations: [{ to: [{ email: to }], subject }],
                    from: { email: process.env.SENDER_EMAIL },
                    content: [{ type: 'text/html', value: html }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.EMAIL_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (err) {
            console.error('Email sending failed:', err.response?.data || err.message);
            throw err;
        }
    }




    //real-time search users
    app.get('/api/search-users', async (req, res) => {
        const loginQuery = req.query.Login;

        if(!loginQuery) {
            return res.status(400).json( { message: "Missing 'login' query parameter" });
        }

        try {
            const usersCollection = db.collection('Users');

            // case-insensitive partial match on Login
            const regex = new RegExp(loginQuery, "i");
            const users = await usersCollection
                .find({ Login: { $regex: regex } })
                .limit(10)
                .project({ UserId: 1, Login: 1, _id: 0 })
                .toArray();

            res.json(users);
        } catch (err) {
            console.error("Search error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });




        async function sendVerificationEmail(to, subject, message) {
        if (!to || !subject || !message) {
            console.error("Missing required email fields.");
            return;
        }

         // Generate a verification token valid for 1 hour
         const token = jwt.sign({ email: to }, SECRET_KEY, { expiresIn: '1h' });

         // Construct verification URL
         const verificationLink = `http://group22cop4331c.xyz/api/verifyEmail?token=${token}`;

         const htmlMessage = `
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">${verificationLink}</a>
                <p>This link will expire in 1 hour.</p>
            `;

        try {
            const response = await axios.post(
                'https://api.sendgrid.com/v3/mail/send',
                {
                    personalizations: [
                        {
                            to: [{ email: to }],
                            subject: subject,
                        },
                    ],
                    from: { email: process.env.SENDER_EMAIL },
                    content: [
                        {
                            type: 'text/html',
                            value: htmlMessage,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.EMAIL_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(`Verification email sent to ${to}`);
        } catch (error) {
            console.error('Error sending verification email:', error.response?.data || error.message);
        }
    }


    function generateToken(user)
    {
        return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    }


    function verifyToken(req, res, next)
    {
        // console.log(req.header('authorization'));
        const token = req.header('authorization')
        console.log(token);

        if (!token)
        {
            console.log("no token?");
            return res.status(401).json({ message: 'Access Denied: No Token Provided' });
        }


        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
            console.log(decoded);
            next();
        } catch (err) {
            res.status(403).json({ message: 'Invalid Token' });
        }
    }


    //  POST /api/login (Fixed MongoDB Query)
    app.post('/api/login', async (req, res) => {
        const {  password, email } = req.body;

        try {
            const results = await db.collection('Users').findOne({ Password: password, Email: email });
                        const token = generateToken(email);

            if (results) {
                res.status(200).json({
                    id: results.UserId,
                    firstName: results.FirstName,
                    lastName: results.LastName,
                                        token: token,
                    verified: results.Verified,
                    error: ""
                });
            }
                        else
                        {
                //res.status(401).json({ error: "Invalid credentials" });
                                res.json( { id:-1 });
                                res.status(401).json({ error: e.toString() });
            }
        }

                catch (e)
                {
            res.json( { id:-1 })
            res.status(401).json({ error: e.toString() });
        }
    });



    //  POST /api/register
app.post('/api/register', async (req, res) => {
    const { first, last, reglogin, regpassword, regemail } = req.body;

    try {
        const existingUser = await db.collection('Users').findOne({ Email: regemail });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        const existingUsername = await db.collection('Users').findOne({ Login: reglogin });
        if (existingUsername) {
            return res.status(409).json({ error: 'Username already taken.' });
        }

        const id = (await db.collection('Users').countDocuments()) + 1;

        await db.collection('Users').insertOne({
            FirstName: first,
            Last: last,
            Email: regemail,
            Login: reglogin,
            Password: regpassword,
            UserId: id,
            Verified: false,
            Following: [],
            Followers: [],
            ProfilePic: "",
            Bio: ""
        });

        //  Send verification email with subject + message
        const subject = 'Please verify your email address';
        const message = `Hi ${reglogin}, please verify your email to activate your account.`;
        await sendVerificationEmail(regemail, subject, message);

        res.status(200).json({
            error: "",
            login: reglogin,
            password: regpassword
        });

    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({ error: e.toString() });
    }
});




    // Fetch user data
    app.get('/api/profile/:id', async (req, res) => {
        try {
            const userId  = parseInt(req.params.id);
            const user = await db.collection('Users').findOne({ UserId: userId});

            if (!user)
            {
                return res.status(404).json({error: "No user found" });
            }

            res.json({
                firstName: user.FirstName,
                lastName: user.LastName,
                email: user.Email,
                profilePic: user.ProfilePic || 'default.png',
                bio: user.Bio || '',
                followers: user.Followers || [],
                following: user.Following || []
            })
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });


        app.post('/api/addmovietoprofile', async (req, res) =>
        {
                const { userid, movieid} = req.body;

                try {
                        const result = await db.collection('Users').findOneAndUpdate(
                        { UserId: userid }, // find user by UserId
                        { $addToSet: { Collection: movieid } }, // add movieid to Collection array
                        { returnDocument: 'after', upsert: true } // returns updated doc, creates if missing
                        );

                        if (result) {
                                res.status(200).json({
                                message: 'Movie added to collection',
                                updatedCollection: result.value.Collection
                        });
                        } else {
                                res.status(404).json({ error: 'User not found' });
                        }
                } catch (error) {
                        res.status(500).json({ error: error.toString() });
                }
        });

    // Retrieve movie collection array for user
        app.get('/api/users/:userId/collection', async (req, res) => {
        const userId = parseInt(req.params.userId);

        try {
          const user = await db.collection('Users').findOne({ UserId: userId });

          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Return the collection, or an empty array if not present
          res.json({ collection: user.Collection || [] });
        } catch (err) {
          console.error("Error fetching user collection:", err);
          res.status(500).json({ error: 'Failed to fetch user collection' });
        }
    });

        app.post('/api/createpost', async (req, res) =>
        {
                const { userid, movieid, rating, comment } = req.body;

                try {
                        const result = await db.collection('Posts').insertOne(
                                {UserId : userid,
                                 MovieId : movieid,
                                 Rating : rating,
                                 Comment : comment
                                 }
                        );

                        if (result) {
                                res.status(200).json({
                                message: 'Post created',
                        });
                        } else {
                                res.status(404).json({ error: 'Something wenta wrong' });
                        }
                } catch (error) {
                        res.status(500).json({ error: error.toString() });
                }
        });


    const { ObjectId } = require('mongodb');

        app.put('/api/posts/edit/:postId', async (req, res) => {
        const { postId } = req.params;
        const { rating, comment } = req.body;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'Invalid post ID format' });
        }

        try {
            const updated = await db.collection('Posts').findOneAndUpdate(
                { _id: new ObjectId(postId) },
                { $set: { Rating: rating, Comment: comment } },
                { returnDocument: 'after' }
            );

            if (!updated.value) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.status(200).json({ message: 'Post updated successfully', post: updated.value });
        } catch (err) {
            console.error("Error editing post:", err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    app.delete('/api/posts/deletepost/:postId', async (req, res) => {
        const { postId } = req.params;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'Invalid post ID format' });
        }

        try {
            const deleted = await db.collection('Posts').deleteOne({ _id: new ObjectId(postId) });

            if (deleted.deletedCount === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (err) {
            console.error("Error deleting post:", err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Check if username exists
    app.get('/api/:id/get-username', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const user = await db.collection('Users').findOne({ UserId: userId});

            if (user) {
                // If the username exists, send a response indicating it's taken
                return res.json({ firstName: user.firstName});
            } else {
                // If the username does not exist, send a response indicating it's available
                return res.json({ exists: false });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error checking username availability' });
        }
    });


    app.put('/api/profile/:id/edit', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const updateData = req.body;


            delete updateData.UserId;

            console.log("Updating user with data:", updateData);

            const updatedUser = await db.collection('Users').findOneAndUpdate(
                { UserId: userId },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!updatedUser.value) {
                return res.status(404).json({ error: "User not found" });
            }

            // Destructure the updated user data
            const { _id, Login, UserId, Following, Followers, name, ...userData } = updatedUser.value;

            // Return only the relevant user data
            res.json({
                message: "Profile updated successfully",
                user: {
                    firstName: userData.FirstName,
                    lastName: userData.LastName,
                    Email: userData.Email,
                    bio: userData.Bio || '',
                    profilePic: userData.ProfilePic || 'default.png',
                    password: userData.Password || ''
                }
            });

        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

    // Unfollow endpoint
    app.post('/api/profile/:id/unfollow/:targetId', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const targetId = parseInt(req.params.targetId);

            if (userId === targetId) {
                return res.status(400).json({ error: "You cannot unfollow yourself" });
            }

            const user = await db.collection('Users').findOne({ UserId: userId });
            const targetUser = await db.collection('Users').findOne({ UserId: targetId });

            if (!user || !targetUser) {
                return res.status(404).json({ error: "User not found" });
            }

            // Remove targetId from user's following array
            await db.collection('Users').updateOne(
                { UserId: userId },
                { $pull: { Following: targetId } }
            );

            // Rmoeve userId from target user's following
            await db.collection('Users').updateOne(
                { UserId: targetId },
                { $pull: { Followers: userId } }
            );

            res.json({ message: "User unfollowed successfully" });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

    // Follow endpoint
    app.post('/api/profile/:id/follow/:targetId', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const targetId = parseInt(req.params.targetId);

            if (userId === targetId) {
                return res.status(400).json({ error: "You cannot follow yourself" });
            }

            const user = await db.collection('Users').findOne({ UserId: userId });
            const targetUser = await db.collection('Users').findOne({ UserId: targetId });

            if (!user || !targetUser) {
                return res.status(404).json({ error: "User not found" });
            }
            if (user.Following.includes(targetId)) {
                return res.status(400).json({ error: "You are already following this user"})
            }

            // Add targetId to user's following array
            await db.collection('Users').updateOne(
                { UserId: userId },
                // addtoSet ensures no duplicates
                { $addToSet: { Following: targetId } }
            );

            // Add userId to target's followers array
            await db.collection('Users').updateOne(
                { UserId: targetId },
                { $addToSet: { Followers: userId } }
            );

            res.json({ message: "User followed successfully" });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

    // friends postcard endpoint
    app.get("/api/friends-posts/:userId", async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            const currentUser = await db.collection('Users').findOne({ UserId: userId});
            if(!currentUser)    return res.status(404).json({ message: "User not found"});

            const following = currentUser.Following.map(id => parseInt(id));

            const posts = await db
                .collection('Posts')
                .find({ UserId: { $in: following } })
                .limit(20)
                .toArray();

                // get usernames for each postcard
            const usersMap = {};

            if(following.length > 0) {
                const friends = await db
                    .collection('Users')
                    .find({ UserId: { $in: following} })
                    .project( { UserId: 1, Login: 1 })
                    .toArray();

                friends.forEach((friend) => {
                    usersMap[friend.UserId] = friend.Login;
                });
            }
            const enrichedPosts = posts.map((post) => ({
                movieId: post.MovieId,
                userId: post.UserId,
                username: usersMap[post.UserId] || "Unknown",
                rating: post.Rating,
                comment: post.Comment,
            }));

            res.json(enrichedPosts);
        } catch(err) {
            console.error("Error fetching friend's posts:", err);
            res.status(500).json({ message: "Server error"});
        }
    });

    // show friend profile
    // app.get('/api/friend_profile/:friendId', async (req, res) => {
    //     const { friendId } = req.params;
    //     const token = req.headers.authorization;

    //     try {
    //         // You can verify token here if needed

    //         const usersCollection = db.collection('Users');

    //         // Query the user by their unique ID (assuming it's stored as `UserId`)
    //         const friendProfile = await usersCollection.findOne(
    //             { UserId: friendId },
    //             {
    //                 projection: {
    //                     _id: 0,
    //                     firstName: 1,
    //                     lastName: 1,
    //                     bio: 1,
    //                     followers: 1,
    //                     following: 1
    //                 }
    //             }
    //         );

    //         if(!friendProfile) {
    //             return res.status(404).json({ message: "User not found" });
    //         }

    //         res.json(friendProfile);
    //     } catch (err) {
    //         console.error("Failed to fetch profile:", err);
    //         res.status(500).json({ message: "Internal server error" });
    //     }
    // });



    // show user-specific posts under their profile
    app.get('/api/posts/user/:userId', async(req, res) => {
        const { userId } = req.params;

        try {
            const postsCollection = db.collection('Posts');
            const userPosts = await postsCollection
                .find({ UserId: parseInt(userId) })
                .toArray();

            res.json(userPosts);
        } catch(err) {
            console.error("Failed to fetch user's posts:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });



    // Start Server **AFTER** Defining Routes
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
