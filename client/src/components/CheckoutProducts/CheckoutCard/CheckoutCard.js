import React from 'react'
import './CheckoutCard.scss'

function CheckoutCard({ image, name, number, price, brand }) {
    return (
        <div className="checkout__card">
            <img src={`data:image/png;base64,${image}`} alt="" />
            <div className="info">
                <div>{name}</div>
                <p>Brand: {brand}</p>
                <p>x{number}</p>
            </div>
            <div className="price">${price}</div>
        </div>
    )
}

export default CheckoutCard
