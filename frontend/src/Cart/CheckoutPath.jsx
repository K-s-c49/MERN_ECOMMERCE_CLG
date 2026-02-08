import React from 'react'
import '../CartStyles/CheckoutPath.css'
import { AccountBalanceWallet, LibraryAddCheck, LocalShipping } from '@mui/icons-material'

function CheckoutPath({ activePath }) {
    const Path=[
        {
            label:"Shipping Details",
            icon:<LocalShipping />
        },
        {
            label:"Confirm Order",
            icon:<LibraryAddCheck />
        },
        {
            label:"Payment",
            icon:<AccountBalanceWallet />
        }
    ]
  return (
    <div className='checkoutPath'>
        {Path.map((item,index)=> (<div className='checkoutPath-step' key={index} active={activePath===index ? 'true':'false'} compeleted={activePath>=index ?'true':'false'}>
            <p className='checkoutPath-icon'>{item.icon}</p>
            <p className='checkoutPath-label'>{item.label}</p>
        </div>))}
    </div>
  )
}

export default CheckoutPath
