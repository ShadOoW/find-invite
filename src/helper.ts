export namespace Helper {
    /**
     * Sorts user array by user_id key, from lower to higher
     * @param users
     */
    export function SortUsersByID(users: Array<any>): Array<any> {
        return users.sort((a, b) => a.user_id - b.user_id);
    }
}
