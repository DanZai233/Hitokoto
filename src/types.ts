export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitterId: string;
  createdAt: number;
}

export interface Admin {
  id: string;
  email: string;
  role: 'admin';
}
