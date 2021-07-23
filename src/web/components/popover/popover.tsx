import classes from './popover.module.scss'

const Popover = ({
  children,
  visible,
  hideBoard,
  subTitle,
}: {
  children: React.ReactNode
  visible: boolean
  hideBoard: () => void
  subTitle: JSX.Element
}) => {
  return (
    <div className={classes.containerouter} style={visible ? { visibility: 'visible' } : { visibility: 'hidden' }}>
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
