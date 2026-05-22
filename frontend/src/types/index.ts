export interface Movie {
  id: string;
  userId?: string;
  title: string;
  director: string;
  year: number;
  genre: 'action' | 'drama' | 'comedy' | 'horror' | 'scifi';
  poster?: string;
  rating: number;
  watched: number | boolean;  // бекенд возвращает 0/1
  favorite: number | boolean; // бекенд возвращает 0/1
  createdAt?: string;
}

export interface User {
  name: string;
  email: string;
}