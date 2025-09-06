
import { fetchProduct } from "@/actions/useraction";
import ProductPage from "@/components/ProductPage";



export default async function ProdPage({ params }) {

    const { id } = await params;
    const res = await fetchProduct(id);
    console.log(res);
    const product = res?.product;
    if (!product) {
        return <div>Product Not Found</div>
    }

    

    return (
        <>
        <ProductPage product={product} />
        </>
    )
}