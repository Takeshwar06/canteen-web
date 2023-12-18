import React, { useState } from 'react'

import Feedback from './Feedback'

const Button = () => {

    const [openFModal, setOpenFModal] = useState(false);

    const openFeedbackForm = () => {
        setOpenFModal(true)
    }
    const closeFeedbackForm = () => {
        setOpenFModal(false)
    }

    return (
        <>
            <button onClick={openFeedbackForm} >click me</button>
            {
                openFModal && (
                    <Feedback onClose={closeFeedbackForm} />
                )
            }

        </>
    )
}

export default Button
