import React from 'react'
import { Input } from 'antd';
import { AiOutlineMail } from 'react-icons/ai';
import './Footer.scss';

function Footer() {
    return (
        <section className="footer">
            <div className="footer__item">
                <div className="heading">Information</div>
                <p>Privacy policy</p>
                <p>Refund policy</p>
                <p>Shipping & Return</p>
                <p>Term & conditions</p>
            </div>
            <div className="footer__item">
                <div className="heading">Quick links</div>
                <p>My account</p>
                <p>Cart</p>
                <p>Wishlist</p>
                <p>Product Compare</p>
            </div>
            <div className="footer__item">
                <div className="heading">Our store</div>
                <p>Find a location nearest you. See Our Stores</p>
                <p>+84 (0)387 392 056</p>
                <p>hello@domain.com</p>
                <p>Product Compare</p>
            </div>
            <div className="footer__item">
                <div className="heading">Subscribe</div>
                <p>Enter your email below to be the first to know about new collections and product launches.</p>
                <Input size="large" placeholder="Enter your mail" prefix={<AiOutlineMail style={{fontSize: '1.5rem', borderColor: '#000'}} />} />
            </div>
        </section>
    )
}

export default Footer
