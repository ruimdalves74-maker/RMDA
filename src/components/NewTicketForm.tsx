/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TicketCategory, TicketUrgency, UserSession, Ticket } from '../types';
import { SCHOOL_SPACES, CATEGORIES, FAULT_PRESETS, FaultPreset, SCHOOLS } from '../data';
import { Monitor, BookOpen, AlertCircle, Sparkles, Send, MapPin, Layers, Tv, HelpCircle, School } from 'lucide-react';

interface NewTicketFormProps {
  currentSession: UserSession;
  onSubmitTicket: (ticketData: {
    title: string;
    description: string;
    location: string;
    schoolId: string;
    category: TicketCategory;
    urgency: TicketUrgency;
  }) => void;
  onCancel: () => void;
}

export default function NewTicketForm({ currentSession, onSubmitTicket, onCancel }: NewTicketFormProps) {
  const [selectedSchool, setSelectedSchool] = useState('esc-camilo');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>('computer');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<TicketUrgency>('normal');
  const [errorStatus, setErrorStatus] = useState('');

  const isTeacher = currentSession.role === 'teacher';

  // Apply a preset fault templates
  const handleApplyPreset = (preset: FaultPreset) => {
    setSelectedCategory(preset.category);
    setTitle(preset.title);
    setDescription(preset.description);
    
    // Students can never choose dynamic high urgency
    if (isTeacher) {
      setUrgency(preset.urgencyDefault);
    } else {
      setUrgency('normal');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus('');

    if (!selectedSpace) {
      setErrorStatus('Por favor, selecione onde ocorreu a avaria (Sala / Espaço).');
      return;
    }

    if (!title.trim() || title.length < 5) {
      setErrorStatus('O título do problema deve conter pelo menos 5 caracteres.');
      return;
    }

    if (!description.trim() || description.length < 10) {
      setErrorStatus('Por favor, explique o problema em maior detalhe (mínimo 10 caracteres).');
      return;
    }

    onSubmitTicket({
      title: title.trim(),
      description: description.trim(),
      location: selectedSpace,
      schoolId: selectedSchool,
      category: selectedCategory,
      // Force normal if student somehow toggled high (security guard)
      urgency: isTeacher ? urgency : 'normal'
    });
  };

  const selectedCategoryDetails = CATEGORIES.find(c => c.value === selectedCategory);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden font-sans max-w-3xl mx-auto">
      {/* Form Header */}
      <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            Comunicar Nova Ocorrência / Avaria
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Emitido por {currentSession.name} ({currentSession.role === 'teacher' ? 'Docente' : 'Aluno'})
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          Cancelar
        </button>
      </div>

      <div className="p-6">
        {/* Presets Panel */}
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={14} className="text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preenchimento Ultra-Rápido (Presets escolares):</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {FAULT_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-200 px-2.5 py-1.5 rounded-xl transition-all shadow-sm text-left font-medium"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {errorStatus && (
          <div className="mb-5 rounded-xl bg-rose-50 p-4 border border-rose-100 text-sm font-medium text-rose-800 flex items-center gap-2 animate-shake">
            <AlertCircle size={18} className="text-rose-500 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* School selection */}
            <div>
              <label htmlFor="school-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Escola do Agrupamento
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <School size={16} />
                </div>
                <select
                  id="school-select"
                  required
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedSpace('');
                  }}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 text-sm outline-none transition-all cursor-pointer"
                >
                  {SCHOOLS.map(school => (
                    <option key={school.id} value={school.id}>
                      {school.shortName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Space selection */}
            <div>
              <label htmlFor="space-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Local / Sala da Avaria
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={16} />
                </div>
                <select
                  id="space-select"
                  required
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 text-sm outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Escolha uma Sala / Espaço --</option>
                  {SCHOOL_SPACES.filter(space => {
                    const isBasic = selectedSchool !== 'esc-camilo';
                    if (isBasic) {
                      // Filter complex secondary labs for basic schools
                      return space.type !== 'lab' || space.id === 'sala-a10';
                    }
                    return true;
                  }).map(space => (
                    <option key={space.id} value={space.name}>
                      {space.name} ({space.block})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Urgency selection (Conditional on role) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Urgência do Pedido
              </label>
              {isTeacher ? (
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('normal')}
                    className={`py-[9px] px-3 text-[11px] font-bold rounded-xl border transition-all ${
                      urgency === 'normal'
                        ? 'bg-slate-100 text-slate-900 border-slate-300'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Regulada
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('high')}
                    className={`py-[9px] px-3 text-[11px] font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                      urgency === 'high'
                        ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <AlertCircle size={12} className="text-rose-500" />
                    Urgente
                  </button>
                </div>
              ) : (
                <div className="mt-1.5 py-2.5 px-3 bg-slate-100/70 border border-slate-100 rounded-xl text-slate-500 text-[10px] flex items-center gap-1 leading-tight">
                  <AlertCircle size={12} className="text-slate-400 shrink-0" />
                  <span>
                    <strong>Urgência Normal</strong> atribuída a alunos. Urgências de aula requerem docente.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Category selection grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              4. Tipo de Equipamento / Sistema Afetado
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(category => {
                const isSelected = selectedCategory === category.value;
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`p-3 text-left rounded-xl border flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-600/80 text-indigo-950 ring-2 ring-indigo-100'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={`p-1.5 w-fit rounded-lg ${category.bgColor} ${category.color} border ${category.borderColor}`}>
                      {category.value === 'computer' && <Monitor size={16} />}
                      {category.value === 'projector' && <Tv size={16} />}
                      {category.value === 'network' && <Send size={16} />}
                      {category.value === 'interactive_board' && <Layers size={16} />}
                      {category.value === 'infrastructure' && <BookOpen size={16} />}
                      {category.value === 'other' && <HelpCircle size={16} />}
                    </span>
                    <span className="text-xs font-bold mt-2 leading-tight block">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedCategoryDetails && (
              <p className="mt-2 text-xs text-slate-400 italic">
                {selectedCategoryDetails.description}
              </p>
            )}
          </div>

          {/* Form input for title */}
          <div>
            <label htmlFor="title-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              5. Erro principal (Título curto)
            </label>
            <input
              id="title-input"
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Projetor não sintoniza cabo HDMI"
              className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          {/* Form input for description */}
          <div>
            <label htmlFor="desc-textarea" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              6. Descrição Detalhada / Sintomas
            </label>
            <textarea
              id="desc-textarea"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva exatamente o que está a acontecer para que os técnicos tragam os componentes certos. Por exemplo: o ecrã fica verde ao mexer na ficha, ou há luz vermelha de erro ativa no projetor do teto..."
              className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="submit-ticket-btn"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
            >
              Emitir Pedido de Assistência
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
