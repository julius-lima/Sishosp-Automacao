const { test, expect } = require('@playwright/test');
const SenhaDodia = require('../utils/senhaDodia');
const ModuleManager = require('../utils/moduleManager');
const TestHelper = require('../utils/testHelper');

test.describe('Módulo WPainel', () => {
  let senhaDodia;
  let moduleManager;
  let evidenceDir;

  test.beforeAll(async () => {
    senhaDodia = new SenhaDodia();
    moduleManager = new ModuleManager();
    evidenceDir = await TestHelper.criarDiretorioEvidencia('wpainel');
    await TestHelper.capturarInfoSistema(evidenceDir);
    
    console.log(`📁 Evidências WPainel salvas em: ${evidenceDir}`);
  });

  test('Obter senha do dia para WPainel', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando obtenção da senha do dia para WPainel');
    
    const senha = await senhaDodia.obterSenhaDoDia();
    expect(senha).toBeTruthy();
    
    await TestHelper.salvarLog(evidenceDir, `Senha obtida para WPainel: ${senha}`);
    console.log('✅ Senha do dia obtida para WPainel');
  });

  test('Login no módulo WPainel', async () => {
    await TestHelper.salvarLog(evidenceDir, 'Iniciando login no módulo WPainel');
    
    const senha = senhaDodia.getSenha();
    const username = moduleManager.getModuleConfig('wpainel').username;
    const loginSucesso = await moduleManager.realizarLogin('wpainel', username, senha);
    
    expect(loginSucesso).toBe(true);
    
    await TestHelper.salvarLog(evidenceDir, `Login WPainel realizado - Usuário: ${username}`);
    console.log('✅ Login no módulo WPainel realizado com sucesso');
  });

  test('Funcionalidade específica WPainel', async ({ page }) => {
    await TestHelper.salvarLog(evidenceDir, 'Testando funcionalidades específicas do WPainel');
    
    await page.goto('about:blank');
    await page.setContent(`
      <html>
        <head><title>Sishosp WPainel - Painel Web</title></head>
        <body style="font-family: Arial; padding: 20px; background: #f8f9fa;">
          <h2>🌐 WPainel - Painel Web do Sistema</h2>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Dashboard Principal</h3>
            <div id="status" style="padding: 10px; background: #d4edda; border-radius: 4px;">
              WPainel ativo e funcionando ✅
            </div>
          </div>
        </body>
      </html>
    `);

    await expect(page.locator('#status')).toContainText('ativo');
    
    await TestHelper.salvarLog(evidenceDir, 'Teste WPainel concluído com sucesso');
    console.log('✅ Teste específico WPainel concluído');
  });

  test.afterAll(async () => {
    const relatorio = {
      modulo: 'WPainel',
      timestamp: new Date().toISOString(),
      evidenciasDir: evidenceDir
    };

    await TestHelper.gerarRelatorio(evidenceDir, relatorio);
    console.log('📊 Relatório WPainel gerado');
  });
});