import { Log } from "../util/Logger";
import { api } from "../util/api";
import { GOOGLE_MAPS_API_KEY } from "@env";


/**
 *
 * @param {int} groupId
 * @param {Object} user
 * @param {Function} callback - callback(message, groupId)
 */
export const getFare = async function (groupId, user, callback) {
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            auth: user.token,
        },
    };
    Log("getFare: 16 making request", groupId); 
    const formData = new FormData();
    formData.append("group-id", groupId);

    api.post(`route/calculateFare.php`, formData, config)
        .then((resp) => {
            // Log("Getting fare in herec", resp.data);

            if (resp.data.status == "OK") {
                callback(JSON.parse(resp.data.message), groupId);
            } else {
                Log("Error from calculate fare:", resp.data.message);
            }
        })
        .catch((err) => {
            Log("Getting fare", err);
        });
};

export const cancelRide = async function (routeInfo, user) {
    Log("Cancel Ride: making 37 request", routeInfo);
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            auth: user.token,
        },
    };
    let formData = new FormData();
    formData.append("route-info", JSON.stringify(routeInfo));
    return await api.post(`route/cancel.php`, formData, config);
};
/**
 *
 * @param {int} seconds
 * @param {boolean} withHours - should the hours shown in the formatted time.
 */
export const timeFormatter = (seconds, withHours = false) => {
    let s = seconds % 60;
    let m = Math.trunc(seconds / 60) % 60;
    let h = Math.trunc(seconds / 3600) % 24;

    return `${withHours ? `${h}:` : ""} ${m}:${s < 10 ? `0${s}` : s}`;
};

export const assignDriver = async (routeInfo, user) =>{
    Log("Assigning driver: making 62 request", routeInfo);
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            auth: user.token,
        },
    };
    let formData = new FormData();
    formData.append("groupId", routeInfo.groupId);
    return await api.post(`roe/assignDriver.php`, formData, config);
}

export const getPlace = async(placeId) => {

    try {
        let resp = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,name,geometry&key=${GOOGLE_MAPS_API_KEY}`
        );
        let place = await resp.json();
        return place;
    } catch (error) {
        return error; 
    }
    
}

export const startTimer = async(routeInfo, user) => {
    Log("Starting Timer: Making request", routeInfo);
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            auth: user.token,
        },
    };
    let formData = new FormData();
    formData.append("groupId", routeInfo.groupId);
    return await api.post(`roe/startTimer.php`, formData, config);
}

export const getDriverInfo = async(driverId, user) =>{
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            auth: user.token,
        },
    };
    let formData = new FormData();
    formData.append("driverId", driverId);
    return await api.post(`roe/getDriver.php`, formData, config);
}