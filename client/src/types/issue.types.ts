export interface Issue {
  id: number;
  type: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  reportedBy: {
    name: string;
    surname: string;
  };
  adoptedBy: {
    name: string;
    surname: string;
  };
}
