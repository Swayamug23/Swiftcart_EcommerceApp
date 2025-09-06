import React from 'react'

export const metadata = {
  title: "Product",
  description: "View product details and information.",
};

const layout = ({children}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layout