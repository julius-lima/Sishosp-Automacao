# Automação de Login no Sistema Sishosp

Este projeto utiliza automação para realizar o login no sistema Sishosp, dividindo o fluxo em dois passos principais:

1. **Obter a senha do dia**: Através do aplicativo `SenhaDoDia.exe`.
2. **Acessar o módulo Recep**: Utilizando a senha obtida no passo anterior.

## Arquivos

- `obter_senha.py`: Script responsável por abrir o aplicativo `SenhaDoDia.exe` e copiar a senha para o clipboard.
- `acessar_recep.py`: Script que realiza o login no módulo Recep utilizando a senha obtida.

## Como Executar

### Pré-requisitos

1. Python 3.8+
2. Bibliotecas necessárias:
   ```bash
   pip install pyperclip pyautogui
   ```
3. Caminhos corretos configurados para os executáveis:
   - `SenhaDoDia.exe` localizado em `C:/WPD/SenhaDoDia.exe`
   - `Recep.exe` localizado em `C:/WPD/Recep.exe`

### Passo a Passo

1. Execute o script `obter_senha.py` para obter a senha do dia:
   ```bash
   python obter_senha.py
   ```
   Anote ou confirme que a senha foi copiada para o clipboard.

2. Execute o script `acessar_recep.py` para acessar o módulo Recep:
   ```bash
   python acessar_recep.py
   ```

## Observações

- Certifique-se de que os aplicativos `SenhaDoDia.exe` e `Recep.exe` estão operacionais nos caminhos especificados.
- Ajuste os scripts conforme necessário para adequar aos campos e comportamentos específicos do seu ambiente.

## Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias neste repositório.