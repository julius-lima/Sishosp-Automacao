const fs = require('fs-extra');
const path = require('path');

class TestHelper {
  /**
   * Cria um diretório para armazenar evidências de teste
   * @param {string} testName Nome do teste
   * @returns {string} Caminho do diretório criado
   */
  static async criarDiretorioEvidencia(testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dirName = `${testName}_${timestamp}`;
    const evidenceDir = path.join(process.cwd(), 'test-results', dirName);
    
    await fs.ensureDir(evidenceDir);
    return evidenceDir;
  }

  /**
   * Salva um log de teste
   * @param {string} evidenceDir Diretório de evidências
   * @param {string} message Mensagem do log
   */
  static async salvarLog(evidenceDir, message) {
    const logPath = path.join(evidenceDir, 'test.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    await fs.appendFile(logPath, logEntry);
  }

  /**
   * Captura informações do sistema
   * @param {string} evidenceDir Diretório de evidências
   */
  static async capturarInfoSistema(evidenceDir) {
    const systemInfo = {
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version,
      architecture: process.arch,
      cwd: process.cwd()
    };

    const infoPath = path.join(evidenceDir, 'system-info.json');
    await fs.writeJson(infoPath, systemInfo, { spaces: 2 });
  }

  /**
   * Gera um relatório de teste
   * @param {string} evidenceDir Diretório de evidências
   * @param {Object} testResult Resultado do teste
   */
  static async gerarRelatorio(evidenceDir, testResult) {
    const reportPath = path.join(evidenceDir, 'test-report.json');
    await fs.writeJson(reportPath, testResult, { spaces: 2 });
  }

  /**
   * Aguarda um tempo específico
   * @param {number} ms Milissegundos para aguardar
   */
  static async aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gera um nome único para screenshot
   * @param {string} prefix Prefixo do nome
   * @returns {string} Nome único
   */
  static gerarNomeScreenshot(prefix = 'screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}_${timestamp}.png`;
  }

  /**
   * Valida se um arquivo existe
   * @param {string} filePath Caminho do arquivo
   * @returns {boolean} True se o arquivo existe
   */
  static async arquivoExiste(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Limpa diretórios antigos de teste
   * @param {number} diasParaManter Número de dias para manter os arquivos
   */
  static async limparEvidenciasAntigas(diasParaManter = 7) {
    const testResultsDir = path.join(process.cwd(), 'test-results');
    
    if (!await this.arquivoExiste(testResultsDir)) {
      return;
    }

    const agora = Date.now();
    const millissegundosPorDia = 24 * 60 * 60 * 1000;
    const limiteTempo = agora - (diasParaManter * millissegundosPorDia);

    const items = await fs.readdir(testResultsDir);
    
    for (const item of items) {
      const itemPath = path.join(testResultsDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory() && stats.mtime.getTime() < limiteTempo) {
        await fs.remove(itemPath);
        console.log(`Removido diretório antigo: ${item}`);
      }
    }
  }
}

module.exports = TestHelper;