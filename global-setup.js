const TestHelper = require('./utils/testHelper');

async function globalSetup() {
  console.log('🚀 Iniciando configuração global dos testes...');
  
  // Limpa evidências antigas (manter apenas os últimos 7 dias)
  await TestHelper.limparEvidenciasAntigas(7);
  
  console.log('✅ Configuração global concluída');
}

module.exports = globalSetup;