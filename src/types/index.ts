export interface Post {
  MovieId: string;
  Comment: string;
  Rating: number;
  UserID: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  followers: any[];
  following: any[];
} 