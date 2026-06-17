/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSession, UserRole } from '../types';
import { SCHOOL_NAME, DEFAULT_DOMAINS } from '../data';
import { School, Mail, User, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import SchoolLogo from './SchoolLogo';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); // Simulated password
  const [error, setError] = useState('');

  // Auto-detect role based on email context
  const detectRoleAndName = (inputEmail: string): { role: UserRole; label: string } => {
    const lowerEmail = inputEmail.toLowerCase().trim();
    if (lowerEmail.startsWith('tecnico.') || lowerEmail.startsWith('suporte.') || lowerEmail.includes('tecnico@')) {
      return { role: 'technician', label: 'Técnico de Informática' };
    }
    if (lowerEmail.endsWith('@aluno.ecarnaxide.pt')) {
      return { role: 'student', label: 'Aluno / Estudante' };
    }
    return { role: 'teacher', label: 'Professor / Docente' };
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedName = name.trim() || trimmedEmail.split('@')[0].split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

    if (!trimmedEmail) {
      setError('Por favor, introduza o seu email institucional.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Introduza um endereço de email válido.');
      return;
    }

    // Check school domains
    const isInstitutional = DEFAULT_DOMAINS.some(domain => trimmedEmail.toLowerCase().endsWith(`@${domain}`)) ||
      trimmedEmail.toLowerCase().endsWith('.ecarnaxide.pt') ||
      trimmedEmail.toLowerCase() === 'tecnico@ecarnaxide.pt';

    if (!isInstitutional) {
      setError('Apenas são permitidos emails sob os domínios institucionais da escola (ex: @ecarnaxide.pt ou @aluno.ecarnaxide.pt).');
      return;
    }

    const { role } = detectRoleAndName(trimmedEmail);

    onLogin({
      email: trimmedEmail,
      name: trimmedName,
      role,
      domain: trimmedEmail.split('@')[1]
    });
  };

  const handleQuickLogin = (demoEmail: string, demoName: string, demoRole: UserRole) => {
    onLogin({
      email: demoEmail,
      name: demoName,
      role: demoRole,
      domain: demoEmail.split('@')[1]
    });
  };

  const detectedInfo = email.includes('@') ? detectRoleAndName(email) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <SchoolLogo height={84} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-950">
          Suporte Técnico
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 max-w-sm mx-auto">
          <span className="inline-flex items-center gap-1 mt-1 font-medium text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
            Circuito Fechado
          </span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100">
          <form className="space-y-5" onSubmit={handleFormLogin}>
            {error && (
              <div className="rounded-xl bg-rose-50 p-4 border border-rose-100 animate-shake">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-rose-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email-input" className="block text-sm font-medium text-slate-700">
                Email Institucional
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: nome@ecarnaxide.pt ou @aluno.ecarnaxide.pt"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm transition-all outline-none"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                O domínio identifica automaticamente se é Professor ou Aluno.
              </p>
            </div>

            <div>
              <label htmlFor="name-input" className="block text-sm font-medium text-slate-700">
                Nome (Opcional)
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name-input"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome Completo"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-slate-700">
                Palavra-passe (Simulada / Qualquer)
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck size={18} />
                </div>
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm transition-all outline-none"
                />
              </div>
            </div>

            {detectedInfo && (
              <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-3 text-xs flex items-center justify-between">
                <span className="text-indigo-900 font-medium">Cargo Detetado:</span>
                <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider ${
                  detectedInfo.role === 'technician' ? 'bg-amber-100 text-amber-800' :
                  detectedInfo.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {detectedInfo.label}
                </span>
              </div>
            )}

            <div>
              <button
                type="submit"
                id="login-submit-button"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
              >
                Entrar com Email Institucional
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Spacer & Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-semibold text-slate-400 uppercase tracking-widest text-[10px]">
                Acesso Rápido de Demo
              </span>
            </div>
          </div>

          {/* Quick Logins for Testing */}
          <div className="mt-5 space-y-2.5">
            <button
              type="button"
              id="quick-login-teacher"
              onClick={() => handleQuickLogin('margarida.sousa@ecarnaxide.pt', 'Prof.ª Margarida Sousa', 'teacher')}
              className="w-full text-left p-3 rounded-xl border border-dashed border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold">
                  👨‍🏫
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Prof.ª Margarida Sousa</div>
                  <div className="text-[10px] text-slate-400">margarida.sousa@ecarnaxide.pt</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                PROFESSORA
              </span>
            </button>

            <button
              type="button"
              id="quick-login-student"
              onClick={() => handleQuickLogin('tiago.ribeiro@aluno.ecarnaxide.pt', 'Tiago Ribeiro (10ºB)', 'student')}
              className="w-full text-left p-3 rounded-xl border border-dashed border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-bold">
                  🎒
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Tiago Ribeiro (10ºB)</div>
                  <div className="text-[10px] text-slate-400">tiago.ribeiro@aluno.ecarnaxide.pt</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ALUNO
              </span>
            </button>

            <button
              type="button"
              id="quick-login-tech"
              onClick={() => handleQuickLogin('tecnico@ecarnaxide.pt', 'Carlos Mendes (TI)', 'technician')}
              className="w-full text-left p-3 rounded-xl border border-dashed border-slate-200 hover:border-amber-300 hover:bg-slate-50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg font-bold">
                  🛠️
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Carlos Mendes (Suporte)</div>
                  <div className="text-[10px] text-slate-400 font-mono">tecnico@ecarnaxide.pt</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                TÉCNICO (TI)
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Instructions Info */}
      <div className="mt-8 text-center text-xs text-slate-400 max-w-md mx-auto px-4 leading-relaxed">
        <Sparkles size={14} className="inline text-amber-500 mr-1 pb-0.5" />
        Sistema interno escolar de resposta a falhas. Os relatórios são enviados automaticamente ao departamento de sistemas de informação do agrupamento de escolas.
      </div>
    </div>
  );
}
