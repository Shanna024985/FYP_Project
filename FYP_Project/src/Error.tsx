import { Button } from './components/ui/button'
import { useNavigate } from 'react-router-dom'

type Props = {
    status: number,
    description: string,
    pageLinkForRedirect:string,
    pageForRedirect: string
}

const Error = (props: Props) => {
    let navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
        <h1 className='text-5xl'>❗</h1>
        <h1 className='text-5xl !text-black'>Error {props.status.toString()}</h1>
        <p className='text-lg mt-2'>{props.description}</p>
        <Button className='mt-4' onClick={(e)=>{
            e.preventDefault(); 
            navigate(props.pageLinkForRedirect,{replace: true})}}>Back to {props.pageForRedirect}</Button>
    </div>
  )
}

export default Error