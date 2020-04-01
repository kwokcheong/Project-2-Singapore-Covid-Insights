
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
            <li> ${data[i].Hospital} </li>
        `)
      }
    });
  });


})