import React, { Component } from 'react'
import { Result } from 'antd';


export default class ErrorBoundary extends Component {
    state = {
        hasError: false
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log(error);
    }

    render() {
        if (this.state.hasError) {
            return (<Result
                status="warning"
                title="There are some problems with your operation."
            />)
        }
        else {
            return this.props.children
        }
    }
}
