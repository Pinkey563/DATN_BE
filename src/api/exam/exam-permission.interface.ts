import { Permission } from 'src/entities/role/permission.entity';

export enum ExamAction {
  CREATE_EXAM = 'exam__CreateExam',
  UPDATE_EXAM = 'exam__UpdateExam',
  DELETE_EXAM = 'exam__DeleteExam',
}

export const ExamSummary: Record<keyof typeof ExamAction, string> = {
  CREATE_EXAM: 'Create a new EXAM',
  UPDATE_EXAM: 'Update a EXAM',
  DELETE_EXAM: 'Delete a EXAM',
};

export const ExamPermission: Partial<Permission>[] = Object.keys(ExamAction).map((key) => ({
  code: ExamAction[key],
  name: ExamSummary[key],
}));
