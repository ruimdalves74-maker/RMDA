/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ticket, TicketCategory, TicketStatus, UserSession, UserRole } from '../types';
import { CATEGORIES, SCHOOLS } from '../data';
import {
  Laptop,
  Tv,
  Wifi,
  Layers,
  Lightbulb,
  HelpCircle,
  Clock,
  Play,
  CheckCircle,
  User,
  Calendar,
  AlertTriangle,
  Trash2,
  FileCode,
  CheckSquare,
  Wrench,
  ChevronDown,
  ChevronUp,
  MessageSquareCode
} from 'lucide-react';

interface TicketCardProps {
  key?: React.Key;
  ticket: Ticket;
  currentSession: UserSession;
  onUpdateStatus: (ticketId: string, nextStatus: TicketStatus, notes: string) => void;
  onCancelTicket: (ticketId: string) => void;
}

export default function TicketCard({ ticket, currentSession, onUpdateStatus, onCancelTicket }: TicketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [techNotesForm, setTechNotesForm] = useState('');
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'cancel' | 'resolve';
    title: string;
    message: string;
    confirmLabel: string;
    confirmBtnClass: string;
  } | null>(null);

  // Get matching category properties
  const categoryInfo = CATEGORIES.find(cat => cat.value === ticket.category) || {
    label: ticket.category,
    iconName: 'HelpCircle',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-100',
    description: ''
  };

  // Render the category icon dynamically
  const renderCategoryIcon = (iconName: string) => {
    const props = { size: 20, className: "shrink-0" };
    switch (iconName) {
      case 'Laptop': return <Laptop {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Wifi': return <Wifi {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Lightbulb': return <Lightbulb {...props} />;
      default: return <HelpCircle {...props} />;
    }
  };

  // Convert Date
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const isOwner = ticket.reportedBy === currentSession.email;
  const isTechnician = currentSession.role === 'technician';

  const handleClaim = () => {
    onUpdateStatus(ticket.id, 'in_progress', `Intervenção iniciada por ${currentSession.name}.`);
  };

  const handleCancelClick = () => {
    setConfirmAction({
      type: 'cancel',
      title: 'Retirar Pedido de Assistência',
      message: 'Tem a certeza de que deseja retirar este pedido de assistência? Esta ação é irreversível.',
      confirmLabel: 'Sim, retirar',
      confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-rose-500'
    });
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmAction({
      type: 'resolve',
      title: 'Concluir e Resolver Incidência',
      message: 'Deseja marcar esta incidência como concluída e registar o relatório técnico? O professor/aluno será notificado da resolução.',
      confirmLabel: 'Confirmar Resolução',
      confirmBtnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
    });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === 'cancel') {
      onCancelTicket(ticket.id);
    } else if (confirmAction.type === 'resolve') {
      const finalNotes = techNotesForm.trim() || 'Problema inspecionado e dado como concluído.';
      onUpdateStatus(ticket.id, 'resolved', finalNotes);
      setShowNotesForm(false);
      setTechNotesForm('');
    }
    setConfirmAction(null);
  };

  const school = SCHOOLS.find(s => s.id === ticket.schoolId);
  const schoolLabel = school ? school.shortName : 'Escola';

  return (
    <div
      id={`ticket-card-${ticket.id}`}
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-200 overflow-hidden ${
        ticket.urgency === 'high' && ticket.status !== 'resolved'
          ? 'border-l-4 border-l-rose-500 border-slate-200/95 shadow-rose-100/50'
          : 'border-l-4 border-l-indigo-500 border-slate-100'
      }`}
    >
      <div className="p-5 space-y-4">
        {/* Ticket Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${categoryInfo.bgColor} ${categoryInfo.color} border ${categoryInfo.borderColor}`}>
              {renderCategoryIcon(categoryInfo.iconName)}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="text-xs font-mono text-slate-400 font-bold whitespace-nowrap">{ticket.id}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  {schoolLabel}
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{ticket.location}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-950 mt-1 capitalize leading-snug">
                {ticket.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span id={`badge-status-${ticket.id}`} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              ticket.status === 'pending'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                : ticket.status === 'in_progress'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            }`}>
              {ticket.status === 'pending' && <Clock size={12} className="text-amber-500" />}
              {ticket.status === 'in_progress' && <Play size={12} className="text-indigo-500" />}
              {ticket.status === 'resolved' && <CheckCircle size={12} className="text-emerald-500" />}
              {ticket.status === 'pending' ? 'Pendente' : ticket.status === 'in_progress' ? 'A Resolver' : 'Resolvido'}
            </span>

            {/* Urgency Badge */}
            {ticket.status !== 'resolved' && (
              <span id={`badge-urgency-${ticket.id}`} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                ticket.urgency === 'high'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                  : 'bg-slate-50 text-slate-500 border border-slate-100'
              }`}>
                {ticket.urgency === 'high' && <AlertTriangle size={12} className="text-rose-500 shrink-0" />}
                {ticket.urgency === 'high' ? 'Alta Urgência' : 'Normal'}
              </span>
            )}
          </div>
        </div>

        {/* Short & Long Description */}
        <div className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">
          <p className={isExpanded ? '' : 'line-clamp-2'}>
            {ticket.description}
          </p>
          {ticket.description.length > 110 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-indigo-600 mt-1 hover:text-indigo-800 transition-colors flex items-center gap-0.5"
            >
              {isExpanded ? (
                <>Mostar menos <ChevronUp size={12} /></>
              ) : (
                <>Ler descrição inteira <ChevronDown size={12} /></>
              )}
            </button>
          )}
        </div>

        {/* Reporter Meta & Date */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-50 pt-3">
          <div className="flex items-center gap-2">
            <User size={13} className="text-slate-400" />
            <span className="font-medium text-slate-700">{ticket.reporterName}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              ticket.reportedRole === 'teacher' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              {ticket.reportedRole === 'teacher' ? 'Professor(a)' : 'Aluno'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <Calendar size={13} />
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        {/* Technical notes from Technician */}
        {ticket.technicalNotes && (
          <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-3 text-xs text-indigo-900 leading-normal mt-2">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-indigo-950">
              <Wrench size={12} className="text-indigo-600" />
              <span>Notas do Técnico:</span>
              {ticket.assignedTo && <span className="font-normal text-slate-500">({ticket.assignedTo})</span>}
            </div>
            <p className="italic text-slate-600">{ticket.technicalNotes}</p>
          </div>
        )}

        {/* Dynamic Action Buttons (Technician, Owner) */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-50/50">
          {/* Owner delete action (only if ticket is pending) */}
          {isOwner && ticket.status === 'pending' && (
            <button
              type="button"
              id={`cancel-btn-${ticket.id}`}
              onClick={handleCancelClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 text-xs font-semibold transition-all ml-auto"
            >
              <Trash2 size={13} />
              Retirar Assistência
            </button>
          )}

          {/* Technician workflows */}
          {isTechnician && (
            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              {ticket.status === 'pending' && (
                <button
                  type="button"
                  id={`claim-btn-${ticket.id}`}
                  onClick={handleClaim}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors duration-150 shadow-sm"
                >
                  <Wrench size={13} />
                  Iniciar Assistência
                </button>
              )}

              {ticket.status === 'in_progress' && !showNotesForm && (
                <button
                  type="button"
                  id={`solve-trigger-${ticket.id}`}
                  onClick={() => setShowNotesForm(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors duration-150 shadow-sm"
                >
                  <CheckSquare size={13} />
                  Concluir Reparação
                </button>
              )}
            </div>
          )}
        </div>

        {/* Technician Notes overlay form */}
        {isTechnician && showNotesForm && (
          <form onSubmit={handleResolveSubmit} className="space-y-2 border-t border-slate-100 pt-3 animate-fade-in">
            <label htmlFor={`tech-notes-${ticket.id}`} className="block text-xs font-bold text-slate-700">
              Relatório da Intervenção Técnica:
            </label>
            <textarea
              id={`tech-notes-${ticket.id}`}
              required
              rows={2}
              value={techNotesForm}
              onChange={(e) => setTechNotesForm(e.target.value)}
              placeholder="ex: Substituído o cabo de ligação HDMI e restabelecido calibração de imagem."
              className="block w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl outline-none"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowNotesForm(false)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                id={`solve-submit-${ticket.id}`}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
              >
                <CheckCircle size={10} />
                Gravar e Resolver
              </button>
            </div>
          </form>
        )}

        {/* Action Confirmation Modal */}
        {confirmAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div 
              role="dialog"
              aria-modal="true"
              className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden scale-100 transition-transform duration-200" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    confirmAction.type === 'cancel' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {confirmAction.type === 'cancel' ? <Trash2 size={24} /> : <CheckCircle size={24} />}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {confirmAction.title}
                  </h4>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  {confirmAction.message}
                </p>

                {confirmAction.type === 'resolve' && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-1 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Relatório Técnico Registado:
                    </span>
                    <p className="text-xs italic text-slate-600 font-medium">
                      "{techNotesForm.trim() || 'Problema inspecionado e dado como concluído.'}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors"
                  >
                    Mandar Atrás / Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={executeConfirmedAction}
                    className={`px-3.5 py-2 font-bold rounded-xl text-xs transition-all shadow-sm ${confirmAction.confirmBtnClass}`}
                  >
                    {confirmAction.confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
