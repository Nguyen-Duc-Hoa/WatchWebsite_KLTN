import React from 'react'
import { BackTop } from 'antd'
import { AiOutlineArrowUp } from 'react-icons/ai'

const style = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: '50%',
    backgroundColor: '#000',
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

function BackTopBtn() {
    return (
        <BackTop style={{zIndex: 2}}>
            <div style={style}>
                <AiOutlineArrowUp />
            </div>
        </BackTop>
    )
}

export default BackTopBtn
