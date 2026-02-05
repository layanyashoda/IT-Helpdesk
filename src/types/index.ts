export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  specialization: string[];
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory =
  | 'hardware'
  | 'software'
  | 'network'
  | 'email'
  | 'security'
  | 'access'
  | 'other';

export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'comment_added'
  | 'resolved'
  | 'reopened';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  timestamp: string;
  user: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  author: User | Agent;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // Base64 data URI for this prototype
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  department?: string;
  requestType?: 'incident' | 'service_request' | 'problem' | 'change_request';
  createdAt: string;
  updatedAt: string;
  assignedTo?: Agent;
  createdBy: User;
  approverId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  comments: Comment[];
  activities?: ActivityEntry[];
  attachments?: Attachment[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: TicketCategory;
  tags: string[];
  views: number;
  helpful: number;
  createdAt: string;
}

export interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  avgResponseTime: string;
  criticalTickets: number;
  totalTickets: number;
}

