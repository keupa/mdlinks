let fs = require('fs')
let marked = require('marked')
let fetch = require('node-fetch')
let colors = require('colors')

let index = process.argv.indexOf('--file')
let flags = process.argv

function getArgs(){
    let uri = process.argv[index + 1]
    return uri
}

function readFile(uri){
    let content = fs.readFileSync(uri, 'utf8')
    return content
}

function getLinks(content){
    let links = []
    let renderer = new marked.Renderer()
    renderer.link = ( href, file, text) =>{
        links.push({
            href: href,
            title: text, 
            path: file
        })
    }
    marked(content, {renderer: renderer})
    return links
}

//--validate --stats
function getStatsAndValidate(links){
    let totalLinks = links.length;
    let uniqueLinks = [...new Set(links.map(link => link.href))].length; 
    let brokenLinks = 0;
    let count = 0;
    
    links.forEach(link => {
        fetch(link.href)
            .then( res => {
                count++
                if( res.status === 404 ){
                    brokenLinks++
                }
            }).then (() => {

                if(count === totalLinks){
                console.log('total: ', totalLinks, 'unique links: ',uniqueLinks, 'broken links: ', brokenLinks)
                }
            })
    })    
}

//--stats 
function getStats(links){
    let totalLinks = links.length
    let uniqueLinks = [...new Set(links.map(link => link.href))].length

    console.log('total links: ', totalLinks, 'unique links: ', uniqueLinks)
}

//--validate
function validateLinks(links){
    let fetchedLinks = links.map(link=>{
        return fetch(link.href)
            .then ( res => {
                if(res.status === 200){
                    console.log('HREF:', res.url, 'STATUS:', res.status, 'OK')
                } else {
                    console.log('HREF:', res.url, 'STATUS:', res.status, 'FAILED')
                }
            }).catch( err => {
                console.log('no se puede ver esta url')
            })
    })
    return validateLinks
}

function main(){
    let uri = getArgs()
    let content = readFile(uri)
    let arrayLinks = getLinks(content)

    if(flags.includes('--validate') && flags.includes('--stats')){
        getStatsAndValidate(arrayLinks)
    }else if(flags.includes('--validate')){
        validateLinks(arrayLinks)
    }else if (flags.includes('--stats')){
        getStats(arrayLinks)
    }
}

module.exports = {
    main
}