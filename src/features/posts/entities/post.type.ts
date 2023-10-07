export enum LanguageEnum {
  'ENGLISH' = 'ENGLISH',
  'HINDI' = 'HINDI',
  'CHINESE' = 'CHINESE',
  'SPANISH' = 'SPANISH',
}
export enum PlatformEnum {
  'YOUTUBE' = 'YOUTUBE',
  'INSTAGRAM' = 'INSTAGRAM',
}

export type TPostMessageQueueForML = {
  trends: Record<string, any>;
  influencerId: string;
  videoUrl: string;

  platform: PlatformEnum;
};
