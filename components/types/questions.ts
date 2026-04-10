export interface IQuestionOption {
  id: string;
  text: string;
}

export interface IQuestion {
  id: string; // Уникальный ID (professionId_questionIndex)
  text: string; // Текст вопроса
  options: IQuestionOption[]; // Варианты ответов (1-5)
  correctAnswer: string; // ID правильного ответа ('a'-'e')
  explanation?: string; // Объяснение (можно добавить позже)
}
