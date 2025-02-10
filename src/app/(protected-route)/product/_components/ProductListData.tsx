'use client';
import {CustomTable} from '@/components';
import {APP_ROUTES} from '@/constants';
import {IPaginate, IProduct} from '@/lib/interfaces';
import {
  fetchDraftProductsAction,
  fetchPublishedProductsAction,
} from '@/services/product';
import {Spinner} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';
import {useDebounce} from 'use-debounce';
import {ProductColumnKey, productColumns} from '../_mock';
import RenderCellProduct from './RenderCellProduct';

type Props = {
  isDraft?: boolean;
};

const ProductListData = ({isDraft = false}: Props) => {
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [paginationRes, setPaginationRes] = useState<IPaginate>({
    page: 1,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword] = useDebounce(keyword, 500);

  const handler = isDraft
    ? fetchDraftProductsAction
    : fetchPublishedProductsAction;

  const fetchNext = useCallback(
    async (page: number, query: any = {}) => {
      setIsFetching(true);
      const res = await handler({page, ...query});
      if (res.success) {
        setProducts(res.data!);
        setPaginationRes(res);
      }
      setIsFetching(false);
    },
    [handler],
  );

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const onClickCreate = () => {
    router.push(APP_ROUTES.PRODUCTS.NEW);
  };

  useEffect(() => {
    fetchNext(1, {keyword: debouncedKeyword});
  }, [debouncedKeyword, fetchNext]);

  return (
    <div>
      <CustomTable
        dataSource={products || []}
        columns={productColumns}
        RenderCell={(product, columnKey) => (
          <RenderCellProduct product={product} columnKey={columnKey} />
        )}
        searchKeys={['name'] as ProductColumnKey[]}
        searchPlaceholder="Search products..."
        bodyProps={{
          emptyContent: 'No products found',
          isLoading: isFetching,
          loadingContent: <Spinner />,
        }}
        onClickCreate={onClickCreate}
        createText="Create new product"
        pagination={{
          page: paginationRes.page,
          total: paginationRes.total,
          onChangePage: fetchNext,
        }}
        search={{
          keyword,
          onChangeKeyword,
        }}
      />
    </div>
  );
};

export default ProductListData;
