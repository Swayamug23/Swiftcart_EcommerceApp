"use server"

import User from "@/models/User"    
import Product from "@/models/Products"
import connectDb from "@/utils/connectDb"
import Order from "@/models/Order"

export const fetchuser = async (id) => {
    await connectDb()
    let u = await User.findById(id)
    if (!u) return null;

    const user = u.toObject({ flattenObjectIds: true })

    return user
}

export const fetchUsers = async () => {
    await connectDb()
    let users = await User.find({})
    if (!users) return null;
    
    const usersArr = users.map(u => u.toObject({ flattenObjectIds: true }));
    return { users: usersArr };
}


export const deleteUser = async (id) => {
    await connectDb()
    let user = await User.findByIdAndDelete(id)
    // confirm before deleting


    if (!user) return { error: "User not found" }
    return { message: "User deleted successfully" }
} 


export const fetchProducts = async () => {
  await connectDb();
  let products = await Product.find({});
  if (!products) return null;
  // Convert each product document to a plain object
  const productsArr = products.map(p => p.toObject({ flattenObjectIds: true }));
  return { products: productsArr };
}
export const fetchProduct = async (id) => {
  await connectDb();
  if(id){
        let product = await Product.findById(id);
        if (!product) return null;
        return { product: product.toObject({ flattenObjectIds: true }) };
  }
  
  // Convert each product document to a plain object
  const productsArr = products.map(p => p.toObject({ flattenObjectIds: true }));
  return { products: productsArr };
}

export const fetchOrder = async (id) => {
  await connectDb();
  if(id){
        let order = await Order.findById(id);
        if (!order) return null;
        return { order: order.toObject({ flattenObjectIds: true }) };
  }
    return null;
}

export const updateProfile = async (data, oldname) => {
    await connectDb()
    let ndata = Object.fromEntries(data)

    // If the username is being updated, check if username is available
    if (oldname !== ndata.name) {
        let u = await User.findOne({ username: ndata.name })
        if (u) {
            return { error: "Username already exists" }
        }   
        await User.updateOne({email: ndata.email}, ndata)
        // Now update all the usernames in the Payments table 
        
        
    }
    else{

        
        await User.updateOne({email: ndata.email}, ndata)
    }


}

export const handleAdmin = async (id, isAdmin) => {
    await connectDb()
    let user = await User.findById(id)
    if (!user) return { error: "User not found" }
    if(user.role === 'admin') {
        user.role = 'user'
    } else {
        user.role = 'admin'
    }
    await user.save()
    return { message: "User role updated successfully" }
}

