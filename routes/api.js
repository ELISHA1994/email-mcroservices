import express from "express";

const router = express.Router()

router.get('/:action', async (req, res, next) => {
    let action = req.params.action;

    if (action === 'send') { // send email
        return res.status(200).json({
            confirmation: 'success',
            action: action
        })
    }

    return res.status(501).json({
        confirmation: 'error',
        message: 'Invalid action'
    })
})


export default router
