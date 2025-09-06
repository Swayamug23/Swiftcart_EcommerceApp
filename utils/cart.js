export function getCart(){
    if(typeof window !== "undefined"){
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart) : [];
    }
    return [];
}

export function addToCart(product){
    const cart = getCart();

    const exist = cart.find(item => item.id === product.id);
    if(exist){
        exist.quantity += 1;
    }else{
        cart.push({...product, quantity: 1});
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(productId){
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
}


