import React from 'react'
import Header from '../Header/Header'
import Cart from '../Header/Cart/Cart'
import Sidebar from '../Header/Sidebar/Sidebar'
import Footer from '../Footer/Footer'
import BackTopBtn from '../BackTopBtn/BackTopBtn'
import Overlay from '../Overlay/Overlay'

function UserLayout({ children }) {
    return (
        <>
            <Header />
            <Sidebar />
            <Cart />
            {children}
            <Footer />
            <BackTopBtn />
            <Overlay />
        </>
    )
}

export default UserLayout
