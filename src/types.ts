export interface User {

  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
}

export interface Post {
  _id: string;
  MovieId: string;
  Comment: string;
  Rating: number;
  UserId: string;
  createdAt: string;
} 