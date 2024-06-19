import React from 'react';

import { Typography, TypographyProps } from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import classes from './TermsOfService.module.scss';
import { HelmetMeta } from 'common';
import { LINKS } from 'utils/constants';

const BaseText: React.FC<TypographyProps> = ({ className, text, variant }) => (
  <Typography
    className={classNames(classes.baseText, className)}
    style={{ color: '#595D6C' }}
    variant={variant ?? 'copyMBold'}
    text={text}
  />
);

const BaseP: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
> = (props) => {
  return (
    <>
      <p
        {...props}
        className={classNames(classes.justify, props.className)}
      ></p>
      <br />
    </>
  );
};
const TermsOfService = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <HelmetMeta
        title='Terms of Use | Minterest'
        description='Minterest protocol terms of use'
        canonical='https://minterest.com/'
      />
      <div className={classes.root}>
        <div>
          <Typography
            style={{
              color: '#FCFDFF',
              marginBottom: '56px',
            }}
            variant='h1'
            text={t('terms.title')}
          />
          <Typography
            style={{
              color: '#FCFDFF',
              marginBottom: '36px',
            }}
            variant='h3'
            text={t('terms.date')}
          />
          <div className={classes.container}>
            <BaseP>
              <BaseText text={t(`terms.p1.1`)} />
              <a href={LINKS.minterest.app} target='_blank' rel='noreferrer'>
                <BaseText className={classes.link} text={LINKS.minterest.app} />
              </a>
              <BaseText text={t(`terms.p1.2`)} />
            </BaseP>
            <BaseP>
              <BaseText text={t(`terms.p2`)} />
            </BaseP>
            <BaseP>
              <BaseText text={t(`terms.p3`)} />
            </BaseP>
            <BaseP>
              <BaseText className={classes.warn} text={t(`terms.p4`)} />
            </BaseP>
            <BaseP>
              <BaseText className={classes.warn} text={t(`terms.p5`)} />
            </BaseP>
            <BaseP>
              <BaseText text={t(`terms.p6`)} />
            </BaseP>
            <BaseP>
              <BaseText text={t(`terms.p7`)} />
            </BaseP>
            <BaseP>
              <BaseText text={t(`terms.p8`)} />
            </BaseP>

            <ol className={classNames(classes.list, classes.nestedList)}>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s1.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s1.1.1`)} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText text={t(`terms.s1.1.1a`)} />
                        <ol type='i' className={classes.list}>
                          <li>
                            <BaseText text={t(`terms.s1.1.1ai`)} />
                          </li>
                          <li>
                            <BaseText text={t(`terms.s1.1.1aii`)} />
                          </li>
                        </ol>
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.1b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.1c`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s1.1.2`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s1.1.3`)} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText text={t(`terms.s1.1.3a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3d`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3e`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3f`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3g`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3h`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3i`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3j`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.3k`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s1.1.4`)} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText text={t(`terms.s1.1.4a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.4b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.4c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.4d`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s1.1.5`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s1.1.6`)} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText text={t(`terms.s1.1.6a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.6b`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s1.1.7`)} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText text={t(`terms.s1.1.7a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.7b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.7c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s1.1.7d`)} />
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s2.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s2.2.1`)} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText text={t(`terms.s2.2.1a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.1b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.1c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.1d`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s2.2.2`)} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText text={t(`terms.s2.2.2a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.2b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.2c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.2d`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.2e`)} />
                        <ol type='i' className={classes.list}>
                          <li>
                            <BaseText text={t(`terms.s2.2.2ei`)} />
                          </li>
                          <li>
                            <BaseText text={t(`terms.s2.2.2eii`)} />
                            <ol
                              type='a'
                              className={classNames(
                                classes.list,
                                classes.nestedList,
                                classes.ml30
                              )}
                            >
                              <li className={classes.da}>
                                <BaseText text={t(`terms.s2.2.2eia`)} />
                              </li>
                              <li className={classes.da}>
                                <BaseText text={t(`terms.s2.2.2eib`)} />
                              </li>
                            </ol>
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s2.2.3`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s2.2.3a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.3b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.3c`)} />
                        <ol type='i' className={classNames(classes.list)}>
                          <li>
                            <BaseText text={t(`terms.s2.2.3ci`)} />
                          </li>
                          <li>
                            <BaseText text={t(`terms.s2.2.3cii`)} />
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s2.2.4`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s2.2.4a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.4b`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s2.2.5`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s2.2.5a1`)} />
                        <a
                          href={LINKS.minterest.rewards}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <BaseText
                            className={classes.link}
                            text={LINKS.minterest.rewards}
                          />
                        </a>
                        <BaseText text={t(`terms.s2.2.5a2`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s2.2.5b`)} />
                        <a
                          href={LINKS.minterest.rewards}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <BaseText
                            className={classes.link}
                            text={LINKS.minterest.rewards}
                          />
                        </a>
                        ]
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s3.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s3.1.1`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s3.1.1a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s3.1.1b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s3.1.1c`)} />
                        <ol type='i' className={classNames(classes.list)}>
                          <li>
                            <BaseText text={t(`terms.s3.1.1ci1`)} />
                            <a
                              href={LINKS.minterest.increasedMonitoring}
                              target='_blank'
                              rel='noreferrer'
                            >
                              <BaseText
                                className={classes.link}
                                text={LINKS.minterest.increasedMonitoring}
                              />
                            </a>
                            <BaseText text={t(`terms.s3.1.1ci2`)} />
                            <a
                              href={LINKS.minterest.callForAction}
                              target='_blank'
                              rel='noreferrer'
                            >
                              <BaseText
                                className={classes.link}
                                text={LINKS.minterest.callForAction}
                              />
                            </a>
                            <BaseText text={t(`terms.s3.1.1ci3`)} />
                          </li>
                          <li>
                            <BaseText text={t(`terms.s3.1.1cii1`)} />
                            <a
                              href={LINKS.minterest.uncsList}
                              target='_blank'
                              rel='noreferrer'
                            >
                              <BaseText
                                className={classes.link}
                                text={LINKS.minterest.uncsList}
                              />
                            </a>
                            <BaseText text={t(`terms.s3.1.1cii2`)} />
                            <ol type='A' className={classNames(classes.list)}>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiA`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiB`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiC`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiD`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiE`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiF`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiG`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiH`)} />
                                <ol
                                  type='i'
                                  className={classNames(classes.list)}
                                >
                                  <li>
                                    <BaseText text={t(`terms.s3.1.1ciiHi`)} />
                                  </li>
                                  <li>
                                    <BaseText text={t(`terms.s3.1.1ciiHii`)} />
                                  </li>
                                </ol>
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiI`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiJ`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiK`)} />
                                <ol
                                  type='i'
                                  className={classNames(classes.list)}
                                >
                                  <li>
                                    <BaseText text={t(`terms.s3.1.1ciiKi`)} />
                                  </li>
                                  <li>
                                    <BaseText text={t(`terms.s3.1.1ciiKii`)} />
                                  </li>
                                </ol>
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiL`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiM`)} />
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiN`)} />
                                <ol
                                  type='i'
                                  className={classNames(classes.list)}
                                >
                                  <li>
                                    <BaseText text={t(`terms.s3.1.1ciiNi`)} />
                                  </li>
                                  <li>
                                    <BaseText text={t(`terms.s3.1.1ciiNii`)} />
                                  </li>
                                </ol>
                              </li>
                              <li>
                                <BaseText text={t(`terms.s3.1.1ciiO`)} />
                              </li>
                            </ol>
                          </li>
                        </ol>
                      </li>
                      <li>
                        <BaseText text={t(`terms.s3.1.1d`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s3.1.1f`)} />
                        <ol type='i' className={classNames(classes.list)}>
                          <li>
                            <BaseText text={t(`terms.s3.1.1fi`)} />
                          </li>
                          <li>
                            <BaseText text={t(`terms.s3.1.1fii`)} />
                          </li>
                          <li>
                            <BaseText text={t(`terms.s3.1.1fiii`)} />
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s3.2.1`)} />
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s4.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s4.1.1`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s4.1.1a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1d`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1e`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1f`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1g`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1h`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s4.1.1i`)} />
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s5.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s5.1.1`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s5.1.2`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s5.1.3`)} />
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s6.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s6.1.1`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s6.1.2`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s6.1.3`)} />
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s7.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s7.1.1`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s7.1.1a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.1b`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s7.1.2`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s7.1.2a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.2b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.2c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.2d`)} />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s7.1.3`)} />
                    <ol type='i' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s7.1.3i`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.3ii`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.3iii`)} />
                      </li>
                    </ol>
                    <BaseText text={t(`terms.s7.1.32`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s7.1.4`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s7.1.5`)} />
                    <ol type='a' className={classNames(classes.list)}>
                      <li>
                        <BaseText text={t(`terms.s7.1.5a`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.5b`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.5c`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.5d`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.5e`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.5f`)} />
                      </li>
                      <li>
                        <BaseText text={t(`terms.s7.1.5g`)} />
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s8.title`)} />
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s9.title`)} />
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s10.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s10.1.1`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s10.1.2`)} />
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={t(`terms.s11.title`)} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s11.1.1`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s11.1.2`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s11.1.3`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s11.1.4`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s11.1.5`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s11.1.6`)} />
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={t(`terms.s11.1.7`)} />
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
