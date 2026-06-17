/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher' | 'technician';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  domain: string;
}

export type TicketCategory = 'computer' | 'projector' | 'network' | 'interactive_board' | 'infrastructure' | 'other';

export type TicketUrgency = 'normal' | 'high';

export type TicketStatus = 'pending' | 'in_progress' | 'resolved';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  location: string;
  schoolId?: string;
  category: TicketCategory;
  urgency: TicketUrgency;
  status: TicketStatus;
  reportedBy: string;
  reporterName: string;
  reportedRole: UserRole;
  createdAt: string;
  updatedAt: string | null;
  assignedTo: string | null;
  technicalNotes: string | null;
}

export interface ActivityLog {
  id: string;
  ticketId: string;
  ticketTitle: string;
  action: string;
  user: string;
  role: UserRole;
  timestamp: string;
}
