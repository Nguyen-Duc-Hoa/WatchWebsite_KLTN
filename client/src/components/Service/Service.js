import React from 'react'
import './Service.scss'

function Service({image, heading, text}) {
    return (
        <div className='serivce-item'>
            <div className="icon">
                <img src={image} alt="" />
            </div>
            <div className="text">
                <div>{heading}</div>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default Service
