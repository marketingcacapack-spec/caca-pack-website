/* Public product catalog: reads published product rows from Supabase. */
(() => {
  const grid = document.getElementById('productGrid');
  if (!grid || !window.supabase || !window.CACA_SUPABASE_URL || window.CACA_SUPABASE_URL.includes('PASTE_')) return;
  const client = window.supabase.createClient(window.CACA_SUPABASE_URL, window.CACA_SUPABASE_ANON_KEY);
  const escapeText = value => String(value ?? '');
  async function loadCatalog() {
    const { data, error } = await client.from('products').select('id,title,description,image_url,sort_order').order('sort_order',{ascending:true}).order('created_at',{ascending:false});
    if (error) { console.warn('CACA PACK catalog:', error.message); return; }
    if (!data || data.length === 0) return; // keep the designed sample cards until products are added in admin
    grid.replaceChildren();
    data.forEach(product => {
      const card=document.createElement('a'); card.className='product-card'; card.href='products.html';
      const photo=document.createElement('div'); photo.className='product-photo';
      const img=document.createElement('img'); img.src=product.image_url; img.alt=escapeText(product.title); img.loading='lazy'; photo.append(img);
      const arrow=document.createElement('span'); arrow.className='product-arrow'; arrow.textContent='↗'; photo.append(arrow);
      const info=document.createElement('div'); info.className='product-info';
      const title=document.createElement('h3'); title.textContent=escapeText(product.title);
      const desc=document.createElement('p'); desc.textContent=escapeText(product.description);
      info.append(title,desc); card.append(photo,info); grid.append(card);
    });
  }
  loadCatalog();
})();