const DEFAULT_DOGS = [
  {id:1,name:'Thor',breed:'Golden Retriever',age:'8 meses',sex:'Macho',price:'R$ 3.500',status:'Disponível',size:'Grande',coat:'Dourada',image:'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',desc:'Carinhoso, equilibrado e muito sociável. Adora companhia e brincadeiras ao ar livre.'},
  {id:2,name:'Luna',breed:'Labrador Retriever',age:'6 meses',sex:'Fêmea',price:'R$ 3.200',status:'Disponível',size:'Grande',coat:'Caramelo',image:'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85',desc:'Curiosa, inteligente e muito apegada às pessoas. Ótimo perfil para famílias ativas.'},
  {id:3,name:'Mel',breed:'Spitz Alemão',age:'5 meses',sex:'Fêmea',price:'R$ 4.000',status:'Reservado',size:'Pequeno',coat:'Creme',image:'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85',desc:'Pequena, alerta e cheia de personalidade. Gosta de atenção e aprende rápido.'},
  {id:4,name:'Max',breed:'Golden Retriever',age:'1 ano',sex:'Macho',price:'R$ 3.800',status:'Vendido',size:'Grande',coat:'Dourada',image:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',desc:'Calmo, obediente e muito companheiro. Já encontrou sua nova família.'},
  {id:5,name:'Nina',breed:'Labrador Retriever',age:'7 meses',sex:'Fêmea',price:'R$ 3.300',status:'Disponível',size:'Grande',coat:'Chocolate',image:'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=85',desc:'Esperta, brincalhona e com bastante energia. Gosta de explorar e interagir.'},
  {id:6,name:'Luke',breed:'Spitz Alemão',age:'4 meses',sex:'Macho',price:'R$ 4.200',status:'Disponível',size:'Pequeno',coat:'Laranja',image:'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=85',desc:'Alegre, ativo e muito sociável. Um cão pequeno com bastante presença.'}
];

const DEFAULT_INQUIRIES=[
  {name:'Mariana Alves',dog:'Thor',time:'Hoje, 14:32',initials:'MA',msg:'Gostaria de saber mais sobre disponibilidade.'},
  {name:'Rafael Costa',dog:'Luna',time:'Hoje, 11:08',initials:'RC',msg:'Perguntou sobre adaptação com crianças.'},
  {name:'Camila Nunes',dog:'Luke',time:'Ontem, 18:47',initials:'CN',msg:'Solicitou informações sobre o filhote.'},
  {name:'André Lima',dog:'Nina',time:'Ontem, 10:15',initials:'AL',msg:'Quer agendar uma conversa com a equipe.'}
];


const WHATSAPP_NUMBER = '';

let dogs = loadDogs();
let activities = JSON.parse(localStorage.getItem('soFilhotesActivities') || '[]');
let activeBreed='Todos';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function loadDogs(){try{return JSON.parse(localStorage.getItem('soFilhotesDogs')) || structuredClone(DEFAULT_DOGS)}catch{return structuredClone(DEFAULT_DOGS)}}
function saveDogs(){localStorage.setItem('soFilhotesDogs',JSON.stringify(dogs))}
function safe(v=''){return String(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]))}
function slugStatus(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function toast(title,text){$('#toastTitle').textContent=title;$('#toastText').textContent=text;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2600)}
function addActivity(text,icon='✓'){activities.unshift({text,time:'Agora',icon});activities=activities.slice(0,6);localStorage.setItem('soFilhotesActivities',JSON.stringify(activities))}
function whatsappUrl(message){const number=WHATSAPP_NUMBER.replace(/\D/g,'');return `https://wa.me/${number}?text=${encodeURIComponent(message)}`}
function openModal(id){$('#'+id).classList.add('open');$('#'+id).setAttribute('aria-hidden','false')}
function closeModal(id){$('#'+id).classList.remove('open');$('#'+id).setAttribute('aria-hidden','true')}

function renderBreedFilters(){
  const breeds=['Todos',...new Set(dogs.map(d=>d.breed))];
  $('#breedFilters').innerHTML=breeds.map(b=>`<button class="filter-chip ${activeBreed===b?'active':''}" data-breed="${safe(b)}">${safe(b)}</button>`).join('');
  $$('#breedFilters [data-breed]').forEach(btn=>btn.onclick=()=>{activeBreed=btn.dataset.breed;renderBreedFilters();renderCatalog()});
}
function renderCatalog(){
  const q=$('#searchInput').value.trim().toLowerCase(), sex=$('#sexFilter').value;
  const list=dogs.filter(d=>(activeBreed==='Todos'||d.breed===activeBreed)&&(sex==='Todos'||d.sex===sex)&&(`${d.name} ${d.breed}`.toLowerCase().includes(q)));
  $('#availableCountPublic').textContent=dogs.filter(d=>d.status==='Disponível').length;
  $('#dogGrid').innerHTML=list.map(d=>`
    <article class="dog-card">
      <div class="dog-photo"><img src="${safe(d.image||DEFAULT_DOGS[0].image)}" alt="${safe(d.name)}" loading="lazy"><span class="dog-status ${slugStatus(d.status)}">${safe(d.status)}</span><button class="favorite-btn" aria-label="Favoritar">♡</button></div>
      <div class="dog-content"><div class="dog-head"><div><h3>${safe(d.name)}</h3><div class="dog-breed">${safe(d.breed)}</div></div><b>${safe(d.price)}</b></div>
      <div class="dog-meta"><span>${safe(d.sex)}</span><span>${safe(d.age)}</span><span>${safe(d.size)}</span></div>
      <div class="dog-desc">${safe(d.desc)}</div>
      <div class="dog-card-actions"><button class="detail-btn" onclick="showDetails(${d.id})">Ver detalhes</button><button class="whatsapp-btn" ${d.status==='Vendido'?'disabled':''} onclick="contactDog(${d.id})">Tenho interesse</button></div></div>
    </article>`).join('');
  $('#emptyState').classList.toggle('hidden',list.length>0);
}

window.showDetails=function(id){const d=dogs.find(x=>x.id===id);if(!d)return;$('#detailContent').innerHTML=`<div class="detail-layout"><div class="detail-photo"><img src="${safe(d.image)}" alt="${safe(d.name)}"></div><div class="detail-info"><span class="dog-status ${slugStatus(d.status)}" style="position:static;display:inline-block;background:#f3f5f2">${safe(d.status)}</span><h2>${safe(d.name)}</h2><div class="dog-breed">${safe(d.breed)}</div><div class="detail-price">${safe(d.price)}</div><p class="detail-description">${safe(d.desc)}</p><div class="detail-facts"><div><small>Sexo</small><b>${safe(d.sex)}</b></div><div><small>Idade</small><b>${safe(d.age)}</b></div><div><small>Porte</small><b>${safe(d.size)}</b></div><div><small>Pelagem</small><b>${safe(d.coat||'—')}</b></div></div><div class="health-note"><b>Importante:</b> este protótipo apresenta o animal em formato de catálogo. Informações sanitárias, documentação e condições de entrega devem ser confirmadas diretamente com o responsável.</div><div class="detail-actions"><button class="secondary-btn" onclick="closeModal('detailModal')">Continuar vendo</button><button class="primary-btn" ${d.status==='Vendido'?'disabled':''} onclick="contactDog(${d.id})">Tenho interesse ↗</button></div></div></div>`;openModal('detailModal')}

window.contactDog=function(id){const d=dogs.find(x=>x.id===id);if(!d)return;window.open(whatsappUrl(`Olá! Vi ${d.name}, da raça ${d.breed}, no site da Só Filhotes e gostaria de saber mais informações.`),'_blank','noopener,noreferrer')}
$$('[data-whatsapp-general]').forEach(b=>b.onclick=()=>window.open(whatsappUrl('Olá! Encontrei a Só Filhotes pelo site e gostaria de conhecer os filhotes disponíveis.'),'_blank','noopener,noreferrer'));

function adminStats(){const available=dogs.filter(d=>d.status==='Disponível').length,reserved=dogs.filter(d=>d.status==='Reservado').length,sold=dogs.filter(d=>d.status==='Vendido').length;$('#adminStats').innerHTML=`
<div class="admin-stat"><div class="admin-stat-top"><span>Total cadastrados</span><i class="stat-icon">□</i></div><b>${dogs.length}</b><small>registros no catálogo</small></div>
<div class="admin-stat"><div class="admin-stat-top"><span>Disponíveis</span><i class="stat-icon">✓</i></div><b>${available}</b><small>visíveis para interesse</small></div>
<div class="admin-stat"><div class="admin-stat-top"><span>Reservados</span><i class="stat-icon">◌</i></div><b>${reserved}</b><small>aguardando conclusão</small></div>
<div class="admin-stat"><div class="admin-stat-top"><span>Vendidos</span><i class="stat-icon">↗</i></div><b>${sold}</b><small>histórico do estoque</small></div>`;
 const max=Math.max(dogs.length,1);$('#stockBars').innerHTML=[['Disponível',available],['Reservado',reserved],['Vendido',sold]].map(([s,n])=>`<div class="stock-row"><div class="stock-row-head"><span>${s}</span><b>${n}</b></div><div class="stock-track"><i style="width:${n/max*100}%"></i></div></div>`).join('')
}
function renderActivity(){let list=activities.length?activities:[{text:'Estoque carregado para demonstração',time:'Agora',icon:'□'},{text:'Catálogo público sincronizado',time:'Agora',icon:'↗'}];$('#activityList').innerHTML=list.map(a=>`<div class="activity"><div class="activity-icon">${safe(a.icon)}</div><div><b>${safe(a.text)}</b><small>${safe(a.time)}</small></div></div>`).join('')}
function renderDashboardTable(){$('#dashboardTable').innerHTML=dogs.slice(0,5).map(d=>`<div class="mini-row"><div class="mini-dog"><img src="${safe(d.image)}"><div><b>${safe(d.name)}</b><small>${safe(d.breed)}</small></div></div><span>${safe(d.age)}</span><span>${safe(d.price)}</span><span class="status-badge ${slugStatus(d.status)}">${safe(d.status)}</span></div>`).join('')}
function renderInventory(){const q=$('#adminSearch').value.toLowerCase(),st=$('#adminStatusFilter').value;const list=dogs.filter(d=>(st==='Todos'||d.status===st)&&(`${d.name} ${d.breed}`.toLowerCase().includes(q)));$('#inventoryBody').innerHTML=list.map(d=>`<tr><td><div class="inventory-animal"><img src="${safe(d.image)}"><div><b>${safe(d.name)}</b><small>ID #${d.id}</small></div></div></td><td>${safe(d.breed)}</td><td>${safe(d.sex)} · ${safe(d.age)}</td><td><b>${safe(d.price)}</b></td><td><select class="inline-status" onchange="changeStatus(${d.id},this.value)"><option ${d.status==='Disponível'?'selected':''}>Disponível</option><option ${d.status==='Reservado'?'selected':''}>Reservado</option><option ${d.status==='Vendido'?'selected':''}>Vendido</option></select></td><td><div class="row-actions"><button class="icon-btn" title="Editar" onclick="editDog(${d.id})">✎</button><button class="icon-btn danger" title="Excluir" onclick="deleteDog(${d.id})">×</button></div></td></tr>`).join('')}
function renderInquiries(){$('#inquiryList').innerHTML=DEFAULT_INQUIRIES.map(x=>`<div class="inquiry"><div class="inquiry-avatar">${x.initials}</div><div><h4>${x.name} · interesse em ${x.dog}</h4><p>${x.msg}</p><small>${x.time}</small></div></div>`).join('')}
function renderAdmin(){adminStats();renderActivity();renderDashboardTable();renderInventory();renderInquiries()}

window.changeStatus=function(id,status){const d=dogs.find(x=>x.id===id);if(!d)return;d.status=status;saveDogs();addActivity(`${d.name} alterado para ${status}`,'◌');refreshAll();toast('Status atualizado',`${d.name}: ${status}`)}
window.editDog=function(id){const d=dogs.find(x=>x.id===id);if(!d)return;$('#formTitle').textContent='Editar filhote';$('#dogId').value=d.id;$('#dogName').value=d.name;$('#dogBreed').value=d.breed;$('#dogSex').value=d.sex;$('#dogAge').value=d.age;$('#dogPrice').value=d.price;$('#dogStatus').value=d.status;$('#dogImage').value=d.image;$('#dogDesc').value=d.desc;$('#dogCoat').value=d.coat||'';$('#dogSize').value=d.size||'Médio';openModal('dogFormModal')}
window.deleteDog=function(id){const d=dogs.find(x=>x.id===id);if(!d||!confirm(`Excluir ${d.name} do estoque?`))return;dogs=dogs.filter(x=>x.id!==id);saveDogs();addActivity(`${d.name} removido do estoque`,'×');refreshAll();toast('Registro excluído',`${d.name} foi removido.`)}

$('#dogForm').onsubmit=e=>{e.preventDefault();const id=Number($('#dogId').value);const obj={id:id||Date.now(),name:$('#dogName').value.trim(),breed:$('#dogBreed').value.trim(),sex:$('#dogSex').value,age:$('#dogAge').value.trim(),price:$('#dogPrice').value.trim(),status:$('#dogStatus').value,image:$('#dogImage').value.trim()||DEFAULT_DOGS[0].image,desc:$('#dogDesc').value.trim()||'Sem descrição cadastrada.',coat:$('#dogCoat').value.trim()||'Não informado',size:$('#dogSize').value};if(id){dogs=dogs.map(d=>d.id===id?obj:d);addActivity(`${obj.name} teve o cadastro atualizado`,'✎')}else{dogs.unshift(obj);addActivity(`${obj.name} foi cadastrado no estoque`,'+')}saveDogs();closeModal('dogFormModal');refreshAll();toast('Cadastro salvo',`${obj.name} foi atualizado no catálogo.`)};
function openNewDog(){
 $('#dogForm').reset();$('#dogId').value='';$('#dogStatus').value='Disponível';$('#dogSize').value='Médio';$('#formTitle').textContent='Cadastrar filhote';openModal('dogFormModal')
}
$('#newDogBtn').onclick=openNewDog;
$('#resetDemoBtn').onclick=()=>{if(!confirm('Restaurar os dados originais da demonstração?'))return;dogs=structuredClone(DEFAULT_DOGS);activities=[];saveDogs();localStorage.removeItem('soFilhotesActivities');refreshAll();toast('Demonstração restaurada','Os dados originais voltaram.')};

function switchAdmin(view){$$('.admin-view').forEach(v=>v.classList.remove('active'));$$('.admin-nav').forEach(v=>v.classList.toggle('active',v.dataset.adminView===view));$('#view-'+view).classList.add('active');const titles={dashboard:'Visão geral',inventory:'Filhotes / Estoque',inquiries:'Interessados'};$('#adminTitle').textContent=titles[view];$('#adminBreadcrumb').textContent='Painel / '+titles[view]}
$$('.admin-nav').forEach(b=>b.onclick=()=>switchAdmin(b.dataset.adminView));$$('[data-go-inventory]').forEach(b=>b.onclick=()=>switchAdmin('inventory'));
function openAdmin(){renderAdmin();$('#adminShell').classList.add('open');$('#adminShell').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeAdmin(){$('#adminShell').classList.remove('open');$('#adminShell').setAttribute('aria-hidden','true');document.body.style.overflow=''}
$('#adminOpenBtn').onclick=openAdmin;$('#adminOpenMobile').onclick=()=>{openAdmin();$('#mobileNav').classList.remove('open')};$('#adminFooterBtn').onclick=openAdmin;$('#adminCloseBtn').onclick=closeAdmin;
$('#adminSearch').oninput=renderInventory;$('#adminStatusFilter').onchange=renderInventory;

$('#searchInput').oninput=renderCatalog;$('#sexFilter').onchange=renderCatalog;$('#menuBtn').onclick=()=>$('#mobileNav').classList.toggle('open');$$('.mobile-nav a').forEach(a=>a.onclick=()=>$('#mobileNav').classList.remove('open'));
$$('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id)}));
window.closeModal=closeModal;
function refreshAll(){renderBreedFilters();renderCatalog();renderAdmin()}
refreshAll();
