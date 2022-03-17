import React from 'react'
import './ProductCard.scss'
import { useHistory } from 'react-router'

function ProductCard({image, name, price, brand, addToCartHandler, productId}) {
    const history = useHistory()
    const clickProductHandler = (event) => {
        history.push(`/products/${productId}`)
    }
    return (
        <div className='productCard' onClick={clickProductHandler}>
            <div className="imageAndButton">
                <img src={`data:image/png;base64,${image}`} alt="" />
                <button onClick={(event) => addToCartHandler(event, productId)}>Choose</button>
            </div>
            <div className="name">{name}</div>
            <div className="price">{brand}</div>
            <div className="price">${price}</div>
        </div>
    )
}

export default ProductCard
