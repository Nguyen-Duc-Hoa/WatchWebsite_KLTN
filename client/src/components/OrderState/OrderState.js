import React from 'react'
import { Steps } from 'antd';

const { Step } = Steps;
const state = [
    {
        key: 0,
        value: 'Waiting'
    },
    {
        key: 1,
        value: 'Confirmed'
    },
    {
        key: 2,
        value: 'Delivering'
    },
    {
        key: 3,
        value: 'Completed'
    },
    {
        key: 4,
        value: 'Cancelled'
    },
]
function OrderState({ currentStep, setCurrentStep }) {
    const currState = state.find(ele => ele.value === currentStep)
    return (
        <Steps current={currState.key} direction='vertical'>
            {
                state.map(({ key, value }) => (
                    <Step title={value} key={key} onClick={() => setCurrentStep && setCurrentStep(value)} />
                ))
            }
        </Steps>
    )
}

export default OrderState
