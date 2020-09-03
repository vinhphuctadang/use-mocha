const db = require('../routes/db')
const assert = require('assert')
const BASE_URL = 'http://localhost:8080'

// config axios
const axios = require('axios')


describe('Auth routes', async()=>{
    
    describe('Test register', ()=>{

        // create an instance
        let client = axios.create({baseURL: BASE_URL})

        it('should clear database', async()=>{
            console.debug('Clear database')
            await db.clear()
        }) 
        
        it('should register a person and returns ok', async()=>{
            // send request
            let resp = await client.post('/auth/register', 
            {
                username: 'foo',
                password: 'fee'
            })

            let data = resp.data
            assert(data.ok == 1)
            assert(data.flag == 'userRegistered')

            // save cookie
            const cookie = resp.headers["set-cookie"][0];
            client.defaults.headers.Cookie = cookie
        })
        
        it('should also logged in as we test with /me route', async()=>{
            let resp = await client.get('/auth/me')
            let data = resp.data
            assert(data.ok == 1)
            assert(data.username == 'foo')
        })
    })

    describe('Test login/logout', ()=>{

        // create an instance
        let client = axios.create({baseURL: BASE_URL})

        it('should clear database', async()=>{
            console.debug('Clear database')
            await db.clear()
        }) 
        
        it('should register a person and returns username == foo when query /me', async()=>{
            // send request
            let resp = await client.post('/auth/register', 
            {
                username: 'foo',
                password: 'fee'
            })

            // save cookie
            const cookie = resp.headers["set-cookie"][0];
            client.defaults.headers.Cookie = cookie

            // query name
            resp = await client.get('/auth/me')
            let data = resp.data
            
            assert(data.ok == 1, JSON.stringify(data))
            assert(data.username == 'foo')
        })

        it('should not register a person named foo again, even different password', async()=>{
            // send request

            try {
                let resp = await client.post('/auth/register', 
                {
                    username: 'foo',
                    password: 'bar'
                })
            } catch(e) {

                assert(e.response.status == 400)
                
                let data = e.response.data
                assert(data.ok == 0, JSON.stringify(data))
                assert(data.flag == 'userNameExisted')
                return
            }
            
            throw "Registering user with existed name keep succesfully executed"
        })
        
        it('should logout and see error when request /me', async()=>{
            let resp = await client.delete('/auth')

            // auth delete should be successful
            assert(resp.data.ok == 1)
            assert(resp.data.flag == 'loggedOut')

            let data = (await client.get('/auth/me')).data
            assert(data.ok == 0)
            assert(data.flag == 'unauthenticated')
        })

        it('should login and can query username', async()=>{
            
            let resp = await client.post('/auth', {
                username: 'foo',
                password: 'fee'
            })

            assert(resp.data.ok == 1)
            assert(resp.data.flag == 'loggedIn')

            // save cookie
            const cookie = resp.headers["set-cookie"][0];
            client.defaults.headers.Cookie = cookie

            resp = await client.get('/auth/me')

            assert(resp.data.ok == 1)
            assert(resp.data.username == 'foo')
        })
    })
})
