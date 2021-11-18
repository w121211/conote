import React from 'react'
import classes from './shotBtn.module.scss'

const ShotBtn = ({ author, target, choice }: { author?: string; target?: string; choice?: string }) => {
  return (
    <button className="noStyle">
      <svg
        id="shotBtn"
        className={classes.svg}
        data-name="shotBtn"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="0 0 150.5 20"
        preserveAspectRatio="xMidYMid meet"
      >
        <g id="组_1" data-name="组 1">
          <rect
            id="矩形_3"
            data-name="矩形 3"
            width="115"
            height="19"
            rx="2"
            transform="translate(0.5 0.5)"
            fill="#fcfcfc"
          />
          <rect
            id="矩形_4"
            data-name="矩形 4"
            width="29"
            height="19"
            rx="2"
            transform="translate(121.5 0.5)"
            fill="#4d8b17"
          />
          <path id="路径_2" data-name="路径 2" d="M0,0H.5V5H0Z" transform="translate(121 7.5)" fill="none" />
          <path id="路径_1" data-name="路径 1" d="M121.5,6.5l-3,3v1l3,3" fill="#4d8b17" />
        </g>
        <g id="组_2" data-name="组 2">
          <path
            id="llink"
            d="M2,0H113a2,2,0,0,1,2,2V17a2,2,0,0,1-2,2H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0Z"
            transform="translate(0.5 0.5)"
            fill="#f2f2f2"
            stroke="#d5d5d5"
            strokeWidth="1"
          />
          <text
            id="shotBtn"
            data-name="@投資Sci_Fi・$IPOE"
            transform="translate(57.5 15)"
            fill="#fff"
            fontSize="11"
            fontFamily=" Helvetica Neue"
          >
            <tspan x="-52.668" y="0">
              @
            </tspan>
            <tspan y="0" fontFamily=" PingFang SC">
              {author?.substr(1)}
            </tspan>
            {/* <tspan y="0"></tspan> */}
            <tspan y="0" fontFamily="PingFangSC-Semibold, PingFang SC" fontWeight="600">
              ・
            </tspan>
            <tspan y="0" fontWeight="600">
              {target}
            </tspan>
          </text>
          <text
            id="shotBtn-2"
            data-name="@投資Sci_Fi・$IPOE"
            transform="translate(57.5 14)"
            fill="#333"
            fontSize="11"
            fontFamily=" Helvetica Neue"
          >
            <tspan x="-52.668" y="0">
              @
            </tspan>
            <tspan y="0" fontFamily=" PingFang SC">
              {author?.substr(1)}
            </tspan>
            {/* <tspan y="0">Sci_Fi</tspan> */}
            <tspan y="0" fontFamily="PingFangSC-Semibold, PingFang SC" fontWeight="600">
              ・
            </tspan>
            <tspan y="0" fontWeight="600">
              {target}
            </tspan>
          </text>
          <text
            id="rlink"
            transform="translate(130.5 14)"
            fill="#fff"
            fontSize="11"
            fontFamily="PingFangSC-Semibold, PingFang SC"
            fontWeight="600"
          >
            <tspan x="-5.5" y="0">
              {choice && choice.replace('#LONG', '看多').replace('#SHORT', '看空').replace('#HOLD', '觀望')}
            </tspan>
          </text>
        </g>
      </svg>
    </button>
  )
}
export default ShotBtn
