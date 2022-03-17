import React from 'react'
import { Pagination } from 'antd'
import './Pagination.scss'

function Paging({ currentPage, totalPage, setCurrentPage, noPadding }) {
    const onShowSizeChange = (current) => {
        setCurrentPage(current)
    }

    return (
        <Pagination
            responsive
            style={!noPadding ? { padding: '40px', textAlign: 'center' } : {textAlign: 'right'}}
            current={currentPage}
            showSizeChanger={false}
            total={totalPage * 10}
            onChange={onShowSizeChange} />
    )
}

export default Paging
