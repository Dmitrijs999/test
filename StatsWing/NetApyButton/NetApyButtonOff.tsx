import React, { FC } from 'react';

import { Typography, pickBy, useTheme } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './../StatsWing.module.scss';

export const NetApyButtonOff: FC<{
  onConnectClick: () => void;
}> = ({ onConnectClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <svg
      width='268'
      height='268'
      viewBox='0 0 268 268'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={classes.netApyButtonOff}
    >
      <g filter='url(#filter0_ddd_21493_44693)'>
        <path
          d='M246.497 134.242C246.497 196.376 196.128 246.744 133.995 246.744C71.8614 246.744 21.4924 196.376 21.4924 134.242C21.4924 72.109 71.8614 21.74 133.995 21.74C196.128 21.74 246.497 72.109 246.497 134.242ZM27.1175 134.242C27.1175 193.269 74.9681 241.119 133.995 241.119C193.021 241.119 240.872 193.269 240.872 134.242C240.872 75.2156 193.021 27.3651 133.995 27.3651C74.9681 27.3651 27.1175 75.2156 27.1175 134.242Z'
          fill='url(#paint0_linear_21493_44693)'
        />
      </g>
      <circle cx='134.008' cy='133.74' r='108.5' fill='#10161C' />
      <circle
        cx='134.637'
        cy='132.949'
        r='92.5'
        fill='url(#paint1_linear_21493_44693)'
      />
      <circle
        onClick={() => onConnectClick()}
        style={{ cursor: 'pointer' }}
        cx='134.637'
        cy='133.949'
        r='92.5'
        fill={pickBy(theme.palette.customTheme, {
          ethereum: 'url(#paint2_linear_21493_44693)',
          taiko: '#E91898',
        })}
      />
      <path
        d='M27.5272 135.597C27.2831 121.613 29.7957 107.719 34.9214 94.7064C40.0471 81.694 47.6856 69.8186 57.4007 59.7583C67.1159 49.6979 78.7175 41.6496 91.543 36.0729C104.369 30.4962 118.167 27.5003 132.15 27.2562C146.134 27.0121 160.028 29.5247 173.041 34.6504C186.053 39.7761 197.928 47.4146 207.989 57.1298C218.049 66.8449 226.097 78.4465 231.674 91.272C237.251 104.098 240.247 117.896 240.491 131.879C240.735 145.863 238.222 159.757 233.097 172.77C227.971 185.782 220.332 197.657 210.617 207.718C200.902 217.778 189.301 225.826 176.475 231.403C163.649 236.98 149.851 239.976 135.868 240.22C121.884 240.464 107.99 237.951 94.9774 232.826C81.965 227.7 70.0896 220.061 60.0293 210.346C49.9689 200.631 41.9206 189.03 36.3439 176.204C30.7672 163.378 27.7713 149.58 27.5272 135.597L27.5272 135.597Z'
        stroke='#0D1319'
        strokeWidth='4'
      />
      <foreignObject
        x='54'
        y='111.5'
        width='160'
        height='90'
        onClick={() => onConnectClick()}
        style={{ cursor: 'pointer' }}
      >
        <div className={classes.flexToAlign}>
          <div className={classes.count}>
            <Typography variant='copyLBold' text={t('header.button')} />
          </div>
        </div>
      </foreignObject>
      <defs>
        <filter
          id='filter0_ddd_21493_44693'
          x='-29.5076'
          y='-38.26'
          width='321.004'
          height='321.004'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dx='-3' dy='-12' />
          <feGaussianBlur stdDeviation='24' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.219608 0 0 0 0 0.266667 0 0 0 0 0.313726 0 0 0 0.39 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_21493_44693'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feMorphology
            radius='1'
            operator='dilate'
            in='SourceAlpha'
            result='effect2_dropShadow_21493_44693'
          />
          <feOffset dy='-1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21493_44693'
            result='effect2_dropShadow_21493_44693'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feMorphology
            radius='8'
            operator='dilate'
            in='SourceAlpha'
            result='effect3_dropShadow_21493_44693'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4.5' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='effect2_dropShadow_21493_44693'
            result='effect3_dropShadow_21493_44693'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect3_dropShadow_21493_44693'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_21493_44693'
          x1='133.995'
          y1='21.74'
          x2='133.995'
          y2='246.744'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#999999' />
          <stop offset='0.84375' stopColor='#2E3031' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_21493_44693'
          x1='43.0373'
          y1='40.449'
          x2='263.499'
          y2='137.986'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#DDE1EC' />
          <stop offset='1' stopColor='#C2CAD6' />
        </linearGradient>
        <linearGradient
          id='paint2_linear_21493_44693'
          x1='43.0373'
          y1='41.449'
          x2='263.499'
          y2='138.986'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#09A9AA' />
          <stop offset='1' stopColor='#00545F' />
        </linearGradient>
      </defs>
    </svg>
  );
};
