/* ============================================================
   THE IDEIAS — CMS (Painel Administrativo)
   
   COMO USAR:
   1. Abra qualquer pagina do site no navegador
   2. Pressione Ctrl+Shift+E para ativar o modo de edicao
   3. Clique em qualquer texto com borda tracejada para editar
   4. As alteracoes sao salvas no navegador (localStorage)
   5. Para resetar, clique em "Resetar" na barra admin
   
   SENHA PADRAO: theideias2026
   (Altere na variavel CMS_PASS abaixo)
   ============================================================ */

(function() {
  'use strict';

  var CMS_KEY = 'theideias_cms_data';
  var CMS_PASS = 'theideias2026';
  var isActive = false;

  function loadData() {
    try {
      var data = localStorage.getItem(CMS_KEY);
      return data ? JSON.parse(data) : {};
    } catch(e) { return {}; }
  }

  function saveData(data) {
    localStorage.setItem(CMS_KEY, JSON.stringify(data));
  }

  function applySavedContent() {
    var data = loadData();
    document.querySelectorAll('.cms-editable').forEach(function(el) {
      var key = el.getAttribute('data-key');
      if (key && data[key]) {
        el.innerHTML = data[key];
      }
    });
    if (data._images) {
      document.querySelectorAll('img').forEach(function(img) {
        var src = img.getAttribute('src');
        if (data._images[src]) {
          img.setAttribute('data-original-src', src);
          img.setAttribute('src', data._images[src]);
        }
      });
    }
  }

  function createAdminBar() {
    var bar = document.createElement('div');
    bar.className = 'cms-admin-bar';
    bar.id = 'cms-admin-bar';
    bar.innerHTML = '<div style="display:flex;align-items:center;gap:1rem;">' +
      '<span style="font-size:0.8rem;font-weight:700;">MODO EDICAO</span>' +
      '<span style="font-size:0.7rem;opacity:0.6;">Clique nos textos para editar</span>' +
    '</div>' +
    '<div>' +
      '<button class="secondary" onclick="cmsShowImages()">Trocar Imagens</button>' +
      '<button class="secondary" onclick="cmsExport()">Exportar</button>' +
      '<button class="secondary" onclick="cmsImport()">Importar</button>' +
      '<button class="secondary" onclick="cmsReset()">Resetar</button>' +
      '<button onclick="cmsDeactivate()">Sair</button>' +
    '</div>';
    document.body.appendChild(bar);
  }

  function createModal() {
    var overlay = document.createElement('div');
    overlay.className = 'cms-modal-overlay';
    overlay.id = 'cms-modal-overlay';
    overlay.innerHTML = '<div class="cms-modal" id="cms-modal"></div>';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.classList.remove('visible');
    });
    document.body.appendChild(overlay);
  }

  function showModal(content) {
    var modal = document.getElementById('cms-modal');
    var overlay = document.getElementById('cms-modal-overlay');
    modal.innerHTML = content;
    overlay.classList.add('visible');
  }

  window.hideModal = function() {
    document.getElementById('cms-modal-overlay').classList.remove('visible');
  };

  function handleEditClick(e) {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();
    var el = e.currentTarget;
    var key = el.getAttribute('data-key');
    var currentContent = el.innerHTML;
    showModal(
      '<h3>Editar Conteudo</h3>' +
      '<label>Chave: ' + key + '</label>' +
      '<textarea id="cms-edit-text" style="min-height:150px;">' + currentContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>' +
      '<p style="font-size:0.75rem;color:#999;margin-top:0.5rem;">Voce pode usar HTML: &lt;br&gt; para quebra de linha, &lt;span style="color:red"&gt;texto&lt;/span&gt; para cores.</p>' +
      '<div class="btn-row">' +
        '<button class="secondary" style="background:#E5E5E5;color:#333;" onclick="hideModal()">Cancelar</button>' +
        '<button onclick="cmsSaveEdit(\'' + key + '\')">Salvar</button>' +
      '</div>'
    );
  }

  window.cmsSaveEdit = function(key) {
    var text = document.getElementById('cms-edit-text').value;
    var data = loadData();
    data[key] = text;
    saveData(data);
    document.querySelectorAll('[data-key="' + key + '"]').forEach(function(el) {
      el.innerHTML = text;
    });
    window.hideModal();
    showNotification('Texto salvo!');
  };

  window.cmsActivate = function() {
    var pass = prompt('Senha do painel administrativo:');
    if (pass !== CMS_PASS) {
      alert('Senha incorreta.');
      return;
    }
    isActive = true;
    document.body.classList.add('cms-active');
    document.getElementById('cms-admin-bar').classList.add('visible');
    document.querySelectorAll('.cms-editable').forEach(function(el) {
      el.addEventListener('click', handleEditClick);
    });
  };

  window.cmsDeactivate = function() {
    isActive = false;
    document.body.classList.remove('cms-active');
    document.getElementById('cms-admin-bar').classList.remove('visible');
    document.querySelectorAll('.cms-editable').forEach(function(el) {
      el.removeEventListener('click', handleEditClick);
    });
  };

  window.cmsShowImages = function() {
    var images = document.querySelectorAll('img');
    var html = '<h3>Trocar Imagens</h3>' +
      '<p style="font-size:0.85rem;color:#777;margin-bottom:1.5rem;">Clique em uma imagem para trocar.</p>';
    var count = 0;
    images.forEach(function(img, idx) {
      var src = img.getAttribute('src');
      if (!src || src.length < 5) return;
      var alt = img.getAttribute('alt') || 'Imagem ' + (count + 1);
      html += '<div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;border-bottom:1px solid #E5E5E5;cursor:pointer;" onclick="cmsEditImage(' + idx + ')">' +
        '<img src="' + src + '" style="width:60px;height:40px;object-fit:contain;background:#F5F5F5;" alt="">' +
        '<div style="flex:1;min-width:0;">' +
          '<p style="font-size:0.85rem;font-weight:600;">' + alt + '</p>' +
          '<p style="font-size:0.65rem;color:#999;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + src.substring(0, 60) + '...</p>' +
        '</div>' +
        '<span style="color:#E94E1B;font-size:0.8rem;font-weight:700;">Trocar</span>' +
      '</div>';
      count++;
    });
    showModal(html);
  };

  window.cmsEditImage = function(idx) {
    var img = document.querySelectorAll('img')[idx];
    if (!img) return;
    var currentSrc = img.getAttribute('src');
    showModal(
      '<h3>Trocar Imagem</h3>' +
      '<img src="' + currentSrc + '" style="max-width:100%;max-height:200px;object-fit:contain;background:#F5F5F5;margin-bottom:1rem;" alt="">' +
      '<label>Nova URL da imagem:</label>' +
      '<input type="text" id="cms-new-img-url" value="" placeholder="https://...">' +
      '<label>Ou selecione um arquivo local:</label>' +
      '<input type="file" id="cms-new-img-file" accept="image/*" onchange="cmsPreviewFile(this)">' +
      '<div id="cms-img-preview" style="margin:1rem 0;"></div>' +
      '<p style="font-size:0.75rem;color:#999;">Nota: arquivos locais ficam salvos apenas neste navegador. Para uso permanente, hospede a imagem e use a URL.</p>' +
      '<div class="btn-row">' +
        '<button class="secondary" style="background:#E5E5E5;color:#333;" onclick="cmsShowImages()">Voltar</button>' +
        '<button onclick="cmsSaveImage(' + idx + ')">Salvar</button>' +
      '</div>'
    );
  };

  window.cmsPreviewFile = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('cms-img-preview').innerHTML =
          '<img src="' + e.target.result + '" style="max-width:100%;max-height:150px;object-fit:contain;">';
        document.getElementById('cms-new-img-url').value = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  window.cmsSaveImage = function(idx) {
    var newUrl = document.getElementById('cms-new-img-url').value;
    if (!newUrl) { alert('Informe uma URL ou selecione um arquivo.'); return; }
    var img = document.querySelectorAll('img')[idx];
    var originalSrc = img.getAttribute('data-original-src') || img.getAttribute('src');
    if (!img.getAttribute('data-original-src')) {
      img.setAttribute('data-original-src', originalSrc);
    }
    img.setAttribute('src', newUrl);
    var data = loadData();
    if (!data._images) data._images = {};
    data._images[originalSrc] = newUrl;
    saveData(data);
    window.hideModal();
    showNotification('Imagem atualizada!');
  };

  window.cmsExport = function() {
    var data = loadData();
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'theideias-cms-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Backup exportado!');
  };

  window.cmsImport = function() {
    showModal(
      '<h3>Importar Dados</h3>' +
      '<p style="font-size:0.85rem;color:#777;margin-bottom:1rem;">Selecione um arquivo JSON de backup.</p>' +
      '<input type="file" id="cms-import-file" accept=".json">' +
      '<div class="btn-row">' +
        '<button class="secondary" style="background:#E5E5E5;color:#333;" onclick="hideModal()">Cancelar</button>' +
        '<button onclick="cmsDoImport()">Importar</button>' +
      '</div>'
    );
  };

  window.cmsDoImport = function() {
    var input = document.getElementById('cms-import-file');
    if (!input.files || !input.files[0]) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        saveData(data);
        applySavedContent();
        window.hideModal();
        showNotification('Dados importados! Recarregue a pagina.');
      } catch(err) {
        alert('Arquivo invalido.');
      }
    };
    reader.readAsText(input.files[0]);
  };

  window.cmsReset = function() {
    if (confirm('Tem certeza? Isso vai apagar todas as edicoes e voltar ao conteudo original.')) {
      localStorage.removeItem(CMS_KEY);
      location.reload();
    }
  };

  function showNotification(msg) {
    var n = document.createElement('div');
    n.style.cssText = 'position:fixed;top:80px;right:20px;background:#6BA92F;color:white;padding:0.75rem 1.5rem;font-size:0.85rem;font-weight:700;z-index:10001;border-radius:2px;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(function() {
      n.style.transition = 'opacity 0.3s';
      n.style.opacity = '0';
      setTimeout(function() { n.remove(); }, 300);
    }, 2500);
  }

  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      if (isActive) { window.cmsDeactivate(); }
      else { window.cmsActivate(); }
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    createAdminBar();
    createModal();
    applySavedContent();
  });

})();
