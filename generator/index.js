const path = require('path')
const fs = require('fs')
module.exports = (api, options) => {
    const hasTest = api.hasPlugin('unit-jest');
    const hasStorybook = FindInDependencies(api.generator.pkg, ['@storybook/vue']).length > 0;
    const hasScss = FindInDependencies(api.generator.pkg, ['sass', 'sass-loader']).length > 0;
    const vueVersion = FindInDependencies(api.generator.pkg, ['vue'])

    let pathToComponent = 'src/components/TempComponent';

    if(vueVersion.length === 0) {
        console.error('Vue не установлен!')
        return
    }
    const pathToCreateComponent = `${options.relativePathFromRoot}${options.componentName}`;

    if(fs.existsSync(api.resolve(pathToCreateComponent))){
        throw 'Компонент уже создан! Используйте другое имя'
    }

    if(vueVersion[0] && typeof vueVersion[0].vue !== undefined && GetVersionVue(vueVersion[0].vue) === 2){
        api.render('./templateV2', options)
    }else{
        api.render('./templateV3', options)
    }

    api.postProcessFiles(files => {
        if(!hasTest){
            delete files[`${pathToComponent}/__tests__/TempComponent.spec.js`];
            delete files[`${pathToComponent}/__tests__/`];
        }

        if(!hasStorybook){
            delete files[`${pathToComponent}/TempComponent.stories.js`];
        }
        if(!hasScss){
            let vueFileContent = files[`${pathToComponent}/TempComponent.vue`];
            vueFileContent = vueFileContent.replace(/<style [^]*?>[^]*?<\/style>/, '')
            files[`${pathToComponent}/TempComponent.vue`] = vueFileContent;
            delete files[`${pathToComponent}/_TempComponent.style.scss`]
        }
        PrepareFiles(files, options.componentName, options.relativePathFromRoot)
        // ReplacePath(files, pathToCreateComponent)
    })
    api.exitLog(`Компонент ${options.componentName} создан!`, 'done')

}


const PrepareFiles = (files, fileName, path) => {
    for(const key in files){
        if(/TempComponent/g.test(key)){
            const contentFile = files[key]
            const newFileName = key.replace(/TempComponent/g, fileName)
            const newPath = newFileName.replace('src/components/', path)
            files[newPath] = contentFile;
            delete files[key];
        }
    }
}

const FindInDependencies = (root, dependency) => {
    if(!dependency || dependency.length === 0 || !Array.isArray(dependency)) return root || [];
    let foundDep = [];
    if(Array.isArray(dependency)){
        for(const depVariant in root){
            if(depVariant === 'dependencies' || depVariant === 'devDependencies'){
                for(const keyDep in root[depVariant]){
                    if(dependency.includes(keyDep)){
                        foundDep.push({
                            [keyDep]: root[depVariant][keyDep]
                        })
                    }
                }
            }
        }
    }
    return foundDep;
}

const GetVersionVue = version => {
    if(!version) return;
    const splitString = version.replace('^','').split('.')
    let ver = 2;
    if(splitString.length === 0){
        throw 'Ошибка определения версии Vue'
    }
    if(splitString[0] === '3'){
        ver = 3
    }
    return ver;
}

