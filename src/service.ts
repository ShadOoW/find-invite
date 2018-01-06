import * as fs from 'fs';
import * as dotenv from 'dotenv';

export namespace Service {
    /**
     * Retrieves all users from a file
     * @param path
     */
    export function GetUsers(path: string): Promise<{users: Array<any>, errors: Array<string>}> {
        return new Promise(function (resolve: any, reject: any): void {
            fs.readFile(path, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }

                let users: Array<any> = [];
                let errors: Array<string> = [];
                data.toString().split('\n').forEach((line: string, index: number) => {
                    try {
                        let user: any = JSON.parse(line);
                        users.push(user);
                    } catch (e) {
                        errors.push(
                            'parsing error in file\'s line ' + index + '. with message: ' + e.message
                        );
                    }
                });

                resolve({
                    users: users,
                    errors: errors
                });
            });
        });
    }

    /**
     * Retrieves .env configuration file
     */
    export function GetConfig(): any {
        let config: any = dotenv.config();
        if (config.error) { throw config.error; } else { config = config.parsed; }

        return config;
    }
}
