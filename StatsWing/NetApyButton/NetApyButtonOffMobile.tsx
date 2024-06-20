import React, { FC } from 'react';

import { Typography, pickBy, useTheme } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './../StatsWing.module.scss';

export const NetApyButtonOffMobile: FC<{ onConnectClick: () => void }> = ({
  onConnectClick,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <svg
      width='189.33'
      height='190'
      viewBox='0 0 189.33 190'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={classes.netApyButtonOff}
    >
      <g filter='url(#filter0_ddd_21772_45264)'>
        <path
          d='M169.67 95.0004C169.67 136.058 136.239 169.341 95.0002 169.341C53.7613 169.341 20.3306 136.058 20.3306 95.0004C20.3306 53.9431 53.7613 20.6597 95.0002 20.6597C136.239 20.6597 169.67 53.9431 169.67 95.0004ZM24.064 95.0004C24.064 134.005 55.8232 165.624 95.0002 165.624C134.177 165.624 165.936 134.005 165.936 95.0004C165.936 55.996 134.177 24.3767 95.0002 24.3767C55.8232 24.3767 24.064 55.996 24.064 95.0004Z'
          fill='url(#paint0_linear_21772_45264)'
        />
      </g>
      <ellipse
        cx='95.0089'
        cy='94.6682'
        rx='72.0133'
        ry='71.696'
        fill='#10161C'
      />
      <ellipse
        cx='95.4265'
        cy='94.1458'
        rx='61.3938'
        ry='61.1233'
        fill='url(#paint1_linear_21772_45264)'
      />
      <ellipse
        onClick={() => onConnectClick()}
        style={{ cursor: 'pointer' }}
        cx='95.4265'
        cy='94.8064'
        rx='61.3938'
        ry='61.1233'
        fill={pickBy(theme.palette.customTheme, {
          ethereum: 'url(#paint2_linear_21772_45264)',
          taiko: '#E91898',
        })}
      />
      <path
        d='M25.0082 95.8831C24.8478 86.7333 26.4991 77.6414 29.8681 69.1265C33.237 60.6116 38.2578 52.8401 44.6441 46.256C51.0304 39.6719 58.6572 34.4042 67.0894 30.7539C75.5215 27.1037 84.5936 25.1426 93.7875 24.9828C102.981 24.823 112.117 26.4677 120.672 29.8228C129.227 33.1779 137.034 38.1775 143.647 44.5358C150.26 50.894 155.551 58.4864 159.216 66.8792C162.881 75.2719 164.85 84.3009 165.011 93.4507C165.171 102.601 163.52 111.692 160.151 120.207C156.782 128.722 151.761 136.494 145.375 143.078C138.989 149.662 131.362 154.93 122.93 158.58C114.498 162.23 105.425 164.191 96.2316 164.351C87.0376 164.511 77.9023 162.866 69.3473 159.511C60.7922 156.156 52.9853 151.156 46.3719 144.798C39.7586 138.44 34.4685 130.847 30.8031 122.455C27.1376 114.062 25.1686 105.033 25.0082 95.8831L25.0082 95.8831Z'
        stroke='#0D1319'
        strokeWidth='4'
      />
      <foreignObject
        x='47'
        y='74'
        width='100'
        height='70'
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
          id='filter0_ddd_21772_45264'
          x='-30.6694'
          y='-39.3403'
          width='245.339'
          height='244.681'
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
            result='effect1_dropShadow_21772_45264'
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
            result='effect2_dropShadow_21772_45264'
          />
          <feOffset dy='-1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21772_45264'
            result='effect2_dropShadow_21772_45264'
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
            result='effect3_dropShadow_21772_45264'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4.5' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='effect2_dropShadow_21772_45264'
            result='effect3_dropShadow_21772_45264'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect3_dropShadow_21772_45264'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_21772_45264'
          x1='95.0002'
          y1='20.6597'
          x2='95.0002'
          y2='169.341'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#999999' />
          <stop offset='0.84375' stopColor='#2E3031' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_21772_45264'
          x1='34.6305'
          y1='33.0225'
          x2='180.742'
          y2='97.9519'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#DDE1EC' />
          <stop offset='1' stopColor='#C2CAD6' />
        </linearGradient>
        <linearGradient
          id='paint2_linear_21772_45264'
          x1='34.6305'
          y1='33.6831'
          x2='180.742'
          y2='98.6126'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#09A9AA' />
          <stop offset='1' stopColor='#00545F' />
        </linearGradient>
      </defs>
    </svg>
  );
};
