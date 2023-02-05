import { Coordinate } from "@/types/coordinate.type";

export const haversineDistance = (pointA: Coordinate, pointB: Coordinate): number => {
    var radius = 6371; // km     

    //convert latitude and longitude to radians
    const deltaLatitude = (pointB.lat - pointA.lat) * Math.PI / 180;
    const deltaLongitude = (pointB.lan - pointA.lan) * Math.PI / 180;

    const halfChordLength = Math.cos(
        pointA.lat * Math.PI / 180) * Math.cos(pointB.lat * Math.PI / 180)
        * Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2)
        + Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2);

    const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

    return radius * angularDistance;
};