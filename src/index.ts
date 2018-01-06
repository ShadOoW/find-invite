import { Domain } from './domain';
import { Service } from './service';
import { Helper } from './helper';

async function execute (): Promise<{ invitedUsers: Array<any>, errors: Array<string>}> {
    let invitedUsers: Array<any> = [];

    try {
        const config: any = Service.GetConfig();
        const inviteDistance: number = config.DISTANCE | 100;
        const source: Domain.GeoCoordinate = new Domain.GeoCoordinate(
            Number.parseFloat(config.EVENT_LATITUDE),
            Number.parseFloat(config.EVENT_LONGITUDE)
        );

        let sourceErrors: Array<string> = Domain.NumberValidator(source.latitude, 'latitude');
        sourceErrors = sourceErrors.concat(Domain.NumberValidator(source.longitude, 'longitude'));
        sourceErrors = sourceErrors.concat(Domain.GeoCoordinateValidator(source));
        if (sourceErrors.length > 0) {
            return { invitedUsers: invitedUsers, errors: ['config file event\'s GeoCoordinate is not valid: ' + sourceErrors[0]]};
        }

        let data: {users: Array<any>, errors: Array<string>} = await Service.GetUsers('./src/data.txt');
        if (data.users.length > 0) {
            data.users.forEach((user: any, index: number) => {
                let target: Domain.GeoCoordinate = new Domain.GeoCoordinate(
                    Number.parseFloat(user.latitude),
                    Number.parseFloat(user.longitude)
                );

                let targetErrors: Array<string> = [];
                targetErrors.concat(Domain.NumberValidator(target.latitude, 'latitude'));
                targetErrors.concat(Domain.NumberValidator(target.longitude, 'longitude'));
                targetErrors.concat(Domain.GeoCoordinateValidator(target));

                if (targetErrors.length > 0) {
                    data.errors.push(
                        'validation error in line: ' + index, '. message: ' + targetErrors[0]
                    );
                } else {
                    user.distance = Domain.CalculateDistance(source, target);

                    if (user.distance <= inviteDistance) {
                        invitedUsers.push(user);
                    }
                }
            });
        }

        return {invitedUsers: invitedUsers, errors: data.errors};

    } catch (e) {
        console.warn(e);
    }
}

execute().then((result: { invitedUsers: Array<any>, errors: Array<string>}): void => {
    result.invitedUsers = Helper.SortUsersByID(result.invitedUsers);

    if (result.errors.length > 0) {
        console.log('---- Errors: ----');
        console.log(result.errors);
    }

    if (result.invitedUsers.length > 0) {
        console.log('---- Users to invite: ' + result.invitedUsers.length + '----');

        result.invitedUsers.forEach((user) => {
            console.log(
                'ID: ' + user.user_id +
                ' - Distance: ' + user.distance.toFixed(2) + ' KM' +
                ' - Name: ' + user.name
            );
        });
    }
});
