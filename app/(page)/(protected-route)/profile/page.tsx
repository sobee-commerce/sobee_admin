import { getCurrentUser } from "@/_actions"
import Image from "next/image"
import { ChangePasswordForm, SimpleInfoSection, UpdateUserInfoForm, UserInfoSection } from "./_components"

const Page = async () => {
  const res = await getCurrentUser()
  const userInfo = res.data?.user!
  return (
    <div className='grid gap-4 md:grid-cols-[40%_auto]'>
      <div className='flex flex-col gap-4'>
        <SimpleInfoSection userInfo={userInfo} />
        <UserInfoSection userInfo={userInfo} />
        <div className='grid flex-1 place-items-center rounded-md bg-background p-2 shadow-custom-light'>
          <Image src={"/logo_text_light.png"} alt='logo' width={400} height={200} className='object-cover' />
        </div>
      </div>
      <div className='space-y-4'>
        <UpdateUserInfoForm userInfo={userInfo} />
        <ChangePasswordForm />
      </div>
    </div>
  )
}
export default Page
