export interface FeedItemData {
  shortply: ShortplyData | null;
  feed: FeedData | null;
}

export interface CelpickVoteData {
  type: string | null;
  titles: string | null;
  subTitles: string | null;
  cardImageUrl: string | null;
  headerImageUrl: string | null;
  voteDay: string;
  celpickVoteHistory: null;
  celpickWinner: null;
  celpickVoteCandidateList: null;
}

export interface FeedData {
  id: number;
  type: string;
  viewType: string;
  reviewType: string;
  content: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailUrl: string;
  smallThumbnailUrl: string;
  videoUrl: string;
  videoRunningTime: number;
  readCount: number;
  likeCount: number;
  likeLimitCount: number;
  replyCount: number;
  isAllowReply: boolean;
  isAllowSave: boolean;
  isLike: boolean;
  profile: ProfileData;
  hashtagList: HashtagData[];
  cfrItemKey: string;
  celpickVote: CelpickVoteData | null;
  celpickVoteCandidate: null;
  sound: SoundData;
}

export interface ShortplyData {
  id: number;
  hashtagId: number;
  viewType: string;
  thumbnailUrl: string | null;
  readCount: number;
  replyCount: number;
  profile: ProfileData;
  hashtag: HashtagData;
  feedList: ShortplyFeedData[];
  cfrItemKey: string;
}

export interface ProfileData {
  id: number;
  type: string | null;
  wteType: string | null;
  nickname: string | null;
  name: string | null;
  thumbnailUrl: string | null;
  introduce: string | null;
  followerCount: number;
  videoFeedCount: number;
  photoFeedCount: number;
  isFollowing: boolean;
  isFollowingRequest: boolean;
  isPublic: boolean;
}

export interface HashtagData {
  id: number;
  name: string;
  feedCount: number;
  shortplyCount: number;
  feedList: null;
}

export interface ShortplyFeedData {
  id: number;
  type: string | null;
  viewType: string | null;
  reviewType: string;
  content: string | null;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailUrl: string;
  smallThumbnailUrl: string;
  videoUrl: string;
  videoRunningTime: number;
  readCount: number;
  likeCount: number;
  likeLimitCount: number;
  replyCount: number;
  taggedProfileCount: number;
  isAllowReply: boolean;
  isAllowSave: boolean;
  isLikeLimit: boolean;
  isBlockUser: boolean;
  isBlockMe: boolean;
  shortplyConfirmDateTime: string | null;
  registerDateTime: string | null;
  likeLimitDateTime: string | null;
  isLike: boolean;
  celpickVote: CelpickVoteData | null;
  celpickVoteCandidate: null;
  sound: SoundData | null;
  profile: ProfileData;
  hashtagList: HashtagData[] | null;
  cfrItemKey: string | null;
}

export interface SoundData {
  id: number;
  type: string;
  title: string | null;
  artist: string | null;
  mp3Url: string | null;
  streamingUrl: string | null;
  runningTime: number;
  useCount: number;
}
