
import { fetchOrder } from "@/actions/useraction";
import OrderPage from "@/components/OrderPage";



export default async function OrdPage({ params }) {

    const { id } = await params;
    const res = await fetchOrder(id);
    console.log(res);
    const order = res?.order;
    if (!order) {
        return <div>Order Not Found</div>
    }

    

    return (
        <>
        <OrderPage order={order} />
        </>
    )
}


