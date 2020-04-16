//Hospital data 
let hospitalarray = [];
let hospitalCount = [0];
let hospitalDict = [{
    name: "n/a",
    count: 0
}];
//Gender data 
let genderCount = [0];
let male = 0;
let female = 0;

//Age data
//Indexes : 0-14, 15-24, 25-54, 55-64, 65>
let ageArray = [0, 0, 0, 0, 0];

//date data
let weekRate = [];
let culweekCount = [];
let weekCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let arr1 = [];

// Map Leaflet
let map = createMap("map", [1.3521, 103.8198], 13);

//Set up hospital Dictionary
function getdata(){
axios.get('../data/sghospitals.json').then(function (hospitals) {
    for (let hospital of hospitals.data) {
        hospitalarray.push(hospital.abbrev);
        hospitalDict[hospital.abbrev] = 0;
    }
});

//Set up Date 
axios.get('../data/covidData.csv').then(function (response) {
    csv().fromString(response.data).then(function (data) {
        for (let i = 0; i < data.length; i++) {
            arr1.push(data[i].Date.split('/'));
        }

        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < 12; j++) {
                if (arr1[i][0] == j + 1) {
                    //Q1
                    if (arr1[i][1] > 0 && arr1[i][1] <= 7) {
                        weekCount[0 + (4 * j)]++;
                    }
                    //Q2
                    else if (arr1[i][1] > 7 && arr1[i][1] <= 14) {
                        weekCount[1 + (4 * j)]++;
                    }
                    //Q3
                    else if (arr1[i][1] > 14 && arr1[i][1] <= 21) {
                        weekCount[2 + (4 * j)]++;
                    }
                    //Q4
                    else if (arr1[i][1] > 21 && arr1[i][1] <= 31) {
                        weekCount[3 + (4 * j)]++;
                    }

                }
            }
        }

        let counter = 0;
        for (let i = 1; i <= weekCount.length; i++) {
            counter = counter + weekCount[i - 1];
            culweekCount.push(counter);
            // weekRate.push(counter);
        }

        for (let i = 0; i < culweekCount.length; i++) {
            if (culweekCount[i] == 0) {
                weekRate.push(0);
            } else if (culweekCount[i] > 0 && culweekCount[i - 1] == 0) {
                weekRate.push(0);
            } else {
                let rate = ((culweekCount[i] - culweekCount[i - 1]) / culweekCount[i - 1]) * 100;
                if (rate >= 100) {
                    rate -= 100;
                }
                weekRate.push(rate);
            }
        }
    });
});


// 2. Update hospital array and dictionary counter and print table out

axios.get('../data/covidData.csv').then(function (response) {
    csv().fromString(response.data).then(function (data) {

        //console.table(data);

        //hospital case count
        for (let i in data) {
            hospitalDict[data[i].Hospital] = hospitalDict[data[i].Hospital] + 1;

            //gender count
            if (data[i].Gender === 'M') {
                male = male + 1;
            } else if (data[i].Gender === "F") {
                female = female + 1;
            }

            //age count
            if (data[i].Age >= 0 && data[i].Age <= 14) {
                ageArray[0] += 1;
            } else if (data[i].Age >= 15 && data[i].Age <= 24) {
                ageArray[1] += 1;
            } else if (data[i].Age >= 25 && data[i].Age <= 54) {
                ageArray[2] += 1;
            } else if (data[i].Age >= 55 && data[i].Age <= 64) {
                ageArray[3] += 1;
            } else {
                ageArray[4] += 1;
            }


            $("#cases").append(`
            <tr> 
             <td>${data[i].Cases} </td>
             <td>${data[i].Age} </td>
             <td>${data[i].Gender}</td>
             <td>${data[i].Hospital} </td>
            </tr>
        `)
        }
        for (let x in hospitalarray) {
            hospitalCount[x] = hospitalDict[hospitalarray[x]];
        }
        genderCount[0] = male;
        genderCount[1] = female;
        // todo: callback function
        drawCharts();
        drawMap();
    });

});
}

getdata();


//Function DrawMap() To be called back once data loaded
function drawMap() {
    axios.get('../data/sghospitals.json').then(function (hospitals) {
        let hospitalGroup = L.layerGroup();
        for (let hospital of hospitals.data) {
            let marker = L.marker(hospital.coordinates).bindPopup(`
        <h5>${hospital.name}</h5>
        <p> COVID-19 Patients: ${hospitalDict[hospital.abbrev]} </p>
        <p> Number of Beds: ${parseInt(hospital.NumberBed)}</p>
        <p> Address: ${hospital.address} </p>
        <p> Hotline: ${hospital.hotline} </p>
        `);
            marker.addTo(hospitalGroup);
        }
        hospitalGroup.addTo(map);
        $("#hospital").click(function () {
            if (map.hasLayer(hospitalGroup)) {
                map.removeLayer(hospitalGroup);
            } else {
                hospitalGroup.addTo(map);
            }
        })
    });


    PulsatingMarker = function (radius, color) {
        const circlestyle = `
      width: ${radius}px;
      height: ${radius}px;
      fillOpacity: 0.3,
      background: ${color};
      color: ${color};
    `
        return L.divIcon({
            html: `<span style="${circlestyle}" class="pulse"/>`,
            className: ''
        })
    }

    pulsatingIcon = PulsatingMarker(40, 'rgba(247, 0, 0, 0.533)');

    axios.get('../data/sgclusters.json').then(function (clusters) {
        let clusterGroup = L.layerGroup();
        for (let cluster of clusters.data) {
            let circle = L.marker(cluster.coordinates, { icon: pulsatingIcon }
            ).bindPopup(`
     <h7>${cluster.name}</h7>`);
            circle.addTo(clusterGroup);
        }
        clusterGroup.addTo(map);
        // toggle cluster group layer
        $("#cluster").click(function () {
            if (map.hasLayer(clusterGroup)) {
                map.removeLayer(clusterGroup);
            } else {
                clusterGroup.addTo(map);
            }
        })
});

}




// 3. Chart.js
function drawCharts() {
    // todo: draw your charts

    let ctx = document.getElementById('myChart');
    let myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: hospitalarray,
            datasets: [{
                label: '# of Covid-19 Cases in Each Hospital (Excluding Discharged)',
                data: hospitalCount,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            reponsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Number of COVID-19 Patients in Each Hospital',
                fontSize: 24,
                fontColor: 'grey'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    let ctx2 = document.getElementById('myBar');
    let myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Jan_w1', 'Jan_w2', 'Jan_w3', 'Jan_w4', 'Feb_w1', 'Feb_w2', 'Feb_w3', 'Feb_w4', 'Mar_w1', 'Mar_w2', 'Mar_w3', 'Mar_w4', 'Apr_w1', 'Apr_w2'],
            datasets: [{
                label: 'Case increase by Week',
                data: weekCount,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)',
                    'rgba(255, 159, 64)',
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)',
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            reponsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Increase in COVID-19 Patients by Week',
                fontSize: 24,
                fontColor: 'grey'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    let ctx3 = document.getElementById('rateIncrease');
    let myChart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: ['Jan_w1', 'Jan_w2', 'Jan_w3', 'Jan_w4', 'Feb_w1', 'Feb_w2', 'Feb_w3', 'Feb_w4', 'Mar_w1', 'Mar_w2', 'Mar_w3', 'Mar_w4', 'Apr_w1', 'Apr_w2'],
            datasets: [{
                label: 'Rate of Increase by Week',
                data: weekRate,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            reponsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Rate of Transmission in COVID-19 Singapore',
                fontSize: 24,
                fontColor: 'grey'
            },
        }
    });

    let ctx4 = document.getElementById('AgeGroup');
    let myChart4 = new Chart(ctx4, {
        type: 'pie',
        data: {
            labels: ['0-14', '15-24', '25-54', '54-65', '>65'],
            datasets: [{
                label: 'Age group of Cases',
                data: ageArray,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1.1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Age Demographic',
                fontSize: 24,
                fontColor: 'grey'
            },
            reponsive: true,
            maintainAspectRatio: false,

        }
    });

}
