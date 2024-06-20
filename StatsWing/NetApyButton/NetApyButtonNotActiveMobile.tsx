import React, { FC } from 'react';

import { Typography } from '@minterest-finance/ui-kit';
import { useTranslation } from 'react-i18next';

import classes from './../StatsWing.module.scss';

export const NetApyButtonNotActiveMobile: FC = () => {
  const { t } = useTranslation();
  return (
    <svg
      width='252'
      height='189.3'
      viewBox='0 0 252 189.3'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={classes.netApyButtonNotActiveMobile}
    >
      <g filter='url(#filter0_ddd_21772_45274)'>
        <path
          d='M200.67 95.0004C200.67 136.058 167.239 169.341 126 169.341C84.7613 169.341 51.3306 136.058 51.3306 95.0004C51.3306 53.9431 84.7613 20.6597 126 20.6597C167.239 20.6597 200.67 53.9431 200.67 95.0004ZM55.064 95.0004C55.064 134.005 86.8232 165.624 126 165.624C165.177 165.624 196.936 134.005 196.936 95.0004C196.936 55.996 165.177 24.3767 126 24.3767C86.8232 24.3767 55.064 55.996 55.064 95.0004Z'
          fill='url(#paint0_linear_21772_45274)'
        />
      </g>
      <ellipse
        cx='126.009'
        cy='94.6682'
        rx='72.0133'
        ry='71.696'
        fill='#10161C'
      />
      <g filter='url(#filter1_ddd_21772_45274)'>
        <ellipse
          cx='54.6525'
          cy='54.5155'
          rx='54.6525'
          ry='54.5155'
          transform='matrix(1 0 -0.00191694 0.999998 71.4512 40.4844)'
          fill='#10161C'
        />
        <path
          d='M178.652 94.9998C178.596 123.999 154.982 147.515 125.899 147.515C96.8146 147.515 73.2911 123.999 73.3467 94.9998C73.4023 66.0011 97.0159 42.4844 126.1 42.4844C155.184 42.4844 178.707 66.0011 178.652 94.9998Z'
          stroke='url(#paint1_linear_21772_45274)'
          strokeWidth='4'
        />
      </g>
      <path
        d='M56.0082 95.8831C55.8478 86.7333 57.4991 77.6414 60.8681 69.1265C64.237 60.6116 69.2578 52.8401 75.6441 46.256C82.0304 39.6719 89.6572 34.4042 98.0894 30.7539C106.522 27.1037 115.594 25.1426 124.788 24.9828C133.981 24.823 143.117 26.4677 151.672 29.8228C160.227 33.1779 168.034 38.1775 174.647 44.5358C181.26 50.894 186.551 58.4864 190.216 66.8792C193.881 75.2719 195.85 84.3009 196.011 93.4507C196.171 102.601 194.52 111.692 191.151 120.207C187.782 128.722 182.761 136.494 176.375 143.078C169.989 149.662 162.362 154.93 153.93 158.58C145.498 162.23 136.425 164.191 127.232 164.351C118.038 164.511 108.902 162.866 100.347 159.511C91.7922 156.156 83.9853 151.156 77.3719 144.798C70.7586 138.44 65.4685 130.847 61.8031 122.455C58.1376 114.062 56.1686 105.033 56.0082 95.8831L56.0082 95.8831Z'
        stroke='#0D1319'
        strokeWidth='4'
      />
      <foreignObject x='0' y='0' width='252' height='189.3'>
        <div className={classes.flexToAlign}>
          <div className={classes.count}>
            <Typography variant='copyMBold' text={t('common.supplyToStart')} />
          </div>
        </div>
      </foreignObject>
      <defs>
        <filter
          id='filter0_ddd_21772_45274'
          x='0.330566'
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
            result='effect1_dropShadow_21772_45274'
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
            result='effect2_dropShadow_21772_45274'
          />
          <feOffset dy='-1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21772_45274'
            result='effect2_dropShadow_21772_45274'
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
            result='effect3_dropShadow_21772_45274'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4.5' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='effect2_dropShadow_21772_45274'
            result='effect3_dropShadow_21772_45274'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect3_dropShadow_21772_45274'
            result='shape'
          />
        </filter>
        <filter
          id='filter1_ddd_21772_45274'
          x='20.3467'
          y='-19.5156'
          width='205.305'
          height='205.031'
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
            result='effect1_dropShadow_21772_45274'
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
            result='effect2_dropShadow_21772_45274'
          />
          <feOffset dy='-1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21772_45274'
            result='effect2_dropShadow_21772_45274'
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
            result='effect3_dropShadow_21772_45274'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4.5' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='effect2_dropShadow_21772_45274'
            result='effect3_dropShadow_21772_45274'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect3_dropShadow_21772_45274'
            result='shape'
          />
        </filter>
        <filter
          id='filter2_d_21772_45274'
          x='94.8343'
          y='89.5981'
          width='68.7221'
          height='21.7802'
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
            result='effect1_dropShadow_21772_45274'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_21772_45274'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_21772_45274'
          x1='126'
          y1='20.6597'
          x2='126'
          y2='169.341'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#999999' />
          <stop offset='0.84375' stopColor='#2E3031' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_21772_45274'
          x1='175.515'
          y1='131.654'
          x2='92.8242'
          y2='48.668'
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
