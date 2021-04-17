import { Get, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import {
  TOPIC_DASHBOARD_MANAGER_GET_ISSUE,
  TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
  TOPIC_DASHBOARD_MANAGER_GET_TREND,
} from '@ohbug-server/common'

import { ProjectService } from '@/api/project/project.service'

import type {
  GetIssueByIssueIdParams,
  GetIssuesByProjectIdParams,
  Period,
} from './issue.interface'

@Injectable()
export class IssueService {
  constructor(private readonly projectService: ProjectService) {}

  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy

  /**
   * 根据 issue_id 取到对应 issue
   *
   * @param issue_id
   */
  @Get('/:issue_id')
  async getIssueByIssueId({ issue_id }: GetIssueByIssueIdParams) {
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_ISSUE, {
        issue_id,
      })
      .toPromise()
  }

  /**
   * 查询 issues
   *
   * @param project_id
   * @param searchCondition
   * @param limit
   * @param skip
   */
  async searchIssues({
    project_id,
    searchCondition,
    limit,
    skip,
  }: GetIssuesByProjectIdParams) {
    const { apiKey } = await this.projectService.getProject({ project_id })
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES, {
        apiKey,
        searchCondition,
        limit,
        skip,
      })
      .toPromise()
  }

  /**
   * 根据 issue_id 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  async getTrendByIssueId(ids: number[], period: Period) {
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_TREND, { ids, period })
      .toPromise()
  }
}
