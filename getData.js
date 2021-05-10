const countryNames = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burma","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Denmark","Denmark","Diamond Princess","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Korea, South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","MS Zaandam","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan*","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Trinidad and Tobago","Tunisia","Turkey","US","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","West Bank and Gaza","Yemen","Zambia","Zimbabwe"]
const countriesWithRegions = ["United Kingdom", "Netherlands", "Australia", "Canada", "China"]
const list = document.getElementById("countryList")
const selectedCountry = document.getElementById("selectedCountry")
for (i in countryNames) {
    let newValue = list.appendChild(document.createElement("option"))
    newValue.value = countryNames[i]
}
const buttonDaily = document.getElementById("daily")
const buttonAverage = document.getElementById("mean")
const buttonCumulative = document.getElementById("cumulative")

selectedCountry.addEventListener("input", function () {
    if (buttonDaily.className === "btn btn-secondary active") {
        daily()
    } else if (buttonAverage.className === "btn btn-secondary active") {
        movingAverage()
    } else if (buttonCumulative.className === "btn btn-secondary active") {
        choosenCountry()
    }
})

document.getElementById("dateFormat").addEventListener("change", isChecked)
let checked = false
function isChecked() {
    checked = checked !== true;
    if (buttonDaily.className === "btn btn-secondary active") {
        daily()
    }
    if (buttonAverage.className === "btn btn-secondary active") {
        movingAverage()
    }
    if (buttonCumulative.className === "btn btn-secondary active") {
        choosenCountry()
    }
}

let plotCsvData = [], numberOfColumns = 0, cases = [], recordDate = []
let csv = Plotly.d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv", function (error, data) {
    plotCsvData = data
})
let countryName = ""

function choosenCountry() {
    buttonDaily.className = "btn btn-secondary"
    buttonAverage.className = "btn btn-secondary"
    buttonCumulative.className = "btn btn-secondary active"
    let country = document.getElementById("selectedCountry").value
    let i = 0
    for (i in plotCsvData) {
        if (plotCsvData[i]["Country/Region"] === country) {
            cases = []
            recordDate = []
            numberOfColumns = Object.keys(plotCsvData[i])
            for (j in numberOfColumns) {
                if (j > 3) {
                    recordDate.push(numberOfColumns[j])
                }
            }
            for (j in recordDate) {
                cases.push(plotCsvData[i][recordDate[j]])
            }
        }
    }
    if (checked === true) {
        for (i in recordDate) {
            recordDate[i] = formatLabels(recordDate[i])
        }
    }
    layout.yaxis.title = "cumulative cases"
    plot()
    countryName = country
}

function daily() {
    buttonDaily.className = "btn btn-secondary active"
    buttonAverage.className = "btn btn-secondary"
    buttonCumulative.className = "btn btn-secondary"
    let country = document.getElementById("selectedCountry").value
    let i = 0
    let lastValue = 0
    for (i in plotCsvData) {
        if (plotCsvData[i]["Country/Region"] === country) {
            cases = []
            recordDate = []
            numberOfColumns = Object.keys(plotCsvData[i])
            for (j in numberOfColumns) {
                if (j > 3) {
                    recordDate.push(numberOfColumns[j])
                }
            }
            for (j in recordDate) {
                cases.push(plotCsvData[i][recordDate[j]] - plotCsvData[i][recordDate[j - 1]])
            }
        }
    }
    if (checked === true) {
        for (i in recordDate) {
            recordDate[i] = formatLabels(recordDate[i])
        }
    }
    layout.yaxis.title = "daily cases by report date"
    plot()
    countryName = country
}
function formatDate(date) {
    let d, m, y
    let avg = 6
    if (date.charAt(2) === "/") {
        m = date.charAt(0) + date.charAt(1)
        if (date.length === 8) {
            d = date.charAt(3) + date.charAt(4)
        } else {
            d = date.charAt(3)
        }
    } else if (date.charAt(1) === "/") {
        m = date.charAt(0)
        if (date.length === 7) {
            d = date.charAt(2) + date.charAt(3)
        } else {
            d = date.charAt(2)
        }
    }

    y = date.charAt(date.length - 2) + date.charAt(date.length - 1)
    d = Number(d)
    m = Number(m)
    y = Number(y)
    // 1 3 5 7 8 10 12
    let daysInMonth
    if (y % 4 === 0) {
        daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    } else {
        daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    }
    if (d + avg > daysInMonth[m - 1]) {
        if (m !== 12) {
            d = (d + avg) - daysInMonth[m - 1]
            m++
        } else {
            y++
            d = (d + avg) - daysInMonth[m - 1]
            m = 1
        }
    } else {
        d = d + avg
    }
    return m + "/" + d + "/" + y
}
function formatLabels(date) {
    let d, m, y
    if (date.charAt(2) === "/") {
        m = date.charAt(0) + date.charAt(1)
        if (date.length === 8) {
            d = date.charAt(3) + date.charAt(4)
        } else {
            d = date.charAt(3)
        }
    } else if (date.charAt(1) === "/") {
        m = date.charAt(0)
        if (date.length === 7) {
            d = date.charAt(2) + date.charAt(3)
        } else {
            d = date.charAt(2)
        }
    }

    y = date.charAt(date.length - 2) + date.charAt(date.length - 1)
    return d + "/" + m + "/" + y
}
function movingAverage() {
    buttonDaily.className = "btn btn-secondary"
    buttonAverage.className = "btn btn-secondary active"
    buttonCumulative.className = "btn btn-secondary"
    let country = document.getElementById("selectedCountry").value
    let i = 0
    let k = 0
    let daily = 0
    let sum = 0
    let index = []
    let record = []
    for (i in plotCsvData) {
        if (plotCsvData[i]["Country/Region"] === country) {
            let c = i
            switch (country) {
                case countriesWithRegions[0]:
                    c = i
                    while (plotCsvData[c]["Country/Region"] === countriesWithRegions[0]) {
                        i = c
                        c++
                    }
                    break
                case countriesWithRegions[1]:
                    c = i
                    while (plotCsvData[c]["Country/Region"] === countriesWithRegions[1]) {
                        i = c
                        c++
                    }
                    break
                case countriesWithRegions[2]:
                    c = i
                    while (plotCsvData[c]["Country/Region"] === countriesWithRegions[2]) {
                        i = c
                        c++
                    }
                    break
                case countriesWithRegions[3]:
                    c = i
                    while (plotCsvData[c]["Country/Region"] === countriesWithRegions[3]) {
                        i = c
                        c++
                    }
                    break
            }
            cases = []
            recordDate = []
            numberOfColumns = Object.keys(plotCsvData[i])
            for (j in numberOfColumns) {
                if (j > 3) {
                    record.push(numberOfColumns[j])
                    recordDate.push(formatDate(numberOfColumns[j]))
                }
            }
            for (j in record) {
                if (k > 0) {
                    daily = plotCsvData[i][record[j]] - plotCsvData[i][record[j - 1]]
                } else {
                    daily = plotCsvData[i][record[j]]
                }
                index.push(daily)
                sum += Number(daily)
                if (k > 5) {
                    cases.push(sum / 7)
                    sum -= Number([index[0]])
                    index.shift()
                }
                k++
            }
            console.log(plotCsvData)
            console.log(i)
            break
        }
    }
    if (checked === true) {
        for (i in recordDate) {
            recordDate[i] = formatLabels(recordDate[i])
        }
    }
    countryName = country
    layout.yaxis.title = "7 day moving average cases"
    plot()
}

let layout = {
    title: "Covid-19 cases by country",
    xaxis: {
        title: "report date"
    },
    yaxis: {
        title: "cases"
    }
}
function plot() {
    buttonDaily.addEventListener("click", daily)
    buttonAverage.addEventListener("click", movingAverage)
    buttonCumulative.addEventListener("click", choosenCountry)
    var trace = {
        x: recordDate,
        y: cases
    }
    Plotly.newPlot("plot", [trace], layout)
}
daily()