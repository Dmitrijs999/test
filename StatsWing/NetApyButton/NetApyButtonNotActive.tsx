import React, { FC } from 'react';

import { Typography } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './../StatsWing.module.scss';

export const NetApyButtonNotActive: FC = () => {
  const { t } = useTranslation();
  return (
    <svg
      width='328'
      height='267.5'
      viewBox='0 0 328 268'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={classes.netApyButton}
    >
      <g filter='url(#filter0_ddd_21523_42453)'>
        <path
          d='M276.497 134.242C276.497 196.376 226.128 246.744 163.995 246.744C101.861 246.744 51.4924 196.376 51.4924 134.242C51.4924 72.109 101.861 21.74 163.995 21.74C226.128 21.74 276.497 72.109 276.497 134.242ZM57.1175 134.242C57.1175 193.269 104.968 241.119 163.995 241.119C223.021 241.119 270.872 193.269 270.872 134.242C270.872 75.2156 223.021 27.3651 163.995 27.3651C104.968 27.3651 57.1175 75.2156 57.1175 134.242Z'
          fill='url(#paint0_linear_21523_42453)'
        />
      </g>
      <circle cx='164.008' cy='133.74' r='108.5' fill='#10161C' />
      <g filter='url(#filter1_ddd_21523_42453)'>
        <ellipse
          cx='82.3431'
          cy='82.5001'
          rx='82.3431'
          ry='82.5001'
          transform='matrix(1 0 -0.0019085 0.999998 81.8081 51.7419)'
          fill='#10161C'
        />
        <path
          d='M244.337 134.242C244.252 178.704 208.209 214.742 163.84 214.742C119.471 214.742 83.5658 178.704 83.6507 134.242C83.7355 89.7794 119.779 53.7419 164.147 53.7419C208.516 53.7419 244.422 89.7794 244.337 134.242Z'
          stroke='url(#paint1_linear_21523_42453)'
          strokeWidth='4'
        />
      </g>
      <path
        d='M57.5272 135.597C57.2831 121.613 59.7957 107.719 64.9214 94.7064C70.0471 81.694 77.6856 69.8186 87.4007 59.7583C97.1159 49.6979 108.717 41.6496 121.543 36.0729C134.369 30.4962 148.167 27.5003 162.15 27.2562C176.134 27.0121 190.028 29.5247 203.041 34.6504C216.053 39.7761 227.928 47.4146 237.989 57.1298C248.049 66.8449 256.097 78.4465 261.674 91.272C267.251 104.098 270.247 117.896 270.491 131.879C270.735 145.863 268.222 159.757 263.097 172.77C257.971 185.782 250.332 197.657 240.617 207.718C230.902 217.778 219.301 225.826 206.475 231.403C193.649 236.98 179.851 239.976 165.868 240.22C151.884 240.464 137.99 237.951 124.977 232.826C111.965 227.7 100.09 220.061 90.0293 210.346C79.9689 200.631 71.9206 189.03 66.3439 176.204C60.7672 163.378 57.7713 149.58 57.5272 135.597L57.5272 135.597Z'
        stroke='#0D1319'
        strokeWidth='4'
      />
      <foreignObject x='0' y='0' width='328' height='267.5'>
        <div className={classes.count}>
          <Typography variant='copyMBold' text={t('common.supplyToStart')} />
        </div>
      </foreignObject>
      <defs>
        <filter
          id='filter0_ddd_21523_42453'
          x='0.492432'
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
            result='effect1_dropShadow_21523_42453'
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
            result='effect2_dropShadow_21523_42453'
          />
          <feOffset dy='-1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21523_42453'
            result='effect2_dropShadow_21523_42453'
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
            result='effect3_dropShadow_21523_42453'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4.5' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='effect2_dropShadow_21523_42453'
            result='effect3_dropShadow_21523_42453'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect3_dropShadow_21523_42453'
            result='shape'
          />
        </filter>
        <filter
          id='filter1_ddd_21523_42453'
          x='30.6505'
          y='-8.25806'
          width='260.687'
          height='261'
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
            result='effect1_dropShadow_21523_42453'
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
            result='effect2_dropShadow_21523_42453'
          />
          <feOffset dy='-1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21523_42453'
            result='effect2_dropShadow_21523_42453'
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
            result='effect3_dropShadow_21523_42453'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4.5' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='effect2_dropShadow_21523_42453'
            result='effect3_dropShadow_21523_42453'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect3_dropShadow_21523_42453'
            result='shape'
          />
        </filter>
        <filter
          id='filter2_d_21523_42453'
          x='129.829'
          y='128.301'
          width='68.722'
          height='21.7807'
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
          <feOffset dy='4.24727' />
          <feGaussianBlur stdDeviation='2.12364' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_21523_42453'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_21523_42453'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_21523_42453'
          x1='163.995'
          y1='21.74'
          x2='163.995'
          y2='246.744'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#999999' />
          <stop offset='0.84375' stopColor='#2E3031' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_21523_42453'
          x1='238.598'
          y1='189.712'
          x2='113.458'
          y2='64.679'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#828798' />
          <stop offset='0.510417' stopColor='#D6D7DB' />
          <stop offset='1' stopColor='#9095A6' />
        </linearGradient>
      </defs>
    </svg>
  );
};
