function initContact(){
  const link=$("contactEmail");
  if(link && typeof CONTACT_EMAIL!=="undefined"){
    link.href=`mailto:${CONTACT_EMAIL}`;
    link.textContent=`${CONTACT_EMAIL} →`;
  }
}
const $ = id => document.getElementById(id);
const state = {page:1, perPage:6, saved:new Set(JSON.parse(localStorage.getItem("autobridgeSaved")||"[]"))};

function money(n){return new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n)}
function populateFilters(){
  const makes=[...new Set(CARS.map(c=>c.make))].sort();
  $("make").innerHTML='<option value="">All makes</option>'+makes.map(x=>`<option>${x}</option>`).join("");
  $("make").addEventListener("change",()=>{const m=$("make").value; const models=[...new Set(CARS.filter(c=>!m||c.make===m).map(c=>c.model))].sort(); $("model").innerHTML='<option value="">All models</option>'+models.map(x=>`<option>${x}</option>`).join("");});
}
function vals(selector){return [...document.querySelectorAll(selector+":checked")].map(x=>x.value)}
function filtered(){
  const q=($("keyword")?.value||"").toLowerCase().trim(), make=$("make")?.value||"", model=$("model")?.value||"";
  const minP=+$("minPrice")?.value||0,maxP=+$("maxPrice")?.value||Infinity,minY=+$("minYear")?.value||0,maxY=+$("maxYear")?.value||Infinity,minM=+$("minMileage")?.value||0,maxM=+$("maxMileage")?.value||Infinity;
  const fuels=vals("#fuelOptions input"), bodies=vals("#bodyOptions input"), trans=document.querySelector('input[name="transmission"]:checked')?.value||"";
  const warranty=$("warranty")?.checked, owner=$("oneOwner")?.checked, service=$("service")?.checked, camera=$("camera")?.checked;
  return CARS.filter(c=>
    (!q||`${c.make} ${c.model} ${c.variant} ${c.registration} ${c.power}`.toLowerCase().includes(q)) &&
    (!make||c.make===make)&&(!model||c.model===model)&&c.price>=minP&&c.price<=maxP&&c.year>=minY&&c.year<=maxY&&c.mileage>=minM&&c.mileage<=maxM&&(!fuels.length||fuels.includes(c.fuel))&&(!bodies.length||bodies.includes(c.body))&&(!trans||c.transmission===trans)&&(!warranty||c.features.includes("Warranty"))&&(!owner||c.features.includes("1 owner"))&&(!service||c.features.includes("Full history"))&&(!camera||c.features.includes("Rear camera"))
  );
}
function sortCars(arr){const s=$("sort")?.value; return [...arr].sort((a,b)=>s==="price-low"?a.price-b.price:s==="price-high"?b.price-a.price:s==="newest"?b.year-a.year:s==="mileage"?a.mileage-b.mileage:(a.id-b.id))}
function render(){
  if(!$("carList"))return;
  const list=sortCars(filtered()), pages=Math.max(1,Math.ceil(list.length/state.perPage)); state.page=Math.min(state.page,pages);
  $("resultCount").textContent=list.length;
  const slice=list.slice((state.page-1)*state.perPage,state.page*state.perPage);
  $("carList").innerHTML=slice.map(card).join("");
  $("pagination").innerHTML=`<button class="page-btn" ${state.page===1?"disabled":""} data-page="${state.page-1}">‹</button>`+Array.from({length:pages},(_,i)=>`<button class="page-btn ${i+1===state.page?"active":""}" data-page="${i+1}">${i+1}</button>`).join("")+`<button class="page-btn" ${state.page===pages?"disabled":""} data-page="${state.page+1}">›</button>`;
  document.querySelectorAll(".page-btn").forEach(b=>b.onclick=()=>{state.page=+b.dataset.page;render();window.scrollTo({top:$("catalogue").offsetTop-85,behavior:"smooth"})});
  document.querySelectorAll(".heart").forEach(b=>b.onclick=()=>{const id=+b.dataset.id;state.saved.has(id)?state.saved.delete(id):state.saved.add(id);localStorage.setItem("autobridgeSaved",JSON.stringify([...state.saved]));render()});
  renderChips();
}
function card(c){const first=(c.images&&c.images.length?c.images[0]:c.image);return `<article class="car-card"><div class="car-image"><img src="${first}" alt="${c.make} ${c.model}" loading="lazy" onerror="this.onerror=null;this.src='assets/car-placeholder.svg'"><span class="tag">${c.tag}</span><button class="heart ${state.saved.has(c.id)?"saved":""}" data-id="${c.id}" aria-label="Save ${c.make} ${c.model}">${state.saved.has(c.id)?"♥":"♡"}</button></div><div class="car-body"><div class="car-kicker">${c.make} · ${c.body}</div><h3 class="car-name">${c.model}</h3><div class="car-variant">${c.variant}</div><div class="specs"><span>${c.registration || (c.year ? c.year : "—")}</span><span>${c.mileageLabel || (c.mileage ? c.mileage.toLocaleString("de-DE")+" km" : "—")}</span><span>${c.fuel}</span><span>${c.transmission}</span><span>${c.power}</span></div><div class="feature-row">${c.features.map(f=>`<span class="feature">${f}</span>`).join("")}</div><div class="price-row"><div><span class="price">${money(c.price)}</span><span class="price-note">incl. VAT where applicable</span></div><a class="details-link" href="car.html?id=${c.id}">View vehicle →</a></div></div></article>`}
function renderChips(){if(!$("activeFilters"))return;const labels=[];if($("make")?.value)labels.push($("make").value);if($("model")?.value)labels.push($("model").value);if($("minPrice")?.value)labels.push("From "+money(+$("minPrice").value));if($("maxPrice")?.value)labels.push("Up to "+money(+$("maxPrice").value));vals("#fuelOptions input").forEach(x=>labels.push(x));vals("#bodyOptions input").forEach(x=>labels.push(x));$("activeFilters").innerHTML=labels.map(x=>`<span class="filter-chip">${x}</span>`).join("")}
function reset(){document.querySelectorAll("#filterPanel input").forEach(i=>{if(i.type==="checkbox"||i.type==="radio")i.checked=false;else i.value=""});$("make").value="";$("model").innerHTML='<option value="">All models</option>';$("keyword").value="";state.page=1;render()}
function initCatalogue(){
  populateFilters();render();
  ["make","model","minPrice","maxPrice","minYear","maxYear","minMileage","maxMileage","sort","warranty","oneOwner","service","camera"].forEach(id=>$(id)?.addEventListener("change",()=>{state.page=1;render()}));
  document.querySelectorAll("#fuelOptions input,#bodyOptions input,input[name='transmission']").forEach(i=>i.addEventListener("change",()=>{state.page=1;render()}));
  $("keyword")?.addEventListener("input",()=>{state.page=1;render()}); $("heroSearch")?.addEventListener("click",()=>{$("catalogue").scrollIntoView({behavior:"smooth"})});
  $("resetFilters")?.addEventListener("click",reset); $("applyFilters")?.addEventListener("click",()=>closeFilters());
  $("mobileFilterBtn")?.addEventListener("click",openFilters); $("closeFilters")?.addEventListener("click",closeFilters); $("overlay")?.addEventListener("click",closeFilters);
}
function openFilters(){$("filterPanel").classList.add("open");$("overlay").classList.add("open")}
function closeFilters(){$("filterPanel").classList.remove("open");$("overlay").classList.remove("open")}

function renderVehicle(){
  const id=+(new URLSearchParams(location.search).get("id")||1),c=CARS.find(x=>x.id===id)||CARS[0];
  document.title=`${c.make} ${c.model} ${c.variant} | AutoBridge`;
  const images=(c.images&&c.images.length?c.images:[c.image]);
  const thumbs=images.map((src,i)=>`<button class="gallery-thumb ${i===0?"active":""}" data-index="${i}" aria-label="Show photo ${i+1}"><img src="${src}" alt="${c.make} ${c.model} photo ${i+1}" loading="lazy" onerror="this.onerror=null;this.src='assets/car-placeholder.svg'"></button>`).join("");
  $("vehicleDetail").innerHTML=`<section class="vehicle-hero"><a class="back-link" href="index.html#catalogue">← Back to vehicles</a><div class="vehicle-grid"><div class="gallery"><div class="gallery-main"><button class="gallery-arrow gallery-prev" aria-label="Previous photo">‹</button><img id="galleryMainImage" src="${images[0]}" alt="${c.make} ${c.model}" onerror="this.onerror=null;this.src='assets/car-placeholder.svg'"><button class="gallery-arrow gallery-next" aria-label="Next photo">›</button></div><div class="gallery-count">${images.length} photo${images.length===1?"":"s"}</div><div class="gallery-thumbs">${thumbs}</div></div><div class="vehicle-info"><p class="eyebrow">${c.tag}</p><h1>${c.make} ${c.model}</h1><p class="variant">${c.variant}</p><p class="vehicle-price">${money(c.price)}</p><div class="detail-spec-grid"><div><span>First registration</span><strong>${c.registration || "—"}</strong></div><div><span>Mileage</span><strong>${c.mileageLabel || "—"}</strong></div><div><span>Fuel</span><strong>${c.fuel}</strong></div><div><span>Transmission</span><strong>${c.transmission}</strong></div><div><span>Power</span><strong>${c.power}</strong></div><div><span>Body</span><strong>${c.body}</strong></div><div><span>Inventory price</span><strong>${money(c.price)}</strong></div><div><span>Final price</span><strong>${money(c.finalPrice)}</strong></div></div><div class="enquiry"><h3>Interested in this vehicle?</h3><p>Send us an enquiry and an AutoBridge specialist will get back to you.</p><a class="primary-btn" style="display:grid;place-items:center" href="mailto:${CONTACT_EMAIL}?subject=Enquiry%20${encodeURIComponent(c.make+" "+c.model)}">Enquire about this car</a></div></div></div></section>`;
  let current=0;
  const main=$("galleryMainImage");
  const show=(i)=>{current=(i+images.length)%images.length;main.src=images[current];document.querySelectorAll(".gallery-thumb").forEach((b,n)=>b.classList.toggle("active",n===current));};
  document.querySelectorAll(".gallery-thumb").forEach(b=>b.onclick=()=>show(+b.dataset.index));
  $("vehicleDetail").querySelector(".gallery-prev").onclick=()=>show(current-1);
  $("vehicleDetail").querySelector(".gallery-next").onclick=()=>show(current+1);
}

initContact();
if(document.body.contains(document.getElementById("carList")))initCatalogue();
if(document.body.contains(document.getElementById("vehicleDetail")))renderVehicle();
