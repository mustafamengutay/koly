import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ProjectDto } from '@app/common/project/dtos/project.dto';
import { CreateProjectRequestDto } from '@app/common/project/dtos/create-project.dto';
import { Observable } from 'rxjs';
import { AuthZGuard } from '@app/common/guards/authz.guard';
import { UserId } from '@app/common/decorators/user.decorator';

@UseGuards(AuthZGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create a project' })
  @ApiCreatedResponse({
    description: 'Project',
    type: ProjectDto,
  })
  @ApiConflictResponse({ description: 'Project already exists' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  signup(
    @UserId() userId: number,
    @Body() createProjectRequestDto: CreateProjectRequestDto,
  ): Observable<ProjectDto> {
    return this.projectService.create(userId, createProjectRequestDto);
  }
}
