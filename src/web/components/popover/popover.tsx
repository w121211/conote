import classes from './popover.module.scss'

const Popover = ({
  children,
  visible,
  hideBoard,
  subTitle,
}: // width,
{
  children: React.ReactNode
  visible: boolean
  hideBoard: () => void
  subTitle: JSX.Element
  // width?: number
}) => {
  return (
    <div
      className={classes.containerouter}
      style={{
        visibility: `${visible ? 'visible' : 'hidden'}`,
        // width: `${typeof width === 'number' ? width + 'px' : 'initial'}`,
      }}
    >
      <span
        onClick={(e: any) => {
          e.stopPropagation()
          hideBoard()
        }}
      >
        back
      </span>
      {subTitle}
      {children}
    </div>
  )
}

export default Popover
