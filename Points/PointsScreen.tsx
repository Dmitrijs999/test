import React from 'react';

import { LeaderBoard, Quests, UserStats } from './components';
import { Container, Content, HelmetMeta } from 'common';

const PointsScreen: React.FC = () => {
  return (
    <Container>
      <HelmetMeta
        title='Minterest Points System | Minterest'
        description='Earn points by completing quests on the Minterest lending protocol. Track your progress and rank on the leaderboard.'
        canonical='https://minterest.com/dashboard'
      />
      <Content style={{ alignItems: 'center', overflowX: 'visible' }}>
        <UserStats></UserStats>
        <Quests></Quests>
        <LeaderBoard></LeaderBoard>
      </Content>
    </Container>
  );
};

export default PointsScreen;
