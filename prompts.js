module.exports = [
    {
        name: 'componentName',
        type: 'input',
        message: 'Введите название компонента согласно рекомендаций https://vuejs.org/v2/style-guide/index.html#Single-file-component-filename-casing-strongly-recommended',
        default: 'NewComponent'
    },
    {
        name: 'relativePathFromRoot',
        type: 'input',
        message: 'Укажите относительный путь из корня проекта. Слеш на конце обязателен!',
        default: 'src/components/'
    }
]
