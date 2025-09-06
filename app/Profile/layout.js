import React from 'react'

export const metadata = {
  title: "User Profile",
  description: "View and manage your user profile.",
};

const layout = ({children}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layout