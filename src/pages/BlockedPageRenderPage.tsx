import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlockedPageRenderPage:React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className='h-[calc(100vh-50px)] flex flex-col gap-[20px] justify-center items-center'>
    <img src="/development.png" alt="project under developent" className='w-[400px] opacity-30'/>
    <p className='text-slate-600 text-[20px]'>This page under development </p>
    <Button onClick={()=>navigate(-1)} className='max-w-max bg-cyan-700 hover:bg-cyan-600 shadow-slate-500'>Go Back</Button>
    </div>
  )
}

export default BlockedPageRenderPage
