import EditUser from '@/components/EditUser'
import React from 'react'
import { fetchuser } from '@/actions/useraction'



export default async function editUserPage({ params }) {

    const { id } = await params;
    const res = await fetchuser(id);

    console.log(res);
    


    return (
        <>
        <EditUser user={res} />
        </>
    )
}
