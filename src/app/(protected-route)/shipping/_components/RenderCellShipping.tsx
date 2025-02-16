'use client';

import {APP_ROUTES} from '@/constants';
import {IShipping} from '@/lib/interfaces';
import {useDeleteShippingMutation} from '@/services/shipping';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import {SquarePen, Trash2} from 'lucide-react';
import Link from 'next/link';
import {Key, useState} from 'react';
import toast from 'react-hot-toast';
import {ShippingColumnKey} from '../_mock';

type Props = {
  shipping: IShipping;
  columnKey: Key;
};

const RenderCellShipping = ({shipping, columnKey}: Props) => {
  const cellValue = shipping[columnKey as keyof IShipping];
  const [showPopover, setShowPopover] = useState(false);

  const deleteShippingMutation = useDeleteShippingMutation();

  const isLoading = deleteShippingMutation.isPending;

  const onDelete = () => {
    deleteShippingMutation.mutate(shipping._id!, {
      onSuccess: data => {
        if (data.success) {
          toast.success(data.message);
          setShowPopover(false);
        } else {
          toast.error(data.message);
        }
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to delete shipping',
        );
      },
    });
  };

  switch (columnKey as ShippingColumnKey) {
    case 'name':
      return shipping.name;
    case 'amount':
      return shipping.amount;
    case 'type':
      return shipping.type;
    case 'actions':
      return (
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            color="primary"
            as={Link}
            href={APP_ROUTES.SHIPPINGS.EDIT.replace(':id', shipping?._id!)}>
            <SquarePen size={20} />
          </Button>
          <Popover
            placement="right"
            isOpen={showPopover}
            onOpenChange={setShowPopover}
            showArrow>
            <PopoverTrigger>
              <Button
                isIconOnly
                variant="light"
                color="danger"
                size="sm"
                onClick={() => console.log('delete')}>
                <Trash2 size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2 self-end px-1 py-2">
                <p className="font-bold">Delete confirmation</p>
                <p>
                  Are you sure you want to delete <b>{shipping.name}</b>{' '}
                  shipping?
                </p>
                <div className="flex justify-end space-x-2">
                  <Button color="danger" onClick={onDelete} size="sm">
                    {isLoading ? 'Deleting...' : 'Yes'}
                  </Button>
                  <Button
                    color="default"
                    onClick={() => setShowPopover(false)}
                    size="sm">
                    No
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    default:
      return <>{cellValue ?? ''}</>;
  }
};

export default RenderCellShipping;
