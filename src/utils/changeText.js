export default function changeText(target) {
    console.log(target)
    const elem = $(target)
    const text = elem.find('option:selected').html()

    elem
        .siblings('.btn')
        .find('span')
        .text(text.replace(/&nbsp;/gi, ''))
}