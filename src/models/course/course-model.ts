export interface CourseType {
  id: number;
  title: string;
  subDescription: string;
  description: string;
  originalPrice?: number;
  price: number;
  whoIsThisFor?: string;
  teacher?: string;
  image: string;
}

export interface LessonType {
  id: number;
  titleLesson: string;
  videos?: number;
  durationLesson?: string;
  courseId?: number;
}

export interface SectionType {
  id: number;
  titleSection: string;
  durationSection?: string;
  preview?: boolean;
  lessonId?: number;
}

export interface QAType {
  id: number;
  question: string;
  answer: string;
}
