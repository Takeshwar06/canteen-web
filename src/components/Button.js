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
            <button onClick={openFeedbackForm} style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-dark)", border: "1px solid var(--primary)", borderRadius: "var(--radius-pill)", padding: "4px 14px", fontWeight: 600 }}>click me</button>
            {
                openFModal && (
                    <Feedback onClose={closeFeedbackForm} />
                )
            }

        </>
    )
}

export default Button
