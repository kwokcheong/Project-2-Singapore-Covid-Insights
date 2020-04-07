//global variable Hospital Information
let hospitalarray = [];
let hospitalCount = [0];
let hospitalDict = [{
  name: "n/a",
  count: 0
}];
let genderCount = [0];
let male = 0;
let female = 0;

// 1. Map Leaflet
let map = createMap("map", [1.3521, 103.8198], 13);

axios.get('sghospitals.json').then(function (hospitals) {
  let hospitalGroup = L.layerGroup();
  for (let hospital of hospitals.data) {
    hospitalarray.push(hospital.abbrev);
    hospitalDict[hospital.abbrev] = 0;
    let marker = L.marker(hospital.coordinates).bindPopup(`
        <h7>${hospital.name}</h7>`);
    marker.addTo(map);
  }
  map.layers(hospitalGroup).addTo(map);
});

//this is an example of putting NUH in
// let NUHCoord = [1.2966,103.7764];
// let NUHCircle = L.circle(NUHCoord,{
//     'color':'blue',
//     'fillColor':'blue',
//     'fillOpacity':0.3,
//     'radius':800
// }).addTo(map);

// NUHCircle.bindPopup(`<p>National University Hopstital</p>`)


// 2. Update hospital array and dictionary counter and print table out

axios.get('covidcase.csv').then(function (response) {
  csv().fromString(response.data).then(function (data) {

    //console.table(data);
    for (let i in data) {
      hospitalDict[data[i].Hospital] = hospitalDict[data[i].Hospital] + 1;

      //gender count
      if (data[i].Gender === 'M'){
          male = male + 1;
      }else if (data[i].Gender === "F"){
          female = female + 1;
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
    console.log(hospitalDict);
    for (let x in hospitalarray) {
      hospitalCount[x] = hospitalDict[hospitalarray[x]];
      //console.log(hospitalCount[x]);
    }
    genderCount[0] = male;
    genderCount[1] = female;

    console.log(genderCount);
    // todo: callback function
    drawCharts();
  });
    
});



// 3. Chart.js
function drawCharts() {
    // todo: draw your charts

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
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
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        reponsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var ctx2 = document.getElementById('myBar');
var myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Rate of Increase in Cases by Week',
            data: [12, 19, 3, 5, 2, 3],
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
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      reponsive: true,
      maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

console.log(genderCount[0])

var ctx3 = document.getElementById('myAge');
var myChart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
        labels: ['Male', 'Female'],
        datasets: [{
            label: 'age',
            data: [genderCount[0], genderCount[1]],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
      reponsive: true,
      maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var ctx4 = document.getElementById('myGender');
var myChart4 = new Chart(ctx4, {
    type: 'pie',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Gender Demographic of Cases',
            data: [12, 19, 3, 5, 2, 3],
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
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      reponsive: true,
      maintainAspectRatio: false,
    }
});

}
