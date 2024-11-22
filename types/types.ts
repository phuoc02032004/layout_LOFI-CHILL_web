export interface Song {
    id: string;
    Title: string;
    ArtistId: string; 
    url: string; 
    urlImg: string;
    Description: string;
}
  
  export interface Playlist {
    id: string;
    Title: string;
    Description: string;
    filePathPlaylist?: string;
    createdAt?: { _seconds: number; _nanoseconds: number };
    updatedAt?: { _seconds: number; _nanoseconds: number };
  }