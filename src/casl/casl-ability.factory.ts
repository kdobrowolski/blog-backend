import { Ability, AbilityBuilder, AbilityClass, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

type Subjects = InferSubjects<string> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user): any {
        const { can, cannot, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);
    
        const { roles } = user;

        if (roles.includes('Admin')) {
            can(Action.Create, 'all');
            can(Action.Delete, 'all');
        }

        if (roles.includes('Moderator')) {
            
        }

        return build();
      }
}
