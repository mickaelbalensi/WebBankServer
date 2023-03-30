const axios = require('axios')
const convert = require('xml-js')


function convertToJson(data) {
    return JSON.parse(convert.xml2json(data, {compact: true, spaces: 2}))
}


async function currencyToLevcoin(amount, rateLevcoin){

    return axios
    .get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml')
    .then((response) => {
        let parsedJSON = convertToJson(response.data)
        let currencies = parsedJSON['gesmes:Envelope'].Cube.Cube.Cube
        let usdCurrency = currencies[0]['_attributes']['rate']
        let ilsCurrency = currencies[21]['_attributes']['rate']
        numOfLevcoin = (amount / (ilsCurrency)) * rateLevcoin

        return Math.round(numOfLevcoin);
        // console.log(currencies)
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = currencyToLevcoin;
