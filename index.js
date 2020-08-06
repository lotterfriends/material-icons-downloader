#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const namePrefix = "material-";
const fontFileName = 'mat-icon-font';
const args = process.argv.slice(2);
const isQuiet = args.length && args.indexOf('-q') > -1 || args.indexOf('--quiet') > -1;
const isForce = args.length && args.indexOf('-f') > -1 || args.indexOf('--force') > -1;
const isShowHelp = args.length && args.indexOf('-h') > -1 || args.indexOf('--help') > -1;
const isScss = args.length && args.indexOf('-s') > -1 || args.indexOf('--scss') > -1;

const uaWoff = "Mozilla/5.0 (Windows; U; Windows NT 5.1; de; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3";
const uaWoff2 = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36";
const uaEot = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/4.0)";

const baseUrl = "http://fonts.googleapis.com/icon?family=Material+Icons";
const targetFolderParamater = args.find(e => e !== '-q' && e !== '--quiet' && e !== '-f' && e !== '--force' && e !== '-h' && e !== '--help' && e !== '-s' && e !== '--scss');

const fontTypes = [
    {type: 'ttf', ua: false},
    {type: 'otf', ua: false},
    {type: 'eot', ua: uaEot},
    {type: 'woff', ua: uaWoff},
    {type: 'woff2', ua: uaWoff2},
] 

let targetFolder;

function showHelp() {
    console.log('');
    console.log('Download current material-design-icons, because Google don\'t update there Repository.');
    console.log('See: https://github.com/google/material-design-icons/issues/786');
    console.log('');
    console.log('Usage:');
    console.log('material-icons-downloader [OPTION] <TARGET FOLDER>');
    console.log('');
    console.log('-h/--help    show this help');
    console.log('-f/--force   force download and ignore the version');
    console.log('-q/--quiet   no output');
    console.log('-s/--scss    no output');
    console.log('');
    process.exit(1);
}

function parseVersion() {
    parseFloat(x.match(/[0-9.,]+$/)[0]) < 1.001
}

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
                if (!isQuiet) {
                    console.log(`${filename}\tdownloaded`);
                }
                stream.on('finish', () => {
                    stream.close();
                });
            });
        });
    })

}


async function checkVersion() {
    let versionFile;
    try {
        versionFile = require(path.join(targetFolder, 'version.json'))
    } catch (error) { }
    
    return new Promise((resolve) => {
        
            getFontInfos(baseUrl, 'ttf', false, (url) => {
                const filePath = path.join(__dirname, 'tmp.ttf');
                const file = fs.createWriteStream(filePath);
                http.get(url, async function(response) {
                    const stream = response.pipe(file);
                    stream.on('finish', function () {
                        const font = opentype.loadSync(filePath);
                        if (!isQuiet) {
                            console.log('Version: ', font.names.version.en);
                            console.log('ID:      ', font.names.uniqueID.en);
                        }
                        fs.unlinkSync(filePath);
                        
                        if (versionFile) {
                            if (versionFile.version === font.names.version.en && versionFile.uniqueID === font.names.uniqueID.en) {
                                if (!isQuiet) {
                                    console.log('The local version is already up-to-date.')
                                }
                                if (!isForce) {
                                    process.exit(0);
                                    return;
                                }
                            }
                        }
                        const newVersionFile = fs.createWriteStream(path.join(targetFolder, 'version.json'));
                        const fontConfig = {
                            name: font.names.fontFamily.en,
                            copyright: font.names.copyright.en,
                            version: font.names.version.en,
                            uniqueID: font.names.uniqueID.en,
                            donwload: Date.now()
                        };
                        newVersionFile.write(JSON.stringify(fontConfig, null, 2));
                        stream.close();
                        resolve();
                    });
                });
            });
    });
}

function generateCSS() {
    const cssTplBuffer = fs.readFileSync(path.join(__dirname, 'fonts.tpl.css'));
    const cssFileContent = cssTplBuffer.toString().replace(/##PATH-TO-ICONS##/gm, targetFolderParamater);
    const fileName = isScss ? `${fontFileName}.scss` : `${fontFileName}.css`;
    try {
        fs.writeFileSync(path.join(targetFolder, fileName), cssFileContent);
        if (!isQuiet) {
            console.log(`font file "${fileName}" created.`)
        }
    } catch(e) {
        if (!isQuiet) {
            console.log(`error during create font file ${fileName}`)
        }
    }

}

async function run() {

    if (isShowHelp) {
        showHelp();
        process.exit(0);
    }

    if (typeof targetFolderParamater !== 'undefined') {
        targetFolder = path.join(process.cwd(), targetFolderParamater);
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder)
        }
    } else {
        console.log('ERROR: no target folder.');
        process.exit(1);
    }
    
    await checkVersion();
    getFonts('ttf', namePrefix + 'regular');
    getFonts('otf', namePrefix + 'outline', 'Outlined');
    getFonts('otf', namePrefix + 'round', 'Round');
    getFonts('otf', namePrefix + 'twotone', 'Two+Tone');
    getFonts('otf', namePrefix + 'sharp', 'Sharp');
    generateCSS();
}

run();