list2 = fs.readdirSync('./')
list2 = list2.map(item => {
    const name = item.replace(/\.[^/.]+$/, '')
    return {

        text: name,
        link: "/CSS/" + name,
    }
})

console.log(list2)