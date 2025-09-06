import React from 'react'

export const metadata = {
  title: "Order History",
  description: "View your past orders and details.",
};


const layout = ({children}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layout