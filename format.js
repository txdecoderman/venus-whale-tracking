const THOUSAND = 1000
const MILLION = 1000000
const BILLION = 1000000000
const TRILLION = 1000000000000
const QUADRILLION = 1000000000000000
const QUINTILLION = 1000000000000000000

const formatNumber = (number, accuracy = 2) => {
  var formated
  if (number > 1) {
    formated = parseFloat(number)
      .toFixed(accuracy)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    formated = parseFloat(number).toFixed(8)
  }
  if (formated.match(/\.[0]+$/g)) {
    formated = formated.replace(/\.[0]+$/g, '')
  }

  if (formated.match(/\.\d+[0]+$/g)) {
    formated = formated.replace(/[0]+$/g, '')
  }
  return formated
}

const formatBigNumber = (number) => {
  if (number >= QUINTILLION) {
    return `${formatNumber(parseFloat(number / QUINTILLION))} QUIN`
  } else if (number >= QUADRILLION) {
    return `${formatNumber(parseFloat(number / QUADRILLION))} QUAD`
  } else if (number >= TRILLION) {
    return `${formatNumber(parseFloat(number / TRILLION))} T `
  } else if (number >= BILLION) {
    return `${formatNumber(parseFloat(number / BILLION))} B `
  } else if (number >= MILLION) {
    return `${formatNumber(parseFloat(number / MILLION))} M `
  } else if (number >= THOUSAND) {
    return `${formatNumber(parseFloat(number / THOUSAND))} K `
  }
  return formatNumber(number)
}

module.exports = {
  formatBigNumber,
}
