import {APP_ROUTES} from '@/constants';
import {ParamsProps} from '@/lib/params';
import {fetchFaqByIdAction} from '@/services/faq';
import {Divider} from '@nextui-org/react';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {FaqForm} from '../../_components';

const page = async ({params}: ParamsProps) => {
  const id = params.id;
  const res = await fetchFaqByIdAction(id);
  const data = res.data!;

  return (
    <div className="space-y-6">
      <div className="mt-4 flex items-center gap-8">
        <Link href={APP_ROUTES.FAQS.INDEX} className="p-2">
          <ChevronLeft className="text-slate-500" />
        </Link>
        <h1 className="text-2xl font-semibold">
          Update FAQ <span className="text-primary">{data.title}</span>
        </h1>
      </div>
      <Divider />
      <FaqForm data={res.data} type="edit" />
    </div>
  );
};

export default page;
