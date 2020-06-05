let fs = require('fs')
let marked = require('marked')
let fetch = require('node-fetch')

let index = process.argv.indexOf('--file')

function getArgs(){
    let uri = process.argv[index + 1]
    console.log('Esta es la Uri:', uri)
    readFile(uri)
}

function readFile(uri){
    let content = fs.readFileSync(uri, 'utf8')
    console.log('Este es el contenido del archivo:', content)
    getLinks(content)
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
    console.log('Estos son los links', links)
    getStatsAndValidate(links)
}

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


module.exports = {
    getArgs
}