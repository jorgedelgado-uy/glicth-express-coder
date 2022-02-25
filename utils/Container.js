const fileSystem = require('fs');

module.exports = class Container{

    constructor(file){
        this.file = file;
        this.encoding = 'utf-8';
    }

    async checkForFile(){
        let file;
        try {
            file = await fileSystem.promises.readFile(this.file, this.encoding);
        }
        catch (error){
            if (error.code == 'ENOENT') {
                await fileSystem.promises.writeFile(this.file, '[]');
                file = await fileSystem.promises.readFile(this.file, this.encoding);
            }
            else{
                console.log(error.message);
            } 
        }
        return file;
    }

    async save(object){
        try {
            let content = JSON.parse(await this.checkForFile());    
            content.push(await this.addId(content, object));
            await fileSystem.promises.writeFile(this.file, JSON.stringify(content, null, 2));
        } catch(error){
            throw new Error(`${error.message}`);
        }  
    }

    async getById(id){
        try{
            let content = JSON.parse(await this.checkForFile()); 
            let product = content.filter(object => object.id == id);
            if (product.length == 0) {
                return null;
            }                
            else {
                console.log(product);
                return product;
            }
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async addId(content, object){
        let i = content.length;
        if (i == 0){
            object.id = 1;
            return object;
        }
        object.id = content[i-1].id + 1;
        return object;
    }

    async getAll(){        
        let content = JSON.parse(await this.checkForFile());
        console.log(content);
        return content;
    }

    async deleteById(id){
        try{
            let content = JSON.parse(await this.checkForFile());
            let productIndex = content.findIndex(object => object.id == id);
            if (productIndex != -1){
                content.splice(productIndex, 1);
                await fileSystem.promises.writeFile(this.file, JSON.stringify(content, null, 2));
            }            
        } catch(error) {
            throw new Error(`${error.message}`);
        }        
    }

    async deleteAll(){
        try {
            await fileSystem.promises.writeFile(this.file, '[]');
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}