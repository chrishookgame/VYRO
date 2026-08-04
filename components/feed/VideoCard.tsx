import ActionBar from "./ActionBar";
import AIOverlay from "./AIOverlay";
import CreatorInfo from "./CreatorInfo";
import VideoPlayer from "./VideoPlayer";

type VideoCardProps = {
  postId: string;
  creatorId: string;
  creator: string;
  description: string;
  videoUrl: string;
  likes: number;
};

export default function VideoCard({
  postId,
  creatorId,
  creator,
  description,
  videoUrl,
  likes,
}: VideoCardProps) {
  return (
    <div className="relative h-screen w-full snap-start overflow-hidden bg-black">
      <VideoPlayer
        videoUrl={videoUrl}
      />

      <AIOverlay />

      <div className="absolute bottom-0 left-0 z-20 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
        <CreatorInfo
          creatorId={creatorId}
          creator={creator}
          description={description}
        />
      </div>

      <ActionBar
        postId={postId}
        initialLikes={likes}
      />
    </div>
  );
}
