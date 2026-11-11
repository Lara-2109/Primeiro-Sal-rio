// Variáveis globais
let salarioLiquidoCalculado = 0;
let historicoSalario = JSON.parse(localStorage.getItem('historicoSalario')) || [];
let metasSalvas = JSON.parse(localStorage.getItem('metasSalvas')) || [];
let orcamentoChart = null;

// Sistema de Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Função para alternar entre abas
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(`tab-${tabName}`);
    selectedTab.classList.remove('hidden');
    selectedTab.classList.add('active');
    
    const selectedBtn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
    selectedBtn.classList.add('active');
    
    if (tabName === 'orcamento' && salarioLiquidoCalculado > 0) {
        document.getElementById('valor-disponivel').value = salarioLiquidoCalculado.toFixed(2);
    }
    
    if (tabName === 'metas') {
        renderizarMetas();
    }
    
    if (tabName === 'salario') {
        renderizarHistoricoSalario();
    }
}

// Função para formatar moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para normalizar número (aceita vírgula ou ponto)
function normalizarNumero(valor) {
    if (typeof valor === 'string') {
        return parseFloat(valor.replace(',', '.'));
    }
    return valor;
}

// Função para validar input numérico
function validarNumero(valor, nomeCampo) {
    if (valor === '' || valor === null || valor === undefined) {
        showToast(`Por favor, preencha o campo: ${nomeCampo}`, 'error');
        return false;
    }
    const valorNormalizado = normalizarNumero(valor);
    if (isNaN(valorNormalizado)) {
        showToast(`O campo ${nomeCampo} deve ser um número válido`, 'error');
        return false;
    }
    if (valorNormalizado < 0) {
        showToast(`O campo ${nomeCampo} não pode ser negativo`, 'error');
        return false;
    }
    if (valorNormalizado === 0) {
        showToast(`O campo ${nomeCampo} não pode ser zero`, 'error');
        return false;
    }
    return true;
}

// Função 1: Calcular Salário Líquido
function calcularSalario() {
    const salarioBruto = document.getElementById('salario-bruto').value;
    
    if (!validarNumero(salarioBruto, 'Salário Bruto')) {
        return;
    }
    
    const bruto = normalizarNumero(salarioBruto);
    const descontoINSS = document.getElementById('desconto-inss').checked ? (bruto * 0.08) : 0;
    const descontoVT = document.getElementById('desconto-vt').checked ? (bruto * 0.06) : 0;
    const descontoFGTS = document.getElementById('desconto-fgts').checked ? (bruto * 0.08) : 0;
    const outrosDescontos = normalizarNumero(document.getElementById('outros-descontos').value) || 0;
    const beneficios = normalizarNumero(document.getElementById('beneficios').value) || 0;
    
    const totalDescontos = descontoINSS + descontoVT + outrosDescontos;
    const liquido = bruto - totalDescontos + beneficios;
    
    salarioLiquidoCalculado = liquido;
    
    document.getElementById('valor-bruto').textContent = formatarMoeda(bruto);
    document.getElementById('valor-inss').textContent = formatarMoeda(descontoINSS);
    document.getElementById('valor-vt').textContent = formatarMoeda(descontoVT);
    document.getElementById('valor-outros').textContent = formatarMoeda(outrosDescontos);
    document.getElementById('valor-beneficios').textContent = formatarMoeda(beneficios);
    document.getElementById('valor-descontos').textContent = formatarMoeda(totalDescontos);
    document.getElementById('valor-liquido').textContent = formatarMoeda(liquido);
    
    document.getElementById('resultado-salario').classList.remove('hidden');
    showToast('Salário calculado com sucesso!', 'success');
}

// Salvar cálculo de salário no histórico
function salvarCalculoSalario() {
    const bruto = document.getElementById('valor-bruto').textContent;
    const liquido = document.getElementById('valor-liquido').textContent;
    
    const calculo = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        bruto: bruto,
        liquido: liquido
    };
    
    historicoSalario.unshift(calculo);
    if (historicoSalario.length > 10) {
        historicoSalario.pop();
    }
    
    localStorage.setItem('historicoSalario', JSON.stringify(historicoSalario));
    renderizarHistoricoSalario();
    showToast('Cálculo salvo no histórico!', 'success');
}

// Renderizar histórico de salário
function renderizarHistoricoSalario() {
    const container = document.getElementById('historico-salario');
    
    if (historicoSalario.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm text-center">Nenhum cálculo salvo</p>';
        return;
    }
    
    container.innerHTML = historicoSalario.map(item => `
        <div class="historico-item flex justify-between items-center">
            <div>
                <p class="text-white text-sm font-medium">${item.data}</p>
                <p class="text-gray-400 text-xs">Bruto: ${item.bruto}</p>
            </div>
            <div class="text-right">
                <p class="text-[#10B981] font-bold text-sm">${item.liquido}</p>
                <span class="delete-btn text-red-400 cursor-pointer text-xs" onclick="deletarHistorico(${item.id})">✕</span>
            </div>
        </div>
    `).join('');
}

// Deletar item do histórico
function deletarHistorico(id) {
    historicoSalario = historicoSalario.filter(item => item.id !== id);
    localStorage.setItem('historicoSalario', JSON.stringify(historicoSalario));
    renderizarHistoricoSalario();
    showToast('Item removido do histórico', 'warning');
}

// Limpar histórico de salário
function limparHistoricoSalario() {
    historicoSalario = [];
    localStorage.setItem('historicoSalario', JSON.stringify(historicoSalario));
    renderizarHistoricoSalario();
    showToast('Histórico limpo', 'warning');
}

// Função 2: Gerar Distribuição 50/30/20
function gerarDistribuicao() {
    const valorDisponivel = document.getElementById('valor-disponivel').value;
    
    if (!validarNumero(valorDisponivel, 'Valor Disponível')) {
        return;
    }
    
    const valor = normalizarNumero(valorDisponivel);
    const necessidades = valor * 0.50;
    const desejos = valor * 0.30;
    const reserva = valor * 0.20;
    
    document.getElementById('valor-necessidades').textContent = formatarMoeda(necessidades);
    document.getElementById('valor-desejos').textContent = formatarMoeda(desejos);
    document.getElementById('valor-reserva').textContent = formatarMoeda(reserva);
    
    document.getElementById('resultado-orcamento').classList.remove('hidden');
    
    // Criar gráfico
    criarGraficoOrcamento(necessidades, desejos, reserva);
    
    showToast('Distribuição gerada com sucesso!', 'success');
}

// Criar gráfico de orçamento
function criarGraficoOrcamento(necessidades, desejos, reserva) {
    const ctx = document.getElementById('orcamento-chart').getContext('2d');
    
    if (orcamentoChart) {
        orcamentoChart.destroy();
    }
    
    orcamentoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Necessidades (50%)', 'Desejos (30%)', 'Reserva (20%)'],
            datasets: [{
                data: [necessidades, desejos, reserva],
                backgroundColor: ['#10B981', '#60A5FA', '#A78BFA'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9CA3AF',
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                }
            }
        }
    });
}

// Função 3: Calcular Tempo para Meta
function calcularMeta() {
    const metaNome = document.getElementById('meta-nome').value;
    const metaValor = document.getElementById('meta-valor').value;
    const metaMensal = document.getElementById('meta-mensal').value;
    
    if (!metaNome || metaNome.trim() === '') {
        showToast('Por favor, preencha o nome do objetivo', 'error');
        return;
    }
    
    if (!validarNumero(metaValor, 'Valor total da meta')) {
        return;
    }
    
    if (!validarNumero(metaMensal, 'Valor mensal a guardar')) {
        return;
    }
    
    const valorTotal = normalizarNumero(metaValor);
    const valorMensal = normalizarNumero(metaMensal);
    
    if (valorMensal > valorTotal) {
        showToast('O valor mensal não pode ser maior que o valor total da meta', 'error');
        return;
    }
    
    const mesesNecessarios = Math.ceil(valorTotal / valorMensal);
    const anos = Math.floor(mesesNecessarios / 12);
    const mesesRestantes = mesesNecessarios % 12;
    
    const resultadoTexto = `Para conquistar "${metaNome}", guardando ${formatarMoeda(valorMensal)} por mês:`;
    
    document.getElementById('meta-resultado').textContent = resultadoTexto;
    document.getElementById('meta-meses').textContent = `${mesesNecessarios} ${mesesNecessarios === 1 ? 'mês' : 'meses'}`;
    
    if (anos > 0) {
        document.getElementById('meta-ano').textContent = `(${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'})`;
    } else {
        document.getElementById('meta-ano').textContent = '';
    }
    
    document.getElementById('resultado-meta').classList.remove('hidden');
    showToast('Tempo calculado com sucesso!', 'success');
}

// Adicionar meta à lista
function adicionarMeta() {
    const metaNome = document.getElementById('meta-nome').value;
    const metaValor = document.getElementById('meta-valor').value;
    const metaMensal = document.getElementById('meta-mensal').value;
    
    if (!metaNome || metaNome.trim() === '') {
        showToast('Por favor, preencha o nome do objetivo', 'error');
        return;
    }
    
    if (!validarNumero(metaValor, 'Valor total da meta')) {
        return;
    }
    
    if (!validarNumero(metaMensal, 'Valor mensal a guardar')) {
        return;
    }
    
    const valorTotal = normalizarNumero(metaValor);
    const valorMensal = normalizarNumero(metaMensal);
    const mesesNecessarios = Math.ceil(valorTotal / valorMensal);
    
    const meta = {
        id: Date.now(),
        nome: metaNome,
        valor: valorTotal,
        mensal: valorMensal,
        meses: mesesNecessarios
    };
    
    metasSalvas.push(meta);
    localStorage.setItem('metasSalvas', JSON.stringify(metasSalvas));
    renderizarMetas();
    showToast('Meta adicionada à lista!', 'success');
    
    // Limpar campos
    document.getElementById('meta-nome').value = '';
    document.getElementById('meta-valor').value = '';
    document.getElementById('meta-mensal').value = '';
    document.getElementById('resultado-meta').classList.add('hidden');
}

// Renderizar lista de metas
function renderizarMetas() {
    const container = document.getElementById('lista-metas');
    
    if (metasSalvas.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm text-center">Nenhuma meta salva</p>';
        return;
    }
    
    container.innerHTML = metasSalvas.map(item => `
        <div class="meta-item">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-white font-medium">${item.nome}</p>
                    <p class="text-gray-400 text-xs">Meta: ${formatarMoeda(item.valor)} | Guardar: ${formatarMoeda(item.mensal)}/mês</p>
                    <p class="text-[#10B981] text-sm font-semibold mt-1">${item.meses} ${item.meses === 1 ? 'mês' : 'meses'}</p>
                </div>
                <span class="delete-btn" onclick="deletarMeta(${item.id})">✕</span>
            </div>
        </div>
    `).join('');
}

// Deletar meta
function deletarMeta(id) {
    metasSalvas = metasSalvas.filter(item => item.id !== id);
    localStorage.setItem('metasSalvas', JSON.stringify(metasSalvas));
    renderizarMetas();
    showToast('Meta removida', 'warning');
}

// Limpar todas as metas
function limparMetas() {
    metasSalvas = [];
    localStorage.setItem('metasSalvas', JSON.stringify(metasSalvas));
    renderizarMetas();
    showToast('Todas as metas foram removidas', 'warning');
}

// Função 4: Calcular Quiz de Perfil Financeiro
function calcularQuiz() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    const q4 = document.querySelector('input[name="q4"]:checked');
    const q5 = document.querySelector('input[name="q5"]:checked');
    const q6 = document.querySelector('input[name="q6"]:checked');
    
    if (!q1 || !q2 || !q3 || !q4 || !q5 || !q6) {
        showToast('Por favor, responda todas as perguntas do quiz', 'error');
        return;
    }
    
    let pontuacao = 0;
    pontuacao += q1.value === 'a' ? 1 : q1.value === 'b' ? 2 : 3;
    pontuacao += q2.value === 'a' ? 1 : q2.value === 'b' ? 2 : 3;
    pontuacao += q3.value === 'a' ? 1 : q3.value === 'b' ? 2 : 3;
    pontuacao += q4.value === 'a' ? 1 : q4.value === 'b' ? 2 : 3;
    pontuacao += q5.value === 'a' ? 1 : q5.value === 'b' ? 2 : 3;
    pontuacao += q6.value === 'a' ? 1 : q6.value === 'b' ? 2 : 3;
    
    let perfil, emoji, dica;
    
    // Pontuação máxima = 18 (6 perguntas x 3 pontos)
    // Gastador: 6-9 pontos
    // Equilibrado: 10-14 pontos
    // Poupador: 15-18 pontos
    if (pontuacao <= 9) {
        perfil = 'Gastador';
        emoji = '💸';
        dica = 'Tente separar 10% do seu salário assim que receber. Use a regra 24h: espere um dia antes de compras por impulso. Comece a fazer um planejamento mensal de gastos. Pequenas mudanças fazem grande diferença!';
    } else if (pontuacao <= 14) {
        perfil = 'Equilibrado';
        emoji = '⚖️';
        dica = 'Você está no caminho certo! Para evoluir, aumente sua reserva de emergência para 6 meses de despesas. Considere investir parte da sua poupança para fazer o dinheiro trabalhar para você. Mantenha o planejamento mensal!';
    } else {
        perfil = 'Poupador';
        emoji = '🐷';
        dica = 'Parabéns pelo controle financeiro! Agora é hora de diversificar: estude sobre investimentos (CDB, Tesouro Direto, Fundos Imobiliários). Lembre-se que dinheiro parado perde valor com a inflação. Considere metas de longo prazo!';
    }
    
    document.getElementById('quiz-emoji').textContent = emoji;
    document.getElementById('quiz-perfil').textContent = perfil;
    document.getElementById('quiz-dica').textContent = dica;
    
    document.getElementById('resultado-quiz').classList.remove('hidden');
    showToast('Perfil identificado!', 'success');
}

// Refazer quiz
function refazerQuiz() {
    document.querySelectorAll('input[name="q1"], input[name="q2"], input[name="q3"], input[name="q4"], input[name="q5"], input[name="q6"]').forEach(input => {
        input.checked = false;
    });
    document.getElementById('resultado-quiz').classList.add('hidden');
    showToast('Quiz reiniciado', 'warning');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    switchTab('salario');
    renderizarHistoricoSalario();
    renderizarMetas();
});
