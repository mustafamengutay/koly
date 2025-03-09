import { CreateProjectRequestDto } from '../dtos/create-project.dto';

export interface CreateProjectData {
  userId: number;
  createProjectRequestDto: CreateProjectRequestDto;
}
