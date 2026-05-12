# THE Ideias - Site Estático (HTML/CSS/JS)

## Estrutura de Pastas

```
theideias-site-final/
├── index.html                          ← Página principal (Home)
├── historia.html                       ← Página de História
├── cases/
│   ├── palmolive-kids.html
│   ├── nivea-psg.html
│   ├── credeal.html
│   ├── sbp.html
│   └── hersheys.html
├── servicos/
│   ├── branding.html
│   ├── embalagem.html
│   ├── pdv.html
│   ├── promocao.html
│   ├── digital.html
│   ├── ia-criativa.html
│   ├── video-production.html
│   └── personagens-mascotes.html
├── branding/
│   ├── credeal.html
│   ├── sala-sao-paulo.html
│   ├── colgate-palmolive.html
│   ├── nutrella.html
│   ├── hersheys-special-dark.html
│   └── toyota.html
├── assets/
│   ├── index-*.css                     ← Estilos compilados
│   └── index-*.js                      ← JavaScript compilado
├── js/
│   └── cms.js                          ← Painel administrativo
├── images/                             ← Pasta para imagens locais
├── .htaccess                           ← Configuração Apache
├── robots.txt
├── sitemap.xml
└── README.md
```

## Como Testar Localmente

### Com Python:
```bash
cd theideias-site-final
python -m http.server 8080
# Abra http://localhost:8080
```

### Com VS Code:
1. Instale a extensão "Live Server"
2. Clique com botão direito no index.html → "Open with Live Server"

## Painel Administrativo (CMS)

1. Abra qualquer página no navegador
2. Pressione **Ctrl + Shift + E**
3. Digite a senha: **senha**
4. Edite textos clicando neles
5. Troque imagens pelo botão "Trocar Imagens"

## Como Editar

### Textos e Imagens (via CMS):
- Ative o modo edição (Ctrl+Shift+E)
- Clique nos textos para editar
- Use "Trocar Imagens" para substituir fotos

### Cores e Fontes (via CSS):
- Edite o arquivo `assets/index-*.css`
- Ou adicione um arquivo `css/custom.css` com suas personalizações

## Hospedagem

O site funciona em qualquer servidor web (Apache, Nginx, etc.).
Basta fazer upload de toda a pasta para o servidor.

### Apache (hospedagem compartilhada)
O arquivo `.htaccess` já está incluído na pasta.

### Nginx
```
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

### Netlify / Vercel
Basta fazer upload da pasta. A navegação funciona automaticamente.

**Importante:** NÃO use `npx serve` pois ele interfere com a navegação entre páginas. Use Python http.server ou Live Server do VS Code.
