export interface Post {
  _id: string;
  UserId: number;
  MovieId: string;
  Rating: number | null;
  Comment: string;
}

export interface User {
 
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  followers: any[];
  following: any[];
} 