import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common'

import { IssueService } from './issue.service'
import {
  GetIssueByIssueIdDto,
  GetIssueDto,
  GetTrendByIssueIdDto,
} from './issue.dto'

const limit = 20

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  /**
   * 根据 issueId 取到对应 issue
   *
   * @param issueId
   */
  @Get(':issueId')
  async get(
    @Param()
    { issueId }: GetIssueByIssueIdDto
  ) {
    return this.issueService.getIssueByIssueId({
      issueId,
    })
  }

  /**
   * 查询 issues
   *
   * @param projectId
   * @param page
   * @param start
   * @param end
   */
  @Get()
  async getMany(
    @Query()
    { projectId, page, start, end }: GetIssueDto
  ) {
    const skip = parseInt((page as unknown) as string, 10) * limit
    const searchCondition = { start, end }
    return this.issueService.searchIssues({
      projectId,
      searchCondition,
      limit,
      skip,
    })
  }

  /**
   * 根据 issueId 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  @Post('trend')
  async getTrendByIssueId(
    @Body()
    { ids, period }: GetTrendByIssueIdDto
  ) {
    return this.issueService.getTrendByIssueId(ids, period)
  }
}
