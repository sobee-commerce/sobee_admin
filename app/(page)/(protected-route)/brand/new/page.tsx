import { APP_ROUTES } from "@/_constants"
import { Divider } from "@nextui-org/react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import React from "react"
import { BrandForm } from "../_components"

const page = () => {
  return (
    <div className='space-y-6'>
      <div className='mt-4 flex items-center gap-8'>
        <Link href={APP_ROUTES.BRANDS.INDEX} className='p-2'>
          <ChevronLeft className='text-slate-500' />
        </Link>
        <h1 className='text-2xl font-semibold'>Add Brand</h1>
      </div>
      <Divider />
      <BrandForm />
    </div>
  )
}

export default page
