export interface Video {
  id: string;
  creatorId: string;
  creatorName: string;

  title: string;
  description: string;

  videoUrl: string;
  thumbnailUrl: string;

  duration: number;

  likes: number;
  comments: number;
  shares: number;
  views: number;

  createdAt: Date;
}