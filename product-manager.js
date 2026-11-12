/* CACA PACK product uploader. Data is saved in this browser's IndexedDB.
   GitHub Pages is static hosting; this does not publish new products globally. */
(() => {
  const grid=document.getElementById("productGrid"),openButton=document.getElementById("openProductForm"),dialog=document.getElementById("productDialog"),form=document.getElementById("productForm");
  if(!grid||!openButton||!dialog||!form)return;
  const imageInput=document.getElementById("productImage"),preview=document.getElementById("productPreview"),placeholder=document.getElementById("uploadPlaceholder"),titleInput=document.getElementById("productTitle"),descriptionInput=document.getElementById("productDescription"),feedback=document.getElementById("productFormFeedback");
  const DB="cacaPackProductCatalog",STORE="uploadedProducts";let chosenFile=null,previewUrl=null,dbPromise;
  function dbOpen(){if(!("indexedDB"in window))return Promise.reject(Error("IndexedDB unavailable"));if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:"id"});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return dbPromise;}
  async function store(mode,action,value){const db=await dbOpen();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,mode).objectStore(STORE)[action](value);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function getAll(){return await store("readonly","getAll");}
  async function save(item){await store("readwrite","put",item);}
  async function remove(id){await store("readwrite","delete",id);}
  function createCard(item){
    const card=document.createElement("article");card.className="product-card user-added";
    const photo=document.createElement("div");photo.className="product-photo";
    const img=document.createElement("img"),url=URL.createObjectURL(item.image);img.src=url;img.alt=item.title;img.loading="lazy";img.addEventListener("load",()=>URL.revokeObjectURL(url),{once:true});photo.append(img);
    const del=document.createElement("button");del.type="button";del.className="remove-user-product";del.textContent="×";del.title="Delete product";del.setAttribute("aria-label","Delete "+item.title);
    del.addEventListener("click",async()=>{if(!confirm('Delete "'+item.title+'" from this browser?'))return;try{await remove(item.id);card.remove();}catch(e){alert("Could not delete this product.");}});photo.append(del);
    const info=document.createElement("div");info.className="product-info";const h=document.createElement("h3"),p=document.createElement("p");h.textContent=item.title;p.textContent=item.description;info.append(h,p);card.append(photo,info);return card;
  }
  async function render(){try{const items=await getAll();items.sort((a,b)=>a.createdAt-b.createdAt);items.forEach(item=>grid.append(createCard(item)));}catch(e){console.error(e);feedback.textContent="Browser storage is unavailable. Please try a current browser.";}}
  function reset(){form.reset();chosenFile=null;feedback.textContent="";preview.hidden=true;preview.removeAttribute("src");placeholder.hidden=false;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;}
  openButton.addEventListener("click",()=>{reset();dialog.showModal();});
  ["closeProductForm","cancelProductForm"].forEach(id=>document.getElementById(id).addEventListener("click",()=>dialog.close()));
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener("close",reset);
  imageInput.addEventListener("change",()=>{const file=imageInput.files&&imageInput.files[0];feedback.textContent="";if(!file)return;if(!["image/jpeg","image/png","image/webp"].includes(file.type)){imageInput.value="";chosenFile=null;feedback.textContent="Use JPG, PNG, or WEBP image.";return;}if(file.size>5*1024*1024){imageInput.value="";chosenFile=null;feedback.textContent="Maximum image size is 5 MB.";return;}chosenFile=file;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(file);preview.src=previewUrl;preview.hidden=false;placeholder.hidden=true;});
  form.addEventListener("submit",async e=>{e.preventDefault();const title=titleInput.value.trim(),description=descriptionInput.value.trim();if(!chosenFile||!title||!description){feedback.textContent="Please add an image, title, and description.";return;}const submit=form.querySelector('[type="submit"]');submit.disabled=true;submit.textContent="Saving...";try{const item={id:"product-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),title,description,image:chosenFile,createdAt:Date.now()};await save(item);grid.append(createCard(item));dialog.close();reset();}catch(err){console.error(err);feedback.textContent="Could not save. Try a smaller image."; }finally{submit.disabled=false;submit.innerHTML='Save Product <span>→</span>'; }});
  render();
})();