'use client';
import {APP_ROUTES} from '@/constants';
import {
  CreateTaxFormSchema,
  UpdateTaxFormSchema,
  createTaxFormSchema,
  updateTaxFormSchema,
} from '@/lib/form-schema';
import {ITax} from '@/lib/interfaces';
import {useCreateTaxMutation, useUpdateTaxMutation} from '@/services/tax';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button, Input} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
  type?: 'new' | 'edit';
  data?: ITax;
};

const TaxForm = ({type = 'new', data}: Props) => {
  const isEdit = type === 'edit';
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<CreateTaxFormSchema | UpdateTaxFormSchema>({
    resolver: zodResolver(isEdit ? updateTaxFormSchema : createTaxFormSchema),
    defaultValues: isEdit ? data : undefined,
  });

  const router = useRouter();

  const createTaxMutation = useCreateTaxMutation();
  const updateTaxMutation = useUpdateTaxMutation(data?._id!);

  const isLoading = createTaxMutation.isPending || updateTaxMutation.isPending;

  const onSubmit = (data: CreateTaxFormSchema | UpdateTaxFormSchema) => {
    const handler = isEdit ? updateTaxMutation : createTaxMutation;
    handler.mutate(data, {
      onSuccess: data => {
        if (data.success) {
          toast.success(data.message);
          router.push(APP_ROUTES.TAXES.INDEX);
        } else {
          toast.error(data.message);
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to save tax');
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-8">
      <div className="space-y-1">
        <h3 className="font-semibold">Information</h3>
        <p className="text-sm text-slate-500">
          {isEdit ? 'Update' : 'Add'} your tax information from here
        </p>
      </div>
      <div className="flex-1 rounded-md border bg-background p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            {...register('name')}
            label="Name"
            labelPlacement="outside"
            placeholder="Global"
            variant="bordered"
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            isDisabled={isLoading}
          />
          <Input
            {...register('rate', {
              valueAsNumber: true,
            })}
            label="Rate"
            labelPlacement="outside"
            placeholder="0"
            type="number"
            min={0}
            max={100}
            variant="bordered"
            errorMessage={errors.rate?.message}
            isInvalid={!!errors.rate}
            isDisabled={isLoading}
          />
          <Input
            {...register('country')}
            label="Country"
            labelPlacement="outside"
            placeholder="Vietnam"
            variant="bordered"
            errorMessage={errors.country?.message}
            isInvalid={!!errors.country}
            isDisabled={isLoading}
          />
          <Input
            {...register('city')}
            label="City"
            labelPlacement="outside"
            placeholder="Ho Chi Minh"
            variant="bordered"
            errorMessage={errors.city?.message}
            isInvalid={!!errors.city}
            isDisabled={isLoading}
          />
          <Input
            {...register('state')}
            label="State"
            labelPlacement="outside"
            placeholder="HCM"
            variant="bordered"
            errorMessage={errors.state?.message}
            isInvalid={!!errors.state}
            isDisabled={isLoading}
          />
          <Input
            {...register('zip')}
            label="Zip"
            labelPlacement="outside"
            placeholder="780000"
            variant="bordered"
            errorMessage={errors.zip?.message}
            isInvalid={!!errors.zip}
            isDisabled={isLoading}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isDisabled={isLoading}
              isLoading={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxForm;
