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
let ageArray = [0,0,0,0,0];

// Map Leaflet
let map = createMap("map", [1.3521, 103.8198], 13);

//Set up hospital Dictionary
axios.get('sghospitals.json').then(function (hospitals) {
    let hospitalGroup = L.layerGroup();
    for (let hospital of hospitals.data) {
      hospitalarray.push(hospital.abbrev);
      hospitalDict[hospital.abbrev] = 0;
    }
});


function drawMap(){
axios.get('sghospitals.json').then(function (hospitals) {
  let hospitalGroup = L.layerGroup();
  for (let hospital of hospitals.data) {
    let marker = L.marker(hospital.coordinates).bindPopup(`
        <h5>${hospital.name}</h5>
        <p> COVID-19 Patients: ${hospitalDict[hospital.abbrev]} </p>
        <p> Number of Beds: ${parseInt(hospital.NumberBed)}</p>
        <p> Address: ${hospital.address} </p>
        <p> Hotline: ${hospital.hotline} </p>

        `);
    marker.addTo(map);
  }
  map.layers(hospitalGroup).addTo(map);
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

pulsatingIcon = PulsatingMarker(50, 'rgba(247, 0, 0, 0.533)');

axios.get('sgclusters.json').then(function (clusters) {
    let clusterGroup = L.layerGroup();
    for (let cluster of clusters.data) {
      let circle = L.marker(cluster.coordinates, {icon: pulsatingIcon} 
        ).bindPopup(`<h7>${cluster.name}</h7>`);
      circle.addTo(map);
    }
    map.layers(clusterGroup).addTo(map);
  });

}
  


// 2. Update hospital array and dictionary counter and print table out

axios.get('covidcase.csv').then(function (response) {
  csv().fromString(response.data).then(function (data) {

    //console.table(data);

    //hospital case count
    for (let i in data) {
      hospitalDict[data[i].Hospital] = hospitalDict[data[i].Hospital] + 1;

      //gender count
      if (data[i].Gender === 'M'){
          male = male + 1;
      }else if (data[i].Gender === "F"){
          female = female + 1;
      }

      //age count
      if (data[i].Age >= 0 && data[i].Age <= 14){
          ageArray[0] +=  1;
      } else if (data[i].Age >= 15 && data[i].Age <=24 ){
          ageArray[1] += 1;
      } else if (data[i].Age >= 25 && data[i].Age <=54 ){
          ageArray[2] += 1;
      } else if (data[i].Age >=55 && data[i].Age <=64){
          ageArray[3] += 1;
      }else{
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
    drawMap();
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
    type: 'polarArea',
    data: {
        labels: ['Male', 'Female'],
        datasets: [{
            label: 'Gender',
            data: [genderCount[0], genderCount[1]],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
      reponsive: true,
      maintainAspectRatio: false,
        // scales: {
        //     yAxes: [{
        //         ticks: {
        //             beginAtZero: true
        //         }
        //     }]
        // }
    }
});

var ctx4 = document.getElementById('myGender');
var myChart4 = new Chart(ctx4, {
    type: 'bar',
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
            borderWidth: 1
        }]
    },
    options: {
      reponsive: true,
      maintainAspectRatio: false,
    }
});

}
