import classes from './my-editBtn-popover.module.scss'
const MyEditBtnPopover = ({ showHeaderFormHandler }: { showHeaderFormHandler: () => void }) => {
  return (
    <div className={classes.container}>
      <ul>
        <li onClick={showHeaderFormHandler}>編輯表頭</li>
        <li>編輯表身</li>
      </ul>
    </div>
  )
}
export default MyEditBtnPopover
