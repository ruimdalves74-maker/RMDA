/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticket, TicketCategory } from './types';

export const SCHOOL_NAME = 'Agrupamento de Escolas de Carnaxide';
export const DEFAULT_DOMAINS = ['ecarnaxide.pt', 'aluno.ecarnaxide.pt'];

export interface School {
  id: string;
  name: string;
  shortName: string;
}

export const SCHOOLS: School[] = [
  { id: 'esc-camilo', name: 'Escola Secundária de Camilo Castelo Branco', shortName: 'ES Camilo Castelo Branco' },
  { id: 'esc-vieira', name: 'Escola Básica Vieira da Silva', shortName: 'EB Vieira da Silva' },
  { id: 'esc-sylvia', name: 'Escola Básica Sylvia Philips', shortName: 'EB Sylvia Philips' },
  { id: 'esc-antero', name: 'Escola Básica Antero Basalisa', shortName: 'EB Antero Basalisa' },
  { id: 'esc-svento', name: 'Escola Básica de S.Bento', shortName: 'EB S.Bento' }
];

export interface SchoolSpace {
  id: string;
  name: string;
  block: string;
  floor: string;
  type: 'classroom' | 'lab' | 'common' | 'office';
}

export const SCHOOL_SPACES: SchoolSpace[] = [
  // Bloco A (Salas de Aula e Direção)
  { id: 'sala-a01', name: 'Sala A01', block: 'Bloco A', floor: 'R/C', type: 'classroom' },
  { id: 'sala-a02', name: 'Sala A02', block: 'Bloco A', floor: 'R/C', type: 'classroom' },
  { id: 'sala-a10', name: 'Sala A10 (Informática)', block: 'Bloco A', floor: '1º Piso', type: 'lab' },
  { id: 'sala-a11', name: 'Sala A11', block: 'Bloco A', floor: '1º Piso', type: 'classroom' },
  { id: 'sala-a12', name: 'Sala A12', block: 'Bloco A', floor: '1º Piso', type: 'classroom' },
  
  // Bloco B (Laboratórios e Biblioteca)
  { id: 'lab-fisica', name: 'Laboratório de Física', block: 'Bloco B', floor: 'R/C', type: 'lab' },
  { id: 'lab-quimica', name: 'Laboratório de Química', block: 'Bloco B', floor: 'R/C', type: 'lab' },
  { id: 'biblioteca', name: 'Biblioteca Escolar', block: 'Bloco B', floor: '1º Piso', type: 'common' },
  { id: 'sala-b12', name: 'Sala B12 (Artes)', block: 'Bloco B', floor: '1º Piso', type: 'classroom' },
  
  // Bloco C (Serviços e Outros)
  { id: 'gabinete-direcao', name: 'Gabinete da Direção', block: 'Bloco C', floor: 'R/C', type: 'office' },
  { id: 'secretaria', name: 'Secretaria / Serviços Administrativos', block: 'Bloco C', floor: 'R/C', type: 'office' },
  { id: 'associacao-estudantes', name: 'Associação de Estudantes', block: 'Bloco C', floor: 'R/C', type: 'common' },
  { id: 'sala-professores', name: 'Sala de Professores', block: 'Bloco C', floor: '1º Piso', type: 'office' },
  { id: 'auditorio', name: 'Auditório Principal', block: 'Bloco C', floor: 'R/C', type: 'common' },
  
  // Espaços Exteriores/Desportivos
  { id: 'pavilhao-gimnodesportivo', name: 'Pavilhão Gimnodesportivo', block: 'Desporto', floor: 'R/C', type: 'common' },
  { id: 'bar-alunos', name: 'Bar de Alunos / Refeitório', block: 'Social', floor: 'R/C', type: 'common' },
];

export interface CategoryInfo {
  value: TicketCategory;
  label: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    value: 'computer',
    label: 'Computador / Hardware',
    iconName: 'Laptop',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-100 dark:border-indigo-900',
    description: 'Problemas no computador do professor, PCs de alunos ou periféricos (ratos, teclados).'
  },
  {
    value: 'projector',
    label: 'Projetor / Ecrã',
    iconName: 'Tv',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-100 dark:border-amber-900',
    description: 'Ecrã sem imagem, cores descalibradas, projetor não liga ou sem cabo HDMI.'
  },
  {
    value: 'network',
    label: 'Internet / Wi-Fi',
    iconName: 'Wifi',
    color: 'text-emerald-500 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-100 dark:border-emerald-900',
    description: 'Sem sinal de rede, quebras de ligação ou falhas na rede de convidados/alunos.'
  },
  {
    value: 'interactive_board',
    label: 'Quadro Interativo / Smartboard',
    iconName: 'Layers',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-100 dark:border-purple-900',
    description: 'Calibração do toque falhou, erro de som do quadro ou desconfigurado.'
  },
  {
    value: 'infrastructure',
    label: 'Infraestrutura / Eletricidade',
    iconName: 'Lightbulb',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-100 dark:border-rose-900',
    description: 'Tomadas sem corrente, lâmpadas fundidas, cabos elétricos expostos ou avariados.'
  },
  {
    value: 'other',
    label: 'Outras Falhas Técnicas',
    iconName: 'HelpCircle',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-950/40',
    borderColor: 'border-slate-100 dark:border-slate-900',
    description: 'Qualquer outra avaria ou necessidade que não se enquadre nas categorias principais.'
  }
];

export interface FaultPreset {
  id: string;
  category: TicketCategory;
  title: string;
  description: string;
  urgencyDefault: 'normal' | 'high';
}

export const FAULT_PRESETS: FaultPreset[] = [
  {
    id: 'p1',
    category: 'computer',
    title: 'PC do professor não liga',
    description: 'O computador da secretária do professor não emite qualquer sinal de vida. As luzes da torre estão apagadas e o ecrã diz "Sem Sinal". Todos os cabos parecem ligados.',
    urgencyDefault: 'high'
  },
  {
    id: 'p2',
    category: 'projector',
    title: 'Projetor pisca luz vermelha e desliga-se',
    description: 'O projetor liga durante 20 segundos com ruído elevado da ventoinha, a imagem não aparece e depois começa a piscar um LED vermelho de aviso (aparentemente sobreaquecimento ou lâmpada).',
    urgencyDefault: 'high'
  },
  {
    id: 'p3',
    category: 'projector',
    title: 'Ecrã do projetor encravado',
    description: 'O comando do ecrã elétrico de projeção não responde nem para subir nem para descer. Ouve-se um pequeno estalido na caixa mas o ecrã permanece preso.',
    urgencyDefault: 'normal'
  },
  {
    id: 'p4',
    category: 'network',
    title: 'Sem acesso à Internet (Wi-Fi e Cabo)',
    description: 'Os computadores da sala exibem o ícone de aviso de falta de internet. Reiniciámos o browser e as máquinas, mas continuamos sem ligação à rede interna ou exterior.',
    urgencyDefault: 'high'
  },
  {
    id: 'p5',
    category: 'interactive_board',
    title: 'Descalibração do Quadro Interativo',
    description: 'Ao pressionar a caneta digital de calibração, o toque regista-se cerca de 10 centímetros de desvio para o lado esquerdo, tornando impossível desenhar ou controlar os botões.',
    urgencyDefault: 'normal'
  },
  {
    id: 'p6',
    category: 'infrastructure',
    title: 'Tomadas elétricas da mesa de teste sem energia',
    description: 'As tomadas triplas ao longo do balcão de experiências de laboratório não ligam nenhum aparelho. Suspeita-se que o disjuntor do painel elétrico da sala tenha disparado.',
    urgencyDefault: 'normal'
  },
  {
    id: 'p7',
    category: 'computer',
    title: 'Teclado ou rato inoperante no PC nº 12',
    description: 'O rato do computador nº 12 dos alunos (ao fundo da sala) está com a luz ótica apagada e o computador não o reconhece, mesmo trocando de porta USB.',
    urgencyDefault: 'normal'
  },
  {
    id: 'p8',
    category: 'other',
    title: 'Cabo HDMI em falta ou danificado na mesa',
    description: 'O cabo HDMI que liga o portátil pessoal do professor ao sistema da sala não se encontra no local, ou a ficha está visivelmente amolgada impossibilitando a ligação.',
    urgencyDefault: 'high'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-2490',
    title: 'Projetor pisca luz vermelha (Sobreaquecimento)',
    description: 'O projetor do teto liga por breves instantes, mas a ventoinha emite um barulho incomum e desliga-se num minuto exibindo luz vermelha de erro.',
    location: 'Sala A11',
    schoolId: 'esc-camilo',
    category: 'projector',
    urgency: 'high',
    status: 'pending',
    reportedBy: 'antonio.sousa@ecarnaxide.pt',
    reporterName: 'Prof. António Sousa',
    reportedRole: 'teacher',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    updatedAt: null,
    assignedTo: null,
    technicalNotes: null
  },
  {
    id: 'TKT-2485',
    title: 'Falta de ligação Wi-Fi no canto direito',
    description: 'Estudantes que se sentam nas últimas filas (perto das janelas) não conseguem aceder à rede Wi-Fi institucional de forma estável. A ligação cai constantemente.',
    location: 'Biblioteca Escolar',
    schoolId: 'esc-vieira',
    category: 'network',
    urgency: 'normal',
    status: 'in_progress',
    reportedBy: 'beatriz.silva@aluno.ecarnaxide.pt',
    reporterName: 'Beatriz Silva (11ºA)',
    reportedRole: 'student',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    assignedTo: 'Carlos Mendes (Suporte)',
    technicalNotes: 'Efetuada análise no local. O ponto de acesso (AP-04) está funcional mas com forte atenuação. Estamos a planear reposicionar o repetidor ou testar com outro canal.'
  },
  {
    id: 'TKT-2480',
    title: 'Tomadas do balcão de química sem corrente',
    description: 'Estávamos a preparar uma experiência com marqueses elétricas e verificámos que a corrente não chega aos postos frontais de testes práticas.',
    location: 'Laboratório de Química',
    schoolId: 'esc-sylvia',
    category: 'infrastructure',
    urgency: 'high',
    status: 'in_progress',
    reportedBy: 'mario.rocha@ecarnaxide.pt',
    reporterName: 'Prof. Mário Rocha',
    reportedRole: 'teacher',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    assignedTo: 'Sofia Santos (Manutenção)',
    technicalNotes: 'Não se trata de avaria mecânica. O botão de paragem de emergência (corte global) estava pressionado a fundo. Desbloqueou-se mas vamos rever o disjuntor do quadro parcial porque saltou duas vezes depois.'
  },
  {
    id: 'TKT-2475',
    title: 'Substituição recomendada de Teclado PC nº 5',
    description: 'As teclas "E", "O" e a barra de espaço estão encravadas ou não funcionam no terminal nº 5 dos computadores dos alunos de informática.',
    location: 'Sala A10 (Informática)',
    schoolId: 'esc-camilo',
    category: 'computer',
    urgency: 'normal',
    status: 'resolved',
    reportedBy: 'rui.costa@aluno.ecarnaxide.pt',
    reporterName: 'Rui Costa (12ºB)',
    reportedRole: 'student',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 44).toISOString(),
    assignedTo: 'Carlos Mendes (Suporte)',
    technicalNotes: 'Teclado antigo de membrana substituído por um teclado USB de substituição novo do stock geral. Testado com sucesso no Windows.'
  }
];
