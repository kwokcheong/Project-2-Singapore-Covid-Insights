
//first lets create the map object
let map = createMap("map", [1.3521, 103.8198], 13);

//Lets place the markers in all respective hospitals 
axios.get('sghospitals.json').then(function(hosptitals){
    let hospitalGroup = L.layerGroup();
    for (let hospital of hosptitals.data){
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


//Lets load in the CSV FILES
$(function(){


  
axios.get('covidcase.csv').then(function(response){
    csv().fromString(response.data).then(function(data){
      console.table(data);
      for (let i in data){
        $("#cases").append(`
            <tr> 
             <td>${data[i].Cases} </td>
             <td>${data[i].Age} </td>
             <td>${data[i].Gender}</td>
             <td>${data[i].Hospital} </td>
            </tr>
        `)
      }
    });
  });


})


//My Chart Graphs

let myChart = document.getElementById('myChart').getContext('2d');

let PopChart = new Chart(myChart,{
  type:'horizontalBar', //can be bar, horizontalbar, pie, line, doughnut,radar, polar area
  data:{
    labels:['NUH','CGH','NTFGH','SGH','NCID','SKH','KTPH','AH','FPH','GEH','KKH','KTPH','MEH','MENH'],
    datasets:[{
      label: 'Population',
      data:[
        30,
        20,
        40,
        40,
        50,
        30,
        23,
        41,
        34,
        32,
        13,
        44
      ],
      backgroundColor: 'lightgreen'
    }]
  },
  options:{}
});


let myGraph = document.getElementById('myGraph').getContext('2d');

let dataChart = new Chart(myGraph,{
  type:'line', //can be bar, horizontalbar, pie, line, doughnut,radar, polar area
  data:{
    labels:['NUH','CGH','NTFGH','SGH','NCID','SKH','KTPH','AH','FPH','GEH','KKH','KTPH','MEH','MENH'],
    datasets:[{
      label: 'Population',
      data:[
        30,
        20,
        40,
        40,
        50,
        30,
        23,
        41,
        34,
        32,
        13,
        44
      ],
      backgroundColor: 'violet'
    }]
  },
  options:{}
});
