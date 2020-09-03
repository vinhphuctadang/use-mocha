let router = require('express').Router()
let db = require('./db')

// check auth module

router.get('/', async(req, res)=>{
    res.send({
        'ok': 1,
        'status': 'running'
    })
})

// login
router.post('/', async(req, res) => {
    let {
        username, 
        password 
    } = req.body

    // assign username to session
    req.session.username = username
    
    let log = await req.session.save()
    console.log('Session id:', req.sessionID)
    
    res.send({
        ok: 1,
        sessionID: req.sessionID
    })
})

// query login status
router.get('/me', async(req, res)=>{
    
    // if session found
    if (!req.session.username) {
        res.send({
            ok: 0,
            status: 'unauthenticated'
        })
        return
    }

    // session
    res.send(
        {
            ok: 1,
            username: req.session.username
        }
    )
})

// logout
router.delete('/', async(req, res) => {
    req.session.destroy()
    res.send({
        ok: 1,
        status: 'loggedOut'
    })
})

module.exports = router
