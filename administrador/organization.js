// Local dashboard hierarchy: overview first, dedicated management screens second.
const previousOrganizedRender=renderAdmin;
renderAdmin=function(){
 previousOrganizedRender();
 const sidebar=app.querySelector('.admin-sidebar');
 sidebar.querySelector('[data-admin=crm]')?.remove();

 sidebar.querySelectorAll('[data-admin]').forEach(b=>b.setAttribute('aria-current',adminTab===b.dataset.admin?'page':'false'));
 sidebar.querySelector('p').textContent='Gestão';
 const overviewButton=document.createElement('button');overviewButton.type='button';overviewButton.dataset.admin='resumo';overviewButton.className=adminTab==='resumo'?'active':'';overviewButton.innerHTML=icon('grid')+'Visão geral';overviewButton.setAttribute('aria-current',adminTab==='resumo'?'page':'false');overviewButton.onclick=()=>{adminTab='resumo';renderAdmin()};sidebar.insertBefore(overviewButton,sidebar.querySelector('[data-admin]'));
 if(adminTab==='crm')return;
 const heading=app.querySelector('.page-heading'),stats=app.querySelector('.stats'),pending=app.querySelector('.pending-grid');
 const names={resumo:['Visão geral','O que precisa da sua atenção e como estão as próximas saídas.'],viagens:['Minhas viagens','Cadastre, edite e acompanhe a ocupação de cada saída.'],passageiros:['Reservas e passageiros','Consulte os dados, os pontos de embarque e as reservas.'],financeiro:['Financeiro','Acompanhe os recebimentos, saldos e estornos.']};
 const [title,subtitle]=names[adminTab]||names.resumo;heading.querySelector('h1').textContent=title;heading.querySelector('p').textContent=subtitle;
 heading.querySelector('.eyebrow').textContent='Painel do organizador';
 if(adminTab!=='resumo'){
  pending?.remove();
  if(adminTab==='viagens'){stats.querySelectorAll('.stat').forEach((s,i)=>{if(i>1)s.remove()})}
  if(adminTab==='passageiros'){stats.remove()}
  if(adminTab==='financeiro'){stats.querySelectorAll('.stat').forEach((s,i)=>{if(i<2)s.remove()})}
  return;
 }
 const active=allPassengers().filter(p=>p.status!=='Cancelada'),upcoming=trips.filter(t=>!t.cancelled&&t.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
 heading.insertAdjacentHTML('beforeend','<button class="button" id="overview-new">'+icon('plus')+'Nova viagem</button>');document.getElementById('overview-new').onclick=openNewTrip;
 stats.querySelectorAll('.stat small').forEach(s=>s.remove());
 stats.querySelector('.stat:nth-child(3) .stat-label').innerHTML='Recebido '+icon('wallet');stats.querySelector('.stat:nth-child(4) .stat-label').innerHTML='A receber '+icon('ticket');
 const container=document.getElementById('admin-content');container.innerHTML=`<div class="overview-layout"><section class="overview-next"><div class="overview-panel-heading"><div><h2>Próximas saídas</h2><p>As quatro viagens mais próximas.</p></div><button class="table-action" data-overview-go="viagens">Ver todas ↗</button></div>${upcoming.map(t=>{const available=vacancies(t),percent=Math.round((t.capacity-available)/t.capacity*100);return `<div class="overview-departure"><img src="${t.image}" alt=""><div><h3>${esc(t.name)}</h3><p>${esc(t.dateLabel)} · saída ${esc(t.time)}</p><div class="overview-capacity"><div class="track"><i style="width:${percent}%"></i></div><span>${percent}% ocupado</span></div></div><span class="overview-seats ${available<=5?'is-low':''}"><b>${available}</b> vagas livres</span></div>`}).join('')||'<p class="overview-empty">Nenhuma viagem próxima nesta amostra.</p>'}</section><aside class="overview-attention"><div class="overview-panel-heading"><div><h2>Precisa de atenção</h2><p>Confira as pendências da operação.</p></div></div><div id="overview-pending"></div></aside></div><section class="overview-shortcuts"><h2>Acesso rápido</h2><div>${[['passageiros','users','Gerenciar reservas','Corrigir dados e acompanhar passageiros'],['financeiro','wallet','Conferir pagamentos','Sinais, parcelas e valores pendentes']].map(([id,ico,label,desc])=>`<button data-overview-go="${id}">${icon(ico)}<span><b>${label}</b><small>${desc}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div></section><p class="overview-demo-note">Resumo com dados fictícios. Alterações ficam apenas nesta sessão.</p>`;
 pending.classList.add('overview-pending-list');container.querySelector('#overview-pending').append(pending);
 pending.querySelectorAll('button').forEach((button,i)=>{button.classList.add('attention-row');if(i===0&&Number(button.querySelector('b').textContent)>0)button.classList.add('attention-urgent');if(Number(button.querySelector('b').textContent)===0)button.classList.add('attention-clear')});
 container.querySelectorAll('[data-overview-go]').forEach(b=>b.onclick=()=>{adminTab=b.dataset.overviewGo;renderAdmin()});
};
adminTab='resumo';renderAdmin();
