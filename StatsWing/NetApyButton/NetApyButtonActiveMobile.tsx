import React, { FC } from 'react';

import { Typography } from '@minterest-finance/ui-kit';

import classes from './../StatsWing.module.scss';

export const NetApyButtonActiveMobile: FC<{ netApyValue?: string }> = ({
  netApyValue,
}) => {
  return (
    <svg
      width='252'
      height='190'
      viewBox='0 0 252 190'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={classes.netApyButton}
    >
      <g filter='url(#filter0_ddd_21772_45279)'>
        <path
          d='M200.67 95.0004C200.67 136.058 167.239 169.341 126 169.341C84.7613 169.341 51.3306 136.058 51.3306 95.0004C51.3306 53.9431 84.7613 20.6597 126 20.6597C167.239 20.6597 200.67 53.9431 200.67 95.0004ZM55.064 95.0004C55.064 134.005 86.8232 165.624 126 165.624C165.177 165.624 196.936 134.005 196.936 95.0004C196.936 55.996 165.177 24.3767 126 24.3767C86.8232 24.3767 55.064 55.996 55.064 95.0004Z'
          fill='url(#paint0_linear_21772_45279)'
        />
      </g>
      <ellipse
        cx='126.009'
        cy='94.6682'
        rx='72.0133'
        ry='71.696'
        fill='#10161C'
      />
      <g filter='url(#filter1_dd_21772_45279)'>
        <circle cx='126' cy='95' r='45' fill='#0D1319' />
        <circle
          cx='126'
          cy='95'
          r='44.5'
          stroke='url(#paint1_linear_21772_45279)'
        />
      </g>
      <path
        d='M109.103 155.905V149.025H110.263L112.323 153.425H112.363V149.025H113.453V155.905H112.383L110.233 151.305H110.193V155.905H109.103ZM115.157 155.905V149.025H118.747V149.985H116.287V151.945H118.417V152.905H116.287V154.945H118.747V155.905H115.157ZM121.236 155.905V150.015H119.706V149.025H123.906V150.015H122.366V155.905H121.236ZM126.863 155.905L128.633 149.025H130.193L131.963 155.905H130.813L130.403 154.255H128.383L127.983 155.905H126.863ZM128.613 153.315H130.173L129.423 150.155H129.363L128.613 153.315ZM133.134 155.905V149.025H135.494C135.867 149.025 136.167 149.075 136.394 149.175C136.627 149.275 136.804 149.422 136.924 149.615C137.044 149.809 137.124 150.045 137.164 150.325C137.211 150.599 137.234 150.912 137.234 151.265C137.234 151.605 137.214 151.915 137.174 152.195C137.134 152.469 137.054 152.705 136.934 152.905C136.814 153.099 136.637 153.249 136.404 153.355C136.171 153.462 135.864 153.515 135.484 153.515H134.264V155.905H133.134ZM134.264 152.555H135.154C135.341 152.555 135.494 152.542 135.614 152.515C135.741 152.489 135.837 152.432 135.904 152.345C135.977 152.259 136.027 152.129 136.054 151.955C136.087 151.782 136.104 151.552 136.104 151.265C136.104 150.999 136.091 150.782 136.064 150.615C136.044 150.442 136.001 150.312 135.934 150.225C135.867 150.132 135.771 150.069 135.644 150.035C135.524 150.002 135.364 149.985 135.164 149.985H134.264V152.555ZM139.724 155.905V153.395L137.884 149.025H139.054L140.284 152.155H140.344L141.554 149.025H142.684L140.854 153.395V155.905H139.724Z'
        fill='#FCFDFF'
      />
      <path
        opacity='0.5'
        d='M123.391 123.902L127.771 115.646H128.611L124.231 123.902H123.391ZM123.775 120.17C123.423 120.17 123.143 120.126 122.935 120.038C122.735 119.95 122.591 119.814 122.503 119.63C122.415 119.446 122.359 119.21 122.335 118.922C122.319 118.626 122.311 118.274 122.311 117.866C122.311 117.458 122.319 117.11 122.335 116.822C122.359 116.526 122.415 116.286 122.503 116.102C122.591 115.91 122.735 115.77 122.935 115.682C123.143 115.594 123.423 115.55 123.775 115.55C124.135 115.55 124.415 115.594 124.615 115.682C124.815 115.77 124.959 115.91 125.047 116.102C125.135 116.286 125.187 116.526 125.203 116.822C125.227 117.11 125.239 117.458 125.239 117.866C125.239 118.274 125.227 118.626 125.203 118.922C125.187 119.21 125.135 119.45 125.047 119.642C124.959 119.826 124.815 119.962 124.615 120.05C124.415 120.13 124.135 120.17 123.775 120.17ZM123.775 119.474C123.927 119.474 124.043 119.458 124.123 119.426C124.211 119.386 124.271 119.31 124.303 119.198C124.343 119.086 124.367 118.926 124.375 118.718C124.383 118.502 124.387 118.218 124.387 117.866C124.387 117.514 124.383 117.234 124.375 117.026C124.367 116.81 124.343 116.646 124.303 116.534C124.271 116.422 124.215 116.35 124.135 116.318C124.055 116.278 123.935 116.258 123.775 116.258C123.623 116.258 123.507 116.278 123.427 116.318C123.347 116.35 123.287 116.422 123.247 116.534C123.215 116.646 123.195 116.81 123.187 117.026C123.179 117.234 123.175 117.514 123.175 117.866C123.175 118.218 123.179 118.502 123.187 118.718C123.195 118.926 123.215 119.086 123.247 119.198C123.287 119.31 123.347 119.386 123.427 119.426C123.507 119.458 123.623 119.474 123.775 119.474ZM128.239 123.998C127.879 123.998 127.599 123.954 127.399 123.866C127.199 123.778 127.055 123.642 126.967 123.458C126.879 123.274 126.823 123.038 126.799 122.75C126.783 122.454 126.775 122.102 126.775 121.694C126.775 121.286 126.783 120.938 126.799 120.65C126.823 120.354 126.879 120.114 126.967 119.93C127.055 119.738 127.199 119.598 127.399 119.51C127.599 119.422 127.879 119.378 128.239 119.378C128.591 119.378 128.867 119.426 129.067 119.522C129.275 119.61 129.423 119.746 129.511 119.93C129.599 120.114 129.651 120.354 129.667 120.65C129.691 120.938 129.703 121.286 129.703 121.694C129.703 122.102 129.691 122.454 129.667 122.75C129.651 123.038 129.599 123.278 129.511 123.47C129.423 123.654 129.275 123.79 129.067 123.878C128.867 123.958 128.591 123.998 128.239 123.998ZM128.239 123.302C128.391 123.302 128.507 123.286 128.587 123.254C128.667 123.214 128.723 123.138 128.755 123.026C128.795 122.914 128.819 122.754 128.827 122.546C128.835 122.33 128.839 122.046 128.839 121.694C128.839 121.342 128.835 121.062 128.827 120.854C128.819 120.638 128.795 120.474 128.755 120.362C128.723 120.25 128.667 120.178 128.587 120.146C128.507 120.106 128.391 120.086 128.239 120.086C128.087 120.086 127.967 120.106 127.879 120.146C127.799 120.178 127.743 120.25 127.711 120.362C127.679 120.474 127.659 120.638 127.651 120.854C127.643 121.062 127.639 121.342 127.639 121.694C127.639 122.046 127.643 122.33 127.651 122.546C127.659 122.754 127.679 122.914 127.711 123.026C127.743 123.138 127.799 123.214 127.879 123.254C127.967 123.286 128.087 123.302 128.239 123.302Z'
        fill='#FCFDFF'
      />
      <path
        d='M56.0082 95.8831C55.8478 86.7333 57.4991 77.6414 60.8681 69.1265C64.237 60.6116 69.2578 52.8401 75.6441 46.256C82.0304 39.6719 89.6572 34.4042 98.0894 30.7539C106.522 27.1037 115.594 25.1426 124.788 24.9828C133.981 24.823 143.117 26.4677 151.672 29.8228C160.227 33.1779 168.034 38.1775 174.647 44.5358C181.26 50.894 186.551 58.4864 190.216 66.8792C193.881 75.2719 195.85 84.3009 196.011 93.4507C196.171 102.601 194.52 111.692 191.151 120.207C187.782 128.722 182.761 136.494 176.375 143.078C169.989 149.662 162.362 154.93 153.93 158.58C145.498 162.23 136.425 164.191 127.232 164.351C118.038 164.511 108.902 162.866 100.347 159.511C91.7922 156.156 83.9853 151.156 77.3719 144.798C70.7586 138.44 65.4685 130.847 61.8031 122.455C58.1376 114.062 56.1686 105.033 56.0082 95.8831L56.0082 95.8831Z'
        stroke='#0D1319'
        strokeWidth='4'
      />
      <foreignObject key={netApyValue} x='0' y='0' width='252' height='190'>
        <div className={classes.count}>
          <Typography variant='gaugeMarketAPY' text={netApyValue} />
        </div>
      </foreignObject>
      <defs>
        <filter
          id='filter0_ddd_21772_45279'
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
            result='effect1_dropShadow_21772_45279'
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
            result='effect2_dropShadow_21772_45279'
          />
          <feOffset dy='-1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21772_45279'
            result='effect2_dropShadow_21772_45279'
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
            result='effect3_dropShadow_21772_45279'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4.5' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='effect2_dropShadow_21772_45279'
            result='effect3_dropShadow_21772_45279'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect3_dropShadow_21772_45279'
            result='shape'
          />
        </filter>
        <filter
          id='filter1_dd_21772_45279'
          x='13'
          y='-30'
          width='206'
          height='206'
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
          <feOffset dx='-10' dy='-22' />
          <feGaussianBlur stdDeviation='29' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.231373 0 0 0 0 0.278431 0 0 0 0 0.32549 0 0 0 0.85 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_21772_45279'
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
            result='effect2_dropShadow_21772_45279'
          />
          <feOffset dx='-2' dy='-2' />
          <feGaussianBlur stdDeviation='8' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_21772_45279'
            result='effect2_dropShadow_21772_45279'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect2_dropShadow_21772_45279'
            result='shape'
          />
        </filter>
        <filter
          id='filter2_d_21772_45279'
          x='90.4656'
          y='85.7759'
          width='70.1654'
          height='25.3905'
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
            result='effect1_dropShadow_21772_45279'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_21772_45279'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_21772_45279'
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
          id='paint1_linear_21772_45279'
          x1='126'
          y1='50'
          x2='126'
          y2='140'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#999999' />
          <stop offset='0.84375' stopColor='#2E3031' />
        </linearGradient>
      </defs>
    </svg>
  );
};
