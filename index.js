#!/usr/bin/env node

const SenhaDodia = require('./utils/senhaDodia');
const ModuleManager = require('./utils/moduleManager');
const TestHelper = require('./utils/testHelper');

async function main() {
  console.log('🏥 Sishosp Automation - Sistema de Testes');
  console.log('==========================================\n');

  try {
    // Inicializa os utilitários
    const senhaDodia = new SenhaDodia();
    const moduleManager = new ModuleManager();

    console.log('📋 Informações do Sistema:');
    console.log(`- Plataforma: ${process.platform}`);
    console.log(`- Node.js: ${process.version}`);
    console.log(`- Diretório: ${process.cwd()}\n`);

    // Lista módulos disponíveis
    const modules = moduleManager.getModules();
    console.log('🏥 Módulos Disponíveis:');
    modules.forEach(module => {
      const config = moduleManager.getModuleConfig(module);
      console.log(`  ✓ ${module.charAt(0).toUpperCase() + module.slice(1)}: ${config.appPath}`);
    });

    console.log('\n🔐 Testando obtenção da senha do dia...');
    const senha = await senhaDodia.obterSenhaDoDia();
    console.log(`   Senha obtida: ${senha}`);

    console.log('\n📊 Dados de teste carregados:');
    const testData = moduleManager.getTestData();
    console.log(`   Paciente: ${testData.paciente.nome}`);
    console.log(`   CPF: ${testData.paciente.cpf}`);

    console.log('\n✅ Verificação da estrutura do projeto concluída com sucesso!');
    console.log('\nPara executar os testes automatizados:');
    console.log('  npm test              # Todos os testes');
    console.log('  npm run test:recep    # Apenas Recepção');
    console.log('  npm run test:medview  # Apenas Medview');
    console.log('  npm run test:headed   # Com interface gráfica');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
    process.exit(1);
  }
}

// Executa apenas se for chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main };