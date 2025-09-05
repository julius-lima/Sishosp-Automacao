const { spawn, exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

class SenhaDodia {
  constructor() {
    this.config = require('../resources/config.json');
    this.senha = null;
  }

  /**
   * Obtém a senha do dia através do aplicativo SenhaDoDia.exe
   * @returns {Promise<string>} A senha do dia
   */
  async obterSenhaDoDia() {
    return new Promise((resolve, reject) => {
      const appPath = this.config.senhaDodia.appPath;
      
      console.log(`Abrindo aplicativo SenhaDoDia em: ${appPath}`);
      
      // Simula a abertura do aplicativo e obtenção da senha
      // Em um cenário real, seria necessário usar automação de desktop
      const processo = spawn(appPath, [], {
        detached: true,
        stdio: 'ignore'
      });

      processo.on('spawn', () => {
        console.log('Aplicativo SenhaDoDia iniciado');
        
        // Simula aguardar o carregamento e copiar a senha
        setTimeout(() => {
          // Em um cenário real, aqui seria implementada a lógica
          // para ler a senha da tela ou clipboard
          this.senha = this.gerarSenhaSimulada();
          console.log(`Senha obtida: ${this.senha}`);
          resolve(this.senha);
        }, this.config.senhaDodia.timeout);
      });

      processo.on('error', (error) => {
        console.error(`Erro ao abrir SenhaDoDia: ${error.message}`);
        reject(error);
      });

      // Mata o processo após obter a senha
      setTimeout(() => {
        if (!processo.killed) {
          processo.kill();
        }
      }, this.config.senhaDodia.timeout + 2000);
    });
  }

  /**
   * Gera uma senha simulada para testes
   * @returns {string} Senha simulada
   */
  gerarSenhaSimulada() {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear().toString().slice(-2);
    
    return `${dia}${mes}${ano}`;
  }

  /**
   * Retorna a senha atual
   * @returns {string} A senha atual
   */
  getSenha() {
    return this.senha;
  }

  /**
   * Valida se a senha foi obtida
   * @returns {boolean} True se a senha foi obtida
   */
  temSenha() {
    return this.senha !== null && this.senha !== undefined;
  }
}

module.exports = SenhaDodia;