'use client';

import {CustomTable} from '@/components';
import {IOrder, IPaginate} from '@/lib/interfaces';
import {fetchAllOrdersAction} from '@/services/order/order.action';
import {Spinner} from '@nextui-org/react';
import {useCallback, useEffect, useState} from 'react';
import {useDebounce} from 'use-debounce';
import {orderColumns} from '../_mock';
import RenderCellOrder from './RenderCellOrder';

const OrderListData = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [paginationRes, setPaginationRes] = useState<IPaginate>({
    page: 1,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword] = useDebounce(keyword, 500);

  const fetchNext = useCallback(async (page: number, query: any = {}) => {
    setIsFetching(true);
    const res = await fetchAllOrdersAction({page, ...query});
    if (res.success) {
      setOrders(res.data!);
      setPaginationRes(res);
    }
    setIsFetching(false);
  }, []);

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  useEffect(() => {
    fetchNext(1, {keyword: debouncedKeyword});
  }, [debouncedKeyword, fetchNext]);

  return (
    <CustomTable
      dataSource={orders || []}
      columns={orderColumns}
      RenderCell={(order, columnKey) => (
        <RenderCellOrder order={order} columnKey={columnKey} />
      )}
      searchKeys={['name']}
      searchPlaceholder="Search orders..."
      csvData={orders}
      showCreate={false}
      bodyProps={{
        emptyContent: 'No orders found',
        isLoading: isFetching,
        loadingContent: <Spinner />,
      }}
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
  );
};
export default OrderListData;
