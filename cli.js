#!/usr/bin/env node

let { main } = require("./app.js")

async function init(){

    console.log('hola este es mi md links: ')
    await main()
}

init()


