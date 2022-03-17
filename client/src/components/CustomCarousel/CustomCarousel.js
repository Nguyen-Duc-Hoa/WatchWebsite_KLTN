import React from 'react'
import './CustomCarousel.scss';
import { Carousel } from 'antd';

function CustomCarousel() {
    return (
        <div className='carousel'>
            <Carousel autoplay>
                <div>
                    <img src={'https://cdn.shopify.com/s/files/1/1063/3618/files/gallerie-002_3024x.jpg?v=1591999841'} alt='' />
                </div>
                <div>
                    <img src={'https://cdn.shopify.com/s/files/1/1063/3618/files/gallerie-001_3024x.jpg?v=1591999616'} alt='' />
                </div>
            </Carousel>
        </div>
    )
}

export default CustomCarousel
