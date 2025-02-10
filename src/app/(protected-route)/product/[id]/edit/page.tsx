import {APP_ROUTES} from '@/constants';
import {IBrand, ICategory, IProduct, IShipping, ITax} from '@/lib/interfaces';
import {ParamsProps} from '@/lib/params';
import {fetchAllBrandsAction} from '@/services/brand';
import {fetchAllCategoriesAction} from '@/services/category';
import {fetchProductByIdAction} from '@/services/product';
import {fetchAllShippingsAction} from '@/services/shipping/shipping.action';
import {fetchAllTaxesAction} from '@/services/tax/tax.action';
import {Divider} from '@nextui-org/react';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {ProductForm} from '../../_components';

const page = async ({params}: ParamsProps) => {
  const id = params.id;

  let product = {} as IProduct;
  const productFetch = await fetchProductByIdAction(id);
  if (productFetch.success) {
    product = productFetch.data!;
  }
  let brands = [] as IBrand[];
  let categories = [] as ICategory[];
  let shippingFees = [] as IShipping[];
  let taxes = [] as ITax[];
  const brandFetch = fetchAllBrandsAction();
  const categoryFetch = fetchAllCategoriesAction();
  const shippingFeeFetch = fetchAllShippingsAction();
  const taxFetch = fetchAllTaxesAction();

  const [brandRes, categoryRes, shippingRes, taxRes] = await Promise.all([
    brandFetch,
    categoryFetch,
    shippingFeeFetch,
    taxFetch,
  ]);

  if (brandRes.success) {
    brands = brandRes.data!;
  }
  if (categoryRes.success) {
    categories = categoryRes.data!;
  }

  if (shippingRes.success) {
    shippingFees = shippingRes.data!;
  }

  if (taxRes.success) {
    taxes = taxRes.data!;
  }

  return (
    <div className="space-y-6">
      <div className="mt-4 flex items-center gap-8">
        <Link href={APP_ROUTES.PRODUCTS.INDEX} className="p-2">
          <ChevronLeft className="text-slate-500" />
        </Link>
        <h1 className="text-2xl font-semibold">
          Update Product <span className="text-primary">{product.name}</span>
        </h1>
      </div>
      <Divider />
      <ProductForm
        data={product}
        type="edit"
        brands={brands}
        categories={categories}
        shippingFees={shippingFees}
        taxes={taxes}
      />
    </div>
  );
};

export default page;
