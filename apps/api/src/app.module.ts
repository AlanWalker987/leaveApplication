import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import type { Request, Response } from 'express';
import { AppResolver } from './app.resolver';
import { BranchModule } from './modules/branch/branch.module';
import { PrismaModule } from './database/prisma/prisma.modue';
import { authConfig } from './config/auth.config';
import { UserModule } from './modules/user/user.module';
import { LeaveTypeModule } from './modules/leave-type/leave-type.module';
import { PublicHolidayModule } from './modules/public-holiday/public-holiday.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { DepartmentModule } from './modules/department/department.module';
import { LeaveModule } from './modules/leave/leave.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [authConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      sortSchema: true,
      playground: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    }),
    PrismaModule,
    BranchModule,
    UserModule,
    LeaveTypeModule,
    PublicHolidayModule,
    VendorModule,
    DepartmentModule,
    LeaveModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
