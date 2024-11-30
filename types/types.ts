interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Song {
  id: string;
  ArtistId: string;
  Title: string;
  Url: string;
  Description: string;
  urlImg: string;
  filePath: string;
  filePathImg: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
  
  export interface Playlist {
    id: string;
    Title: string;
    Description: string;
    filePathPlaylist?: string;
    createdAt?: { _seconds: number; _nanoseconds: number };
    updatedAt?: { _seconds: number; _nanoseconds: number };
  }