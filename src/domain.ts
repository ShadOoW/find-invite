export namespace Domain {
    /**
     * Represent GeoCoordinate's latitude and longitude
     */
    export class GeoCoordinate {
        public latitude: number;
        public longitude: number;

        constructor(latitude: number, longitude: number) {
            this.latitude = latitude;
            this.longitude = longitude;
        }

        /**
         * Convert from degree to radiant
         */
        public toRadians(): GeoCoordinate {
            return new GeoCoordinate(this.latitude * Math.PI / 180, this.longitude * Math.PI / 180);
        }

        /**
         * Subtract a coordinate from this
         */
        public subtract(coordinate: GeoCoordinate): GeoCoordinate {
            return new GeoCoordinate(this.latitude - coordinate.latitude, this.longitude - coordinate.longitude);
        }
    }

    /**
     * Calculates the distance between geo locations
     * @param source
     * @param target
     */
    export function CalculateDistance(source: GeoCoordinate, target: GeoCoordinate): number {
        let earthRadius: number = 6371e3;
        let originRadiant: GeoCoordinate = source.toRadians();
        let targetRadiant: GeoCoordinate = target.toRadians();
        let deltaRadiant: GeoCoordinate = targetRadiant.subtract(originRadiant);

        let chordLength: number =
            Math.sin(deltaRadiant.latitude / 2) * Math.sin(deltaRadiant.latitude / 2) +
            Math.cos(originRadiant.latitude) * Math.cos(targetRadiant.latitude) *
            Math.sin(deltaRadiant.longitude / 2) * Math.sin(deltaRadiant.longitude / 2);

        let angularDistance: number = 2 * Math.atan2(Math.sqrt(chordLength), Math.sqrt(1 - chordLength));

        return (earthRadius * angularDistance) / 1000; // Converts value from meter to kilometers
    }

    /**
     * Validate coordinate's latitude and longitude
     * @param coordinate
     */
    export function GeoCoordinateValidator(coordinate: GeoCoordinate): Array<string> {
        let errors: Array<string> = [];

        if (coordinate.latitude > 90 || coordinate.latitude < -90) {
            errors.push(
                'latitude must be a number between -90 and 90. found: ' + coordinate.latitude
            );
            return errors;
        }

        if (coordinate.longitude > 180 || coordinate.longitude < -180) {
            errors.push(
                'longitude must be a number between -180 and 180. found: ' + coordinate.longitude
            );
            return errors;
        }

        return errors;
    }

    /**
     * Validate if value is a valid number
     * @param value
     * @param fieldName
     */
    export function NumberValidator(value: any, fieldName: string): Array<string> {
        let errors: Array<string> = [];

        if (isNaN(value) === true) {
            errors.push(fieldName + ' is not a number');
        }

        return errors;
    }
}
