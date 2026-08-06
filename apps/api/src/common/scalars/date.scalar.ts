import { Scalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";

@Scalar('DateTime')
export class DateScalar{
    description = 'Date custom scalar type';

    parseValue(value: string): Date {
        return new Date(value); // value from the client
    }

    serialize(value: Date): number {
        return value.getTime(); // value sent to the client
    }

    parseLiteral(ast : ValueNode): Date | null {
        if(ast.kind === Kind.INT){
            return new Date(Number(ast.value))
        }
        if(ast.kind === Kind.STRING){
            return new Date(ast.value)
        }
        return null;
    }
}