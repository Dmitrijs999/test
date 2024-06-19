import React, { useMemo } from 'react';

import { Row, useMediaValue } from '@minterest-finance/ui-kit';

import { BorrowTable } from './components/TableMarket/BorrowTable';
import { SupplyTable } from './components/TableMarket/SupplyTable';
import classes from './MarketsOverview.module.scss';
import { HelmetMeta, Container, Content } from 'common';
import { GaugeWrapper } from 'common/Gauges/Wrapper/Wrapper';
import { selectMarketTransaction } from 'features';
import { useAppSelector } from 'features/store';

const MarketsOverview = (): JSX.Element => {
  const wrap = useMediaValue('wrap', 'wrap', 'nowrap');
  const tableGap = useMediaValue('24px', '32px', '24px');
  const containerPaddingOverrides = useMediaValue(
    '40px 16px',
    '40px',
    '40px 120px'
  );
  const transaction = useAppSelector(selectMarketTransaction);

  const isOpen = useMemo(() => {
    return transaction?.opened;
  }, [transaction]);

  return (
    <Container
      className={classes.container}
      style={{ padding: containerPaddingOverrides }}
    >
      <HelmetMeta
        title='Overview | Minterest'
        description='Minterest is a decentralised lending and borrowing protocol that captures 100% of the value created from its functions.'
        canonical='https://minterest.com/'
      />
      <GaugeWrapper isOpen={isOpen} />
      <Content style={{ alignItems: 'unset' }}>
        <Row
          sx={{
            flex: 1,
            gap: tableGap,
            flexWrap: wrap,
          }}
        >
          <Row sx={{ width: '100%' }}>
            <SupplyTable />
          </Row>
          <Row sx={{ width: '100%' }}>
            <BorrowTable />
          </Row>
        </Row>
      </Content>
    </Container>
  );
};

export default MarketsOverview;
