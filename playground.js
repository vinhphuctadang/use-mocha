'use strict'
const axios = require('axios').create({ baseURL: 'http://localhost:8080'});
const assert = require('assert')

async function checkServer(){
    let res = await axios.get('/auth')
    let data = res.data
    console.log('Check server status:', data)
    assert(data.ok == 1)
    assert(data.status == 'running')
}

async function login(){

    // login 
    let loginResp = await axios.post('/auth',
        {
            username: 'foo',
            password: 'foo'
        },
    )

    // set cookie for querying in the future
    const cookie = loginResp.headers["set-cookie"][0];
    console.log('Cookie:', cookie)
    axios.defaults.headers.Cookie = cookie
}

async function queryMe(){
    let res = await axios.get('/auth/me', {withCredentials: true})
    let data = res.data
    console.log('Me log:', data)
}

async function logout(){
    let res = await axios.delete('/auth')
    console.log('Logout:', res.data)
}

async function main(){
    await checkServer()
    await login()
    await queryMe()
    await logout()
    await queryMe()
}

main()
