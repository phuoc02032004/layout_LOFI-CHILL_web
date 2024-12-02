interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}


  
  export interface Playlist {
    id: string;
    Title: string;
    Description: string;
    filePathPlaylist?: string;
    createdAt?: { _seconds: number; _nanoseconds: number };
    updatedAt?: { _seconds: number; _nanoseconds: number };
  }