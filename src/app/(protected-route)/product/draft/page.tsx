import {CACHE_KEY} from '@/constants';
import {Spinner} from '@nextui-org/react';
import dynamic from 'next/dynamic';
import {PageHeader} from '../../_components';

const ProductListData = dynamic(
  () => import('../_components/ProductListData'),
  {
    ssr: false,
    loading: () => <Spinner />,
  },
);

const page = async () => {
  return (
    <div>
      <PageHeader
        title="Draft Products"
        keyCache={CACHE_KEY.PRODUCT.GET_DRAFT}
      />
      <ProductListData isDraft />
    </div>
  );
};

export default page;
