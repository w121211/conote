import { title } from 'process'
import { useForm } from 'react-hook-form'
import classes from './header-form.module.scss'

type FormInputs = {
  title: string
  authorChoice: string
  authorLines: string
}

const HeaderForm = ({ initialValue }: { initialValue: FormInputs }) => {
  const { register, handleSubmit, setValue } = useForm<FormInputs>()
  const onSubmit = d => console.log(d)
  if (initialValue) {
    initialValue.title && setValue('title', initialValue.title)
    initialValue.title && setValue('authorChoice', initialValue.authorChoice)
    initialValue.title && setValue('authorLines', initialValue.authorLines)
  }
  return (
    <div className={classes.formContainer}>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.section}>
          {/* <label>Symbol/Topic</label> */}
          <input type="text" {...register('title')} placeholder="Symbol 或 Topic" />
        </div>
        <div className={classes.section}>
          <div className={classes.choiceWrapper}>
            <label>@作者</label>
            <div className={classes.radioWrapper}>
              <label className={classes.radioLabel}>
                <input {...register('authorChoice')} type="radio" value="buy" />
                <svg width="32" height="32" viewBox="-4 -4 39 39" aria-hidden="true" focusable="false">
                  {/* <!-- The background --> */}
                  <rect
                    className={classes.checkBg}
                    width="35"
                    height="35"
                    x="-2"
                    y="-2"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="3"
                    rx="6"
                    ry="6"
                  ></rect>
                  {/* <!-- The checkmark--> */}
                  <polyline
                    className={classes.checkMark}
                    points="4,14 12,23 28,5"
                    stroke="transparent"
                    strokeWidth="4"
                    fill="none"
                  ></polyline>
                </svg>
                <span>買</span>
              </label>
              <label className={classes.radioLabel}>
                <input {...register('authorChoice')} type="radio" value="sell" />
                <svg width="32" height="32" viewBox="-4 -4 39 39" aria-hidden="true" focusable="false">
                  {/* <!-- The background --> */}
                  <rect
                    className={classes.checkBg}
                    width="35"
                    height="35"
                    x="-2"
                    y="-2"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="3"
                    rx="6"
                    ry="6"
                  ></rect>
                  {/* <!-- The checkmark--> */}
                  <polyline
                    className={classes.checkMark}
                    points="4,14 12,23 28,5"
                    stroke="transparent"
                    strokeWidth="4"
                    fill="none"
                  ></polyline>
                </svg>
                <span>賣</span>
              </label>
              <label className={classes.radioLabel}>
                <input {...register('authorChoice')} type="radio" value="looking" />
                <svg width="32" height="32" viewBox="-4 -4 39 39" aria-hidden="true" focusable="false">
                  {/* <!-- The background --> */}
                  <rect
                    className={classes.checkBg}
                    width="35"
                    height="35"
                    x="-2"
                    y="-2"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="3"
                    rx="6"
                    ry="6"
                  ></rect>
                  {/* <!-- The checkmark--> */}
                  <polyline
                    className={classes.checkMark}
                    points="4,14 12,23 28,5"
                    stroke="transparent"
                    strokeWidth="4"
                    fill="none"
                  ></polyline>
                </svg>
                <span>觀望</span>
              </label>
            </div>
          </div>
          <input type="text" {...register('authorLines')} placeholder="來源作者看法" />
        </div>
      </form>
    </div>
  )
}
export default HeaderForm
