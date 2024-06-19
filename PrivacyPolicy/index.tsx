import React from 'react';

import { Typography, TypographyProps } from '@minterest-finance/ui-kit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import classes from './PrivacyPolicy.module.scss';
import { HelmetMeta } from 'common';

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
const PrivacyPolicy = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <HelmetMeta
        title='Privacy Policy | Minterest'
        description='Minterest protocol privacy policy'
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
            text={t('Minterest Privacy Policy')}
          />
          <Typography
            style={{
              color: '#FCFDFF',
              marginBottom: '36px',
            }}
            variant='h3'
            text={'Effective Date: 01 October 2023'}
          />
          <div className={classes.container}>
            <BaseP>
              <BaseText
                text={t(
                  `Welcome to Minterest. Minterest recognizes the importance of secure and responsible data handling. This Privacy Policy ("Policy") provides detailed information about how Minterest ("we", "us", or "our") collects, uses, and safeguards your information when you interact with our services through app.minterest.com or the Minterest platform.`
                )}
              />
            </BaseP>
            <BaseP>
              <BaseText
                text={t(
                  `By accessing the Minterest Platform, you acknowledge and agree to the practices described in this Privacy Policy. If you do not agree with any part of this Policy, please refrain from using these services.`
                )}
              />
            </BaseP>

            <ol className={classNames(classes.list, classes.nestedList)}>
              <li className={classes.ni}>
                <BaseText text={'Data Collection'} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText text={`Information You Provide:`} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText
                          text={`Communication: When you contact us for support, feedback, or other inquiries, we collect the content of your messages, along with any contact details you provide, such as your name and email address.`}
                        />
                      </li>
                      <li>
                        <BaseText
                          text={`Surveys and Feedback: The data collected from any surveys or feedback.`}
                        />
                      </li>
                      <li>
                        <BaseText
                          text={`Voluntary Data: At times, you might provide additional data not explicitly requested by us. You're responsible for such information.`}
                        />
                      </li>
                    </ol>
                  </li>
                  <li className={classes.ni}>
                    <BaseText text={`Automatically Collected Data:`} />
                    <ol type='a' className={classes.list}>
                      <li>
                        <BaseText
                          text={`Wallet Details: Minterest may gather the wallet address you use to connect to our platform to enhance user experience and ensure security.`}
                        />
                      </li>
                      <li>
                        <BaseText
                          text={`Device and Connection Data: Information about your device, internet connection, IP address, operating system, and browser type may be automatically collected to optimize user experience.`}
                        />
                      </li>
                      <li>
                        <BaseText
                          text={`Usage and Activity Data: Minterest tracks your activity on our Platform, including pages visited, features used, transaction history, and other behavioral data, to enhance our services and understand user preferences.`}
                        />
                      </li>
                      <li>
                        <BaseText
                          text={`Cookies and Trackers: Minterest may use cookies, beacons, and similar tracking technologies to gather information about your interactions with our Platform.`}
                        />
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={`Data Utilization`} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText
                      text={`Service Provision: To offer, maintain, and improve our services, respond to user queries, and ensure a seamless user experience.`}
                    />
                  </li>

                  <li className={classes.ni}>
                    <BaseText
                      text={`Communication: To communicate with you about updates, promotions, security alerts, and other relevant information.`}
                    />
                  </li>

                  <li className={classes.ni}>
                    <BaseText
                      text={`Research and Development: To develop new features, products, and services that cater to our users' needs.`}
                    />
                  </li>

                  <li className={classes.ni}>
                    <BaseText
                      text={`Security: To monitor and ensure the security of our Platform, detect and prevent fraudulent activities, and ensure compliance with our terms of service.`}
                    />
                  </li>

                  <li className={classes.ni}>
                    <BaseText
                      text={`Legal Obligations: To comply with legal, regulatory, and law enforcement requirements.`}
                    />
                  </li>

                  <li className={classes.ni}>
                    <BaseText
                      text={`User Insights: To understand user preferences, trends, and feedback, enabling us to enhance our offerings and tailor them to user needs.`}
                    />
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={`Data Sharing and Disclosure`} />
                <ol className={classNames(classes.list, classes.nestedList)}>
                  <li className={classes.ni}>
                    <BaseText
                      text={`Internal Sharing: Minterest may share your data within Minterest for operational and business purposes.`}
                    />
                  </li>
                  <li className={classes.ni}>
                    <BaseText
                      text={`Service Providers: Minterest collaborates with third-party service providers for various services, including data analytics, transaction processing, and customer support. These providers only access your data to perform tasks on our behalf and are obligated not to disclose or use it for other purposes.`}
                    />
                  </li>

                  <li className={classes.ni}>
                    <BaseText
                      text={`Legal and Regulatory: Minterest may disclose your data if required by law, legal process, or when necessary to investigate potential violations, detect and address fraud or security issues, and protect the rights of users`}
                    />
                  </li>

                  <li className={classes.ni}>
                    <BaseText
                      text={`Business Transfers: If Minterest undergoes a merger, acquisition, or asset sale, your data may be transferred as part of that transaction.`}
                    />
                  </li>
                </ol>
              </li>
              <li className={classes.ni}>
                <BaseText text={`Third-Party Services`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Our platform may contain links to third-party websites or services. Minterest is not responsible for the privacy practices of these external sites, however such third-party service providers are bound by confidentiality agreements with Minterest. `}
                    />
                  </li>
                </ul>
              </li>
              <li className={classes.ni}>
                <BaseText text={`Cookies and Tracking Policy`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Minterest may use cookies to remember user preferences, session information, and enhance platform functionality. You can manage or disable cookies in your browser settings.`}
                    />
                  </li>
                </ul>
              </li>
              <li className={classes.ni}>
                <BaseText text={`Analytics`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Minterest uses analytics tools to gather aggregate data to improve platform functionality. If you wish to opt-out of analytics tracking, you can do so through platform settings.`}
                    />
                  </li>
                </ul>
              </li>
              <li className={classes.ni}>
                <BaseText text={`Data Security`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Minterest employs robust security measures to protect your data.`}
                    />
                  </li>
                </ul>
              </li>
              <li className={classes.ni}>
                <BaseText text={`Data Retention`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Minterest retains your data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a shorter retention period is required by law.`}
                    />
                  </li>
                </ul>
              </li>

              <li className={classes.ni}>
                <BaseText text={`International Data Transfers`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Your data may be processed and stored in countries other than your residence. Minterest ensures that data transfers comply with applicable data protection laws.`}
                    />
                  </li>
                </ul>
              </li>

              <li className={classes.ni}>
                <BaseText text={`For Minors`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Our Platform is not intended for minors. Minterest does not knowingly collect data from them.`}
                    />
                  </li>
                </ul>
              </li>

              <li className={classes.ni}>
                <BaseText text={`For California Residents`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`California residents have specific rights under the CCPA. This includes rights to know, delete, and opt-out.`}
                    />
                  </li>
                </ul>
              </li>

              <li className={classes.ni}>
                <BaseText text={`For European and UK Residents`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Minterest employs robust security measures to protect your data.`}
                    />
                  </li>
                </ul>
              </li>

              <li className={classes.ni}>
                <BaseText text={`Changes to this Privacy Policy`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`Minterest may update this Privacy Policy periodically. Users will be noticed of any significant changes, but should review this policy regularly.`}
                    />
                  </li>
                </ul>
              </li>

              <li className={classes.ni}>
                <BaseText text={`Contact Us`} />
                <ul className={classNames(classes.list, classes.nestedList)}>
                  <li>
                    <BaseText
                      text={`If you have questions or concerns about this Privacy Policy or our data practices, please contact us at support@minterest.com.`}
                    />
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
