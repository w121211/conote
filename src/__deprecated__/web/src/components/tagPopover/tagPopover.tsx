import React, { useState } from 'react';
import { Popover, Tag } from 'antd';
import classes from './tagPopover.module.scss'

interface props {
    index: number
    tagClassName: string
    tagContent: string
}

const TagPopover: React.FC<props> = (props) => {

    const [up, setUp] = useState(0)
    const [down, setDown] = useState(0)

    const upHandler = () => {
        setUp(up + 1)
    }
    const downHandler = () => {
        setDown(down + 1)
    }

    const popoverContent = (
        <div>
            <span onClick={upHandler}>Up<b>{up}</b></span>
            <span onClick={downHandler}>Down<b>{down}</b></span>
        </div>
    )

    const tagContent = (content: string) => {

        const upDown = up - down
        return upDown > 0 ? content + `(+${upDown})` : content + `(${upDown})`

    }

    return (<Popover className={classes.popover} content={popoverContent}>
        <Tag className={props.tagClassName} key={props.index}>{tagContent(props.tagContent)}</Tag>
    </Popover>)
}
export default TagPopover