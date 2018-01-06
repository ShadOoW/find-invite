import { expect } from 'chai';
import { Domain } from './domain';

describe('Number Parsing Validation:', () => {
    describe('validate()', () => {
        ['1', ' 2 ', -1.1].forEach(value => {
            it('should pass validation if value is a number.', () => {
                let result: Array<string> = Domain.NumberValidator(value, 'test input');
                expect(result).to.be.eql([]);
            });
        });
    });

    describe('validate()', () => {
        [
            Number.parseFloat(''),
            Number.parseFloat('banana'),
            Number.parseFloat(null)
        ].forEach(value => {
            it('should return error if value is not a number.', () => {
                let result: Array<string> = Domain.NumberValidator(value, 'test input');
                expect(result).to.eql(['test input is not a number']);
            });
        });
    });
});

describe('GeoCoordinate Validation:', () => {
    describe('validate()', () => {
        [
            new Domain.GeoCoordinate(90, 180),
            new Domain.GeoCoordinate(-90, -180),
            new Domain.GeoCoordinate(0, 0)
        ].forEach(value => {
            it('should pass validation if coordinate is valid.', () => {
                let result: Array<string> = Domain.GeoCoordinateValidator(value);
                expect(result).to.be.eql([]);
            });
        });
    });

    describe('validate()', () => {
        [
            {
                actual: new Domain.GeoCoordinate(100, 0),
                expected: ['latitude must be a number between -90 and 90. found: 100']
            },
            {
                actual: new Domain.GeoCoordinate(-100, 0),
                expected: ['latitude must be a number between -90 and 90. found: -100']
            },
            {
                actual: new Domain.GeoCoordinate(0, 200),
                expected: ['longitude must be a number between -180 and 180. found: 200']
            },
            {
                actual: new Domain.GeoCoordinate(0, -200),
                expected: ['longitude must be a number between -180 and 180. found: -200']
            }
        ].forEach(value => {
            it('should return error if coordinate are not valid.', () => {
                let result: Array<string> = Domain.GeoCoordinateValidator(value.actual);
                expect(result).to.be.eql(value.expected);
            });
        });
    });
});

describe('Distance Calculation:', () => {
    describe('calculate()', () => {
        // Valid Data extracted from
        // https://www.movable-type.co.uk/scripts/latlong.html

        [
            {
                actual: {
                    source: new Domain.GeoCoordinate(53.339428, 6.257664),
                    target: new Domain.GeoCoordinate(53.339428, 6.257664)
                },
                expect: 0
            },
            {
                actual: {
                    source: new Domain.GeoCoordinate(53.339428, 6.257664),
                    target: new Domain.GeoCoordinate(0, 0)
                },
                expect: 5959
            },
            {
                actual: {
                    source: new Domain.GeoCoordinate(53.339428, 6.257664),
                    target: new Domain.GeoCoordinate(90, 180)
                },
                expect: 4076
            },
            {
                actual: {
                    source: new Domain.GeoCoordinate(53.339428, 6.257664),
                    target: new Domain.GeoCoordinate(20, 40)
                },
                expect: 4691
            }
        ].forEach(value => {
            it('should pass test if calculated distance matches expected distance.', () => {
                let result: number = Domain.CalculateDistance(value.actual.source, value.actual.target);
                expect(Math.floor(result)).to.be.eql(value.expect);
            });
        });
    });
});