import { APP_ROUTES } from "@/_constants"
import { ParamsProps } from "@/_lib/params"
import { redirect } from "next/navigation"

const page = ({ params }: ParamsProps) => {
  redirect(APP_ROUTES.FAQS.EDIT.replace(":id", params.id))
}

export default page
