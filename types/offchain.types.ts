export interface INft {
  tokenId: number;
  name: string;
  description: string;
  url: string;
  tier: INftTier;
}

export interface INftTier {
  level: number;
  boost: string;
  periodStart: number;
  periodEnd: number;
}

export enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet',
}
