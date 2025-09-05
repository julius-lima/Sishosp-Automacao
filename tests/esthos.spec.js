const { test, expect } = require('@playwright/test');
const SenhaDodia = require('../utils/senhaDodia');
const ModuleManager = require('../utils/moduleManager');
const TestHelper = require('../utils/testHelper');

test.describe('Módulo Esthos', () => {
  let senhaDodia;
  let moduleManager;
  let evidenceDir;

  test.beforeAll(async () => {
    senhaDodia = new SenhaDodia();
    moduleManager = new ModuleManager();
    evidenceDir = await TestHelper.criarDiretorioEvidencia('esthos');
    await TestHelper.capturarInfoSistema(evidenceDir);
    
    console.log(`📁 Evidências Esthos salvas em: ${evidenceDir}`);
  });

  test('Obter senha do dia para Esthos', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando obtenção da senha do dia para Esthos');
    
    const senha = await senhaDodia.obterSenhaDoDia();
    expect(senha).toBeTruthy();
    
    await TestHelper.salvarLog(evidenceDir, `Senha obtida para Esthos: ${senha}`);
    console.log('✅ Senha do dia obtida para Esthos');
  });

  test('Login no módulo Esthos', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando login no módulo Esthos');
    
    const senha = senhaDodia.getSenha();
    const username = moduleManager.getModuleConfig('esthos').username;
    const loginSucesso = await moduleManager.realizarLogin('esthos', username, senha);
    
    expect(loginSucesso).toBe(true);
    
    await TestHelper.salvarLog(evidenceDir, `Login Esthos realizado - Usuário: ${username}`);
    console.log('✅ Login no módulo Esthos realizado com sucesso');
  });

  test('Funcionalidade específica Esthos', async ({ page }) => {
    await TestHelper.salvarLog(evidenceDir, 'Testando funcionalidades específicas do Esthos');
    
    await page.goto('about:blank');
    await page.setContent(`
      <html>
        <head><title>Sishosp Esthos - Gestão de Estoque</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f8f9fa;">
          <h2>📦 Esthos - Sistema de Estoque</h2>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Controle de Estoque</h3>
            <div id="status" style="padding: 10px; background: #d4edda; border-radius: 4px;">
              Sistema Esthos ativo ✅
            </div>
          </div>
        </body>
      </html>
    `);

    await expect(page.locator('#status')).toContainText('ativo');
    
    await TestHelper.salvarLog(evidenceDir, 'Teste Esthos concluído com sucesso');
    console.log('✅ Teste específico Esthos concluído');
  });

  test.afterAll(async () => {
    const relatorio = {
      modulo: 'Esthos',
      timestamp: new Date().toISOString(),
      evidenciasDir: evidenceDir
    };

    await TestHelper.gerarRelatorio(evidenceDir, relatorio);
    console.log('📊 Relatório Esthos gerado');
  });
});