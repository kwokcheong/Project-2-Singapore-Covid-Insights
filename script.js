//global variable

//Hospital Information
let hospitalarray = [];
let hospitalCount = [0];

let hospitalDict = [{
  name: "n/a",
  count: 0
}];

//first lets create the map object
let map = createMap("map", [1.3521, 103.8198], 13);

//HOSPITAL JSON
axios.get('sghospitals.json').then(function(hospitals){
    let hospitalGroup = L.layerGroup();
    for (let hospital of hospitals.data){
        hospitalarray.push(hospital.abbrev);
        hospitalDict[hospital.abbrev] = 0;
        let marker = L.marker(hospital.coordinates).bindPopup(`<p>${hospital.name}</p>`);
        marker.addTo(map);
    }
    //add to map    
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


//CSV HOSPITAL
$(function(){

axios.get('covidcase.csv').then(function(response){
    csv().fromString(response.data).then(function(data){
      //console.table(data);
      for (let i in data){
       hospitalDict[data[i].Hospital] = hospitalDict[data[i].Hospital] + 1;
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
      for (let x in hospitalarray){
        hospitalCount[x] = hospitalDict[hospitalarray[x]];
        //console.log(hospitalCount[x]);
      }
    });
  });
})



//My Chart Graphs

let myChart = document.getElementById('myChart').getContext('2d');
let PopChart = new Chart(myChart,{
  type:'bar', //can be bar, horizontalbar, pie, line, doughnut,radar, polar area
  data:{
    labels: hospitalarray,
    datasets:[{
      label: 'Number of patients in each hospital',
      data: hospitalCount,
      backgroundColor: 'lightgreen'
    }]
  },
  options:{}
});


let myGraph = document.getElementById('myGraph').getContext('2d');

let dataChart = new Chart(myGraph,{
  type:'line', //can be bar, horizontalbar, pie, line, doughnut,radar, polar area
  data:{
    labels: hospitalarray,
    datasets:[{
      label: 'Rate of increase in admission',
      data: hospitalCount,
      backgroundColor: 'violet'
    }]
  },
  options:{}
});
