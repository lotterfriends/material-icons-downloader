#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const namePrefix = "material-";

const uaWoff = "Mozilla/5.0 (Windows; U; Windows NT 5.1; de; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3";
const uaWoff2 = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36";
const uaEot = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/4.0)";

const baseUrl = "http://fonts.googleapis.com/icon?family=Material+Icons";
let targetFolder;

if(process.argv.length > 2 && typeof process.argv[2] !== 'undefined') {

    targetFolder = path.join(process.cwd(), process.argv[2]);
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder)
    }
} else {
    console.log('no target folder');
    process.exit(1);
}

const fontTypes = [
    {type: 'ttf', ua: false},
    {type: 'otf', ua: false},
    {type: 'eot', ua: uaEot},
    {type: 'woff', ua: uaWoff},
    {type: 'woff2', ua: uaWoff2},
] 

function getFontInfos(url, type, userAgent, callback) {
    let options = {};
    let data = '';
    if (userAgent) {
        options.headers = { 'User-Agent': userAgent }
    }

    http.get(url, options, function(res) {
        res.on('data', function(chunk) { data += chunk.toString() });
        res.on('end', () => {
            const result = data.match(new RegExp('http.*?.' + type, 'gm'));
            callback(result[0]); 
        });
    });

}

function getFonts(type, name, variant) {

    let url = baseUrl;
    
    if (typeof variant !== 'undefined') {
        url = baseUrl + '+' + variant;
    }

    fontTypes.forEach((currentFont)=> {
        if (currentFont.type === 'ttf' && type === 'otf') {
            return true;
        }
        if (currentFont.type === 'otf' && type === 'ttf') {
            return true;
        }
        getFontInfos(url, currentFont.type, currentFont.ua, (url) => {
            const filename = [name, '.', currentFont.type].join('');
            const filePath = path.join(targetFolder, filename);
            const file = fs.createWriteStream(filePath);
            http.get(url, async function(response) {
                const stream = response.pipe(file);
                if (currentFont.type === 'ttf') {
                    const versionFile = fs.createWriteStream(path.join(targetFolder, 'version.json'));
                    stream.on('finish', function () {
                        var font = opentype.loadSync(filePath);
                        versionFile.write(JSON.stringify({
                            name: font.names.fontFamily.en,
                            copyright: font.names.copyright.en,
                            version: font.names.version.en,
                            uniqueID: font.names.uniqueID.en,
                            donwload: Date.now()
                        }, null, 2));
                    });
                }
            });
        });
    })

}


getFonts('ttf', namePrefix + 'regular');
getFonts('otf', namePrefix + 'outline', 'Outlined');
getFonts('otf', namePrefix + 'round', 'Round');
getFonts('otf', namePrefix + 'twotone', 'Two+Tone');
getFonts('otf', namePrefix + 'sharp', 'Sharp');