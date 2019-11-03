// Requires
const fs = require('fs');
const fetch = require('node-fetch');

// Get the detail levels
async function getDetailLevels(){

    for (let i = 0; i <= 9; i++){
        const month = 2629743000;
        const day = 86400000;
        let checkIn = Date.now() + month;
        let checkOut = checkIn + day;
        let body = {
            "rqst": {
                "Credentials": {
                    "UserName": 'classified',
                    "Password": "classified"
                },
                "Request": {
                    "__type": "HotelsServiceSearchRequest",
                    "ClientIP": null,
                    "DesiredResultCurrency": "USD",
                    "Residency": "US",
                    "CheckIn": `\/Date(${checkIn})\/`,
                    "CheckOut": `\/Date(${checkOut})\/`,
                    "ContractIds": null,
                    "DetailLevel": i,
                    "ExcludeHotelDetails": false,
                    "GeoLocationInfo": null,
                    "RadiusInMeters": null,
                    "HotelLocation": null,
                    "HotelIds": [4094284],
                    "IncludeCityTax": false,
                    "Nights": 0,
                    "Rooms": [{
                            "AdultsCount": 1
                        }
                    ],
                    "SupplierIds": null
                },
                "RequestType": 1,
                "TypeOfService": 2
            }
        };
    
        // Make the request
        let request = await fetch('https://services.carsolize.com/BookingServices/DynamicDataService.svc/json/ServiceRequest', {
            method: 'POST',
            body: JSON.stringify(body)
        }).catch(e => console.log(e));
    
        let response = await request.json();
        let results = response;
        let keys = keyer(results).filter(key => isNaN(key));
        let text = "";
        for (let key of keys){
            text += `${key}\n`;
        }
        
        fs.writeFile(`./results/${i}.txt`, text, err => {
            if (err) throw err;
        });
    }
}

// Returns an array of keys via recursion
function keyer(object){

    let keys = [];

    for (let key of Object.keys(object)){

        // Get key's type
        let type = typeof object[key];

        // Add new key
        if (type != "object"){
            if (!keys.includes(key)) keys.push(key);
        }

        // Key is an object
        else{

            // Add the parent
            if (!keys.includes(key)) keys.push(key);

            // Recursion
            let subkeys = keyer(object[key]);
            for (let key of subkeys){
                if (!keys.includes(key)) keys.push(key);
            }
        }
    }

    return keys;
}

// Run
getDetailLevels();