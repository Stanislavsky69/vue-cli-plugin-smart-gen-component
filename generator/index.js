const path = require('path')

module.exports = (api, options) => {
    const hasTest = api.hasPlugin('unit-jest');

    api.render('./template', options)

    api.postProcessFiles(files => {
        if(!hasTest){
            delete files['src/components/NewComponent/__tests__/NewComponent.spec.js'];
            delete files['src/components/NewComponent/__tests__/'];
        }
        const hasStorybook = FindInDependencies(JSON.parse(files['package.json']), ['@storybook/vue']).length > 0

        if(!hasStorybook){
            delete files['src/components/NewComponent/NewComponent.stories.js'];
        }
        RenameFiles(files, options.componentName)

    })

    api.exitLog(`Компонент ${options.componentName} создан!`, 'done')

}


const RenameFiles = (files, fileName) => {
    for(const key in files){
        const basename = path.basename(key);
        const name = basename.split('.')[0]
        if(name !== fileName){
            const contentFile = files[key]
            const newFileName = key.replace(/NewComponent/g, fileName)
            files[newFileName] = contentFile;
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

