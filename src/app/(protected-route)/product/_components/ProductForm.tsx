'use client';
import {ScreenLoader} from '@/components';
import {APP_ROUTES, DEFAULT_IMAGE} from '@/constants';
import {EProductStatus, EProductType} from '@/lib/enums';
import {
  CreateProductFormSchema,
  UpdateProductFormSchema,
  createProductFormSchema,
  updateProductFormSchema,
} from '@/lib/form-schema';
import {
  IBrand,
  ICategory,
  IProduct,
  IShipping,
  ITax,
  IVariant,
} from '@/lib/interfaces';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/services/product';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import titleize from 'titleize';
import {BrandSelect, CategorySelect} from '../../_components';
import VariantForm from './VariantForm';

const CloudinaryPlugin = dynamic(
  () => import('@/plugins').then(r => r.CloudinaryPlugin),
  {
    ssr: false,
    loading: () => <ScreenLoader />,
  },
);

type Props = {
  type?: 'new' | 'edit';
  data?: IProduct;
  brands: IBrand[];
  categories: ICategory[];
  taxes: ITax[];
  shippingFees: IShipping[];
};

const ProductForm = ({
  type = 'new',
  data,
  brands,
  categories,
  shippingFees,
  taxes,
}: Props) => {
  const isEdit = type === 'edit';
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
  } = useForm<CreateProductFormSchema | UpdateProductFormSchema>({
    resolver: zodResolver(
      isEdit ? updateProductFormSchema : createProductFormSchema,
    ),
    defaultValues: isEdit
      ? ({
          ...data,
          category: (data?.category as ICategory)._id,
          brand: data?.brand ? (data?.brand as IBrand)._id : '',
          shippingFee: (data?.shippingFee as IShipping)._id || '',
          tax: (data?.tax as ITax)._id || '',
        } as any)
      : {
          thumbnail: DEFAULT_IMAGE,
          isDraft: false,
          type: EProductType.SIMPLE,
          quantity: 0,
          discount: 0,
          status: EProductStatus.ACTIVE,
          variants: [],
        },
  });

  const router = useRouter();
  const params = useParams();
  const [showThumbnailPlugin, setShowThumbnailPlugin] = useState(false);
  const [variants, setVariants] = useState<IVariant[]>([]);

  useEffect(() => {
    if (data && data.type === EProductType.VARIABLE) {
      const _variants = (data.variants || []) as IVariant[];
      setVariants(_variants);
    }
  }, [data]);

  useEffect(() => {
    if (watch('type') === EProductType.VARIABLE) {
      const totalQuantity = variants.reduce(
        (acc, item) => acc + item.amount,
        0,
      );
      setValue('quantity', totalQuantity);
      setValue('variants', variants as IVariant[]);
    } else {
      setValue('quantity', data?.quantity || 0);
    }
  }, [data?.quantity, setValue, variants, watch]);

  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation(data?._id!);

  const isLoading =
    createProductMutation.isPending || updateProductMutation.isPending;

  const onSubmit = (
    data: CreateProductFormSchema | UpdateProductFormSchema,
  ) => {
    const handler = isEdit ? updateProductMutation : createProductMutation;

    handler.mutate(data, {
      onSuccess: data => {
        if (data.success) {
          toast.success(data.message);
          router.push(APP_ROUTES.PRODUCTS.INDEX);
        } else {
          toast.error(data.message);
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to save product');
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-8">
      <div className="space-y-1">
        <h3 className="font-semibold">Information</h3>
        <p className="text-sm text-slate-500">
          {isEdit ? 'Update' : 'Add'} your product information from here
        </p>
      </div>
      <div className="flex-1 rounded-md border bg-background p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            {...register('name')}
            label="Name"
            labelPlacement="outside"
            placeholder="Name of the product"
            variant="bordered"
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            isDisabled={isLoading}
          />
          <Input
            {...register('displayPrice', {
              valueAsNumber: true,
            })}
            label="Display Price"
            labelPlacement="outside"
            placeholder="Price of the product"
            variant="bordered"
            errorMessage={errors.displayPrice?.message}
            isInvalid={!!errors.displayPrice}
            isDisabled={isLoading}
            endContent="$"
          />
          <BrandSelect
            {...register('brand')}
            brandList={brands}
            variant="bordered"
            labelPlacement="outside"
          />
          <CategorySelect
            {...register('category')}
            categoryList={categories}
            variant="bordered"
            labelPlacement="outside"
          />
          {/* <Select
            {...register("category")}
            label='Category'
            labelPlacement='outside'
            description='Select the category of the product'
            placeholder='Select category'
            variant='bordered'
          >
            {categories.map((category) => (
              <SelectItem key={category._id!} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </Select> */}
          <Select
            {...register('shippingFee')}
            label="Shipping Fee"
            labelPlacement="outside"
            description="Select the shipping fee of the product"
            placeholder="Select shipping fee"
            variant="bordered">
            {shippingFees.map(shippingFee => (
              <SelectItem
                key={shippingFee._id!}
                value={shippingFee._id}
                textValue={`${shippingFee.name} - ${shippingFee.type} - ${shippingFee.amount}`}>
                {shippingFee.name} - {shippingFee.type} - {shippingFee.amount}
              </SelectItem>
            ))}
          </Select>
          <Select
            {...register('tax')}
            label="Tax"
            labelPlacement="outside"
            description="Select the tax of the product"
            placeholder="Select tax"
            variant="bordered">
            {taxes.map(tax => (
              <SelectItem
                key={tax._id!}
                value={tax._id}
                textValue={`${tax.name} - ${tax.rate}`}>
                {tax.name} - {tax.rate}
              </SelectItem>
            ))}
          </Select>
          <Textarea
            {...register('description')}
            label="Description"
            labelPlacement="outside"
            placeholder="Description of the product"
            variant="bordered"
            errorMessage={errors.description?.message}
            isInvalid={!!errors.description}
            isDisabled={isLoading}
            disableAutosize
            disableAnimation
            classNames={{
              input: 'resize-y min-h-20',
            }}
          />

          <Checkbox {...register('isDraft')} isDisabled={isLoading}>
            Draft
          </Checkbox>

          <div className="flex">
            <div className="w-1/3">
              <p className="mb-2 text-sm">Thumbnail</p>
              <Button
                color="primary"
                variant="bordered"
                onClick={() => setShowThumbnailPlugin(true)}>
                Choose Thumbnail
              </Button>
            </div>
            <div className="ml-4 w-2/3">
              <div className="size-fit rounded border border-dashed p-4">
                <div className="relative">
                  <Image
                    src={watch('thumbnail') as string}
                    alt="coupon"
                    objectFit="contain"
                    width={400}
                    height={300}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
            {showThumbnailPlugin && (
              <CloudinaryPlugin
                visible={showThumbnailPlugin}
                onClose={() => setShowThumbnailPlugin(false)}
                onUploadSuccess={({urls}) => setValue('thumbnail', urls[0])}
                assetType="image"
                multiple={false}
                folder="image/product/thumbnail"
              />
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Select
              {...register('type')}
              label="Type"
              labelPlacement="outside"
              description="Select the type of the product"
              variant="bordered"
              disallowEmptySelection>
              {Object.values(EProductType).map(item => (
                <SelectItem key={item} value={item}>
                  {titleize(item)}
                </SelectItem>
              ))}
            </Select>
            {watch('type') === EProductType.VARIABLE && (
              <VariantForm
                displayPrice={watch('displayPrice')}
                variants={variants}
                setVariants={setVariants}
              />
            )}
          </div>

          <Input
            {...register('quantity', {
              valueAsNumber: true,
            })}
            label="Quantity"
            labelPlacement="outside"
            placeholder="Quantity of the product"
            variant="bordered"
            errorMessage={errors.quantity?.message}
            isInvalid={!!errors.quantity}
            isDisabled={isLoading}
            isReadOnly={watch('type') === EProductType.VARIABLE}
            description={
              watch('type') === EProductType.VARIABLE &&
              'You cannot modify product quantity when the product type is variable. Quantity will be calculated based on the variants.'
            }
            value={(watch('quantity') || 0).toString()}
          />

          <Input
            {...register('discount', {
              valueAsNumber: true,
            })}
            label="Discount"
            labelPlacement="outside"
            placeholder="Discount of the product"
            variant="bordered"
            errorMessage={errors.discount?.message}
            isInvalid={!!errors.discount}
            isDisabled={isLoading}
            endContent="%"
          />

          <Select
            {...register('status')}
            label="Status"
            labelPlacement="outside"
            description="Select the status of the product"
            placeholder="Select status"
            variant="bordered">
            {Object.values(EProductStatus).map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </Select>

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

export default ProductForm;
