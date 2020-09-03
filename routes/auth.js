let router = require('express').Router()
let db = require('./db')

function requireLoggedIn(req, res, next) {
    if (req.session.username) {
        next()
    }            
    else {
        res.status(401).send({
            ok: 0,
            flag: 'unauthenticated'
        })
    }
}
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

    if (req.session.username) {
        res.send({
            ok: 1,
            flag: 'alreadyLoggedIn'
        })
        return
    }

    let user = await db.models.User.findOne(
        {
            username: username, 
            password: password
        }
    )

    if (!user) {
        res.status(401).send({
            ok: 0,
            sessionID: '',
            flag: 'invalidUser'
        })
        return
    }

    // assign username to session
    req.session.username = username
    
    await req.session.save()
    
    // send result
    res.send({
        ok: 1,
        flag: 'loggedIn'
    })
})

router.post('/register', async(req, res) => {
    let {
        username, 
        password
    } = req.body
    
    // db queries
    let user = await db.models.User.findOne(
        {
            username: username, 
        }
    )
    if (user) {
        res.status(400).send({
            ok: 0,
            flag: 'userNameExisted'
        })
        return
    }

    // successfully registered
    let newUser = new db.models.User({
        username: username, 
        password: password
    })

    // log in
    req.session.username = username

    // save 
    Promise.all([
        newUser.save(),
        req.session.save(),
    ])


    // response result
    res.send({
        ok: 1, 
        username: username,
        flag: "userRegistered"
    })
})


// query login status
router.get('/me', requireLoggedIn, async(req, res)=>{
    // session
    res.send({
        ok: 1,
        username: req.session.username
    })
})

// logout
router.delete('/', requireLoggedIn, async(req, res) => {
    await req.session.destroy()
    res.send({
        ok: 1,
        flag: 'loggedOut'
    })
})

module.exports = router
