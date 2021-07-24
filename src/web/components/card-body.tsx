import { SectData } from './card/index'

export const CardBody1 = ({ data }: { data: SectData[] }) => {
  return (
    <>
      {data.map((e, i) => (
        <div key={i}>{e.content}</div>
      ))}
    </>
  )
}
