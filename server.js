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
                    "UserName": 'username',
                    "Password": 'password'
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
    
        // The http response
        let response = await request.json();
        response = response.ServiceRequestResult.HotelsSearchResponse.Result;

        // Extract all keys
        let keys = keyer(response, false).filter(key => isNaN(key));

        // 
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
function keyer(object, caseSensitive){

    // The array of keys to return
    let keys = [];

    // Pushes a key to the array of keys, if it doesn't already exists
    function push(key){
    
        // Key already exists in the array, return
        if (keys.includes(key)) return;

        // Case sensitive
        if (caseSensitive){
            keys.push(key);
        }

        // Case insensitive
        else{
            let lowercaseKeys = keys.map(k => k.toLowerCase());
            if (!lowercaseKeys.includes(key.toLowerCase())) keys.push(key);
        }
    };

    // Loop through all keys of the object
    for (let key of Object.keys(object)){

        // Push the key to the array
        push(key);

        // Key is an object - add its keys as well
        if (typeof object[key] == "object"){

            let subkeys = keyer(object[key], caseSensitive);
            for (let subkey of subkeys){
                push(subkey);
            }
        }
    }

    return keys;
}

// Run
getDetailLevels();