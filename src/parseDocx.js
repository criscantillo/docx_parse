//https://docxtemplater.com/docs/get-started-node/
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { DOMParser } = require("@xmldom/xmldom");

const fs = require("fs");
const path = require("path");

module.exports = {
    getBuffer(content, data){
        if(content == null){
            content = fs.readFileSync(
                path.resolve(__dirname, "../input.docx"),
                "binary"
            );
        }

        if(data == null){
            data = {
                first_name: "John",
                last_name: "Doe",
                phone: "0652455478",
                years:27,
                description: "New Website",
            };
        }

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        doc.render(data);
        
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });
        
        return buf;
        //fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
    },
    
    str2xml(str) {
        if (str.charCodeAt(0) === 65279) {
            str = str.substr(1);
        }
    
        return new DOMParser().parseFromString(str, "text/xml");
    },
    
    getTags(content) {
        const zip = new PizZip(content);
        const xml = this.str2xml(zip.files["word/document.xml"].asText());
        const paragraphsXml = xml.getElementsByTagName("w:p");
        let tags = [];
    
        for (let i = 0, len = paragraphsXml.length; i < len; i++) {
            let fullText = "";
    
            const textsXml =
                paragraphsXml[i].getElementsByTagName("w:t");
    
            for (let j = 0, len2 = textsXml.length; j < len2; j++) {
                const textXml = textsXml[j];
                if (textXml.childNodes) {
                    let nodeValue = textXml.childNodes[0].nodeValue;
                    fullText += nodeValue;
                }
            }
    
            tags = tags.concat(this.extractTags(fullText));
        }
    
        return tags;
    },
    
    extractTags(text){
        text = text.replace(/}/g, '');
        let tags = text.match(/({)\w+/g);
        if(tags != null){
            return (tags.join().replace(/{/g, '')).split(',');
        }
    
        return [];
    }
}