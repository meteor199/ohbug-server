import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { EventModule } from './event/event.module'
import { IssueModule } from './issue/issue.module'
import { OrganizationModule } from './organization/organization.module'
import { ProjectModule } from './project/project.module'
import { SourceMapModule } from './sourceMap/sourceMap.module'
import { InviteModule } from './invite/invite.module'

@Module({
  imports: [
    AuthModule,
    UserModule,
    EventModule,
    IssueModule,
    OrganizationModule,
    ProjectModule,
    SourceMapModule,
    InviteModule,
  ],
})
export class ApiModule {}
