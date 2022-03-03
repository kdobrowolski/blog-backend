import { Injectable } from '@nestjs/common';
import { resolveTxt } from 'dns';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { UserUpdateException } from 'src/user/exceptions/user-update.exception';

@Injectable()
export class RoleService {

    constructor(@InjectKnex() readonly knex: Knex) {}

    async createRole(id: number, roles: Array<string>): Promise<void> {
        const trx = await this.knex.transaction();
        try {
            const pairs = roles.map((role) => {
                return {
                    userId: id,
                    role
                }
            })

            if (pairs.length) await trx('roles').insert(pairs).onConflict().ignore();
            await trx('roles').where('userId', id).whereNotIn('role', roles).delete();
            await trx.commit();
        } catch (err) {
            console.error(err);
            await trx.rollback(err);
            throw new UserUpdateException('Failed updating user');
        }
    }

    async updateRole(id: number, roles: Array<string>): Promise<void> {
        await this.createRole(id, roles);
    }
}
