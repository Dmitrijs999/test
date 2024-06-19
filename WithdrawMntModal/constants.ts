import { MNTSources } from 'types';

export const SourceTitles: Record<MNTSources, string> = {
  [MNTSources.staked]: 'dashboard.withdraw.balance.staked',
  [MNTSources.unstaked]: 'dashboard.withdraw.balance.mnt',
  [MNTSources.vested]: 'dashboard.withdraw.balance.vested',
};
