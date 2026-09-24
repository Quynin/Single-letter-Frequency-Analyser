//Create length-26 array for each character in the key; all character counts initialised to 0
function createslfaArrays(keyLength) {
    const matrix = [];
    //console.log("KeyLength: " + keyLength);
    for (let i = 0; i < keyLength; i++) {
        const row = [];
        for (let j = 0; j < 26; j++) {
            row.push(0);
        }
        //console.log("ROW: " + row);
        matrix.push(row);
    }
    return matrix;
}

//keylength == slfaArrays.length
function parseCipherTextToKslfaArrays(cipherText, slfaArrays) {

    //TODO: REDUCE DPUILICATION OF keyLength var?
        //DEFINED IN PARENT TO BE PARAM FOR createslfaArrays(),
        //WHICH IS IN TURN A PARAMETER FOR THIS FUNCTION
    var keyLength = slfaArrays.length
    //Count ciphertext characters, by each character key 
    for (let i = 0; i < cipherText.length; i++) {

        //If cipherText[i] is in alphabet A-Z
        if ("A" <= cipherText[i] && cipherText[i] <= "Z") 
            //Increment the character count in the corresponding key
            //console.log(cipherText.charCodeAt(i));
            slfaArrays[i % keyLength][cipherText.charCodeAt(i) - 65]++;
            //console.log(`k-modulo: ${i % keyLength}, char: ${cipherText[i]} (${cipherText.charCodeAt(i)}), char count: ${slfaArrays[i % keyLength][0]}`);
    }
    //console.log("slfaArrays: " + slfaArrays);

    //Return filled slfaArrays
    return slfaArrays
}



//Create array of each character in alphabet and count
function createDataPair(slfaArray) {
    const arr = [];

    //Populate array with letter of alphabet and count
    for (let i = 0; i < 26; i++) {
        arr.push({
            "Letter": String.fromCharCode(i + 65),
            "Count": slfaArray[i]
        });
    }
    //console.log("Data pair array: " + arr);
    return arr;
}

//Create a div to hold visuals paired together--end up making as many of these as the length of the key
function createKeyElementsDiv(divContainerId, divId) {
    
    const keyElementsDiv = document.createElement("div");
    keyElementsDiv.classList.add("flex-container");
    keyElementsDiv.setAttribute("id", divId);

    const containerDiv = document.getElementById(divContainerId);
    containerDiv.append(keyElementsDiv);
    
    //containerDiv.insertAdjacentHTML("beforeend", `<div class="flex-container" id="${divId}"></div>`);
}

//Create a div to hold a bar plot--end up making as many of these as the length of the key
function createBarPlotDiv(barplotDivContainerId, barplotDivId) {
    
    const barplotDiv = document.createElement("div");
    barplotDiv.classList.add("barplot-div");
    barplotDiv.classList.add("column");
    barplotDiv.setAttribute("id", barplotDivId);
    
    const containerDiv = document.getElementById(barplotDivContainerId);
    containerDiv.append(barplotDiv);

    //containerDiv.insertAdjacentHTML("beforeend", `<div class="barplot-div column" id="${barplotDivId}"></div>`);
}

//Create a div to hold a sorted table--end up making as many of these as the length of the key
function createSortedTableDiv(tableDivContainerId, tableDivId) {
    
    const tableDiv = document.createElement("div");
    tableDiv.classList.add("sorted-table-div");
    tableDiv.classList.add("column");
    tableDiv.setAttribute("id", tableDivId);
    
    const containerDiv = document.getElementById(tableDivContainerId);
    containerDiv.append(tableDiv);
    
    //containerDiv.insertAdjacentHTML("beforeend", `<div class="sorted-table-div column" id="${tableDivId}"></div>`);
}

//Use d3 to create a bar plot of character count for a given slfa dataset
function createBarPlot(barplotDiv, data) {

    //Set dimenions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width  = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    //Append the svg object to the body of the page
    var barChartSvg = d3.select(`#${barplotDiv}`)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + ", " + margin.top + ")"
        );

    //Parse the data

    //Add X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.Letter))
        .padding(0.2);
    barChartSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    
    //console.log("Max val: " + Math.max(...data.map(d => d.Count)));
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, Math.ceil(1.1 * (Math.max(...data.map(d => d.Count))))])
        .range([ height, 0]);
    barChartSvg.append("g")
        .call(d3.axisLeft(y));

    //Bars
    barChartSvg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", d => x(d.Letter) )
            .attr("y", d => y(d.Count) )
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.Count); })
            .attr("fill", "#000000");

    //Animation from https://d3-graph-gallery.com/graph/barplot_animation_start.html
    barChartSvg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => y(d.Count))
        .attr("height", d => height - y(d.Count))
        //.delay((d,i) => {console.log(i); return i*100})

}


//Use d3 to create an ascending-count sorted table of letters for a given slfa dataset
function createSortedTable(tableDiv, data) {
    const headers = ["Letter", "Frequency"];

    const table = d3.select(`#${tableDiv}`).append("table");

    table.append("thead")
        .append("tr")
        .selectAll("th")
        .data(headers)
        .join("th")
        .text(d => d);

    table.append("tbody")
        .selectAll("tr")
        .data(d3.sort(data, (a, b) => d3.descending(a.Count, b.Count)))
        .join("tr")
        .selectAll("td")
        .data(d => [d.Letter, d.Count])
        .join("td")
        .text(d => d);
}

//{letter, count} pairs
const mostFrequentLettersPrejudice = [
    {"Letter": "e", "Count": 71543},
    {"Letter": "t", "Count": 48605},
    {"Letter": "a", "Count": 43015},
    {"Letter": "o", "Count": 41724},
    {"Letter": "i", "Count": 39455},
    {"Letter": "n", "Count": 39021},
    {"Letter": "h", "Count": 34735},
    {"Letter": "s", "Count": 34089},
    {"Letter": "r", "Count": 33795},
    {"Letter": "d", "Count": 22888},
    {"Letter": "l", "Count": 22523},
    {"Letter": "u", "Count": 15669}
];

console.log("All utils have been read!")