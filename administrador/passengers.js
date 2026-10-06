const renderExpandedPassengers=renderAdminPassengers;
renderAdminPassengers=function(){
 renderExpandedPassengers();
 const table=app.querySelector('.admin-panel table');if(!table)return;
 const labels=[...table.querySelectorAll('th')].map(e=>e.textContent);
 const list=document.createElement('div');list.className='passenger-list';
 table.querySelectorAll('tbody tr').forEach(row=>{
  const cells=[...row.children];if(cells.length<2){list.append(row.querySelector('td'));return}
  const detail=document.createElement('details');detail.className='passenger-item';
  const summary=document.createElement('summary');const name=document.createElement('span');name.textContent=cells[0].querySelector('strong').textContent;summary.append(name);summary.insertAdjacentHTML('beforeend','<span class="passenger-chevron" aria-hidden="true"></span>');detail.append(summary);
  const content=document.createElement('div');content.className='passenger-content';
  cells.forEach((cell,i)=>{if(!i)return;const field=document.createElement('div');field.className='passenger-field';const label=document.createElement('span');label.className='passenger-label';label.textContent=labels[i];const value=document.createElement('div');while(cell.firstChild)value.append(cell.firstChild);field.append(label,value);content.append(field)});
  detail.append(content);list.append(detail);
  detail.addEventListener('toggle',()=>{if(detail.open)list.querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false})});
 });
 table.closest('.table-scroll').replaceWith(list);
};
if(adminTab==='passageiros')renderAdminPassengers();
