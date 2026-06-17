/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Ticket, TicketCategory, UserRole } from '../types';
import { CATEGORIES, SCHOOLS } from '../data';
import { CheckCircle, Clock, AlertTriangle, PlayCircle, BarChart3, MapPin, Sparkles, School } from 'lucide-react';

interface DashboardStatsProps {
  tickets: Ticket[];
  userRole: UserRole;
}

export default function DashboardStats({ tickets, userRole }: DashboardStatsProps) {
  // Counters
  const total = tickets.length;
  const pending = tickets.filter(t => t.status === 'pending').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const highUrgency = tickets.filter(t => t.urgency === 'high' && t.status !== 'resolved').length;

  // Category stats
  const categoryStats = CATEGORIES.map(cat => {
    const count = tickets.filter(t => t.category === cat.value).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      ...cat,
      count,
      percentage
    };
  }).sort((a, b) => b.count - a.count);

  // Space stats (top 3 rooms with issues)
  const roomMap: Record<string, number> = {};
  tickets.forEach(t => {
    roomMap[t.location] = (roomMap[t.location] || 0) + 1;
  });
  const topRooms = Object.entries(roomMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // School stats
  const schoolStats = SCHOOLS.map(sc => {
    const count = tickets.filter(t => t.schoolId === sc.id).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      ...sc,
      count,
      percentage
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
            <BarChart3 size={22} id="stats-icon-total" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Casos</p>
            <h4 id="stats-val-total" className="text-2xl font-bold text-slate-900 mt-0.5">{total}</h4>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={22} id="stats-icon-pending" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pendentes</p>
            <h4 id="stats-val-pending" className="text-2xl font-bold text-slate-900 mt-0.5">
              {pending}
              {highUrgency > 0 && (
                <span className="ml-2 text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                  {highUrgency} Alta
                </span>
              )}
            </h4>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <PlayCircle size={22} id="stats-icon-inprogress" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">A Resolver</p>
            <h4 id="stats-val-inprogress" className="text-2xl font-bold text-slate-900 mt-0.5">{inProgress}</h4>
          </div>
        </div>

        {/* Resolved Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={22} id="stats-icon-resolved" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolvidos</p>
            <h4 id="stats-val-resolved" className="text-2xl font-bold text-slate-900 mt-0.5">
              {resolved}
              {total > 0 && (
                <span className="ml-2 text-xs text-emerald-600 font-medium">
                  ({Math.round((resolved / total) * 100)}%)
                </span>
              )}
            </h4>
          </div>
        </div>
      </div>

      {/* Analytics Bento Subgrid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Incidências por Tipo</span>
              <span className="text-xs font-medium text-slate-400">(Frequência global)</span>
            </h3>
          </div>
          <div className="space-y-3.5">
            {categoryStats.map(stat => (
              <div key={stat.value} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{stat.label}</span>
                  <span className="font-mono font-bold text-slate-900">
                    {stat.count} {stat.count === 1 ? 'pedido' : 'pedidos'} ({stat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500`}
                    style={{
                      width: `${stat.count > 0 ? stat.percentage : 2}%`,
                      backgroundColor: stat.value === 'computer' ? '#4f46e5' :
                                       stat.value === 'projector' ? '#d97706' :
                                       stat.value === 'network' ? '#10b981' :
                                       stat.value === 'interactive_board' ? '#8b5cf6' :
                                       stat.value === 'infrastructure' ? '#e11d48' : '#475569'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* School distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <School size={16} className="text-indigo-600" />
              <span>Pedidos por Unidade Escolar</span>
            </h3>
          </div>
          <div className="space-y-3.5">
            {schoolStats.map(stat => (
              <div key={stat.id} className="space-y-1">
                <div className="flex justify-between items-center text-[11px] sm:text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={stat.name}>
                    {stat.shortName}
                  </span>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {stat.count} {stat.count === 1 ? 'pedido' : 'pedidos'} ({stat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition-all duration-500"
                    style={{
                      width: `${stat.count > 0 ? stat.percentage : 1}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot spots (school rooms with most issues) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-rose-500" />
              <span>Espaços Críticos</span>
            </h3>

            {topRooms.length > 0 ? (
              <div className="space-y-3">
                {topRooms.map((room, index) => (
                  <div key={room.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black min-w-[20px] text-center ${
                        index === 0 ? 'text-rose-600' : index === 1 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{room.name}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-200/50 text-slate-700 px-2 py-0.5 rounded-md">
                      {room.count} {room.count === 1 ? 'Incidência' : 'Incidências'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
                <Sparkles size={24} className="text-slate-300 stroke-[1.5] mb-2" />
                <p className="text-xs font-medium">Sem dados suficientes registados.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-50 text-[11px] text-slate-400 leading-normal">
            {userRole === 'technician' ? (
              <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded block text-center">
                🛠️ Vista de Diagnóstico Operacional Ativa
              </span>
            ) : (
              <span>Os dados refletem o histórico local recente de pedidos reportados pelas salas.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
