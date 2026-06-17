/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, UserSession, UserRole, ActivityLog, TicketCategory } from './types';
import { INITIAL_TICKETS, SCHOOL_NAME, CATEGORIES, SCHOOL_SPACES, SCHOOLS } from './data';
import Login from './components/Login';
import DashboardStats from './components/DashboardStats';
import TicketCard from './components/TicketCard';
import NewTicketForm from './components/NewTicketForm';
import SchoolLogo from './components/SchoolLogo';
import {
  LogOut,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  School,
  Bell,
  Wrench,
  BookOpen,
  User,
  Activity,
  Trash2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TicketCategory>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'me'>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<string[]>([]);

  // 1. Initial State Load
  useEffect(() => {
    const savedTickets = localStorage.getItem('escola_tickets');
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets));
      } catch {
        setTickets(INITIAL_TICKETS);
      }
    } else {
      setTickets(INITIAL_TICKETS);
      localStorage.setItem('escola_tickets', JSON.stringify(INITIAL_TICKETS));
    }

    const savedLogs = localStorage.getItem('escola_logs');
    if (savedLogs) {
      try {
        setActivityLogs(JSON.parse(savedLogs));
      } catch {
        setActivityLogs([]);
      }
    } else {
      const initialLogs: ActivityLog[] = [
        {
          id: 'log-1',
          ticketId: 'TKT-2475',
          ticketTitle: 'Substituição recomendada de Teclado PC nº 5',
          action: 'marcado como Resolvido',
          user: 'Carlos Mendes',
          role: 'technician',
          timestamp: new Date(Date.now() - 3600000 * 44).toISOString()
        },
        {
          id: 'log-2',
          ticketId: 'TKT-2480',
          ticketTitle: 'Tomadas do balcão de química sem corrente',
          action: 'iniciou intervenção',
          user: 'Sofia Santos',
          role: 'technician',
          timestamp: new Date(Date.now() - 3600000 * 15).toISOString()
        }
      ];
      setActivityLogs(initialLogs);
      localStorage.setItem('escola_logs', JSON.stringify(initialLogs));
    }

    const savedSession = localStorage.getItem('escola_session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch {
        setSession(null);
      }
    }
  }, []);

  // Sync to local storage on ticket state change
  const saveTicketsState = (updatedTickets: Ticket[]) => {
    setTickets(updatedTickets);
    localStorage.setItem('escola_tickets', JSON.stringify(updatedTickets));
  };

  const addLog = (ticketId: string, ticketTitle: string, action: string, userName: string, userRole: UserRole) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      ticketId,
      ticketTitle,
      action,
      user: userName,
      role: userRole,
      timestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...activityLogs].slice(0, 20); // Hold last 20
    setActivityLogs(updatedLogs);
    localStorage.setItem('escola_logs', JSON.stringify(updatedLogs));

    // Show visual system toast notification
    const userRolePortuguese = userRole === 'teacher' ? 'Prof.' : userRole === 'student' ? 'Estudante' : 'Suporte';
    const notificationText = `[${userRolePortuguese}] ${userName}: ${action} no caso ${ticketId} ("${ticketTitle}")`;
    setNotifications(prev => [notificationText, ...prev].slice(0, 4));

    // Automatically dismiss notification after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== notificationText));
    }, 6000);
  };

  const handleLogin = (userSession: UserSession) => {
    setSession(userSession);
    localStorage.setItem('escola_session', JSON.stringify(userSession));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('escola_session');
  };

  // Create Ticket
  const handleSubmitTicket = (ticketData: {
    title: string;
    description: string;
    location: string;
    schoolId: string;
    category: TicketCategory;
    urgency: 'normal' | 'high';
  }) => {
    if (!session) return;

    const newTicketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      id: newTicketId,
      title: ticketData.title,
      description: ticketData.description,
      location: ticketData.location,
      schoolId: ticketData.schoolId,
      category: ticketData.category,
      urgency: ticketData.urgency,
      status: 'pending',
      reportedBy: session.email,
      reporterName: session.name,
      reportedRole: session.role,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      assignedTo: null,
      technicalNotes: null
    };

    const nextTickets = [newTicket, ...tickets];
    saveTicketsState(nextTickets);
    setShowForm(false);

    // Logging
    addLog(newTicketId, ticketData.title, 'reportou nova falha', session.name, session.role);
  };

  // Update Status / Claims
  const handleUpdateTicketStatus = (ticketId: string, nextStatus: TicketStatus, notes: string) => {
    if (!session) return;

    const updated = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: nextStatus,
          assignedTo: nextStatus === 'in_progress' ? session.name : ticket.assignedTo,
          technicalNotes: notes ? notes : ticket.technicalNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });

    saveTicketsState(updated);

    const target = tickets.find(t => t.id === ticketId);
    if (target) {
      let actionText = '';
      if (nextStatus === 'in_progress') {
        actionText = 'iniciou resolução';
      } else if (nextStatus === 'resolved') {
        actionText = 'marcou como Resolvido';
      }
      addLog(ticketId, target.title, actionText, session.name, session.role);
    }
  };

  // Cancel Ticket
  const handleCancelTicket = (ticketId: string) => {
    if (!session) return;
    const target = tickets.find(t => t.id === ticketId);
    if (!target) return;

    const remaining = tickets.filter(t => t.id !== ticketId);
    saveTicketsState(remaining);

    addLog(ticketId, target.title, 'retirou/cancelou o pedido', session.name, session.role);
  };

  // Fast Switch Role Widget for demonstration purpose
  const handleDemoSwitchRole = (newRole: UserRole) => {
    if (!session) return;
    let newEmail = 'tecnico@ecarnaxide.pt';
    let newName = 'Carlos Mendes (Suporte)';

    if (newRole === 'student') {
      newEmail = 'tiago.ribeiro@aluno.ecarnaxide.pt';
      newName = 'Tiago Ribeiro (10ºB)';
    } else if (newRole === 'teacher') {
      newEmail = 'margarida.sousa@ecarnaxide.pt';
      newName = 'Prof.ª Margarida Sousa';
    }

    const updatedSession: UserSession = {
      ...session,
      role: newRole,
      name: newName,
      email: newEmail
    };

    setSession(updatedSession);
    localStorage.setItem('escola_session', JSON.stringify(updatedSession));
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  // Filter logic
  const filteredTickets = tickets.filter(t => {
    // 1. Text Search query
    const searchString = `${t.id} ${t.title} ${t.description} ${t.location} ${t.reporterName}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    // 2. Status Filter
    const matchesStatus = statusFilter === 'all' ? true : t.status === statusFilter;

    // 3. Category Filter
    const matchesCategory = categoryFilter === 'all' ? true : t.category === categoryFilter;

    // 4. Scope Filter ("Meus Pedidos" toggle)
    const matchesScope = scopeFilter === 'all' ? true : t.reportedBy === session.email;

    // 5. School Filter
    const matchesSchool = schoolFilter === 'all' ? true : t.schoolId === schoolFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesScope && matchesSchool;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-800">
      
      {/* Live System Notifications List */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {notifications.map((notif, index) => (
          <div
            key={index}
            className="bg-slate-900 border-l-4 border-l-indigo-500 text-white p-3.5 rounded-xl shadow-xl text-xs flex items-center gap-3 animate-slide-in pointer-events-auto"
          >
            <Bell size={14} className="text-indigo-400 shrink-0 animate-bounce" />
            <span className="font-medium leading-normal">{notif}</span>
          </div>
        ))}
      </div>

      {/* Top Bar Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand Area */}
            <div className="flex items-center">
              <SchoolLogo height={42} isDark={true} />
            </div>

            {/* Middle Quick View Switcher (Evaluating Experience) */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800 border border-slate-700/60 p-1 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wide">
                Simulador de Perfil:
              </span>
              <button
                type="button"
                onClick={() => handleDemoSwitchRole('teacher')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  session.role === 'teacher'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                👨‍🏫 Professor
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitchRole('student')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  session.role === 'student'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                🎒 Aluno
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitchRole('technician')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  session.role === 'technician'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                🛠️ Técnico
              </button>
            </div>

            {/* Right Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold leading-none">{session.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">{session.email}</div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                session.role === 'technician' ? 'bg-amber-500 text-slate-950' :
                session.role === 'teacher' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {session.role === 'technician' ? 'T' : session.role === 'teacher' ? 'P' : 'A'}
              </div>
              
              <button
                type="button"
                id="header-logout-btn"
                onClick={handleLogout}
                title="Terminar Sessão"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              >
                <LogOut size={16} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 overflow-hidden">
        
        {/* Mobile simulators info widgets */}
        <div className="md:hidden bg-slate-100 p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold gap-1.5 border border-slate-200">
          <span className="text-slate-500">Perfil Ativo:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleDemoSwitchRole('teacher')}
              className={`px-2 py-0.5 rounded text-[10px] ${session.role === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'}`}
            >
              Prof
            </button>
            <button
              onClick={() => handleDemoSwitchRole('student')}
              className={`px-2 py-0.5 rounded text-[10px] ${session.role === 'student' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'}`}
            >
              Aluno
            </button>
            <button
              onClick={() => handleDemoSwitchRole('technician')}
              className={`px-2 py-0.5 rounded text-[10px] ${session.role === 'technician' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'}`}
            >
              Téc
            </button>
          </div>
        </div>

        {/* Conditionally Render Form vs Dashboard */}
        {showForm ? (
          <NewTicketForm
            currentSession={session}
            onSubmitTicket={handleSubmitTicket}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <div className="space-y-6 flex flex-col flex-1 overflow-hidden">
            
            {/* Stats Dashboard view */}
            <DashboardStats tickets={tickets} userRole={session.role} />

            {/* Workboard & Side Logs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
              
              {/* Left Column (3/4 on large devices): Ticket lists and filters */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Search & Actions Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    
                    {/* Fast Local searching bar */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Pesquisar por Sala, Categoria, Relator ou ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs transition-all outline-none"
                      />
                    </div>

                    {/* Submit ticket action */}
                    {session.role !== 'technician' ? (
                      <button
                        type="button"
                        id="create-new-ticket-trigger"
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 shrink-0"
                      >
                        <Plus size={15} />
                        Comunicar Ocorrência
                      </button>
                    ) : (
                      <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 font-semibold text-center select-none shrink-0 flex items-center gap-1.5">
                        <Wrench size={14} />
                        Menu de Comando Técnico TI
                      </div>
                    )}
                  </div>

                  {/* Operational filters grid */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-50 text-xs">
                    
                    <div className="flex items-center gap-1 text-slate-400 font-medium">
                      <SlidersHorizontal size={12} />
                      <span>Filtros:</span>
                    </div>

                    {/* Status Toggles */}
                    <div className="flex rounded-lg bg-slate-50 border border-slate-100 p-0.5">
                      <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                          statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Todos ({tickets.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                          statusFilter === 'pending' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-500 hover:text-amber-600'
                        }`}
                      >
                        Pendentes ({tickets.filter(t => t.status === 'pending').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('in_progress')}
                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                          statusFilter === 'in_progress' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-indigo-600'
                        }`}
                      >
                        A Resolver ({tickets.filter(t => t.status === 'in_progress').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('resolved')}
                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                          statusFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-emerald-600'
                        }`}
                      >
                        Resolvidos ({tickets.filter(t => t.status === 'resolved').length})
                      </button>
                    </div>

                    {/* Scope filter (Mine vs All - only for non-technicians) */}
                    {session.role !== 'technician' && (
                      <div className="flex rounded-lg bg-slate-50 border border-slate-100 p-0.5">
                        <button
                          type="button"
                          onClick={() => setScopeFilter('all')}
                          className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                            scopeFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          Toda a Escola
                        </button>
                        <button
                          type="button"
                          onClick={() => setScopeFilter('me')}
                          className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                            scopeFilter === 'me' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-indigo-600'
                          }`}
                        >
                          Meus Reportes ({tickets.filter(t => t.reportedBy === session.email).length})
                        </button>
                      </div>
                    )}

                    {/* School Filter dropdown */}
                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0 md:ml-auto">
                      <span className="text-slate-400 font-medium whitespace-nowrap">Escola:</span>
                      <select
                        value={schoolFilter}
                        onChange={(e) => setSchoolFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-1 rounded-lg outline-none transition-all text-xs font-semibold focus:bg-white cursor-pointer"
                      >
                        <option value="all">Todas</option>
                        {SCHOOLS.map(school => (
                          <option key={school.id} value={school.id}>
                            {school.shortName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category quick dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium whitespace-nowrap">Categoria:</span>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-1 rounded-lg outline-none transition-all text-xs font-semibold focus:bg-white"
                      >
                        <option value="all">Todas</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* Tickets Counter and rendering block */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    <span>Lista de Chamadas ({filteredTickets.length})</span>
                    <span>Ordenado por Urgência</span>
                  </div>

                  {filteredTickets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTickets
                        // Sort: Urgent items first (except if resolved), then date
                        .sort((a, b) => {
                          const aUrgent = a.urgency === 'high' && a.status !== 'resolved';
                          const bUrgent = b.urgency === 'high' && b.status !== 'resolved';
                          if (aUrgent && !bUrgent) return -1;
                          if (!aUrgent && bUrgent) return 1;
                          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        })
                        .map(ticket => (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            currentSession={session}
                            onUpdateStatus={handleUpdateTicketStatus}
                            onCancelTicket={handleCancelTicket}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 shadow-sm max-w-md mx-auto">
                      <div className="p-4 bg-slate-50 text-slate-300 w-fit rounded-full mx-auto mb-3">
                        <HelpCircle size={36} className="stroke-[1.2]" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">Nenhum chamado corresponde aos filtros</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Tente alterar ou limpar a sua barra de pesquisa ou os filtros de tipo no topo.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column (1/4 on large devices): Dynamic local Activity Log */}
              <div className="space-y-4">
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                    <Activity size={16} className="text-indigo-400 stroke-[2]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Circuito Interno (Logs)
                    </h3>
                  </div>

                  <div className="flow-root">
                    <ul className="-mb-8 max-h-[460px] overflow-y-auto pr-1 customize-scrollbar">
                      {activityLogs.map((log, index) => {
                        const date = new Date(log.timestamp);
                        const timeStr = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
                        const isLast = index === activityLogs.length - 1;

                        return (
                          <li key={log.id} className="relative pb-5">
                            {!isLast && (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-800"
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex space-x-3 items-start">
                              <div>
                                <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs ring-4 ring-slate-900 ${
                                  log.role === 'technician' ? 'bg-amber-950 text-amber-400 border border-amber-800/60' :
                                  log.role === 'teacher' ? 'bg-blue-950 text-blue-400 border border-blue-900/60' :
                                  'bg-emerald-950 text-emerald-400 border border-emerald-900/60'
                                }`}>
                                  {log.role === 'technician' ? '🛠️' : log.role === 'teacher' ? '👨‍🏫' : '🎒'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-[11px] font-medium text-slate-100 leading-normal">
                                  <strong>{log.user}</strong> <span className="text-slate-400">{log.action}</span>
                                </p>
                                <p className="text-[10px] text-indigo-300 font-semibold truncate hover:text-indigo-200 font-mono mt-0.5" title={log.ticketTitle}>
                                  {log.ticketId} - {log.ticketTitle}
                                </p>
                                <p className="text-[9px] text-slate-500 font-bold font-mono mt-0.5">
                                  {timeStr}
                                </p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {activityLogs.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4 italic">Sem registos de atividade.</p>
                  )}
                </div>

                {/* Secondary Box - Info on Institutional verification rules */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm leading-relaxed text-xs text-slate-500">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                    <SlidersHorizontal size={14} className="text-indigo-600" />
                    Regulação Institucional
                  </h4>
                  <p className="text-[11px] mb-2">
                    Acesso exclusivo em conformidade com as diretivas do agrupamento. O sistema divide permissões através de sufixos de email:
                  </p>
                  <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-600 pl-1">
                    <li><strong className="text-indigo-700">@ecarnaxide.pt</strong>: Professores e Assistentes (Acesso Geral + Sinal Urgente Aula)</li>
                    <li><strong className="text-emerald-700">@aluno.ecarnaxide.pt</strong>: Alunos (Avisos de espaços coletivos)</li>
                    <li><strong className="text-amber-700">tecnico. / tecnico@</strong>: Equipa TI (Controlo de trabalhos, Notas e Conclusão)</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer credits and information */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 shrink-0 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} {SCHOOL_NAME} — Direção de Sistemas de Informação.</p>
          <p className="text-[10px] text-slate-600 mt-1">Plataforma interna operada em Circuito Fechado de Assistência nas Salas e Espaços.</p>
        </div>
      </footer>

    </div>
  );
}
