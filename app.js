/**
 * Smart Assist Landing Page - Logic & Interactions
 * Vanilla JavaScript (Safe DOM manipulation conforming to secure web standards)
 */

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppSimulator();
  initLossCalculator();
  initFaqAccordion();
});

/* ==========================================================================
   1. Interactive WhatsApp Simulator
   ========================================================================== */
function initWhatsAppSimulator() {
  const container = document.getElementById('chat-messages-container');
  const scenarioButtons = document.querySelectorAll('.btn-scenario');
  const userInput = document.getElementById('sim-user-input');

  if (!container || !scenarioButtons.length) return;

  const scenarios = {
    geladeira: [
      { sender: 'user', text: 'Olá! Minha geladeira Electrolux parou de gelar na parte de baixo, vocês atendem hoje?' },
      { sender: 'iara', text: 'Olá! Sim, atendemos refrigeradores Electrolux com técnicos especializados no seu modelo.' },
      { sender: 'iara', text: 'Para verificar se estamos no seu bairro com rota ativa, qual o seu CEP ou endereço?' },
      { sender: 'user', text: 'Meu CEP é 49025-100, Bairro Jardins.' },
      { sender: 'iara', text: 'Perfeito! Atendemos o seu bairro diariamente. Nossa taxa de visita com diagnóstico no local é de R$ 60,00 (abatida do valor caso o serviço seja aprovado).' },
      { sender: 'iara', text: 'Podemos agendar a visita para amanhã entre 08h e 12h?' },
      { sender: 'user', text: 'Sim, pode agendar por favor!' },
      { sender: 'iara', text: 'Agendamento confirmado! ✅ Criamos a Ordem de Serviço #1042. O técnico responsável já recebeu seu endereço e modelo no painel.' }
    ],
    maquina: [
      { sender: 'user', text: 'Bom dia, minha máquina de lavar Brastemp 12kg tá fazendo um barulho muito alto na centrifugação.' },
      { sender: 'iara', text: 'Bom dia! Esse barulho geralmente indica desgaste no conjunto de rolamentos ou transmissão.' },
      { sender: 'iara', text: 'Nossos técnicos possuem essas peças a pronta entrega. Em qual cidade e bairro você está?' },
      { sender: 'user', text: 'Estou no Centro, próximo à praça principal.' },
      { sender: 'iara', text: 'Excelente! Temos um técnico finalizando um chamado no Centro agora. Você prefere atendimento ainda hoje no período da tarde?' },
      { sender: 'user', text: 'Sim, seria ótimo hoje à tarde!' },
      { sender: 'iara', text: 'Pronto! OS #1043 aberta com sucesso 🛠️. Você receberá um aviso no WhatsApp 30 minutos antes do técnico chegar.' }
    ],
    nps: [
      { sender: 'iara', text: 'Olá Maria! O técnico concluiu o reparo da sua Lava e Seca. Segue seu Recibo e Termo de Garantia: 📄 smartassist.app/os/8821' },
      { sender: 'iara', text: 'De 0 a 10, qual nota você dá para a rapidez e a qualidade do nosso atendimento hoje?' },
      { sender: 'user', text: 'Nota 10! Ficou silenciosa como nova e o técnico foi super pontual.' },
      { sender: 'iara', text: 'Ficamos muito felizes em resolver o seu problema! ⭐ Você poderia compartilhar essa nota 10 no nosso Google Meu Negócio? Ajuda muito nossa assistência:' },
      { sender: 'iara', text: '👉 Clique aqui para avaliar no Google (leva 15 segundos): g.page/sua-assistencia/review' },
      { sender: 'user', text: 'Com certeza, já deixei 5 estrelas lá!' },
      { sender: 'iara', text: 'Muito obrigado pela preferência e conte sempre conosco! 🙏' }
    ]
  };

  let activeTimeouts = [];

  function clearAllTimeouts() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
  }

  function renderScenario(scenarioKey) {
    clearAllTimeouts();
    container.replaceChildren(); // Safe DOM clear

    const script = scenarios[scenarioKey];
    if (!script) return;

    let delay = 300;

    script.forEach((msg, idx) => {
      const timeout = setTimeout(() => {
        appendMessage(msg.sender, msg.text);
      }, delay);
      activeTimeouts.push(timeout);
      delay += (msg.sender === 'user' ? 1200 : 1800);
    });
  }

  function appendMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `msg-bubble ${sender === 'user' ? 'msg-user' : 'msg-iara'}`;

    const textNode = document.createElement('p');
    textNode.textContent = text;
    bubble.appendChild(textNode);

    const timeSpan = document.createElement('span');
    timeSpan.className = 'msg-time';
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeSpan.textContent = `${hours}:${minutes}`;
    bubble.appendChild(timeSpan);

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  scenarioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scenario = btn.dataset.scenario;
      if (userInput) {
        userInput.value = `Testando cenário: ${btn.querySelector('strong')?.textContent || ''}`;
      }
      renderScenario(scenario);
    });
  });

  // Start with default scenario
  renderScenario('geladeira');
}

/* ==========================================================================
   2. Loss Calculator
   ========================================================================== */
function initLossCalculator() {
  const rangeLeads = document.getElementById('range-leads');
  const rangeTicket = document.getElementById('range-ticket');
  const rangeLossRate = document.getElementById('range-loss-rate');

  const valLeads = document.getElementById('val-leads');
  const valTicket = document.getElementById('val-ticket');
  const valLossRate = document.getElementById('val-loss-rate');
  const resultLost = document.getElementById('result-lost-monthly');

  if (!rangeLeads || !rangeTicket || !rangeLossRate || !resultLost) return;

  function updateCalculation() {
    const leads = parseInt(rangeLeads.value, 10) || 60;
    const ticket = parseInt(rangeTicket.value, 10) || 380;
    const lossRate = parseInt(rangeLossRate.value, 10) || 25;

    // Safe text updates
    valLeads.textContent = `${leads} clientes`;
    valTicket.textContent = formatCurrency(ticket);
    valLossRate.textContent = `${lossRate}% (média do setor)`;

    const lostCustomers = leads * (lossRate / 100);
    const lostMoney = lostCustomers * ticket;

    resultLost.textContent = formatCurrency(lostMoney);
  }

  function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2
    }).format(val);
  }

  rangeLeads.addEventListener('input', updateCalculation);
  rangeTicket.addEventListener('input', updateCalculation);
  rangeLossRate.addEventListener('input', updateCalculation);

  updateCalculation();
}

/* ==========================================================================
   3. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });
}
